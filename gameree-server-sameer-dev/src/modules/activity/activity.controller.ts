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
import { ActivityService } from './activity.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonServices } from '../shared/services/common.service';
import { AwsService } from '../shared/services/aws.service';

@Controller('activity')
export class ActivityController extends CommonServices {
  constructor(
    private readonly activityService: ActivityService,
  ) {
    super();
  }

  // @Get('all-activities')
  // async getGenesisMemes(@Req() req: any, @Res() res: Response, @Query() query): Promise<any> {
  //   try {
  //     const page = Number(query.page);
  //     const resPerPage = Number(query.resPerPage);
  //     const activities = await this.activityService.getAllActivities(page,resPerPage);
  //     return this.sendResponse(
  //       this.messages.Success,
  //       activities,
  //       HttpStatus.OK,
  //       res,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return this.sendResponse(
  //       this.messages.Error,
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }
}
