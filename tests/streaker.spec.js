const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');

const makeCommit = ( number, author ) => ({
    id: `0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1${number}`,
    message: 'Test',
    timestamp: '2015-05-05T19:40:15-04:00',
    author: {
        name: author,
        email: 'test@users.noreply.github.com',
        username: author
    },
    committer: {
        name: author,
        email: 'test@users.noreply.github.com',
        username: author
    },
    added: [],
    removed: [],
    modified: [
        'README.md'
    ]
});

const contribution0 = makeCommit(0, 'test');
const contribution1 = makeCommit(1, 'test');
const contribution2 = makeCommit(2, 'test');
const contribution3 = makeCommit(3, 'test2');
const contribution4 = makeCommit(4, 'test');
const contribution5 = makeCommit(5, 'test');
const contribution6 = makeCommit(6, 'test');
const contribution7 = makeCommit(7, 'test');
const contribution8 = makeCommit(8, 'test');
const contribution9 = makeCommit(9, 'test');

describe('streaker', () => {
    let config;
    let slack;
    let streaker;

    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        config = {
            multi_timeout: 10
        };

        slack = {
            post: sinon.spy(() => {
                return Promise.resolve();
            })
        };

        mockery.registerMock('../config', config);
        mockery.registerMock('./integrations/slack.js', slack);

        streaker = require('../app/streaker');
    });

    after(() => {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('#empty()', () => {
        beforeEach(() => {
            streaker.empty();
        });

        it('should be defined', () => {
            expect(streaker.empty).to.not.be.an.undefined;
        });

        it('should empty the map of contributions', () => {
            streaker.addContribution(contribution1);

            streaker.empty();

            expect(Object.keys( streaker.getContributions() ).length).to.equal(0);
        });
    });

    describe('#getContributions()', () => {
        beforeEach(() => {
            streaker.empty();
        });

        it('should be defined', () => {
            expect(streaker.getContributions).to.not.be.an.undefined;
        });

        it('should return an object using author names as keys', () => {
            streaker.addContribution(contribution1);
            streaker.addContribution(contribution3);
            expect(streaker.getContributions()).to.have.all.keys([ 'test', 'test2' ]);
        });
    });

    describe('#addContribution()', () => {
        beforeEach(() => {
            streaker.empty();
        });

        it('should be defined', () => {
            expect(streaker.addContribution).to.not.be.an('undefined');
        });

        it('should add a contribution unit to the contribution collection', () => {
            streaker.addContribution(contribution1);

            expect(Object.keys( streaker.getContributions() ).length).to.equal(1);
        });

        it('should add a contribution unit to the same author if present', () => {
            const author = 'test';

            streaker.addContribution(contribution1);
            streaker.addContribution(contribution2);

            expect(streaker.getContributions()[author].length).to.equal(2);
        });

        it('should not add a contribution with existing SHA1 commit', () => {
            const author = 'test';

            streaker.addContribution(contribution1);
            streaker.addContribution(contribution1);

            expect(streaker.getContributions()[author].length).to.equal(1);
        });

        it('should add contributions in a way that the last contribution from author is his oldest commit', () => {
            const author = 'test';

            streaker.addContribution(contribution1);
            streaker.addContribution(contribution2);

            expect(streaker.getContributions()[author][0].message).to.equal('Test');
        });

        it('should call slack.post() on every commit with event type COMMIT', () => {
            streaker.addContribution(contribution1);

            expect(slack.post.called).to.be.true;
            expect(slack.post.calledWith({
                commit: contribution1,
                type: 'COMMIT'
            })).to.be.true;
        });

        it('should call slack.post() on 2 sequential commits with event type DOUBLE_COMMIT', (done) => {
            streaker.addContribution(contribution1);
            streaker.addContribution(contribution2);

            setTimeout(function() {
                expect(slack.post.called).to.be.true;
                expect(slack.post.calledWith({
                    commit: contribution2,
                    type: 'DOUBLE_COMMIT'
                })).to.be.true;
                done();
            }, config.multi_timeout * 2);
        });

        it('should call slack.post() on 3 sequential commits with event type TRIPLE_COMMIT', done => {
            streaker.empty();
            streaker.addContribution(contribution1);
            streaker.addContribution(contribution2);
            streaker.addContribution(contribution0);

            setTimeout(function() {
                expect(slack.post.called).to.be.true;
                expect(slack.post.calledWith({
                    commit: contribution0,
                    type: 'TRIPLE_COMMIT'
                })).to.be.true;
                done();
            }, config.multi_timeout * 3);
        });
    });
});
