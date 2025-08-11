import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyD-Okdkn23DU64p8VwxCusCi15J78vhknA",
  authDomain: "shopping-cart-651ff.firebaseapp.com",
  projectId: "shopping-cart-651ff",
  storageBucket: "shopping-cart-651ff.firebasestorage.app",
  messagingSenderId: "812115070677",
  appId: "1:812115070677:web:898e0bca6400b5f7475c5c",
  measurementId: "G-BX34YK3CF8"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);