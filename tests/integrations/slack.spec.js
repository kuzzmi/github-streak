const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');

describe('integrations: slack', () => {
    let request;
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

        mockery.registerMock('request-promise-native', request);

        slack = require('../../app/integrations/slack.js');
    });

    after(() => {
        mockery.disable();
    });

    describe('#post()', () => {
        it('should be defined', () => {
            expect(slack.post).not.to.be.an.undefined;
        });

        it('should make a post request when data is passed', () => {
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
                eventType: 'DOUBLE_COMMIT'
            });

            expect(request.called).to.be.true;
            expect(request.calledWith(payload)).to.be.true;
        });

        it('should throw when called without event data', () => {
            expect(slack.post).to.throw(/with event data/);
            expect(() => ( slack.post({}) )).to.throw(/with event data/);
            expect(() => ( slack.post({ author: null, eventType: null }) )).to.throw(/with event data/);
            expect(() => ( slack.post({ author: '', eventType: '' }) )).to.throw(/with event data/);
            expect(() => ( slack.post({ eventType: 'EVENT' }) )).to.throw(/with event data/);
            expect(() => ( slack.post({ author: 'AUTHOR' }) )).to.throw(/with event data/);
        });
    });
});
