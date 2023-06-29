import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  BID_REPOSITORY,
  LISTING_REPOSITORY,
  MARKETPLACE_REPOSITORY,
  TOKEN,
  TOKEN_REPOSITORY,
  MARKETPLACE,
  BID,
} from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IMarketplaceDocument } from './marketplace.schema';
import mongoose, { Model } from 'mongoose';
import { en } from 'src/locales/en';
import { I18nResolver } from 'i18n-ts';
import { IListingDocument } from './listings.schema';
import { ITokenDocument } from './tokens.schema';
import { IBidDocument } from './bids.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { ContractService } from '../shared/services/contract.service';
const i18n = {
  en: en,
  default: en,
};

import { v4 as uuidv4 } from 'uuid';

const platformOwnerAddress: string = process.env.OWNER_ADDRESS;

@Injectable()
export class MarketplaceService extends sharedCrudService {
  public messages = new I18nResolver(i18n, 'en').translation;
  constructor(
    private readonly contractService: ContractService,
    @Inject(MARKETPLACE_REPOSITORY)
    readonly marketplaceRepository: Model<IMarketplaceDocument>,
    @Inject(LISTING_REPOSITORY)
    readonly listingRepository: Model<IListingDocument>,
    @Inject(TOKEN_REPOSITORY)
    readonly tokenRepository: Model<ITokenDocument>,
    @Inject(BID_REPOSITORY)
    readonly bidRepository: Model<IBidDocument>,
  ) {
    super(marketplaceRepository);
  }

