import { Router } from 'express';
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateMe,
  updateRole,
  updateStatus,
} from '../controllers/userController';
import { checkToken } from '../middleware/checkToken';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { profileSchema, roleSchema, statusSchema } from '../validators/schemas';

const router = Router();
router.use(checkToken);

// /me va antes que /:id
router.patch('/me', validate(profileSchema), updateMe);

router.use(requireRole('admin'));
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id/role', validate(roleSchema), updateRole);
router.patch('/:id/status', validate(statusSchema), updateStatus);
router.delete('/:id', deleteUserById);

export default router;
