import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ACTIVITY_REPOSITORY } from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IActivityDocument } from './activity.schema';

@Injectable()
export class ActivityService extends sharedCrudService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    readonly activityRepository: Model<IActivityDocument>,
  ) {
    super(activityRepository);
  }

  async createActivity(data: any) {
    return await this.activityRepository.create(data);
  }

  // async getAllActivities(page, resPerPage) {

  //   const [activities, activitiesCount] = await Promise.all([
  //     this.activityRepository.find().populate('meme')
  //     .skip(resPerPage * page - resPerPage)
  //     .limit(resPerPage)
  //     .sort({ createdAt: -1 }),
  //     this.activityRepository.find().populate('meme').sort({ createdAt: -1 })
  //     .count()
  //   ])

  //   const activityResp = {
  //     activities: activities,
  //     current_page: page,
  //     pages: Math.ceil(activitiesCount / resPerPage),
  //     total_activities: activitiesCount,
  //     per_page: resPerPage
  //   }

  //   return activityResp
  //   // return await this.activityRepository.find().populate('meme').sort({ createdAt: -1 })
  // }
}
