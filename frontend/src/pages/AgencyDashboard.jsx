import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AgencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [tourForm, setTourForm] = useState({
    title: '', city: '', distance: 0, desc: '', price: 0, featured: 0, tour_date: ''
  });
  const [photoFile, setPhotoFile] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'agency') {
      navigate('/login');
      return;
    }
    fetchBookings();
    fetchTours();
  }, [user?.id]); // Only re-run if user ID changes

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/bookings/agency/${user.agencyInfo.id}`);
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchTours = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/tours/agency/${user.agencyInfo.id}`);
      setTours(res.data);
    } catch (err) {
      console.error('Error fetching tours:', err);
    }
  };

  const handleTourChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setTourForm({ ...tourForm, [e.target.id]: value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleAddTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let photoUrl = '';
      if (photoFile) {
        console.log("Uploading photo...");
        const formData = new FormData();
        formData.append('image', photoFile);
        const uploadRes = await axios.post('http://localhost:3001/upload', formData);
        photoUrl = uploadRes.data.filePath;
        console.log("Photo uploaded:", photoUrl);
      }

      const payload = {
        ...tourForm,
        agency_id: user.agencyInfo.id,
        wilaya: user.agencyInfo.wilaya,
        photo: photoUrl,
        price: Number(tourForm.price),
        distance: Number(tourForm.distance),
        featured: Number(tourForm.featured)
      };

      console.log("Sending payload to /tours:", payload);
      const res = await axios.post('http://localhost:3001/tours', payload);
      console.log("Server response:", res.data);
      
      setMessage({ type: 'success', text: 'Tour added successfully!' });
      
      // Reset form
      setTourForm({ title: '', city: '', distance: 0, desc: '', price: 0, featured: 0, tour_date: '' });
      setPhotoFile(null);
      
      await fetchTours(); // Refresh data first
      setActiveTab('tours'); // Immediate switch
    } catch (err) {
      console.error('Add tour error details:', err.response?.data || err.message);
      setMessage({ type: 'danger', text: `Failed: ${err.response?.data?.message || err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (id) => {
    if(!window.confirm('Are you sure you want to delete this tour?')) return;
    try {
      await axios.delete(`http://localhost:3001/tours/${id}`);
      fetchTours();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'agency') return null;

  return (
    <Container className="my-5 pt-5">
      <Row className="mb-5 align-items-center bg-light p-4 rounded-4 shadow-sm">
        <Col md="auto">
          <img 
            src={user.agencyInfo.logo ? `http://localhost:3001${user.agencyInfo.logo}` : '/default-agency.png'} 
            alt="logo" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff' }}
          />
        </Col>
        <Col>
          <h2 className="fw-bold mb-1">{user.agencyInfo.agency_name}</h2>
          <p className="text-muted mb-0"><i className="ri-map-pin-line"></i> {user.agencyInfo.wilaya} | Agency Dashboard</p>
        </Col>
      </Row>

      <Row>
        <Col lg="3" className="mb-4">
          <div className="d-flex flex-column gap-2 p-3 bg-white rounded-4 shadow-sm">
            <Button 
              className={`text-start border-0 py-2 px-3 rounded-3 ${activeTab === 'bookings' ? 'primary__btn' : 'btn-light'}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="ri-calendar-check-line me-2"></i> My Bookings
            </Button>
            <Button 
              className={`text-start border-0 py-2 px-3 rounded-3 ${activeTab === 'tours' ? 'primary__btn' : 'btn-light'}`}
              onClick={() => setActiveTab('tours')}
            >
              <i className="ri-road-map-line me-2"></i> My Tours
            </Button>
            <Button 
              className={`text-start border-0 py-2 px-3 rounded-3 ${activeTab === 'addTour' ? 'primary__btn' : 'btn-light'}`}
              onClick={() => setActiveTab('addTour')}
            >
              <i className="ri-add-circle-line me-2"></i> Add New Tour
            </Button>
          </div>
        </Col>

        <Col lg="9">
          {message.text && <Alert color={message.type} className="rounded-4 mb-4">{message.text}</Alert>}

          <div className="bg-white p-4 rounded-4 shadow-sm min-vh-50">
            {activeTab === 'bookings' && (
              <div>
                <h4 className="fw-bold mb-4">Customer Reservations</h4>
                {bookings.length === 0 ? (
                  <div className="text-center py-5 text-muted">No bookings found yet.</div>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Tour</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id}>
                          <td className="fw-bold">{b.tour_title}</td>
                          <td>
                            <div>{b.full_name}</div>
                            <div className="small text-muted">{b.phone}</div>
                          </td>
                          <td>{new Date(b.book_date).toLocaleDateString()}</td>
                          <td className="text-primary fw-bold">{b.total_price} DA</td>
                          <td>
                            <span className="badge bg-success rounded-pill px-3">Confirmed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            )}

            {activeTab === 'tours' && (
              <div>
                <h4 className="fw-bold mb-4">My Published Tours</h4>
                {tours.length === 0 ? (
                  <div className="text-center py-5 text-muted">You haven't added any tours yet.</div>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Photo</th>
                        <th>Title & City</th>
                        <th>Price</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map(t => (
                        <tr key={t.id}>
                          <td>
                            <img 
                              src={t.photo ? `http://localhost:3001${t.photo}` : '/placeholder.jpg'} 
                              alt="tour" 
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} 
                            />
                          </td>
                          <td>
                            <div className="fw-bold">{t.title}</div>
                            <div className="small text-muted">{t.city}</div>
                          </td>
                          <td className="text-primary fw-bold">{t.price} DA</td>
                          <td className="text-center">
                            <Button color="link" className="text-danger p-0" onClick={() => handleDeleteTour(t.id)}>
                              <i className="ri-delete-bin-line fs-5"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            )}

            {activeTab === 'addTour' && (
              <div>
                <h4 className="fw-bold mb-4">Create a New Adventure</h4>
                <Form onSubmit={handleAddTour}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="small fw-bold">Tour Title</Label>
                        <Input type="text" id="title" value={tourForm.title} placeholder="e.g. Sahara Night Adventure" required onChange={handleTourChange} />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="small fw-bold">City (within {user.agencyInfo.wilaya})</Label>
                        <Input type="text" id="city" value={tourForm.city} placeholder="e.g. Taghit" required onChange={handleTourChange} />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label className="small fw-bold text-dark">
                          <i className="ri-money-dollar-circle-line text-primary me-1"></i>
                          Price per Person (DA)
                        </Label>
                        <Input type="number" id="price" value={tourForm.price} placeholder="0.00" required onChange={handleTourChange} className="rounded-3" />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label className="small fw-bold text-dark">
                          <i className="ri-map-pin-time-line text-primary me-1"></i>
                          Total Distance (km)
                        </Label>
                        <Input type="number" id="distance" value={tourForm.distance} placeholder="0" required onChange={handleTourChange} className="rounded-3" />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="small fw-bold">Trip Date</Label>
                        <Input type="date" id="tour_date" value={tourForm.tour_date} required onChange={handleTourChange} />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="pt-4">
                        <Label className="d-flex align-items-center gap-2 cursor-pointer">
                          <Input type="checkbox" id="featured" checked={tourForm.featured === 1} onChange={handleTourChange} />
                          <span>Show in Featured Tours?</span>
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label className="small fw-bold">Tour Description</Label>
                        <Input type="textarea" id="desc" value={tourForm.desc} rows="4" placeholder="Tell travelers about the experience..." required onChange={handleTourChange} />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label className="small fw-bold">Tour Main Photo</Label>
                        <Input type="file" accept="image/*" onChange={handlePhotoChange} required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button className="primary__btn w-100 py-2 mt-3 rounded-3" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Publish Tour'}
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AgencyDashboard;
