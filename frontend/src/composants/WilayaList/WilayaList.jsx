import React, { useState } from 'react';
import { Container, Row, Col, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { wilayas } from '../../utils/wilayas';

const WilayaList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredWilayas = wilayas.filter(w => w.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container className="my-5">
      <Row className="mb-5 justify-content-center">
        <Col lg="8" className="text-center">
          <h2 className="fw-bold mb-4">Discover Algeria's 58 Wilayas</h2>
          <div className="search-wrapper position-relative mx-auto" style={{ maxWidth: '600px' }}>
            <Input 
              type="text" 
              placeholder="Search for a Wilaya..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="rounded-pill px-5 py-3 shadow-sm border-0"
              style={{ fontSize: '1.1rem', background: '#f8f9fa' }}
            />
            <i className="ri-search-line position-absolute top-50 start-0 translate-middle-y ms-4 text-muted fs-5"></i>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {filteredWilayas.map((wilaya, index) => (
          <Col lg="3" md="4" sm="6" key={index}>
            <div 
              className="wilaya-card p-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => navigate(`/wilayas/${wilaya}/agencies`)}
              style={{ 
                background: '#fff', 
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(20, 184, 166, 0.15)';
                e.currentTarget.style.borderColor = 'var(--secondary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="wilaya-number d-flex align-items-center justify-content-center rounded-circle fw-bold" 
                     style={{ 
                       width: '40px', 
                       height: '40px', 
                       background: 'rgba(20, 184, 166, 0.1)', 
                       color: 'var(--secondary-color)',
                       fontSize: '0.9rem'
                     }}>
                  {wilayas.indexOf(wilaya) + 1}
                </div>
                <h6 className="mb-0 fw-bold" style={{ color: 'var(--heading-color)' }}>{wilaya}</h6>
              </div>
              <i className="ri-arrow-right-s-line fs-4" style={{ color: 'rgba(0,0,0,0.2)' }}></i>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WilayaList;
