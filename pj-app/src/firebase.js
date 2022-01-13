// import firebase from "firebase/app"
// import "firebase/auth"
// import 'firebase/firestore'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   //databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })

//Your web app's Firebase configuration
const app = firebase.initializeApp({
  apiKey: "AIzaSyBnD_LNoxj1pgiKWhZwUyrawSB8wFMKkt4",
  authDomain: "telcom-gcp.firebaseapp.com",
  projectId: "telcom-gcp",
  storageBucket: "telcom-gcp.appspot.com",
  messagingSenderId: "543453928161",
  appId: "1:543453928161:web:9217f2df2b0856f27f35a0"
})

export const auth = app.auth()
export default app





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBnD_LNoxj1pgiKWhZwUyrawSB8wFMKkt4",
//   authDomain: "telcom-gcp.firebaseapp.com",
//   projectId: "telcom-gcp",
//   storageBucket: "telcom-gcp.appspot.com",
//   messagingSenderId: "543453928161",
//   appId: "1:543453928161:web:9217f2df2b0856f27f35a0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = app.auth()
// export default app

