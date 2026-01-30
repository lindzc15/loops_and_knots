import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const RavelryAPIYarns = ({ appliedWeightFilters, filtering, searching, query, searchToggle }) => {
    const [yarns, setYarns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { username, isLoggedIn } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();
    //fetch yarn data from api on mount
    useEffect(() => {
        //start with fetching all yarns
        const fetchYarns = async () => {
            setError(null);
            setLoading(true);
            try {
                let response;
                if (searching) {
                    response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/yarns/search", {
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
                else {
                    response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/yarns", {
                        method: "GET",
                    })
                }
                //fetch detailed object for all yarns, searched for by id
                if (!response.ok) throw new Error("Failed to fetch yarns");
                const data = await response.json();
                console.log("data", data);
                const yarnDetails = await Promise.all(
                    data.yarnIDs.map(async (id) => {
                        const yarnDetailsResponse = await fetch(`https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/ravelry/yarn/details`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ "id": id.id })
                        });
                        if (!yarnDetailsResponse.ok) throw new Error("Failed to fetch yarns");
                        return await yarnDetailsResponse.json();
                    }
                    )
                )
                setYarns(yarnDetails);
                console.log("details", yarnDetails);
            }
            catch (err) {
                setError("No yarns found");
            }
            finally {
                setLoading(false);
            }
        }

        fetchYarns();
    }, [searchToggle, searching]);



    //show loading spinner
    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    //tracks yarns currently in use
    let yarnsDisplayed;

    //remove yarns that don't match filters selected
    if (filtering) {
        //make copy of yarns and figure out which filters were checked 
        let yarnsDeepCopy = JSON.parse(JSON.stringify(yarns));
        let appliedWeightFiltersArr = [];
        //add each checked filter to the list of applied filters
        Object.entries(appliedWeightFilters).forEach(([key, value]) => {
            if (value == true) {
                console.log(key, typeof (key), typeof (value), value);
                appliedWeightFiltersArr.push(key.toLocaleLowerCase());
            }
        });
        //if the weight of the yarn matches a weight filter set in the array, keep, otherwise delete
        Object.entries(yarnsDeepCopy).forEach(([key, value]) => {
            if (value.yarn_weight && value.yarn_weight.name && !appliedWeightFiltersArr.includes(value.yarn_weight.name.toLocaleLowerCase())) {
                delete yarnsDeepCopy[key];
            }
        })
        //if true filters exist, copy contains filters
        if (!appliedWeightFiltersArr.length == 0) {
            yarnsDisplayed = yarnsDeepCopy;
        }
        //if not, yarns being displayed should be original yarn object
        else {
            yarnsDisplayed = yarns;
        }
    }
    //if not filtering, display all yarns
    else {
        yarnsDisplayed = yarns;
    }

    console.log(yarns);

    const favorite = async (e) => {
        e.stopPropagation();
        if (isLoggedIn) {
            try {
                let response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/favorites/yarn", {
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
        //card to display details of each yarn
        <div className="row ms-auto me-auto">
            {yarnsDisplayed.map((yarn) => (
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
                        <button className="btn btn-outline-success classicButton fav" value={yarn.id} onClick={(e) => favorite(e)}><i className="fa-solid fa-heart"></i>   Favorite</button>
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

export default RavelryAPIYarns;

