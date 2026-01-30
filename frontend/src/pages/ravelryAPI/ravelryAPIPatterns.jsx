import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RavelryAPIPatterns = ({ appliedFilters, filtering, searching, query, searchToggle }) => {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { username, isLoggedIn } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatterns = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                console.log(filtering);
                if (searching) {
                    console.log("searching!");
                    response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/patterns/search", {
                        method: "POST",
                        body: JSON.stringify({
                            query: query
                        }),

                        // Adding headers to the request
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                }
                else if (filtering) {
                    //make sure only knit or crochet checked

                    //check if knit and not crochet checked
                    if (appliedFilters.knit === true && appliedFilters.crochet === false) {
                        console.log("searching knit!");
                        response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/patterns/search", {
                            method: "POST",
                            body: JSON.stringify({
                                query: "knit"
                            }),

                            // Adding headers to the request
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                    }
                    //check if crochet and not knit checked
                    else if (appliedFilters.crochet === true && appliedFilters.knit === false) {
                        console.log("searching crochet!");
                        response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/patterns/search", {
                            method: "POST",
                            body: JSON.stringify({
                                query: "crochet"
                            }),

                            // Adding headers to the request
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                    }
                    //selected both, just get all patterns
                    else {
                        console.log("selected both filters!");
                        response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/patterns", {
                            method: "GET",
                        })
                    }

                }
                else {
                    console.log("no filter, regular!");
                    response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/patterns", {
                        method: "GET",
                    })
                }
                if (!response.ok) throw new Error("Failed to fetch patterns");
                const data = await response.json();
                console.log(data);
                setPatterns(data.patterns);
            }
            catch (err) {
                setError("No patterns found");
            }
            finally {
                setLoading(false);
            }
        }

        fetchPatterns();
    }, [filtering, appliedFilters, searching, searchToggle]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>

        )
    }

    if (filtering) {
        console.log("filtering!");
        console.log(appliedFilters);

    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const favorite = async (e) => {
        e.stopPropagation();
        if (isLoggedIn) {
            try {
                let response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/favorites/pattern", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "username": username, "id": e.target.value })
                })
                console.log("response", response);
                if (!response.ok) {
                    setAlert("Error adding to favorites");
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 1500);
                }
                setAlert("Added to favorites");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }
            catch (error) {
                setAlert("Error adding to favorites");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }
        }
        else {
            navigate("/login");
        }
    }



    return (
        <div className="row ms-auto me-auto">
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
                        <button className="btn btn-outline-success classicButton fav" value={pattern.id} onClick={(e) => favorite(e)}><i className="fa-solid fa-heart"></i>   Favorite</button>
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
    )
}

export default RavelryAPIPatterns;