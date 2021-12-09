import { getRepository } from 'typeorm';

import { Pix } from '../../entity/Pix';
import { User } from '../../entity/User';

import { encodeKey } from '../../utils/pix';

export class PixService {
  async request(value: number, user: Partial<User>) {
    const pixRepository = getRepository(Pix);
    const userRepository = getRepository(User);

    const currentUser = await userRepository.findOne({
      where: { id: user.id },
    });

    const requestData = {
      requestingUser: currentUser,
      value,
      status: 'open',
    };

    const register = await pixRepository.save(requestData);

    const key = encodeKey(user.id || '', value, register.id);

    return key;
  }
}
