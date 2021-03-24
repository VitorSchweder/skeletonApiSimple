const routes = require('express').Router();
const SessionController = require('./app/controllers/SessionController');
const authMiddleware = require('./app/middlewares/auth');

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/dashboard', (req, res) => {
    res.sendStatus(200);
});

module.exports = routes;