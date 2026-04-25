
import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import "./about_us.css"
import tourImg from "../assets/images/tour.jpg"
import image3 from "../assets/images/image3.jpg"

const About_Us = () => {
  return (
    <section className="about__modern">
        <Container>
            <Row className="align-items-center">
                <Col lg="6" className="mb-5 mb-lg-0">
                  <div className="mosaic__container">
                    <div className="mosaic__item item-1">
                      <img src={tourImg} alt="Algeria 1" />
                    </div>
                    <div className="mosaic__item item-2">
                      <img src={image3} alt="Algeria 2" />
                    </div>
                    <div className="mosaic__item item-3">
                      <div className="mosaic__overlay">
                        <h4>58</h4>
                        <p>Wilayas</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="about__modern-content ps-lg-5">
                    <span className="subtitle__modern">Our Vision</span>
                    <h2 className="title__modern">Connecting Hearts to the Heritage of Algeria</h2>
                    <p className="text__modern">
                      We believe that travel is more than just seeing new places; it's about feeling the soul of a nation. Our platform is dedicated to making every corner of Algeria accessible, authentic, and unforgettable.
                    </p>
                    
                    <ul className="values__list">
                      <li>
                        <div className="value__icon"><i className="ri-heart-pulse-line"></i></div>
                        <div>
                          <h6>Authentic Connection</h6>
                          <p>We bridge the gap between travelers and the true Algerian spirit.</p>
                        </div>
                      </li>
                      <li>
                        <div className="value__icon"><i className="ri-compass-3-line"></i></div>
                        <div>
                          <h6>Local Empowerment</h6>
                          <p>Supporting local agencies across all 58 wilayas to grow together.</p>
                        </div>
                      </li>
                      <li>
                        <div className="value__icon"><i className="ri-leaf-line"></i></div>
                        <div>
                          <h6>Sustainable Tourism</h6>
                          <p>Preserving our natural wonders and cultural sites for generations.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default About_Us