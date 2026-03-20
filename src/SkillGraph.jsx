import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export default function SkillGraph({ data }) {
  const skills = (data?.path || []).map((n) => n.skill).filter(Boolean);

  const nodes = skills.map((skill, i) => ({
    id: String(i),
    data: { label: skill },
    position: { x: i * 180, y: i * 120 },
    style: {
      background: "#020617",
      color: "#00ffff",
      border: "1px solid rgba(0,255,255,0.4)",
      boxShadow: "0 0 20px rgba(0,255,255,0.6)"
    }
  }));

  const edges = skills.slice(1).map((_, i) => ({
    id: `e${i}`,
    source: String(i),
    target: String(i + 1),
    animated: true,
    style: { stroke: "#00ffff" }
  }));

  return (
    <div className="h-[300px] glass p-4 border border-cyan-500/20">
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}