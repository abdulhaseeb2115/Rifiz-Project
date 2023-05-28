import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Comp from "../components/All";
/*Firebase Imports*/
import { db, getDoc, doc, auth } from "../firebaseConfig";
/*Redux Imports*/
import { selectUser, useSelector } from "../features/userSlice";
import WelcomeScreen from "./WelcomeScreen";

export default function LandingScreen() {
	const navigate = useNavigate();
	const { user, loading } = useSelector(selectUser);
	const [showWelcome, setShowWelcome] = useState();

	const [fb, setFb] = useState("");
	const [insta, setInsta] = useState("");
	const [twitter, setTwitter] = useState("");
	const [youtube, setYoutube] = useState("");
	const [links, setLinks] = useState([]);

	/*Get User Data*/
	useEffect(() => {
		const getLinks = async () => {
			const docRef = doc(db, "users", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				//-> user doc found
				setLinks(docSnap.data().links);
				setFb(docSnap.data().facebook);
				setInsta(docSnap.data().instagram);
				setTwitter(docSnap.data().twitter);
				setYoutube(docSnap.data().youtube);
				// console.log(docSnap.data());
			}
		};
		getLinks();
		return () => {};
	}, []);

	useEffect(() => {
		setShowWelcome(user.first);
		return () => {};
	}, [user, loading]);

	return (
		loading === false &&
		(showWelcome === true ? (
			<WelcomeScreen auth={auth} setShowWelcome={setShowWelcome} />
		) : (
			<div className="LandingScreen flex flex-col items-center justify-between w-full overflow-y-auto">
				<Comp.Navbar />
				<div
					style={{ maxWidth: 1000, padding: "0px 20px" }}
					className="w-full flex flex-col items-center mb-auto"
				>
					<div className="Info flex flex-col items-center my-auto mt-16">
						<div className="h-32 w-32 flex p-0 items-center justify-center rounded-full overflow-hidden">
							<img
								style={{
									height: null,
									width: null,
									flex: 1,
									objectFit: "contain",
								}}
								src={
									user && user.image !== null
										? user.image
										: require("../images/avatar.png")
								}
								alt="user_image"
							/>
						</div>

						<h1
							style={{ color: "#111827" }}
							className="text-2xl sm:text-3xl font-extrabold flex mt-5"
						>
							{user && user.name}{" "}
							{user && user.verified && (
								<img
									src={require("../images/verified.png")}
									alt="verified_image"
									className="h-7 my-auto pt-2 ml-2"
								/>
							)}
						</h1>

						<p
							style={{ color: "#A7A7A7" }}
							className="text-base sm:text-lg font-bold mt-2"
						>
							{}
							{user && "@" + user.username}
						</p>

						<div className="social flex mt-4">
							<img
								src={require("../images/instaGray.png")}
								alt="insta_image"
								style={{ transitionDuration: "0.5s" }}
								className="h-8 w-8 mx-2 hover:opacity-60 cursor-pointer"
								onClick={() => window.open(insta)}
							/>
							<img
								src={require("../images/youtubeGray.png")}
								alt="youtube_image"
								style={{ transitionDuration: "0.5s" }}
								className="h-8 w-8 mx-2 hover:opacity-60 cursor-pointer"
								onClick={() => window.open(youtube)}
							/>
							<img
								src={require("../images/twitterGray.png")}
								alt="twitter_image"
								style={{ transitionDuration: "0.3s" }}
								className="h-8 w-8 mx-2 hover:opacity-60 cursor-pointer"
								onClick={() => window.open(twitter)}
							/>
							<img
								src={require("../images/fbGray.png")}
								alt="fb_image"
								style={{ transitionDuration: "0.5s" }}
								className="h-8 w-8 mx-2 hover:opacity-60 cursor-pointer"
								onClick={() => window.open(fb)}
							/>
						</div>
					</div>

					<div className="Links w-full my-5">
						{links.map(({ image, name, url }, index) => (
							<Comp.Link
								key={index}
								image={image}
								name={name}
								onClick={() => window.open(url)}
							/>
						))}
					</div>
				</div>
			</div>
		))
	);
}
