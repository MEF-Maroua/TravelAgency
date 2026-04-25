import React, { useState } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap"
import { Link } from "react-router-dom"
import axios from 'axios'
import { wilayas } from '../utils/wilayas'

import '../styles/login.css'


const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    agency_name: '',
    wilaya: '',
    phone: ''
  })
  const [logoFile, setLogoFile] = useState(null)
  const [message, setMessage] = useState('')

  const handleChange = e => {
    setCredentials(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleFileChange = e => {
    setLogoFile(e.target.files[0])
  }

  const handleClick = async e => {
    e.preventDefault()
    try {
      let logoUrl = null;

      // If agency and file selected, upload file first
      if (credentials.role === 'agency' && logoFile) {
        const formData = new FormData()
        formData.append('image', logoFile)
        const uploadRes = await axios.post('http://localhost:3001/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        logoUrl = uploadRes.data.filePath;
      }

      const payload = {
        ...credentials,
        logo: logoUrl
      }

      const res = await axios.post('http://localhost:3001/register', payload)
      setMessage(res.data.message)

      // Save user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: res.data.userId,
        username: credentials.username,
        email: credentials.email,
        role: credentials.role,
        agencyInfo: credentials.role === 'agency' ? {
          id: res.data.agencyId,
          agency_name: credentials.agency_name,
          wilaya: credentials.wilaya,
          logo: logoUrl
        } : null
      }))

      // Redirect to Home page
      window.location.href = '/home';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' className="m-auto">
            <div className="login__container d-flex justify-content-between">

              <div className="login__form">
                <h2>Register</h2>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <select id="role" onChange={handleChange} required className="w-100 p-2 border rounded">
                      <option value="user">Normal User</option>
                      <option value="agency">Agency Owner</option>
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      id="username"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      id="email"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      id="password"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  {credentials.role === 'agency' && (
                    <>
                      <FormGroup>
                        <input
                          type="text"
                          placeholder="Agency Name"
                          required
                          id="agency_name"
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <select id="wilaya" onChange={handleChange} required className="w-100 p-2 border rounded">
                          <option value="">Select Wilaya</option>
                          {wilayas.map((w, i) => (
                            <option key={i} value={w}>{i + 1} - {w}</option>
                          ))}
                        </select>
                      </FormGroup>
                      <FormGroup>
                        <input
                          type="text"
                          placeholder="Phone Number"
                          required
                          id="phone"
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Agency Logo:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-100 p-2"
                        />
                      </FormGroup>
                    </>
                  )}

                  <Button className="btn secondary__btn auth__btn" type="submit">
                    Create Account
                  </Button>
                </Form>
                <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Register
