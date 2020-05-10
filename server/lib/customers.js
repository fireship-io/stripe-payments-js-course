"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const firebase_1 = require("./firebase");
/**
 * Creates a SetupIntent used to save a credit card for later use
 */
async function createSetupIntent(userId) {
    const customer = await getOrCreateCustomer(userId);
    return _1.stripe.setupIntents.create({
        customer: customer.id,
    });
}
exports.createSetupIntent = createSetupIntent;
/**
 * Returns all payment sources associated to the user
 */
async function listPaymentMethods(userId) {
    const customer = await getOrCreateCustomer(userId);
    return _1.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
}
exports.listPaymentMethods = listPaymentMethods;
/**
 * Gets the exsiting Stripe customer or creates a new record
 */
async function getOrCreateCustomer(userId, params) {
    const userSnapshot = await firebase_1.db.collection('users').doc(userId).get();
    const { stripeCustomerId, email } = userSnapshot.data();
    // If missing customerID, create it
    if (!stripeCustomerId) {
        // CREATE new customer
        const customer = await _1.stripe.customers.create(Object.assign({ email, metadata: {
                firebaseUID: userId
            } }, params));
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    }
    else {
        return await _1.stripe.customers.retrieve(stripeCustomerId);
    }
}
exports.getOrCreateCustomer = getOrCreateCustomer;
//# sourceMappingURL=customers.js.map