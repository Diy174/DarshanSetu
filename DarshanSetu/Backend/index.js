import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; //for reading env 
dotenv.config({
    path:'./.env'
})

const app=express()

const URI=process.env.MONGODB_URI;
const PORT=process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("Welcome to DarshanSetu App!!");
});
 
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
});