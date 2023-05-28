import React, { useEffect, useState } from "react";
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

export default function EditLinks({ back }) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [update, setUpdate] = useState(false);
	const [selected, setSelected] = useState(null);
	const [links, setLinks] = useState([]);

	const [name, setName] = useState("");
	const [URL, setURL] = useState("");
	const [image, setImage] = useState("");

	/*Main Functions*/
	const handleChange = (x) => {
		if (isProcessing) {
			return;
		}

		setSelected(x);
		if (x === null) {
			setName("");
			setURL("");
			setImage("");
			return;
		}

		setName(links[x].name);
		setURL(links[x].url);
		setImage(links[x].image);
	};

	const handleDelete = () => {
		setIsProcessing(true);
		if (checkErrors()) {
			setIsProcessing(false);
			return;
		}

		const userRef = doc(db, "users", auth.currentUser.uid);
		const tempArr = links.filter(({ x }, index) => index !== selected);
		setLinks(tempArr);

		updateDoc(userRef, {
			links: tempArr,
		})
			.then(() => {
				//-> link updated in the doc
				setUpdate(!update);
				handleChange(null);
				alert("Link Removed !");
				setIsProcessing(false);
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
		return;
	};

	const handleUpdate = () => {
		setIsProcessing(true);
		if (checkErrors()) {
			setIsProcessing(false);
			return;
		}
		const userRef = doc(db, "users", auth.currentUser.uid);
		const tempArr = links;
		tempArr[selected] = {
			name: name,
			url: URL,
			image: image,
		};
		updateDoc(userRef, {
			links: tempArr,
		})
			.then(() => {
				//-> link updated in the doc
				setUpdate(!update);
				alert("Link Updated !");
				setIsProcessing(false);
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
		return;
	};

	const handleAdd = () => {
		setIsProcessing(true);
		if (checkErrors()) {
			setIsProcessing(false);
			return;
		}

		const userRef = doc(db, "users", auth.currentUser.uid);
		const tempArr = links;
		tempArr.push({
			name: name,
			url: URL,
			image: image,
		});
		updateDoc(userRef, {
			links: tempArr,
		})
			.then(() => {
				//-> link updated in the doc
				handleChange(null);
				setUpdate(!update);
				alert("Link Added !");
				setIsProcessing(false);
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
		return;
	};

	/*Helper Functions*/
	const checkErrors = () => {
		if (name === "") {
			alert("*link name cannot be empty.");
			return true;
		}

		if (URL === "") {
			alert("*link url cannot be empty.");
			return true;
		}

		return false;
	};

	/*Get User Data*/
	useEffect(() => {
		const getLinks = async () => {
			const docRef = doc(db, "users", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				//-> user doc found
				setLinks(docSnap.data().links);
				// console.log(docSnap.data());
			}
		};
		getLinks();
		return () => {};
	}, [update]);

	return (
		<div className="MY-INFORMATION flex flex-col items-start h-full w-full">
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
				Edit Links
			</h1>

			{/* links */}
			<div className="flex w-full flex-wrap mt-4">
				{links.map(({ name, url, image }, index) => (
					<div
						key={index}
						style={{
							height: 40,
							width: 40,
							minHeight: 40,
							minWidth: 40,
							backgroundColor: selected === index ? "#000" : "#F1F1F1",
						}}
						className="flex items-center justify-center rounded-lg overflow-hidden cursor-pointer mr-3 mb-3 p-2 hover:opacity-80"
						onClick={() => {
							if (selected === index) {
								handleChange(null);
								return;
							}
							handleChange(index);
						}}
					>
						<img
							style={{
								height: null,
								width: null,
								flex: 1,
								objectFit: "contain",
							}}
							src={image ? image : require("../../images/link.jpg")}
							alt="user_image"
						/>
					</div>
				))}
			</div>

			{/* inputs */}
			<div className="flex flex-col w-full mt-6">
				<Comp.TextInput
					className={"mb-6"}
					label={"Link Name"}
					placeholder={"My Link Name"}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<Comp.TextInput
					className={"mb-6"}
					label={"URL"}
					placeholder={"https://yourlink.com"}
					value={URL}
					onChange={(e) => setURL(e.target.value)}
				/>

				<Comp.TextInput
					className={"mb-6"}
					label={"Image (optional)"}
					placeholder={"https://linkImage.com"}
					value={image}
					onChange={(e) => setImage(e.target.value)}
				/>
			</div>

			{/* save button */}
			<div className="w-full mt-10">
				{selected === null ? (
					<Comp.Button
						disabled={isProcessing}
						title={isProcessing ? <Comp.Loading /> : "Add Link"}
						onClick={() => handleAdd()}
					/>
				) : (
					<div className="flex">
						<Comp.Button
							color={"#FA0200"}
							disabled={isProcessing}
							title={isProcessing ? <Comp.Loading /> : "Delete Link"}
							className="mr-4"
							onClick={() => handleDelete()}
						/>
						<Comp.Button
							disabled={isProcessing}
							title={isProcessing ? <Comp.Loading /> : "Update Link"}
							onClick={() => handleUpdate()}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
