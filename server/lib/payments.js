"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
/**
 * Create a Payment Intent with a specific amount
 */
async function createPaymentIntent(amount) {
    const paymentIntent = await _1.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
    });
    return paymentIntent;
}
exports.createPaymentIntent = createPaymentIntent;
/**
 * Create a Payment Intent and attempt to charge right away,
 * must have an existing customer with a saved card payment method on file.
 */
async function createPaymentIntentAndCharge(amount, customer, payment_method) {
    const paymentIntent = await _1.stripe.paymentIntents.create({
        amount,
        customer,
        payment_method,
        currency: 'usd',
        off_session: true,
        confirm: true,
    });
    return paymentIntent;
}
exports.createPaymentIntentAndCharge = createPaymentIntentAndCharge;
//# sourceMappingURL=payments.js.map