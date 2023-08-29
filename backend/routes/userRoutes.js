const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/signup', async (req, res) => {
  // Extract details from request body
  const { username, password } = req.body;

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
      balance: 225,
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
    res
      .status(200)
      .json({
        message: 'Logged in successfully',
        balance: existingUser.balance,
      });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:username/balance', async (req, res) => {
  // Extract username from route parameter
  const { username } = req.params;

  // Fetch user from the database and return balance.
  // Send back appropriate response.
});

router.put('/:username/balance', async (req, res) => {
  // Extract details from request body and route parameters
  const { username } = req.params;
  const { newBalance } = req.body;

  // Implement logic to update user's balance in the database.

  // Send back appropriate response.
});

module.exports = router;
