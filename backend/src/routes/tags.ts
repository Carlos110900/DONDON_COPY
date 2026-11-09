import { Router } from 'express';
import { createTag, deleteTag, getTags, renameTag } from '../controllers/tagController';
import { checkToken } from '../middleware/checkToken';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { tagSchema } from '../validators/schemas';

const router = Router();

router.get('/', getTags);
// Si los publicadores también deben crear tags: requireRole('publisher', 'admin')
router.post('/', checkToken, requireRole('admin'), validate(tagSchema), createTag);
router.patch('/:id', checkToken, requireRole('admin'), validate(tagSchema), renameTag);
router.delete('/:id', checkToken, requireRole('admin'), deleteTag);

export default router;
