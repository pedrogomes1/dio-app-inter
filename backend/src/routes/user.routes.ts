import { Router } from 'express';
import { UserControler } from '../resources/user/dtos/user.controller';

const userRouter = Router();
const userController = new UserControler();

userRouter.get('/signin', userController.signIn);
userRouter.get('/signup', userController.signUp);

export { userRouter };
