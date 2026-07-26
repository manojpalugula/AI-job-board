import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { applyToJob, listJobApplicants, updateApplicationStatus } from '../controllers/applicationController.js';

const router = Router();
router.post('/jobs/:jobId/applications', protect, authorize('candidate'), applyToJob);
router.get('/jobs/:jobId/applications', protect, authorize('recruiter', 'admin'), listJobApplicants);
router.patch('/applications/:applicationId', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
export default router;
