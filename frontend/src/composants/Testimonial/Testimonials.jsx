import React from 'react'
import Slider from 'react-slick'
import './../Testimonial/testimonials.css'
import ava01 from '../../assets/images/image1.jpg'
import ava02 from '../../assets/images/image2.jpg'
import ava03 from '../../assets/images/image3.jpg'
import ava04 from '../../assets/images/image4.jpg'
const Testimonials = () => {

  const settings = {
    dots: true,
    infinitr: true,
    autoplay: true,
    speed: 1000,
    swipToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings:
        {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings:
        {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ]

  }
  return <Slider {...settings}>
    <div className="testimonial py-4 px-3">
      <p>This agency really knows what travelers need.
        They customized my itinerary to fit my interests and schedule,
        and the result was a unique journey through Algeria’s history,
        culture, and nature. I especially loved the visit to Ghardaïa — a hidden gem
        I never expected to fall in love with.
      </p>

      <div className='d-flex align-items-center gap-3 mt-3'>
        <img src={ava01} className='testimonial-img' alt="" />
        <div>
          <h6 className='mb-0 mt-3'>User 01</h6>
          <p>Customer</p>
        </div>
      </div>
    </div>
    <div className="testimonial py-4 px-3">
      <p>I’ve always wanted to visit the Sahara,
        and Travel Algeria made it possible in the most magical way.
        The desert camp experience was incredible — the sunset over the dunes,
        the food, the music... everything was just perfect.
        I can’t wait to come back and try one of their northern tours!
      </p>

      <div className='d-flex align-items-center gap-4 mt-3'>
        <img src={ava02} className='testimonial-img' alt="" />
        <div>
          <h6 className='mb-0 mt-3'>User 02</h6>
          <p>Customer</p>
        </div>
      </div>
    </div>
    <div className="testimonial py-4 px-3">
      <p>We were a group of students looking for an affordable trip during our vacation, and Travel Algeria helped us organize a fun and budget-friendly tour. From coastal cities to traditional villages, every place we visited was full of charm. We made so many memories and new friends. Highly recommended!
      </p>

      <div className='d-flex align-items-center gap-3 mt-3'>
        <img src={ava03} className='testimonial-img' alt="" />
        <div>
          <h6 className='mb-0 mt-3'>User 03</h6>
          <p>Customer</p>
        </div>
      </div>
    </div>
    <div className="testimonial py-4 px-3">
      <p>Travel Algeria helped us discover a whole new side of our country. We visited historical sites, tasted delicious local food, and met amazing people. It felt like a real adventure — but safe and well organized.

      </p>

      <div className='d-flex align-items-center gap-3 mt-3'>
        <img src={ava04} className='testimonial-img' alt="" />
        <div>
          <h6 className='mb-0 mt-3'>User 04</h6>
          <p>Customer</p>
        </div>
      </div>
    </div>
  </Slider>
}

export default Testimonials