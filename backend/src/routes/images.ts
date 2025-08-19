import express, { Request, Response } from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import Image from '../models/Image';
import { protect } from '../middleware/auth';
import cloudinary from '../config/cloudinary';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// @route   POST /api/images/upload
// @desc    Upload a new image
// @access  Private
router.post('/upload', protect, upload.single('image'), [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
], async (req: any, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { title, description } = req.body;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gallery-mern',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    const cloudinaryResult = result as any;

    // Save image metadata to database
    const image = await Image.create({
      title,
      description,
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      format: cloudinaryResult.format,
      size: cloudinaryResult.bytes,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { image }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('api_key')) {
        console.error('Cloudinary API key error - checking configuration...');
        console.error('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
        console.error('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined');
        console.error('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined');
        return res.status(500).json({ message: 'Cloudinary configuration error. Please check server logs.' });
      }
    }
    
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// @route   GET /api/images/test-cloudinary-public
// @desc    Test Cloudinary configuration (public endpoint)
// @access  Public
router.get('/test-cloudinary-public', async (req: any, res: Response) => {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined');
    
    // Test Cloudinary connection
    const result = await cloudinary.api.ping();
    
    res.json({
      success: true,
      message: 'Cloudinary configuration is working',
      data: result
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({ 
      message: 'Cloudinary configuration error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// @route   GET /api/images
// @desc    Get all images for current user
// @access  Private
router.get('/', protect, async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const images = await Image.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalImages: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/images/:id
// @desc    Get single image by ID
// @access  Private
router.get('/:id', protect, async (req: any, res: Response) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      success: true,
      data: { image }
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/images/:id
// @desc    Delete image by ID
// @access  Private
router.delete('/:id', protect, async (req: any, res: Response) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

export default router; 