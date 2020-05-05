import express, { Request, Response, NextFunction } from 'express';
export const app = express();

import cors from 'cors';
import { auth } from './firebase';
import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
import { createSetupIntent, listPaymentMethods } from './customers';
import {
  createSubscription,
  cancelSubscription,
  listSubscriptions,
} from './billing';
import { handleStripeWebhook } from './webhooks';

////// MIDDLEWARE

// Allows cross origin requests
app.use(cors({ origin: true }));

// Sets rawBody for webhook handling
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

// Decodes the Firebase JSON Web Token
app.use(decodeJWT);

///// HELPERS /////

// Ensures the express can catch errors inside an async function
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

// Decodes the JSON Web Token sent via the frontend app
// Makes the currentUser (firebase) available on the body
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

// Validates that a request includes an Authenticated Firebase user
function validateUser(req: Request) {
  const user = req['currentUser'];
  if (!user) {
    throw new Error(
      'You must be logged in to make this request. i.e Authroization: Bearer <token>'
    );
  }

  return user;
}

///// MAIN API /////

app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 7 });
});

// Checkouts

// Create a Checkout Session
app.post(
  '/checkouts/',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

// Payments

// Create a PaymentIntent
app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  })
);

// Customers

// Save a card on the customer record with a SetupIntent
app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);

// Retrieve all cards attached to a customer
app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);

// Billing

// Create a and charge new Subscription
app.post(
  '/subscriptions/',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    res.send(await createSubscription(user.uid, plan, payment_method));
  })
);

// Get all subscriptions for a customer
app.get(
  '/subscriptions/',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const subscriptions = await listSubscriptions(user.uid);

    res.send(subscriptions.data);
  })
);

// Unsubscibe or cancel a subscription
app.patch(
  '/subscriptions/:id',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    res.send(await cancelSubscription(user.uid, req.params.id));
  })
);

// Handle webhooks
app.post('/hooks', runAsync(handleStripeWebhook));
