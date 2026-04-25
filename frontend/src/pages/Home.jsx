import React from 'react';
import '../styles/home.css';
import { Container, Row, Col } from 'reactstrap';

import WilayaList from '../composants/WilayaList/WilayaList';

const Home = () => {
  return (
    <>
      {/*========== hero section start ========= */}
      <section className="hero__section_new pt-5">
        <Container>
          <Row className="align-items-center">
            <Col lg='6' className="text-section">
              <div className="hero__content_new">
                <div className="badge_new mb-4">
                  <span>New Destinations Available</span>
                </div>

                <h1 className="display-3 fw-bold mb-4">
                  Explore the
                  <span className="highlight"> Soul of Algeria </span> & Create Memories
                </h1>

                <p className="description_new mb-5">
                  From the golden sands of the Sahara to the azure waves of the Mediterranean,
                  we curate unique travel experiences that showcase Algeria’s rich heritage
                  and stunning landscapes. Join us and discover the magic of the 58 Wilayas.
                </p>

                <div className="cta_group d-flex gap-4">
                  <button className="btn primary__btn px-5 py-3 rounded-pill shadow-lg">Start Planning</button>
                  <div className="play_btn_wrapper d-flex align-items-center gap-2">
                    <span className="play_btn"><i className="ri-play-fill"></i></span>
                    <span className="fw-bold">Watch Tour</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg='6'>
              <div className="hero__image_container position-relative">
                <div className="main_image_wrapper">
                  <img src="/images/image6.jpg" alt="Algeria Travel" className="hero_main_img" />
                </div>

                {/* Floating Destination Cards */}
                <div className="floating_card card1">
                  <div className="icon_circle"><i className="ri-map-pin-2-fill"></i></div>
                  <div className="card_info">
                    <span className="card_title">Timgad</span>
                    <span className="card_sub">History</span>
                  </div>
                </div>

                <div className="floating_card card2">
                  <div className="icon_circle" style={{ background: '#ffc107', color: '#fff' }}><i className="ri-sun-fill"></i></div>
                  <div className="card_info">
                    <span className="card_title">Sahara</span>
                    <span className="card_sub">Adventure</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/*========== hero section end ========= */}

      {/*========== destinations section ========= */}
      <section className="destinations_section py-5">
        <Container>
          <div className="section_header text-center mb-5">
            <h2 className="fw-bold h1">Discover Algeria by Wilaya</h2>
            <p className="text-muted">Choose your preferred destination and start your journey</p>
          </div>
          <WilayaList />
        </Container>
      </section>
    </>
  );
};

export default Home;
