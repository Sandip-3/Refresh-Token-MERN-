import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/HttpResponse';
import User from '../../models/user';
import env from '../../config/env';
import { loginValidator, refreshTokenBodyValidation, signUpBodyValidator } from '../../utils/validationSchema';
import generateToken from '../../utils/generateToken';
import Token from 'models/userToken';
const userController = {
  healthCheck(request: Request, response: Response) {
    try {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      };

      successResponse({ message: 'OK', response, data: healthCheckValue });
    } catch (e) {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: e,
        timestamp: Date.now(),
      };
      errorResponse({ message: 'Failed', response, data: healthCheckValue, status: 503 });
    }
  },

  async userRegister(request: Request, response: Response) {
    try {
      const { error } = signUpBodyValidator(request.body);
      if (error) {
        return response.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const user = await User.findOne({ email: request.body.email });
      if (user) {
        return response.status(400).json({
          success: false,
          message: 'User already exists with email',
        });
      }
      const salt = await bcrypt.genSalt(Number(env.salt));
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      const userData = await new User({ ...request.body, password: hashedPassword }).save();
      response.status(200).json({
        success: true,
        message: 'User created',
        data: userData,
      });
    } catch (error) {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: error,
        timestamp: Date.now(),
      };
      errorResponse({ message: 'Failed', response, data: healthCheckValue, status: 503 });
    }
  },

  async userLogin(request: Request, response: Response) {
    try {
      const { error } = loginValidator(request.body);
      if (error) {
        return response.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const user = await User.findOne({ email: request.body.email });
      if (user) {
        const checkPassword = await bcrypt.compare(request.body.password, user.password);
        if (checkPassword) {
          const tokens = await generateToken(user);

          if (!tokens) {
            return response.status(500).json({
              success: false,
              message: 'Error generating tokens.',
            });
          }
          const { accessToken, refreshToken } = tokens;
          response.status(200).json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: 'User Login Success',
            data: user,
          });
        } else {
          response.status(200).json({
            success: true,
            message: 'Sorry :(',
            data: user,
          });
        }
      } else {
        response.status(400).json({
          success: false,
          message: 'Password or Email not Match',
        });
      }
    } catch (error) {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: error,
        timestamp: Date.now(),
      };
      errorResponse({ message: 'Failed', response, data: healthCheckValue, status: 503 });
    }
    },
  
  async logoutUser(request: Request, response: Response) {
    try {
        const { error } = refreshTokenBodyValidation(request.body)
        if (error) {
            return response.status(400).json({
                error: true,
                message : error.details[0].message
            })
        }
        const userToken = await Token.findOne({ token: request.body.refreshToken });
        if (!userToken) {
            return response.status(200).json({error : true , message : "Logged out Success"})
        }
        await userToken.deleteOne()
        response.status(200).json({ error: true, message: 'Logged out Success' });
    } catch (e) {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: e,
        timestamp: Date.now(),
      };
      errorResponse({ message: 'Failed', response, data: healthCheckValue, status: 503 });
    }
  },
};

export default userController;
