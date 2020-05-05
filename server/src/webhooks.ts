import { stripe } from './';
import Stripe from 'stripe';
import { db } from './firebase';

/// Business logic for handling webhooks events
const webhookHandlers = {
    'checkout.session.completed': async (data: Stripe.Event.Data) => {
      // Add your business logic here
    },
    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
      // Add your business logic here
    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
      // Add your business logic here
    },
    'invoice.payment_succeeded': async (data: Stripe.Invoice) => {
      // Add your business logic here
    },
    'invoice.payment_failed': async (data: Stripe.Invoice) => {
      
      const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
      const userSnapshot = await db.collection('users').doc(customer.metadata.firebaseUID).get();
      await userSnapshot.ref.update({ status: 'PAST_DUE' });

    }
}

/// Validate the stripe webhook, then call the handler 
export const handleStripeWebhook = async(req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  try {
    await webhookHandlers[event.type](event.data.object);
    res.send({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

