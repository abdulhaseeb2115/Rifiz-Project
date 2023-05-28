import React, { useState } from "react";
import * as Comp from "../components/All";
import * as Settings from "./settings/All ";
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
} from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Login } from "./All";
/*Redux Imports*/
// import { selectUser, useDispatch, useSelector } from "../../features/userSlice";

export default function SettingsScreen() {
	const navigate = useNavigate();
	const [isProcessing, setIsProcessing] = useState(false);
	const [selected, setSelected] = useState(1);
	const [selected1, setSelected1] = useState(null);

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

	/*Main Fnctions*/
	const imageStyle = {
		height: null,
		width: null,
		flex: 1,
		objectFit: "contain",
	};
	return (
		<div className="LandingScreen flex flex-col items-center justify-between w-full overflow-y-auto">
			<Comp.Navbar />
			<br />

			{isProcessing ? (
				<Comp.Loading />
			) : (
				<>
					<div
						style={{ maxWidth: 1000, padding: "0px 20px" }}
						className="w-full flex flex-col items-center my-auto"
					>
						{selected1 === null && (
							<h1
								style={{ color: "#111827", width: "90%" }}
								className="text-xl font-bold mx-auto mb-6 text-left md:hidden"
							>
								Account Settings
							</h1>
						)}

						{/* >md */}
						<div
							style={{
								width: 730,
								height: "fit-content",
								minHeight: 550,
								border: "1.5px solid #F1F1F1",
								borderRadius: 20,
							}}
							className="bg-white overflow-hidden p-0 hidden md:flex flex-col"
						>
							<div className="w-full flex-1 flex">
								{/* left */}
								<div
									style={{ height: 550, borderRight: "1.5px solid #F1F1F1" }}
									className="LEFT w-1/3 h-full py-10 pl-8 pr-4 flex flex-col items-start justify-between"
								>
									<p
										className="text-base font-semibold cursor-pointer"
										style={{ color: selected === 1 ? "#111827" : "#838383" }}
										onClick={() => setSelected(1)}
									>
										My information
									</p>

									<div className="flex flex-col items-start">
										<p
											className="text-base font-semibold cursor-pointer my-2"
											style={{ color: selected === 2 ? "#111827" : "#838383" }}
											onClick={() => setSelected(2)}
										>
											Reset Password
										</p>

										<p
											className="text-base font-semibold cursor-pointer my-2"
											style={{ color: selected === 3 ? "#111827" : "#838383" }}
											onClick={() => setSelected(3)}
										>
											Connect account
										</p>

										<p
											className="text-base font-semibold cursor-pointer my-2"
											style={{ color: selected === 4 ? "#111827" : "#838383" }}
											onClick={() => setSelected(4)}
										>
											Edit Links
										</p>
									</div>

									<p
										style={{ color: "#FA0200" }}
										className="text-base font-semibold cursor-pointer"
										onClick={() => handleDelete()}
									>
										Delete Account
									</p>
								</div>

								{/* right */}
								<div className="RIGHT w-2/3 h-full py-10 px-8">
									{selected === 1 && <Settings.MyInformation />}
									{selected === 2 && <Settings.ResetPassword />}
									{selected === 3 && <Settings.ConectAccount />}
									{selected === 4 && <Settings.EditLinks />}
								</div>
							</div>
						</div>

						{/* <md */}
						<div
							style={{
								width: "90%",
								height: "fit-content",
								minHeight: 550,
							}}
							className="bg-white overflow-hidden p-0 flex flex-col md:hidden"
						>
							<div className="w-full flex-1 flex">
								{selected1 === null ? (
									<>
										{/* left */}
										<div
											style={{
												height: 550,
												border: "1.5px solid #F1F1F1",
												boxShadow:
													" 0px 0px 85px 17px rgba(166, 166, 166, 0.07)",
												borderRadius: 10,
											}}
											className="LEFT w-full h-full py-10 pl-8 pr-4 flex flex-col items-start justify-between bg-white"
										>
											<div
												className="w-full text-base font-semibold cursor-pointer flex items-center justify-between"
												style={{
													color: selected === 1 ? "#111827" : "#838383",
												}}
												onClick={() => setSelected1(1)}
											>
												My information
												<div className="h-4 w-4 flex p-0 items-center justify-center rounded-full overflow-hidden ">
													<img
														style={imageStyle}
														src={require("../images/right.png")}
														alt="user_image"
													/>
												</div>
											</div>

											<div className="w-full flex flex-col items-start my-auto">
												<div
													className="w-full text-base font-semibold cursor-pointer flex items-center justify-between my-2"
													style={{
														color: selected === 2 ? "#111827" : "#838383",
													}}
													onClick={() => setSelected1(2)}
												>
													Reset Password
													<div className="h-4 w-4 flex p-0 items-center justify-center rounded-full overflow-hidden ">
														<img
															style={imageStyle}
															src={require("../images/right.png")}
															alt="user_image"
														/>
													</div>{" "}
												</div>

												<div
													className="w-full text-base font-semibold cursor-pointer flex items-center justify-between my-2"
													style={{
														color: selected === 3 ? "#111827" : "#838383",
													}}
													onClick={() => setSelected1(3)}
												>
													Connect account
													<div className="h-4 w-4 flex p-0 items-center justify-center rounded-full overflow-hidden ">
														<img
															style={imageStyle}
															src={require("../images/right.png")}
															alt="user_image"
														/>
													</div>{" "}
												</div>

												<div
													className="w-full text-base font-semibold cursor-pointer flex items-center justify-between my-2"
													style={{
														color: selected === 4 ? "#111827" : "#838383",
													}}
													onClick={() => setSelected1(4)}
												>
													Edit Links
													<div className="h-4 w-4 flex p-0 items-center justify-center rounded-full overflow-hidden ">
														<img
															style={imageStyle}
															src={require("../images/right.png")}
															alt="user_image"
														/>
													</div>{" "}
												</div>

												<div
													className="w-full text-base font-semibold cursor-pointer flex items-center justify-between my-2"
													style={{
														color: selected === 5 ? "#111827" : "#838383",
													}}
													onClick={() => setSelected1(5)}
												>
													Account Setting
													<div className="h-4 w-4 flex p-0 items-center justify-center rounded-full overflow-hidden ">
														<img
															style={imageStyle}
															src={require("../images/right.png")}
															alt="user_image"
														/>
													</div>{" "}
												</div>
											</div>
										</div>
									</>
								) : (
									<>
										{/* right */}
										<div className="RIGHT h-full w-full sm:py-10 sm:px-8">
											{selected1 === 1 && (
												<Settings.MyInformation back={setSelected1} />
											)}
											{selected1 === 2 && (
												<Settings.ResetPassword back={setSelected1} />
											)}
											{selected1 === 3 && (
												<Settings.ConectAccount back={setSelected1} />
											)}
											{selected1 === 4 && (
												<Settings.EditLinks back={setSelected1} />
											)}
											{selected1 === 5 && (
												<Settings.DeleteMd back={setSelected1} />
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</>
			)}
			<br />
		</div>
	);
}
