import React, { useState } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap"
import { Link } from "react-router-dom"
import axios from 'axios'

import '../styles/login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')

  const handleChange = e => {
    setCredentials(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleClick = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3001/login', credentials)
      setMessage(res.data.message)

      // Save user data in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // Redirect to Home page after successful login
      window.location.href = '/home';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' className="m-auto">
            <div className="login__container d-flex justify-content-between">

              <div className="login__form">
                <h2>Login</h2>
                <Form onSubmit={handleClick}>
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

                  <Button className="btn secondary__btn auth__btn" type="submit">
                    Login
                  </Button>
                </Form>
                <p>{message}</p>
                <p>Don't have an account? <Link to='/register'>Create</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Login
