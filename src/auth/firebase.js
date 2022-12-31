// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // onAuthStateChanged,
  connectAuthEmulator,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCrjIQ-i-DV-fkmDO-FB_HdRZGKiM7ste8',
  authDomain: 'filmoteka-project9.firebaseapp.com',
  projectId: 'filmoteka-project9',
  storageBucket: 'filmoteka-project9.appspot.com',
  messagingSenderId: '1031272501813',
  appId: '1:1031272501813:web:a2ca2d3955cbe4cf9a577c',
  measurementId: 'G-1NQ8JF0W90',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

connectAuthEmulator(auth, 'http://127.0.0.1:9099/');

const refs = {
  btnLogin: document.querySelector('.filmoteca-btn--auth'),
  loginEmail: document.querySelector('#email'),
  loginPassword: document.querySelector('#password'),
};

const loginEmailPasspord = async e => {
  e.preventDefault();
  const loginEmail = refs.loginEmail.value;
  const loginPassword = refs.password.value;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    loginEmail,
    loginPassword
  );

  console.log(userCredential.user);
};

refs.btnLogin.addEventListener('click', loginEmailPasspord);

console.log('hello');
