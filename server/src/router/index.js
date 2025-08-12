const express = require('express');
const contestRouter = require('./contestRouter');
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const chatRouter = require('./chatRouter');

const router = express.Router();

router.use('/contests', contestRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/chat', chatRouter);

module.exports = router;
