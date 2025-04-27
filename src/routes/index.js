const taskRouter = require('./task');

module.exports = (app) => {
	app.use('/task', taskRouter);
}