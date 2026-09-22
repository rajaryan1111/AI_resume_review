import { useEffect, useState } from "react";
import SkillGraph from "./SkillGraph";

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATES (ADDED - NOTHING REMOVED)
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJDFile] = useState(null);
  const [role, setRole] = useState("");
  const [diagnosticJson, setDiagnosticJson] = useState("");
  const [userId, setUserId] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "${apiBaseUrl}";

  useEffect(() => {
    // Bootstrap user so the rest of the API can rely on `user_id` existing.
    // This keeps the hackathon UI simple.
    const ensureUser = async () => {
      try {
        const email = "demo@example.com";
        const payload = { email, name: "Demo User" };
        const res = await fetch("${apiBaseUrl}/api/v1/users/ensure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) return;
        const data = await res.json();
        setUserId(data.id);
      } catch {
        // Ignore; handleGenerate will surface backend issues via alert.
      }
    };

    ensureUser();
  }, []);

  // 🔥 UPDATED HANDLE GENERATE (MERGED)
  const handleGenerate = async () => {
    if (!resumeText && !resumeFile) {
      alert("Please provide Resume (text or PDF)");
      return;
    }

    if (!jdText && !jdFile) {
      alert("Please provide Job Description (text or PDF)");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (!userId) {
        alert("User bootstrap failed. Please try again.");
        return;
      }
      formData.append("user_id", userId);

      // Optional: role hint for role-specific competency targets.
      if (role.trim()) {
        formData.append("role", role.trim());
      }

      // Optional: diagnostic JSON to override resume-based proficiency inference.
      if (diagnosticJson.trim()) {
        try {
          JSON.parse(diagnosticJson);
        } catch {
          alert("diagnostic_json must be valid JSON.");
          return;
        }
        formData.append("diagnostic_json", diagnosticJson.trim());
      }

      // ✅ SMART INPUT HANDLING (PDF OR TEXT)
      if (resumeFile) {
        formData.append("resume_file", resumeFile);
      } else {
        const resumeBlob = new Blob([resumeText], { type: "text/plain" });
        formData.append("resume_file", resumeBlob, "resume.txt");
      }

      if (jdFile) {
        formData.append("jd_file", jdFile);
      } else {
        const jdBlob = new Blob([jdText], { type: "text/plain" });
        formData.append("jd_file", jdBlob, "jd.txt");
      }

      const response = await fetch("${apiBaseUrl}/api/v1/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("❌ API Status:", response.status);
        throw new Error("API failed");
      }

      const data = await response.json();

      console.log("🔥 API RESPONSE:", data);

      setResult(data);

    } catch (error) {
      console.error("❌ ERROR:", error);
      alert("Backend connection failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black text-white p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-cyan-400 mb-2">🚀 Career OS</h1>
      <p className="text-gray-400 mb-6">
        AI-powered adaptive onboarding engine
      </p>

      {/* PIPELINE */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
        <p className="text-lg font-semibold mb-2">🧠 AI Pipeline</p>
        <div className="flex gap-4 text-sm text-gray-300">
          <span>📄 Resume Parsed</span>
          <span>⚙️ Skills Extracted</span>
          <span>📊 Matched</span>
          <span>🧩 Gap Identified</span>
          <span className="text-cyan-400">🚀 Path Generated</span>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">

        <p className="text-lg font-semibold mb-4">📄 Input</p>

        {/* RESUME TEXT */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste Resume..."
          className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 mb-4 outline-none"
        />

        {/* ✅ NEW: RESUME FILE */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="mb-4"
        />

        {/* JD TEXT */}
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste Job Description..."
          className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 mb-4 outline-none"
        />

        {/* ✅ NEW: JD FILE */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setJDFile(e.target.files[0])}
          className="mb-4"
        />

        {/* Role hint */}
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role (optional): backend_engineer | frontend_engineer | data_engineer"
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 mb-4 outline-none"
        />

        {/* Diagnostic JSON */}
        <textarea
          value={diagnosticJson}
          onChange={(e) => setDiagnosticJson(e.target.value)}
          placeholder='Diagnostic JSON (optional). Example: {"skill_scores":{"python":80,"fastapi":70}}'
          className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 mb-4 outline-none"
        />

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          ⚡ Generate Path
        </button>

        {/* LOADING */}
        {loading && (
          <div className="mt-4">
            <p className="text-cyan-400">✔ Generating Path...</p>
          </div>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-4">📊 Results</h2>

          <div className="mb-4">
            <h3 className="text-lg text-cyan-400">Skills</h3>
            <pre className="text-sm text-gray-300">
              {JSON.stringify(result.skills, null, 2)}
            </pre>
          </div>

          <div className="mb-4">
            <h3 className="text-lg text-red-400">Skill Gap</h3>
            <pre className="text-sm text-gray-300">
              {JSON.stringify(result.gap, null, 2)}
            </pre>
          </div>

          <div className="mb-4">
            <h3 className="text-lg text-green-400">Learning Path</h3>
            <pre className="text-sm text-gray-300">
              {JSON.stringify(result.path, null, 2)}
            </pre>
          </div>

          <SkillGraph data={result} />
        </div>
      )}
    </div>
  );
}