import { Navigate } from "react-router-dom";
import { useSelector, selectUser } from "../features/userSlice";
import Loading from "./Loading/Loading";

function ProtectedRoute({ loginRoute, component }) {
	const { user, loading } = useSelector(selectUser);
	if (loading === false) {
		if (user === null && loginRoute === false) {
			return <Navigate to="/login" />;
		}

		if (user === null && loginRoute === true) {
			return component;
		}

		if (user !== null && loginRoute === true) {
			return <Navigate to="/" />;
		}

		if (user !== null && loginRoute === false) {
			return component;
		}
	} else {
		return <Loading />;
	}
}

export default ProtectedRoute;
