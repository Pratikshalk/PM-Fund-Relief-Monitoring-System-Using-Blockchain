// import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
// import Navbar from './components/navbar';
// import React from 'react';
// import Form from './components/form';
// import Home from './components/Home';
// import BeneficiaryForm from "./components/beneficiary_form";


// function App() {
//     return (
//         <Router>
//             <Main />
//         </Router>
//     );
// }

// // Main component to handle routing and Navbar visibility
// function Main() {
//     const location = useLocation(); // Get the current location/path

//     // Determine if the Navbar should be shown based on the current path
//     const showNavbar = location.pathname !== '/Form'; // Hide Navbar on /Form route

//     return (
//         <>
//             {showNavbar && <Navbar />} {/* Only render Navbar if showNavbar is true */}
//             <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/Form" element={<Form />} />
//                 <Route path="/home" element={<Home />} />
//                 <Route path="/beneficiary_form" element={<BeneficiaryForm />} />
//                 {/* Add more routes as needed */}
//             </Routes>
//         </>
//     );
// }

// export default App;
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from './components/navbar';
import React from "react";
import Form from "./components/form";
import Home from "./components/Home";
import MainLayout from './components/MainLayout';
import BeneficiaryForm from "./components/beneficiary_form";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transactions from "./components/Transactions";

function App() {
    return (
        <Router>
            <Main />
        </Router>
    );
}

function Main() {
    const location = useLocation();

    // Determine if we should use MainLayout (for pages with navbar)
    const useMainLayout = location.pathname !== "/Form";

    return (
        <>
            <Routes>
                <Route path="/Form" element={<Form />} />
                
                {/* Routes using MainLayout */}
                <Route path="/" element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                } />
                <Route path="/home" element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                } />
                <Route path="/beneficiary_form" element={
                    <MainLayout>
                        <BeneficiaryForm />
                    </MainLayout>
                } />
                <Route path="/AdminDashboard" element={
                    <MainLayout>
                        <AdminDashboard/>
                    </MainLayout>
                } />
                <Route path="/Transactions" element={
                    <MainLayout>
                        <Transactions/>
                    </MainLayout>
                } />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default App;

