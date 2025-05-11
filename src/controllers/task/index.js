const pool = require('./../../utils/mysql');
const Task = require('./../../models/task');

module.exports.list = async (req, res) => {
	const tasks = await Task.findAll({
		order: [
			['order', 'ASC']
		]
	});
	res.json({ data: tasks });
}

module.exports.create = async (req, res) => {
	const { title, description } = req.body;
	const now = new Date();
  const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
	const [task] = await pool.query('INSERT INTO tasks (title, description, created_at) VALUES (?, ?, ?)', [title, description, mysqlDatetime]);
	res.json({ id: task.insertId, message: 'Task criada com sucesso.' });
}

module.exports.get = async (req, res) => {
	const taskId = req.params.taskId;
	const [task] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

	if(task.length === 0) {
		res.status(404);
		return res.json({ message: "Recurso não encontrado."});
	}

	res.json({ data: task[0] });
}

module.exports.edit = async (req, res) => {
	const taskId = req.params.taskId;
	const body = req.body;
	const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

	if(tasks.length === 0) {
		res.status(404);
		return res.json({ message: "Recurso não encontrado."});
	}

	const now = new Date();
  const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');

	await pool.query('UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = ? WHERE id = ?', [body.title || tasks[0].title, body.description || tasks[0].description, body.status || tasks[0].status, mysqlDatetime, taskId]);

	res.json({ message: "Task atualizada com sucesso." });
}

module.exports.delete = async (req, res) => {
	const taskId = req.params.taskId;
	const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ? AND deleted_at is NULL', [taskId]);

	if(tasks.length === 0) {
		res.status(404);
		return res.json({ message: "Recurso não encontrado."});
	}

	const now = new Date();
  const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');

	await pool.query('UPDATE tasks SET deleted_at = ? WHERE id = ?', [mysqlDatetime, taskId]);

	res.json({ message: "Task removida com sucesso." });
}

module.exports.duplicate = async (req, res) => {
	console.time("ok")
	const taskId = req.params.taskId;
	const [task] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

	if(task.length === 0) {
		res.status(404);
		return res.json({ message: "Recurso não encontrado."});
	}
	console.timeLog("ok")
	const [tasks] = await pool.query('SELECT * FROM tasks WHERE deleted_at is NULL ORDER BY `order`');
	console.timeLog("ok")
	const newTask = {
		title: task[0].title,
		description: task[0].description
	}

	const indexTask = tasks.findIndex(item => item.id === Number(taskId));
	// console.log("tasks", tasks)
	// console.log('taskId', taskId)
	// console.log("indexTask", indexTask)

	tasks.splice(indexTask + 1, 0, newTask);
	console.timeLog("ok")

	for (let index = 0; index < tasks.length; index++) {
		console.log('index', index)
		const item = tasks[index];
		if(item.id) {
			await pool.query('UPDATE tasks SET `order` = ? WHERE id = ?', [index, item.id]);
		} else {
			const now = new Date();
			const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
			const [task] = await pool.query('INSERT INTO tasks (title, description, `order`, created_at) VALUES (?, ?, ?, ?)', [item.title, item.description, index, mysqlDatetime]);
		}
	}
	console.timeEnd("ok")
	res.json({ data: task[0] });
}