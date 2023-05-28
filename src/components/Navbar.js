import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
/*Redux Imports*/
import { selectUser, useSelector } from "../features/userSlice";

export default function Navbar() {
	const navigate = useNavigate();
	const { user } = useSelector(selectUser);

	return (
		<div
			style={{ minHeight: 70, height: 70, padding: "0px 8%" }}
			className="relative w-full flex items-center justify-between"
		>
			{/* logo */}
			<Logo className={"h-8 mb-0"} />

			{/* user image */}
			<div
				style={{
					height: 45,
					width: 45,
					minHeight: 45,
					minWidth: 45,
					borderColor: "#573AE8",
				}}
				className="flex p-0 items-center justify-center border-2 rounded-full overflow-hidden cursor-pointer"
			>
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
					onClick={() => navigate("/settings")}
				/>
			</div>

			{/* bottom gradient */}
			<img
				className="absolute bottom-0 left-0 w-full"
				src={require("../images/seperator.png")}
				alt="user_image"
			/>
		</div>
	);
}
