// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  // signInWithRedirect,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  // connectAuthEmulator,
} from 'firebase/auth';

import { getDatabase, ref, set } from 'firebase/database';

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCrjIQ-i-DV-fkmDO-FB_HdRZGKiM7ste8',
  authDomain: 'filmoteka-project9.firebaseapp.com',
  projectId: 'filmoteka-project9',
  storageBucket: 'filmoteka-project9.appspot.com',
  messagingSenderId: '1031272501813',
  appId: '1:1031272501813:web:a2ca2d3955cbe4cf9a577c',
  measurementId: 'G-1NQ8JF0W90',
  databaseURL:
    'https://filmoteka-project9-default-rtdb.europe-west1.firebasedatabase.app/',
});

const auth = getAuth(firebaseApp);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebaseApp);

// ================= запуск локального эмулятора =================

//из это папки >>> C:\Filmoteka
//запуск хоcтинга >>> firebase serve --only hosting
//запуск эмулятора >>> firebase emulators:start --only auth

// connectAuthEmulator(auth, 'http://localhost:9099/');

// ===============================================================

function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
}

// ============================================================================

const refs = {
  backdrop: document.querySelector('[data-signInModal]'),
  btnCloseModal: document.querySelector('[data-signInModal-close]'),
  btnSignIn: document.querySelector('#signInModalOpen'),
  btnLogOut: document.querySelector('#logoutBtn'),
  btnLoginWithPhone: document.querySelector('#LogInWithPhoneBtn'),
  btnPhoneLogin: document.querySelector('#LogInPhone'),
  btnGoogleLogin: document.querySelector('#googleLoginBtn'),
  btnLoginWithEmail: document.querySelector('#loginWithEmailBtn'),
  btnLoginEmail: document.querySelector('#loginEmailBtn'),
  btnSignUpWithEmail: document.querySelector('#SignUpWitnEmailBtn'),
  btnSignUpEmail: document.querySelector('#SignUpBtn'),
  btnConfirmEmail: document.querySelector('#ConfirmEmail'),

  backdrop: document.querySelector('[data-signInModal]'),
  navigation: document.querySelector('.navigation__list'),
  boxUser: document.querySelector('.user__box'),
  boxSignInModal: document.querySelector('.signInModal__box'),
  boxSignInWithEmailModal: document.querySelector(
    '.signInModal__signInWithEmail'
  ),
  boxSignUpWithEmail: document.querySelector('.signInModal__signUpWithEmail'),
  boxLogInWithPhone: document.querySelector('.signInModal__LogInWithPhone'),
  boxRecaptcha: document.querySelector('.recaptcha-container'),

  loginEmail: document.querySelector('#email'),
  loginPassword: document.querySelector('#password'),
  signUpEmail: document.querySelector('#emailSignUp'),
  signUpPassword: document.querySelector('#passwordSignUp'),
  loginPhone: document.querySelector('#phone'),
  loginPhoneCode: document.querySelector('#loginPhoneCode'),

  userName: document.querySelector('.user__name'),
  formField: document.querySelector('.auth-form__field'),
  formTitle: document.querySelector('.auth-form__title'),
};

// close Modal Func auth =====================================================================================

export const closeModalFunc = () => {
  refs.btnCloseModal.addEventListener('click', () => {
    refs.backdrop.classList.add('backdrop--hidden');
    refs.boxSignInWithEmailModal.classList.add('visually-hidden');
    refs.boxSignUpWithEmail.classList.add('visually-hidden');
    // refs.boxLogInWithPhone.classList.add('visually-hidden');
    refs.boxSignInModal.classList.remove('visually-hidden');
  });

  if (refs.backdrop.classList.contains('backdrop--hidden')) {
    btnCloseModal.removeEventListener('click', toggleModal);
  }
};

// monitor Auth State =====================================================================================

