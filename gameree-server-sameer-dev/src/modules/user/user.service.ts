import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { NEWSLETTER_REPOSITORY, USER_REPOSITORY } from 'src/constants';
import { INewsletterDocument } from '../newsletter/newsletter.schema';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IUserDocument } from './user.schema';
import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';

@Injectable()
export class UserService extends sharedCrudService {
  constructor(
    @Inject(USER_REPOSITORY) readonly userRepository: Model<IUserDocument>,
    @Inject(NEWSLETTER_REPOSITORY)
    readonly newsletterRepository: Model<INewsletterDocument>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<IUserDocument | undefined> {
    return this.userRepository.findOne({ email: email });
  }

  async findUserById(id: string): Promise<any> {
    return await this.userRepository.findById(id);
  }

  public async find(
    username: string,
    email: string,
  ): Promise<IUserDocument | undefined> {
    return this.userRepository.findOne({
      $or: [{ username: username }, { email: email }],
    });
  }

  async updateProfile(body: any, userId: string) {
    return await this.userRepository.findByIdAndUpdate(
      userId,
      {
        ...body,
      },
      {
        new: true,
      },
    );
  }

  async subscribeNewsletter(email: string) {
    const res = await this.newsletterRepository.findOne({ email: email });
    if (res) return false;
    const update = await this.newsletterRepository.create({
      email: email,
    });
    return true;
  }

  async generateTwoFactorAuthenticationSecret(user: any) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(user.email, 'Gameree', secret);

    await this.setTwoFactorAuthenticationSecret(secret, user.userId);

    return {
      secret,
      otpauthUrl,
    };
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    await this.userRepository.findByIdAndUpdate(
      { _id: userId },
      { twoFactorAuthenticationSecret: secret },
    );
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return await this.userRepository
      .findByIdAndUpdate(
        { _id: userId },
        { isTwoFactorAuthenticationEnabled: true },
      )
      .select('isTwoFactorAuthenticationEnabled fullname username isVerified');
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    return await this.userRepository
      .findByIdAndUpdate(
        { _id: userId },
        { isTwoFactorAuthenticationEnabled: false },
      )
      .select('isTwoFactorAuthenticationEnabled fullname username isVerified');
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: any,
  ) {
    const { twoFactorAuthenticationSecret } = await this.findUserById(user._id);
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: twoFactorAuthenticationSecret,
    });
  }
}
