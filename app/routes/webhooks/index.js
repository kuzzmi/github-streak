const router = require('express').Router();
const streaker = require('../../streaker.js');

router.post('/push', (req, res) => {
    const data = req.body;
    if (!data.commits) {
        return res.status(400).json({ status: 'ERROR', message: 'Webhook payload is empty' });
    }

    data.commits.forEach(streaker.addContribution);

    return res.status(200).json({ status: 'OK' });
});

module.exports = router;
