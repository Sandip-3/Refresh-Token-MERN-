import { Request, Response, Router } from 'express';
import { refreshTokenBodyValidation } from '../../utils/validationSchema'; // Adjust the path as necessary
import verifyRefreshToken from '../../utils/verifyRefreshToken';
import env from '../../config/env';
import jwt from 'jsonwebtoken';

const router = Router();

router.route('/').post(async (request: Request, response: Response) => {
  // Validate the refresh token from the request body
  const { error } = refreshTokenBodyValidation(request.body);
  if (error) {
    return response.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }

  try {
    // Verify the refresh token
    const tokenDetails = await verifyRefreshToken(request.body.refreshToken);
    if (!tokenDetails) {
      return response.status(401).json({
        error: true,
        message: 'Invalid refresh token',
      });
    }
    if (!env.access_key) {
      return null;
    }

    // Generate a new access token
    const payload = { _id: tokenDetails._id, role: tokenDetails.role };
    const accessToken = jwt.sign(payload, env.access_key, { expiresIn: '15m' });

    // Return the new access token
    return response.status(200).json({
      success: true,
      accessToken,
      message: 'New access token generated',
    });
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return response.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

export default router;
