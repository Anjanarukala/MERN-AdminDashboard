import {BrowserRouter,Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Users} from './Users.jsx'
import { CreateUser } from './CreateUser'
import { UpdateUser } from './UpdateUser'
import Register from './Register.jsx'
import Login from './Login.jsx'
import { useState } from 'react'

function App() {
  const [isLoggedIn,setIsLoggedIn]=useState(false)
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn}/>}></Route>
          <Route path='/' element={<Users isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}></Route>
         <Route path='/create' element={<CreateUser/>}></Route>
          <Route path='/update/:id' element={<UpdateUser/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
