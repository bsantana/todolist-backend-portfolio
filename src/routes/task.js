const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task/index');

const validate = require('./../utils/schemaValidator'); // TODO: aqui é um middleware

const Joi = require('joi');

const tasksSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

router.get('/', taskController.list);
router.post('/', validate(tasksSchema), taskController.create);
router.get('/:taskId', taskController.get);
router.put('/:taskId', taskController.edit);
router.delete('/:taskId', taskController.delete);

module.exports = router;