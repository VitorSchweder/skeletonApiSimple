const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');
const bcrypt = require('bcryptjs');

describe('User', () =>  {
    beforeEach(async () => {
        await truncate()
    });

    it('should create user and validate hash', async () => {
        const user = await User.create({
            name: 'João',
            email: 'joao@test.com',
            password: '123456'
        });
    
        return expect(await bcrypt.compare('123456', user.password_hash)).toBe(true);
    });
});