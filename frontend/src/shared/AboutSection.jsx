
import React from 'react'
import "./aboutsection.css"
import { Container, Row, Col } from 'reactstrap'
import videoBg from "../assets/images/Algeria.mp4"

const AboutSection = ({title}) => {
  return (
    <section className="about__hero">
        <div className="video__overlay"></div>
        <video src={videoBg} autoPlay loop playsInline className="hero__video" />
        
        <Container>
            <Row>
                <Col lg ='12'>
                  <div className="about__hero-content text-center">
                    <h1 className="display-2 fw-bold text-white mb-4">{title}</h1>
                    <p className="lead text-white-50 mx-auto" style={{maxWidth: '700px'}}>
                      Discover the heart and soul of Algeria through our eyes. We are more than just a travel agency; we are your gateway to the Mediterranean jewel.
                    </p>
                  </div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default AboutSection