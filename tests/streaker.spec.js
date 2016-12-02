const expect = require('chai').expect;
const streaker = require('../streaker');

describe('streaker', () => {
    describe('#getContributions()', () => {
        it('should be defined', () => {
            expect(streaker.getContributions).to.not.be.an('undefined');
        });
        it('should return an object using author names as keys', () => {
            const author = 'test';

            streaker.addContribution({
                author: 'test',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            streaker.addContribution({
                author: 'test2',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            expect(streaker.getContributions()).to.have.all.keys([ 'test', 'test2' ]);
        });
    });
    describe('#addContribution()', () => {
        it('should be defined', () => {
            expect(streaker.addContribution).to.not.be.an('undefined');
        });
        it('should add a contribution unit to the contribution collection', () => {
            const author = 'test';

            streaker.addContribution({
                author: 'test',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            expect(streaker.getContributionsFor().length).to.equal(1);
        });
        it('should add a contribution unit to the contribution collection', () => {
            streaker.addContribution({
                author: 'test',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            expect(streaker.getContributions().length).to.equal(1);
        });
    });
});
