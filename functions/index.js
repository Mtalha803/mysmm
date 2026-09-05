const express = require('express');
const app = express();
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