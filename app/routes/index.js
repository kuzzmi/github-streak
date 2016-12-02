const router = require('express').Router();

router.get('/webhooks', (req, res) => {
    res.status(200).json({});
});

module.exports = router;