const monitorAuthState = async () => {
  try {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);

        switch (true) {
          case user.displayName !== null && user.photoURL !== null:
            refs.boxUser.innerHTML = `<img class="user__img" src= ${user.photoURL} alt="" />
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
                                            <button class="navigation__link navigation__link--current"
                                                type="button" id="homeBtn">
                                                HOME
                                            </button>
                                     </li>
                                     <li class="navigation__item">
                                        <button class="navigation__link"
                                            type="button" id="homeBtn">
                                            MY LIBRARY
                                        </button>
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

// on btn SignIn Click =====================================================================================

const onbtnSignInClick = e => {
  event.preventDefault();
  refs.backdrop.classList.remove('backdrop--hidden');
  refs.btnGoogleLogin.addEventListener('click', onBtnGoogleLoginClick);
  //   refs.btnLoginWithPhone.addEventListener('click', onBtnLoginWithPhoneClick);
  refs.btnLoginWithEmail.addEventListener('click', onbtnLoginWithEmailClick);
  refs.btnSignUpWithEmail.addEventListener('click', onBtnSignUpWithEmailClick);
  closeModalFunc();
};

const logOut = async () => {
  await signOut(auth);
};

// show Login Error =====================================================================================

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

// sign In With Email And Password auth =====================================================================================

const onbtnLoginWithEmailClick = () => {
  refs.btnGoogleLogin.removeEventListener('click', onBtnGoogleLoginClick);
  refs.btnLoginWithEmail.removeEventListener('click', onbtnLoginWithEmailClick);
  refs.btnLoginEmail.addEventListener('click', loginEmailPasspord);
  refs.boxSignInWithEmailModal.classList.remove('visually-hidden');
  refs.boxSignInModal.classList.add('visually-hidden');
};

signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
    // Signed in
    const user = userCredential.user;
  })
  .catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

const loginEmailPasspord = async e => {
  e.preventDefault();
  const email = refs.loginEmail.value;
  const password = refs.loginPassword.value;

  if (email && password) {
    refs.backdrop.classList.add('backdrop--hidden');
    refs.boxSignInWithEmailModal.classList.add('visually-hidden');
    refs.boxSignInModal.classList.remove('visually-hidden');
  }

  try {
    // console.log(auth);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    showLoginError(error);
  }
};

// create Account  =====================================================================================

const onBtnSignUpWithEmailClick = () => {
  refs.btnGoogleLogin.removeEventListener('click', onBtnGoogleLoginClick);
  refs.btnLoginWithEmail.removeEventListener('click', onbtnLoginWithEmailClick);
  refs.btnLoginEmail.removeEventListener('click', loginEmailPasspord);
  refs.btnSignUpEmail.addEventListener('click', createAccount);
  refs.boxSignUpWithEmail.classList.remove('visually-hidden');
  refs.boxSignInModal.classList.add('visually-hidden');
};

const createAccount = async e => {
  e.preventDefault();
  const email = refs.signUpEmail.value;
  const password = refs.signUpPassword.value;

  if (email && password) {
    refs.backdrop.classList.add('backdrop--hidden');
    refs.boxSignUpWithEmail.classList.add('visually-hidden');
    refs.boxSignInModal.classList.remove('visually-hidden');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    user = await userCredential.user;

    await writeUserData(user.uid, user.displayName, user.email, user.photoURL);
  } catch (error) {
    showLoginError(error);
  }
};

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
//   'refs.btnPhoneLogin',
//   {
//     size: 'invisible',
//     callback: response => {
//       // reCAPTCHA solved, allow signInWithPhoneNumber.
//       onSignInSubmit();
//     },
//   },
//   auth
// );

// // // sign In With Phone Number auth =====================================================================================

// const onBtnLoginWithPhoneClick = () => {
//   refs.btnGoogleLogin.removeEventListener('click', onBtnGoogleLoginClick);
//   refs.btnLoginWithEmail.removeEventListener('click', onbtnLoginWithEmailClick);
//   refs.btnLoginEmail.removeEventListener('click', loginEmailPasspord);
//   refs.boxSignInWithEmailModal.classList.add('visually-hidden');
//   refs.boxSignInModal.classList.add('visually-hidden');
//   refs.boxLogInWithPhone.classList.remove('visually-hidden');
// };

// const phoneNumber = refs.loginPhone.value;
// // const confirmationResult = refs.loginPhoneCode.value;

// signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
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
