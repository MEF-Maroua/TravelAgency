import React, { useState, useEffect } from 'react';
import CommonSection from '../shared/CommonSection';
import '../styles/tour.css';
import { Col, Container, Row } from 'reactstrap';
import TourCard from '../shared/TourCard';
import axios from 'axios';

const Tour = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('http://localhost:3001/tours');
        setTours(res.data);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const pages = Math.ceil(tours.length / 8); // Showing 8 tours per page
    setPageCount(pages);
  }, [tours]);

  return (
    <>
      <CommonSection title={"All Tours"} />

      <section className="pt-5">
        <Container>
          {loading ? (
            <h4 className="text-center pt-5">Loading...</h4>
          ) : (
            <Row>
              {tours.length === 0 ? (
                <Col lg="12" className="text-center">
                  <h4>No tours available at the moment.</h4>
                </Col>
              ) : (
                tours.slice(page * 8, (page + 1) * 8).map(tour => (
                  <Col lg='3' md='6' sm='6' className="mb-4" key={tour.id}>
                    <TourCard tour={tour} />
                  </Col>
                ))
              )}

              <Col lg='12'>
                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                  {[...Array(pageCount).keys()].map(number => (
                    <span
                      key={number}
                      onClick={() => {
                        setPage(number);
                        window.scrollTo(0, 0);
                      }}
                      className={page === number ? 'active__page' : ''}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Tour;
