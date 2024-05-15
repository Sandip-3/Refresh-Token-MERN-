import { Router } from 'express';

import Health from './Health';
import User from './User';

const router = Router();
router.use('/health', Health);
router.use('/user', User);

/**
 * Import and add your routes here
 * Eg:
 *   router.use('/[route-name]', [Route]);
 */

export default router;
