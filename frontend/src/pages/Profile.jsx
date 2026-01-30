import React from "react";
import { useContext } from "react";
import MainLayout from "../layouts/MainLayout";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { logout, isLoggedIn, currName, setCurrName } = useContext(AuthContext);
    const navigate = useNavigate();

    async function EditNavigate(e) {
        if (isLoggedIn) {
            navigate("/profile/edit");
        }
        else {
            navigate("/login")
        }
    }

    async function FavoriteYarnNavigate(e) {
        if (isLoggedIn) {
            navigate("/profile/favoriteyarn");
        }
        else {
            navigate("/login")
        }
    }

    async function FavoritePatternNavigate(e) {
        if (isLoggedIn) {
            navigate("/profile/favoritepattern");
        }
        else {
            navigate("/login")
        }
    }

    return (
        <MainLayout title="My Profile | Loops & Knots">
            <div className="container-fluid d-flex flex-column flex-grow-1 justify-content-center align-items-center mt-3">
                <h2 className="text-center">Welcome back {currName}!</h2>
                <div className="row ms-auto me-auto mt-4 mb-4">
                    <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                        <div className="card profileCard m-3" style={{ width: '20rem', cursor: "pointer" }} onClick={EditNavigate}>
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Edit Account Info</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                        <div className="card profileCard m-3" style={{ width: '20rem', cursor: "pointer" }} onClick={FavoriteYarnNavigate}>
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Favorited Yarns</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                        <div className="card profileCard m-3" style={{ width: '20rem', cursor: "pointer" }} onClick={FavoritePatternNavigate}>
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Favorited Patterns</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary mt-3 secondaryButton" onClick={logout}>Logout</button>
            </div>
        </MainLayout>
    );
};

export default Profile;