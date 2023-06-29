import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommonServices } from '../shared/services/common.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendRecieveOffersService } from './sendRecieveOffers.service';
import { ActivityService } from '../activity/activity.service';
import { AssetsService } from '../assets/assets.service';
import { OldCollection } from '../../constants/oldColl';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { MarketplaceService } from '../marketplace/marketplace.service';

@Controller('sendRecieveOffers')
export class SendRecieveOffersController extends CommonServices {
  constructor(
    private readonly sendRecieveOffersService: SendRecieveOffersService,
    private readonly marketplaceService: MarketplaceService,
  ) {
    super();
  }

  @Post('add-offer')
  @UseGuards(JwtAuthGuard)
  async addOffer(@Res() res: Response, @Req() req, @Body() body) {
    console.log('Add Offer Body: ', body);

    try {
      body.status = 'pending';
      const create =
        await this.sendRecieveOffersService.sendRecieveOffersRepository.create(
          body,
        );

      return this.sendResponse(
        this.messages.Success,
        create,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('get-offers')
  async getOffers(
    // @Query() query,
    @Req() req,
    @Res() res: Response,
    @Body() body,
  ) {
    try {
      console.log('Get Offers Body: ', body);
      const queryObj = { to: body.user };

      const response = await this.sendRecieveOffersService.getOffers(queryObj);

      console.log('Response: ', response);

      return this.sendResponse(
        this.messages.Success,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('get-sent-offers')
  async getSentOffers(
    // @Query() query,
    @Req() req,
    @Res() res: Response,
    @Body() body,
  ) {
    try {
      console.log('Get Sent Offers Body: ', body);
      const queryObj = { from: body.user };

      const response = await this.sendRecieveOffersService.getOffers(queryObj);

      console.log('Response: ', response);

      return this.sendResponse(
        this.messages.Success,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('accept-offer/:id')
  @UseGuards(JwtAuthGuard)
  async acceptOffer(@Res() res: Response, @Req() req, @Body() body) {
    try {
      console.log('Accept Offer Id: ', req.params.id);
      console.log('Body: ', body);

      const response = await this.sendRecieveOffersService.acceptOffer(
        req.params.id,
      );

      const resp = await this.marketplaceService.unlistNFT(body.nftId, {
        listingId: body.listingId,
      });

      // const data: any = {
      //   nft: req.params.id,
      //   type: 'buy',
      //   buyer: req.user.userId,
      //   to: body.to,
      //   from: body.from,
      //   hash: body.hash,
      // };
      // if (body.seller) data.seller = body.seller;
      // const createActivity = await this.activityService.createActivity(data);
      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('reject-offer/:id')
  @UseGuards(JwtAuthGuard)
  async rejectOffer(@Res() res: Response, @Req() req, @Body() body) {
    try {
      console.log('Reject Offer Id: ', req.params.id);
      console.log('Body: ', body);

      const response = await this.sendRecieveOffersService.rejectOffer(
        req.params.id,
      );

      // const data: any = {
      //   nft: req.params.id,
      //   type: 'buy',
      //   buyer: req.user.userId,
      //   to: body.to,
      //   from: body.from,
      //   hash: body.hash,
      // };
      // if (body.seller) data.seller = body.seller;
      // const createActivity = await this.activityService.createActivity(data);
      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('complete-purchase-offer/:id')
  @UseGuards(JwtAuthGuard)
  async completePurchaseOffer(@Res() res: Response, @Req() req, @Body() body) {
    console.log('Log: ', req.user);
    try {
      console.log('Complete Purchase Offer Id: ', req.params.id);
      const response =
        await this.sendRecieveOffersService.completePurchaseOffer(
          req.params.id,
          req.user.userId,
        );
      // const data: any = {
      //   nft: req.params.id,
      //   type: 'buy',
      //   buyer: req.user.userId,
      //   to: body.to,
      //   from: body.from,
      //   hash: body.hash,
      // };
      // if (body.seller) data.seller = body.seller;
      // const createActivity = await this.activityService.createActivity(data);
      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
}
