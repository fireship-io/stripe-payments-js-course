import React, { useState } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function Payments() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState();

  // Create a payment intent on the server
  const createPaymentIntent = async (event) => {

    // Clamp amount to Stripe min/max
    const validAmount = Math.min(Math.max(amount, 50), 9999999);
    setAmount(validAmount);

    // Make the API Request
    const pi = await fetchFromAPI('payments', { body: { amount: validAmount } });
    setPaymentIntent(pi);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Confirm Card Payment
    const {
      paymentIntent: updatedPaymentIntent,
      error,
    } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      console.error(error);
      error.payment_intent && setPaymentIntent(error.payment_intent);
    } else {
      setPaymentIntent(updatedPaymentIntent);
    }
  };

  return (
    <>
      <h2>Payments</h2>
      <p>
        One-time payment scenario.
      </p>
      <div className="well">
      <PaymentIntentData data={paymentIntent} />
      </div>


      <div className="well">
      <h3>Step 1: Create a Payment Intent</h3>
      <p>
        Change the amount of the payment in the form, then request a Payment
        Intent to create context for one-time payment. Min 50, Max 9999999
      </p>

      <div className="form-inline">
        <input
          className="form-control"
          type="number"
          value={amount}
          disabled={paymentIntent}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="btn btn-success"
          disabled={amount <= 0}
          onClick={createPaymentIntent}
          hidden={paymentIntent}>
          Ready to Pay ${ (amount / 100).toFixed(2) }
        </button>
      </div>
      </div>
      <hr />

      <form onSubmit={handleSubmit} className="well" hidden={!paymentIntent || paymentIntent.status === 'succeeded' }>
        <h3>Step 2: Submit a Payment Method</h3>
        <p>Collect credit card details, then submit the payment.</p>
        <p>
          Normal Card: <code>4242424242424242</code>
        </p>
        <p>
          3D Secure Card: <code>4000002500003155</code>
        </p>

        <hr />

        <CardElement />
        <button className="btn btn-success" type="submit">
          Pay
        </button>
      </form>
    </>
  );
}

function PaymentIntentData(props) {
  if (props.data) {
    const { id, amount, status, client_secret } = props.data;
    return (
      <>
      <h3>Payment Intent <span
          className={
            'badge ' + ( status === 'succeeded' ? 'badge-success' : 'badge-secondary')
          }>
          {status}
        </span></h3>
      <pre>
        ID: {id} <br />
        Client Secret: {client_secret} <br />
        Amount: {amount} <br />
        Status:{status}
        <br />
      </pre>
      </>
    );
  } else {
    return <p>Payment Intent Not Created Yet</p>;
  }
}

export default Payments;
