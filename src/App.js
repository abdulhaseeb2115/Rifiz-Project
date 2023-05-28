import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/**Screens Imports**/
import * as Screen from "./screens/All";
import ProtectedRoute from "./components/ProtectedRoute";
/*Firebase Imports*/
import {
	db,
	getDoc,
	doc,
	auth,
	onAuthStateChanged,
	signOut,
} from "./firebaseConfig";
/*Redux Imports*/
import {
	logIn,
	logOut,
	useDispatch,
	selectUser,
	useSelector,
} from "./features/userSlice";
/** **/

function App() {
	const dispatch = useDispatch();
	// const { user } = useSelector(selectUser);

	/**
	 * Check If Logged In
	 */
	useEffect(() => {
		const checkAuthState = () =>
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					//-> user logged in
					const docRef = doc(db, "users", auth.currentUser.uid);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						//-> user doc found
						dispatch(
							logIn({
								name: user.displayName,
								username: docSnap.data().username,
								email: user.email,
								image: user.photoURL,
								verified: user.emailVerified,
							})
						);
					} else {
						dispatch(logOut());
					}
				} else {
					//-> user logged out
					signOut(auth);
					dispatch(logOut());
				}
			});

		checkAuthState();
		return () => console.log();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	/** **/

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					{/*
					 ** Routes
					 */}

					<Route
						path="/login"
						element={
							<ProtectedRoute loginRoute={true} component={<Screen.Login />} />
						}
					/>

					<Route
						path="/register"
						element={
							<ProtectedRoute
								loginRoute={true}
								component={<Screen.Register />}
							/>
						}
					/>

					<Route
						path="/"
						element={
							<ProtectedRoute
								loginRoute={false}
								component={<Screen.Landing />}
							/>
						}
					/>

					<Route
						path="/settings"
						element={
							<ProtectedRoute
								loginRoute={false}
								component={<Screen.Settings />}
							/>
						}
					/>

					{/*
					 ** 404 Not Found
					 */}
					<Route
						path="/*"
						element={
							<div className="h-full w-full flex items-center justify-center">
								<h1 className="text-2xl">
									404
									<br /> Page Not Found
								</h1>
							</div>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
