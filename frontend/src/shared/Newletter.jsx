import React, { useState } from 'react';
import './newletter.css';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import maleTourist from '../assets/images/male-tourist.png';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    try {
      if (!email) return alert("Please enter an email");
      await axios.post('http://localhost:3001/subscribe', { email });
      alert('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe');
    }
  };

  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>Subscribe now to get useful traveling information.</h2>

              <div className="newsletter__input">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn newsletter__btn" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>

              <p>
                Stay updated with the best travel tips, exclusive offers, and beautiful destinations across Algeria!
              </p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter__img">
              <img src={maleTourist} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
