const express = require('express');
const { app, database } = require('./database');

app.use(express.json());

app.get('/api/users', (req, res) => {
  database.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error on the server.');
    }
    res.json({ users: results });
  });
});

app.get('/api/video_share_requests', (req, res) => {
  database.query('SELECT * FROM video_share_requests', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error on the server.');
    }
    res.json({ video_share_requests: results });
  });
});

app.post('/api/video_share_requests', (req, res) => {
  const { senderId, receiverId, videoKey } = req.body;
  const status = 'pending';

  database.query('INSERT INTO video_share_requests (sender_id, receiver_id, video_key, status) VALUES ($1, $2, $3, $4)',
  [senderId, receiverId, videoKey, status], (error, results) => {
    if (error) {
      console.error('Database error:', error); 
      return res.status(500).send('Error creating share request.');
    }
    res.status(201).send('Share request created successfully.');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
