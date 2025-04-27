const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task/index');

router.get('/', taskController.list);
router.post('/', taskController.create);
router.get('/:taskId', taskController.get);
router.put('/:taskId', taskController.edit);
router.delete('/:taskId', taskController.delete);

module.exports = router;