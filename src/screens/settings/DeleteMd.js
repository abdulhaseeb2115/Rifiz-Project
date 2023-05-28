import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
	deleteUser,
} from "../../firebaseConfig";
/*Redux Imports*/
// import { selectUser, useDispatch, useSelector } from "../../features/userSlice";

export default function DeleteMd({ back }) {
	const navigate = useNavigate();
	const [isProcessing, setIsProcessing] = useState(false);

	/*Main Fnctions*/
	const handleDelete = () => {
		setIsProcessing(true);
		let password = prompt("Please enter your password.");
		if (password.length === 0) {
			alert("*password cannot be empty");
			setIsProcessing(false);
			return;
		}

		const credential = EmailAuthProvider.credential(
			auth.currentUser.email,
			password
		);
		reauthenticateWithCredential(auth.currentUser, credential)
			.then(() => {
				//-> old password correct
				deleteUser(auth.currentUser)
					.then(() => {
						//-> account deleted
						alert("Your Account is Deleted !");
						navigate("/login");
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

	return (
		<div className="DELETE flex flex-col items-start h-full w-full ">
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
				Account Settings
			</h1>

			<Comp.Button
				color={"#FA0200"}
				disabled={isProcessing}
				title={isProcessing ? <Comp.Loading /> : "Delete Link"}
				className="mt-14"
				onClick={() => handleDelete()}
			/>
		</div>
	);
}
