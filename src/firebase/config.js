  
import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyCmChOyWwqRxphLu6xr_cU3mqwENawozFQ",
    authDomain: "chat-room-react-1092d.firebaseapp.com",
    projectId: "chat-room-react-1092d",
    storageBucket: "chat-room-react-1092d.appspot.com",
    messagingSenderId: "803236316672",
    appId: "1:803236316672:web:6f1808785d6651b12a7ae5",
    measurementId: "G-GFL3JDTKGM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
    auth.useEmulator('http://localhost:9099');
    db.useEmulator('localhost', '8080');
  }

export { auth, db }
export default firebase