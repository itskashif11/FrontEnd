import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900"
      } min-h-screen transition-all duration-500`}
    >
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <Hero theme={theme} />
      <Stats theme={theme} />
      <Skills theme={theme} />
      <Experience theme={theme} />
      <Projects theme={theme} />
      <Contact theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

// ---------------- NAVBAR ----------------
function Navbar({ toggleTheme, theme }) {
  return (
    <div
      className={`sticky top-0 z-50 backdrop-blur-xl ${
        theme === "dark"
          ? "bg-white/5 border-b border-white/10"
          : "bg-white/30 border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold tracking-widest">Muhammad Kashif</h1>

        <div className="hidden md:flex gap-8 text-sm tracking-wide">
          {["#exp", "#projects", "#contact"].map((link, i) => (
            <a
              key={i}
              href={link}
              className={`transition ${
                theme === "dark"
                  ? "hover:text-blue-400"
                  : "hover:text-blue-500 hover:underline decoration-2 underline-offset-4"
              }`}
            >
              {link.slice(1).charAt(0).toUpperCase() + link.slice(2)}
            </a>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="px-3 py-1 border rounded-lg hover:scale-105 transition"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}

// ---------------- HERO ----------------
function Hero({ theme }) {
  return (
    <div className="text-center py-32 relative overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
      >
        Muhammad Kashif
      </motion.h1>

      <p
        className={`mt-6 text-xl ${
          theme === "dark" ? "text-gray-400" : "text-gray-700"
        }`}
      >
        Full Stack Engineer | Real-Time Systems Specialist
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a href="#projects">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition">
            Projects
          </button>
        </a>
        <a href="#contact">
          <button
            className={`px-6 py-2 border rounded-xl ${
              theme === "dark"
                ? "hover:bg-white/5 text-white"
                : "bg-white/50 backdrop-blur-md hover:bg-white/70 text-gray-900 shadow-md"
            } transition`}
          >
            Contact
          </button>
        </a>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <a
          href="https://www.linkedin.com/in/muhammad-kashif-239544188/"
          target="_blank"
        >
          <button
            className={`px-4 py-2 border rounded-xl transition ${
              theme === "dark"
                ? "hover:bg-blue-600/20 text-white"
                : "hover:bg-blue-600/20 bg-white/50 backdrop-blur-md text-gray-900 shadow-sm"
            }`}
          >
            LinkedIn
          </button>
        </a>
      </div>
    </div>
  );
}

// ---------------- COUNT UP ----------------
function useCountUp(end, duration = 1500, start) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return; // only start when 'start' is true
    let startVal = 0;
    const step = end / (duration / 16);

    const timer = setInterval(() => {
      startVal += step;
      if (startVal >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startVal));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return count;
}

// ---------------- STATS ----------------
// ---------------- STATS ----------------
// ---------------- STATS ----------------
function Stats({ theme }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const years = useCountUp(3, 500, inView);
  const projects = useCountUp(10, 500, inView);

  const statsData = [
    { value: years + "+", label: "Years Experience" },
    { value: projects + "+", label: "Projects" },
    { value: "Expert", label: "Real-Time Systems" },
  ];

  return (
    <div ref={ref} className="py-20 text-center">
      <div className="flex justify-center gap-16 flex-wrap">
        {statsData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }} // start 50px below
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="group"
          >
            <h2 className="text-5xl font-bold group-hover:scale-110 transition-transform">
              {item.value}
            </h2>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              } mt-2`}
            >
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---------------- SKILLS ----------------
function Skills({ theme }) {
  const skills = [
    "React",
    "Node.js",
    "WebSockets",
    "MongoDB",
    "Leaflet",
    "C",
    "C++",
    "WebGL",
  ];

  return (
    <div className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-10">Skills</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        {skills.map((skill, i) => (
          <motion.span
            whileHover={{ scale: 1.1 }}
            key={i}
            className={`px-5 py-2 border rounded-full ${
              theme === "dark"
                ? "bg-white/5 backdrop-blur-lg text-gray-200"
                : "bg-white/30 backdrop-blur-md shadow-sm text-gray-900"
            }`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// ---------------- EXPERIENCE ----------------
function Experience({ theme }) {
  return (
    <div id="exp" className="px-10 py-24">
      <h2
        className={`text-4xl font-bold mb-16 text-center ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Experience
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <ExperienceCard
          theme={theme}
          title="Real-Time Air Traffic & Sensor Systems"
          color="blue"
          desc="Led integration of multiple sensors into a large-scale system, managing real-time pipelines with WebSockets, TCP, UDP. Built high-availability React-Leaflet apps with dynamic map markers and 24/7 uptime."
          tech="React, React-Leaflet, WebSockets, TCP, UDP"
          achievement="Real-time monitoring, low-latency visualization, dynamic markers"
        />

        {/* Card 2 */}
        <ExperienceCard
          theme={theme}
          title="Full Stack Web Applications"
          color="purple"
          desc="Developed scalable web apps with React, Node.js, Express. Built interactive map drawing tools with database integration. Ensured responsive, low-latency performance and agile workflow."
          tech="React, Node.js, Express, MongoDB"
          achievement="Interactive maps, responsive UI, real-time data capture"
        />
      </div>
    </div>
  );
}

function ExperienceCard({ theme, title, color, desc, tech, achievement }) {
  const darkBg =
    color === "blue"
      ? "from-blue-800/40 via-black/40 to-blue-900/40 border-white/10"
      : "from-purple-800/40 via-black/40 to-purple-900/40 border-white/10";
  const lightBg =
    color === "blue"
      ? "from-blue-200/40 via-gray-100/40 to-blue-300/40 border-gray-300"
      : "from-purple-200/40 via-gray-100/40 to-purple-300/40 border-gray-300";

  const iconColor = color === "blue" ? "bg-blue-600" : "bg-purple-600";
  const textColor = color === "blue" ? "text-blue-400" : "text-purple-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`group p-8 rounded-3xl backdrop-blur-xl border shadow-xl hover:scale-105 transition-transform ${
        theme === "dark" ? `bg-gradient-to-br ${darkBg} text-gray-200` : `bg-gradient-to-br ${lightBg} text-gray-900`
      }`}
    >
      <div className="flex items-center mb-4">
        <div className={`${iconColor} p-3 rounded-full mr-4`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7l6 6-6 6M21 7l-6 6 6 6"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4 leading-relaxed">{desc}</p>
      <div className="flex flex-col gap-2">
        <div>
          <span className={`font-semibold ${textColor}`}>Technologies:</span> {tech}
        </div>
        <div>
          <span className={`font-semibold ${textColor}`}>Achievements:</span> {achievement}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------- PROJECTS ----------------
function Projects({ theme }) {
  const projectList = [
    {
      title: "Air Traffic Application",
      desc: "High-availability React-Leaflet app for real-time air traffic monitoring with dynamic markers and live updates.",
      tech: "React, React-Leaflet, WebSockets, TCP, UDP",
      features: "Live updates, dynamic markers, 24/7 uptime, low-latency visualization",
      color: "blue",
    },
    {
      title: "Map Drawing Tools",
      desc: "Interactive map tools for creating polygons, lines, and markers with database integration and real-time coordinates.",
      tech: "React, Leaflet, MongoDB, Node.js",
      features: "Polygon drawing, real-time coordinates, tooltips, markers, layer management",
      color: "purple",
    },
    {
      title: "Sensor Integration",
      desc: "Integrated multiple sensors with web applications, ensuring seamless real-time data flow and optimized performance.",
      tech: "React, WebSockets, TCP, UDP, Node.js",
      features: "Real-time sensor data, live visualization, low-latency updates, 24/7 high availability",
      color: "green",
    },
  ];

  return (
    <div id="projects" className="px-10 py-24">
      <h2
        className={`text-4xl font-bold mb-16 text-center ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Projects
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {projectList.map((p, i) => (
          <ProjectCard key={i} theme={theme} {...p} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ theme, title, desc, tech, features, color }) {
  const darkColors = {
    blue: "from-blue-800/40 via-black/40 to-blue-900/40 border-white/10",
    purple: "from-purple-800/40 via-black/40 to-purple-900/40 border-white/10",
    green: "from-green-800/40 via-black/40 to-green-900/40 border-white/10",
  };
  const lightColors = {
    blue: "from-blue-200/40 via-gray-100/40 to-blue-300/40 border-gray-300",
    purple: "from-purple-200/40 via-gray-100/40 to-purple-300/40 border-gray-300",
    green: "from-green-200/40 via-gray-100/40 to-green-300/40 border-gray-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`group p-8 rounded-3xl backdrop-blur-xl border shadow-xl hover:scale-105 transition-transform ${
        theme === "dark" ? `bg-gradient-to-br ${darkColors[color]} text-gray-200` : `bg-gradient-to-br ${lightColors[color]} text-gray-900`
      }`}
    >
      <div className="flex items-center mb-4">
        <div className={`bg-${color}-600 p-3 rounded-full mr-4`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4 leading-relaxed">{desc}</p>
      <div className="flex flex-col gap-2">
        <div><span className="font-semibold text-blue-400">Technologies:</span> {tech}</div>
        <div><span className="font-semibold text-blue-400">Features:</span> {features}</div>
      </div>
    </motion.div>
  );
}

// ---------------- CONTACT ----------------
function Contact({ theme }) {
  return (
    <div id="contact" className="py-20 px-10">
      <h2 className="text-3xl font-bold text-center mb-10">Contact</h2>

      <form className="max-w-xl mx-auto space-y-4">
        <input
          placeholder="Name"
          className={`w-full p-3 border rounded-xl transition ${
            theme === "dark"
              ? "bg-black/10 border-white/20 text-white placeholder-gray-400"
              : "bg-white/50 border-gray-300 backdrop-blur-md shadow-sm text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-400"
          }`}
        />
        <input
          placeholder="Email"
          className={`w-full p-3 border rounded-xl transition ${
            theme === "dark"
              ? "bg-black/10 border-white/20 text-white placeholder-gray-400"
              : "bg-white/50 border-gray-300 backdrop-blur-md shadow-sm text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-400"
          }`}
        />
        <textarea
          placeholder="Message"
          className={`w-full p-3 border rounded-xl transition ${
            theme === "dark"
              ? "bg-black/10 border-white/20 text-white placeholder-gray-400"
              : "bg-white/50 border-gray-300 backdrop-blur-md shadow-sm text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-400"
          }`}
        />
        <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition">
          Send
        </button>
      </form>
    </div>
  );
}

// ---------------- FOOTER ----------------
function Footer({ theme }) {
  return (
    <div className="text-center py-6 border-t mt-10">
      <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        © 2026 Muhammad Kashif
      </p>
    </div>
  );
}