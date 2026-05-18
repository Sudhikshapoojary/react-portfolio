import { useState, useEffect } from "react";

const tokens = {
  bg: "#FDF6FF",
  surface: "#FFFFFF",
  surfaceHover: "#F8F0FF",
  border: "rgba(180,130,220,0.15)",
  borderHover: "rgba(180,130,220,0.35)",
  accent: "#C084FC",
  accentLight: "#E9D5FF",
  accentGlow: "rgba(192,132,252,0.18)",
  accentDark: "#9333EA",
  text: "#2D1B4E",
  textMuted: "#7C5FA0",
  textFaint: "#C4ADDB",
  green: "#34D399",
  greenPastel: "#A7F3D0",
  amber: "#FCD34D",
  amberPastel: "#FEF3C7",
  coral: "#F9A8D4",
  coralDark: "#EC4899",
  sky: "#BAE6FD",
  skyDark: "#0EA5E9",
  mint: "#6EE7B7",
  lavender: "#DDD6FE",
  peach: "#FECACA",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'DM Sans', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,900;1,600&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${tokens.bg};
    color: ${tokens.text};
    font-family: ${tokens.fontBody};
    font-size: 16px;
    line-height: 1.7;
    overflow-x: hidden;
  }
  ::selection { background: ${tokens.accent}; color: #fff; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${tokens.accentLight}; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, ${tokens.accent}, ${tokens.coral}); border-radius: 4px; }
  a { color: inherit; text-decoration: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  @keyframes floatBlob {
    0%,100% { transform: translateY(0px) scale(1); }
    33% { transform: translateY(-18px) scale(1.04); }
    66% { transform: translateY(10px) scale(0.97); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes popIn {
    0% { opacity:0; transform: scale(0.85) translateY(10px); }
    100% { opacity:1; transform: scale(1) translateY(0); }
  }
  @keyframes gradientBg {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes wiggle {
    0%,100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  .animate-fade-up { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-fade-in { animation: fadeIn 0.5s ease both; }

  /* MUI-style ripple */
  .mui-btn {
    position: relative; overflow: hidden;
  }
  .mui-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.3);
    border-radius: inherit;
    transform: scale(0); opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
  }
  .mui-btn:active::after {
    transform: scale(2); opacity: 1; transition: 0s;
  }
`;

// ─────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────

function Button({ variant = "primary", size = "md", onClick, children, disabled = false, style = {} }) {
  const [hovered, setHovered] = useState(false);

  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: tokens.fontBody, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", borderRadius: 50, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    outline: "none", opacity: disabled ? 0.5 : 1, letterSpacing: "0.02em",
  };

  const sizes = {
    sm: { padding: "6px 18px", fontSize: 13 },
    md: { padding: "10px 26px", fontSize: 14 },
    lg: { padding: "14px 36px", fontSize: 16 },
  };

  const variants = {
    primary: {
      background: hovered
        ? `linear-gradient(135deg, #A855F7, #EC4899)`
        : `linear-gradient(135deg, ${tokens.accent}, #F472B6)`,
      color: "#fff",
      boxShadow: hovered
        ? `0 8px 30px rgba(192,132,252,0.45), 0 2px 8px rgba(236,72,153,0.2)`
        : `0 4px 14px rgba(192,132,252,0.3)`,
      transform: hovered ? "translateY(-2px)" : "none",
    },
    outline: {
      background: hovered ? tokens.accentGlow : "transparent",
      color: hovered ? tokens.accentDark : tokens.textMuted,
      border: `1.5px solid ${hovered ? tokens.accent : tokens.border}`,
      boxShadow: hovered ? `0 4px 14px ${tokens.accentGlow}` : "none",
    },
    ghost: {
      background: hovered ? tokens.surfaceHover : "transparent",
      color: hovered ? tokens.accentDark : tokens.textMuted,
    },
    danger: {
      background: hovered ? tokens.coralDark : tokens.peach,
      color: hovered ? "#fff" : tokens.coralDark,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mui-btn"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

function ProfileCard({ name, role, bio, avatar, tags = [], available = true }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #FFFFFF, #FAF5FF)",
      border: `1.5px solid ${tokens.border}`,
      borderRadius: 24, padding: "2rem", maxWidth: 420,
      boxShadow: "0 8px 40px rgba(192,132,252,0.12), 0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: `linear-gradient(135deg, ${tokens.accent}, #F472B6, #60A5FA)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 700, color: "#fff", flexShrink: 0,
          fontFamily: tokens.fontDisplay,
          boxShadow: `0 4px 20px rgba(192,132,252,0.4)`,
          animation: "wiggle 4s ease-in-out infinite",
        }}>
          {avatar || name.charAt(0)}
        </div>
        <div>
          <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: 20, fontWeight: 600, color: tokens.text }}>{name}</h3>
          <p style={{ color: tokens.accent, fontSize: 13, fontWeight: 500 }}>{role}</p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, padding: "3px 10px", borderRadius: 99, marginTop: 6,
            background: available ? "rgba(52,211,153,0.12)" : "rgba(249,168,212,0.2)",
            color: available ? "#059669" : tokens.coralDark,
            border: `1px solid ${available ? "rgba(52,211,153,0.3)" : "rgba(249,168,212,0.4)"}`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", animation: available ? "pulse 2s infinite" : "none" }} />
            {available ? "Open to opportunities" : "Not available"}
          </span>
        </div>
      </div>
      <p style={{ color: tokens.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{bio}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontSize: 12, padding: "4px 12px", borderRadius: 99,
            background: `linear-gradient(135deg, ${tokens.accentLight}, #FBF0FF)`,
            color: tokens.accentDark,
            border: `1px solid rgba(192,132,252,0.25)`,
            fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: tokens.fontMono, fontSize: 11, fontWeight: 500,
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: tokens.accent, marginBottom: 8,
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      <span style={{ width: 16, height: 1.5, background: `linear-gradient(90deg, ${tokens.accent}, transparent)`, display: "inline-block" }} />
      {children}
    </p>
  );
}

function Card({ children, style = {}, hover = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hover && hovered ? tokens.borderHover : tokens.border}`,
        borderRadius: 20, padding: "1.5rem",
        transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
        transform: hover && hovered ? "translateY(-5px)" : "none",
        boxShadow: hover && hovered
          ? "0 20px 50px rgba(192,132,252,0.18), 0 4px 12px rgba(0,0,0,0.05)"
          : "0 2px 16px rgba(192,132,252,0.07)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({ id, children, style = {} }) {
  return (
    <section id={id} style={{ padding: "80px 0", ...style }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
        {children}
      </div>
    </section>
  );
}

function Header({ activeSection, onNav, darkMode, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const navItems = ["about", "skills", "projects", "counter", "todo", "contact"];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(253,246,255,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1.5px solid ${tokens.border}` : "none",
      transition: "all 0.3s ease", padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: tokens.fontDisplay, fontSize: 22, fontWeight: 900,
          background: `linear-gradient(90deg, ${tokens.accentDark}, #F472B6, ${tokens.accent})`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "gradientBg 4s ease infinite",
        }}>
          Sudhiksha.dev
        </span>

        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => onNav(item)}
              style={{
                padding: "6px 14px", borderRadius: 50, fontSize: 13, fontWeight: 500,
                color: activeSection === item ? tokens.accentDark : tokens.textMuted,
                background: activeSection === item
                  ? `linear-gradient(135deg, ${tokens.accentLight}, #FCE7F3)`
                  : "transparent",
                transition: "all 0.2s", textTransform: "capitalize",
                boxShadow: activeSection === item ? `0 2px 8px rgba(192,132,252,0.2)` : "none",
              }}
            >
              {item}
            </a>
          ))}
          <Button variant="outline" size="sm" onClick={toggleDark} style={{ marginLeft: 8 }}>
            {darkMode ? "☀" : "◑"}
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: `1.5px solid ${tokens.border}`,
      padding: "2rem", textAlign: "center",
      color: tokens.textFaint, fontSize: 13,
      fontFamily: tokens.fontMono,
      background: "linear-gradient(180deg, transparent, rgba(221,214,254,0.1))",
    }}>
      <p>© 2026 Sudhiksha Poojary — Built with React · Sessions 2, 3 & 4 ✨</p>
    </footer>
  );
}

