import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto, validateEmailDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonServices } from '../shared/services/common.service';
import { AwsService } from '../shared/services/aws.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/constants';
import { MailServices } from '../shared/services/mail.service';
import { newsletterSubscriptionEmail } from 'src/templates/newsletter-subscription';
import { env } from 'process';

@Controller('user')
export class UserController extends CommonServices {
  constructor(
    private readonly userService: UserService,
    private readonly awsService: AwsService,
    private readonly mailService: MailServices,
  ) {
    super();
  }

  @Put('')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req,
    @Res() res: Response,
    @UploadedFile() avatar,
  ) {
    try {
      if (updateProfileDto.email) {
        const checkUserWithEmail = await this.userService.findByEmail(
          updateProfileDto.email,
        );
        if (checkUserWithEmail && checkUserWithEmail._id != req.user.userId) {
          return this.sendResponse(
            'Email already registered',
            {},
            HttpStatus.CONFLICT,
            res,
          );
        }
      }

      let obj: any = { ...updateProfileDto };
      if (avatar) {
        const response = await this.awsService.uploadFile(avatar);
        response ? (obj['avatar'] = response.Location) : null;
      }
      const user = await this.userService.updateProfile(obj, req.user.userId);
      return this.sendResponse(
        'successfully updated',
        user,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() res: Response, @Req() req) {
    try {
      const { otpauthUrl } =
        await this.userService.generateTwoFactorAuthenticationSecret(req.user);

      return this.sendResponse(
        'successfully updated',
        await this.userService.generateQrCodeDataURL(otpauthUrl),
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Res() res: Response,
    @Req() req,
    @Body() body,
  ) {
    try {
      console.log(
        'Turn On Two Factor Authentication',
        body.twoFactorAuthenticationCode,
        req.user,
      );
      const isCodeValid =
        await this.userService.isTwoFactorAuthenticationCodeValid(
          body.twoFactorAuthenticationCode,
          req.user,
        );
      console.log('Code is valid', isCodeValid);
      if (!isCodeValid) {
        return this.sendResponse(
          'Error',
          'Wrong authentication code',
          HttpStatus.INTERNAL_SERVER_ERROR,
          res,
        );
      }
      return this.sendResponse(
        'successfully updated',
        await this.userService.turnOnTwoFactorAuthentication(req.user._id),
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('2fa/turn-off')
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(
    @Res() res: Response,
    @Req() req,
    @Body() body,
  ) {
    try {
      console.log(
        'Turn Off Two Factor Authentication',
        body.twoFactorAuthenticationCode,
        req.user,
      );
      const isCodeValid =
        await this.userService.isTwoFactorAuthenticationCodeValid(
          body.twoFactorAuthenticationCode,
          req.user,
        );
      console.log('Code is valid', isCodeValid);
      if (!isCodeValid) {
        return this.sendResponse(
          'Error',
          'Wrong authentication code',
          HttpStatus.INTERNAL_SERVER_ERROR,
          res,
        );
      }
      return this.sendResponse(
        'successfully updated',
        await this.userService.turnOffTwoFactorAuthentication(req.user._id),
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('2fa/authenticate')
  @UseGuards(JwtAuthGuard)
  async verify2FA(@Res() res: Response, @Req() req, @Body() body) {
    try {
      const isCodeValid =
        await this.userService.isTwoFactorAuthenticationCodeValid(
          body.twoFactorAuthenticationCode,
          req.user,
        );
      console.log('Code is valid', isCodeValid);
      if (!isCodeValid) {
        return this.sendResponse(
          'Error',
          'Wrong authentication code',
          HttpStatus.INTERNAL_SERVER_ERROR,
          res,
        );
      }
      return this.sendResponse(
        'successfully verified',
        true,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('/validate-user')
  async validateEmail(
    @Req() req: any,
    @Res() res: Response,
    @Body() emailDto: validateEmailDto,
  ): Promise<any> {
    try {
      const checkUserWithEmail = await this.userService.findByEmail(
        emailDto.identifier,
      );
      return this.sendResponse(
        this.messages.Success,
        {
          isRegistered:
            checkUserWithEmail && checkUserWithEmail.email ? true : false,
        },
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log('error', error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('password/change')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: any,
    @Res() res: Response,
    @Body() body,
  ): Promise<any> {
    try {
      const user = await this.userService.userRepository
        .findOne({ _id: req.user.userId })
        .select('+password');

      if (user && bcrypt.compareSync(body.currentPassword, user.password)) {
        user.password = bcrypt.hashSync(body.newPassword, jwtConstants.salt);
        await this.userService.userRepository.findByIdAndUpdate(
          user._id,
          { ...user },
          { new: true },
        );
        return this.sendResponse(
          this.messages.passwordChanged,
          {},
          HttpStatus.OK,
          res,
        );
      }

      return this.sendResponse(
        this.messages.passwordNotMatched,
        {},
        HttpStatus.UNAUTHORIZED,
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async MyAccount(@Req() req: any, @Res() res: Response) {
    try {
      let user = await this.userService.userRepository
        .findOne({
          _id: req.user.userId,
        })
        .populate('accountId');

      console.log('User: ', user);

      let accountAddress = user.accountId?.address;
      return this.sendResponse(
        'OK',
        {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          createdAt: user.createdAt,
          metamaskId: accountAddress,
          isMetamaskUser: user.isMetamaskUser,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt,
        },
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

  @Post('newsletter/subscribe')
  async subscribeToNewsletter(
    @Req() req: any,
    @Res() res: Response,
    @Body() body,
  ): Promise<any> {
    try {
      const response = await this.userService.subscribeNewsletter(body.email);
      if (response) {
        await this.mailService.sendEmail(
          body.email,
          '',
          newsletterSubscriptionEmail(`${env.FRONT_END}`),
          'Thank you for Subscribing Gameree Newsletter!',
        );
        return this.sendResponse(
          this.messages.Success,
          {},
          HttpStatus.CREATED,
          res,
        );
      }
      return this.sendResponse(
        this.messages.alreadySubscribed,
        {},
        HttpStatus.CONFLICT,
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
}
