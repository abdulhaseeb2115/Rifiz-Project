import React, { useState } from "react";
import * as Comp from "../components/All";

/*Firebase Imports*/
import {
	createUserWithEmailAndPassword,
	auth,
	updateProfile,
	setDoc,
	collection,
	db,
	doc,
	sendEmailVerification,
} from "../firebaseConfig";
/*Redux Imports*/
import { logIn, useDispatch } from "../features/userSlice";
import WelcomeScreen from "./WelcomeScreen";
import { useNavigate } from "react-router-dom";

export default function RegisterScreen() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isProcessing, setIsProcessing] = useState(false);
	// const [showWelcome, setShowWelcome] = useState(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	/*Main Functions*/
	const handleSubmit = () => {
		setIsProcessing(true);
		if (checkErrors()) {
			setIsProcessing(false);
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				//-> created user account
				updateProfile(auth.currentUser, {
					displayName: name,
					photoURL: "",
				}).then(async () => {
					//-> added user name
					const usersRef = collection(db, "users");
					await setDoc(doc(usersRef, auth.currentUser.uid), {
						username: email.substring(0, email.indexOf("@")),
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
									name: userCredential.user.displayName,
									username: email.substring(0, email.indexOf("@")),
									email: userCredential.user.email,
									image: userCredential.user.photoURL,
									verified: userCredential.user.emailVerified,
									first: true,
								})
							);
							await sendEmailVerification(auth.currentUser);
							//-> verification email sent
							// setShowWelcome(true);
						})
						.catch((error) => {
							alert(error);
						});
					setIsProcessing(false);
				});
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
	};

	/*Helper Functions*/
	const checkErrors = () => {
		if (name === "") {
			alert("*username cannot be empty.");
			return true;
		}

		if (email === "") {
			alert("*email cannot be empty.");
			return true;
		}

		const pattern = /\S+@\S+\.\S+/;
		if (!pattern.test(email)) {
			alert("*email is inavlid.");
			return true;
		}

		if (password.length < 8) {
			alert("*minimum password length should be 8 characters.");
			return true;
		}

		return false;
	};

	return (
		// showWelcome === true ? (
		// <WelcomeScreen email={auth.currentUser.email} />
		// ) : (
		// <>
		<div className="RegisterScreen flex flex-col items-center justify-center w-full">
			<Comp.Logo />
			<div
				style={{ maxWidth: 500, padding: "0px 20px" }}
				className="w-full flex flex-col mt-5"
			>
				<h1
					style={{ color: "#111827" }}
					className="text-2xl sm:text-3xl font-extrabold mr-auto"
				>
					Create an account for free
				</h1>

				<p
					style={{ color: "#4B5563" }}
					className="text-base sm:text-lg mr-auto mb-5"
				>
					Free forever. No payment needed.
				</p>

				<Comp.TextInput
					className={"my-3"}
					label={"User name"}
					placeholder={"User name"}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<Comp.TextInput
					className={"my-3"}
					label={"Email"}
					placeholder={"Email"}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Comp.TextInput
					className={"my-3"}
					secure={true}
					label={"Password"}
					placeholder={"Password"}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<p className="mt-2 px-4 font-medium text-base">
					By signing up, you are agreeing to our <br />
					<span
						style={{ color: "#573AE8" }}
						className={"hover:opacity-80 cursor-pointer"}
						onClick={() => {}}
					>
						{" "}
						Terms and Conditions
					</span>{" "}
					and
					<span
						style={{ color: "#573AE8" }}
						className={"hover:opacity-80 cursor-pointer"}
						onClick={() => {}}
					>
						{" "}
						Privacy Notice
					</span>
				</p>

				<Comp.Button
					title={isProcessing === true ? <Comp.Loading /> : "Sign up"}
					className={"my-5"}
					onClick={() => handleSubmit()}
					disabled={isProcessing}
				/>

				<p className="px-12 font-medium text-base">
					Already have an account?
					<span
						style={{ color: "#573AE8" }}
						className={"hover:opacity-80 cursor-pointer"}
						onClick={() => {
							navigate("/login");
						}}
					>
						{" "}
						Login
					</span>
				</p>
			</div>
		</div>
		// </>
		// );
	);
}