// ─────────────────────────────────────────────
// COUNTER APP
// ─────────────────────────────────────────────
function CounterApp() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);

  const handleChange = (delta) => {
    const next = count + delta;
    setCount(next);
    setHistory(h => [...h.slice(-9), { val: next, delta }]);
  };
  const reset = () => { setCount(0); setHistory([]); };

  const color = count > 0 ? "#059669" : count < 0 ? tokens.coralDark : tokens.textMuted;

  return (
    <Card style={{ maxWidth: 480 }}>
      <SectionLabel>Session 3 — useState + events</SectionLabel>
      <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 20, color: tokens.text }}>Counter Application</h3>

      <div style={{
        textAlign: "center", padding: "2rem 0",
        fontFamily: tokens.fontMono, fontSize: 72, fontWeight: 500, color,
        transition: "color 0.3s",
        textShadow: `0 4px 20px ${color}40`,
      }}>
        {count > 0 ? "+" : ""}{count}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: tokens.textMuted, display: "block", marginBottom: 8 }}>
          Step size: <strong style={{ color: tokens.accentDark }}>{step}</strong>
        </label>
        <input
          type="range" min="1" max="10" value={step}
          onChange={e => setStep(Number(e.target.value))}
          style={{ width: "100%", accentColor: tokens.accent }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        <Button variant="outline" onClick={() => handleChange(-step)}>− {step}</Button>
        <Button variant="ghost" onClick={reset}>Reset</Button>
        <Button variant="primary" onClick={() => handleChange(step)}>+ {step}</Button>
      </div>

      {history.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {history.map((h, i) => (
            <span key={i} style={{
              fontFamily: tokens.fontMono, fontSize: 11,
              padding: "2px 8px", borderRadius: 8,
              background: h.delta > 0 ? "rgba(167,243,208,0.4)" : "rgba(249,168,212,0.3)",
              color: h.delta > 0 ? "#059669" : tokens.coralDark,
              border: `1px solid ${h.delta > 0 ? "rgba(52,211,153,0.3)" : "rgba(249,168,212,0.4)"}`,
            }}>
              {h.delta > 0 ? "+" : ""}{h.val}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────
// TODO APP
// ─────────────────────────────────────────────
let nextId = 100;
const INITIAL_TODOS = [
  { id: 1, text: "Learn JSX & components", done: true, tag: "session-2" },
  { id: 2, text: "Build Profile Card with props", done: true, tag: "session-2" },
  { id: 3, text: "Master useState hook", done: false, tag: "session-3" },
  { id: 4, text: "Build counter & todo apps", done: false, tag: "session-3" },
  { id: 5, text: "Style with CSS Modules", done: false, tag: "session-4" },
];

function TodoApp() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [tag, setTag] = useState("personal");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(t => [...t, { id: nextId++, text: input.trim(), done: false, tag }]);
    setInput("");
  };
  const toggle = (id) => setTodos(t => t.map(item => item.id === id ? { ...item, done: !item.done } : item));
  const remove = (id) => setTodos(t => t.filter(item => item.id !== id));

  const visible = todos.filter(t =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );
  const doneCount = todos.filter(t => t.done).length;

  const tagColors = {
    "session-2": { bg: "rgba(221,214,254,0.5)", color: tokens.accentDark },
    "session-3": { bg: "rgba(167,243,208,0.4)", color: "#059669" },
    "session-4": { bg: "rgba(253,211,77,0.3)", color: "#D97706" },
    personal: { bg: "rgba(249,168,212,0.3)", color: tokens.coralDark },
  };

  return (
    <Card style={{ maxWidth: 560 }}>
      <SectionLabel>Session 3 — lists, map(), key prop</SectionLabel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 17, fontWeight: 500, color: tokens.text }}>Todo List</h3>
        <span style={{ fontFamily: tokens.fontMono, fontSize: 12, color: tokens.textMuted }}>
          {doneCount}/{todos.length} done
        </span>
      </div>

      <div style={{ background: tokens.accentLight, borderRadius: 99, height: 5, marginBottom: 20 }}>
        <div style={{
          height: 5, borderRadius: 99, transition: "width 0.4s ease",
          width: `${todos.length ? (doneCount / todos.length) * 100 : 0}%`,
          background: `linear-gradient(90deg, ${tokens.accent}, #F472B6, ${tokens.mint})`,
        }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="Add a task…"
          style={{
            flex: 1, background: tokens.surfaceHover, border: `1.5px solid ${tokens.border}`,
            borderRadius: 50, padding: "9px 18px", color: tokens.text,
            fontFamily: tokens.fontBody, fontSize: 14, outline: "none",
          }}
        />
        <select
          value={tag}
          onChange={e => setTag(e.target.value)}
          style={{
            background: tokens.surfaceHover, border: `1.5px solid ${tokens.border}`,
            borderRadius: 50, padding: "9px 14px", color: tokens.textMuted,
            fontFamily: tokens.fontMono, fontSize: 12, outline: "none",
          }}
        >
          <option value="personal">personal</option>
          <option value="session-2">session-2</option>
          <option value="session-3">session-3</option>
          <option value="session-4">session-4</option>
        </select>
        <Button variant="primary" size="sm" onClick={addTodo}>Add</Button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["all", "pending", "done"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 16px", borderRadius: 99, fontSize: 12, cursor: "pointer",
              border: "none", fontFamily: tokens.fontBody,
              background: filter === f
                ? `linear-gradient(135deg, ${tokens.accent}, #F472B6)`
                : tokens.surfaceHover,
              color: filter === f ? "#fff" : tokens.textMuted,
              transition: "all 0.2s",
              boxShadow: filter === f ? `0 3px 10px rgba(192,132,252,0.3)` : "none",
            }}
          >{f}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {visible.map(todo => (
          <div key={todo.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 12,
            background: todo.done ? "rgba(167,243,208,0.15)" : tokens.surfaceHover,
            border: `1.5px solid ${todo.done ? "rgba(52,211,153,0.25)" : tokens.border}`,
            transition: "all 0.2s",
          }}>
            <input
              type="checkbox" checked={todo.done}
              onChange={() => toggle(todo.id)}
              style={{ accentColor: tokens.accent, width: 15, height: 15, cursor: "pointer" }}
            />
            <span style={{
              flex: 1, fontSize: 14, color: todo.done ? tokens.textFaint : tokens.text,
              textDecoration: todo.done ? "line-through" : "none", transition: "all 0.2s",
            }}>{todo.text}</span>
            {todo.tag && tagColors[todo.tag] && (
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 99, fontFamily: tokens.fontMono,
                ...tagColors[todo.tag],
              }}>{todo.tag}</span>
            )}
            <button onClick={() => remove(todo.id)} style={{
              background: "none", border: "none", color: tokens.textFaint,
              cursor: "pointer", fontSize: 14, padding: 2, lineHeight: 1,
              transition: "color 0.15s",
            }}
              onMouseEnter={e => e.target.style.color = tokens.coralDark}
              onMouseLeave={e => e.target.style.color = tokens.textFaint}
            >✕</button>
          </div>
        ))}
        {visible.length === 0 && (
          <p style={{ textAlign: "center", color: tokens.textFaint, fontSize: 13, padding: "1rem 0" }}>
            No tasks here ✦
          </p>
        )}
      </div>
    </Card>
  );
}

