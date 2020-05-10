import { stripe } from './';
import { db } from './firebase';
import Stripe from 'stripe';

/**
 * Creates a SetupIntent used to save a credit card for later use
 */
export async function createSetupIntent(userId: string) {

    const customer = await getOrCreateCustomer(userId);

    return stripe.setupIntents.create({ 
        customer: customer.id,
    })
}

/**
 * Returns all payment sources associated to the user
 */
export async function listPaymentMethods(userId: string) {
    const customer = await getOrCreateCustomer(userId);

    return stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
}


/**
 * Gets the exsiting Stripe customer or creates a new record
 */
export async function getOrCreateCustomer(userId: string, params?: Stripe.CustomerCreateParams) {

    const userSnapshot = await db.collection('users').doc(userId).get();

    const { stripeCustomerId, email } = userSnapshot.data() || {};

    // If missing customerID, create it
    if (!stripeCustomerId) {
        // CREATE new customer
        const customer = await stripe.customers.create({
            email,
            metadata: {
                firebaseUID: userId
            },
            ...params
        });
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    } else {
        return await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
    }

}