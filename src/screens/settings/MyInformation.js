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
} from "../../firebaseConfig";
/*Redux Imports*/
import {
	logIn,
	selectUser,
	useDispatch,
	useSelector,
} from "../../features/userSlice";

export default function MyInformation({ back }) {
	const dispatch = useDispatch();
	const { user } = useSelector(selectUser);
	const [isProcessing, setIsProcessing] = useState(false);

	const [image, setImage] = useState(user.image);
	const [imageFinal, setImageFinal] = useState(null);
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [username, setUsername] = useState(user.username);

	/*Main Functions*/
	const handleImageDelete = () => {
		setImage(null);
		setImageFinal(null);
	};

	const handleImageUpdate = (e) => {
		setIsProcessing(true);
		if (verifyImage(e)) {
			setIsProcessing(false);
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			// set image
			if (reader.readyState === 2) {
				setImage(reader.result);
			}
		};
		reader.readAsDataURL(e.target.files[0]);
		setImageFinal(e.target.files[0]);
		setIsProcessing(false);
	};

	const handleUpdate = () => {
		setIsProcessing(true);
		if (checkErrors()) {
			setIsProcessing(false);
			return;
		}
		if (imageFinal === null) {
			updateData("");
			return;
		}
		updateImage();
	};

	const updateImage = async () => {
		const imageRef = ref(storage, `profile-images/${auth.currentUser.uid}`);
		const uploadTask = uploadBytesResumable(imageRef, imageFinal);
		uploadTask.on(
			"state-changed",

			// upload progress
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
			},

			// error in image upload
			(error) => {
				alert(error);
			},

			// successful image upload
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("Image Updated");
					setImage(downloadURL);
					setImageFinal(null);
					updateData(downloadURL);
					return;
				});
			}
		);
	};

	const updateData = async (token) => {
		// console.log(token);
		updateProfile(auth.currentUser, {
			displayName: name,
			photoURL: token,
		})
			.then(() => {
				//-> display name updated in the profile
				console.log("DisplayName Updated");
				updateEmail(auth.currentUser, email)
					.then(() => {
						//-> email updated in the account
						console.log("Email Updated");
						const userRef = doc(db, "users", auth.currentUser.uid);
						updateDoc(userRef, {
							username: username,
						}).then(() => {
							//-> username updated in the doc
							console.log("Username Updated");
							console.log("Data Updated Successfully !");
							dispatch(
								logIn({
									name: name,
									username: username,
									email: user.email,
									image: image,
									verified: user.emailVerified,
								})
							);
							alert("Data Updated Successfully !");
							setIsProcessing(false);
						});
					})
					.catch((error) => {
						alert(error);
						setIsProcessing(false);
					});
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
	};

	/*Helper Functions*/
	const verifyImage = (e) => {
		const fileName = e.target.files[0].name;
		// console.log(fileName.split(".")[1]);
		if (fileName === "") {
			alert("Upload a valid File with png or jpg extension");
			return true;
		} else if (
			fileName.split(".")[1].toUpperCase() === "PNG" ||
			fileName.split(".")[1].toUpperCase() === "JPG"
		)
			return false;
		else {
			alert(
				"File with " +
					fileName.split(".")[1] +
					" is invalid. Upload a validfile with png or jpg extensions"
			);
			return true;
		}
	};

	const checkErrors = () => {
		if (name === "") {
			alert("*name cannot be empty.");
			return true;
		}

		if (username === "") {
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

		return false;
	};

	return (
		<div className="MY-INFORMATION flex flex-col items-start h-full">
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
				My information
			</h1>

			{/* image */}
			<div className="flex items-center mt-8">
				<div
					style={{
						height: 77,
						width: 77,
						minHeight: 77,
						minWidth: 77,
					}}
					className="flex p-0 items-center justify-center rounded-full overflow-hidden"
				>
					<img
						style={{
							height: null,
							width: null,
							flex: 1,
							objectFit: "contain",
						}}
						src={image !== null ? image : require("../../images/avatar.png")}
						alt="user_image"
					/>
				</div>

				<p
					style={{ color: "#838383" }}
					className="text-base ml-3 font-semibold text-left"
				>
					Image size should be at least 320 px big, and less then 500 KB.
					Allowed files .png and .jpg
				</p>
			</div>

			{/* buttons */}
			<div className="flex mt-5">
				<div className="relative overflow-hidden cursor-pointer hover:opacity-70">
					<input
						multiple={false}
						type="file"
						name="image"
						id="image"
						onChange={(e) => handleImageUpdate(e)}
						accept="image/*"
						className={
							"absolute h-full w-96 right-0 top-0 opacity- cursor-pointer"
						}
					/>
					<p
						style={{ color: "#573AE8" }}
						className="text-base font-semibold cursor-pointer"
						// onClick={() => handleImageUpdate()}
					>
						Update profile photo
					</p>
				</div>

				<button
					style={{ color: "#838383" }}
					className="text-base ml-5 font-semibold hover:opacity-70"
					onClick={() => handleImageDelete()}
				>
					Delete
				</button>
			</div>

			{/* inputs */}
			<div className="flex flex-col w-full mt-7">
				<Comp.TextInput
					readOnly={isProcessing}
					className={"mb-6"}
					label={"Name"}
					placeholder={"Name"}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<Comp.TextInput
					readOnly={isProcessing}
					className={"mb-6"}
					label={"Email"}
					placeholder={"Email"}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Comp.TextInput
					readOnly={isProcessing}
					className={"mb-6"}
					label={"Username"}
					placeholder={"Username"}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>

			{/* save button */}
			<div className="w-full mt-12">
				<Comp.Button
					disabled={isProcessing}
					title={isProcessing ? <Comp.Loading /> : "Save Details"}
					onClick={() => handleUpdate()}
				/>
			</div>
		</div>
	);
}
