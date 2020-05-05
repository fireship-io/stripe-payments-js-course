import { auth } from './firebase';
const API = 'https://stripe-server-apw6lsu5yq-uc.a.run.app';
// const API = 'http://localhost:3333';



export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: 'POST', body: null, ...opts }
  
  const user = auth.currentUser;
  const token = user && await user.getIdToken();

  try {
    const res = await fetch(`${API}/${endpointURL}`, {
      method,
      ...(body &&  { body: JSON.stringify(body) }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  
    return res.json();
  } catch(error) {
    console.llog('asdfadsfsd')
    alert(error.message)
  }


}

