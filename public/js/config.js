import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const initFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBAlkX4OYwYCFgq-FZJLSkZci5Vfe8zN_s",
    authDomain: "facetelling-c2271.firebaseapp.com",
    databaseURL: "https://facetelling-c2271-default-rtdb.firebaseio.com",
    projectId: "facetelling-c2271",
    storageBucket: "facetelling-c2271.firebasestorage.app",
    messagingSenderId: "836341882074",
    appId: "1:836341882074:web:acedcafa4f65c8764b59e3",
    measurementId: "G-N9287L31J0"

  };

  const app = initializeApp(firebaseConfig);

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LcSmLkpAAAAAECyFSg46wFAN7LUFYwiv0e5OJu9"),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
  });
};

export default initFirebase;
