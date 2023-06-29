import { HttpService } from "./base.service";

class PaymentService extends HttpService {
  private readonly prefix: string = "payment";

  createCheckoutSession = (data: any): Promise<any> => this.post(`${this.prefix}/checkout`, data);
  
}

export const paymentService = new PaymentService();
