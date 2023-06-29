import { Module } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { AssetsService } from '../assets/assets.service';
import { DatabaseModule } from '../database/database.module';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { ContractService } from '../shared/services/contract.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MarketplaceController],
  providers: [
    MarketplaceService,
    ActivityService,
    AssetsService,
    CloudinaryService,
    ContractService,
  ],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
