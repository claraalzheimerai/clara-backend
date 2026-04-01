import { Router } from 'express';
import { uploadAndAnalyze, healthCheck } from '../controllers/analysis.controller';
import { uploadMiddleware } from '../config/multer.config';
import { validateUpload } from '../middlewares/validate.middleware';

const router = Router();

router.get('/health', healthCheck);

router.post(
  '/upload',
  uploadMiddleware.single('mriFile'),
  validateUpload,
  uploadAndAnalyze,
);

export default router;