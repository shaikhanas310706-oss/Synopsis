"""
Socratic AI Tutor Engine ("Nova")
Context-aware pedagogical conversational assistant.
Supports built-in heuristic reasoning with domain grounding,
plus optional integration with OpenAI API if key is provided.
"""

from typing import Any, Dict, List, Optional
import requests

KNOWLEDGE_BASE = {
    "math_foundations": {
        "title": "Linear Algebra & Gradient Math",
        "analogy": "Think of matrix transformation like stretching, rotating, and skewing a sheet of rubber in space without tearing it.",
        "keyInsight": "The derivative is simply the best local linear approximation of a function at a single point.",
        "pitfall": "Confusing matrix dot products (inner dimensions match) with element-wise Hadamard products."
    },
    "gradient_descent": {
        "title": "Loss Landscapes & Optimization",
        "analogy": "Imagine navigating down a foggy mountain range wearing a blindfold, feeling the steepest downward slope with your boots at each step.",
        "keyInsight": "Momentum acts like a heavy bowling ball that gains speed rolling down hills and powers through small bumps and ditches.",
        "pitfall": "Setting learning rate too high causes catastrophic divergence; setting it too low causes glacial progress or trapping in saddle points."
    },
    "neural_networks": {
        "title": "Multilayer Perceptrons & Activations",
        "analogy": "Each neuron is like a weighted voting committee member that only speaks up (activates) if the evidence crosses their threshold.",
        "keyInsight": "Without non-linear activations (like ReLU or GELU), stacking 100 neural network layers collapses into a single linear regression!",
        "pitfall": "Using sigmoid activations in deep hidden layers, which causes gradients to vanish exponentially."
    },
    "backprop": {
        "title": "Backpropagation & Autodiff",
        "analogy": "Think of an assembly line where an inspector notices a flaw at the end, and sends feedback backwards step-by-step telling each worker how much their tool contributed to the defect.",
        "keyInsight": "Backprop is just the multivariable Chain Rule computed backwards using dynamic programming to cache intermediate derivatives.",
        "pitfall": "Forgetting that branching computational paths sum gradients, whereas sequential operations multiply them."
    },
    "transformers": {
        "title": "Transformers & Scaled Dot-Product Attention",
        "analogy": "Imagine an open-floor detective briefing where every clue (token) looks at every other clue (Key) to decide how much relevance (Attention weight) to grant its evidence (Value).",
        "keyInsight": "Scaling by sqrt(d_k) prevents dot products from blowing up into extreme logits that flatten softmax gradients to near zero.",
        "pitfall": "Assuming attention has O(N) complexity; naive self-attention scales quadratically O(N^2) with sequence length."
    },
    "db_internals": {
        "title": "Database Storage Engines & WAL",
        "analogy": "The Write-Ahead Log is like an accountant's quick ledger written immediately, while data tables are the formal bound books updated during quiet hours.",
        "keyInsight": "Sequential disk writes are orders of magnitude faster than random writes; WAL leverages this to guarantee ACID durability with minimal latency.",
        "pitfall": "Assuming reads are instant after a write without considering MVCC snapshot isolation and transaction visibility."
    },
    "consensus": {
        "title": "Consensus Protocols (Raft & Paxos)",
        "analogy": "Like a parliament requiring an absolute quorum majority to pass a law, ensuring that two opposing rogue factions cannot both pass conflicting laws at the same time.",
        "keyInsight": "By the Pigeonhole Principle, any two quorums of size floor(N/2)+1 must share at least one overlapping member who knows the freshest log term.",
        "pitfall": "Assuming consensus requires 100% agreement. Unanimity leads to complete paralysis if a single node goes offline."
    }
}


