import React, { useState, useCallback, useContext, useEffect, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import useAxios from '../hooks/useAxios';
import appContext from '../context/appContext';
import { ethers } from 'ethers';
import axios from 'axios';
import { X } from "lucide-react";
import { createArticle, loginUser } from "../services/serviceWorker";

const Write = () => {
  const { api } = useAxios();
  const { State } = useContext(appContext);
  const { WalletAddress } = State;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });

  // Validation and submission state
  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Message state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Token/stake state
  // const [userStake, setUserStake] = useState('0');
  // const [minStake, setMinStake] = useState('1');

  // Image upload state
  const [uploadImages, setUploadImages] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Memoized values
  // const hasEnoughStake = useMemo(() => 
  //   parseFloat(userStake) >= parseFloat(minStake), 
  //   [userStake, minStake]
  // );

  const truncatedTitle = useMemo(() => 
    formData.title.length > 60 ? formData.title.substring(0, 60) : formData.title,
    [formData.title]
  );

  const wordCount = useMemo(() => 
    formData.content ? formData.content.trim().split(/\s+/).filter(word => word.length > 0).length : 0,
    [formData.content]
  );

  const refImages = useMemo(() => 
    uploadedImages.map(image => image.cid),
    [uploadedImages]
  );

  // Editor options memoized
  const editorOptions = useMemo(() => ({
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'preview',
      'side-by-side',
      'guide',
    ],
    spellChecker: false,
    status: false,
    autoSave: {
      enabled: true,
      delay: 1000,
      uniqueId: 'article-editor',
    },
  }), []);

  const fetchUserByWallet = async () => {
    try {
      setLoading(true);
      const response = await loginUser({ walletAddress: State.WalletAddress });
      if (response.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserByWallet();
  }, [State.WalletAddress]);

  // Check user's stake on component mount
  // useEffect(() => {
  //   const checkUserStake = async () => {
  //     if (WalletAddress && State.WriteContract) {
  //       try {
  //         const [stake, minStakeRequired] = await Promise.all([
  //           State.WriteContract.getStakeBalance(WalletAddress),
  //           State.WriteContract.MIN_STAKE()
  //         ]);
          
  //         setUserStake(ethers.utils.formatEther(stake));
  //         setMinStake(ethers.utils.formatEther(minStakeRequired));
  //       } catch (error) {
  //         console.error('Error checking stake:', error);
  //         setError('Failed to check stake balance');
  //       }
  //     }
  //   };
  //   checkUserStake();
  // }, [WalletAddress, State.WriteContract, State.ReadContract]);

  // Clear messages when form changes
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Validation function
  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (wordCount < 100) {
      newErrors.content = `Minimum 100 words required. Current: ${wordCount} words`;
    }

    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    } else if (formData.tags.length > 60) {
      newErrors.tags = 'Tags must be less than 60 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, wordCount]);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsVerified(false);
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleContentChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, content: value }));
    setIsVerified(false);
    
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  }, [errors.content]);

  const processTagsForContract = useCallback((tagsString) => {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }, []);

  // Image upload functions
  const handleImageCheckboxChange = useCallback((e) => {
    const checked = e.target.checked;
    setUploadImages(checked);
    
    if (checked) {
      setShowImageModal(true);
    } else {
      setSelectedImages([]);
      setUploadedImages([]);
    }
  }, []);

  const handleImageSelection = useCallback((e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setImageUploadError('');
  }, []);

  const handleImageUpload = useCallback(async () => {
    if (selectedImages.length === 0) {
      setImageUploadError('Please select at least one image.');
      return;
    }

    setUploadingImages(true);
    setImageUploadError('');

    try {
      const formDataForImages = new FormData();
      selectedImages.forEach(file => {
        formDataForImages.append('files', file);
      });

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload-images`, formDataForImages, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image upload response:', response.data);
      setUploadedImages(response.data.results || []);
      setSuccess('Images uploaded successfully!');
      setShowImageModal(false);
      setSelectedImages([]);
    } catch (error) {
      console.error('Image upload error:', error);
      setImageUploadError('Failed to upload images. Please try again.');
      setSelectedImages([]);
    } finally {
      setUploadingImages(false);
    }
  }, [selectedImages]);

  const closeImageModal = useCallback(() => {
    setShowImageModal(false);
    setSelectedImages([]);
    if (uploadedImages.length === 0) {
      setUploadImages(false);
    }
  }, [uploadedImages.length]);

  const removeImage = useCallback((index) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newUploadedImages);
    if (newUploadedImages.length === 0) {
      setUploadImages(false);
    }
  }, [uploadedImages]);

  // JSON extraction utility
  const extractAndParseJSON = useCallback((apiResponse) => {
    try {
      const jsonMatch = apiResponse.response.match(/```json\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      } else {
        console.error("Could not find JSON in the response");
        return null;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }, []);

  // Verification function
  const handleVerify = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const prompt = `'title': '${formData.title}', 'content': ${formData.content}, 'tags': ${formData.tags} Given a JSON article with title, content, and tags fields: Please analyze this content for:\n1. Violations of Indian publication laws and regulations\n2. Harmful, offensive, or prohibited content\n3. Compliance with Indian media standards\nReturn only a JSON response in this format:\n{'status': boolean, 'suggestion': 'your detailed feedback for improving the title, content, and tags'}\nThe status should be 'true' if content is compliant, 'false' if violations exist.\nProvide specific suggestions to improve any problematic aspects.`;

      const task = await api.post('/ai-agent', { prompt });
      const jsonData = extractAndParseJSON(task);
      
      if (jsonData) {
        setIsVerified(jsonData.status);
        if (jsonData.suggestion) {
          setSuggestion(jsonData.suggestion.replace(/\*/g, ''));
        }
      } else {
        setError('Failed to verify article. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying article:', error);
      setError('Failed to verify article. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, validate, api, extractAndParseJSON]);

  // Submit function
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Check if user has sufficient stake
    // if (!hasEnoughStake) {
    //   setError(`You need at least 1 DNT worth of tokens to submit articles. Please buy tokens first.`);
    //   return;
    // }
    
    setIsSubmitting(true);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Form Data:', formData);
      console.log('Reference Images:', refImages);
      
      // Upload to CID with full title (unlimited length)
      const task = await api.post('/upload', {
        "article_title": formData.title,
        "article": formData.content
      });

      // Process tags for smart contract
      const tagsArray = processTagsForContract(formData.tags);

      console.log('Submitting to blockchain with:', {
        title: truncatedTitle,
        cid: task.cid,
        tags: tagsArray,
        refImages: refImages
      });
      
      // Show info about title truncation if it was truncated
      if (formData.title.length > 60) {
        alert(`${task.message}\n\nNote: Your full title was stored in the content, but the blockchain title was truncated to 60 characters: "${truncatedTitle}"`);
      } else {
        alert(task.message);
      }

      const articleData = {
        articleTitle: truncatedTitle,
        journalist: State.WalletAddress,
        contentHash: task.cid,
        tags: tagsArray,
        refImages: refImages,
      }

      console.log(articleData);
      const res = await createArticle(articleData);
      setSuccess(res.message);
      
      
      // Reset form after successful submission
      setFormData({ title: '', content: '', tags: '' });
      setUploadedImages([]);
      setUploadImages(false);
      setIsVerified(false);
      setSuggestion(null);
      
      console.log('Article submitted successfully:', task);
    } catch (error) {
      console.error('Error submitting article:', error);
      
      // Handle specific error types
      // if (error.message.includes('Not a journalist')) {
      //   setError('You need to purchase tokens first to become a journalist.');
      // } else if (error.message.includes('Insufficient stake')) {
      //   setError(`Insufficient stake. You need at least ${minStake} ETH worth of tokens.`);
      // } else if (error.message.includes('gas')) {
      //   setError('Transaction failed due to gas issues. Please try again.');
      // } else {
      //   setError('Failed to submit article. Please try again.');
      // }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [formData, validate, api, processTagsForContract, truncatedTitle, refImages, State.WriteContract, WalletAddress]);
  // }, [formData, validate, hasEnoughStake, minStake, api, processTagsForContract, truncatedTitle, refImages, State.WriteContract, WalletAddress]);

  return (
    <div>
      <section className="w-screen min-h-screen h-auto pt-20 px-4 sm:px-8">
        {/* Stake Status */}
        {/* <div className="max-w-4xl mx-auto mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Your Stake: {userStake} DNT</p>
              <p className="text-xs text-gray-600">Required: {minStake} ETH Tokens</p>
            </div>
            <div className="flex items-center space-x-4">
              {hasEnoughStake ? (
                <span className="text-green-600 text-sm font-medium">✓ Qualified to submit</span>
              ) : (
                <span className="text-red-600 text-sm font-medium">✗ Need more tokens</span>
              )}
            </div>
          </div>
        </div> */}

        {/* Error/Success Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form className="max-w-4xl mx-auto space-y-4" onSubmit={handleSubmit}>
          {/* Title Input */}
          <div>
            <input
              type="text"
              name="title"
              placeholder="Article Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.title.length} characters
              {formData.title.length > 60 && (
                <span className="text-orange-600 ml-2">
                  (Blockchain title will be truncated to 60 characters: "{truncatedTitle}")
                </span>
              )}
            </p>
          </div>

          {/* Content Editor */}
          <div>
            <SimpleMDE
              value={formData.content}
              onChange={handleContentChange}
              options={editorOptions}
              placeholder="Write your article here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Word count: {wordCount} {wordCount < 100 && '(minimum 100 words required)'}
            </p>
          </div>

          {/* Tags Input */}
          <div>
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated, e.g., politics, education, technology)"
              value={formData.tags}
              onChange={handleChange}
              maxLength={60}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.tags.length}/60 characters | Enter tags separated by commas
            </p>
          </div>

          {/* Image Upload Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="uploadImages"
              checked={uploadImages}
              onChange={handleImageCheckboxChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="uploadImages" className="text-sm font-medium text-gray-700">
              Upload reference images
            </label>
            {uploadedImages.length > 0 && (
              <span className="text-green-600 text-sm">
                ({uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} uploaded)
              </span>
            )}
          </div>

          {/* Display uploaded images */}
          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Refernce Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${image.cid}`}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-600"
                    >
                      <X className="m-1" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      CID: {image.cid}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit/Verify Buttons */}
          <div className="flex justify-end items-center space-x-6 mb-8">
            {isVerified ? (
              <p className='text-green-600 text-sm'>*Article approved</p>
            ) : (
              <p className='text-red-600 text-sm'>*Article not approved</p>
            )}
            
            {/* {isVerified && hasEnoughStake ? ( */}
            {isVerified ? (
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 cursor-pointer disabled:bg-gray-400"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 cursor-pointer disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            )}
          </div>
        </form>

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Reference Images</h2>
                <button
                  onClick={closeImageModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <X className="m-1" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelection}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Select multiple images (JPEG, PNG, GIF, etc.)
                  </p>
                </div>

                {selectedImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected Images ({selectedImages.length}):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imageUploadError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {imageUploadError}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeImageModal}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadingImages || selectedImages.length === 0}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 disabled:bg-gray-400"
                  >
                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestion */}
        {suggestion && (
          <div className='max-w-4xl mx-auto mt-6'>
            <h1 className='font-semibold uppercase mb-2'>AI Suggestion</h1>
            <p className='text-justify mb-8 indent-4'>{suggestion}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Write;


// The Rise of Artificial Intelligence: Transforming the Present and Shaping the Future

/*

Artificial Intelligence (AI) has moved from science fiction to everyday reality, reshaping the way we live, work, and interact with the world. From personalized recommendations on streaming platforms to self-driving cars, AI is no longer a distant dream—it's a powerful force driving innovation across industries.

At its core, AI refers to machines designed to mimic human intelligence. This includes learning from data (machine learning), recognizing patterns (deep learning), understanding natural language (NLP), and even making decisions in real-time. These capabilities allow AI systems to perform tasks that once required human thought—faster, more accurately, and at scale.

In healthcare, AI is helping doctors diagnose diseases earlier and with greater precision. In finance, it's detecting fraud in milliseconds. In education, it's personalizing learning paths for students. And in creative fields, AI tools are generating music, art, and even literature, pushing the boundaries of human-machine collaboration.

However, this rapid growth also brings challenges. Ethical concerns such as job displacement, algorithmic bias, and privacy issues must be addressed. As AI becomes more powerful, society must ensure it remains transparent, fair, and accountable.

The future of AI holds immense promise. Advances in areas like general intelligence, robotics, and emotional AI suggest that we're only scratching the surface. With the right balance of innovation and regulation, AI has the potential to enhance human potential and solve some of the world’s most pressing problems.

*/

// ai, ml, nlp, genai