"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// Return user's data from Firestore
async function getUserData(uid) {
    const snapshot = await _1.db.collection('users').doc(uid).get();
    return snapshot.data();
}
exports.getUserData = getUserData;
// Updates the Stripe Customer ID on the Firebase User
async function updateCustomerId(uid, stripeCustomerId) {
    const ref = _1.db.collection('users').doc(uid);
    return ref.set({ stripeCustomerId }, { merge: true });
}
exports.updateCustomerId = updateCustomerId;
//# sourceMappingURL=database.js.map