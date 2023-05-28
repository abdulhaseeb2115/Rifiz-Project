import { initializeApp } from "firebase/app";
import {
	collection,
	doc,
	getDoc,
	getFirestore,
	setDoc,
	addDoc,
	query,
	getDocs,
	deleteDoc,
	where,
	updateDoc,
	orderBy,
} from "firebase/firestore";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
	sendPasswordResetEmail,
	sendEmailVerification,
	deleteUser,
	updateEmail,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyA_EGD07vdr7w3rboCcODTY0dCYA2fA2Jg",
	authDomain: "rifiz-24f83.firebaseapp.com",
	projectId: "rifiz-24f83",
	storageBucket: "rifiz-24f83.appspot.com",
	messagingSenderId: "275249173939",
	appId: "1:275249173939:web:d672f8b7be7388a29c67c6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider();

export {
	db,
	storage,
	auth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
	collection,
	getDoc,
	setDoc,
	doc,
	uploadBytesResumable,
	ref,
	getDownloadURL,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
	query,
	getDocs,
	addDoc,
	deleteDoc,
	where,
	updateDoc,
	orderBy,
	sendPasswordResetEmail,
	sendEmailVerification,
	updateEmail,
	deleteUser,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	OAuthProvider,
	googleProvider,
	fbProvider,
	appleProvider,
};
