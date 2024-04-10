// import express from 'express'
import { userRouter } from './routes/users/users.controller';
const express = require('express');
const app  = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/user' , userRouter)
// app.get('/tasks' , taskRouter)

app.listen(3434, () => {
    console.log('Server is running on port 3434');
})
