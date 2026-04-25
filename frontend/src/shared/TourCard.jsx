import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';
import './tour-card.css';

const TourCard = ({ tour }) => {
  const { id, title, city, photo, price, featured, reviews = [] } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  // Handle photo URL
  const photoUrl = photo && photo.startsWith('/') ? `http://localhost:3001${photo}` : photo;

  return (
    <div className="tour__card">
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="tour__img position-relative">
          <img src={photoUrl || '/placeholder-tour.jpg'} alt="tour-img" className="w-100" style={{ height: '200px', objectFit: 'cover' }} />
          {featured === 1 && <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">Featured</span>}
        </div>

        <CardBody className="p-3">
          <div className="card__top d-flex align-items-center justify-content-between mb-2">
            <span className="tour__location d-flex align-items-center gap-1 text-muted small">
              <i className="ri-map-pin-line text-primary"></i> {city}
            </span>
            <span className="tour__rating d-flex align-items-center gap-1 small">
              <i className="ri-star-fill text-warning"></i> {avgRating === 0 ? "New" : avgRating}
              {totalRating > 0 && <span className="text-muted">({reviews.length})</span>}
            </span>
          </div>

          <h5 className="tour__title mb-3">
            <Link to={`/tours/${id}`} className="text-decoration-none text-dark fw-bold">{title}</Link>
          </h5>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-auto">
            <h6 className="mb-0 fw-bold text-primary">
              {price} DA <span className="text-muted fw-normal small">/person</span>
            </h6>

            <button className="btn btn-sm primary__btn rounded-pill px-3">
              <Link to={`/tours/${id}`} className="text-white text-decoration-none">Book</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
