import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { FirebaseAppProvider } from 'reactfire';

export const firebaseConfig = {
  apiKey: 'AIzaSyAUzu622-f23fl0LX1rf6nxzzy0MP5ERLA',
  authDomain: 'stripe-js-course.firebaseapp.com',
  databaseURL: 'https://stripe-js-course.firebaseio.com',
  projectId: 'stripe-js-course',
  storageBucket: 'stripe-js-course.appspot.com',
  messagingSenderId: '84918842518',
  appId: '1:84918842518:web:d23dedb546fd2e8ee63eb7',
};

export const stripePromise = loadStripe(
  'pk_test_OKDSvqXf1ehDBRLacTm9DQsT00QoSQbq2h'
);

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
