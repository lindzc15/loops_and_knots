import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const VideoTutorial = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tutorial = location.state;

    if (!tutorial) {
        return <p>Tutorial not found</p>;
    }
    return (
        <MainLayout title="Tutorial Video | Loops & Knots">
            <button
                type="button"
                className="btn btn-primary classicButton backButton m-3"
                onClick={() => navigate("/Tutorials")}
                style={{ minWidth: "120px" }}
            >
                {"<  "}Back
            </button>

            <div className="container text-center d-flex flex-column flex-grow-1 justify-content-center align-items-center">
                {/* Video iframe with width and height controlled */}
                <iframe
                    className="w-75"
                    height="400" // Set a fixed height to match the card's height or adjust as needed
                    src={tutorial.link}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>

                {/* Card with same width as video */}
                <div className="card m-3 w-75">
                    <div className="card-header">
                        <h4>{tutorial.name}</h4>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{tutorial.description}</li>
                    </ul>
                </div>
            </div>
        </MainLayout>
    );
};


export default VideoTutorial;