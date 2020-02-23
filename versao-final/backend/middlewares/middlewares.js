// const bodyParser = require('body-parser')
const express = require('express');
const path = require('path');
const cors = require('cors');

module.exports = app => {
  // Obsoleto
  // app.use(bodyParser.json())
  // Como colors foi importado no index.js - basta utilizarmos
  console.log('Loaded CORS!'.brightYellow);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`.brightGreen);
  app.use(express.json());
  app.use(cors());
  // Set static folder
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'uploads')));
};
