import firebase from 'firebase';
import { FIRE_API_KEY, FIRE_SENDER_ID } from './config';

const config = {
  apiKey: FIRE_API_KEY,
  authDomain: 'simply-rets-ap.firebaseapp.com',
  databaseURL: 'https://simply-rets-ap.firebaseio.com',
  projectId: 'simply-rets-ap',
  storageBucket: 'simply-rets-ap.appspot.com',
  messagingSenderId: FIRE_SENDER_ID
};

const fire = firebase.initializeApp(config);
export default fire;
