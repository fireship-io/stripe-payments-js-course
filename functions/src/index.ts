import * as functions from 'firebase-functions';
import express from 'express';
import * as admin from 'firebase-admin';
admin.initializeApp();

import Stripe from 'stripe'; 
export const stripe = new Stripe(functions.config().stripe.secret, { 
    apiVersion: '2020-03-02',
});


// Deploy the /server/api code to Firebase Cloud Functions as an Express App

const app = express();
export const api = functions.https.onRequest(app);

// OR use callable functions instead of Express
import { createStripeCheckoutSession } from './checkout';
export const stripeCheckout = functions.https.onCall( async (data, context) => {

    if (context.auth) {
        // User is logged in
    } else {
        // User is NOT logged in
    }

    const checkoutSession = await createStripeCheckoutSession(data.line_items);
    return checkoutSession;

});