import React from "react";
import { useNavigate } from "react-router-dom";
import * as Comp from "../components/All";

export default function WelcomeScreen({ auth, setShowWelcome }) {
	const navigate = useNavigate();

	return (
		<div className="WelcomeScreen flex flex-col items-center justify-center w-full">
			<Comp.Logo />
			<div className="w-full flex flex-col items-center mt-5">
				<h1
					style={{ color: "#111827" }}
					className="text-2xl sm:text-3xl font-extrabold"
				>
					Thanks for signing up{" "}
				</h1>
				<p style={{ color: "#4B5563" }} className="text-base sm:text-lg mb-5">
					To verify your account, click on the link sent to your inbox (
					{auth.currentUser.email}
					).{" "}
				</p>
				<div style={{ maxWidth: 500, width: "100%", padding: "0px 20px" }}>
					<Comp.Button
						title="Continue to my Rifiz"
						className={"my-5 w-full"}
						// onClick={() => navigate("/")}
						onClick={() => {
							// setShowWelcome(false);
							// navigate("/");
							window.location.reload();
						}}
					/>
				</div>
			</div>
		</div>
	);
}
