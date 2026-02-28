const todo = require('../model/Todo');

exports.getTodos = async (req, res) => {
  try {
    const todos = await todo.find({});
    res.status(200).json({
      success: true,
      data: todos,
      message: 'Todos fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: 'internal server error',
      message: err.message,
    });
  }
};

exports.getTodosById = async (req, res) => {
  try {
    const id  = req.params.id
    const todos = await todo.findById({_id: id});

if (!todos) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todos,
      message: 'Todo fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: 'internal server error',
      message: err.message,
    });
  }
};