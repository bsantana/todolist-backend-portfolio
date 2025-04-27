const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./src/routes/index');
const notFound = require('./src/middlewares/notFound');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(helmet());

routes(app);

app.get('/', async (req, res) => {
	try {
		res.send('Hello World! api-todolist')
	} catch (err) {
		console.log(err);
	}
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
})