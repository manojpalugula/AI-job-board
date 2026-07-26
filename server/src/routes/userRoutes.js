import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getProfile, updateProfile, listUsers, selectCandidate } from '../controllers/userController.js';

const router = Router();

router.use(protect);
router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/', authorize('recruiter', 'admin'), listUsers);
router.post('/:id/select', authorize('recruiter', 'admin'), selectCandidate);

export default router;
