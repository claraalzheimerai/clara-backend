import { Router } from 'express';
import analysisRoutes from './analysis.routes';

const router = Router();

router.use('/analysis', analysisRoutes);

export default router;