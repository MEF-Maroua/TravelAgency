import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/bookings/user/${user.id}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`http://localhost:3001/bookings/${id}/cancel`);
      alert('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking.');
    }
  };

  if (!user || user.role !== 'user') return null;

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col lg="12">
          <h2>Welcome back, {user.username}!</h2>
          <p>Here are your recent travel bookings.</p>
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tour</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Total Paid (Edahabia)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No bookings found.</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={b.tour_photo ? `http://localhost:3001${b.tour_photo}` : ''} alt="tour" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px'}} />
                        {b.tour_title}
                      </div>
                    </td>
                    <td>{new Date(b.book_date).toLocaleDateString()}</td>
                    <td>{b.guest_size}</td>
                    <td>${b.total_price}</td>
                    <td>
                      <Badge color={b.status === 'confirmed' ? 'success' : 'danger'}>
                        {b.status}
                      </Badge>
                    </td>
                    <td>
                      {b.status === 'confirmed' && (
                        <Button color="danger" size="sm" onClick={() => handleCancel(b.id)}>
                          Cancel
                        </Button>
                      )}
                      {b.status === 'confirmed' && (
                        <Button color="info" size="sm" className="ms-2" onClick={() => navigate(`/tours/${b.tour_id}`)}>
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
