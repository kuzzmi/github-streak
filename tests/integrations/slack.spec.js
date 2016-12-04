const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');

describe('integrations: slack', () => {
    let request;
    let dictionary;
    let slack;

    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        request = sinon.spy(() => {
            return Promise.resolve();
        });

        dictionary = {
            get: event => {
                switch (event.type) {
                    case 'DOUBLE_COMMIT':
                        return `${event.author} got a double commit!`;
                    case 'TRIPLE_COMMIT':
                        return `${event.author} got a triple commit!`;
                    default:
                        return false;
                }
            }
        };

        mockery.registerMock('request-promise-native', request);
        mockery.registerMock('../dictionary.js', dictionary);

        slack = require('../../app/integrations/slack.js');
    });

    after(() => {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('#post()', () => {
        it('should be defined', () => {
            expect(slack.post).not.to.be.an.undefined;
        });

        it('should make a properly formated post request when DOUBLE_COMMIT event type is passed', () => {
            const author = 'test';

            const message = `${author} got a double commit!`;

            const payload = {
                uri: process.env.SLACK_WEBHOOK_URL,
                method: 'POST',
                body: {
                    text: message
                },
                json: true
            };

            slack.post({
                author,
                type: 'DOUBLE_COMMIT'
            });

            expect(request.called).to.be.true;
            expect(request.calledWith(payload)).to.be.true;
        });

        it('should make a properly formated post request when TRIPLE_COMMIT event type is passed', () => {
            const author = 'test';

            const message = `${author} got a triple commit!`;

            const payload = {
                uri: process.env.SLACK_WEBHOOK_URL,
                method: 'POST',
                body: {
                    text: message
                },
                json: true
            };

            slack.post({
                author,
                type: 'TRIPLE_COMMIT'
            });

            expect(request.called).to.be.true;
            expect(request.calledWith(payload)).to.be.true;
        });

        it('should not make a request when there is no text from dictionary', () => {
            const result = slack.post({ author: 'author', type: 'foobar' });
            expect(result).to.be.false;
        });

        it('should throw when called without event data', () => {
            expect(slack.post).to.throw(/no event/);
        });
    });
});
