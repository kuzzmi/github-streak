const expect = require('chai').expect;
const streaker = require('../app/streaker');

const contribution1 = {
    id: '0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c',
    message: 'Test',
    timestamp: '2015-05-05T19:40:15-04:00',
    author: {
        name: 'test',
        email: 'test@users.noreply.github.com',
        username: 'test'
    },
    committer: {
        name: 'test',
        email: 'test@users.noreply.github.com',
        username: 'test'
    },
    added: [],
    removed: [],
    modified: [
        'README.md'
    ]
};

const contribution2 = {
    id: '0d1a26e6718f5eaf1f6ba5c57fc3c7d91ac0fd1c',
    message: 'Test',
    timestamp: '2015-05-05T19:40:15-04:00',
    author: {
        name: 'test',
        email: 'test@users.noreply.github.com',
        username: 'test'
    },
    committer: {
        name: 'test',
        email: 'test@users.noreply.github.com',
        username: 'test'
    },
    added: [],
    removed: [],
    modified: [
        'README.md'
    ]
};

const contribution3 = {
    id: '0d1a26e67d8fdaaf1f6ba5c57fc3c7d91ac0fd1c',
    message: 'Test',
    timestamp: '2015-05-05T19:40:15-04:00',
    author: {
        name: 'test2',
        email: 'test2@users.noreply.github.com',
        username: 'test2'
    },
    committer: {
        name: 'test',
        email: 'test@users.noreply.github.com',
        username: 'test'
    },
    added: [],
    removed: [],
    modified: [
        'README.md'
    ]
};

describe('streaker', () => {
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
    });
});