function ThemeToggle({ darkMode, toggle }) {
  return (
    <div
      onClick={toggle}
      style={{
        width: 54, height: 28, borderRadius: 99,
        background: darkMode
          ? `linear-gradient(135deg, ${tokens.accent}, #F472B6)`
          : tokens.textFaint,
        position: "relative", cursor: "pointer",
        transition: "background 0.35s",
        flexShrink: 0,
        boxShadow: darkMode ? `0 2px 12px rgba(192,132,252,0.4)` : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 4, left: darkMode ? 30 : 4,
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff", transition: "left 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }}>
        {darkMode ? "◑" : "☀"}
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(45,27,78,0.4)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #FFFFFF, #FAF5FF)",
          border: `1.5px solid ${tokens.border}`,
          borderRadius: 24, padding: "2rem", maxWidth: 480, width: "100%",
          animation: "popIn 0.3s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 24px 80px rgba(192,132,252,0.25), 0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: 20, color: tokens.text }}>{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        {children}
      </div>
    </div>
  );
}


const PROJECTS = [
  {
    id: 1,
    title: "Hospital Management System",
    desc: "Full-stack web application for managing patient records, appointments, doctor schedules, and billing — designed for seamless hospital operations.",
    tags: ["Java", "MySQL", "JSP", "Bootstrap"],
    year: "2024",
    status: "live",
    color: "#C084FC",
  },
  {
    id: 2,
    title: "Fish Species Identification",
    desc: "Machine learning model that identifies freshwater and marine fish species from images using CNN architecture, achieving 94% classification accuracy.",
    tags: ["Python", "TensorFlow", "OpenCV", "Flask"],
    year: "2025",
    status: "live",
    color: "#34D399",
  },
  {
    id: 3,
    title: "React Portfolio",
    desc: "This interactive developer portfolio built with React — showcasing components, state management, event handling, and custom pastel UI system.",
    tags: ["React", "CSS-in-JS", "JSX", "Hooks"],
    year: "2025",
    status: "wip",
    color: "#F472B6",
  },
];

