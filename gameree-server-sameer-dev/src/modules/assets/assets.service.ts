import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ASSETS_REPOSITORY } from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IAssetsDocument } from './assets.schema';

@Injectable()
export class AssetsService extends sharedCrudService {
  constructor(
    @Inject(ASSETS_REPOSITORY)
    readonly assetsRepository: Model<IAssetsDocument>,
  ) {
    super(assetsRepository);
  }

  async getUserAssets(page: number, query) {
    try {
      const resPerPage = 4;
      const [buildings, buildingsCount] = await Promise.all([
        await this.assetsRepository
          .find(query)
          .populate(
            'nft',
            'image address area geometry incAddress location image',
          )
          .populate('ownerId', 'username isActive')
          .sort({ updatedAt: -1 })
          .skip(resPerPage * page - resPerPage)
          .limit(resPerPage),
        await this.assetsRepository.find(query).count(),
      ]);

      return {
        buildings: buildings,
        current_page: page,
        pages: Math.ceil(buildingsCount / resPerPage),
        total_buildings: buildingsCount,
        per_page: resPerPage,
      };
    } catch (error) {
      return {
        buildings: [],
        current_page: 1,
        pages: 1,
        total_buildings: 0,
        per_page: 4,
      };
    }
  }
}
