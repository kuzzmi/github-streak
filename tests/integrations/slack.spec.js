const expect = require('chai').expect;
const sinon = require('sinon');
const slack = require('../../app/integrations/slack.js');

describe('integrations: slack', () => {
    describe('#post()', () => {
        it('should be defined', () => {
            expect(slack.post).not.to.be.an.undefined;
        });
    });
});
