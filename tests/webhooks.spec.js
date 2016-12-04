const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app.listen());

describe('webhooks', () => {
    describe('POST /webhooks/push', () => {
        const payload = {
            commits: [{
                id: '0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c',
                message: 'Update README.md',
                timestamp: '2015-05-05T19:40:15-04:00',
                author: {
                    name: 'baxterthehacker',
                    email: 'baxterthehacker@users.noreply.github.com',
                    username: 'baxterthehacker'
                },
                committer: {
                    name: 'baxterthehacker',
                    email: 'baxterthehacker@users.noreply.github.com',
                    username: 'baxterthehacker'
                },
                added: [],
                removed: [],
                modified: [
                    'README.md'
                ]
            }, {
                id: '0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c',
                message: 'Update README.md',
                timestamp: '2015-05-05T19:40:15-04:00',
                author: {
                    name: 'baxterthehacker',
                    email: 'baxterthehacker@users.noreply.github.com',
                    username: 'baxterthehacker'
                },
                committer: {
                    name: 'baxterthehacker',
                    email: 'baxterthehacker@users.noreply.github.com',
                    username: 'baxterthehacker'
                },
                added: [],
                removed: [],
                modified: [
                    'README.md'
                ]
            }],
            pusher: {
                name: 'baxterthehacker',
                email: 'baxterthehacker@users.noreply.github.com'
            }
        };

        it('should return 200 status code status message in JSON format on correct payload', done => {
            request
                .post('/webhooks/push')
                .send(payload)
                .expect('Content-Type', /json/)
                .expect(200, { status: 'OK' }, done);
        });

        it('should return 400 status code and a status message in JSON format on incorrect payload', done => {
            request
                .post('/webhooks/push')
                .send({ foo: 'bar' })
                .expect(400, { status: 'ERROR', message: 'Webhook payload is empty' }, done);
        });

        it('should return 400 status code and a status message in JSON format on empty payload', done => {
            request
                .post('/webhooks/push')
                .expect(400, { status: 'ERROR', message: 'Webhook payload is empty' }, done);
        });

        it('should call streaker.addContribution() for each commit', done => {
            const streaker = require('../app/streaker.js');
            const stub = sinon.stub(streaker, 'addContribution');

            request
                .post('/webhooks/push')
                .send(payload)
                .expect(200, (req, res) => {
                    expect(stub.callCount).to.equal(2);
                    done();
                });
        });
    });
});
