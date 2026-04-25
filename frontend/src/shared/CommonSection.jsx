
import React from 'react'
import './commonsection.css'
import { Container, Row, Col } from 'reactstrap'
import videoBg from "../assets/images/Algeria.mp4"

const CommonSection = ({title}) => {
  return (
    <section className="common__section">
        <div className="video__overlay"></div>
        <video src={videoBg} autoPlay loop playsInline className="hero__video" />

        <Container>
            <Row>
                <Col lg ='12'><h1 className="text-white display-4 fw-bold">{title}</h1></Col>
            </Row>
        </Container>
    </section>
  )
}

export default CommonSection