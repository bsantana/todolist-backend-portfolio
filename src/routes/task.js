const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task/index');

const validate = require('./../utils/schemaValidator'); // TODO: aqui é um middleware

const Joi = require('joi');

const tasksSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

router.get('/', taskController.list);
router.post('/', validate(tasksSchema), taskController.create);
router.get('/:taskId', taskController.get);
router.put('/:taskId', taskController.edit);
router.delete('/:taskId', taskController.delete);
router.get('/:taskId/duplicate', taskController.duplicate);

module.exports = router;