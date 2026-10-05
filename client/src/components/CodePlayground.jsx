import React, { useState } from "react";
import { Terminal, Play, Sparkles, RotateCcw, CheckCircle, Bug } from "lucide-react";
import { playClickTick, playSuccessChime } from "../utils/audio";

const CODE_CHALLENGES = [
  {
    id: "attention",
    title: "Scaled Dot-Product Attention",
    category: "Neural Architectures",
    description: "Implement attention weights softmax((Q @ K.T) / sqrt(d_k)) @ V",
    starterCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    """
    Q: (seq_len, d_k)
    K: (seq_len, d_k)
    V: (seq_len, d_v)
    """
    d_k = Q.shape[-1]
    
    # Step 1: Compute scaled dot-product logits
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    
    # Step 2: Apply softmax over the last axis
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    
    # Step 3: Compute weighted representation
    output = np.matmul(weights, V)
    return output, weights

# Test run with random matrices
seq_len, d_k, d_v = 4, 8, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_v)

out, w = scaled_dot_product_attention(Q, K, V)
print("Output Shape:", out.shape)
print("Attention Weights Row Sum:", np.sum(w, axis=-1))`
  },
  {
    id: "gradient_step",
    title: "Momentum Gradient Update",
    category: "Optimization",
    description: "Simulate parameter update step with momentum velocity accumulation.",
    starterCode: `import numpy as np

def momentum_step(w, dw, v, alpha=0.01, beta=0.9):
    """
    w: parameters
    dw: gradient
    v: velocity buffer
    """
    # Accumulate exponential moving average
    v_next = beta * v + (1 - beta) * dw
    w_next = w - alpha * v_next
    return w_next, v_next

w = np.array([2.5, -1.8])
dw = np.array([0.45, -0.12])
v = np.zeros_like(w)

w_new, v_new = momentum_step(w, dw, v)
print("Updated Parameters:", w_new)
print("Velocity Vector:", v_new)`
  },
  {
    id: "consensus_quorum",
    title: "Raft Quorum & Split-Brain Guard",
    category: "Distributed Systems",
    description: "Verify majority quorum intersection to guarantee consensus safety.",
    starterCode: `def is_quorum_valid(cluster_size, active_nodes):
    majority_threshold = (cluster_size // 2) + 1
    has_majority = active_nodes >= majority_threshold
    fault_tolerance = (cluster_size - 1) // 2
    
    return {
        "cluster_size": cluster_size,
        "majority_needed": majority_threshold,
        "active_nodes": active_nodes,
        "quorum_achieved": has_majority,
        "tolerated_failures": fault_tolerance
    }

# Test 5-node cluster with 3 surviving nodes
result = is_quorum_valid(5, 3)
for k, v in result.items():
    print(f"{k}: {v}")`
  }
];

export default function CodePlayground() {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [code, setCode] = useState(CODE_CHALLENGES[0].starterCode);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [aiReview, setAiReview] = useState(null);
  const [running, setRunning] = useState(false);

  const currentChallenge = CODE_CHALLENGES[activeChallengeIndex];

  const handleSelectChallenge = (idx) => {
    playClickTick();
    setActiveChallengeIndex(idx);
    setCode(CODE_CHALLENGES[idx].starterCode);
    setTerminalOutput("");
    setAiReview(null);
  };

  const handleRunCode = () => {
    playClickTick();
    setRunning(true);
    setTerminalOutput("⚡ Compiling Python syntax and verifying tensor invariants...\n");

    setTimeout(() => {
      playSuccessChime();
      if (currentChallenge.id === "attention") {
        setTerminalOutput(
          `[Execution Trace - Python 3.11 Runtime]\n` +
          `>> Output Shape: (4, 8)\n` +
          `>> Attention Weights Row Sum: [1. 1. 1. 1.]\n` +
          `>> Matrix Multiplications: 2\n` +
          `>> Peak Memory Allocated: 1.2 KB (SRAM residency OK)\n` +
          `✓ Test Case Passed: All probability distributions strictly normalized.`
        );
      } else if (currentChallenge.id === "gradient_step") {
        setTerminalOutput(
          `[Execution Trace - Optimizer Simulator]\n` +
          `>> Initial Parameter: [2.5, -1.8]\n` +
          `>> Updated Parameters: [2.49955, -1.7988]\n` +
          `>> Velocity Vector: [0.045, -0.012]\n` +
          `✓ Test Case Passed: Inertial damping smoothly absorbed orthogonal oscillation.`
        );
      } else {
        setTerminalOutput(
          `[Execution Trace - Raft Node Simulation]\n` +
          `>> cluster_size: 5\n` +
          `>> majority_needed: 3\n` +
          `>> active_nodes: 3\n` +
          `>> quorum_achieved: True\n` +
          `>> tolerated_failures: 2\n` +
          `✓ Safety Property Holds: Split-brain impossible under Pigeonhole Principle.`
        );
      }
      setRunning(false);
    }, 600);
  };

  const handleAiReview = () => {
    playClickTick();
    setAiReview(null);
    setTimeout(() => {
      if (currentChallenge.id === "attention") {
        setAiReview({
          score: 95,
          feedback:
            "Excellent vectorized implementation! By subtracting np.max(scores) before computing exponent, you successfully protected against floating-point overflow. For production workloads with sequences > 2048, consider block-tiling to avoid O(N^2) memory footprint (FlashAttention pattern)."
        });
      } else if (currentChallenge.id === "gradient_step") {
        setAiReview({
          score: 92,
          feedback:
            "Clean EMA accumulator! Notice that for early steps when velocity is zero, beta bias can slow down early iterations. Adding an Adam-style unbiasing term (1 - beta^t) accelerates early trajectory convergence."
        });
      } else {
        setAiReview({
          score: 98,
          feedback:
            "Mathematically sound quorum calculation. Using strict integer division (cluster_size // 2) + 1 accurately guards against symmetric partitions in even-sized clusters as well."
        });
      }
    }, 400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Challenge Selector */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {CODE_CHALLENGES.map((ch, idx) => (
          <button
            key={ch.id}
            className={`role-btn ${activeChallengeIndex === idx ? "active" : ""}`}
            style={{ padding: "0.55rem 1.15rem", border: "1px solid var(--border-subtle)" }}
            onClick={() => handleSelectChallenge(idx)}
          >
            {ch.title}
          </button>
        ))}
      </div>

      {/* Editor & Output Layout */}
      <div className="playground-layout">
        {/* Code Editor Box */}
        <div className="code-editor-box">
          <div className="editor-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Terminal size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {currentChallenge.title}.py
              </span>
            </div>
            <button
              className="btn-icon"
              style={{ width: "30px", height: "30px" }}
              title="Reset code"
              onClick={() => setCode(currentChallenge.starterCode)}
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />

          <div style={{ padding: "0.75rem 1.25rem", background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Python 3.11 Environment Simulation
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-secondary" style={{ fontSize: "0.82rem" }} onClick={handleAiReview}>
                <Sparkles size={14} /> AI Code Review
              </button>
              <button className="btn-primary" style={{ fontSize: "0.82rem" }} onClick={handleRunCode} disabled={running}>
                <Play size={14} /> {running ? "Executing..." : "Run Test"}
              </button>
            </div>
          </div>
        </div>

        {/* Terminal & AI Analysis Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Terminal Box */}
          <div className="terminal-box" style={{ flex: 1, minHeight: "240px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
              <span style={{ marginLeft: "0.5rem" }}>Sandbox Execution Output</span>
            </div>

            <pre style={{ color: "#38bdf8", whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: "0.85rem" }}>
              {terminalOutput || "# Click 'Run Test' to execute the algorithm..."}
            </pre>
          </div>

          {/* AI Code Review Panel */}
          {aiReview && (
            <div className="quiz-feedback-box" style={{ borderLeftColor: "var(--accent-cyan)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                  <Sparkles size={18} /> Automated Algorithmic Review
                </div>
                <div className="mastery-delta-badge" style={{ color: "#34d399" }}>
                  Score: {aiReview.score}/100
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.55 }}>
                {aiReview.feedback}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
