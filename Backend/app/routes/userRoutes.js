import express from 'express';
import userControler from '../controller/userControler.js';


export const userRouter = express();

userRouter.get('/', userControler.getUserOnLogin);
userRouter.post('/create', userControler.createUserOnRegister);

