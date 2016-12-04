const request = require('request-promise-native');

const dictionary = require('../dictionary.js');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

const getRequestOptions = body => ({
    uri: webhookUrl,
    method: 'POST',
    body,
    json: true,
});

module.exports.post = event => {
    if (!event) {
        throw new Error('slack.post(): no event was passed');
    }

    const { author, type, commitTitle } = event;

    const text = dictionary.get(event);

    if (!text) {
        return false;
    }

    const payload = { text };

    return request(getRequestOptions(payload))
        .then(() => {
            console.log('New event has been posted to Slack');
        }).catch(err => {
            console.error('Error occured when trying to make a POST to Slack', err);
        });
};
