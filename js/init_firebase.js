import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';

const firebaseConfig = {
    apiKey: "AIzaSyDjt28Eulb8IPG98WhaDhpSJ5GvENiql3k",
    authDomain: "frontend-thangnnc.firebaseapp.com",
    databaseURL: "https://frontend-thangnnc-default-rtdb.firebaseio.com",
    projectId: "frontend-thangnnc",
    storageBucket: "frontend-thangnnc.appspot.com",
    messagingSenderId: "420628651369",
    appId: "1:420628651369:web:6d2ed7eea3fa7ef72f31f8",
    measurementId: "G-D6G8WZM4BH"
};

const appFB = initializeApp(firebaseConfig);

import { getDatabase, ref, set, child, get }
    from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js';

const db = getDatabase();
