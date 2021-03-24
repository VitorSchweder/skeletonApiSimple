const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate()
    });

    it('should authenticated with valid credentials', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123456'
            })

        return expect(response.status).toBe(200);
    });

    it('should not authenticated with invalid password', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '1234567'
            })

        return expect(response.status).toBe(401);
    });

    it('should not authenticated with invalid email', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: 'maria@test.com',
                password: '123456'
            })

        return expect(response.status).toBe(401);
    });

    it('should return jwt token when authenticated', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123456'
            })

        return expect(response.body).toHaveProperty('token');
    });

    it('should be able to access private routes with token', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.generateToken()}`)

        return expect(response.status).toBe(200);
    });

    it('should not be able to access private routes with wrong token', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', 'Bearer 123')

        return expect(response.status).toBe(401);
    });

    it('should not be able to access private routes without token', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });

        const response = await request(app)
            .get('/dashboard')

        return expect(response.status).toBe(401);
    });
});