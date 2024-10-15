import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import Register from './Pages/Register';
import Navbar from './Pages/Navbar/Navbar';
import EventForm from './Pages/Events/EventForm';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/event' element={<EventForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
