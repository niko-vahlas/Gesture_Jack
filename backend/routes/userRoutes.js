const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.post('/signup', async (req, res) => {
  // Extract details from request body
  const { username, password, balance } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid Input' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
      balance: balance,
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  // Extract details from request body
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid Input' });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
    const hashedPassword = existingUser.password;

    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
    res.status(200).json({
      message: 'Logged in successfully',
      balance: existingUser.balance,
    });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update-balance', async (req, res) => {
  const { username, newBalance } = req.body;

  if (!username || typeof newBalance !== 'number') {
    return res
      .status(400)
      .json({ message: 'Username or newBalance is missing or invalid.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
    existingUser.balance = newBalance;
    await existingUser.save();

    res.json({ message: 'Balance updated successfully' });
  } catch (err) {
    console.error('Error updating balance:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
