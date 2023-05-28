import React, { useState } from "react";
import * as Comp from "../../components/All";
/*Firebase Imports*/
import {
	db,
	getDoc,
	doc,
	auth,
	ref,
	storage,
	uploadBytesResumable,
	getDownloadURL,
	updateDoc,
	updateProfile,
	updateEmail,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "../../firebaseConfig";
/*Redux Imports*/
// import { selectUser, useDispatch, useSelector } from "../../features/userSlice";

export default function ResetPassword({ back }) {
	// const dispatch = useDispatch();
	// const { user } = useSelector(selectUser);
	const [isProcessing, setIsProcessing] = useState(false);

	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	/*Main Functions*/
	const handlePasswordUpdate = async () => {
		setIsProcessing(true);
		if (checkErrors()) {
			setIsProcessing(false);
			return;
		}
		changePassword();
	};

	const changePassword = () => {
		const credential = EmailAuthProvider.credential(
			auth.currentUser.email,
			password
		);
		reauthenticateWithCredential(auth.currentUser, credential)
			.then(() => {
				//-> old password correct
				updatePassword(auth.currentUser, newPassword)
					.then(() => {
						//-> password updated
						alert("Password Updated Successfully.");
						setIsProcessing(false);
						setPassword("");
						setNewPassword("");
						setIsProcessing(false);
					})
					.catch((error) => {
						alert(error);
						setIsProcessing(false);
					});
			})
			.catch((error) => {
				//-> old password incorrect
				alert(error);
				setIsProcessing(false);
			});
	};

	/*Helper Functions*/
	const checkErrors = () => {
		if (newPassword.length < 8) {
			alert("*minimum password length should be 8 characters.");
			return true;
		}

		return false;
	};

	return (
		<div className="MY-INFORMATION flex flex-col items-start">
			{/* headings */}
			<h1 style={{ color: "#111827" }} className="text-xl font-bold flex">
				{back && (
					<img
						src={require("../../images/left.png")}
						alt="back_image"
						className="h-8 w-8 mr-2 cursor-pointer"
						onClick={() => back(null)}
					/>
				)}
				Reset Password
			</h1>

			{/* image */}
			<div className="flex items-center mt-7">
				<p
					style={{ color: "#838383" }}
					className="text-sm font-semibold text-left"
				>
					Changing your username will also change your QR code and URL
				</p>
			</div>

			{/* inputs */}
			<div className="flex flex-col w-full mt-10">
				<Comp.TextInput
					secure={true}
					className={"mb-8"}
					label={"Current Password"}
					placeholder={"Password"}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<Comp.TextInput
					secure={true}
					className={"mb-8"}
					label={"New Password"}
					placeholder={"Password"}
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
			</div>

			{/* save button */}
			<div className="w-full mt-10">
				<Comp.Button
					disabled={isProcessing}
					title={isProcessing ? <Comp.Loading /> : "Reset Password"}
					onClick={() => handlePasswordUpdate()}
				/>
			</div>
		</div>
	);
}
