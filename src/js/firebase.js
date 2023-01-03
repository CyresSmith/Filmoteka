// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { closeModalFunc } from './signInModal';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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

const refs = {
  backdrop: document.querySelector('[data-signInModal]'),
  btnSignIn: document.querySelector('#signInModalOpen'),
  btnLogOut: document.querySelector('#logoutBtn'),
  btnGoogleLogin: document.querySelector('#googleLoginBtn'),
  btnLoginWithEmail: document.querySelector('#loginWithEmailBtn'),
  btnLoginEmail: document.querySelector('#loginEmailBtn'),

  backdrop: document.querySelector('[data-signInModal]'),
  navigation: document.querySelector('.navigation__list'),
  boxUser: document.querySelector('.user__box'),
  boxSignInModal: document.querySelector('.signInModal__box'),
  boxSignInWithEmailModal: document.querySelector(
    '.signInModal__signInWithEmail'
  ),

  loginEmail: document.querySelector('#email'),
  loginPassword: document.querySelector('#password'),

  btnSignUp: document.querySelector('#SignUpBtn'),
  userName: document.querySelector('.user__name'),
  formField: document.querySelector('.auth-form__field'),
  formTitle: document.querySelector('.auth-form__title'),
};

// monitorAuthState auth =====================================================================================

const monitorAuthState = async () => {
  try {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);

        switch (true) {
          case user.displayName !== null && user.photoURL !== null:
            refs.boxUser.innerHTML = `<img class="user__img" src="${user.photoURL}" alt="" />
                                  <p class="user__greeting">Good to see You again</p>
                                  <p class="user__name"> ${user.displayName}</p>`;
            break;

          case user.displayName === null && user.photoURL === null:
            refs.boxUser.innerHTML = `<p class="user__greeting">Good to see You again</p>
                                  <p class="user__name">Logged in as ${user.email}</p>`;
            break;

          default:
            break;
        }
        refs.navigation.innerHTML = `<li class="navigation__item">
                                      <a class="navigation__link navigation__link--current" href="">HOME</a>
                                      </li>
                                      <li class="navigation__item">
                                      <a class="navigation__link" href="">MY LIBRARY</a>
                                      </li>`;
        refs.btnSignIn.classList.add('visually-hidden');
        refs.btnLogOut.classList.remove('visually-hidden');
        refs.backdrop.classList.add('backdrop--hidden');
        refs.btnLogOut.addEventListener('click', logOut);
        refs.btnSignIn.removeEventListener('click', onbtnSignInClick);
      } else {
        refs.boxUser.innerHTML = `<p class="user__name">Hello Stranger</p>`;
        refs.navigation.innerHTML = ``;
        refs.btnSignIn.classList.remove('visually-hidden');
        refs.btnLogOut.classList.add('visually-hidden');
        refs.btnLogOut.removeEventListener('click', logOut);
        refs.btnSignIn.addEventListener('click', onbtnSignInClick);
      }
    });
  } catch (error) {
    showLoginError(error);
  }
};

monitorAuthState();

const onbtnSignInClick = e => {
  event.preventDefault();
  refs.backdrop.classList.remove('backdrop--hidden');
  refs.btnGoogleLogin.addEventListener('click', onBtnGoogleLoginClick);
  refs.btnLoginWithEmail.addEventListener('click', onbtnLoginWithEmailClick);
  console.log('hello');
  console.log(refs.btnLoginWithEmail);
  closeModalFunc();
};

const logOut = async () => {
  await signOut(auth);
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

// signInWithEmailAndPassword auth =====================================================================================

const onbtnLoginWithEmailClick = () => {
  refs.btnLoginEmail.addEventListener('click', loginEmailPasspord);
  refs.boxSignInWithEmailModal.classList.remove('visually-hidden');
  refs.boxSignInModal.classList.add('visually-hidden');
};

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
  } catch (error) {
    showLoginError(error);
  }
};

// createAccount  =====================================================================================

// const createAccount = async e => {
//   e.preventDefault();
//   const email = refs.loginEmail.value;
//   const password = refs.loginPassword.value;

//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     // console.log(userCredential.user);
//   } catch (error) {
//     showLoginError(error);
//   }
// };

// refs.btnSignUp.addEventListener('click', createAccount);

// google auth =====================================================================================

const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

provider.setCustomParameters({
  login_hint: 'user@example.com',
});

export const onBtnGoogleLoginClick = e => {
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
};

// // recaptcha auth =====================================================================================

// window.recaptchaVerifier = new RecaptchaVerifier(
//   refs.btnLogin,
//   {
//     size: 'invisible',
//     callback: response => {
//       // reCAPTCHA solved, allow signInWithPhoneNumber.
//       onSignInSubmit();
//     },
//   },
//   auth
// );

// // signInWithPhoneNumber auth =====================================================================================

// const phoneNumber = getPhoneNumberFromUserInput();
// const appVerifier = window.recaptchaVerifier;

// signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//   .then(confirmationResult => {
//     // SMS sent. Prompt user to type the code from the message, then sign the
//     // user in with confirmationResult.confirm(code).
//     window.confirmationResult = confirmationResult;
//     // ...
//   })
//   .catch(error => {
//     // Error; SMS not sent
//     // ...
//   });
