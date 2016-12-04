const expect = require('chai').expect;
const mockery = require('mockery');

describe('dictionary', () => {
    let dictionary;
    let config;

    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        config = {
            events: {
                test: '%an',
                test2: '%an %an %an',
                test3: '%an %ae %au',
                test4: '%an %ae %au %cm',
                test5: '%an%ae%au%cm',
                test6: '%anae%an'
            }
        };

        mockery.registerMock('../config', config);

        dictionary = require('../app/dictionary.js');
    });

    after(() => {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('#get()', () => {
        it('should be defined', () => {
            expect(dictionary.get).to.not.be.an.undefined;
        });

        it('should throw when called with bad data', () => {
            expect(dictionary.get).to.throw(/no event/);
            expect(() => ( dictionary.get({}) )).to.throw(/required field/);
            expect(() => ( dictionary.get({ type: null }) )).to.throw(/required field/);
        });

        it('should throw when event type is missing in the configuration', () => {
            const event = {
                type: 'foobar',
            };

            expect(() => dictionary.get(event)).to.not.throw(TypeError);
        });

        it('should return a formatted when called with good data', () => {
            const event1 = {
                commit: {
                    author: {
                        name: 'test',
                        email: 'test@test.com',
                        username: 'testtest'
                    },
                    message: 'testmsg',
                },
                type: 'test',
            };

            const event2 = {
                commit: {
                    author: {
                        name: 'test',
                        email: 'test@test.com',
                        username: 'testtest'
                    },
                    message: 'testmsg',
                },
                type: 'test2'
            };

            const event3 = {
                commit: {
                    author: {
                        name: 'test',
                        email: 'test@test.com',
                        username: 'testtest'
                    },
                    message: 'testmsg',
                },
                type: 'test3'
            };

            const event4 = {
                commit: {
                    author: {
                        name: 'test',
                        email: 'test@test.com',
                        username: 'testtest'
                    },
                    message: 'testmsg',
                },
                type: 'test4'
            };

            const event5 = {
                commit: {
                    author: {
                        name: 'test',
                        email: 'test@test.com',
                        username: 'testtest'
                    },
                    message: 'testmsg',
                },
                type: 'test5'
            };

            const event6 = {
                commit: {
                    author: {
                        name: 'test',
                        email: 'test@test.com',
                        username: 'testtest'
                    },
                    message: 'testmsg',
                },
                type: 'test6'
            };

            expect(dictionary.get(event1)).to.equal('test');
            expect(dictionary.get(event2)).to.equal('test test test');
            expect(dictionary.get(event3)).to.equal('test test@test.com testtest');
            expect(dictionary.get(event4)).to.equal('test test@test.com testtest testmsg');
            expect(dictionary.get(event5)).to.equal('testtest@test.comtesttesttestmsg');
            expect(dictionary.get(event6)).to.equal('%anaetest');
        });
    });
});
