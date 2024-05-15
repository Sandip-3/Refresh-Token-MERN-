import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  cors: process.env.CORS,
  access_key: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refresh_key: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  mogo_url: process.env.MONGO_URL,
  salt : process.env.SALT
};
