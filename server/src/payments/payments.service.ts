import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
    );
  }

  async createCheckoutSession(dto: CreatePaymentDto) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: dto.productName },
            unit_amount: Math.round(dto.price * 100), 
          },
          quantity: dto.quantity,
        },
      ],
      success_url: `${this.configService.get('CLIENT_URL')}/payment/success`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/payment/cancel`,
    });

    return { url: session.url };
  }
}