import { getRepository } from 'typeorm';

import { Pix } from '../../entity/Pix';
import { User } from '../../entity/User';
import { AppError } from '../../shared/error/AppError';

import { decodeKey, encodeKey } from '../../utils/pix';

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

  async pay(key: string, user: Partial<User>) {
    const keyDecoded = decodeKey(key);

    if (keyDecoded.userID !== user.id) {
      throw new AppError(
        'It is not possible to make PIX for the same user',
        401,
      );
    }

    const pixRepository = getRepository(Pix);
    const userRepository = getRepository(User);

    const requestingUser = await userRepository.findOne({
      where: { id: keyDecoded.userID },
    });

    const payingUser = await userRepository.findOne({
      where: { id: user.id },
    });

    if (payingUser?.wallet && payingUser.wallet < Number(keyDecoded.value)) {
      throw new AppError(
        'There is not enough balance to make the payment.',
        401,
      );
    }

    if (!requestingUser || !payingUser) {
      throw new AppError(
        "We didn't find the transaction's customers, generate a new key",
        401,
      );
    }

    requestingUser.wallet =
      Number(requestingUser?.wallet) + Number(keyDecoded.value);
    await userRepository.save(requestingUser);

    payingUser.wallet = Number(payingUser?.wallet) - Number(keyDecoded.value);
    await userRepository.save(payingUser);

    const pixTransaction = await pixRepository.findOne({
      where: { id: keyDecoded.registerID, status: 'open' },
    });

    if (!pixTransaction) {
      throw new AppError('Invalid key for payment', 401);
    }

    pixTransaction.status = 'close';
    pixTransaction.payingUser = payingUser;

    await pixRepository.save(pixTransaction);

    return { msg: 'PIX payment successful' };
  }
}
