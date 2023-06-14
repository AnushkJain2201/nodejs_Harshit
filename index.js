import express from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const server = express();




 mongoose.connect("mongodb://127.0.0.1:27017", {
  dbName: "backend",
}).then( () => {
   console.log("database connected")
})



const Sch = mongoose.Schema(
  {
    name: String,
    email: String,
    password:String,
  });


// middleware
const User = mongoose.model("users", Sch);
server.use(express.static(path.join(path.resolve(), "public")));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser())
//console.log(path.join(path.resolve(),"public"));




const authenticate=async(req,res,next)=>{// authenicate function checking as  middleware
  const {token} = req.cookies;
  if (token)
  {  
    const decoded = jwt.verify(token,"hjgajshdbjkas");
    req.user=await User.findById(decoded._id)//console.log(decoded);
   next();// calls the next function after it is called called in "/" server
  }
  else
  res.redirect("/login");
}

server.get("/", authenticate,(req, res) => {
 // console.log(req.user);
  res.render("./logout.ejs",{name:req.user.name});
});


server.get("/login",(req,res)=>
{
  res.render("./login.ejs");
})
server.get("/logout",(req,res)=>{
  res.cookie("token", "",{
    httpOnly:true,
    expires:new Date(Date.now())
  });
  res.redirect("/");
});





server.post("/register",async(req,res)=>{
  const { name, email ,password} = req.body;
  let user =await User.findOne({email});
  if(user)
  {
     return res.redirect("/login")
  }
  const hashp=await bcrypt.hash(password,10);
  const newUser = await User.create({ name, email,password:hashp });
  const token = jwt.sign({ _id: newUser._id }, "hjgajshdbjkas");
  console.log(token);
  res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) });
  res.redirect("/");  



});
server.get("/register",(req,res)=>{
  res.render("./register.ejs")
});


server.post("/login",async (req,res)=>{
  const {email,password}=req.body;
  let user =await User.findOne({email});
  if(!user)
  return  res.redirect("/register");
  else
  {
    const match=await bcrypt.compare(password,user.password);
    if(!match) return res.render('./login.ejs',{message:"Incorrect password"});
    else{
      
  const token = jwt.sign({ _id: user._id }, "hjgajshdbjkas");
  console.log(token);
  res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) });
  res.redirect("/"); 
    }
  }
})
/*server.post("/login", async (req, res) => {
  const { name, email } = req.body;
 let user =await User.findOne({email});
  if(!user)
  { 
     console.log("Register first")
     return res.redirect("/register")
  }
  const newUser = await User.create({ name, email });
  const token = jwt.sign({ _id: newUser._id }, "hjgajshdbjkas");
  console.log(token);
  res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) });
  res.redirect("/");
})*/






// checking of server
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
