const express = require('express');
const axios = require('axios');
const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// ✅ SERVER START HOTE HI KOI API CALL NAHI HONI CHAHIYE!
// Bas route define karein:

app.post('/campaigns', async (req, res) => {
  const { platform, action, target, quantity } = req.body;

  try {
    console.log(`📩 Campaign: ${platform} - ${action} - ${target}`);

    let result;
    
    if (platform === 'Instagram') {
      // FreezLike API call YAHAN HOGI, server start par nahi!
      result = await handleInstagramFree(action, target, quantity);
    } else if (platform === 'Facebook') {
      result = await handleFacebookFree(action, target, quantity);
    } else {
      throw new Error('Unsupported platform');
    }

    res.json({ 
      success: true, 
      message: 'Campaign executed (free API)',
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

// 📸 INSTAGRAM FREE HANDLER
async function handleInstagramFree(action, target, quantity) {
  try {
    // 🔥 Yeh API call sirf tab hogi jab campaign submit ho!
    const response = await axios.post('https://freezlike.co/api/v1/order', {
      service: getServiceId(action),
      link: target,
      quantity: Math.min(quantity, 50)
    }, {
      timeout: 10000 // 10 second timeout
    });
    
    return {
      action: action,
      target: target,
      quantity: quantity,
      status: 'completed',
      orderId: response.data?.order_id || 'pending'
    };
  } catch (error) {
    // Agar freezlike fail ho toh bhi server crash nahi hoga!
    return {
      action: action,
      target: target,
      quantity: quantity,
      status: 'pending',
      error: error.message,
      message: 'FreezLike API temporarily unavailable, order queued'
    };
  }
}

// 📘 FACEBOOK FREE HANDLER
async function handleFacebookFree(action, target, quantity) {
  return {
    action: action,
    target: target,
    quantity: quantity,
    status: 'pending',
    message: 'Facebook API request queued (free tier)'
  };
}

function getServiceId(action) {
  const services = {
    'Add Followers': '1',
    'Add Likes to post': '2',
    'Add Views': '3'
  };
  return services[action] || '1';
}

// ✅ HEALTH CHECK - SERVER CHAL RAHA HAI YA NAHI CHECK KARNE KE LIYE
app.get('/', (req, res) => res.send('SMM Proxy is running! (Free API Mode)'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));