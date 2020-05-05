"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const firebase_1 = require("./firebase");
/// Business logic for handling webhooks events
const webhookHandlers = {
    'checkout.session.completed': async (data) => {
        // Add your business logic here
    },
    'payment_intent.succeeded': async (data) => {
        // Add your business logic here
    },
    'payment_intent.payment_failed': async (data) => {
        // Add your business logic here
    },
    'invoice.payment_succeeded': async (data) => {
        // Add your business logic here
    },
    'invoice.payment_failed': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        const userSnapshot = await firebase_1.db.collection('users').doc(customer.metadata.firebaseUID).get();
        await userSnapshot.ref.update({ status: 'PAST_DUE' });
    }
};
/// Validate the stripe webhook, then call the handler 
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = _1.stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
    try {
        await webhookHandlers[event.type](event.data.object);
        res.send({ received: true });
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
//# sourceMappingURL=webhooks.js.map