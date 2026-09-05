const express = require('express');
const app = express();

// 🔥 CORS Enable Karein
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.post('/campaigns', async (req, res) => {
  console.log('Campaign received:', req.body);
  res.json({ 
    success: true, 
    message: 'Campaign executed successfully',
    orderId: Date.now().toString()
  });
});

app.get('/', (req, res) => res.send('SMM Proxy is running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));