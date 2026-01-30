import React from "react";
import { useState, useContext, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import RavelryAPIYarns from "../pages/ravelryAPI/ravelryAPIYarns";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const FavoriteYarns = () => {
    const navigate = useNavigate();
    const { logout, isLoggedIn, currName, setCurrName, username } = useContext(AuthContext);
    const [yarns, setYarns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState("");


    useEffect(() => {
        const fetchFavYarns = async () => {
            setLoading(true);
            setError("");
            try {
                let response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/favorites/yarn/all", {
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

                const yarnDetails = await Promise.all(
                    data.yarnIDs.map(async (id) => {
                        const yarnDetailsResponse = await fetch(`https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/yarn/details`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ "id": id.id })
                        });

                        if (!yarnDetailsResponse.ok) {
                            throw new Error(`Failed to fetch favorite yarns`);
                        };
                        return await yarnDetailsResponse.json();
                    }
                    )
                )
                setYarns(yarnDetails);
                console.log("details", yarnDetails);
                setError(null);
            }
            catch (err) {
                setError("No favorites were found for this user. Add favorites from the Yarn page!");
            }
            finally {
                setLoading(false);
            }
        }

        fetchFavYarns();
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
            let response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/favorites/yarn", {
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
                navigate("/profile/favoriteyarn");
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
        <MainLayout title=" Favorite Yarns | Loops & Knots">
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
                        <h2>{currName}'s Yarns</h2>
                    </div>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* //card to display details of each yarn */}
            <div className="row">
                {yarns.map((yarn) => (
                    <div className="col-md-4 col-lg-3 d-flex justify-content-center" key={yarn.id}>
                        <div className="card m-3 flex-grow-1" onClick={() => window.open(`${yarn?.yarn_company?.url}`, "_blank")} style={{ cursor: "pointer" }}>
                            <div className="card-img-wrapper" style={{ height: '60%' }}>
                                {yarn?.photos?.[0]?.medium_url ? (
                                    <img
                                        src={yarn.photos[0].medium_url}
                                        className="card-img-top"
                                        alt={yarn.name ? yarn.name : "Unnamed yarn"}
                                        style={{ objectFit: 'cover', height: '100%' }}
                                    />
                                ) : (
                                    <img
                                        src="/noBackgroundLogo.png"
                                        className="card-img-top"
                                        alt="No image available"
                                        style={{ objectFit: 'cover', height: '100%' }}
                                    />
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{`${yarn?.name || "Unnamed yarn"}`}</h5>
                                <p className="card-text"><small className="text-body-secondary">{`${yarn?.yarn_company?.name || "No named company"}`}</small></p>
                                <p className="card-text">{`Weight: ${yarn?.yarn_weight?.name || "Unknown"}`}</p>
                                {yarn?.yarn_fibers?.map((aFiber) => (
                                    <p className="card-text" key={aFiber.id}>{`${aFiber.percentage}% ${aFiber.fiber_type?.name || "Unknown fiber type"}`}</p>
                                ))}
                            </div>
                            <button className="btn btn-outline-success classicButton fav" value={yarn.id} onClick={(e) => remove(e)}><i className="fa-solid fa-heart"></i>Remove From Favorites</button>
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
        </MainLayout>
    );
};

export default FavoriteYarns;