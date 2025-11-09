import axios from 'axios';

const BASE_URL = "http://localhost:5000/api";

// =========================
// USERS
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

export const updateUserStake = async (userData) => {
    try {
        const response = await axios.put(`${BASE_URL}/users/update-stake`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

// ===================================
// ARTICLES

export const createArticle = async (articleData) => {
    try {
        const response = await axios.post(`${BASE_URL}/article/`, articleData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

export const getAllArticles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/article/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

export const getArticleByContentHash = async (articleData) => {
    try {
        const { contentHash } = articleData;
        const response = await axios.get(`${BASE_URL}/article/${contentHash}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

// ====================================
// VOTES

export const supportRealVote = async (data) => {
    const { contentHash, WalletAddress } = data; 
    try {
        const response = await axios.put(`${BASE_URL}/article/s/${contentHash}`, {
            walletAddress: WalletAddress
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

export const reportSpam = async (data) => {
    const { contentHash, WalletAddress, spamString } = data; 
    try {
        const response = await axios.put(`${BASE_URL}/article/r/${contentHash}`, {
            walletAddress: WalletAddress,
            spamString
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

export const verifyArticle = async (articleData) => {
    const { contentHash } = articleData;

        try {
        const response = await axios.put(`${BASE_URL}/article/v/${contentHash}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}

export const updateArticleStatus = async (articleData) => {
    const { contentHash } = articleData;

        try {
        const response = await axios.put(`${BASE_URL}/article/reset-update/${contentHash}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error.response?.data || error;
    }
}
