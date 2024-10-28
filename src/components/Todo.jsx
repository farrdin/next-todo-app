"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Todo() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const userEmail = session?.user?.email;

  const fetchTodos = async () => {
    if (!userEmail) return;
    try {
      const response = await axios.get("/api/todos", {
        headers: { email: userEmail },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  });

  const addTodo = async () => {
    if (!userEmail) return;
    if (newTodo.trim() !== "") {
      try {
        const response = await axios.post("/api/todos", {
          text: newTodo,
          email: userEmail,
        });
        setTodos([...todos, response.data.todo]);
        setNewTodo("");
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    }
  };

  const updateTodo = async (id) => {
    if (editText.trim() !== "") {
      try {
        await axios.put("/api/todos", { id, text: editText });
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, text: editText } : todo
          )
        );
        setEditId(null);
        setEditText("");
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete("/api/todos", { data: { id } });
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-bold text-center text-gray-800">
          Please log in to manage your To-Do list.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Todo List
        </h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-r-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul>
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-2 mb-2 border rounded-md"
            >
              {editId === todo._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-2 py-1 mr-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              ) : (
                <span className="text-gray-800">{todo.text}</span>
              )}
              <div className="flex space-x-2">
                {editId === todo._id ? (
                  <button
                    onClick={() => updateTodo(todo._id)}
                    className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(todo._id);
                      setEditText(todo.text);
                    }}
                    className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
