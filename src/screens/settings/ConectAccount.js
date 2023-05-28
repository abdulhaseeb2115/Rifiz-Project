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

export default function ConnectAccount({ back }) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [update, setUpdate] = useState(false);
	const [selected, setSelected] = useState(1);
	const [URL, setURL] = useState("");

	const [insta, setInsta] = useState("");
	const [youtube, setYoutube] = useState("");
	const [twitter, setTwitter] = useState("");
	const [fb, setFb] = useState("");

	/*Main Functions*/
	const handleChange = (x) => {
		if (isProcessing) {
			return;
		}

		setSelected(x);
		if (x === 1) {
			setURL(insta);
		} else if (x === 2) {
			setURL(youtube);
		} else if (x === 3) {
			setURL(twitter);
		} else if (x === 4) {
			setURL(fb);
		}
	};

	const handleDelete = () => {
		setIsProcessing(true);
		const userRef = doc(db, "users", auth.currentUser.uid);
		const field =
			(selected === 1 && {
				instagram: "",
			}) ||
			(selected === 2 && {
				youtube: "",
			}) ||
			(selected === 3 && {
				twitter: "",
			}) ||
			(selected === 4 && {
				facebook: "",
			});

		console.log(field);

		updateDoc(userRef, field)
			.then(() => {
				//-> link updated in the doc
				alert("Link Removed Successfully !");
				setIsProcessing(false);
				setUpdate(!update);
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
		return;
	};

	const handleUpdate = () => {
		setIsProcessing(true);
		const userRef = doc(db, "users", auth.currentUser.uid);
		const field =
			(selected === 1 && {
				instagram: URL,
			}) ||
			(selected === 2 && {
				youtube: URL,
			}) ||
			(selected === 3 && {
				twitter: URL,
			}) ||
			(selected === 4 && {
				facebook: URL,
			});

		console.log(field);

		updateDoc(userRef, field)
			.then(() => {
				//-> link updated in the doc
				alert("Account Updated Successfully !");
				setIsProcessing(false);
				setUpdate(!update);
			})
			.catch((error) => {
				alert(error);
				setIsProcessing(false);
			});
		return;
	};

	/*Get User Data*/
	useEffect(() => {
		const getLinks = async () => {
			const docRef = doc(db, "users", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				//-> user doc found
				setFb(docSnap.data().facebook);
				setInsta(docSnap.data().instagram);
				setTwitter(docSnap.data().twitter);
				setYoutube(docSnap.data().youtube);

				if (selected === 1) {
					setURL(docSnap.data().instagram);
				} else if (selected === 2) {
					setURL(docSnap.data().youtube);
				} else if (selected === 3) {
					setURL(docSnap.data().twitter);
				} else if (selected === 4) {
					setURL(docSnap.data().facebook);
				}
				// console.log(docSnap.data());
			}
		};
		getLinks();
		return () => {};
	}, [update]);

	return (
		<div className="CONNECT-ACOUNT flex flex-col items-start h-full w-full">
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
				Connect Account{" "}
			</h1>

			{/* link images */}
			<div className="flex w-full flex-wrap mt-4">
				<div
					style={{
						height: 40,
						width: 40,
						minHeight: 40,
						minWidth: 40,
						backgroundColor: selected === 1 ? "#000" : "#F1F1F1",
					}}
					className="flex items-center justify-center rounded-lg overflow-hidden cursor-pointer mr-3 mb-3 p-2 hover:opacity-80"
					onClick={() => {
						handleChange(1);
					}}
				>
					<svg
						width="23"
						height="24"
						viewBox="0 0 23 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M16.0713 0.888916H7.24272C5.51765 0.890979 3.86383 1.58919 2.64412 2.83035C1.42441 4.07152 0.738432 5.75427 0.736694 7.50939L0.736694 16.4918C0.738722 18.2469 1.42498 19.9295 2.64489 21.1705C3.8648 22.4114 5.51874 23.1094 7.24381 23.1111H16.0724C17.7975 23.1091 19.4513 22.4109 20.671 21.1697C21.8907 19.9285 22.5767 18.2458 22.5784 16.4907V7.50828C22.5764 5.75315 21.8901 4.07052 20.6702 2.82957C19.4503 1.58861 17.7964 0.890683 16.0713 0.888916V0.888916ZM20.3817 16.4907C20.3817 17.0666 20.2702 17.6368 20.0536 18.1689C19.8369 18.701 19.5194 19.1844 19.1192 19.5916C18.7189 19.9989 18.2438 20.3219 17.7208 20.5423C17.1979 20.7627 16.6374 20.8761 16.0713 20.8761H7.24272C6.09973 20.8758 5.00365 20.4137 4.19554 19.5913C3.38742 18.7689 2.93345 17.6536 2.93345 16.4907V7.50828C2.93374 6.34538 3.38799 5.23021 4.19631 4.40801C5.00463 3.58582 6.10082 3.12394 7.24381 3.12394H16.0724C17.2154 3.12423 18.3115 3.5864 19.1196 4.4088C19.9277 5.2312 20.3817 6.34649 20.3817 7.50939V16.4918V16.4907Z"
							fill={selected === 1 ? "white" : "#A7A7A7"}
						/>
						<path
							d="M11.6586 6.25293C10.1614 6.25529 8.72615 6.86153 7.66756 7.93878C6.60897 9.01602 6.01338 10.4764 6.01135 11.9997C6.01309 13.5233 6.6087 14.9841 7.66756 16.0616C8.72642 17.1392 10.1621 17.7454 11.6597 17.7475C13.1575 17.7457 14.5934 17.1396 15.6525 16.062C16.7116 14.9845 17.3074 13.5235 17.3091 11.9997C17.3068 10.476 16.7106 9.01541 15.6513 7.93832C14.5921 6.86122 13.1562 6.25551 11.6586 6.25404V6.25293ZM11.6586 15.5125C10.7432 15.5125 9.86525 15.1425 9.21795 14.4839C8.57066 13.8253 8.20701 12.9321 8.20701 12.0008C8.20701 11.0694 8.57066 10.1762 9.21795 9.51762C9.86525 8.85905 10.7432 8.48907 11.6586 8.48907C12.574 8.48907 13.4519 8.85905 14.0992 9.51762C14.7465 10.1762 15.1102 11.0694 15.1102 12.0008C15.1102 12.9321 14.7465 13.8253 14.0992 14.4839C13.4519 15.1425 12.574 15.5125 11.6586 15.5125V15.5125Z"
							fill={selected === 1 ? "white" : "#A7A7A7"}
						/>
						<path
							d="M17.3181 7.67253C18.0655 7.67253 18.6714 7.05609 18.6714 6.29568C18.6714 5.53526 18.0655 4.91882 17.3181 4.91882C16.5707 4.91882 15.9648 5.53526 15.9648 6.29568C15.9648 7.05609 16.5707 7.67253 17.3181 7.67253Z"
							fill={selected === 1 ? "white" : "#A7A7A7"}
						/>
					</svg>
				</div>

				<div
					style={{
						height: 40,
						width: 40,
						minHeight: 40,
						minWidth: 40,
						backgroundColor: selected === 2 ? "#000" : "#F1F1F1",
					}}
					className="flex items-center justify-center rounded-lg overflow-hidden cursor-pointer mr-3 mb-3 p-2 hover:opacity-80"
					onClick={() => {
						handleChange(2);
					}}
				>
					<svg
						width="23"
						height="18"
						viewBox="0 0 23 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.937 0.852973H5.16817C2.6619 0.852973 0.631714 2.99385 0.631714 5.63523V12.3647C0.631714 15.0061 2.66299 17.1481 5.16817 17.1481H17.937C20.4433 17.1481 22.4734 15.0061 22.4734 12.3647V5.63523C22.4734 2.99385 20.4422 0.851807 17.937 0.851807V0.852973ZM14.8693 9.32663L8.89692 12.3308C8.86049 12.3495 8.82022 12.3581 8.77985 12.3558C8.73948 12.3534 8.70033 12.3402 8.66603 12.3174C8.63173 12.2946 8.60341 12.2629 8.58369 12.2252C8.56398 12.1876 8.55351 12.1453 8.55327 12.1022V5.90823C8.55327 5.72039 8.7426 5.59789 8.9013 5.68306L14.8747 8.87395C14.9145 8.8951 14.9479 8.92779 14.9711 8.96825C14.9942 9.00871 15.0062 9.05531 15.0056 9.1027C15.005 9.15009 14.992 9.19635 14.9678 9.23617C14.9437 9.27598 14.9096 9.30774 14.8693 9.32779V9.32663Z"
							fill={selected === 2 ? "white" : "#A7A7A7"}
						/>
					</svg>
				</div>

				<div
					style={{
						height: 40,
						width: 40,
						minHeight: 40,
						minWidth: 40,
						backgroundColor: selected === 3 ? "#000" : "#F1F1F1",
					}}
					className="flex items-center justify-center rounded-lg overflow-hidden cursor-pointer mr-3 mb-3 p-2 hover:opacity-80"
					onClick={() => {
						handleChange(3);
					}}
				>
					<svg
						width="23"
						height="19"
						viewBox="0 0 23 19"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22.3686 2.95405C21.5499 3.31781 20.6829 3.55631 19.7956 3.66183C20.7269 3.10542 21.4273 2.22306 21.7657 1.17961C20.8833 1.7022 19.9209 2.07028 18.9187 2.2685C18.4966 1.81873 17.989 1.46115 17.4266 1.21759C16.8643 0.974025 16.2591 0.849576 15.6479 0.851837C13.1732 0.851837 11.1671 2.86294 11.1671 5.34071C11.1671 5.69183 11.2064 6.03516 11.2828 6.36293C9.50771 6.27704 7.7697 5.81561 6.17968 5.00809C4.58966 4.20057 3.18255 3.0647 2.04813 1.67295C1.65042 2.35561 1.44138 3.13492 1.44312 3.9285C1.44312 5.48738 2.23379 6.86182 3.43508 7.66515C2.72466 7.64182 2.02959 7.44885 1.40598 7.10182V7.15738C1.40598 9.33293 2.95129 11.1474 4.99895 11.5607C4.61411 11.6646 4.21765 11.7172 3.8195 11.7174C3.53009 11.7174 3.24943 11.6896 2.97531 11.634C3.26808 12.5317 3.82835 13.3144 4.5783 13.8733C5.32824 14.4322 6.23065 14.7397 7.16019 14.7529C5.56582 16.0024 3.60853 16.6774 1.59601 16.6718C1.23344 16.6718 0.877415 16.6496 0.526855 16.6096C2.58135 17.9326 4.96356 18.6332 7.39499 18.6296C15.637 18.6296 20.1429 11.7885 20.1429 5.85627L20.1276 5.27516C21.0066 4.64591 21.7659 3.85944 22.3686 2.95405V2.95405Z"
							fill={selected === 3 ? "white" : "#A7A7A7"}
						/>
					</svg>
				</div>

				<div
					style={{
						height: 40,
						width: 40,
						minHeight: 40,
						minWidth: 40,
						backgroundColor: selected === 4 ? "#000" : "#F1F1F1",
					}}
					className="flex items-center justify-center rounded-lg overflow-hidden cursor-pointer mr-3 mb-3 p-2 hover:opacity-80"
					onClick={() => {
						handleChange(4);
					}}
				>
					<svg
						width="11"
						height="22"
						viewBox="0 0 11 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.44964 4.9053V7.76093H0.24585V11.2525H2.44964V21.6297H6.97321V11.2536H10.0097C10.0097 11.2536 10.2942 9.57947 10.4321 7.74846H6.99181V5.36045C6.99181 5.00402 7.48422 4.52392 7.97225 4.52392H10.4387V0.888916H7.08592C2.33693 0.888916 2.44964 4.38364 2.44964 4.9053V4.9053Z"
							fill={selected === 4 ? "white" : "#A7A7A7"}
						/>
					</svg>
				</div>
			</div>

			{/* inputs */}
			<div className="flex flex-col w-full mt-6">
				<Comp.TextInput
					className={"mb-6"}
					label={"URL"}
					placeholder={"URL"}
					value={URL}
					onChange={(e) => setURL(e.target.value)}
				/>
			</div>

			{/* buttons */}
			<div className="w-full flex mt-4">
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
		</div>
	);
}
