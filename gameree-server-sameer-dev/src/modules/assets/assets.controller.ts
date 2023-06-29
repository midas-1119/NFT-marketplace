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
    UseGuards,
  } from '@nestjs/common';
  import { CommonServices } from '../shared/services/common.service';
import { AssetsService } from './assets.service';
  @Controller('marketplace')
  export class AssetsController extends CommonServices {
    constructor(
      private readonly assetsService: AssetsService,
    ) {
      super();
    }
   
}  