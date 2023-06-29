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
import { MarketplaceService } from './marketplace.service';
import { ActivityService } from '../activity/activity.service';
import { AssetsService } from '../assets/assets.service';
import { OldCollection } from '../../constants/oldColl';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { ContractService } from '../shared/services/contract.service';

import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

const nftContractAddress: string = process.env.NFT_CONTRACT_ADDRESS;

@Controller('marketplace')
export class MarketplaceController extends CommonServices {
  constructor(
    private readonly marketplaceService: MarketplaceService,
    private readonly activityService: ActivityService,
    private readonly assetsService: AssetsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly contractService: ContractService,
  ) {
    super();
  }

  // @Get('abc')
  // async sads(
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const response = await this.marketplaceService.marketplaceRepository.find()
  //     // console.log(response);
  //     for( let i = 0; i < response.length ; i++){
  //       const data : any = response[i]
  //       await this.marketplaceService.marketplaceRepository.findOneAndUpdate({
  //         _id: data._id,
  //         area : { $exists : true}
  //     }, {
  //         $set: {
  //           area : parseInt(data.price),
  //         }
  //     });
  //     }
  //     return this.sendResponse(
  //       this.messages.Success,
  //       {},
  //       HttpStatus.OK,
  //       res,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return this.sendResponse(
  //       'Error',
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  @Get('')
  async getMarketplaceItems(
    @Query() query,
    @Req() req,
    @Res() res: Response,
    @Body() body,
  ) {
    try {
      console.log('Inside Get Marketplace Items');
      const page = query.page ? Number(query.page) : 1;
      const resPerPage = query.resPerPage ? Number(query.resPerPage) : 6;
      const search = query.search ?? null;
      const priceMin = query.priceMin ? parseFloat(query.priceMin) : null;
      const priceMax = query.priceMax ? parseFloat(query.priceMax) : null;
      const plotMin = query.plotMin ? parseFloat(query.plotMin) : null;
      const plotMax = query.plotMax ? parseFloat(query.plotMax) : null;
      const range = query.range ? parseFloat(query.range) : null;
      const queryObj = { image: { $ne: '' } };
      const sortObj = {};
      const viewAll =
        query.viewAll === true || query.viewAll === 'true' ? true : false;

      let filtersArr: any = [];

      //Search
      if (search) {
        filtersArr.push({
          $or: [
            {
              'nft.address': { $regex: new RegExp(`${search}`), $options: 'i' },
            },
            { address: { $regex: new RegExp(`${search}`), $options: 'i' } },
          ],
        });
      }

      //Price ranges
      if (priceMin || priceMax) {
        filtersArr.push({
          price: {
            $gte: priceMin ?? 0,
            $lte: priceMax ?? 10000000,
          },
        });
      }

      //Range Slider
      if (range) {
        filtersArr.push({
          price: {
            $lte: range ?? 0,
          },
        });
      }

      //Plot size ranges
      if (plotMin || plotMax) {
        filtersArr.push({
          $or: [
            {
              'nft.area': {
                $gte: plotMin ?? 0,
                $lte: plotMax ?? 10000000,
              },
            },
            {
              area: {
                $gte: plotMin ?? 0,
                $lte: plotMax ?? 10000000,
              },
            },
          ],
        });
      }
      let filters: any = {};
      if (filtersArr.length > 0) {
        filters = {
          $and: [...filtersArr],
        };
      }

      const response = await this.marketplaceService.getMarketplaceNfts(
        page,
        queryObj,
        sortObj,
        resPerPage,
        filters,
        viewAll,
      );

      // console.log('Response: ', response);

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

  @Post('buy/:id')
  @UseGuards(JwtAuthGuard)
  async buyNFT(@Res() res: Response, @Req() req, @Body() body) {
    try {
      const response = await this.marketplaceService.buyNFT(req.params.id, {
        ownerId: req.user.userId,
        ownerAddress: body.ownerAddress,
        tokenId: body.tokenId,
      });

      console.log('Bought NFT: ', response);

      const data: any = {
        nft: req.params.id,
        type: 'buy',
        buyer: req.user.userId,
        to: body.to,
        from: body.from,
        hash: body.hash,
      };
      if (body.seller) data.seller = body.seller;
      const createActivity = await this.activityService.createActivity(data);
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

  @Post('mint/:id')
  @UseGuards(JwtAuthGuard)
  async mintNFT(@Res() res: Response, @Req() req, @Body() body) {
    try {
      const response = await this.marketplaceService.buyNFT(req.params.id, {
        ownerId: req.user.userId,
        ownerAddress: body.ownerAddress,
        tokenId: body.tokenId,
        creatorAddress: body.ownerAddress,
      });
      const data: any = {
        nft: req.params.id,
        type: 'mint',
        creatorAddress: req.user.userId,
        hash: body.hash,
      };
      if (body.seller) data.seller = body.seller;
      const createActivity = await this.activityService.createActivity(data);
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

  @Post('buy-nft-internal/:id')
  @UseGuards(JwtAuthGuard)
  async buyNFTInternal(@Res() res: Response, @Req() req, @Body() body) {
    console.log('Body: ', body);
    try {
      const nft = await this.marketplaceService.marketplaceRepository.findOne({
        _id: req.params.id,
        status: { $ne: 'minted' },
      });

      const response = await this.contractService.buyTokenFromTokenContract(
        nft.ownerAddress.toString(),
        body.ownerAddress,
        body.tokenId,
        nftContractAddress,
      );

      if (response.success) {
        console.log('Minting Response: ', response.receipt);

        const resp = await this.marketplaceService.buyNFT(req.params.id, {
          ownerId: req.user.userId,
          ownerAddress: body.ownerAddress,
          tokenId: body.tokenId,
        });

        const data: any = {
          nft: req.params.id,
          type: 'buy',
          buyer: req.user.userId,
          to: body.to,
          from: body.from,
          hash: body.hash,
        };
        if (body.seller) data.seller = body.seller;
        const createActivity = await this.activityService.createActivity(data);
        return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
      } else {
        console.log('Minting Failed');

        return this.sendResponse(
          'Error',
          {},
          HttpStatus.INTERNAL_SERVER_ERROR,
          res,
        );
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

  @Post('list/:id')
  @UseGuards(JwtAuthGuard)
  async listNFT(@Res() res: Response, @Req() req, @Body() body) {
    // console.log('Params Id: ', req.params.id);
    // console.log('Owner Id: ', req.user.userId);
    // console.log('Owner Address ID: ', body.ownerAddress);
    // console.log('Listing ID: ', body.listingId);
    // console.log('Listing Price: ', body.listingPrice);
    console.log('List: ', body);
    try {
      const response = await this.marketplaceService.listNFT(
        req.params.id,
        body,
      );
      const data: any = {
        nft: req.params.id,
        type: 'list',
        // buyer: req.user.userId,
        // to: body.to,
        // from: body.from,
        hash: response.transactionHash,
      };
      if (body.seller) data.seller = body.seller;
      const createActivity = await this.activityService.createActivity(data);
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

  @Post('unlist/:id')
  @UseGuards(JwtAuthGuard)
  async unlistNFT(@Res() res: Response, @Req() req, @Body() body) {
    console.log('Params Id: ', req.params.id);

    // console.log('Unlist Id: ', req.params.id);
    console.log('Body: ', body);
    try {
      const response = await this.marketplaceService.unlistNFT(req.params.id, {
        listingId: body.listingId,
      });

      const data: any = {
        nft: req.params.id,
        type: 'unlist',
        // buyer: req.user.userId,
        // to: body.to,
        // from: body.from,
        hash: body.hash,
      };
      if (body.seller) data.seller = body.seller;
      const createActivity = await this.activityService.createActivity(data);
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

  @Post('place-bid/:id')
  // @UseGuards(JwtAuthGuard)
  async placeBid(@Res() res: Response, @Req() req, @Body() body) {
    console.log('Place Bid: ', body);
    try {
      const response = await this.marketplaceService.placeBid(
        req.params.id,
        body,
      );
      const data: any = {
        nft: req.params.id,
        type: 'bid',
        // buyer: req.user.userId,
        // to: body.to,
        // from: body.from,
        hash: body.hash,
      };
      if (body.seller) data.seller = body.seller;
      const createActivity = await this.activityService.createActivity(data);
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

  @Post('getBidsByListingId')
  // @UseGuards(JwtAuthGuard)
  async getBidsByListingId(@Res() res: Response, @Req() req, @Body() body) {
    // console.log('Params Id: ', req.params.id);
    // console.log('Listing ID: ', body.listingId);

    console.log('getBidsByListingId: ', body);
    try {
      const response = await this.marketplaceService.getBidsByListingId(body);

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

  @Post('getSentBids')
  // @UseGuards(JwtAuthGuard)
  async getSentBids(@Res() res: Response, @Req() req, @Body() body) {
    console.log('getSentBids: ', body);
    try {
      const response = await this.marketplaceService.getSentBids(body);

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

  @Post('getUserAuctions')
  // @UseGuards(JwtAuthGuard)
  async getUserAuctions(@Res() res: Response, @Req() req, @Body() body) {
    console.log('getUserAuctions: ', body);
    try {
      const response = await this.marketplaceService.getUserAuctions(body);

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

  @Post('getListing/:id')
  @UseGuards(JwtAuthGuard)
  async getListing(@Res() res: Response, @Req() req, @Body() body) {
    // console.log('Params Id: ', req.params.id);
    // console.log('Listing ID: ', body.listingId);

    console.log('List: ', body);
    try {
      const response = await this.marketplaceService.getListing(
        req.params.id,
        body,
      );

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

  @Get('featured')
  async getFeaturedNfts(@Res() res: Response) {
    try {
      const response = await this.marketplaceService.getFeaturedNfts();
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

  @Get('most-featured')
  async getMostFeaturedNft(@Res() res: Response) {
    try {
      const response = await this.marketplaceService.getFeaturedNft();
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

  @Get('similar')
  async getSimilarNfts(@Res() res: Response) {
    try {
      const response = await this.marketplaceService.getYouMayAlsoLike();
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

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserNFTs(@Res() res: Response, @Req() req, @Query() query) {
    console.log('Log: ', query);
    try {
      // if (!req.user?.metamaskId) {
      //   return this.sendResponse(
      //     this.messages.Success,
      //     {
      //       buildings: [],
      //       current_page: 1,
      //       pages: 1,
      //       total_buildings: 0,
      //       per_page: 4,
      //     },
      //     HttpStatus.OK,
      //     res,
      //   );
      // }
      const type = query.type ?? 'minted';
      const page = Number(query.page) ?? 1;
      if (type === 'assets') {
        const resp = await this.marketplaceService.getUserTokens(page, {
          ownerId: req.user.userId,
        });
        return this.sendResponse(
          this.messages.Success,
          resp,
          HttpStatus.OK,
          res,
        );
      }
      const response = await this.marketplaceService.getUserNfts(
        page,
        type,
        req.user.userId,
      );
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

  @Get('user/nftsvalue')
  @UseGuards(JwtAuthGuard)
  async getUserNFTsValue(@Res() res: Response, @Req() req, @Query() query) {
    try {
      const resp = await this.marketplaceService.getUserTokensValue(
        req.user.userId,
      );
      return this.sendResponse(this.messages.Success, resp, HttpStatus.OK, res);
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
  @Get('user/dashboard')
  @UseGuards(JwtAuthGuard)
  async getUserDashboard(@Res() res: Response, @Req() req, @Query() query) {
    try {
      const resp = await this.marketplaceService.getUserDashboard(
        req.user.userId,
      );
      return this.sendResponse(this.messages.Success, resp, HttpStatus.OK, res);
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

  @Get('activity/:id')
  async getNftActivity(@Res() res: Response, @Req() req) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const response = await this.marketplaceService.getUserListingActivity(
        page,
        req.params.id,
      );
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

  @Get('location/:id')
  async getByPosition(@Res() res: Response, @Req() req) {
    try {
      const id = req.params.id;

      const response = await this.marketplaceService.getByLocationId(id);
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

  // @Get('update-records/:id')
  // async updaterecords(
  //   @Res() res: Response,
  //   @Req() req,
  // ) {
  //   try {
  //     const response : any = await this.marketplaceService.tokenRepository.findOne({ _id: req.params.id})
  //     const resp = await axios.get(
  //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${response.location.lng},${response.location.lat}.json?limit=1&access_token=pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg`
  //     )
  //       .then((data: any) => {
  //         console.log(data);

  //         return data.data
  //       })
  //       .then( async ( json : any ) => {
  //         console.log(json.features[0]);

  //         const response = await this.marketplaceService.tokenRepository.findByIdAndUpdate(req.params.id,{
  //           id: json.features[0].id
  //         })
  //         return this.sendResponse(
  //           this.messages.Success,
  //           response,
  //           HttpStatus.OK,
  //           res,
  //         );
  //       })
  //       .catch((e) => {
  //         console.log(e)
  //         return this.sendResponse(
  //           'Error',
  //           {},
  //           HttpStatus.INTERNAL_SERVER_ERROR,
  //           res,
  //         );
  //       })

  //   } catch (error) {
  //     console.log(error);
  //     return this.sendResponse(
  //       'Error',
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  @Get('newly-minted')
  @UseGuards(JwtAuthGuard)
  async getUserNewlyMinted(@Res() res: Response, @Req() req) {
    try {
      if (!req.user?.metamaskId) {
        return this.sendResponse(this.messages.Success, [], HttpStatus.OK, res);
      }
      const response = await this.marketplaceService.getNewlyMinted(
        req.user?.metamaskId,
      );
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

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getUserStats(@Res() res: Response, @Req() req) {
    try {
      const id = req.user?.metamaskId;
      if (!id) {
        return this.sendResponse(
          this.messages.Success,
          {
            ownedPlots: 0,
            tokens: 0,
            totalValue: {
              _id: null,
              count: 0,
              total: 0,
            },
          },
          HttpStatus.OK,
          res,
        );
      }
      const response = await this.marketplaceService.getUserDashboardStats(id);
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

  @Get(':id')
  async getById(@Res() res: Response, @Req() req) {
    try {
      const response = await this.marketplaceService.getById(req.params.id);
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

  @Post('updatePrices')
  async UpdateCOllection(@Req() Req, @Res() res) {
    try {
      const market = await this.marketplaceService.marketplaceRepository.find();
      console.log('length:-=-=-=', market.length);
      let array = [];
      let totalPrice = 0;
      for (let m of market) {
        let price;
        if (m.area) {
          const minPrice = 300,
            maxPrice = 2500,
            maxArea = 20000,
            minArea = 43;
          price =
            minPrice +
            ((Number(m.area) - minArea) * (maxPrice - minPrice)) /
              (maxArea - minArea);
          totalPrice = price + totalPrice;
          const upd =
            await this.marketplaceService.marketplaceRepository.findByIdAndUpdate(
              m._id,
              { price: Number(price.toFixed(0)) },
              { new: true },
            );
          // console.log("price:-=-=-=", price, "area:-=-=-=", m.area, "add:-=-=-=", m.address, "_id", m._id)
        }
        console.log(
          'price:-=-=-=',
          price,
          'area:-=-=-=',
          m.area,
          'add:-=-=-=',
          m.address,
          '_id',
          m._id,
        );

        // if (m.area > 500) {
        //   let fixRate = 1900
        //   let marFactor = 1000
        //   let price = (Number(m.area) * fixRate) / marFactor
        //   if (!isNaN(price)) totalPrice = price + totalPrice

        //   console.log("price:-=-=-=", price, "area:-=-=-=", m.area, "add:-=-=-=", m.address)
        //   // const upd = await this.marketplaceService.marketplaceRepository.findByIdAndUpdate(m._id, { price: Math.floor(Math.random() * (1000 - 600) + 600) }, { new: true })
        // }

        // if (m.area > 300 && m.area < 500) {
        //   let fixRate = 1900
        //   let marFactor = 200
        //   let price = (Number(m.area) * fixRate) / marFactor
        //   if (!isNaN(price)) totalPrice = price + totalPrice

        //   console.log("price:-=-=-=", price, "area:-=-=-=", m.area, "add:-=-=-=", m.address)
        //   // console.log("price:-=-=-=", Math.floor(Math.random() * (500 - 300) + 300), "area:-=-=-=", m.area)
        //   // const upd = await this.marketplaceService.marketplaceRepository.findByIdAndUpdate(m._id, { price: Math.floor(Math.random() * (500 - 300) + 300) }, { new: true })
        // }
        // // const upd = await this.marketplaceService.marketplaceRepository.findByIdAndUpdate(m._id, { price: Math.floor(Math.random() * (500 - 300) + 300) }, { new: true })

        // if (m.area > 200 && m.area < 300) {
        //   let fixRate = 1900
        //   let marFactor = 100
        //   let price = (Number(m.area) * fixRate) / marFactor
        //   if (!isNaN(price)) totalPrice = price + totalPrice

        //   console.log("price:-=-=-=", price, "area:-=-=-=", m.area, "add:-=-=-=", m.address)
        //   // console.log("price:-=-=-=", Math.floor(Math.random() * (250 - 100) + 100), "area:-=-=-=", m.area)
        //   // const upd = await this.marketplaceService.marketplaceRepository.findByIdAndUpdate(m._id, { price: Math.floor(Math.random() * (250 - 100) + 100) }, { new: true })

        // }

        array.push(m.area);
      }

      // console.log("totalPrice:-=-=", totalPrice)

      return this.sendResponse(
        this.messages.Success,
        { array },
        HttpStatus.OK,
        res,
      );

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

  @Post('addnft')
  async addNftToDatabase(@Res() res: Response, @Req() req) {
    try {
      return this.sendResponse(
        this.messages.Success,
        await this.marketplaceService.addNft(req?.body),
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

  @Post('reset-marketplace')
  async resetMarketPlace(@Res() res: Response, @Req() req) {
    try {
      return this.sendResponse(
        this.messages.Success,
        await this.marketplaceService.addRawNft(),
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
}
