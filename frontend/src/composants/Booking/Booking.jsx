import React, { useState } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button, Label } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const Booking = ({ tour, avgRating, reviews }) => {
  const { price } = tour;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [credentials, setCredentials] = useState({
    fullName: "",
    phone: "",
    guestSize: 1,
    bookAt: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [showPayment, setShowPayment] = useState(false);

  const handlechange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const totalAmount = Number(price);

  const handleProceedToPayment = e => {
    e.preventDefault();
    if (!user) {
      alert("Please login first.");
      navigate('/login');
      return;
    }
    const { fullName, phone, bookAt } = credentials;
    if (!fullName || !phone || !bookAt) {
      alert("Please fill in all the required information before booking.");
      return;
    }
    setShowPayment(true);
  }

  const handlePayAndBook = async e => {
    e.preventDefault();
    if (!credentials.cardNumber || !credentials.expiryDate || !credentials.cvv) {
      alert("Please fill in the Edahabia card details.");
      return;
    }
    try {
      const bookingData = {
        user_id: user.id,
        email: user.email,
        full_name: credentials.fullName,
        phone: credentials.phone,
        guest_size: 1, // Fixed to 1
        book_date: credentials.bookAt,
        tour_id: tour.id,
        total_price: totalAmount,
        card_number: credentials.cardNumber,
        expiry_date: credentials.expiryDate,
        cvv: credentials.cvv
      }

      await axios.post('http://localhost:3001/booking', bookingData);
      alert('Payment Successful! A notification has been sent to your dashboard.');
      navigate('/dashboard/user');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed!');
    }
  }

  return (
    <div className='booking'>
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>{price} DA <span>/per person</span></h3>
        <span className="tour__rating d-flex align-items-center">
          <i className="ri-star-fill" ></i> {avgRating === 0 ? null : avgRating}
          ({reviews?.length || 0})
        </span>
      </div>

      {!showPayment ? (
        <div className="booking__form">
          <h5 className="mb-4 fw-bold">Reservation Details</h5>
          <Form className="booking__info-form p-4 rounded-4" onSubmit={handleProceedToPayment}>
            <FormGroup>
              <Label className="small fw-bold text-muted mb-2">Full Name</Label>
              <div className="input__box d-flex align-items-center gap-2 border rounded-3 px-3 py-2">
                <i className="ri-user-line text-primary"></i>
                <input type="text" placeholder="e.g. John Doe" id='fullName' required onChange={handlechange} className="border-0 w-100" style={{ outline: 'none' }} />
              </div>
            </FormGroup>

            <FormGroup>
              <Label className="small fw-bold text-muted mb-2">Phone Number</Label>
              <div className="input__box d-flex align-items-center gap-2 border rounded-3 px-3 py-2 bg-white">
                <span className="text-muted fw-bold border-end pe-2">+213</span>
                <input type="tel" placeholder="7XX XX XX XX" id='phone' required onChange={handlechange} className="border-0 w-100" style={{ outline: 'none' }} />
              </div>
            </FormGroup>

            <FormGroup>
              <Label className="small fw-bold text-muted mb-2">Trip Date</Label>
              <div className="input__box d-flex align-items-center gap-2 border rounded-3 px-3 py-2">
                <i className="ri-calendar-line text-primary"></i>
                <input type="date" id='bookAt' required onChange={handlechange} className="border-0 w-100" style={{ outline: 'none' }} />
              </div>
            </FormGroup>

            <div className="booking__bottom mt-5">
              <ListGroup className="border-0">
                <ListGroupItem className="border-0 px-0 total d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total Amount</h5>
                  <span className="fs-4 text-primary fw-bold">{totalAmount} DA</span>
                </ListGroupItem>
              </ListGroup>
              <Button className="btn primary__btn w-100 mt-4 py-3 rounded-pill fw-bold shadow-sm" type="submit">
                Proceed to Payment <i className="ri-arrow-right-line ms-2"></i>
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="payment__form mt-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <i className="ri-secure-payment-line fs-3 text-success"></i>
            <h5 className="mb-0 fw-bold">Secure Payment</h5>
          </div>
          <Form className="booking__info-form p-4 rounded-4 bg-light border-0" onSubmit={handlePayAndBook}>
            <FormGroup>
              <Label className="small fw-bold text-muted mb-2">Card Number</Label>
              <input type="text" placeholder="0000 0000 0000 0000" id='cardNumber' required onChange={handlechange} maxLength="16" className="w-100 p-3 rounded-3 border-0 shadow-sm" />
            </FormGroup>
            <div className="d-flex gap-3">
              <FormGroup className="flex-grow-1">
                <Label className="small fw-bold text-muted mb-2">Expiry Date</Label>
                <input type="text" placeholder="MM/YY" id='expiryDate' required onChange={handlechange} maxLength="5" className="w-100 p-3 rounded-3 border-0 shadow-sm" />
              </FormGroup>
              <FormGroup className="flex-grow-1">
                <Label className="small fw-bold text-muted mb-2">CVV</Label>
                <input type="password" placeholder="***" id='cvv' required onChange={handlechange} maxLength="4" className="w-100 p-3 rounded-3 border-0 shadow-sm" />
              </FormGroup>
            </div>
            <div className="booking__bottom mt-4">
              <ListGroup className="border-0">
                <ListGroupItem className="border-0 px-0 total d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Amount to Pay</h5>
                  <span className="fs-5 text-dark fw-bold">{totalAmount} DA</span>
                </ListGroupItem>
              </ListGroup>
              <Button className="btn btn-success w-100 mt-4 py-3 rounded-pill fw-bold shadow-sm" type="submit">
                Pay & Book Now
              </Button>
              <Button color="link" className="text-muted w-100 mt-3 text-decoration-none" onClick={() => setShowPayment(false)}>
                <i className="ri-arrow-left-line me-1"></i> Back to Details
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Booking;
