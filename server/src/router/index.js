const express = require('express');
const contestRouter = require('./contestRouter');
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const chatRouter = require('./chatRouter');
const statRouter = require('./statRouter');
const offerRouter = require('./offerRouter');
const paymentRouter = require('./paymentRouter');

const router = express.Router();

router.use('/contests', contestRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/chat', chatRouter);
router.use('/stat', statRouter);
router.use('/offers', offerRouter);
router.use('/payment', paymentRouter);

module.exports = router;
