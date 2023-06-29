import { Injectable } from '@nestjs/common';
import { en } from 'src/locales/en';
import { I18nResolver } from 'i18n-ts';

const i18n = {
  en: en,
  default: en,
};
@Injectable()
export class sharedCrudService {
  private service;
  public messages = new I18nResolver(i18n, 'en').translation;
  constructor(private serviceObj) {
    // super();
    this.service = serviceObj;
  }
  sharedCreate = (body) => {
    return this.service.create(body);
  };
  sharedUpdate = (clause, body) => {
    return this.service.updateOne(clause, body);
  };
  sharedFindOne = (clause) => {
    return this.service.findOne(clause);
  };
  sharedFind = (clause) => {
    return this.service.find(clause);
  };
  sharedDelete = (clause) => {
    return this.service.deleteOne(clause);
  };
}
