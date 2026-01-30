import React from "react";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
    return (
        <MainLayout title="About Us | Loops & Knots">
            <div className="container text-center d-flex flex-column flex-grow-1 justify-content-center">
                <h1>About Loops & Knots</h1>
                <p>Welcome to my UVU CS3660 (Web Programming 2) project. I created a web
                    application dedicated to all things knit and crochet. Users can
                    view and favorite yarns and patterns. While browsing, users can filter and search. They are also able to create
                    an account and sign in so that they can view and delete favorites. Users
                    are able to browse tutorials for various knit and crochet stitches and
                    view the video within the web application. Users can edit their account
                    information. Future release goals include allowing
                    users to upload their own yarns, patterns, and tutorials. There would be support
                    for purchasing and trading each of these items. Users would also be able to message
                    other users in the web application. Filtering would be expanded to give the user more control over the results. Users would
                    also be able to edit a wider range of their account details.
                </p>
            </div>
        </MainLayout>
    );
};

export default Home; 