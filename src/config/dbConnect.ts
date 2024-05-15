import mongoose, { ConnectOptions } from 'mongoose';
import env from '../config/env';

const dbConnect = () => {
  const mongoUrl = env.mogo_url;

  if (!mongoUrl) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1); 
  }

  const connectionParams: ConnectOptions = {
    
  };

  mongoose
    .connect(mongoUrl, connectionParams)
    .then(() => {
      console.log('Connected to Database Successfully');
    })
    .catch(err => {
      console.error(`Error connecting to the database. \n${err}`);
      process.exit(1); 
    });

  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from the database.');
  });
};

export default dbConnect;