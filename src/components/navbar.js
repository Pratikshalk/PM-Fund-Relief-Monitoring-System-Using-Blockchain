import React, { useEffect, useState } from 'react';
import '../assets/navbar.css';
import logo from '../assets/logo.png';
import AdminDashboard from './AdminDashboard';
import Transactions from './Transactions';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className='Navbar'>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className='nav-links'>
          {/* Keep your existing nav links */}
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/">About</NavLink></li>
          <li><NavLink to="/form">Donate</NavLink></li>
          <li><NavLink to="/AdminDashboard">Dashboard</NavLink></li>
          <li><NavLink to="/Transactions">Transaction</NavLink></li>
          <li><NavLink to="/fund-overview">Fund Overview</NavLink></li>
          <li><NavLink to="/connect-wallet">Connect Wallet</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/beneficiary_form">BeneficiaryForm</NavLink></li>
        </ul>
      </header>
    </nav>
  );
}

export default Navbar;