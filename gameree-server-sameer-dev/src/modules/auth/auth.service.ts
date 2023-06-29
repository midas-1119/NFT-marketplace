import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CommonServices } from '../shared/services/common.service';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';
import { v4 as uuidv4 } from 'uuid';
import { FORGET_PASSWORD_REPOSITORY } from 'src/constants';
import { Model } from 'mongoose';
import { IForgetPasswordDocument } from '../user/user.schema';
import { forgetPasswordTemplate } from 'src/templates/forget-password';
import { MailServices } from '../shared/services/mail.service';

@Injectable()
export class AuthService extends CommonServices {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private mailService: MailServices,
    private jwtService: JwtService,
    @Inject(FORGET_PASSWORD_REPOSITORY)
    readonly passwordRepository: Model<IForgetPasswordDocument>,
  ) {
    super();
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.userService.userRepository
      .findOne({
        $or: [{ email: identifier }, { username: identifier }],
      })
      .populate('accountId', 'address')
      .select('+password');

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async validateMetamaskUser(identifier: string): Promise<any> {
    const userAccount = await this.accountService.sharedFindOne({
      address: identifier,
    });
    if (userAccount && userAccount._id) {
      const user = await this.userService
        .sharedFindOne({ accountId: userAccount._id })
        .populate('accountId', 'address');
      console.log(user, 'USER');
      return user;
    } else {
      return await this.createAccount(identifier);
    }
  }

  async createAccount(metamaskId): Promise<any> {
    try {
      const account = await this.accountService.sharedCreate({
        address: metamaskId,
      });
      const user = await this.userService.sharedCreate({
        accountId: account._id,
        username: uuidv4(),
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async addMetamaskAccount(metamaskId, userId): Promise<any> {
    try {
      const account = await this.accountService.sharedCreate({
        address: metamaskId,
      });
      const user = await this.userService.sharedUpdate(
        { _id: userId },
        {
          accountId: account._id,
        },
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async validateAdmin(email: string, pass: string): Promise<any> {
    const user = await this.userService.userRepository
      .findOne({
        email: email,
      })
      .select('+password');
    // console.log(user, "in auth", pass, user.password);
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return HttpStatus.UNAUTHORIZED;
  }

  async login(user: any) {
    const lastLoginAt = Date.now();
    await this.userService.userRepository
      .findByIdAndUpdate(user._id, {
        lastLoginAt: lastLoginAt,
      })
      .populate('accountId');
    const accountAddress = user.accountId?.address;
    const payload = {
      userId: user._id,
      fullName: user.fullName,
      _id: user._id,
      avatar: user.avatar,
      email: user.email,
      metamaskId: accountAddress,
      roles: user.roles,
      active: user.isActive,
      username: user.username,
      createdAt: user.createdAt,
      favourite: user.favourite,
      updatedAt: user.updatedAt,
      lastLoginAt: lastLoginAt,
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled
        ? user.isTwoFactorAuthenticationEnabled
        : false,
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '60d' }),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        cover: user.cover,
        createdAt: user.createdAt,
        metamaskId: accountAddress,
        favourite: user.favourite,
        isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled
          ? user.isTwoFactorAuthenticationEnabled
          : false,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt ? user.lastLoginAt : lastLoginAt,
      },
    };
  }

  async forgetPassword(email: any) {
    const random = Math.floor(Math.random() * 1000 + 10300);
    const check = await this.passwordRepository.findOne({ email: email });
    if (check) {
      const updated = await this.passwordRepository.findOneAndUpdate(
        { email: email },
        { pin: random },
      );
    } else {
      const created = await this.passwordRepository.create({
        email: email,
        pin: random,
      });
    }
    await this.mailService.sendEmail(
      email,
      '',
      forgetPasswordTemplate(random),
      `${random} is your Gameree account recovery code`,
    );
    return {
      status_code: 200,
      message: 'Verification code has been sent to user email, please check!',
      email: email,
    };
  }

  async verifyEmail(email: any) {
    let user = await this.userService.userRepository.findOne({ email: email });
    if (user && user._id) {
      return true;
    } else {
      return false;
    }
  }

  async verifyCode(params: any) {
    const find = await this.passwordRepository.findOne({
      email: params.email,
      pin: params.pin,
    });
    if (find && find._id) {
      const update = await this.passwordRepository.findOneAndUpdate(
        params,
        { isVerified: true },
        { new: true },
      );
      return {
        message: 'PIN Code is verified',
        success: true,
        data: update,
      };
    }
    return { message: 'Invalid Pin Code', success: false, data: null };
  }
}
