from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from supabase_config import supabase
from pydantic import BaseModel
import uuid
import os
import google.generativeai as genai
import requests
from dotenv import load_dotenv
from typing import List
import uvicorn

# Load environment variables
load_dotenv()

# Configure FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://denews-web3.netlify.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment variables.")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# Pinata headers
PINATA_HEADERS = {
    "pinata_api_key": os.getenv("PINATA_API_KEY"),
    "pinata_secret_api_key": os.getenv("PINATA_SECRET_API_KEY")
}

# ======= ROUTES =======

@app.post("/upload")
async def upload_article(request: Request):
    body = await request.json()
    article_content = body.get("article")
    article_title = body.get("article_title")

    if not article_content or not article_title:
        raise HTTPException(status_code=400, detail="Article content or title is missing.")

    payload = {
        "pinataMetadata": {"name": "DeNewsArticle"},
        "pinataContent": {"title": article_title, "text": article_content}
    }

    try:
        res = requests.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", json=payload, headers=PINATA_HEADERS)
        res.raise_for_status()
        cid = res.json()["IpfsHash"]
        return {"cid": cid, "message": "Article published successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/spam-report")
async def report_spam(request: Request):
    body = await request.json()
    spam_report = body.get("spam_report")

    if not spam_report:
        raise HTTPException(status_code=400, detail="Spam report content is missing.")

    payload = {
        "pinataMetadata": {"name": "SpamReport"},
        "pinataContent": {"spam_report": spam_report}
    }

    try:
        res = requests.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", json=payload, headers=PINATA_HEADERS)
        res.raise_for_status()
        cid = res.json()["IpfsHash"]
        return {"cid": cid, "message": "Spam reported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class PromptRequest(BaseModel):
    prompt: str


class GeminiResponse(BaseModel):
    response: str


@app.post("/ai-agent", response_model=GeminiResponse)
async def generate_response(request: PromptRequest):
    try:
        response = gemini_model.generate_content(request.prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-images")
async def upload_images(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    results = []

    for file in files:
        if not file.content_type.startswith('image/'):
            results.append({
                "filename": file.filename,
                "error": "Not an image file",
                "status": "failed"
            })
            continue

        try:
            file_content = await file.read()
            response = requests.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                files={"file": (file.filename, file_content, file.content_type)},
                headers=PINATA_HEADERS
            )
            response.raise_for_status()
            cid = response.json()["IpfsHash"]
            results.append({
                "filename": file.filename,
                "cid": cid,
                "ipfs_url": f"https://gateway.pinata.cloud/ipfs/{cid}",
                "status": "success"
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e),
                "status": "failed"
            })

    return {
        "message": f"Processed {len(files)} files",
        "results": results,
        "total_files": len(files),
        "successful_uploads": len([r for r in results if r["status"] == "success"]),
        "failed_uploads": len([r for r in results if r["status"] == "failed"])
    }


@app.post("/create-user/")
async def create_user(
    name: str = Form(...),
    email: str = Form(...),
    phno: str = Form(None),
    wallet_address: str = Form(None),
    photo: UploadFile = File(None),
):
    photo_url = None

    if photo:
        file_ext = photo.filename.split('.')[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        contents = await photo.read()

        supabase.storage.from_("user-photos").upload(file_name, contents)
        photo_url = supabase.storage.from_("user-photos").get_public_url(file_name)

    data = {
        "name": name,
        "email": email,
        "phno": phno,
        "wallet_address": wallet_address,
        "photo_url": photo_url
    }

    try:
        result = supabase.table("users").insert(data).execute()
        return {"message": "User created", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-user/")
async def get_user_by_wallet(wallet_address: str = Query(...)):
    try:
        response = supabase.table("users").select("*").eq("wallet_address", wallet_address).execute()
        if response.data and len(response.data) > 0:
            return {
                "isRegistered": True,
                "user": response.data[0]
            }
        return {
            "isRegistered": False,
            "user": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
