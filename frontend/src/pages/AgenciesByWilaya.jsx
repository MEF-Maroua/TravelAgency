import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AgenciesByWilaya = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/agencies/wilaya/${name}`);
        setAgencies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, [name]);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="text-center mb-5">
            <h2>Travel Agencies in {name}</h2>
          </Col>
        </Row>
        {loading ? (
          <h4 className="text-center pt-5">Loading...</h4>
        ) : (
          <Row>
            {agencies.length === 0 ? (
              <h4 className="text-center">No agencies found in this Wilaya.</h4>
            ) : (
              agencies.map(agency => (
                <Col lg="3" md="4" sm="6" className="mb-4" key={agency.id}>
                  <Card>
                    <div className="tour__img text-center pt-3">
                      <img 
                        src={agency.logo ? `http://localhost:3001${agency.logo}` : '/default-agency.png'} 
                        alt="agency-logo" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                    <CardBody className="text-center">
                      <h5 className="tour__title">{agency.agency_name}</h5>
                      <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
                        <Button className="btn booking__btn w-100" onClick={() => navigate(`/agencies/${agency.id}/tours`)}>
                          View Tours
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default AgenciesByWilaya;
