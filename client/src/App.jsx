import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';

import { TodoSchema, withValidation } from './validation';

const API_BASE = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTodos();
  }, [currentPage]);

  const fetchTodos = async () => {
    try {
      const url = `${API_BASE}?page=${currentPage}&pageSize=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setTodos(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };

  const validatedSubmit = withValidation(TodoSchema, async ({ title, description, isCompleted }) => {
    const url = editMode ? `${API_BASE}/${editId}` : API_BASE;
    try {
      const res = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMode ? { id: editId, title, description, isCompleted } : { title, description, isCompleted }),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert('Server error: ' + errText);
        return;
      }
      await fetchTodos();
      setTitle('');
      setDescription('');
      setIsCompleted(false);
      setEditMode(false);
      setEditId(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error(res.statusText);
      const todo = await res.json();
      setTitle(todo.title);
      setDescription(todo.description);
      setIsCompleted(todo.isCompleted);
      setEditMode(true);
      setEditId(id);
    } catch (error) {
      console.error('Error fetching todo to edit:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTodos();
      else console.error('Delete failed:', res.statusText);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-5 text-center">Todo List</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          validatedSubmit({ title, description, isCompleted });
        }}
        className="bg-gray-800 p-5 rounded-lg shadow mb-5"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-700 rounded bg-gray-700 text-gray-100"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-700 rounded bg-gray-700 text-gray-100"
        />

        <label className="block mb-3">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={e => setIsCompleted(e.target.checked)}
            className="mr-2"
          />
          Completed
        </label>

        <button
          type="submit"
          className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editMode ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>

      <ul className="list-none p-0">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="bg-gray-800 p-4 mb-3 rounded-lg shadow flex justify-between items-center"
          >
            <div className="flex-grow">
              <h3 className="font-bold text-lg">
                {todo.title} {todo.isCompleted && <span>(✔️)</span>}
              </h3>
              <p className="text-gray-400">{todo.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(todo.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
