import { getRepository } from 'typeorm';
import md5 from 'crypto-js/md5';
import { sign } from 'jsonwebtoken';
import { User } from '../../entity/User';

import { UserSignIn } from './dtos/user.signin.dto';
import { UserSignUp } from './dtos/user.signup.dto';
import { AppError } from '../../shared/error/AppError';

import authConfig from '../../config/auth';
export class UserService {
  async signIn(user: UserSignIn) {
    const userRepository = getRepository(User);

    const { email, password } = user;
    const passwordHash = md5(password).toString();

    const userExists = await userRepository.findOne({
      where: { email, password: passwordHash },
    });

    if (!userExists) {
      throw new AppError('User not found', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const { firstName, lastName, accountNumber, accountDigit, wallet, id } =
      userExists;

    const token = sign(
      {
        firstName,
        lastName,
        accountNumber,
        accountDigit,
        wallet,
      },
      secret,
      {
        subject: id,
        expiresIn,
      },
    );

    delete userExists.password;

    return { accessToken: token };
  }

  async signUp(user: UserSignUp) {}
}
