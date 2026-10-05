// Quiz Service for AI Adaptive Learning Platform
// Interactive multiple-choice question banks with automated score evaluation,
// performance level classification, and LocalStorage persistence.

import { storageService } from "./storage";
import { adaptiveLearningService } from "./adaptiveLearning";

export const QUIZ_CATALOG = [
  {
    id: "quiz-cn-1",
    subject: "Computer Networks",
    title: "OSI Reference Model & TCP/IP Architecture",
    description: "Test your understanding of data encapsulation, layer functions, and transport protocols.",
    difficulty: "Intermediate",
    totalQuestions: 5,
    estimatedMinutes: 8,
    questions: [
      {
        id: "cn_q1",
        question: "Which layer of the OSI model is responsible for end-to-end process-to-process communication and port numbering?",
        options: [
          "Network Layer",
          "Transport Layer",
          "Data Link Layer",
          "Session Layer"
        ],
        correctAnswer: 1, // Transport Layer
        explanation: "The Transport layer (Layer 4) handles process-to-process delivery using port numbers (e.g., TCP, UDP), whereas the Network layer handles host-to-host IP routing.",
        topicTag: "OSI Model"
      },
      {
        id: "cn_q2",
        question: "What is the primary difference between TCP and UDP?",
        options: [
          "TCP is connectionless and faster, while UDP is connection-oriented.",
          "TCP provides reliable, ordered data delivery via handshakes; UDP is connectionless and low-latency.",
          "UDP guarantees delivery of all packets in order.",
          "TCP operates at Layer 2, while UDP operates at Layer 3."
        ],
        correctAnswer: 1,
        explanation: "TCP uses a 3-way handshake, sequence numbers, and retransmissions for reliable delivery, making it connection-oriented. UDP has no handshake overhead.",
        topicTag: "Protocols"
      },
      {
        id: "cn_q3",
        question: "Which protocol is responsible for resolving a known IP address to a physical MAC address on a local area network?",
        options: [
          "DNS (Domain Name System)",
          "DHCP (Dynamic Host Configuration)",
          "ARP (Address Resolution Protocol)",
          "ICMP (Internet Control Message)"
        ],
        correctAnswer: 2, // ARP
        explanation: "ARP broadcasts a request on the local network link asking 'Who has this IP?', and the owner responds with its MAC hardware address.",
        topicTag: "Addressing"
      },
      {
        id: "cn_q4",
        question: "What is the standard subnet mask for a Class C IPv4 network with default allocation (/24)?",
        options: [
          "255.0.0.0",
          "255.255.0.0",
          "255.255.255.0",
          "255.255.255.255"
        ],
        correctAnswer: 2, // 255.255.255.0
        explanation: "/24 indicates 24 network bits (three octets of 255) leaving 8 bits for host addresses (up to 254 usable hosts).",
        topicTag: "Subnetting"
      },
      {
        id: "cn_q5",
        question: "In the TCP 3-way handshake, what sequence of control flags is exchanged to establish a connection?",
        options: [
          "SYN -> SYN-ACK -> ACK",
          "ACK -> SYN -> SYN-ACK",
          "FIN -> ACK -> FIN-ACK",
          "SYN -> PUSH -> ACK"
        ],
        correctAnswer: 0, // SYN -> SYN-ACK -> ACK
        explanation: "Client initiates with SYN, Server accepts and synchronizes with SYN-ACK, and Client acknowledges with ACK before sending payload data.",
        topicTag: "TCP Handshake"
      }
    ]
  },
  {
    id: "quiz-py-1",
    subject: "Python",
    title: "Python Data Structures & OOP",
    description: "Validate your skills in list comprehensions, dictionaries, classes, and inheritance.",
    difficulty: "Beginner - Intermediate",
    totalQuestions: 5,
    estimatedMinutes: 8,
    questions: [
      {
        id: "py_q1",
        question: "What is the output of `[x**2 for x in range(5) if x % 2 == 0]` in Python?",
        options: [
          "[0, 1, 4, 9, 16]",
          "[0, 4, 16]",
          "[1, 9]",
          "[4, 16]"
        ],
        correctAnswer: 1, // [0, 4, 16]
        explanation: "range(5) gives 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.",
        topicTag: "List Comprehension"
      },
      {
        id: "py_q2",
        question: "Which keyword in Python is used to refer to the current instance of a class inside its methods?",
        options: [
          "this",
          "self",
          "instance",
          "cls"
        ],
        correctAnswer: 1, // self
        explanation: "By convention and language design, `self` represents the specific instance of the class being operated on.",
        topicTag: "OOP"
      },
      {
        id: "py_q3",
        question: "What is the time complexity of searching for a key in a Python dictionary on average?",
        options: [
          "O(1)",
          "O(n)",
          "O(log n)",
          "O(n log n)"
        ],
        correctAnswer: 0, // O(1)
        explanation: "Python dictionaries are implemented using hash tables, offering O(1) average-case key lookups and insertions.",
        topicTag: "Complexity"
      },
      {
        id: "py_q4",
        question: "Which of the following built-in data types in Python is IMMUTABLE?",
        options: [
          "List",
          "Dictionary",
          "Tuple",
          "Set"
        ],
        correctAnswer: 2, // Tuple
        explanation: "Tuples cannot be altered after creation, making them hashable and safe for use as dictionary keys.",
        topicTag: "Data Types"
      },
      {
        id: "py_q5",
        question: "What does the `yield` keyword signify in a Python function?",
        options: [
          "It permanently exits the function and cleans up stack frames.",
          "It converts the function into a Generator that lazily produces values one at a time.",
          "It forces synchronous multithreading.",
          "It handles exceptions gracefully."
        ],
        correctAnswer: 1,
        explanation: "`yield` pauses the function state and yields a value to the caller, resuming right where it left off on the next `next()` call.",
        topicTag: "Generators"
      }
    ]
  },
  {
    id: "quiz-db-1",
    subject: "DBMS",
    title: "Relational Modeling, Normalization & ACID",
    description: "Test relational database schema design, keys, SQL queries, and transaction safety.",
    difficulty: "Intermediate",
    totalQuestions: 5,
    estimatedMinutes: 8,
    questions: [
      {
        id: "db_q1",
        question: "A relation is in Second Normal Form (2NF) if and only if it is in 1NF and what other condition holds?",
        options: [
          "No transitive dependencies exist.",
          "Every non-prime attribute is fully functionally dependent on every candidate key.",
          "Multi-valued dependencies are resolved.",
          "All attributes contain only atomic string values."
        ],
        correctAnswer: 1, // 2NF definition
        explanation: "2NF eliminates partial functional dependencies, ensuring every non-key column depends on the whole primary key, not just a subset.",
        topicTag: "Normalization"
      },
      {
        id: "db_q2",
        question: "In the ACID transaction model, what does the 'I' stand for and guarantee?",
        options: [
          "Integrity: ensuring data matches domain constraints.",
          "Isolation: concurrent transactions execute without interfering with one another.",
          "Idempotency: repeating a write yields the exact same state.",
          "Indexing: fast retrieval on primary keys."
        ],
        correctAnswer: 1,
        explanation: "Isolation guarantees that multiple concurrent transactions do not observe intermediate, uncommitted states from each other.",
        topicTag: "ACID"
      },
      {
        id: "db_q3",
        question: "Which SQL clause is used to filter aggregated group records produced by `GROUP BY`?",
        options: [
          "WHERE",
          "HAVING",
          "ORDER BY",
          "DISTINCT"
        ],
        correctAnswer: 1, // HAVING
        explanation: "WHERE filters rows before aggregation occurs; HAVING filters group rows after aggregation.",
        topicTag: "SQL Queries"
      },
      {
        id: "db_q4",
        question: "What database indexing data structure is most widely used in relational engines for efficient range queries and sequential disk scans?",
        options: [
          "B+ Tree",
          "Binary Search Tree",
          "Hash Map",
          "Linked List"
        ],
        correctAnswer: 0, // B+ Tree
        explanation: "B+ Trees keep all data records in leaf nodes linked sequentially, with high branching factor minimizing disk page reads.",
        topicTag: "Indexing"
      },
      {
        id: "db_q5",
        question: "Which SQL JOIN returns all rows from the left table, along with matching rows from the right table, or NULL if no match exists?",
        options: [
          "INNER JOIN",
          "CROSS JOIN",
          "LEFT OUTER JOIN",
          "FULL OUTER JOIN"
        ],
        correctAnswer: 2,
        explanation: "LEFT OUTER JOIN preserves every record from the left relation, filling missing right relation attributes with NULL.",
        topicTag: "Joins"
      }
    ]
  },
  {
    id: "quiz-ai-1",
    subject: "Artificial Intelligence",
    title: "Search Algorithms & Heuristics",
    description: "Evaluate A* search, admissible heuristics, state-space exploration, and minimax.",
    difficulty: "Advanced",
    totalQuestions: 5,
    estimatedMinutes: 8,
    questions: [
      {
        id: "ai_q1",
        question: "In the A* search algorithm, the evaluation function f(n) is computed as:",
        options: [
          "f(n) = g(n) - h(n)",
          "f(n) = g(n) + h(n)",
          "f(n) = h(n) / g(n)",
          "f(n) = max(g(n), h(n))"
        ],
        correctAnswer: 1,
        explanation: "f(n) = g(n) + h(n), where g(n) is the exact cost to reach node n from start, and h(n) is the estimated heuristic cost from n to goal.",
        topicTag: "A* Search"
      },
      {
        id: "ai_q2",
        question: "What property must a heuristic function h(n) possess to guarantee that tree-search A* is optimal?",
        options: [
          "It must always overestimate true cost.",
          "It must be Admissible (never overestimate the true cost to reach goal).",
          "It must be non-differentiable.",
          "It must be strictly zero for all nodes."
        ],
        correctAnswer: 1,
        explanation: "An admissible heuristic never overestimates the true remaining distance, ensuring A* never prematurely dismisses optimal paths.",
        topicTag: "Heuristics"
      },
      {
        id: "ai_q3",
        question: "Which pruning technique reduces the number of nodes evaluated by the Minimax algorithm in two-player zero-sum games?",
        options: [
          "Alpha-Beta Pruning",
          "Branch and Bound",
          "Gradient Descent",
          "Backtracking with forward checking"
        ],
        correctAnswer: 0,
        explanation: "Alpha-Beta pruning halts evaluation of a sub-branch when at least one possibility has been found that proves the move is worse than previously examined options.",
        topicTag: "Adversarial Search"
      },
      {
        id: "ai_q4",
        question: "Which search algorithm expands nodes in order of non-decreasing path cost g(n)?",
        options: [
          "Breadth-First Search",
          "Depth-First Search",
          "Uniform Cost Search (Dijkstra's equivalent)",
          "Greedy Best-First Search"
        ],
        correctAnswer: 2,
        explanation: "Uniform Cost Search orders its priority queue by cumulative path cost g(n), guaranteeing optimality for positive edge weights.",
        topicTag: "Search Strategies"
      },
      {
        id: "ai_q5",
        question: "What is the primary limitation of a single-layer Perceptron demonstrated by Minsky and Papert?",
        options: [
          "It cannot process continuous inputs.",
          "It cannot learn linearly non-separable functions like XOR.",
          "It requires quadratic memory.",
          "It cannot use backpropagation."
        ],
        correctAnswer: 1,
        explanation: "A single linear decision boundary cannot separate the XOR truth table; non-linear multilayer networks are required.",
        topicTag: "Neural Foundations"
      }
    ]
  },
  {
    id: "quiz-cc-1",
    subject: "Cloud Computing",
    title: "Cloud Service Models & Infrastructure",
    description: "Examine IaaS/PaaS/SaaS models, cloud storage, elasticity, and virtualization.",
    difficulty: "Intermediate",
    totalQuestions: 5,
    estimatedMinutes: 8,
    questions: [
      {
        id: "cc_q1",
        question: "Which cloud computing model provides the consumer with virtual machines, networking, and storage while leaving OS management to the consumer?",
        options: [
          "Software as a Service (SaaS)",
          "Platform as a Service (PaaS)",
          "Infrastructure as a Service (IaaS)",
          "Function as a Service (FaaS)"
        ],
        correctAnswer: 2, // IaaS
        explanation: "IaaS (e.g. AWS EC2, Azure VMs) provides raw compute resources where the user is responsible for OS updates, runtime, and applications.",
        topicTag: "Cloud Models"
      },
      {
        id: "cc_q2",
        question: "What is the key difference between horizontal scaling (scaling out) and vertical scaling (scaling up)?",
        options: [
          "Horizontal scaling adds more machines/nodes; vertical scaling adds more CPU/RAM to an existing machine.",
          "Vertical scaling adds more machines; horizontal scaling adds bigger hard drives.",
          "Horizontal scaling requires shutting down servers; vertical scaling never does.",
          "Horizontal scaling is only possible on bare metal."
        ],
        correctAnswer: 0,
        explanation: "Scaling out (horizontal) distributes load across multiple independent instances, improving fault tolerance and elastic capacity.",
        topicTag: "Scalability"
      },
      {
        id: "cc_q3",
        question: "In AWS or Cloud storage architecture, what type of storage is Amazon S3?",
        options: [
          "Block Storage",
          "File-system Hierarchical Storage",
          "Object Storage (RESTful key-value accessible via HTTP)",
          "Cold tape drive only"
        ],
        correctAnswer: 2,
        explanation: "S3 is an Object Store: data is stored as discrete objects with metadata and a unique key, accessible globally via HTTP REST APIs.",
        topicTag: "Storage"
      },
      {
        id: "cc_q4",
        question: "What is the core principle of 'Serverless' computing (e.g., AWS Lambda, Google Cloud Functions)?",
        options: [
          "Physical servers no longer exist in the data center.",
          "Developers do not provision or manage servers; execution is event-driven and billed only for run time.",
          "The code runs entirely inside the user's local web browser.",
          "Applications can only run for up to 30 seconds per month."
        ],
        correctAnswer: 1,
        explanation: "Serverless abstracts infrastructure management away: servers exist but are managed entirely by the cloud provider with automatic scaling from zero.",
        topicTag: "Serverless"
      },
      {
        id: "cc_q5",
        question: "Which term describes deploying an application across multiple geographically separated cloud Availability Zones to survive physical data center failure?",
        options: [
          "High Availability (HA) & Redundancy",
          "Latency Inversion",
          "Single Point of Failure",
          "Micro-caching"
        ],
        correctAnswer: 0,
        explanation: "Spreading workloads across independent availability zones ensures that a power or fiber cut at one facility does not bring down the service.",
        topicTag: "Resilience"
      }
    ]
  }
];

