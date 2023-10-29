import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBxraH2DWITYIbvlu3A3Rc21BX-Ta3X6lA',
  authDomain: 'music-a134f.firebaseapp.com',
  projectId: 'music-a134f',
  storageBucket: 'music-a134f.appspot.com',
  appId: '1:173444019656:web:463083761f5e14bcf6fcfd',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => {
  console.log(`Firebase  persistence error ${error.code}`);
}); // cache firebase

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export { auth, db, usersCollection, songsCollection, commentsCollection, storage };
