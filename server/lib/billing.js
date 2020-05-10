"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const firebase_1 = require("./firebase");
const customers_1 = require("./customers");
const firebase_admin_1 = require("firebase-admin");
/**
 * Attaches a payment method to the Stripe customer,
 * subscribes to a Stripe plan, and saves the plan to Firestore
 */
async function createSubscription(userId, plan, payment_method) {
    const customer = await customers_1.getOrCreateCustomer(userId);
    // Attach the  payment method to the customer
    await _1.stripe.paymentMethods.attach(payment_method, { customer: customer.id });
    // Set it as the default payment method
    await _1.stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment_method },
    });
    const subscription = await _1.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan }],
        expand: ['latest_invoice.payment_intent'],
    });
    const invoice = subscription.latest_invoice;
    const payment_intent = invoice.payment_intent;
    // Update the user's status
    if (payment_intent.status === 'succeeded') {
        await firebase_1.db
            .collection('users')
            .doc(userId)
            .set({
            stripeCustomerId: customer.id,
            activePlans: firebase_admin_1.firestore.FieldValue.arrayUnion(plan),
        }, { merge: true });
    }
    return subscription;
}
exports.createSubscription = createSubscription;
/**
 * Cancels an active subscription, syncs the data in Firestore
 */
async function cancelSubscription(userId, subscriptionId) {
    const customer = await customers_1.getOrCreateCustomer(userId);
    if (customer.metadata.firebaseUID !== userId) {
        throw Error('Firebase UID does not match Stripe Customer');
    }
    const subscription = await _1.stripe.subscriptions.del(subscriptionId);
    // Cancel at end of period
    // const subscription = stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    if (subscription.status === 'canceled') {
        await firebase_1.db
            .collection('users')
            .doc(userId)
            .update({
            activePlans: firebase_admin_1.firestore.FieldValue.arrayRemove(subscription.plan.id),
        });
    }
    return subscription;
}
exports.cancelSubscription = cancelSubscription;
/**
 * Returns all the subscriptions linked to a Firebase userID in Stripe
 */
async function listSubscriptions(userId) {
    const customer = await customers_1.getOrCreateCustomer(userId);
    const subscriptions = await _1.stripe.subscriptions.list({
        customer: customer.id,
    });
    return subscriptions;
}
exports.listSubscriptions = listSubscriptions;
;
//# sourceMappingURL=billing.js.map