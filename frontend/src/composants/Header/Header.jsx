import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/TravelAgencyLogo.png';
import './header.css';

const nav__links = [
  { path: '/home', display: 'Home' },
  { path: '/About', display: 'About' },
  { path: '/tours', display: 'Tours' },
  { path: '/chatbot', display: 'ChatBot' },
];

const Header = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.username) {
      setUsername(userData.username);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsername('');
    navigate('/login');
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <Link to="/home">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink to={item.path} className={({ isActive }) => isActive ? 'active__link' : ''}>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Controls */}
            <div className="nav__right d-flex align-items-center gap-4">
              {username ? (
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="welcome-text fw-bold text-primary"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      const userData = JSON.parse(localStorage.getItem('user'));
                      if (userData?.role === 'agency') {
                        navigate('/dashboard/agency');
                      } else {
                        navigate('/dashboard/user');
                      }
                    }}
                  >
                    {username}
                  </span>
                  <Button className="btn primary__btn" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="nav__btns d-flex align-items-center gap-4">
                  <Button className="btn secondary__btn" tag={Link} to="/login">
                    Login
                  </Button>
                  <Button className="btn primary__btn" tag={Link} to="/register">
                    Register
                  </Button>
                </div>
              )}

              <span className="mobile__menu">
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
