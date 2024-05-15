import jwt from 'jsonwebtoken';
import Token from '../models/userToken';
import env from '../config/env';



const generateToken = async (user: any) => {
  if (!env.access_key || !env.refresh_key) {
    console.error('Access key or refresh key is missing');
    return null;
  }

  try {
    const payload = { _id: user._id, role: user.role };
    const accessToken = jwt.sign(payload, env.access_key, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, env.refresh_key, { expiresIn: '30d' });

    const userToken = await Token.findOne({ userId: user._id });

    if (userToken) {
      await Token.deleteOne({ userId: user._id });
    }

    const newToken = new Token({ userId: user._id, token: refreshToken });
    await newToken.save();

    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
};

export default generateToken;