export const quizService = {
  getAllQuizzes() {
    return QUIZ_CATALOG;
  },

  getQuizById(id) {
    return QUIZ_CATALOG.find((q) => q.id === id) || QUIZ_CATALOG[0];
  },

  getQuizzesForSubject(subject) {
    return QUIZ_CATALOG.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  },

  // Calculate score and evaluate performance
  evaluateSubmission(quiz, userAnswers) {
    let correctCount = 0;
    const questionReview = [];
    const topicsNeedingImprovement = new Set();

    quiz.questions.forEach((q, idx) => {
      const selectedAnswer = userAnswers[idx];
      const isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        correctCount += 1;
      } else {
        topicsNeedingImprovement.add(q.topicTag);
      }

      questionReview.push({
        questionId: q.id,
        questionText: q.question,
        selectedOption: selectedAnswer !== undefined ? q.options[selectedAnswer] : "Skipped",
        correctOption: q.options[q.correctAnswer],
        isCorrect,
        explanation: q.explanation,
        topicTag: q.topicTag
      });
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const classification = adaptiveLearningService.classifyScore(percentage);

    const result = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score: correctCount,
      totalQuestions,
      percentage,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      classification, // "Strong" | "Average" | "Weak"
      topicsNeedingImprovement: Array.from(topicsNeedingImprovement),
      questionReview
    };

    // Automatically persist to storage so adaptive engine updates immediately!
    storageService.saveQuizResult({
      quizTitle: quiz.title,
      subject: quiz.subject,
      score: correctCount,
      totalQuestions,
      percentage,
      status: classification
    });

    return result;
  }
};
