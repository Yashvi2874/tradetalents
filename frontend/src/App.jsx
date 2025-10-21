import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Sessions from './pages/Sessions'
import Skills from './pages/Skills'
import Credits from './pages/Credits'
import BrowseSkills from './pages/BrowseSkills'
import Messages from './pages/Messages'
import Calendar from './pages/Calendar'
import Test from './pages/Test'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
    
    AOS.refresh();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/sessions" element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/skills" element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/browse" element={
            <ProtectedRoute>
              <BrowseSkills />
            </ProtectedRoute>
          } />
          <Route path="/credits" element={
            <ProtectedRoute>
              <Credits />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/test" element={<Test />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App