import { Router } from 'express';
import {
  createComic,
  deleteComic,
  getComic,
  getComics,
  updateComic,
} from '../controllers/comicController';
import { checkToken } from '../middleware/checkToken';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { comicInputSchema, comicUpdateSchema } from '../validators/schemas';

const router = Router();

router.get('/', getComics);
router.get('/:id', getComic);
router.post(
  '/',
  checkToken,
  requireRole('publisher', 'admin'),
  validate(comicInputSchema),
  createComic,
);
// El dueño (o admin) se comprueba dentro del controlador
router.patch(
  '/:id',
  checkToken,
  requireRole('publisher', 'admin'),
  validate(comicUpdateSchema),
  updateComic,
);
router.delete('/:id', checkToken, requireRole('admin'), deleteComic);

export default router;
