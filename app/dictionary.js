const config = require('../config.js');

module.exports.get = event => {
    if (!event) {
        throw new Error('dictionary.get(): no event was passed');
    }

    const { type } = event;

    if (!type) {
        throw new Error('dictionary.get(): required field `type` is missing in a event');
    }

    const template = config.events[type];

    if (!template) {
        return false;
    }

    const mkRegexp = group => new RegExp(`%${group}(?![^%\\s])`, 'g');

    const message = template
                        .replace(mkRegexp('an'), event.commit.author.name)
                        .replace(mkRegexp('ae'), event.commit.author.email)
                        .replace(mkRegexp('au'), event.commit.author.username)
                        .replace(mkRegexp('cm'), event.commit.message);

    return message;
};