const SKILLS = [
  { name: "Python", level: 85 },
  { name: "Java", level: 80 },
  { name: "React / JavaScript", level: 75 },
  { name: "Machine Learning", level: 70 },
  { name: "MySQL / Databases", level: 78 },
  { name: "Data Structures & Algorithms", level: 82 },
];

function ProjectCard({ title, desc, tags, year, status, color }) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    live: { label: "Completed", color: "#059669", bg: "rgba(167,243,208,0.3)" },
    wip: { label: "In progress", color: "#D97706", bg: "rgba(253,211,77,0.25)" },
  };

  return (
    <Card hover style={{ cursor: "pointer" }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `linear-gradient(135deg, ${color}25, ${color}45)`,
        border: `1.5px solid ${color}50`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 14,
        boxShadow: `0 4px 14px ${color}25`,
      }}>◈</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: 18, fontWeight: 600, color: tokens.text }}>{title}</h3>
        <span style={{
          fontSize: 10, padding: "3px 10px", borderRadius: 99,
          background: statusConfig[status].bg,
          color: statusConfig[status].color,
          fontFamily: tokens.fontMono, flexShrink: 0, marginLeft: 8,
          border: `1px solid ${statusConfig[status].color}30`,
        }}>{statusConfig[status].label}</span>
      </div>

      <p style={{ color: tokens.textMuted, fontSize: 14, marginTop: 8, marginBottom: 16, lineHeight: 1.65 }}>{desc}</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {tags.map(t => (
          <span key={t} style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 99,
            background: tokens.surfaceHover, color: tokens.textMuted,
            border: `1px solid ${tokens.border}`,
            fontFamily: tokens.fontMono,
          }}>{t}</span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: tokens.textFaint, fontFamily: tokens.fontMono, fontSize: 12 }}>{year}</span>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>View →</Button>
      </div>
    </Card>
  );
}

