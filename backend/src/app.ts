import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import { config } from './config.js';
import IdeaModel from './models/Idea.js';
import { createIdeaSchema } from './utils/schema.js';
import { setupSwagger } from './swagger.js';

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const upload = multer({ storage: multer.memoryStorage() });

setupSwagger(app);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Get all ideas
 *     responses:
 *       200:
 *         description: List of ideas
 */
app.get(['/ideas', '/api/ideas'], async (_req, res) => {
  try {
    const ideas = await IdeaModel.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch ideas right now.' });
  }
});

/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Create an idea
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *       - in: formData
 *         name: image
 *         type: file
 *     responses:
 *       201:
 *         description: Idea created
 */
app.post(['/ideas', '/api/ideas'], upload.single('image'), async (req, res) => {
  try {
    const parsed = createIdeaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path[0] ?? 'body',
          message: issue.message,
        })),
      });
    }

    let imageUrl = '';

    if (req.file) {
      if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'idea-board' }, (error, result) => {
            if (error || !result) {
              reject(error || new Error('Upload failed'));
              return;
            }
            resolve(result);
          });
          const fileBuffer = req.file?.buffer;
          if (fileBuffer) {
            stream.end(fileBuffer);
          } else {
            reject(new Error('No file buffer available'));
          }
        });
        imageUrl = uploadResult.secure_url;
      }
    }

    const idea = await IdeaModel.create({
      title: parsed.data.title,
      description: parsed.data.description,
      image: imageUrl,
    });

    res.status(201).json(idea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create the idea right now.' });
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: 'Validation failed', errors: err.issues });
  }
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

export default app;
