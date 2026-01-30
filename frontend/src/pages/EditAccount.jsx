import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";


function EditAccount() {
    const [error, setError] = useState("");
    const { username, currName, setCurrName, setUsername, token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [oldUser, setOldUser] = useState("");
    useEffect(() => {
        setOldUser(username);
    }, []);

    //tracks whether account updated alert is showing
    const [showAlert, setShowAlert] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            // POST request to backend to attempt login
            const response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/login/update", {
                method: "POST",

                // send user and pass for verification
                body: JSON.stringify({
                    username: username,
                    name: currName,
                    old_username: oldUser
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).catch(error => {
                console.log("in fetch catch", error);
                setError("Error updating account");
                return false;
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.detail);
                setError(errorData.detail);
                return false;

            }

            //get response in json
            const updateSuccess = await response.json();
            //if success is true, show message and return to login page
            if (updateSuccess.success) {
                setError("");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    navigate("/profile");
                }, 1500);
                const decoded = jwtDecode(updateSuccess.jwt_token);
                setToken(updateSuccess.jwt_token);
                const user = decoded.user;
                setUsername(user.username);
                setCurrName(user.name);
                localStorage.setItem("token", JSON.stringify(updateSuccess.jwt_token));
            }
        }
        catch (error) {
            console.log("in the catch", error);
            setError("Error updating account");
        }
    }
    return (
        <MainLayout title="Edit Account | Loops & Knots">
            <button
                type="button"
                className="btn btn-primary classicButton backButton m-3"
                onClick={() => navigate("/profile")}
                style={{ minWidth: "120px" }}
            >
                {"<  "}Back
            </button>
            <div className="container d-flex flex-column flex-grow-1 justify-content-center">
                <div className="row mx-auto mt-4 mb-4" style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="text-center">
                        {/* shows account created alert when successful creation */}
                        {showAlert && (
                            <div className="alert custom-alert" role="alert">
                                Account changes saved!
                            </div>
                        )}
                        <h3 className="text-center mb-4">Edit Account</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="col-12 mb-3 form-floating">
                                <input
                                    className="form-control"
                                    id="floatingName"
                                    placeholder=""
                                    value={currName}
                                    onChange={(e) => setCurrName(e.target.value)}
                                />
                                <label className="form-label" htmlFor="floatingName">Name</label>
                            </div>
                            {/* <div className="col-12 mb-3 form-floating">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingEmail"
                            placeholder=""
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="form-label" htmlFor="floatingEmail">Email Address</label>
                    </div> */}
                            <button type="submit" className="btn btn-primary mt-3 classicButton">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>

    )
}

export default EditAccount