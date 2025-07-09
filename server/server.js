require('dotenv').config();
const express =require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
require('dotenv').config();

const UserModel=require('./Models/Users')
const authModel=require('./Models/Auth')

const app=express();
app.use(cors({
    origin: ["https://mern-admindashboard-nzcr.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.ATLASDB_URL);

const jwtSecret=process.env.JWT_SECRET;

const verifyUser=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.json("No token, authorization denied");
    }
    jwt.verify(token,jwtSecret,(err,decoded)=>{
        if(err){
            return res.json("Token is invalid");
        }
        req.userId=decoded.id;
        next();
    })
}

app.post('/register',(req,res)=>{
    authModel.create(req.body)
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

// Login Route (Modified to send user ID)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  authModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
          res.cookie('token', token, {
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             sameSite: 'None'
            });

          res.json({ message: "success", userId: user._id });
        } else {
          res.json({ message: "Password is incorrect" });
        }
      } else {
        res.json({ message: "No existing record is found" });
      }
    })
    .catch(err => res.json(err));
});

// Add this endpoint to your backend's index.js
app.get('/checkAuthStatus', verifyUser, (req, res) => {
    // If verifyUser middleware passes, req.userId will be set
    res.json({ isAuthenticated: true, userId: req.userId });
});

// Important: If verifyUser middleware fails (token missing/invalid), it will return an error JSON.
// The frontend 'checkAuthStatus' catch block will handle this, setting isAuthenticated to false.
//LogoutRoute
app.get('/logout',(req,res)=>{
     res.clearCookie('token'); // Clear the token cookie
    res.json("success")
})
app.get('/',(req,res)=>{
    UserModel.find({})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.get('/getUser/:id',verifyUser,(req,res)=>{
    const id=req.params.id;
        UserModel.findById({_id:id})
    .then(user=>{
        if(!user) return res.json("User not found")
            res.json(user);
        })
    .catch(err=>res.json(err))
})



app.post("/CreateUser",verifyUser,(req,res)=>{
    const {name,email,age}=req.body;
    const owner=req.userId;
    UserModel.create({name,email,age,owner})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})
app.put('/updateUser/:id',verifyUser,(req,res)=>{
    const id=req.params.id;
    const {name,email,age}=req.body;
 UserModel.findById(id)
        .then(user => {
            if (!user) return res.status(404).json("User not found");
            if (user.owner.toString() !== req.userId) { // Check if logged-in user is the owner
                return res.status(403).json("Unauthorized: You are not the owner of this data.");
            }
            // Update the user
            user.name = name;
            user.email = email;
            user.age = age;
            return user.save();
        })
        .then(updatedUser => res.json(updatedUser))
        .catch(err => res.status(500).json(err));
});
// Delete User (Protected - only owner can delete)
app.delete('/deleteUser/:id', verifyUser, (req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => {
            if (!user) return res.status(404).json("User not found");
            if (user.owner.toString() !== req.userId) { // Check if logged-in user is the owner
                return res.status(403).json("Unauthorized: You are not the owner of this data.");
            }
            return UserModel.findByIdAndDelete(id);
        })
        .then(deletedUser => res.json(deletedUser))
        .catch(err => res.status(500).json(err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log("server is listening")
})
