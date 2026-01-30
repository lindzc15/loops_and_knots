import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { isLoggedIn, login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/profile");
        }
    }, [isLoggedIn, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        const loginSuccess = await login(email, password);

        if (!email || !password) {
            setError("both fields are required");
            return;
        }

        if (loginSuccess) {
            navigate("/profile");
        }
        else {
            setError("Invalid email and password");
        }


    }

    return (
        <MainLayout title="Login | Loops & Knots">
            <div className="container d-flex flex-column flex-grow-1 justify-content-center">
                <div className="row mx-auto mt-4 mb-4" style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="text-center">
                        <h3 className="text-center mb-4">Login</h3>
                        {/* if error true, shows code on right side */}
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="col-sm-2 col-md-12 col-lg-12 mb-3 form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="floatingEmail"
                                    placeholder=""
                                />
                                <label className="form-label" htmlFor="floatingEmail">Email Address</label>
                            </div>
                            <div className="col-sm-2 col-md-12 col-lg-12 mb-3 form-floating">
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="floatingPassword"
                                    placeholder=""
                                />
                                <label className="form-label" htmlFor="floatingPassword">Password</label>
                            </div>
                            <p className="text-primary">New User? <a href="./createAccount">Create account</a></p>
                            <button type="submit" className="btn btn-primary mt-3 classicButton">
                                Log in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Login