function SkillBar({ name, level }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  const barColors = [
    `linear-gradient(90deg, ${tokens.accent}, #F472B6)`,
    `linear-gradient(90deg, #60A5FA, ${tokens.accent})`,
    `linear-gradient(90deg, ${tokens.mint}, #60A5FA)`,
    `linear-gradient(90deg, #FCD34D, #F472B6)`,
    `linear-gradient(90deg, ${tokens.accent}, ${tokens.mint})`,
    `linear-gradient(90deg, #F472B6, #FCD34D)`,
  ];
  const idx = SKILLS.findIndex(s => s.name === name) % barColors.length;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: tokens.text, fontWeight: 500 }}>{name}</span>
        <span style={{ fontFamily: tokens.fontMono, fontSize: 12, color: tokens.accentDark }}>{level}%</span>
      </div>
      <div style={{ background: tokens.accentLight, borderRadius: 99, height: 7 }}>
        <div style={{
          height: 7, borderRadius: 99,
          width: animated ? `${level}%` : "0%",
          background: barColors[idx],
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 2px 8px rgba(192,132,252,0.3)`,
        }} />
      </div>
    </div>
  );
}


export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [darkMode, setDarkMode] = useState(true);
  const [contactModal, setContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => { setContactModal(false); setSubmitted(false); setFormData({ name: "", email: "", message: "" }); }, 2000);
  };

  return (
    <>
      <style>{globalStyle}</style>

      {/* Pastel blob backgrounds */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -120, left: "15%", width: 520, height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(221,214,254,0.55) 0%, transparent 70%)",
          animation: "floatBlob 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: 300, right: "-5%", width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,168,212,0.35) 0%, transparent 70%)",
          animation: "floatBlob 11s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", bottom: 100, left: "5%", width: 350, height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,243,208,0.3) 0%, transparent 70%)",
          animation: "floatBlob 9s ease-in-out infinite 2s",
        }} />
        {/* Subtle dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(${tokens.accentLight} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.6,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Header
          activeSection={activeSection}
          onNav={setActiveSection}
          darkMode={darkMode}
          toggleDark={() => setDarkMode(d => !d)}
        />

        
        <Section id="about" style={{ paddingTop: 140 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div className="animate-fade-up">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${tokens.accentLight}, #FCE7F3)`,
                border: `1.5px solid rgba(192,132,252,0.25)`, borderRadius: 99,
                padding: "5px 16px", marginBottom: 20,
              }}>
                <span style={{ fontSize: 14 }}>🎓</span>
                <span style={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.accentDark, letterSpacing: "0.08em" }}>
                  CS Engineering · 3rd Year
                </span>
              </div>

              <h1 style={{
                fontFamily: tokens.fontDisplay, fontWeight: 900, lineHeight: 1.1,
                marginBottom: 20, color: tokens.text,
                fontSize: "clamp(40px, 6vw, 70px)",
              }}>
                Sudhiksha<br />
                <em style={{
                  background: `linear-gradient(135deg, ${tokens.accentDark}, #F472B6)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Poojary</em>
              </h1>
              <p style={{
                fontSize: 17, color: tokens.textMuted, lineHeight: 1.8,
                maxWidth: 440, marginBottom: 32,
              }}>
                CS undergrad passionate about building impactful software — from ML-powered fish classifiers to full-stack hospital systems. Currently exploring React, AI, and everything in between. 🌸
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button variant="primary" size="lg" onClick={() => setContactModal(true)}>
                  Say hello 👋
                </Button>
                <Button variant="outline" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                  View projects
                </Button>
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <ProfileCard
                name="Sudhiksha Poojary"
                role="CS Engineering Student · 3rd Year"
                bio="Curious developer building things with Python, Java & React. Interested in ML, web dev, and creating tech that solves real problems. Always learning!"
                tags={["Python", "Java", "React", "ML", "MySQL"]}
                available={true}
              />
            </div>
          </div>
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" style={{ background: "linear-gradient(180deg, transparent, rgba(221,214,254,0.12), transparent)" }}>
          <SectionLabel>Session 2 — Component composition</SectionLabel>
          <h2 style={{
            fontFamily: tokens.fontDisplay, fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900, marginBottom: 48, color: tokens.text,
          }}>Technical Skills</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <Card>
              <h3 style={{ fontWeight: 500, marginBottom: 20, color: tokens.text }}>Proficiency</h3>
              {SKILLS.map(s => <SkillBar key={s.name} {...s} />)}
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignContent: "start" }}>
              {[
                { label: "Projects", value: "8+", color: tokens.accentDark, bg: tokens.accentLight },
                { label: "Languages", value: "5", color: "#059669", bg: tokens.greenPastel },
                { label: "Semester", value: "6th", color: "#D97706", bg: tokens.amberPastel },
                { label: "CGPA", value: "8.7", color: tokens.coralDark, bg: tokens.peach },
              ].map(item => (
                <div key={item.label} style={{
                  background: `linear-gradient(145deg, #FFFFFF, ${item.bg}40)`,
                  border: `1.5px solid ${item.color}20`,
                  borderRadius: 18, padding: "1.25rem", textAlign: "center",
                  boxShadow: `0 4px 16px ${item.color}15`,
                }}>
                  <p style={{
                    fontFamily: tokens.fontDisplay, fontSize: 38, fontWeight: 900,
                    color: item.color, lineHeight: 1,
                  }}>{item.value}</p>
                  <p style={{ color: tokens.textMuted, fontSize: 12, marginTop: 6 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── PROJECTS ── */}
        <Section id="projects">
          <SectionLabel>Session 2 — Props & data passing</SectionLabel>
          <h2 style={{
            fontFamily: tokens.fontDisplay, fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900, marginBottom: 48, color: tokens.text,
          }}>My Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {PROJECTS.map(project => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </Section>

        {/* ── COUNTER ── */}
        <Section id="counter" style={{ background: "linear-gradient(180deg, transparent, rgba(249,168,212,0.08), transparent)" }}>
          <SectionLabel>Session 3 — useState, events</SectionLabel>
          <h2 style={{
            fontFamily: tokens.fontDisplay, fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900, marginBottom: 16, color: tokens.text,
          }}>Counter App</h2>
          <p style={{ color: tokens.textMuted, marginBottom: 40, maxWidth: 500 }}>
            Demonstrates <code style={{ color: tokens.accentDark, fontFamily: tokens.fontMono, fontSize: 13 }}>useState</code>, event handlers, conditional styling, and derived state — all from Session 3.
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <CounterApp />
            <Card style={{ maxWidth: 320 }}>
              <SectionLabel>Session 3 — Theme toggle</SectionLabel>
              <h3 style={{ fontWeight: 500, marginBottom: 12, color: tokens.text }}>Dark / Light mode</h3>
              <p style={{ color: tokens.textMuted, fontSize: 13, marginBottom: 20 }}>
                Boolean state + conditional styling.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ThemeToggle darkMode={darkMode} toggle={() => setDarkMode(d => !d)} />
                <span style={{ color: tokens.textMuted, fontSize: 14 }}>
                  Currently: <strong style={{ color: tokens.accentDark }}>{darkMode ? "Dark" : "Light"}</strong>
                </span>
              </div>
              <div style={{
                marginTop: 20, padding: 16, borderRadius: 14,
                background: darkMode ? "#FAF5FF" : "#FFF9C4",
                border: `1.5px solid ${darkMode ? tokens.border : "rgba(253,211,77,0.4)"}`,
                transition: "background 0.4s, border-color 0.4s",
              }}>
                <p style={{
                  color: darkMode ? tokens.textMuted : "#92400E",
                  fontSize: 13, transition: "color 0.4s",
                }}>
                  This box reflects the current theme state. Styles change on the fly! ✨
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* ── TODO ── */}
        <Section id="todo">
          <SectionLabel>Session 3 — Lists, map(), key prop, conditional render</SectionLabel>
          <h2 style={{
            fontFamily: tokens.fontDisplay, fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900, marginBottom: 16, color: tokens.text,
          }}>Todo Application</h2>
          <p style={{ color: tokens.textMuted, marginBottom: 40, maxWidth: 520 }}>
            Full CRUD using state — add, toggle, delete, and filter tasks. Demonstrates list rendering with{" "}
            <code style={{ color: tokens.accentDark, fontFamily: tokens.fontMono, fontSize: 13 }}>.map()</code> and the{" "}
            <code style={{ color: tokens.accentDark, fontFamily: tokens.fontMono, fontSize: 13 }}>key</code> prop.
          </p>
          <TodoApp />
        </Section>

        {/* ── CONTACT ── */}
        <Section id="contact">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
            <SectionLabel>Session 4 — Modal component</SectionLabel>
            <h2 style={{
              fontFamily: tokens.fontDisplay, fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 900, marginBottom: 16, color: tokens.text, lineHeight: 1.1,
            }}>
              Let's connect<br />
              <em style={{
                background: `linear-gradient(135deg, ${tokens.accentDark}, #F472B6)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>& collaborate </em>
            </h2>
            <p style={{ color: tokens.textMuted, marginBottom: 32, lineHeight: 1.8 }}>
              Looking for internships, collaborations, and cool projects to work on. Let's build something together!
            </p>
            <Button variant="primary" size="lg" onClick={() => setContactModal(true)}>
              Open contact modal →
            </Button>
            <p style={{ color: tokens.textFaint, fontSize: 12, marginTop: 16, fontFamily: tokens.fontMono }}>
              // Session 4 — Modal component with state & overlay
            </p>
          </div>
        </Section>

        <Footer />
      </div>

      {/* CONTACT MODAL */}
      <Modal isOpen={contactModal} onClose={() => setContactModal(false)} title="Say hello 👋">
        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
            <p style={{ color: "#059669", fontWeight: 500, fontSize: 16 }}>Message sent!</p>
          </div>
        ) : (
          <div>
            {["name", "email"].map(field => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: tokens.textMuted, display: "block", marginBottom: 6, textTransform: "capitalize" }}>{field}</label>
                <input
                  value={formData[field]}
                  onChange={e => setFormData(d => ({ ...d, [field]: e.target.value }))}
                  placeholder={field === "name" ? "Your name" : "Your email"}
                  style={{
                    width: "100%", background: tokens.surfaceHover,
                    border: `1.5px solid ${tokens.border}`,
                    borderRadius: 12, padding: "10px 16px",
                    color: tokens.text, fontFamily: tokens.fontBody, fontSize: 14, outline: "none",
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: tokens.textMuted, display: "block", marginBottom: 6 }}>Message</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                placeholder="Tell me about your project or idea…"
                style={{
                  width: "100%", background: tokens.surfaceHover,
                  border: `1.5px solid ${tokens.border}`,
                  borderRadius: 12, padding: "10px 16px",
                  color: tokens.text, fontFamily: tokens.fontBody, fontSize: 14,
                  outline: "none", resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setContactModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>Send</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
