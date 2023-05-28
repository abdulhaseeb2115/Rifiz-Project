import React from "react";
import "./Loading.css";

const Loading = () => {
	return (
		<div className="LoadingComponent h-full w-full flex items-center justify-center">
			<div className="dot-pulse"></div>
		</div>
	);
};

export default Loading;
