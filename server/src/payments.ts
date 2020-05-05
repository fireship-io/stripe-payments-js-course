import { stripe } from './';

export const createPaymentIntent = async (amount: number) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        receipt_email: 'hello@fireship.io',
      });

      return paymentIntent;
}


// Use this method to charge a card for an existing customer with a saved card
export const createPaymentIntentAndCharge = async (amount: number, customer: string, payment_method: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer,
    payment_method,
    off_session: true,
    confirm: true,
  });

  return paymentIntent;

}


