import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TourCard from '../shared/TourCard';

const AgencyTours = () => {
  const { id } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/tours/agency/${id}`);
        setTours(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [id]);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="text-center mb-5">
            <h2>Agency Tours</h2>
          </Col>
        </Row>
        {loading ? (
          <h4 className="text-center pt-5">Loading...</h4>
        ) : (
          <Row>
            {tours.length === 0 ? (
              <h4 className="text-center">No tours found for this agency.</h4>
            ) : (
              tours.map(tour => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={tour.id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default AgencyTours;
