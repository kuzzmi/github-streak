const request = require('request-promise-native');

const NOEVERR_MSG = 'slack.post() must called with event data';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

const getRequestOptions = body => ({
    uri: webhookUrl,
    method: 'POST',
    body,
    json: true,
});

module.exports.post = event => {
    if (!event) {
        throw new Error(NOEVERR_MSG);
    }

    const { author, eventType } = event;

    if ( !author || !eventType ) {
        throw new Error(NOEVERR_MSG);
    }

    const payload = {
        text: `${author} got a double commit!`
    };

    request(getRequestOptions(payload))
        .then(() => {
            console.log('New event has been posted to Slack');
        }).catch(() => {
            console.error('Error occured when trying to make a POST to Slack');
        });
};
