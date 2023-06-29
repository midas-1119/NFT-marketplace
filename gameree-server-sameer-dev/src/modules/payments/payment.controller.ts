import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommonServices } from '../shared/services/common.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateChargeDto } from './payment.dto';
import { StripeService } from '../stripe/stripe.service';
import { PAYMENTS_REPOSITORY } from 'src/constants';
import { MailServices } from '../shared/services/mail.service';
import { Model } from 'mongoose';
import { IPaymentDocument } from './payment.schema';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { PaymentService } from './payment.service';
import { AssetsService } from '../assets/assets.service';

import { ContractService } from '../shared/services/contract.service';

import { SendRecieveOffersService } from '../sendRecieveOffers/sendRecieveOffers.service';

import { config as dotEnvConfig } from 'dotenv';
import { UserService } from '../user/user.service';
dotEnvConfig();

const nftContractAddress: string = process.env.NFT_CONTRACT_ADDRESS;
const marketplaceContractAddress: string =
  process.env.MARKETPLACE_CONTRACT_ADDRESS;
const platformOwnerAddress: string = process.env.OWNER_ADDRESS;

const ObjectId = require('mongodb').ObjectID;

@Controller('payment')
export class PaymentController extends CommonServices {
  constructor(
    private readonly stripeService: StripeService,
    private readonly marketplaceService: MarketplaceService,
    private readonly assetsService: AssetsService,
    private readonly paymentService: PaymentService,
    private readonly contractService: ContractService,
    private readonly sendRecieveOffersService: SendRecieveOffersService,
    private readonly userService: UserService,
  ) {
    super();
  }

  @Post('/checkout')
  @UseGuards(JwtAuthGuard)
  async acceptPayment(
    @Req() req,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    console.log('Inside Checkout: ', body);
    try {
      const nft = await this.marketplaceService.marketplaceRepository.findOne({
        _id: body.nftId,
        // status: { $ne: 'minted' },
      });
      console.log('nft', nft);
      if (!nft) {
        return this.sendResponse(
          this.messages.nftNotFound,
          {},
          HttpStatus.BAD_REQUEST,
          res,
        );
      }

      const session = await this.stripeService.createCheckoutSession(
        nft,
        req.user,
        body.action,
        body.actionData,
      );
      console.log('Session: ', session);
      if (session) {
        return res.status(200).send({
          status_code: 200,
          message: 'Payment method API hit successfully !!',
          id: session,
        });
      }
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

  @Post('/webhook')
  async paymentIntent(@Req() req, @Res() res: Response): Promise<any> {
    console.log('Inside webhook');
    try {
      console.log(req.body.data.object.metadata, req.body.type);
      switch (req.body.type) {
        case 'charge.succeeded':
          const data = req.body.data.object;
          // console.log(data);

          //Add Payment Record
          await this.paymentService.paymentsRepository.create({
            amount: data.amount,
            currency: data.currency,
            paymentId: data.paymentId,
            metadata: data.metadata,
            billing_details: data.billing_details,
            payment_intent: data.payment_intent,
            receipt_url: data.receipt_url,
            boughtBy: data.metadata.userId,
          });

          const id = ObjectId(data.metadata.nftId);

          const nftData =
            await this.marketplaceService.marketplaceRepository.findOne({
              _id: id,
              status: { $ne: 'minted' },
            });

          // console.log('Data: ', data);
          const action = data.metadata.action;
          // const actionData = data.metadata.actionData;

          console.log('Action: ', action);
          console.log('ActionData: ', data.metadata);
          // console.log('Action Data: ', actionData);

          const user = await this.userService.userRepository.findById(
            data.metadata.userId,
          );

          let ownerAddress = null;

          console.log('Is Metamask User: ', user.isMetamaskUser);

          if (user.isMetamaskUser) {
            ownerAddress = data.metadata.ownerAddress;
          } else {
            ownerAddress = platformOwnerAddress;
          }

          if (action === 'mint') {
            const metadata = JSON.stringify({
              name: nftData.address,
              description: '',
              image: nftData.image,
              imageHash: '',
              edition: 1,
              date: Date.now(),
              attributes: [],
              address: nftData.address,
              area: nftData.area,
              geometry: nftData.geometry,
              incAddress: nftData.incAddress,
              location: nftData.location,
              sequence: nftData.sequence,
              categories: [],
              collectionId: '',
              fileType: '',
              id: nftData.id,
            });

            const response = await this.contractService.mintToken(
              ownerAddress,
              // data.metadata.ownerAddress,
              metadata,
              nftContractAddress,
              nftData.price.valueOf(),
            );

            if (response.success) {
              console.log(
                'Minting Response: ',
                parseInt(response.receipt.events[0].args.tokenId._hex, 16),
              );
            }

            const tokenId: number = parseInt(
              response.receipt.events[0].args.tokenId._hex,
              16,
            );

            //Change status of marketplace NFT
            const nft =
              await this.marketplaceService.marketplaceRepository.findOneAndUpdate(
                { _id: id },
                {
                  status: 'minted',
                  ownerId: data.metadata.userId,
                  // ownerAddress: data.metadata.ownerAddress,
                  ownerAddress: ownerAddress,
                  tokenId: tokenId,
                  // creatorAddress: data.metadata.ownerAddress,
                  creatorAddress: ownerAddress,
                },
              );
          } else if (action === 'buy') {
            //contract -> cd
            //Owner is User
            console.log('Owner is User Case');
            const response =
              await this.contractService.transferOwnershipViaAdmin(
                data.metadata.listingId,
                ownerAddress,
                marketplaceContractAddress,
              );

            if (response.success) {
              console.log('Buy Response: ', response.receipt);

              //Change status of marketplace NFT
              const nft =
                await this.marketplaceService.marketplaceRepository.findOneAndUpdate(
                  { _id: id },
                  {
                    status: 'minted',
                    ownerId: data.metadata.userId,
                    ownerAddress: ownerAddress,
                    tokenId: nftData.tokenId,
                    listingId: '',
                  },
                );

              await this.marketplaceService.listingRepository.findOneAndUpdate(
                {
                  listingId: data.metadata.listingId,
                },
                { isActive: false, soldTo: ownerAddress },
              );
            }
          } else if (action === 'completeOffer') {
            const confirmedOffer =
              await this.sendRecieveOffersService.sendRecieveOffersRepository
                .findById(data.metadata.offerId)
                .populate('nft');

            console.log('Offer: ', confirmedOffer);

            //To be implemented in future
            // const res = await this.contractService.transferNftAndTokens(
            //   confirmedOffer.nft.tokenId,
            //   confirmedOffer.from,
            //   confirmedOffer.to.toString(),
            //   confirmedOffer.price,
            //   nftContractAddress,
            // );

            const response =
              await this.marketplaceService.marketplaceRepository.findByIdAndUpdate(
                confirmedOffer.nft,
                {
                  // ownerAddress: confirmedOffer.from,
                  ownerId: data.metadata.userId,
                },
              );
            console.log('Updated NFT Status Response: ', response);
            confirmedOffer.status = 'complete';
            return await confirmedOffer.save();
          }

          break;
        default:
          break;
      }
      res.json({ success: true, message: `Successfully Updated.` });
    } catch (error) {
      res.json({ success: false, message: `${error.message}` });
      console.log('error:', error);
      return;
    }
  }
}
