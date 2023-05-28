import React from "react";
import * as Comp from "../components/All";
import {
	setDoc,
	collection,
	db,
	doc,
	getDoc,
	auth,
	signInWithPopup,
	googleProvider,
	fbProvider,
	appleProvider,
} from "../firebaseConfig";
/*Redux Imports*/
import { logIn, useDispatch } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	/*Google Login*/
	const handleGoogleLogin = () => {
		signInWithPopup(auth, googleProvider)
			.then(async (result) => {
				//-> user logged in with google

				// const credential = GoogleAuthProvider.credentialFromResult(result);
				// const token = credential.accessToken;
				const docRef = doc(db, "users", result.user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					//-> user alread exists
					dispatch(
						logIn({
							name: result.user.displayName,
							username: docSnap.data().username,
							email: result.user.email,
							image: result.user.photoURL,
							verified: result.user.emailVerified,
						})
					);
				} else {
					//-> user does not exist
					const usersRef = collection(db, "users");
					await setDoc(doc(usersRef, result.user.uid), {
						username: result.user.email.substring(
							0,
							result.user.email.indexOf("@")
						),
						facebook: "",
						instagram: "",
						twitter: "",
						youtube: "",
						links: [],
					})
						.then(async () => {
							//-> user info doc created
							dispatch(
								logIn({
									name: result.user.displayName,
									username: result.user.email.substring(
										0,
										result.user.email.indexOf("@")
									),
									email: result.user.email,
									image: result.user.photoURL,
									verified: result.user.emailVerified,
								})
							);
						})
						.catch((error) => {
							alert(error);
						});
				}
			})
			.catch((error) => {
				alert(error);
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// const email = error.customData.email;
				// const credential = GoogleAuthProvider.credentialFromError(error);
			});
	};

	/*Facebook Login*/
	const handleFbLogin = () => {
		signInWithPopup(auth, fbProvider)
			.then(async (result) => {
				//-> user logged in with facebook

				// const credential = FacebookAuthProvider.credentialFromResult(result);
				// const token = credential.accessToken;
				const docRef = doc(db, "users", result.user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					//-> user alread exists
					dispatch(
						logIn({
							name: result.user.displayName,
							username: docSnap.data().username,
							email: result.user.email,
							image: result.user.photoURL,
							verified: result.user.emailVerified,
						})
					);
				} else {
					//-> user does not exist
					const usersRef = collection(db, "users");
					await setDoc(doc(usersRef, result.user.uid), {
						username: result.user.email.substring(
							0,
							result.user.email.indexOf("@")
						),
						facebook: "",
						instagram: "",
						twitter: "",
						youtube: "",
						links: [],
					})
						.then(async () => {
							//-> user info doc created
							dispatch(
								logIn({
									name: result.user.displayName,
									username: result.user.email.substring(
										0,
										result.user.email.indexOf("@")
									),
									email: result.user.email,
									image: result.user.photoURL,
									verified: result.user.emailVerified,
								})
							);
						})
						.catch((error) => {
							alert(error);
						});
				}
			})
			.catch((error) => {
				alert(error);
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// const email = error.customData.email;
				// const credential = FacebookAuthProvider.credentialFromError(error);
			});
	};

	/*Apple Login*/
	const handleAppleLogin = () => {
		signInWithPopup(auth, appleProvider)
			.then(async (result) => {
				//-> user logged in with facebook

				// const credential = OAuthProvider.credentialFromResult(result);
				// const token = credential.accessToken;
				const docRef = doc(db, "users", result.user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					//-> user alread exists
					dispatch(
						logIn({
							name: result.user.displayName,
							username: docSnap.data().username,
							email: result.user.email,
							image: result.user.photoURL,
							verified: result.user.emailVerified,
						})
					);
				} else {
					//-> user does not exist
					const usersRef = collection(db, "users");
					await setDoc(doc(usersRef, result.user.uid), {
						username: result.user.email.substring(
							0,
							result.user.email.indexOf("@")
						),
						facebook: "",
						instagram: "",
						twitter: "",
						youtube: "",
						links: [],
					})
						.then(async () => {
							//-> user info doc created
							dispatch(
								logIn({
									name: result.user.displayName,
									username: result.user.email.substring(
										0,
										result.user.email.indexOf("@")
									),
									email: result.user.email,
									image: result.user.photoURL,
									verified: result.user.emailVerified,
								})
							);
						})
						.catch((error) => {
							alert(error);
						});
				}
			})
			.catch((error) => {
				alert(error);
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// const email = error.customData.email;
				// const credential = FacebookAuthProvider.credentialFromError(error);
			});
	};

	return (
		<div
			style={{ backgroundColor: "#F5F5F5" }}
			className="bg-slate-200 w-full flex flex-col items-center justify-between py-20"
		>
			<Comp.Logo className={"mb-10"} />

			<div className="">
				<div className="flex">
					<img
						src={require("../images/fb.png")}
						alt="fb_image"
						className="h-10 mx-2 hover:opacity-80 cursor-pointer"
						onClick={() => handleFbLogin()}
					/>
					<img
						src={require("../images/google.png")}
						alt="fb_image"
						className="h-10 mx-2 hover:opacity-80 cursor-pointer"
						onClick={() => handleGoogleLogin()}
					/>
					<img
						src={require("../images/apple.png")}
						alt="fb_image"
						className="h-10 mx-2 hover:opacity-80 cursor-pointer"
						onClick={() => handleAppleLogin()}
					/>
				</div>

				<p className="text-base mt-8">
					Don't have a Rifiz account?
					<span
						style={{ color: "#573AE8" }}
						className="hover:opacity-80 cursor-pointer ml-1"
						onClick={() => navigate("/register")}
					>
						Sign up
					</span>
				</p>
			</div>
		</div>
	);
}
