import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const signUpBodyValidator = (body: any) => {
  const schema = Joi.object({
    userName: Joi.string().required().label('User Name'),
    email: Joi.string().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
  });
  return schema.validate(body);
};

const loginValidator = (body: any) => {
  const schema = Joi.object({
    email: Joi.string().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = (body: any) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label('Refresh Token'),
  });
  return schema.validate(body);
};

export { signUpBodyValidator, loginValidator, refreshTokenBodyValidation };
