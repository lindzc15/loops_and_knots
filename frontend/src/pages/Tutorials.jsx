import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';


const Tutorials = () => {
    const navigate = useNavigate();
    const [tutorials, setTutorials] = useState([]);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await fetch("https://udg0v8fa9j.execute-api.us-west-2.amazonaws.com/cs3660prod/api/tutorials", {
                    method: "GET",
                })
                if (!response.ok) throw new Error("Failed to fetch patterns");
                const data = await response.json();
                console.log(data);
                setTutorials(data.tutorials);
            }
            catch (err) {
                setError(err.message);
            }
        }

        fetchTutorials();
    }, []);
    return (
        <MainLayout title="Tutorials | Loops & Knots">
            {/* container for displaying the tutorials posted */}
            <div className="row ms-auto me-auto">
                {tutorials.map((tutorial) => (
                    <div className="col-md-4 col-lg-3 d-flex justify-content-center" key={tutorial.link}>
                        <div className="card m-3 flex-grow-1" style={{ cursor: "pointer" }}>
                            <Link to={`/videotutorial`}
                                state={tutorial}
                                style={{ textDecoration: 'none' }}>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{`${tutorial.name}`}</h5>
                                    <p className="card-text"><small className="text-body-secondary">{`${tutorial.creator}`}</small></p>
                                    <p className="card-text"><small className="text-body">{`${tutorial.description}`}</small></p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </MainLayout >
    );
};

export default Tutorials;