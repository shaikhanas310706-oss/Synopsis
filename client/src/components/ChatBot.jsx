import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";

// Predefined student-friendly pedagogical knowledge base
const PREDEFINED_RESPONSES = {
  "recursion": `### Understanding Recursion Simply 🔄
Recursion is when a function calls itself to solve a smaller piece of the exact same problem, until it hits a stopping condition called a **Base Case**.

**A Real-World Analogy:**
Imagine Russian nesting dolls (Matryoshka). To get to the tiniest wooden doll, you keep opening the outer doll (Recursive Step) until you reach the solid baby doll that cannot open anymore (Base Case).

**Essential Structure:**
\`\`\`python
def factorial(n):
    # 1. Base Case: prevents infinite loop
    if n <= 1:
        return 1
    # 2. Recursive Case: calls itself with smaller subproblem
    return n * factorial(n - 1)
\`\`\`
*Key Takeaway:* Without a base case, you will trigger a **Stack Overflow**!`,

  "cloud": `### What is Cloud Computing? ☁️
Cloud computing means delivering on-demand computing services—including servers, storage, databases, networking, and software—over the Internet ("the cloud") with pay-as-you-go pricing.

**The 3 Main Service Models:**
1. **IaaS (Infrastructure as a Service):** You rent raw virtual machines & storage (e.g. AWS EC2, Google Compute Engine). You manage the OS and software.
2. **PaaS (Platform as a Service):** The cloud handles servers & OS; you only bring your application code (e.g. Heroku, AWS Elastic Beanstalk).
3. **SaaS (Software as a Service):** Complete ready-to-use software delivered over the web (e.g. Gmail, Google Drive, Microsoft 365).`,

  "dbms": `### What is a Database Management System (DBMS)? 🗄️
A DBMS is specialized software that enables users to store, query, organize, and safeguard structured electronic data efficiently.

**Why use a DBMS instead of flat files?**
1. **ACID Transactions:** Guarantees Atomicity, Consistency, Isolation, and Durability so bank transactions never duplicate or vanish.
2. **Eliminates Redundancy:** Through Normalization (1NF, 2NF, 3NF), ensuring data is stored once without update anomalies.
3. **High-Performance Querying:** Uses B+ Trees and Hash indexes to retrieve 1 record out of millions in milliseconds!`,

  "practice": `### Quick Practice Questions 📝
Here are 3 quick concept checks across your active college subjects:

1. **Computer Networks:** What is the primary difference between a Switch (Layer 2) and a Router (Layer 3)?
2. **Python:** What is the output of \`bool([])\` vs \`bool([0])\`?
3. **DBMS:** Why is a Primary Key forbidden from containing NULL values?

*Type your answer to any of these, and I will check it for you!*`,

  "osi": `### The OSI 7-Layer Model Simplified 🌐
Remember the mnemonic: *"Please Do Not Throw Sausage Pizza Away"*!

1. **Physical:** Cables, radio waves, electrical bits (0s & 1s).
2. **Data Link:** Framing, MAC addresses, Ethernet switches.
3. **Network:** IP packets, routing across networks (Routers).
4. **Transport:** TCP/UDP, port numbers, reliable delivery.
5. **Session:** Maintains connection dialogues.
6. **Presentation:** Encryption (SSL/TLS), compression, data formatting.
7. **Application:** HTTP, DNS, FTP, SMTP (user-facing apps).`,

  "tcp": `### TCP 3-Way Handshake in Plain English 🤝
Before two computers talk via TCP, they establish trust:

1. **Client -> Server (SYN):** *"Hi! Let's establish a connection. My initial sequence is #100."*
2. **Server -> Client (SYN-ACK):** *"Received your #100! I agree. My sequence is #500, and I acknowledge your #101."*
3. **Client -> Server (ACK):** *"Acknowledged your #501! Let's start transferring data."*`
};

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your AI Study Assistant. Ask me to explain any topic from your courses (e.g. 'Explain recursion', 'What is cloud computing?', 'Explain DBMS', 'Give me practice questions'), and I'll break it down step-by-step!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let reply = "";

      if (qLower.includes("recursion")) {
        reply = PREDEFINED_RESPONSES.recursion;
      } else if (qLower.includes("cloud")) {
        reply = PREDEFINED_RESPONSES.cloud;
      } else if (qLower.includes("dbms") || qLower.includes("database")) {
        reply = PREDEFINED_RESPONSES.dbms;
      } else if (qLower.includes("practice") || qLower.includes("question")) {
        reply = PREDEFINED_RESPONSES.practice;
      } else if (qLower.includes("osi") || qLower.includes("network")) {
        reply = PREDEFINED_RESPONSES.osi;
      } else if (qLower.includes("tcp") || qLower.includes("handshake")) {
        reply = PREDEFINED_RESPONSES.tcp;
      } else if (qLower.includes("python") || qLower.includes("oop")) {
        reply = `### Python OOP Quick Explainer 🐍
In Python, Object-Oriented Programming models real-world entities through **Classes** (the blueprint) and **Objects** (the actual instance).

- **Encapsulation:** Grouping data and methods inside the class.
- **Inheritance:** A child class inherits attributes from a parent class using \`class Dog(Animal):\`.
- **Polymorphism:** Methods can have different behaviors across subclasses!`;
      } else {
        reply = `### AI Study Assistant Response 💡
Regarding **"${query}"**:
In computer science, breaking complex systems down into their inputs, transformations, and output contracts is the fastest way to understand them.

*Tip for your college exams:* Focus on the real-world tradeoff (e.g. Time vs Space, Latency vs Consistency, Hardware Cost vs Throughput).

Would you like me to generate a practice quiz question on this topic or explain a specific prerequisite?`;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 500);
  };

  const quickPrompts = [
    "Explain recursion",
    "What is cloud computing?",
    "Explain DBMS",
    "Explain OSI 7-layer model",
    "Give me practice questions",
    "Explain TCP 3-way handshake"
  ];

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="brand-icon" style={{ width: "34px", height: "34px" }}>
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>AI Study Assistant</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-strong)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-strong)" }} />
              Ready to answer college questions
            </div>
          </div>
        </div>

        <div className="badge badge-primary">
          <Sparkles size={12} /> Adaptive Tutor
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble bot" style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
            ⚡ AI Assistant is formulating response...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Topic Prompts */}
      <div className="chat-quick-queries">
        {quickPrompts.map((p, idx) => (
          <button key={idx} className="quick-query-pill" onClick={() => handleSend(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="chat-input-field"
          placeholder="Ask a question (e.g. 'Explain recursion', 'Explain DBMS')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!input.trim()}>
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}
