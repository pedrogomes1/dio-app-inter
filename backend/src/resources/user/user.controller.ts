import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserControler {
  async signIn(request: Request, response: Response) {
    const { email, password } = request.body;
    const userService = new UserService();

    const user = await userService.signIn({
      email,
      password,
    });

    return response.status(200).send(user);
  }

  async signUp(request: Request, response: Response) {
    const { firstName, lastName, email, password } = request.body;
    const userService = new UserService();

    const user = await userService.signUp({
      email,
      password,
      firstName,
      lastName,
    });

    return response.status(200).send(user);
  }
}
