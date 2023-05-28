import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logo({ className }) {
	const navigate = useNavigate();
	return (
		<div className={`Logo mb-4 h-10 ${className}`}>
			<img
				className="h-full object-contain cursor-pointer"
				src={require("../images/Logo.png")}
				alt="logo_image"
				onClick={() => navigate("/")}
			/>
		</div>
	);
}
