import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTodos = async () => {
    const response = await axios.get("/api/todos");
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    const response = await axios.patch(`/api/todos/${id}`, {
      completed: !todo.completed,
    });
    setTodos(todos.map((t) => (t._id === id ? response.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const saveEdit = async (id) => {
    const response = await axios.patch(`/api/todos/${id}`, {
      text: editedText,
    });
    setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    setEditingTodo(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200"
    >
      {/* HEADER */}
      <header className="bg-white/70 backdrop-blur-md shadow-md py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
          <IoClipboardOutline className="text-indigo-600 text-3xl" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Task Manager
          </h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-lg p-8">

          {/* FORM */}
          <form
            onSubmit={addTodo}
            className="flex gap-3 border border-gray-200 p-2 rounded-xl"
          >
            <input
              className="flex-1 outline-none px-3 py-2"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg"
            >
              Add
            </motion.button>
          </form>

          {/* TODO LIST */}
          <div className="mt-6 space-y-4">
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.div
                  key={todo._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleTodo(todo._id)}
                      className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                        todo.completed
                          ? "bg-green-500 text-white border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {todo.completed && <MdOutlineDone />}
                    </motion.button>

                    {editingTodo === todo._id ? (
                      <input
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="border px-2 py-1 rounded-md"
                      />
                    ) : (
                      <span
                        className={`${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingTodo === todo._id ? (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => saveEdit(todo._id)}
                          className="text-green-500"
                        >
                          <MdOutlineDone size={20} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => setEditingTodo(null)}
                          className="text-gray-500"
                        >
                          <IoClose size={20} />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => {
                            setEditingTodo(todo._id);
                            setEditedText(todo.text);
                          }}
                          className="text-blue-500"
                        >
                          <MdModeEditOutline size={20} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => deleteTodo(todo._id)}
                          className="text-red-500"
                        >
                          <FaTrash size={18} />
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/70 backdrop-blur-md text-center py-3 text-gray-600 text-sm">
        © {new Date().getFullYear()} Task Manager | @copyright
      </footer>
    </motion.div>
  );
}

export default App;
