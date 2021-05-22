const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/room', (req, res) => {
    res.sendFile(path.join(__dirname, "../views/room.html"));
});

module.exports = router;