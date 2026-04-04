import { Router } from 'express';
import { uploadAndAnalyze, healthCheck } from '../controllers/analysis.controller';
import { uploadMiddleware } from '../config/multer.config';
import { validateUpload } from '../middlewares/validate.middleware';
import { analysisLimiter } from '../middlewares/security.middleware';

const router = Router();

router.get('/health', healthCheck);

router.post(
  '/upload',
  analysisLimiter,
  uploadMiddleware.single('mriFile'),
  validateUpload,
  uploadAndAnalyze,
);

export default router;