import { Router } from 'express';
import { googleLogin, login, logout, me, register } from '../controllers/authController';
import { checkToken } from '../middleware/checkToken';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { googleSchema, loginSchema, registerSchema } from '../validators/schemas';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, validate(googleSchema), googleLogin);
router.get('/me', checkToken, me);
router.post('/logout', checkToken, logout);

export default router;
