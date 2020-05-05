import React, { useState, useEffect, Suspense } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser, AuthCheck } from 'reactfire';

import { db } from './firebase';
import { SignIn, SignOut } from './Customers';

function UserData(props) {

  const [data, setData] = useState({});

  useEffect(
    () => {
      const unsubscribe = db.collection('users').doc(props.user.uid).onSnapshot(doc => setData(doc.data()) )
      return () => unsubscribe()
    },
    [props.user]
  )

  return (
    <pre>
      Stripe Customer ID: {data.stripeCustomerId} <br />
      Subscriptions: {JSON.stringify(data.activePlans || [])}
    </pre>
  );
}

function SubscribeToPlan(props) {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState();

  useEffect(() => {
    getSubscrptions();
  }, [user]);

  const getSubscrptions = async () => {
    if (user) {
      const subs = await fetchFromAPI('subscriptions', { method: 'GET' });
      setSubscriptions(subs);
    }
  };

  const cancel = async (id) => {
    setLoading(true);
    await fetchFromAPI('subscriptions/' + id, { method: 'PATCH' });
    alert('canceled!');
    await getSubscrptions();
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const subscription = await fetchFromAPI('subscriptions', {
      body: {
        plan,
        payment_method: paymentMethod.id,
      },
    });

    const { latest_invoice } = subscription;

    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent;

      if (status === 'requires_action') {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        );
        if (confirmationError) {
          console.error(confirmationError);
          alert('unable to confirm card');
          return;
        }
      }

      // success
      alert('You are subscribed!');
      getSubscrptions();
    }

    setLoading(false);
    setPlan(null);
  };

  return (
    <>
      <h2>Subscriptions</h2>
      <p>
        Subscribe a user to a recurring plan, process the payment, and sync with
        Firestore in realtime.
      </p>
      <AuthCheck fallback={<SignIn />}>
        <div className="well">
          <h2>Firestore Data</h2>
          <p>User's data in Firestore.</p>
          {user?.uid && <UserData user={user} />}
        </div>

        <hr />

        <div className="well">
          <h3>Step 1: Choose a Plan</h3>

          <button
            className={
              'btn ' +
              (plan === 'plan_HC2o83JbeowZnP'
                ? 'btn-primary'
                : 'btn-outline-primary')
            }
            onClick={() => setPlan('plan_HC2o83JbeowZnP')}>
            Choose Monthly $25/m
          </button>

          <button
            className={
              'btn ' +
              (plan === 'plan_HD6rlaovzAiM7B'
                ? 'btn-primary'
                : 'btn-outline-primary')
            }
            onClick={() => setPlan('plan_HD6rlaovzAiM7B')}>
            Choose Quarterly $50/q
          </button>

          <p>
            Selected Plan: <strong>{plan}</strong>
          </p>
        </div>
        <hr />

        <form onSubmit={handleSubmit} className="well" hidden={!plan}>
          <h3>Step 2: Submit a Payment Method</h3>
          <p>Collect credit card details</p>
          <p>
            Normal Card: <code>4242424242424242</code>
          </p>
          <p>
            3D Secure Card: <code>4000002500003155</code>
          </p>

          <hr />

          <CardElement />
          <button className="btn btn-success" type="submit" disabled={loading}>
            Subscribe & Pay
          </button>
        </form>

        <div className="well">
          <h3>Manage Current Subscriptions</h3>
          <div>
            {subscriptions.map((sub) => (
              <div key={sub.id}>
                {sub.id}. Next payment of {sub.plan.amount} due{' '}
                {new Date(sub.current_period_end * 1000).toUTCString()}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => cancel(sub.id)}
                  disabled={loading}>
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="well">
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  );
}

// function StripeSubscription({ data }) {
//   const cancel = async () => {
//     await post('subscriptions/' + data.id, {}, 'PATCH');
//     alert('canceled!');
//   };

//   return (
//     <>
//       {data.id}. Next payment of {data.plan.amount} due{' '}
//       {new Date(data.current_period_end).toUTCString()}
//       <button className="btn btn-sm btn-danger" onClick={cancel}>
//         Cancel
//       </button>
//     </>
//   );
// }

export default function Subscriptions() {
  return (
    <Suspense fallback={'loading user'}>
      <SubscribeToPlan />
    </Suspense>
  );
}
