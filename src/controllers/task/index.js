const pool = require('./../../utils/mysql');

module.exports.list = async (req, res) => {
	const [tasks] = await pool.query('SELECT * FROM tasks WHERE deleted_at is NULL');
	res.json({ data: tasks });
}

module.exports.create = async (req, res) => {
	const { title, description } = req.body;
	const [task] = await pool.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description]);
	res.json({ id: task.insertId, message: 'Task criada com sucesso.' });
}

module.exports.get = async (req, res) => {
	const taskId = req.params.taskId;
	const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
	res.json({ data: tasks[0] });
}

module.exports.edit = async (req, res) => {
	const taskId = req.params.taskId;
	const body = req.body;
	const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

	if(tasks.length === 0) {
		res.status(404);
		return res.json({ message: "Recurso não encontrado."});
	}

	await pool.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [body.title || tasks[0].title, body.description || tasks[0].description, body.status || tasks[0].status, taskId]);

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