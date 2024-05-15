import jwt from 'jsonwebtoken';
import env from '../config/env';
import Token from '../models/userToken';

interface TokenDetails {
  _id: string;
  role: string[];
}

const verifyRefreshToken = (refreshToken: string): Promise<TokenDetails> => {
  return new Promise((resolve, reject) => {
    if (!env.refresh_key) {
      return reject({ error: true, message: 'Refresh key not found' });
    }
    const privateKey = env.refresh_key;

    Token.findOne({ token: refreshToken }, (err:any, doc : any) => {
      if (err || !doc) {
        return reject({ error: true, message: 'Invalid Refresh Token' });
      }
      jwt.verify(refreshToken, privateKey, (err, decodedToken) => {
        if (err) {
          return reject({ error: true, message: 'Invalid Refresh Token' });
        }
        resolve(decodedToken as TokenDetails);
      });
    });
  });
};

export default verifyRefreshToken;
