import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import DaySelector from "./components/DaySelector";

const toLocalDate = (d) => {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
};

const today = toLocalDate(new Date());

export default function App() {
  const [todos, setTodos] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    fetchTodos(selectedDate);
  }, [selectedDate]);

  const fetchDates = async () => {
    const res = await axios.get("/api/todos/dates");
    const all = res.data.map((d) => d.split("T")[0]);
    if (!all.includes(today)) all.push(today);
    all.sort();
    setDates(all);
  };

  const fetchTodos = async (date) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/todos", { params: { date } });
      setTodos(res.data);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title, priority, due_date) => {
    const res = await axios.post("/api/todos", { title, priority, due_date });
    if (due_date === selectedDate) {
      setTodos((prev) => [res.data, ...prev]);
    }
    await fetchDates();
  };

  const toggleTodo = async (id, completed) => {
    const res = await axios.put(`/api/todos/${id}`, { completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await fetchDates();
  };

  const editTodo = async (id, fields) => {
    const res = await axios.put(`/api/todos/${id}`, fields);
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    await fetchDates();
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

  const priorityGroups =
    filter === "all"
      ? [
          { label: "🔴 High", key: "high", items: filtered.filter((t) => t.priority === "high") },
          { label: "🟡 Medium", key: "medium", items: filtered.filter((t) => t.priority === "medium") },
          { label: "🟢 Low", key: "low", items: filtered.filter((t) => t.priority === "low") },
        ]
      : [{ label: null, key: "all", items: filtered }];

  return (
    <div className="app">
      <div className="noise" />
      <header>
        <div className="header-accent">✦</div>
        <h1>TODOS</h1>
        <p className="subtitle">Plan your days, own your tasks</p>
      </header>

      <main>
        <TodoForm onAdd={addTodo} selectedDate={selectedDate} />

        <DaySelector
          dates={dates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

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
              {filter === "done" ? "Nothing completed yet." : "No tasks here. Add one!"}
            </div>
          ) : (
            priorityGroups.map((group) =>
              group.items.length === 0 ? null : (
                <div key={group.key} className="priority-group">
                  {group.label && (
                    <div className="priority-label">{group.label}</div>
                  )}
                  {group.items.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                    />
                  ))}
                </div>
              )
            )
          )}
        </div>
      </main>
    </div>
  );
}