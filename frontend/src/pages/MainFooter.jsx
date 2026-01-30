import React from "react";

const MainFooter = () => {
    return (
        <footer className="text-center">
            <p>&copy; {new Date().getFullYear()}<span className='brand-name ms-2'>Loops & Knots</span></p>
        </footer>
    );
};

export default MainFooter;