// 🔥 Free SMM Panel API
const FREE_PANEL_API = 'https://freezlike.co/api/v1';

async function handleInstagramFree(action, target, quantity) {
  try {
    const response = await axios.post(`${FREE_PANEL_API}/order`, {
      service: getServiceId(action),
      link: target,
      quantity: Math.min(quantity, 50) // Free limit
    });
    
    return {
      action: action,
      target: target,
      quantity: quantity,
      status: 'completed',
      orderId: response.data.order_id
    };
  } catch (error) {
    return {
      action: action,
      target: target,
      quantity: quantity,
      status: 'pending',
      error: error.message
    };
  }
}

function getServiceId(action) {
  const services = {
    'Add Followers': '1',
    'Add Likes to post': '2',
    'Add Views': '3'
  };
  return services[action] || '1';
}