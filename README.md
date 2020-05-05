## Stripe Payments for JavaScript Developers - The Full Course

Build a fullstack [Stripe Payments](https://stripe.com/) solution with Node.js & React. Learn the following concepts...

- Build a secure backend with Node & Express
- Manage Stripe Checkout sessions
- Custom Stripe Elements UI with React
- Payment Intents API & customer management
- Handle recurring subscriptions & webhooks
- Integrate with Firebase Auth & Firestore
- Deploy as a Docker Container OR to Firebase Cloud Functions


Try the [Live Demo](https://stripe-js-course.firebaseapp.com). 

Enroll in the [Course](https://fireship.io/courses/stripe-js). 

## Usage

Clone this repo. 

## Backend Setup

The `/server` directory contains the Node.js API. Replace the `.env` file with your Stripe secret (testing) API key. 

```
cd server
npm install

npm run dev
```

## Running Webhooks in Development

Install the Stripe CLI to run webhooks in development. 

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

Dockerize the server for deployment to services like Cloud Run, GKE, Elastic Beanstalk, etc


```
cd server
docker build -t fireship/stripe-server .
docker run -p 3333:3333 fireship/stripe-server 
```

Deploy to Cloud Run

```
gcloud config set project <PROJECT_ID>
gcloud builds submit --tag gcr.io/stripe-js-course/stripe-server
```

### Option 2 - Firebase Cloud Functions

Deploy to Cloud Functions to simplify your code with a tight integration to Firebase. 

```
firebase deploy --only functions
```