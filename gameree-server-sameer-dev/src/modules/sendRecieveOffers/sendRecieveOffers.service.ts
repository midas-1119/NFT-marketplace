import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  BID_REPOSITORY,
  LISTING_REPOSITORY,
  MARKETPLACE_REPOSITORY,
  TOKEN,
  TOKEN_REPOSITORY,
  SEND_RECIEVE_OFFERS_REPOSITORY,
} from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { ISendRecieveOffersDocument } from './sendRecieveOffers.schema';
import { Model } from 'mongoose';
import { en } from 'src/locales/en';
import { I18nResolver } from 'i18n-ts';
import { IMarketplaceDocument } from '../marketplace/marketplace.schema';
// import { IListingDocument } from './listings.schema';
// import { ITokenDocument } from './tokens.schema';
// import { IBidDocument } from './bids.schema';
import { ContractService } from '../shared/services/contract.service';

import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

const marketplaceContractAddress: string =
  process.env.MARKETPLACE_CONTRACT_ADDRESS;

const nftContractAddress: string = process.env.NFT_CONTRACT_ADDRESS;

const platformOwnerAddress: string = process.env.OWNER_ADDRESS;

const i18n = {
  en: en,
  default: en,
};
@Injectable()
export class SendRecieveOffersService extends sharedCrudService {
  public messages = new I18nResolver(i18n, 'en').translation;
  constructor(
    @Inject(SEND_RECIEVE_OFFERS_REPOSITORY)
    readonly sendRecieveOffersRepository: Model<ISendRecieveOffersDocument>,

    @Inject(MARKETPLACE_REPOSITORY)
    readonly marketplaceRepository: Model<IMarketplaceDocument>,

    private readonly contractService: ContractService,
  ) {
    super(sendRecieveOffersRepository);
  }

  async getOffers(query) {
    const offers = await this.sendRecieveOffersRepository
      .find(query)
      .populate('nft')
      .populate('to')
      .populate('from');

    return {
      offers: offers,
      // current_page: page,
      // per_page: resPerPage,
      // next: count,
    };
  }

  async acceptOffer(id) {
    const acceptedOffer = await this.sendRecieveOffersRepository
      .findById(id)
      .populate('nft')
      .populate('to')
      .populate('from');

    //To implemented in future
    // if (acceptedOffer.to.isMetamaskUser) {
    // const response = await this.contractService.transferOwnershipViaAdmin(
    //   acceptedOffer.listingId,
    //   acceptedOffer.to,
    //   marketplaceContractAddress,
    // );
    // }

    acceptedOffer.status = 'accepted';
    await acceptedOffer.save();
    const rejectedOffers = await this.sendRecieveOffersRepository.find({
      listingId: acceptedOffer.listingId,
      status: 'pending',
    });

    //Rejecting all other offers against the listing
    rejectedOffers.forEach(async (rejectedOffer, index) => {
      rejectedOffer.status = 'rejected';
      await rejectedOffer.save();
    });

    return true;
  }

  async rejectOffer(id) {
    return await this.sendRecieveOffersRepository.findByIdAndUpdate(id, {
      status: 'rejected',
    });
  }

  async completePurchaseOffer(id, userId) {
    //   const confirmedOffer = await this.sendRecieveOffersRepository
    //     .findById(id)
    //     .populate('nft');
    //   console.log('Offer: ', confirmedOffer);
    //   const res = await this.contractService.transferNftAndTokens(
    //     confirmedOffer.nft.tokenId,
    //     confirmedOffer.from,
    //     confirmedOffer.to.toString(),
    //     confirmedOffer.price,
    //     nftContractAddress,
    //   );
    //   if (res.success) {
    //     const response = await this.marketplaceRepository.findByIdAndUpdate(
    //       confirmedOffer.nft,
    //       {
    //         ownerAddress: confirmedOffer.from,
    //         ownerId: userId,
    //       },
    //     );
    //     console.log('Updated NFT Status Response: ', response);
    //     confirmedOffer.status = 'complete';
    //     return await confirmedOffer.save();
    //   }
  }
}
