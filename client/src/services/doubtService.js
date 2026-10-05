// AI Doubt Solving Service
// Simulates pedagogical AI doubt resolution with conceptual breakdowns,
// mistake taxonomies, analogies, code fixes, and LocalStorage persistence.

import { storageService } from "./storage";

export const doubtService = {
  getDoubts() {
    return storageService.getDoubts();
  },

  deleteDoubt(id) {
    storageService.deleteDoubt(id);
    return this.getDoubts();
  },

  async solveDoubt({ subject, title, description, codeSnippet = "" }) {
    // Simulate real AI reasoning delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const combined = `${title} ${description} ${codeSnippet}`.toLowerCase();

    let conceptExplanation = "";
    let detailedAnalysis = "";
    let keyTakeaway = "";
    let codeExample = "";
    let practiceTip = "";

    if (combined.includes("handshake") || combined.includes("syn") || combined.includes("tcp")) {
      conceptExplanation = "TCP requires a 3-way handshake (SYN -> SYN-ACK -> ACK) so both the client and server synchronize their sequence numbers and prevent obsolete delayed requests from creating zombie connections.";
      detailedAnalysis = `**Why a 2-Way Handshake Fails:**
- If packet delays occur in transit, an old duplicate SYN can reach the server minutes after the client closed its program.
- In a 2-way handshake, the server would immediately allocate buffers and wait indefinitely.
- The 3-way handshake prevents this by requiring the client's final ACK before declaring the socket open.`;
      keyTakeaway = "Mutual agreement on starting sequence numbers requires 3 exchanges; neither side assumes connection viability unilaterally.";
      codeExample = `# TCP Flag Exchange:
Client -------- SYN (Seq=X) --------> Server
Client <---- SYN-ACK (Seq=Y, Ack=X+1) -- Server
Client -------- ACK (Ack=Y+1) ------> Server (ESTABLISHED)`;
      practiceTip = "Check Computer Networks: Lesson 2 (TCP vs UDP & The 3-Way Handshake).";
    } else if (combined.includes("primary key") || combined.includes("unique") || combined.includes("foreign key")) {
      conceptExplanation = "A Primary Key uniquely identifies a record and strictly prohibits NULLs (only 1 allowed per table). A Unique Key prevents duplicates but permits NULL values (multiple allowed per table).";
      detailedAnalysis = `**Architectural Distinction:**
1. **Primary Key:** Acts as the default clustered index in RDBMS like MySQL and PostgreSQL, physically ordering data pages on disk.
2. **Unique Constraint:** Creates a secondary non-clustered index. Ideal for natural unique identifiers like Email, National ID, or Social Handle where values might occasionally be optional (NULL).`;
      keyTakeaway = "Use Primary Key for internal surrogate IDs (e.g. user_id); use Unique Key constraints for alternate candidates (e.g. email).";
      codeExample = `CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Primary key
    email VARCHAR(255) UNIQUE NOT NULL,      -- Unique constraint
    phone VARCHAR(20) UNIQUE NULL            -- Optional unique constraint
);`;
      practiceTip = "Review DBMS: Module 1, Lesson 1 (Relational Schemas & Keys).";
    } else if (combined.includes("recursion") || combined.includes("stack") || combined.includes("base case")) {
      conceptExplanation = "A recursive function must have two components: a Base Case (which terminates recursion) and a Recursive Case (which shrinks the problem towards the base case). Without a base case, calls pile up until stack memory is exhausted.";
      detailedAnalysis = `**Call Stack Mechanism:**
Each recursive call allocates a new stack frame holding its local variables and return address. If the parameter never reaches the base condition, the execution environment throws a 'Maximum Call Stack Size Exceeded' (StackOverflow) error.`;
      keyTakeaway = "Always write and verify your base case condition first before writing the recursive step.";
      codeExample = `def count_down(n):
    # 1. Base case: Stops infinite loop
    if n <= 0:
        print("Blastoff!")
        return
    # 2. Recursive step: Decrements parameter towards base case
    print(n)
    count_down(n - 1)`;
      practiceTip = "Practice tree traversals and divide-and-conquer algorithms in Python or DSA.";
    } else if (combined.includes("subnet") || combined.includes("cidr") || combined.includes("mask") || combined.includes("ip")) {
      conceptExplanation = "Subnetting splits a large network address space into smaller, manageable subnetworks using a prefix mask (e.g., /24, /28) to control broadcast domains and optimize IP allocation.";
      detailedAnalysis = `**How CIDR Bit Calculations Work:**
- IPv4 has 32 total bits.
- /26 means 26 bits for the Network Prefix, leaving 6 bits for Hosts.
- Total IP addresses = 2^6 = 64.
- Usable Host addresses = 64 - 2 = 62 (first address is Network ID, last is Broadcast ID).`;
      keyTakeaway = "Usable hosts in any IPv4 subnet is always (2^(32 - prefix) - 2).";
      codeExample = `# Subnet /26 Example:
Network Address:   192.168.1.0/26
Subnet Mask:       255.255.255.192
Usable Host Range: 192.168.1.1 - 192.168.1.62
Broadcast Address: 192.168.1.63`;
      practiceTip = "Study Computer Networks: Lesson 3 (IPv4 Addressing, CIDR & Subnetting).";
    } else if (combined.includes("acid") || combined.includes("transaction")) {
      conceptExplanation = "ACID defines the four pillars of reliable database transactions: Atomicity ('all or nothing'), Consistency (preserves schema constraints), Isolation (concurrent safety), and Durability (saved permanently).";
      detailedAnalysis = `**Real-World Banking Example:**
If Student A transfers $100 to Student B:
- Step 1: Deduct $100 from A.
- Step 2: Add $100 to B.
If the server crashes between Step 1 and Step 2, Atomicity rolls back the deduction so money is never lost in limbo.`;
      keyTakeaway = "Transactions guarantee that multi-step operations execute as a single atomic unit, isolated from concurrent queries.";
      codeExample = `START TRANSACTION;
UPDATE Accounts SET balance = balance - 100 WHERE id = 1;
UPDATE Accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- If error occurs anywhere: ROLLBACK;`;
      practiceTip = "Review DBMS: Module 1, Lesson 2 (Transactions & ACID Guarantees).";
    } else {
      // General intelligent pedagogical response
      conceptExplanation = `The core question revolves around understanding how constraints and invariants operate in **${subject || "Computer Science"}**.`;
      detailedAnalysis = `**Diagnostic Breakdown:**
1. **Identify the Core Invariant:** In "${title}", distinguish between the input preconditions and expected output guarantees.
2. **Analyze Potential Pitfalls:** Often confusion arises from edge cases (e.g. boundary values, off-by-one errors, concurrent execution, or implicit type conversion).
3. **First-Principles Framing:** Check whether the issue is architectural (design level) or syntactic (implementation level).`;
      keyTakeaway = "Break the problem into atomic single-responsibility steps and test each assumption individually.";
      codeExample = codeSnippet ? `// Verified Pattern:\n${codeSnippet}\n// Ensure all inputs are validated before state mutations.` : "";
      practiceTip = `Revisit foundational lessons in ${subject} and attempt a quick diagnostic quiz to verify mastery.`;
    }

    const aiSolution = {
      conceptExplanation,
      detailedAnalysis,
      keyTakeaway,
      codeExample,
      practiceTip
    };

    const saved = storageService.saveDoubt({
      subject,
      title,
      description,
      codeSnippet,
      aiSolution
    });

    return saved;
  }
};
