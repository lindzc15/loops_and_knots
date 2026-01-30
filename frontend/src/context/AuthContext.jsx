import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [currName, setCurrName] = useState(null);

    function getUsernameFromToken(token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.user?.username || decoded.sub || null;
        } catch (err) {
            console.error("Invalid token:", err);
            return null;
        }
    }

    function getNameFromToken(token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.user?.name || null;
        } catch (err) {
            console.error("Invalid token:", err);
            return null;
        }
    }

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.user?.username || decoded.sub || "");
                setCurrName(decoded.user?.name || "");
                setIsLoggedIn(true);
            } catch (err) {
                console.error("Invalid token:", err);
                setIsLoggedIn(false);
            }
        } else {
            setUsername("");
            setCurrName("");
            setIsLoggedIn(false);
        }
    }, [token]);

    //will run only on mount, when application loads
    useEffect(() => {
        async function verify_token(token) {
            try {
                // POST request to backend to verify if user is authenticated or not
                const response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/login/verify", {
                    method: "POST",

                    // send token for verification
                    body: JSON.stringify({
                        jwt_token: token,
                    }),

                    // Adding headers to the request
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData.detail);
                }
                else {
                    const loginStatus = await response.json();
                    setIsLoggedIn(true);
                    setToken(loginStatus.jwt_token);
                    const username = getUsernameFromToken(token);
                    setUsername(username);
                    const currName = getNameFromToken(token);
                    setCurrName(currName);
                }

            }
            catch (error) {
                console.log("in the catch", error);
                return false;
            }
        }
        let token = JSON.parse(localStorage.getItem("token"));
        //only attempt verification if token is set
        if (token) {
            verify_token(token)
        }

    }, []);

    async function login(username, password) {
        try {
            // POST request to backend to attempt login
            const response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/login", {
                method: "POST",

                // send user and pass for verification
                body: JSON.stringify({
                    username: username,
                    password: password
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).catch(error => {
                console.log("in fetch catch", error);
                return false;
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.detail);
                return false;

            }

            //get response in json
            const loginStatus = await response.json();
            //if success is true, set token in state and local storage, set logged in, return true
            if (loginStatus.success) {
                localStorage.setItem("token", JSON.stringify(loginStatus.jwt_token));
                setIsLoggedIn(true);
                setToken(loginStatus.jwt_token);
                return true;
            }
            //if not successful, return false
            return false;
        }
        catch (error) {
            console.log("in the catch", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout, username, currName, setCurrName, setUsername, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export { AuthContext };