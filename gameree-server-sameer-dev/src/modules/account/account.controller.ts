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
import { AccountService } from './account.service';

@Controller('account')
export class AccountController extends CommonServices {
    constructor(
        private readonly accountService: AccountService,
    ) {
        super();
    }


}
