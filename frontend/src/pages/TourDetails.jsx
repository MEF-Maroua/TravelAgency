import React, { useRef, useState, useEffect } from 'react';
import '../styles/tour-details.css';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { useParams } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';
import Booking from '../composants/Booking/Booking';
import axios from 'axios';

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef('');
  const [tourRating, setTourRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourAndReviews = async () => {
      try {
        const tourRes = await axios.get(`http://localhost:3001/tours/${id}`);
        setTour(tourRes.data);

        const reviewRes = await axios.get(`http://localhost:3001/getReviews/${id}`);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourAndReviews();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      alert('You must be logged in to leave a review.');
      return;
    }

    try {
      const newReview = {
        tour_id: id,
        user_name: user.username,
        reviewText,
        rating: tourRating || 5
      };

      const response = await axios.post('http://localhost:3001/addReview', newReview);

      if (response.status === 201) {
        setReviews([...reviews, {
          ...newReview,
          created_at: new Date()
        }]);
        reviewMsgRef.current.value = '';
        setTourRating(null);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <h4 className="text-center pt-5">Loading...</h4>;
  }

  if (!tour) {
    return <h4 className="text-center pt-5">Tour not found</h4>;
  }

  const { photo, title, desc, price, address, city, distance } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg='8'>
              <div className="tour__content">
                <img src={photo && photo.startsWith('/') ? `http://localhost:3001${photo}` : photo} alt="" />

                <div className="tour__info">
                  <h2>{title}</h2>

                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-fill" style={{ color: "var(--secondary-color)" }}></i> {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? ("Not rated") :
                        (<span>({reviews.length})</span>)}
                    </span>

                    <span>
                      <i className="ri-map-pin-user-fill"></i> {address || city}
                    </span>
                  </div>

                  <div className="tour__extra-details">
                    <span>
                      <i className="ri-map-pin-2-line"></i> {city}
                    </span>
                    <span>
                      <i className="ri-money-dollar-circle-line"></i> {price} DA / per person
                    </span>
                    <span>
                      <i className="ri-map-pin-time-line"></i> {distance} K/m
                    </span>
                  </div>

                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>

                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews.length} reviews)</h4>
                  <Form onSubmit={submitHandler}>
                    <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                      <span onClick={() => setTourRating(1)} className={tourRating === 1 ? 'active' : ''}><i className="ri-star-fill"></i></span>
                      <span onClick={() => setTourRating(2)} className={tourRating === 2 ? 'active' : ''}><i className="ri-star-fill"></i></span>
                      <span onClick={() => setTourRating(3)} className={tourRating === 3 ? 'active' : ''}><i className="ri-star-fill"></i></span>
                      <span onClick={() => setTourRating(4)} className={tourRating === 4 ? 'active' : ''}><i className="ri-star-fill"></i></span>
                      <span onClick={() => setTourRating(5)} className={tourRating === 5 ? 'active' : ''}><i className="ri-star-fill"></i></span>
                    </div>

                    <div className="review__input">
                      <input type="text" ref={reviewMsgRef} placeholder='Share your thoughts' required />
                      <button className="btn primary__btn text-white">
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className="user__reviews">
                    {reviews.map((review, index) => (
                      <div className="review__item" key={index}>
                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.user_name}</h5>
                              <p>{new Date(review.created_at || new Date()).toLocaleDateString('en-US', options)}</p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating}
                              <i className="ri-star-s-fill ms-1"></i>
                            </span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>

            <Col lg='4'>
              <Booking tour={tour} avgRating={avgRating} reviews={reviews} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default TourDetails;
