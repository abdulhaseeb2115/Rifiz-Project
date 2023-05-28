import React, { useState } from "react";

const TextInput = ({ secure, label, className, ...props }) => {
	const [show, setShow] = useState(false);
	return (
		<>
			<div className={`flex flex-col items-start ${className}`}>
				<p className="text-sm font-semibold mb-2">{label}</p>

				<div
					style={{
						height: 48,
						backgroundColor: "#F9F9F9",
						borderRadius: 20,
					}}
					className="w-full flex items-center px-4"
				>
					{secure === true ? (
						<>
							<input
								type={show ? "text" : "password"}
								className="flex-1 pr-2 bg-transparent"
								{...props}
							/>
							<div
								className={`h-7 w-7 p-1 rounded-full cursor-pointer ${
									show && "bg-white border"
								}`}
							>
								<img
									src={require("../images/Eye.png")}
									alt="eye_image"
									className="w-full h-full"
									onClick={() => setShow(!show)}
								/>
							</div>
						</>
					) : (
						<>
							<input
								type="text"
								className="flex-1 pr-2 bg-transparent"
								{...props}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default TextInput;
