import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Users } from './Users.jsx';
import { CreateUser } from './CreateUser';
import { UpdateUser } from './UpdateUser';
import Register from './Register.jsx';
import Login from './Login.jsx';
import { useState, useEffect } from 'react';

// 🔐 Global Axios Config
axios.defaults.baseURL = "https://mern-admindashboard-server-5ovz.onrender.com"; // <-- replace with actual backend Render URL
axios.defaults.withCredentials = true;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/' element={<Users isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/create' element={<CreateUser />} />
          <Route path='/update/:id' element={<UpdateUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
