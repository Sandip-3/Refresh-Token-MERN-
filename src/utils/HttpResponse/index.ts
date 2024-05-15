import { Response } from 'express';

export const successResponse = (props: { response: Response; message: string; status?: number; data?: object }) => {
  const { message, response, data, status } = props;
  response.status(status || 200).json({
    status: status,
    message,
    data,
  });
};

export const errorResponse = (props: { response: Response; message: string; data?: object; status?: number }) => {
  const { response, message, data, status } = props;
  response.status(400).json({
    status: status || 404,
    message: message,
    data,
  });
};
