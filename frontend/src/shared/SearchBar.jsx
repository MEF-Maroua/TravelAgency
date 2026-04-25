import React, { useRef } from 'react';
import './search-bar.css';
import { Col, Form, FormGroup } from 'reactstrap';
import tours from '../assets/data/tours';

const SearchBar = ({ setFilteredTours }) => {
  const locationRef = useRef('');
  const distanceRef = useRef('');
  const priceRef = useRef('');

  const searchHandler = () => {
    const location = locationRef.current.value.toLowerCase();
    const distance = Number(distanceRef.current.value);
    const price = Number(priceRef.current.value);

    let filteredData = tours.filter(tour => {
      const matchesLocation = location ? tour.city.toLowerCase().includes(location) : true;
      const matchesDistance = distance ? tour.distance <= distance : true;
      const matchesPrice = price ? tour.price <= price : true;

      return matchesLocation && matchesDistance && matchesPrice;
    });

    setFilteredTours(filteredData);
  };

  return (
    <Col lg='12'>
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span><i className="ri-map-pin-line"></i></span>
            <div>
              <h6>Location</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={locationRef}
                onChange={searchHandler}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span><i className="ri-map-pin-time-line"></i></span>
            <div>
              <h6>Distance</h6>
              <input
                type="number"
                placeholder="Distance Km"
                ref={distanceRef}
                onChange={searchHandler}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-last">
            <span><i className="ri-money-dollar-circle-line"></i></span>
            <div>
              <h6>Price</h6>
              <input
                type="number"
                placeholder="Price Da"
                ref={priceRef}
                onChange={searchHandler}
              />
            </div>
          </FormGroup>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
