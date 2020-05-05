"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
exports.createPaymentIntent = async (amount) => {
    const paymentIntent = await _1.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        receipt_email: 'hello@fireship.io',
    });
    return paymentIntent;
};
// Use this method to charge a card for an existing customer with a saved card
exports.createPaymentIntentAndCharge = async (amount, customer, payment_method) => {
    const paymentIntent = await _1.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer,
        payment_method,
        off_session: true,
        confirm: true,
    });
    return paymentIntent;
};
//# sourceMappingURL=payments.js.map