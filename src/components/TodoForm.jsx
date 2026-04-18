import { useState } from "react";

const toLocalDate = (d) => {
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().split("T")[0];
};

export default function TodoForm({ onAdd, selectedDate }) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due_date, setDueDate] = useState(selectedDate || toLocalDate(new Date()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    await onAdd(value.trim(), priority, due_date);
    setValue("");
    setPriority("medium");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Add a new task..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button type="submit">+</button>
      </div>
      <div className="form-meta">
        <div className="priority-select">
          {["low", "medium", "high"].map((p) => (
            <button
              key={p}
              type="button"
              className={`priority-opt ${priority === p ? "selected" : ""} prio-${p}`}
              onClick={() => setPriority(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <input
          type="date"
          className="date-input"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </form>
  );
}