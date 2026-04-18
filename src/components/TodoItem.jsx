import { useState } from "react";

const PRIORITY_COLORS = {
  high: "#ff4d4d",
  medium: "#f5c542",
  low: "#4dcc80",
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleEdit = async () => {
    const changed =
      editVal.trim() !== todo.title || editPriority !== todo.priority;
    if (!editVal.trim() || !changed) {
      setEditing(false);
      setEditVal(todo.title);
      setEditPriority(todo.priority);
      return;
    }
    await onEdit(todo.id, { title: editVal.trim(), priority: editPriority });
    setEditing(false);
  };

  return (
    <div
      className={`todo-item ${todo.completed ? "completed" : ""}`}
      style={{ "--pcolor": PRIORITY_COLORS[todo.priority] }}
    >
      <div className="priority-stripe" />

      <div
        className={`checkbox ${todo.completed ? "checked" : ""}`}
        onClick={() => onToggle(todo.id, !todo.completed)}
      >
        {todo.completed && (
          <svg viewBox="0 0 12 12">
            <polyline points="1.5,6 4.5,9 10.5,3" />
          </svg>
        )}
      </div>

      <div className="todo-content">
        {editing ? (
          <>
            <input
              className="edit-input"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEdit();
                if (e.key === "Escape") {
                  setEditing(false);
                  setEditVal(todo.title);
                  setEditPriority(todo.priority);
                }
              }}
              autoFocus
            />
            <div className="edit-priority-row">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`priority-opt ${editPriority === p ? "selected" : ""} prio-${p}`}
                  onClick={() => setEditPriority(p)}
                >
                  {p}
                </button>
              ))}
              <button className="save-btn" onClick={handleEdit}>Save</button>
            </div>
          </>
        ) : (
          <span
            className="todo-title"
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="actions">
        {!todo.completed && !editing && (
          <button className="action-btn" onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="action-btn delete" onClick={() => onDelete(todo.id)}>✕</button>
      </div>
    </div>
  );
}