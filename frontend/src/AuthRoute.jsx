import { useContext, React } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

//return outlet if logged in, otherwise return login page
const AuthRoute = () => {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default AuthRoute;