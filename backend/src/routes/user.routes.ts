import { Router } from 'express';
import { userAuthenticated } from '../middlewares/userAuthenticated';
import { UserControler } from '../resources/user/user.controller';

const userRouter = Router();
const userController = new UserControler();

userRouter.post('/signin', userController.signIn);
userRouter.post('/signup', userController.signUp);
userRouter.get('/me', userAuthenticated, userController.me);

export { userRouter };
