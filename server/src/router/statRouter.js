const express = require('express');
const statController = require('../controllers/statController');
const checkToken = require('../middlewares/checkToken');

const statRouter = express.Router();

statRouter.get('/countParovoz', statController.countParovozMessages);

module.exports = statRouter;
