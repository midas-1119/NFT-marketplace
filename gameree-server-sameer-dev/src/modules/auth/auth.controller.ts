import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import e, { Response } from 'express';
import { AuthService } from './auth.service';
import { CommonServices } from '../shared/services/common.service';
import {
  forgetPasswordDto,
  LoginDto,
  MetamaskLoginDto,
  resetPasswordDto,
  SignupDto,
  verifyCodeDto,
} from './auth.dto';
import { AwsService } from '../shared/services/aws.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard, MetamaskAuthGuard } from './local-auth.guard';
import { jwtConstants } from 'src/constants';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { MailServices } from '../shared/services/mail.service';
import {
  userRegistrationLinkTemplate,
  userRegistrationTemplate,
} from 'src/templates/user-register';
import { env } from 'process';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ACCOUNT_REPOSITORY } from 'src/constants';
import { IAccountDocument } from '../account/account.schema';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Controller('auth')
export class AuthController extends CommonServices {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly awsService: AwsService,
    private readonly mailService: MailServices,
    @Inject(ACCOUNT_REPOSITORY)
    readonly accountRepository: Model<IAccountDocument>,
  ) {
    super();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: LoginDto,
  ): Promise<any> {
    try {
      const response = await this.authService.login(req.user);
      return this.sendResponse(
        this.messages.loggedIn,
        response,
        HttpStatus.OK,
        res,
      );
      // }
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('/login/metamask')
  async loginWithMetamask(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: MetamaskLoginDto,
  ): Promise<any> {
    try {
      console.log('Metamask Login Body: ', body);
      const user = await this.authService.validateMetamaskUser(body.identifier);
      if (!user)
        return this.sendResponse(
          this.messages.unAuthorizedMetamaskId,
          {},
          HttpStatus.UNAUTHORIZED,
          res,
        );
      const response = await this.authService.login(user);
      console.log('Metamask Login Response: ', response);
      return this.sendResponse(
        this.messages.loggedIn,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('/add/account')
  @UseGuards(JwtAuthGuard)
  async addMetamaskAuthAccount(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: MetamaskLoginDto,
  ): Promise<any> {
    try {
      let response = null;
      let user = null;
      const requestUser = req.user;
      if (requestUser.accountId) {
        user = await this.authService.validateMetamaskUser(body.identifier);
      } else {
        await this.authService.addMetamaskAccount(
          body.identifier,
          requestUser.userId,
        );
        user = await this.userService.sharedFindOne({
          _id: requestUser.userId,
        });
      }
      response = await this.authService.login(user);
      return this.sendResponse(
        this.messages.loggedIn,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('/signup')
  async signup(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: SignupDto,
  ): Promise<any> {
    try {
      const email = body.email.toLowerCase().trim();
      const username = body.username.toLowerCase().trim();

      const checkUser = await this.userService.find(username, email);

      if (checkUser && checkUser.email == email) {
        return this.sendResponse(
          this.messages.emailAlreadyExists,
          {},
          HttpStatus.CONFLICT,
          res,
        );
      }
      if (checkUser && checkUser.username == username) {
        return this.sendResponse(
          this.messages.usernameAlreadyExists,
          {},
          HttpStatus.CONFLICT,
          res,
        );
      }
      let obj = body;
      obj.email = email;
      obj.username = username;

      const emailVerificationHash = bcrypt.hashSync(
        Math.floor(Math.random() * 1000 + 10300).toString(),
        jwtConstants.salt,
      );

      const createUser = await this.userService.sharedCreate({
        ...obj,
        password: bcrypt.hashSync(body.password, jwtConstants.salt),
        roles: ['user'],
        emailVerificationHash: emailVerificationHash,
      });

      const Userresp: any = await this.authService.login(createUser);

      await this.mailService.sendEmail(
        createUser.email,
        '',
        userRegistrationLinkTemplate(
          `${env.BACK_END}/auth/verifyEmail?hash=${emailVerificationHash}`,
        ),
        'Email Verification',
      );
      return this.sendResponse(
        'Account created successfully! Verify you email to continue using Gameree.',
        Userresp,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Internal server Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('verifyEmail')
  async verifyEmail(
    @Body() body: any,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const { hash } = query;
    try {
      const user = await this.userService.userRepository.findOneAndUpdate(
        { emailVerificationHash: hash },
        { isVerified: true, emailVerificationHash: null },
        { useFindAndModify: true },
      );
      await this.mailService.sendEmail(
        user.email,
        '',
        userRegistrationTemplate(`${env.FRONT_END}/login`),
        'Welcome to Gameree',
      );
      res.redirect(env.FRONT_END);
    } catch (error) {
      this.sendResponse(this.messages.Error, [], HttpStatus.BAD_REQUEST, res);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: forgetPasswordDto, @Res() res: Response) {
    const verifyEmail = await this.authService.verifyEmail(body.email);
    if (verifyEmail) {
      const verificationProcess = await this.authService.forgetPassword(
        body.email,
      );
      return this.sendResponse(
        verificationProcess.message,
        {},
        verificationProcess.status_code,
        res,
      );
    } else {
      res.status(401).send({
        status_code: 401,
        message: 'Email does not exist',
      });
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: resetPasswordDto,
  ): Promise<any> {
    try {
      const code = await this.authService.verifyCode(body);
      if (!code.success)
        return this.sendResponse(code.message, null, HttpStatus.NOT_FOUND, res);

      const passwordReq = await this.authService.passwordRepository.findOne({
        email: req.body.email,
      });
      if (!passwordReq) {
        return this.sendResponse(
          'No request found',
          {},
          HttpStatus.BAD_REQUEST,
          res,
        );
      }
      if (!passwordReq.isVerified) {
        return this.sendResponse(
          'Please verify your account.',
          {},
          HttpStatus.FORBIDDEN,
          res,
        );
      }
      const user = await this.userService.userRepository
        .findOne({ email: req.body.email })
        .select('+password');

      user.password = bcrypt.hashSync(req.body.password, jwtConstants.salt);

      const result = await this.userService.userRepository.findByIdAndUpdate(
        user._id,
        { ...user },
        { new: true },
      );
      const del = await this.authService.passwordRepository.findOneAndDelete({
        email: req.body.email,
      });
      return this.sendResponse(
        'Password changes successfully',
        {},
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Internal server Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('/authorize')
  async authorizeEmail(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      return this.sendResponse(this.messages.loggedIn, {}, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Query('metamaskId') metamaskId: string) {
    req.query.state = metamaskId;
    console.log('Inside Google Login');
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { user } = req;
    // console.log('MetamaskId:', stateData);
    user.email = user.email.toLocaleLowerCase();
    console.log('Google Login User: ', user);
    // console.log("usr:-=-=-=", user)
    let checkUser = await this.userService.userRepository
      .findOne({ email: user.email })
      .populate('accountId');

    if (!checkUser) {
      const data = {
        email: user.email,
        avatar: user.picture || '',
        fullName: `${user.firstName} ${user.lastName}`,
        username: user.firstName.toLocaleLowerCase() + Date.now(),
        password: bcrypt.hashSync(
          `${new Date().getTime()}-ALS`,
          jwtConstants.salt,
        ),
        // accountId: account._id,
      };
      checkUser = await this.userService.sharedCreate(data);
      // await this.mailService.sendEmail(
      //   checkUser.email,
      //   '',
      //   userRegistrationTemplate(`${env.FRONT_END}`),
      //   'Welcome to Vaffa',
      // );
    }

    if (checkUser && !checkUser.username) {
      const data = {
        email: user.email,
        avatar: user.picture || '',
        fullName: `${user.firstName} ${user.lastName}`,
        username: user.firstName.toLocaleLowerCase() + Date.now(),
        password: bcrypt.hashSync(
          `${new Date().getTime()}-ALS`,
          jwtConstants.salt,
        ),
      };
      checkUser = await this.userService.userRepository.findOneAndUpdate(
        { _id: checkUser._id },
        data,
        { new: true },
      );
    }

    const loggedInUser: any = await this.authService.login(checkUser);
    console.log('Logged: ', checkUser);
    // res.redirect(`${env.FRONT_END}/metamaskLogin?user=${checkUser._id}`);
    res.redirect(`${env.FRONT_END}?oAuthToken=${loggedInUser.access_token}`);
  }

  // @Post('syncMetamask')
  // async syncMetamask(@Req() req, @Res() res: Response) {
  //   console.log('Body:', req.body);
  //   const { metamaskId, userId } = req.body;

  //   let checkUser = await this.userService.userRepository
  //     .findOne({ _id: userId })
  //     .populate('accountId');

  //   console.log('Check User: ', checkUser);

  //   const account = await this.accountRepository.findOne({
  //     address: metamaskId,
  //   });

  //   console.log('Account: ', account);

  //   if (checkUser && !checkUser.accountId) {
  //     console.log('account not available');
  //     const data = {
  //       accountId: account._id,
  //     };
  //     checkUser = await this.userService.userRepository.findOneAndUpdate(
  //       { _id: checkUser._id },
  //       data,
  //       { new: true },
  //     );
  //   }

  //   const loggedInUser: any = await this.authService.login(checkUser);
  //   console.log('Logged: ', loggedInUser);
  //   return this.sendResponse(
  //     this.messages.loggedIn,
  //     { url: `${env.FRONT_END}?oAuthToken=${loggedInUser.access_token}` },
  //     HttpStatus.OK,
  //     res,
  //   );
  //   // res.redirect(`${env.FRONT_END}?oAuthToken=${loggedInUser.access_token}`);
  // }

  @Post('/getPayload')
  @UseGuards(JwtAuthGuard)
  async getLoggedInAccount(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (req.user.userId) {
        return this.sendResponse(
          this.messages.loggedIn,
          req.user,
          HttpStatus.OK,
          res,
        );
      }
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.BAD_REQUEST,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
}
