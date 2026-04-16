import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todos");
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title) => {
    const res = await axios.post("/api/todos", { title });
    setTodos((prev) => [res.data, ...prev]);
  };

  const toggleTodo = async (id, completed) => {
    const res = await axios.put(`/api/todos/${id}`, { completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = async (id, title) => {
    const res = await axios.put(`/api/todos/${id}`, { title });
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    done: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="app">
      <div className="noise" />
      <header>
        <div className="header-accent">✦</div>
        <h1>TODOS</h1>
        <p className="subtitle">Stay on top of everything</p>
      </header>

      <main>
        <TodoForm onAdd={addTodo} />

        <div className="filter-bar">
          {["all", "active", "done"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="count">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="todo-list">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              {filter === "done"
                ? "Nothing completed yet."
                : "No tasks here. Add one!"}
            </div>
          ) : (
            filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}