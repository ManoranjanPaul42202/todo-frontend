import { useState } from "react";

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.title);

  const handleEdit = async () => {
    if (!editVal.trim() || editVal.trim() === todo.title) {
      setEditing(false);
      setEditVal(todo.title);
      return;
    }
    await onEdit(todo.id, editVal.trim());
    setEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
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

      {editing ? (
        <input
          className="edit-input"
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEdit();
            if (e.key === "Escape") {
              setEditing(false);
              setEditVal(todo.title);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="todo-title"
          onDoubleClick={() => !todo.completed && setEditing(true)}
          title="Double-click to edit"
        >
          {todo.title}
        </span>
      )}

      <div className="actions">
        {!todo.completed && (
          <button className="action-btn" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        <button
          className="action-btn delete"
          onClick={() => onDelete(todo.id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}