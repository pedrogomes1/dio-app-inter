import { Router } from 'express';
import { UserControler } from '../resources/user/user.controller';

const userRouter = Router();
const userController = new UserControler();

userRouter.post('/signin', userController.signIn);
userRouter.post('/signup', userController.signUp);

export { userRouter };
