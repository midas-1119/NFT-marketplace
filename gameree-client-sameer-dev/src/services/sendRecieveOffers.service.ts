import axios from "axios";
import { HttpService } from "./base.service";

class SendRecieveOffersService extends HttpService {
  private readonly prefix: string = "sendRecieveOffers";

  sendOffer = (body: any): Promise<any> =>
    this.post(`${this.prefix}/add-offer`, body);
  getOffers = (body: any): Promise<any> =>
    this.post(`${this.prefix}/get-offers`, body);
  getSentOffers = (body: any): Promise<any> =>
    this.post(`${this.prefix}/get-sent-offers`, body);
  acceptOffer = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/accept-offer/${id}`, body);
  rejectOffer = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/reject-offer/${id}`, body);
  completePurchaseOffer = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/complete-purchase-offer/${id}`, body);
}

export const sendRecieveOffersService = new SendRecieveOffersService();