  async addNft(data: any) {
    try {
      return await this.marketplaceRepository.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addRawNft() {
    try {
      console.log('Hello world!');
      await this.marketplaceRepository.deleteMany({});
      fs.createReadStream('src/uploads/marketplaces_Price_Type.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => console.error(error))
        .on('data', async (row) => {
          await this.marketplaceRepository.create({
            address: row.address,
            area: row.area,
            geometry: row.geometry,
            incAddress: row.incAddress,
            location: {
              lng: row.locationlng,
              lat: row.locationlat,
            },
            price: row.price,
            image: row.image,
            type: row.type,
          });
        })
        .on('end', (rowCount: number) =>
          console.log(`Parsed ${rowCount} rows`),
        );
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMarketplaceNfts(
    page: number = 1,
    query,
    sort,
    resPerPage,
    filters,
    viewAll,
  ) {
    //Auction Check

    await this.updateActiveAuctions();

    let skip = (Number(page) - 1) * Number(resPerPage);
    let limit = Number(resPerPage);

    const [buildings, count] = await Promise.all([
      this.marketplaceRepository.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'ownerId',
          },
        },
        { $unwind: { path: '$ownerId', preserveNullAndEmptyArrays: true } },
        {
          $match: filters,
        },
        {
          $match: query,
        },
        { $sort: { type: -1, createdAt: -1 } },
        ...(viewAll ? [] : [{ $skip: skip }]),
        ...(viewAll ? [] : [{ $limit: limit }]),
      ]),
      this.marketplaceRepository.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'ownerId',
          },
        },
        { $unwind: { path: '$ownerId', preserveNullAndEmptyArrays: true } },
        {
          $match: filters,
        },
        {
          $match: query,
        },
        { $sort: { type: -1, createdAt: -1 } },
        ...(viewAll ? [] : [{ $skip: skip == 0 ? limit : skip }]),
        ...(viewAll ? [] : [{ $limit: limit }]),
      ]),
    ]);

    // const buildings = await this.marketplaceRepository
    //   .find()
    //   .sort({ _id: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .populate('ownerId', 'username isActive')
    //   .lean();

    for (const [index, building] of buildings.entries()) {
      if (building.status === 'listed') {
        // console.log('Listed');
        building.listing = await this.listingRepository
          .findOne({
            nft: building._id,
            listingId: building.listingId,
          })
          .populate('highestBiddingId');
        // console.log('Building: ', building);
      }
    }

    // console.log('BUILDIGNS: ', buildings);

    return {
      buildings: buildings,
      current_page: page,
      per_page: resPerPage,
      next: count,
    };
  }

  async getFeaturedNfts() {
    return await this.marketplaceRepository
      .find({ image: { $ne: '' }, status: { $ne: 'minted' } })
      .populate('ownerId', 'fullName username')
      .sort({ sequence: 1 })
      .limit(8);
  }

  async getFeaturedNft() {
    const record = await this.marketplaceRepository
      .find({ image: { $ne: '' }, status: { $ne: 'minted' } })
      .populate('ownerId', 'fullName username')
      .sort({ sequence: 1 })
      .limit(1);
    return record.length > 0 ? record[0] : null;
  }

  async getYouMayAlsoLike() {
    return await this.marketplaceRepository
      .find({ image: { $ne: '' }, status: { $ne: 'minted' } })
      .populate('ownerId', 'fullName username')
      .sort({ sequence: 1 })
      .limit(4);
  }

  async buyNFT(id, data) {
    console.log('Data: ', data);
    // return await this.marketplaceRepository.findByIdAndUpdate(id, {
    //   ...data,
    //   status: 'minted',
    // });

    const boughtNft = await this.marketplaceRepository.findById(id);

    const listingId = boughtNft.listingId;

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        boughtNft[key] = data[key];
      }
    }

    boughtNft.status = 'minted';
    boughtNft.listingId = '';

    await this.listingRepository.findOneAndUpdate(
      {
        listingId: listingId,
      },
      { isActive: false, soldTo: data.ownerAddress },
    );

    return await boughtNft.save();
  }

  async listNFT(id, data) {
    console.log('Data: ', data);

    const nft = await this.marketplaceRepository.findById(id);

    let response = null;

    if (data.type === 'FIXED') {
      if (nft.ownerAddress === platformOwnerAddress) {
        response = await this.contractService.listToken(
          data,
          data.listingPrice,
          nft.creatorAddress,
        );
        data.listingId = response.listingId;
        data.hash = response.hash;
      } else {
      }
    } else {
      data.listingId = 'None';
      data.hash = 'None';
    }

    await this.marketplaceRepository.findByIdAndUpdate(id, {
      royalty: data.royalty ?? 0,
      status: 'listed',
      listingId: data.listingId,
      price: data.listingPrice,
    });

    const listingData = {
      nft: id,
      transactionHash: data.hash,
      from: nft.ownerAddress,
      listingId: data.listingId,
      sellMode: data.type,
      price: data.listingPrice,
      startTime: data.startTime,
      duration: data.duration,
      isActive: true,
    };

    return await this.listingRepository.create(listingData);
  }

  async unlistNFT(id, data) {
    console.log('Data: ', data);

    const nft = await this.marketplaceRepository.findById(id);

    if (nft.ownerAddress === platformOwnerAddress) {
      await this.contractService.unlistToken(data.listingId);
    }

    await this.listingRepository.findOneAndUpdate(
      {
        listingId: data.listingId,
      },
      { isActive: false },
    );

    return await this.marketplaceRepository.findByIdAndUpdate(id, {
      status: 'minted',
      listingId: '',
    });
  }

  async placeBid(id, data) {
    console.log('Data: ', data);

    const listing = await this.listingRepository.findOne({
      nft: id,
      isActive: true,
    });

    console.log('Listing: ', listing);

    const biddingData = {
      bidder: data.bidder,
      biddingId: uuidv4(),
      transactionHash: 'None',
      listing: listing._id,
      price: data.price,
      isActive: true,
      isWin: false,
      isClaimed: false,
    };

    const bid = await this.bidRepository.create(biddingData);

    listing.highestBiddingId = bid._id;
    await listing.save();

    // await this.listingRepository.findOneAndUpdate(
    //   {
    //     nft: id,
    //     listingId: data.listingId,
    //   },
    //   { highestBiddingId: bid._id },
    // );

    return bid;
  }

  async getListing(id, data) {
    console.log('Data: ', data);
    return await this.listingRepository
      .findOne({
        nft: id,
        listingId: data.listingId,
      })
      .populate('highestBiddingId');
  }

  async updateActiveAuctions() {
    const activeAuctionedListings = await this.listingRepository
      .find({
        sellMode: 'AUCTION',
        isActive: true,
        endTime: { $exists: false },
      })
      .populate('nft')
      .populate('highestBiddingId');

    for (let i = 0; i < activeAuctionedListings.length; i++) {
      console.log(
        'Active Auction Check: ',
        activeAuctionedListings[i].listingId,
      );

      const startTime = Number(activeAuctionedListings[i].startTime);
      const duration = Number(activeAuctionedListings[i].duration);

      const endTime = startTime + duration;

      const currentTime = Math.floor(new Date().getTime() / 1000);
      const timeLeft = endTime - currentTime;

      // console.log('Time Left: ', timeLeft);

      if (timeLeft > 0) {
        console.log('Auction not ended: ', timeLeft);

        const hours = Math.floor(timeLeft / 3600); // 0 / 3600 = 0
        const minutes = Math.floor((timeLeft % 3600) / 60); // (0 % 3600) / 60 = 0
        const seconds = timeLeft % 60;

        console.log('Time readable: ', hours, minutes, seconds);
      } else {
        console.log('Auction ended: ', timeLeft);

        if (activeAuctionedListings[i].highestBiddingId) {
          console.log('Bidders exists');

          //Declaring Winner
          activeAuctionedListings[i].highestBiddingId.isActive = false;
          activeAuctionedListings[i].highestBiddingId.isWin = true;
          await activeAuctionedListings[i].highestBiddingId.save();

          //Declaring losers
          const lostBidders = await this.bidRepository.find({
            listingId: activeAuctionedListings[i].listingId,
            isActive: true,
            isWin: false,
          });

          for (let j = 0; j < lostBidders.length; j++) {
            lostBidders[j].isActive = false;
            await lostBidders[j].save();
          }
        } else {
          console.log('Bidders dont exist');
        }

        activeAuctionedListings[i].endTime = endTime.toString();
        await activeAuctionedListings[i].save();
      }
    }
  }

  async getBidsByListingId(data) {
    console.log('Data: ', data);
    return await this.bidRepository
      .find({
        listing: data.listingId,
      })
      .populate('bidder');
  }

  async getSentBids(data) {
    console.log('Data: ', data);
    const sentBids = await this.bidRepository
      .find({
        bidder: data.bidder,
      })
      .populate({
        path: 'listing',
        populate: {
          path: 'nft highestBiddingId',
        },
      });
    // .populate('bidder');

    // for (let i = 0; i < sentBids.length; i++) {
    //   const listing = await this.listingRepository
    //     .findOne({
    //       listingId: sentBids[i].listingId,
    //     })
    //     .populate('nft')
    //     .populate('highestBiddingId');
    //   sentBids[i].listing = listing;
    // }

    return sentBids;
  }

  async getUserAuctions(data) {
    console.log('Data: ', data);

    const userAuctions = await this.listingRepository.aggregate([
      {
        $match: {
          isActive: true,
          sellMode: 'AUCTION',
        },
      },
      {
        $lookup: {
          from: 'marketplaces',
          localField: 'nft',
          foreignField: '_id',
          as: 'nft',
        },
      },
      {
        $unwind: '$nft',
        // preserveNullAndEmptyArrays: true,
      },
      {
        $match: {
          'nft.ownerId': new mongoose.Types.ObjectId(data.ownerId),
        },
      },
      {
        $lookup: {
          from: 'bids',
          localField: 'highestBiddingId',
          foreignField: '_id',
          as: 'highestBiddingId',
        },
      },
      {
        $unwind: {
          path: '$highestBiddingId',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    console.log('User Auctions: ', userAuctions);

    return userAuctions;
  }

  async getUserNfts(page: number, type, owner) {
    console.log('Inside: ', page, type, owner);
    let query = {};
    if (type === 'minted' || type === 'owned' || type === 'listed') {
      if (type === 'owned')
        query = {
          ownerId: owner,
          // creater: { $not: { $regex: owner, $options: 'i' } },
        };
      else if (type === 'minted')
        query = {
          ownerId: owner,
          // creater: { $regex: owner, $options: 'i' },
        };
      else if (type === 'listed') {
        query = {
          ownerId: owner,
          status: 'listed',
        };
      }
      return await this.getUserTokens(page, query);
    }
    if (type === 'listed') {
      query = { from: { $regex: owner, $options: 'i' } };
    }
    if (type === 'sold') {
      query = {
        from: { $regex: owner, $options: 'i' },
        isActive: false,
        status: 'SOLD',
      };
    }
    return await this.getUserListings(page, query);
  }

  async getUserTokens(page: number, query) {
    console.log('Query: ', query);
    const resPerPage = 4;
    const [buildings, buildingsCount] = await Promise.all([
      await this.marketplaceRepository
        .find(query)
        .sort({ updatedAt: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage)
        .populate('ownerId', 'username isActive'),

      await this.marketplaceRepository.find(query).count(),
    ]);

    for (const [index, building] of buildings.entries()) {
      if (building.status === 'listed') {
        // console.log('Listed');
        building.listing = await this.listingRepository
          .findOne({
            nft: building._id,
            listingId: building.listingId,
          })
          .populate('highestBiddingId');
        // console.log('Building: ', building);
      }
    }

    return {
      buildings: buildings,
      current_page: page,
      pages: Math.ceil(buildingsCount / resPerPage),
      total_buildings: buildingsCount,
      per_page: resPerPage,
    };
  }

  async getUserTokensValue(userId) {
    const data = await this.marketplaceRepository.aggregate([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $group: { _id: null, price: { $sum: '$price' } } },
      { $unset: ['_id'] },
    ]);
    return data[0];
  }

  async getUserDashboard(userId) {
    const nfts = await this.marketplaceRepository
      .find({
        ownerId: userId,
      })
      .lean();
    return nfts?.reverse();
  }

  async getNewlyMinted(owner) {
    const query = {
      owner: { $regex: owner, $options: 'i' },
      creater: { $regex: owner, $options: 'i' },
    };
    return await this.tokenRepository.find(query).limit(2);
  }

  async getUserListings(page: number, query) {
    const resPerPage = 4;
    const [buildings, buildingsCount] = await Promise.all([
      await this.listingRepository
        .find(query)
        .populate(
          'nft',
          'image address area geometry incAddress location image',
        )
        .sort({ updatedAt: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage),
      await this.listingRepository.find(query).count(),
    ]);

    return {
      buildings: buildings,
      current_page: page,
      pages: Math.ceil(buildingsCount / resPerPage),
      total_buildings: buildingsCount,
      per_page: resPerPage,
    };
  }

  async getUserListingActivity(page: number, nftId) {
    const resPerPage = 5;
    const [buildings, buildingsCount] = await Promise.all([
      await this.listingRepository
        .find({ nft: nftId, status: 'SOLD' })
        .populate(
          'nft',
          'image address area geometry incAddress location image',
        )
        .sort({ createdAt: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage),
      await this.listingRepository.find({ nft: nftId, status: 'SOLD' }).count(),
    ]);

    return {
      buildings: buildings,
      current_page: page,
      pages: Math.ceil(buildingsCount / resPerPage),
      total_buildings: buildingsCount,
      per_page: resPerPage,
    };
  }

  async getById(id) {
    let bids = [];
    let response: any = await this.marketplaceRepository
      .findById(id)
      .populate('ownerId', 'username isActive');
    console.log('response ', response);
    if (!response) {
      response = await this.listingRepository.findById(id).populate('nft');
      console.log('response1 ', response);

      if (!response) {
        response = await this.tokenRepository.findById(id);
        console.log('response 2', response);
      } else {
        if (response.sellMode === '1') {
          console.log('response3 ', response);

          bids = await this.bidRepository
            .find({
              isActive: true,
              listingId: response.listingId,
            })
            .sort({
              createdAt: 1,
            });
        }
      }
    }
    return { nft: response, bids: bids };
  }

  async getByLocationId(id: string) {
    let response;
    response = await this.marketplaceRepository
      .findOne({ _id: id })
      .populate('ownerId', 'username isActive');
    if (!response) {
      response = await this.tokenRepository.findOne({ id: id });
      if (!response) {
        response = await this.getFromListingRepo(id);
      } else {
        return response[0];
      }
    }
    return response;
  }

  async getFromListingRepo(id) {
    return await this.listingRepository.aggregate([
      {
        $lookup: {
          from: 'tokens',
          localField: 'nft',
          foreignField: '_id',
          as: 'nft',
        },
      },
      { $match: { isActive: true, 'nft.id': id } },
      { $limit: 1 },
      { $unwind: '$nft' },
    ]);
  }

  async getUserDashboardStats(owner: string) {
    const [ownedPlots, tokens, listed, tradedValue] = await Promise.all([
      await this.tokenRepository
        .find({
          owner: { $regex: owner, $options: 'i' },
          creater: { $not: { $regex: owner, $options: 'i' } },
        })
        .count(),
      await this.tokenRepository
        .find({ owner: { $regex: owner, $options: 'i' } })
        .count(),
      await this.listingRepository
        .find({ from: { $regex: owner, $options: 'i' }, isActive: true })
        .count(),
      await this.listingRepository.aggregate([
        {
          $match: {
            $or: [
              { from: { $regex: owner, $options: 'i' } },
              { soldTo: { $regex: owner, $options: 'i' } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: { $sum: '$price' },
          },
        },
      ]),
    ]);
    let totalValue = {
      _id: null,
      count: 5,
      total: 0.042,
    };
    if (tradedValue.length > 0) totalValue = tradedValue[0];
    return {
      ownedPlots,
      tokens: tokens + listed,
      totalValue,
    };
  }
}
