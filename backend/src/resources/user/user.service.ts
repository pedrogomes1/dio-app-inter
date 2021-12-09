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
      throw new AppError('Invalid credentials', 401);
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

    return { accessToken: token };
  }

  async signUp(user: UserSignUp) {
    const userRepository = getRepository(User);

    const { firstName, lastName, email, password } = user;

    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new AppError('User already registered with the email', 401);
    }

    const userData = {
      ...user,
      password: md5(password).toString(),
      wallet: 0,
      accountNumber: Math.floor(Math.random() * 999999999),
      accountDigit: Math.floor(Math.random() * 99),
    };

    const userCreated = await userRepository.save(userData);

    const { id } = userCreated;
    const { secret, expiresIn } = authConfig.jwt;

    const { accountNumber, accountDigit, wallet } = userData;

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

    return { accessToken: token };
  }
}
