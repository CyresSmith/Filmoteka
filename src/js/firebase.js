// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  connectAuthEmulator,
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: 'AIzaSyCrjIQ-i-DV-fkmDO-FB_HdRZGKiM7ste8',
//   authDomain: 'filmoteka-project9.firebaseapp.com',
//   projectId: 'filmoteka-project9',
//   storageBucket: 'filmoteka-project9.appspot.com',
//   messagingSenderId: '1031272501813',
//   appId: '1:1031272501813:web:a2ca2d3955cbe4cf9a577c',
//   measurementId: 'G-1NQ8JF0W90',
// };

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCrjIQ-i-DV-fkmDO-FB_HdRZGKiM7ste8',
  authDomain: 'filmoteka-project9.firebaseapp.com',
  projectId: 'filmoteka-project9',
  storageBucket: 'filmoteka-project9.appspot.com',
  messagingSenderId: '1031272501813',
  appId: '1:1031272501813:web:a2ca2d3955cbe4cf9a577c',
  measurementId: 'G-1NQ8JF0W90',
});

const auth = getAuth(firebaseApp);

// ================= запуск локального эмулятора =================

//из это папки >>> C:\Filmoteka
//запуск хоcтинга >>> firebase serve --only hosting
//запуск эмулятора >>> firebase emulators:start --only auth

// connectAuthEmulator(auth, 'http://localhost:9099/');

// ===============================================================

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

const refs = {
  loginEmail: document.querySelector('#email'),
  loginPassword: document.querySelector('#password'),
  btnLogin: document.querySelector('#loginBtn'),
  btnGoogleLogin: document.querySelector('#googleLoginBtn'),
  btnSignUp: document.querySelector('#SignUpBtn'),
  btnlogOut: document.querySelector('#logOut'),
  formField: document.querySelector('.auth-form__field'),
  formTitle: document.querySelector('.auth-form__title'),
};

const showLoginError = error => {
  if (error.message == 'Firebase: Error (auth/wrong-password).') {
    alert('Wrong password, Try again');
  }
  if (error.message == 'Firebase: Error (auth/invalid-email).') {
    alert(`Invalid email, Try again`);
  } else {
    alert(`${error.message}`);
  }
};

const loginEmailPasspord = async e => {
  e.preventDefault();
  const email = refs.loginEmail.value;
  const password = refs.loginPassword.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // console.log(userCredential.user);
  } catch (error) {
    showLoginError(error);
  }
};

refs.btnLogin.addEventListener('click', loginEmailPasspord);

const createAccount = async e => {
  e.preventDefault();
  const email = refs.loginEmail.value;
  const password = refs.loginPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // console.log(userCredential.user);
  } catch (error) {
    showLoginError(error);
  }
};

refs.btnSignUp.addEventListener('click', createAccount);

const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      //   console.log(user);
      refs.formField.classList.add('visually-hidden');
      refs.btnSignUp.classList.add('visually-hidden');
      refs.btnLogin.classList.add('visually-hidden');
      refs.btnGoogleLogin.classList.add('visually-hidden');
      refs.btnlogOut.classList.remove('visually-hidden');

      refs.formTitle.innerHTML = `Logged in as: ${user.email}`;
    } else {
      refs.btnSignUp.classList.remove('visually-hidden');
      refs.btnLogin.classList.remove('visually-hidden');
      refs.btnlogOut.classList.add('visually-hidden');
    }
  });
};

monitorAuthState();

const logOut = async () => {
  await signOut(auth);
};

refs.btnlogOut.addEventListener('click', logOut);

// google auth =====================================================================================

const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

provider.setCustomParameters({
  login_hint: 'user@example.com',
});

refs.btnGoogleLogin.addEventListener('click', e => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});