def generate_socratic_response(
    message: str,
    concept_id: Optional[str] = None,
    learner_profile: Optional[Dict[str, Any]] = None,
    current_question: Optional[Dict[str, Any]] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    kb = KNOWLEDGE_BASE.get(concept_id or "", {
        "title": (concept_id or "").replace("_", " ").title() if concept_id else "Core Systems",
        "analogy": "Break down complex systems into their fundamental inputs, transformations, and output contracts.",
        "keyInsight": "Identify the invariant that must hold true at every state transition.",
        "pitfall": "Overlooking edge cases under high load or concurrency."
    })

    lower_msg = (message or "").lower()

    # If external OpenAI API key provided
    if api_key and api_key.startswith("sk-"):
        try:
            current_mastery = 0.5
            if learner_profile and "domainMastery" in learner_profile:
                current_mastery = learner_profile["domainMastery"].get(concept_id, 0.5)

            prompt = (
                f"You are Nova, an empathetic and razor-sharp Socratic AI tutor on an adaptive learning platform.\n"
                f"Topic: {kb['title']}.\n"
                f"Learner Current Mastery: {current_mastery * 100}%.\n"
                f"Current Question Context: {current_question.get('questionText', 'None') if current_question else 'None'}.\n"
                f'Learner says: "{message}".\n'
                f"Guidelines:\n"
                f"- Guide with Socratic questions, clear analogies, and mental models.\n"
                f"- If they are working on a question, do NOT reveal the exact answer immediately; scaffold their intuition.\n"
                f"- Keep response under 160 words, engaging and punchy."
            )

            res = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": prompt},
                        {"role": "user", "content": message}
                    ],
                    "max_tokens": 300,
                    "temperature": 0.7
                },
                timeout=10
            )
            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                return {
                    "reply": content,
                    "mode": "cloud_llm",
                    "concept": kb["title"]
                }
        except Exception as e:
            print("External LLM fallback triggered:", e)

    # Built-in Socratic Reasoning Engine
    reply = ""

    if any(k in lower_msg for k in ["analogy", "picture", "imagine", "like"]):
        reply = (
            f"💡 **Conceptual Analogy for {kb['title']}:**\n\n"
            f"{kb['analogy']}\n\n"
            f"Notice how this shifts the problem from abstract formulas to an intuitive physical dynamic. "
            f"Does this picture clarify what's actually occurring under the hood?"
        )
    elif any(k in lower_msg for k in ["hint", "stuck", "help me solve"]):
        hints = current_question.get("hints", []) if current_question else []
        if hints:
            hint = hints[0]
            reply = (
                f"🔍 **Socratic Clue:**\n\n{hint}\n\n"
                f"Ask yourself: What is the primary constraint or mathematical relationship being tested here? "
                f"How does this change the expected outcome?"
            )
        else:
            reply = (
                f"🔍 **Guiding Inquiry:**\n\n{kb['keyInsight']}\n\n"
                f"What happens if you isolate the key variable and inspect what happens at its extreme boundaries "
                f"(e.g., when the value is 0 or approaching infinity)?"
            )
    elif any(k in lower_msg for k in ["why is it wrong", "mistake", "incorrect", "misconception"]):
        reply = (
            f"⚠️ **Common Pitfall in {kb['title']}:**\n\n{kb['pitfall']}\n\n"
            f"When reviewing your logic, did you make an implicit assumption that didn't hold true under all constraints? "
            f"Where in the computation did the path diverge?"
        )
    elif any(k in lower_msg for k in ["code", "example", "implement", "syntax"]):
        reply = (
            f"💻 **Algorithmic Structure for {kb['title']}:**\n\n"
            f"Key invariant to maintain:\n"
            f"1. Verify shapes/pre-conditions.\n"
            f"2. Apply continuous or discrete state update.\n"
            f"3. Verify that gradient/data flow isn't interrupted.\n\n"
            f"Would you like to step through a minimal vectorized toy implementation in the Code Playground?"
        )
    elif any(k in lower_msg for k in ["prereq", "foundations", "basis"]):
        current_pct = 40
        if learner_profile and "domainMastery" in learner_profile:
            current_pct = round(learner_profile["domainMastery"].get(concept_id, 0.4) * 100)
        reply = (
            f"🗺️ **Foundational Scaffolding:**\n\n"
            f"Before mastering **{kb['title']}**, make sure you are comfortable with:\n"
            f"- First-principles mathematical transformations\n"
            f"- Vectorized operations and tensor shapes\n"
            f"- State space transitions\n\n"
            f"Your current mastery in this domain is **{current_pct}%**. Ready to tackle a focused drill to bridge the gap?"
        )
    else:
        reply = (
            f"🧠 **Socratic Insight on {kb['title']}:**\n\n"
            f'"{kb["keyInsight"]}"\n\n'
            f"To test your intuition: If we perturb one of the key parameters, how would the rest of the system respond to compensate? Tell me your hypothesis!"
        )

    return {
        "reply": reply,
        "mode": "socratic_heuristic",
        "concept": kb["title"],
        "suggestedFollowUps": [
            "Can you give me a real-world analogy?",
            "What is the most common pitfall here?",
            "Test my understanding with a scenario"
        ]
    }
