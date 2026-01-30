import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RavelryAPIPatterns from "../pages/ravelryAPI/ravelryAPIPatterns";



const FavoritePatterns = () => {
    const navigate = useNavigate();
    const { logout, isLoggedIn, currName, setCurrName, username } = useContext(AuthContext);
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState("");

    useEffect(() => {
        const fetchFavPatterns = async () => {
            setLoading(true);
            setError("");
            try {
                let response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/favorites/pattern/all", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "username": username })
                })
                if (!response.ok) {
                    throw new Error(`Failed to fetch favorite yarns:`);
                }
                const data = await response.json();
                console.log(" favorite data", data);

                const patternDetails = await Promise.all(
                    data.patternIDs.map(async (id) => {
                        const patternDetailsResponse = await fetch(`https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/patterns/details`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ "id": id.id })
                        });

                        if (!patternDetailsResponse.ok) {
                            throw new Error(`Failed to fetch favorite yarns`);
                        };
                        return await patternDetailsResponse.json();
                    }
                    )
                )
                setPatterns(patternDetails);
                console.log("details", patternDetails);
                setError(null);
            }
            catch (err) {
                setError("No favorites were found for this user. Add favorites from the Pattern page!");
            }
            finally {
                setLoading(false);
            }
        }

        fetchFavPatterns();
    }, []);

    //show loading spinner
    if (loading) {
        return (
            <MainLayout>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary spinner" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </MainLayout>
        )
    }

    const remove = async (e) => {
        e.stopPropagation();
        console.log(e.target.value);
        try {
            let response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/favorites/pattern", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "username": username, "id": e.target.value })
            })
            console.log("response", response);
            if (!response.ok) {
                setAlert("Error removing from favorites");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }
            setAlert("Removed from favorites");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigate("/profile/favoritepattern");
            }, 1500);
        }
        catch (error) {
            setAlert("Error removing from favorites");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        }
    }

    return (
        <MainLayout title=" Favorite Patterns | Loops & Knots">
            {/* holds the title and back button */}
            <div className="favoritePage">
                <div className="row">
                    <button
                        type="button"
                        className="btn btn-primary classicButton backButton m-3"
                        onClick={() => navigate("/profile")}
                        style={{ minWidth: "120px" }}
                    >
                        {"<  "}Back
                    </button>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <h2>{currName}'s Patterns</h2>
                    </div>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}


            {/* container for displaying the patterns */}
            <div className="row">
                {patterns.map((pattern) => (
                    <div className="col-md-4 col-lg-3 d-flex justify-content-center" key={pattern.id}>
                        <div className="card m-3 flex-grow-1 cursor">
                            <div className="card-img-wrapper" style={{ height: '60%' }}>
                                {pattern.first_photo ? (
                                    <img
                                        src={pattern.first_photo.medium_url}
                                        className="card-img-top"
                                        alt={pattern.name}
                                        style={{ objectFit: 'cover', height: '100%' }}
                                    />
                                ) : (
                                    <img
                                        src="../public/noBackgroundLogo.png"
                                        className="card-img-top align-text-center align-items-center mt-5"
                                        alt="No image available"
                                    />
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{`${pattern.name}`}</h5>
                                <p className="card-text"><small className="text-body-secondary">{`${pattern.designer.name}`}</small></p>
                                {pattern.free && <div className="card-text">*Free Pattern*</div>}
                                {!pattern.free && <div className="card-text">*Pattern must be purchased*</div>}

                            </div>
                            <button className="btn btn-outline-success classicButton fav" value={pattern.id} onClick={(e) => remove(e)}><i className="fa-solid fa-heart"></i>Remove From Favorites</button>
                        </div>
                    </div>
                ))}
                {/* shows filter applied alert when button is pressed */}
                {showAlert && (
                    <div className="alert custom-alert position-fixed bottom-0 start-50 translate-middle-x" role="alert">
                        {alert}
                    </div>
                )}
            </div>
        </MainLayout >
    );
};

export default FavoritePatterns;