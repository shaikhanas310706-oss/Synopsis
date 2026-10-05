/**
 * Socratic AI Tutor Engine ("Nova")
 * Context-aware pedagogical conversational assistant.
 * Supports built-in heuristic reasoning with domain grounding,
 * plus optional integration with Gemini or OpenAI API keys if provided.
 */

const KNOWLEDGE_BASE = {
  math_foundations: {
    title: "Linear Algebra & Gradient Math",
    analogy: "Think of matrix transformation like stretching, rotating, and skewing a sheet of rubber in space without tearing it.",
    keyInsight: "The derivative is simply the best local linear approximation of a function at a single point.",
    pitfall: "Confusing matrix dot products (inner dimensions match) with element-wise Hadamard products."
  },
  gradient_descent: {
    title: "Loss Landscapes & Optimization",
    analogy: "Imagine navigating down a foggy mountain range wearing a blindfold, feeling the steepest downward slope with your boots at each step.",
    keyInsight: "Momentum acts like a heavy bowling ball that gains speed rolling down hills and powers through small bumps and ditches.",
    pitfall: "Setting learning rate too high causes catastrophic divergence; setting it too low causes glacial progress or trapping in saddle points."
  },
  neural_networks: {
    title: "Multilayer Perceptrons & Activations",
    analogy: "Each neuron is like a weighted voting committee member that only speaks up (activates) if the evidence crosses their threshold.",
    keyInsight: "Without non-linear activations (like ReLU or GELU), stacking 100 neural network layers collapses into a single linear regression!",
    pitfall: "Using sigmoid activations in deep hidden layers, which causes gradients to vanish exponentially."
  },
  backprop: {
    title: "Backpropagation & Autodiff",
    analogy: "Think of an assembly line where an inspector notices a flaw at the end, and sends feedback backwards step-by-step telling each worker how much their tool contributed to the defect.",
    keyInsight: "Backprop is just the multivariable Chain Rule computed backwards using dynamic programming to cache intermediate derivatives.",
    pitfall: "Forgetting that branching computational paths sum gradients, whereas sequential operations multiply them."
  },
  transformers: {
    title: "Transformers & Scaled Dot-Product Attention",
    analogy: "Imagine an open-floor detective briefing where every clue (token) looks at every other clue (Key) to decide how much relevance (Attention weight) to grant its evidence (Value).",
    keyInsight: "Scaling by sqrt(d_k) prevents dot products from blowing up into extreme logits that flatten softmax gradients to near zero.",
    pitfall: "Assuming attention has O(N) complexity; naive self-attention scales quadratically O(N^2) with sequence length."
  },
  db_internals: {
    title: "Database Storage Engines & WAL",
    analogy: "The Write-Ahead Log is like an accountant's quick ledger written immediately, while data tables are the formal bound books updated during quiet hours.",
    keyInsight: "Sequential disk writes are orders of magnitude faster than random writes; WAL leverages this to guarantee ACID durability with minimal latency.",
    pitfall: "Assuming reads are instant after a write without considering MVCC snapshot isolation and transaction visibility."
  },
  consensus: {
    title: "Consensus Protocols (Raft & Paxos)",
    analogy: "Like a parliament requiring an absolute quorum majority to pass a law, ensuring that two opposing rogue factions cannot both pass conflicting laws at the same time.",
    keyInsight: "By the Pigeonhole Principle, any two quorums of size floor(N/2)+1 must share at least one overlapping member who knows the freshest log term.",
    pitfall: "Assuming consensus requires 100% agreement. Unanimity leads to complete paralysis if a single node goes offline."
  }
};

