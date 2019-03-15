import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDN4AUUcrWtfRkA1dO2S0xd_PEehk01AKI',
  authDomain: 'simply-rets-ap.firebaseapp.com',
  databaseURL: 'https://simply-rets-ap.firebaseio.com',
  projectId: 'simply-rets-ap',
  storageBucket: 'simply-rets-ap.appspot.com',
  messagingSenderId: '792098971984'
};

const fire = firebase.initializeApp(config);
export default fire;
