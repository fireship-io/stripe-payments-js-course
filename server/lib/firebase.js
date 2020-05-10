"use strict";
// Initialize Firebase Admin resources
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin = __importStar(require("firebase-admin"));
firebaseAdmin.initializeApp();
exports.db = firebaseAdmin.firestore();
exports.auth = firebaseAdmin.auth();
//# sourceMappingURL=firebase.js.map