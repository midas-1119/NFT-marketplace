import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe = new Stripe.Stripe(
    'sk_test_51LkYLBCyK2yIIm5orKsT8wjiVs01RmHfSs7F0xF0LvkXcgpAWWrIzB2nUT3qASqsWp5SZVhhfizcaAHyhXI74hdN00PstE7NsM',
    // 'sk_test_51MkDoLKFWLKLmDZvk1vXxSSFFnWVLSaJbCi8PffZ1xAdGwurDWueh6GrJnqCAD2A2HM1F7Vz8XuLR8XYzcIemALk002gIX2T5N',
    {
      apiVersion: '2022-11-15',
    },
  );

  //dummy change

  /**
   * create price on stripe
   * @param body
   */
  async createStripePrice(
    body: Stripe.PriceCreateParams,
    interval: Stripe.PriceCreateParams.Recurring.Interval,
  ) {
    return await this.stripe.prices.create({
      nickname: body.nickname,
      currency: body.currency,
      product: body.product,
      unit_amount: body.unit_amount,
      recurring: {
        interval: interval,
      },
    });
  }

  /**
   * create stripe customer
   * @param body
   */
  async createStripeCustomer(body: Stripe.CustomerCreateParams) {
    try {
      return await this.stripe.customers.create({
        name: body.name,
        email: body.email,
        payment_method: body.payment_method,
        invoice_settings: {
          default_payment_method: body.payment_method,
        },
      });
    } catch (error) {
      // console.log(error, '=-=-=--');
    }
  }

  async createStripeSubscription(body: Stripe.SubscriptionCreateParams) {
    return await this.stripe.subscriptions.create({
      customer: body.customer,
      items: body.items,
    });
  }

  async createStripePaymentMethod(body: Stripe.PaymentMethodCreateParams) {
    return await this.stripe.paymentMethods.create({
      type: 'card',
      card: body.card,
    });
  }

  async attachStripePaymentMethod(
    id: string,
    body: Stripe.PaymentMethodAttachParams,
  ) {
    return await this.stripe.paymentMethods.attach(id, {
      customer: body.customer,
    });
  }

  async deAttachStripePaymentMethod(id: string) {
    return await this.stripe.paymentMethods.detach(id);
  }

  /**
   * @description create the charge (one time payment)
   * @param body
   * @returns
   */
  async createCharge(body: any) {
    const { total, currency, payment_id, itemName, type, coupon } = body;
    const paymentMetadata = {
      name: itemName,
      transactionType: type,
    };
    let discountValue = 0;

    const amount =
      Number(body.nftPrice) * ((100 - discountValue) / 100) * body.count;
    const amountInCents = amount * 100;
    const transactions = await this.stripe.paymentIntents.create({
      confirm: true,
      payment_method_types: ['card'],
      payment_method: payment_id,
      amount: Number(amountInCents.toFixed(2)),
      currency: currency,
      metadata: paymentMetadata,
    });
    return {
      transactions: transactions,
      amount: amount,
      discount: discountValue,
    };
  }

  async createCardToken(body: Stripe.TokenCreateParams) {
    return await this.stripe.tokens.create({
      ...body,
    });
  }

  async connectStripe(params) {
    const { clientCallbackUrl } = params;
    try {
      const account = await this.stripe.accounts.create({ type: 'express' });
      const accountLinkParams = {
        accountId: account.id,
        clientCallbackUrl: clientCallbackUrl,
      };
      const link = await this.generateAccountLink(accountLinkParams);
      return link.url;
    } catch (error) {
      return false;
    }
  }
  async generateAccountLink(params) {
    const { accountId, clientCallbackUrl } = params;
    try {
      return this.stripe.accountLinks.create({
        type: 'account_onboarding',
        account: accountId,
        refresh_url: clientCallbackUrl,
        return_url: `${clientCallbackUrl}?status=true&accountId=${accountId}`,
      });
    } catch (error) {
      return null;
    }
  }

  async deleteStripeAccount(params) {
    const { accountId } = params;
    try {
      await this.stripe.accounts.del(accountId);
      return true;
    } catch (error) {
      return false;
    }
  }

  calculateOrderAmount = (price, body) => {
    let discountValue = 0;

    const amount = Number(price) * ((100 - discountValue) / 100);
    const amountInCents = amount * 100;
    return {
      amount: amountInCents,
      discount: discountValue,
    };
  };

  async createPaymentIntent(price, email, nftId) {
    // Create a PaymentIntent with the order amount and currency
    const amountInCents = price * 100;
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      //    payment_method_types: ['card'],
      receipt_email: email,
      metadata: {
        email: email,
        nftId: nftId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async createCheckoutSession(nft: any, user, action: string, actionData: any) {
    // Create Checkout Sessions from body params.
    console.log('Action in stripe service: ', action);
    console.log('Action Data in stripe service: ', actionData);

    // console.log('Type: ', typeof actionData.listingId);

    try {
      const { id, url } = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            quantity: 1,
            price_data: {
              unit_amount: 100,
              currency: 'usd',
              product_data: {
                name: nft.address,
                images: [nft.image],
              },
            },
          },
        ],
        metadata: {
          email: user.email,
          userId: user.userId,
          nftId: nft._id.toString(),
        },
        payment_intent_data: {
          // receipt_email : user.email ?? ,
          metadata: {
            email: user.email,
            userId: user.userId,
            nftId: nft._id.toString(),
            action: action,
            ...actionData,
          },
        },
        mode: 'payment',
        success_url: `${process.env.FRONT_END}/paymentProcessing`,
        cancel_url: `${process.env.FRONT_END}?failure=true`,
      });
      // console.log('RESPONSE: ', id, url);
      return { id, url };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
