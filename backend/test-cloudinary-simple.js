const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

console.log('Testing Cloudinary credentials...');

// Check environment variables
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test with ping
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary ping successful:', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary ping failed:', error.message);
    console.error('Full error:', error);
  }); 