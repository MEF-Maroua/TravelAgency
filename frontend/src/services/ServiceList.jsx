

import React from 'react'
import ServiceCard from './ServiceCard'
import { Col } from 'reactstrap'
import weatherImg from '../assets/images/weather.png'
import guideImg from '../assets/images/guide.png'
import customizationImg from '../assets/images/customization.png'

const servicesData =[
    {
        imgUrl: weatherImg,
        title: "Calculate Weather",
        desc: "Plan your trip with accurate weather updates for every destination in Algeria.",
    },
    {
        imgUrl: guideImg,
        title: "Best Tour Guide",
        desc: "Enjoy your journey with experienced, local guides who bring Algeria’s stories to life.",
    },
    {
        imgUrl: customizationImg,
        title: "Customization",
        desc: "Create your dream trip from cities to deserts, we tailor every experience to your needs.",
    },
]

const ServiceList = () => {
  return (
    <>
    {
        servicesData.map((item, index)=> 
        <Col lg ='3' key={index}>
            <ServiceCard item={item}/>
        </Col>)
    }
    </>
  )
}

export default ServiceList