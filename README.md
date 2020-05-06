## Fullstack Stripe Payments for the JavaScript Developer

Build a fullstack [Stripe Payments](https://stripe.com/) solution with Node.js. Learn the following concepts...

- Build a secure backend with Node.js & Express
- Manage Stripe Checkout sessions
- Use the Payment Intents API to support 3D Secure Payments
- Recurring subscriptions & webhooks
- Customize the UI with Stripe Elements
- Integrate with real cloud infrastructure (Firebase Auth & Firestore)
- Deploy as a Docker Container OR to Firebase Cloud Functions


Try the [Live Demo](https://stripe-js-course.firebaseapp.com) (React). 

Enroll in the [Stripe JavaScript Course](https://fireship.io/courses/stripe-js). 

## Usage

Clone this repo. 

## Backend Setup

The `/server` directory contains the Node.js API. Replace the `.env` file with your API credentials. 

```
cd server
npm install

npm run dev
```

## Running Webhooks in Development

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) to run webhooks in development. 

```
stripe listen --forward-to localhost:3333/hooks
```


## Frontend Setup

The backend API can be integrated with the following frontend frameworks. 

### React

```
cd react-app
npm install
npm start
```

### Angular 

Work in Progress

### Vue 

Work in Progress

## Deployment

### Option 1 - Docker

Dockerize the server for deployment to services like Cloud Run, GKE, Elastic Beanstalk, etc. 


```
cd server
docker build -t fireship/stripe-server .
docker run -p 3333:3333 fireship/stripe-server 
```


### Option 2 - Firebase Cloud Functions

Deploy to Cloud Functions to simplify your code with a tight integration to Firebase. 

```
firebase deploy --only functions
```