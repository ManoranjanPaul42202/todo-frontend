const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const toLocalDate = (d) => {
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().split("T")[0];
};

const today = toLocalDate(new Date());

export default function DaySelector({ dates, selectedDate, onSelect }) {
  const addDay = (offset) => {
    const base = new Date(selectedDate + "T00:00:00");
    base.setDate(base.getDate() + offset);
    const nd = toLocalDate(base);
    if (!dates.includes(nd)) {
      // Navigate to adjacent date in list or today
    }
    onSelect(nd);
  };

  const formatHeader = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  };

  const isToday = selectedDate === today;

  return (
    <div className="day-selector">
      <div className="day-nav">
        <button className="nav-btn" onClick={() => addDay(-1)}>‹</button>
        <div className="day-info">
          <span className="day-name">{formatHeader(selectedDate)}</span>
          {isToday && <span className="today-badge">Today</span>}
        </div>
        <button className="nav-btn" onClick={() => addDay(1)}>›</button>
      </div>

      <div className="day-strip">
        {dates.map((d) => {
          const dateObj = new Date(d + "T00:00:00");
          const isSelected = d === selectedDate;
          const isTodayD = d === today;
          return (
            <button
              key={d}
              className={`day-pill ${isSelected ? "selected" : ""} ${isTodayD ? "is-today" : ""}`}
              onClick={() => onSelect(d)}
            >
              <span className="pill-day">{DAYS[dateObj.getDay()]}</span>
              <span className="pill-num">{dateObj.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}