import React from "react";

export default function Link({ name, image, ...props }) {
	const imageStyle = {
		height: null,
		width: null,
		flex: 1,
		objectFit: "contain",
	};

	return (
		<div
			style={{
				height: 70,
				borderRadius: 20,
				boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.15)",
				backgroundColor: "white",
				transitionDuration: "0.3s",
			}}
			className="relative w-full flex items-center my-4 px-16 justify-center cursor-pointer hover:opacity-60"
			{...props}
		>
			<div className="h-10 w-10 flex p-0 items-center justify-center rounded-full overflow-hidden absolute left-6">
				<img
					style={imageStyle}
					src={image ? image : require("../images/link.jpg")}
					alt="user_image"
				/>
			</div>

			<p className="text-base font-bold mx-auto">{name}</p>

			<div className="h-4 w-4 flex p-0 items-center justify-center rounded-full overflow-hidden absolute right-6 md:hidden">
				<img
					style={imageStyle}
					src={require("../images/right.png")}
					alt="user_image"
				/>
			</div>
		</div>
	);
}
