import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY } from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { Model } from 'mongoose';
import { en } from 'src/locales/en';
import { I18nResolver } from 'i18n-ts';
import { IAccountDocument } from './account.schema';

const i18n = {
  en: en,
  default: en,
};
@Injectable()
export class AccountService extends sharedCrudService {
  public messages = new I18nResolver(i18n, 'en').translation;
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    readonly accountRepository: Model<IAccountDocument>,
  ) {
    super(accountRepository);
  }
}
