const app = require('../app');
const request = require('supertest')(app.listen());

describe('webhooks', () => {
    describe('POST /webhooks/push', () => {
        it('should return 200 status code', done => {
            request
                .post('/webhooks/push', {
                    'commits': [
                        {
                            'id': '0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c',
                            'message': 'Update README.md',
                            'timestamp': '2015-05-05T19:40:15-04:00',
                            'author': {
                                'name': 'baxterthehacker',
                                'email': 'baxterthehacker@users.noreply.github.com',
                                'username': 'baxterthehacker'
                            },
                            'committer': {
                                'name': 'baxterthehacker',
                                'email': 'baxterthehacker@users.noreply.github.com',
                                'username': 'baxterthehacker'
                            },
                            'added': [

                            ],
                            'removed': [

                            ],
                            'modified': [
                                'README.md'
                            ]
                        }
                    ],
                    'pusher': {
                        'name': 'baxterthehacker',
                        'email': 'baxterthehacker@users.noreply.github.com'
                    }
                })
                .expect(200, done);
        });

        xit('should return a JSON with a list of available webhooks', done => {
            request
            .get('/webhooks')
            .expect('Content-Type', /json/)
            .expect(200, webhooks, done);
        });
    });
});