export const generateSocraticResponse = async ({ message, conceptId, learnerProfile, currentQuestion, apiKey = null }) => {
  const kb = KNOWLEDGE_BASE[conceptId] || {
    title: conceptId ? conceptId.replace(/_/g, " ") : "Core Systems",
    analogy: "Break down complex systems into their fundamental inputs, transformations, and output contracts.",
    keyInsight: "Identify the invariant that must hold true at every state transition.",
    pitfall: "Overlooking edge cases under high load or concurrency."
  };

  const lower = (message || "").toLowerCase();

  // If user configured an external OpenAI API key, we could call fetch; otherwise use our rich pedagogical engine:
  if (apiKey && apiKey.startsWith("sk-")) {
    try {
      const prompt = `You are Nova, an empathetic and razor-sharp Socratic AI tutor on an adaptive learning platform.
Topic: ${kb.title}.
Learner Current Mastery: ${(learnerProfile?.domainMastery?.[conceptId] || 0.5) * 100}%.
Current Question Context: ${currentQuestion ? currentQuestion.questionText : "None"}.
Learner says: "${message}".
Guidelines:
- Guide with Socratic questions, clear analogies, and mental models.
- If they are working on a question, do NOT reveal the exact answer immediately; scaffold their intuition.
- Keep response under 160 words, engaging and punchy.`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: prompt }, { role: "user", content: message }],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      if (res.ok) {
        const json = await res.json();
        return {
          reply: json.choices[0].message.content,
          mode: "cloud_llm",
          concept: kb.title
        };
      }
    } catch (e) {
      console.warn("External LLM fallback triggered:", e.message);
    }
  }

  // --- Rich Built-in Socratic Reasoning Engine ---
  let reply = "";

  if (lower.includes("analogy") || lower.includes("picture") || lower.includes("imagine") || lower.includes("like")) {
    reply = `💡 **Conceptual Analogy for ${kb.title}:**\n\n${kb.analogy}\n\nNotice how this shifts the problem from abstract formulas to an intuitive physical dynamic. Does this picture clarify what's actually occurring under the hood?`;
  } else if (lower.includes("hint") || lower.includes("stuck") || lower.includes("help me solve")) {
    if (currentQuestion && currentQuestion.hints && currentQuestion.hints.length > 0) {
      const hint = currentQuestion.hints[0];
      reply = `🔍 **Socratic Clue:**\n\n${hint}\n\nAsk yourself: What is the primary constraint or mathematical relationship being tested here? How does this change the expected outcome?`;
    } else {
      reply = `🔍 **Guiding Inquiry:**\n\n${kb.keyInsight}\n\nWhat happens if you isolate the key variable and inspect what happens at its extreme boundaries (e.g., when the value is 0 or approaching infinity)?`;
    }
  } else if (lower.includes("why is it wrong") || lower.includes("mistake") || lower.includes("incorrect") || lower.includes("misconception")) {
    reply = `⚠️ **Common Pitfall in ${kb.title}:**\n\n${kb.pitfall}\n\nWhen reviewing your logic, did you make an implicit assumption that didn't hold true under all constraints? Where in the computation did the path diverge?`;
  } else if (lower.includes("code") || lower.includes("example") || lower.includes("implement") || lower.includes("syntax")) {
    reply = `💻 **Algorithmic Structure for ${kb.title}:**\n\nKey invariant to maintain:\n1. Verify shapes/pre-conditions.\n2. Apply continuous or discrete state update.\n3. Verify that gradient/data flow isn't interrupted.\n\nWould you like to step through a minimal vectorized toy implementation in the Code Playground?`;
  } else if (lower.includes("prereq") || lower.includes("foundations") || lower.includes("basis")) {
    reply = `🗺️ **Foundational Scaffolding:**\n\nBefore mastering **${kb.title}**, make sure you are comfortable with:\n- First-principles mathematical transformations\n- Vectorized operations and tensor shapes\n- State space transitions\n\nYour current mastery in this domain is **${Math.round((learnerProfile?.domainMastery?.[conceptId] || 0.4) * 100)}%**. Ready to tackle a focused drill to bridge the gap?`;
  } else {
    reply = `🧠 **Socratic Insight on ${kb.title}:**\n\n"${kb.keyInsight}"\n\nTo test your intuition: If we perturb one of the key parameters, how would the rest of the system respond to compensate? Tell me your hypothesis!`;
  }

  return {
    reply,
    mode: "socratic_heuristic",
    concept: kb.title,
    suggestedFollowUps: [
      "Can you give me a real-world analogy?",
      "What is the most common pitfall here?",
      "Test my understanding with a scenario"
    ]
  };
};
