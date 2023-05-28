import React from "react";

export default function Button({ title, className, color, ...props }) {
	return (
		<button
			style={{
				backgroundColor: color ? color : "#573AE8",
				color: "white",
				borderRadius: 15,
				transitionDuration: "0.5s",
			}}
			className={`w-full h-11 font-bold hover:opacity-80  ${className}`}
			{...props}
		>
			{title}
		</button>
	);
}
