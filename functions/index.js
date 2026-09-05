const express = require('express');
const axios = require('axios');
const app = express();

// 🔥 CORS Enable
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// ============================================
// 🔥 FREE PROXY API CONFIGURATION (Abhi Ke Liye)
// ============================================
const FREE_TOKEN = 'N8o3eySfREuw1pbt3fmcLg';  // Public token
const FREE_API_BASE = 'https://api.akng.io.vn/graph';

// ============================================
// ✅ CAMPAIGN ENDPOINT
// ============================================
app.post('/campaigns', async (req, res) => {
  const { platform, action, target, quantity } = req.body;

  try {
    console.log(`📩 Campaign: ${platform} - ${action} - ${target} - ${quantity}`);

    let result;
    
    if (platform === 'Instagram') {
      result = await handleInstagram(action, target, quantity);
    } else if (platform === 'Facebook') {
      result = await handleFacebook(action, target, quantity);
    } else {
      throw new Error('Unsupported platform');
    }

    res.json({ 
      success: true, 
      message: 'Campaign executed (free proxy)',
      orderId: Date.now().toString(),
      data: result
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// 📸 INSTAGRAM HANDLER
// ============================================
async function handleInstagram(action, target, quantity) {
  // Example: Get user info using free proxy
  if (action === 'Add Followers') {
    const response = await axios.get(`${FREE_API_BASE}/v19.0/${target}?access_token=${FREE_TOKEN}`);
    return { 
      action: 'Add Followers',
      user: response.data,
      quantity: quantity
    };
  }
  
  if (action === 'Add Likes to post') {
    const postId = target.split('/p/')[1]?.split('/')[0] || target;
    const response = await axios.get(`${FREE_API_BASE}/v19.0/${postId}?access_token=${FREE_TOKEN}`);
    return {
      action: 'Add Likes',
      post: response.data,
      quantity: quantity
    };
  }

  return { action, target, quantity, status: 'pending' };
}

// ============================================
// 📘 FACEBOOK HANDLER
// ============================================
async function handleFacebook(action, target, quantity) {
  // Example: Get page data
  const pageId = target.split('/').pop();
  const response = await axios.get(`${FREE_API_BASE}/v19.0/${pageId}?access_token=${FREE_TOKEN}`);
  
  return {
    action: action,
    page: response.data,
    quantity: quantity
  };
}

// ============================================
// ✅ HEALTH CHECK
// ============================================
app.get('/', (req, res) => res.send('SMM Proxy is running! (Free API Mode)'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));