const Todo = require('../model/Todo');

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params
    await Todo.findByIdAndDelete(id)

    res.json ({
      success: true,
      message: 'Entry Deleted Successfully',
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      data: 'internal server error',
      message: err.message,
    })
  }
}

module.exports = deleteTodo;