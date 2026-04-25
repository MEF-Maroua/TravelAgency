import React from 'react'
import './footer.css'
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/TravelAgencyLogo.png'

const quick__links = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
];

const quick__links2 = [
  { path: "/login", display: "Login" },
  { path: "/register", display: "Register" },
]

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg='4' md='6' className="mb-4 mb-lg-0">
            <div className="logo mb-4">
              <img src={logo} alt="TravelAgencyLogo.png" />
              <p className="mt-4 pe-lg-4">
                Discover the breathtaking beauty of Algeria. We connect you with top agencies for an unforgettable travel experience.
              </p>

              <div className="social__links d-flex align-items-center gap-3 mt-4">
                <span>
                  <a href="https://github.com/MEF-Maroua" target="_blank" rel="noopener noreferrer">
                    <i className="ri-github-fill"></i>
                  </a>
                </span>
              </div>
            </div>
          </Col>

          <Col lg='2' md='6' className="mb-4 mb-lg-0">
            <h5 className='footer__link-title'>Discover</h5>
            <ListGroup className="footer__quick-links">
              {quick__links.map((item, index) => (
                <ListGroupItem key={index} className='ps-0 border-0 bg-transparent'>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg='3' md='6' className="mb-4 mb-lg-0">
            <h5 className='footer__link-title'>Quick Links</h5>
            <ListGroup className="footer__quick-links">
              {quick__links2.map((item, index) => (
                <ListGroupItem key={index} className='ps-0 border-0 bg-transparent'>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg='3' md='6'>
            <h5 className='footer__link-title'>Contact Us</h5>
            <ListGroup className="footer__quick-links contact__info">
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3 bg-transparent'>
                <div className="contact__icon">
                  <i className="ri-map-pin-line"></i>
                </div>
                <div>
                  <h6 className="mb-1">Address</h6>
                  <p className="mb-0">Tiaret, Algeria</p>
                </div>
              </ListGroupItem>

              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3 bg-transparent mt-3'>
                <div className="contact__icon">
                  <i className="ri-phone-fill"></i>
                </div>
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="mb-0">+213 0799324697</p>
                </div>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg='12'>
            <div className="copyright text-center mt-5 pt-4">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} TravelAgency. Designed with M.... ❤️. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer