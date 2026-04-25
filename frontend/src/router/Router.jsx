
import React from 'react'
import{Routes, Route, Navigate} from 'react-router-dom'
import Home from '../pages/Home';
import Tours from '../pages/Tour';
import About from '../pages/About'
import TourDetails from '../pages/TourDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SearchResult from '../pages/SearchResult';
import ThankYou from '../pages/ThankYou';
import AgenciesByWilaya from '../pages/AgenciesByWilaya';
import AgencyTours from '../pages/AgencyTours';
import AgencyDashboard from '../pages/AgencyDashboard';
import UserDashboard from '../pages/UserDashboard';
import ChatPage from '../pages/ChatPage';

const Router = () => {
  return (
    <Routes>
        <Route path='/' element ={<Navigate to='/home'/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/tours' element={<Tours/>}/>
        <Route path='/tours/:id' element={<TourDetails/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/thank-you' element={<ThankYou/>}/>
        <Route path='/tours/search' element={<SearchResult/>}/>
        <Route path='/wilayas/:name/agencies' element={<AgenciesByWilaya/>}/>
        <Route path='/agencies/:id/tours' element={<AgencyTours/>}/>
        <Route path='/dashboard/agency' element={<AgencyDashboard/>}/>
        <Route path='/dashboard/user' element={<UserDashboard/>}/>
        <Route path='/chatbot' element={<ChatPage/>}/>
    </Routes>
  )
}

export default Router