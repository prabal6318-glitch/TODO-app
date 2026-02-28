const express = require('express');
const router = express.Router();

const { updateTodo } = require('../controllers/updateTodo');
const createTodo = require('../controllers/createTodo');
const deleteTodo = require('../controllers/deleteTodo');
const {getTodos, getTodosById} = require('../controllers/getTodo');

// Route to get all todos
router.post('/createTodo', createTodo);
router.get('/todos', getTodos);
router.get('/todos/:id', getTodosById);
// //router.get("/contact", (req, res) => {
//     res.send("Contact ")
// }
router.put('/updateTodo/:id', updateTodo);
router.delete('/deleteTodo/:id', deleteTodo);

module.exports = router;
