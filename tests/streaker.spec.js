const expect = require('chai').expect;
const streaker = require('../streaker');

describe('streaker', () => {
    describe('#empty()', () => {
        beforeEach(() => {
            streaker.empty();
        });

        it('should be defined', () => {
            expect(streaker.empty).to.not.be.an.undefined;
        });

        it('should empty the map of contributions', () => {
            streaker.addContribution({
                author: 'test',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            streaker.empty();

            expect(Object.keys( streaker.getContributions() ).length).to.equal(0);
        });
    });

    describe('#getContributions()', () => {
        beforeEach(() => {
            streaker.empty();

            streaker.addContribution({
                author: 'test',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            streaker.addContribution({
                author: 'test2',
                title: 'test',
                sha1: 'test2',
                branch: 'test'
            });
        });

        it('should be defined', () => {
            expect(streaker.getContributions).to.not.be.an.undefined;
        });

        it('should return an object using author names as keys', () => {
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
            streaker.addContribution({
                author: 'test',
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            expect(Object.keys( streaker.getContributions() ).length).to.equal(1);
        });

        it('should add a contribution unit to the same author if present', () => {
            const author = 'test';

            streaker.addContribution({
                author,
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            streaker.addContribution({
                author,
                title: 'test',
                sha1: 'test1',
                branch: 'test'
            });

            expect(streaker.getContributions()[author].length).to.equal(2);
        });

        it('should not add a contribution with existing SHA1 commit', () => {
            const author = 'test';

            streaker.addContribution({
                author,
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            streaker.addContribution({
                author,
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            expect(streaker.getContributions()[author].length).to.equal(1);
        });

        it('should add contributions in a way that the last contribution from author is his oldest commit', () => {
            const author = 'test';

            streaker.addContribution({
                author,
                title: 'test',
                sha1: 'test',
                branch: 'test'
            });

            streaker.addContribution({
                author,
                title: 'test2',
                sha1: 'test2',
                branch: 'test'
            });

            expect(streaker.getContributions()[author][0].title).to.equal('test2');
        });
    });
});
