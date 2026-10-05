// Course Catalog & Content Service
// Provides structured curricula, lesson modules, video lectures, notes, and practice items.

export const COURSES = [
  {
    id: "cn-101",
    title: "Computer Networks",
    category: "Networking & Protocols",
    difficulty: "Intermediate",
    description: "Master network architecture from physical bit transmission to application-layer protocols, socket programming, and routing algorithms.",
    icon: "Network",
    color: "#ef4444", // Highlighted as current weak area (45%)
    badge: "Weak Area Alert (45%)",
    totalLessons: 6,
    durationHours: 12,
    rating: 4.8,
    instructor: "Dr. Arvind Ramesh",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Foundations of Computer Networks",
        lessons: [
          {
            id: "cn-l1",
            title: "Lesson 1: Introduction to OSI 7-Layer Reference Model",
            duration: "18 mins",
            videoPlaceholderTitle: "Visual Deep Dive: How Bits Traverse the 7 Layers of OSI",
            videoDuration: "14:20",
            notes: `### The OSI 7-Layer Reference Model
The Open Systems Interconnection (OSI) model characterizes and standardizes the communication functions of a telecommunication or computing system without regard to its underlying internal structure and technology.

#### 1. Physical Layer (Layer 1)
- **Role**: Transmission and reception of raw bit streams over a physical medium (copper cable, optical fiber, wireless RF).
- **Data Unit**: Bits.
- **Protocols & Hardware**: Ethernet cables (Cat6), Hubs, Repeaters, DSL.

#### 2. Data Link Layer (Layer 2)
- **Role**: Node-to-node data transfer, framing, physical MAC addressing, and error detection (CRC).
- **Data Unit**: Frames.
- **Protocols & Hardware**: Ethernet (802.3), Wi-Fi (802.11), Switches, Bridges.

#### 3. Network Layer (Layer 3)
- **Role**: Host-to-host routing and logical addressing across multiple independent networks.
- **Data Unit**: Packets.
- **Protocols & Hardware**: IPv4, IPv6, ICMP, Routers, Layer-3 switches.

#### 4. Transport Layer (Layer 4)
- **Role**: End-to-end process-to-process delivery, flow control, segmentation, and reliability.
- **Data Unit**: Segments (TCP) or Datagrams (UDP).
- **Key Protocols**: TCP (Transmission Control Protocol), UDP (User Datagram Protocol).`,
            keyConcepts: [
              "Data Encapsulation: Headers are appended at each layer as payload travels down the stack.",
              "MAC vs IP: MAC addresses are permanently burned physical identifiers; IP addresses are hierarchically assigned logical locators.",
              "Layer 4 Port Addressing: Distinguishes individual processes (e.g. Web server on port 80/443, SSH on port 22)."
            ],
            practiceQuestions: [
              {
                q: "At which OSI layer does packet routing across different networks take place?",
                a: "Network Layer (Layer 3)"
              },
              {
                q: "What is the primary protocol data unit (PDU) at the Transport Layer for TCP?",
                a: "Segment"
              }
            ]
          },
          {
            id: "cn-l2",
            title: "Lesson 2: TCP vs UDP & The 3-Way Handshake",
            duration: "22 mins",
            videoPlaceholderTitle: "TCP 3-Way Handshake & Connection Teardown Explained",
            videoDuration: "16:45",
            notes: `### Transmission Control Protocol (TCP) vs User Datagram Protocol (UDP)

#### TCP Characteristics:
- **Connection-Oriented**: Requires establishing a reliable session before data can transfer.
- **Reliable Delivery**: Acknowledges received segments; retransmits lost packets automatically.
- **Flow Control & Congestion Control**: Uses sliding windows and congestion avoidance algorithms (CUBIC, Reno).

#### The 3-Way Handshake (SYN -> SYN-ACK -> ACK):
1. **SYN**: Client picks an Initial Sequence Number (ISN) $x$ and sends a segment with SYN flag set.
2. **SYN-ACK**: Server acknowledges with ACK $x+1$, picks its own sequence number $y$, and sets SYN flag.
3. **ACK**: Client acknowledges with ACK $y+1$. The connection is now ESTABLISHED!`,
            keyConcepts: [
              "3-Way Handshake eliminates half-open connections.",
              "UDP is lightweight, ideal for live video streaming and gaming where low latency beats retransmission delay."
            ],
            practiceQuestions: [
              {
                q: "What flag does a client send to initiate termination of a TCP connection?",
                a: "FIN flag"
              }
            ]
          },
          {
            id: "cn-l3",
            title: "Lesson 3: IPv4 Addressing, CIDR & Subnetting",
            duration: "25 mins",
            videoPlaceholderTitle: "Mastering Subnetting & CIDR Notation in 20 Minutes",
            videoDuration: "20:10",
            notes: `### IPv4 Addressing and Subnet Masks
An IPv4 address consists of 32 bits divided into 4 octets separated by dots (e.g., 192.168.1.10).

#### CIDR (Classless Inter-Domain Routing):
In CIDR notation \`/24\`, the number after the slash indicates how many bits belong to the network prefix:
- \`/24\` = 24 network bits, 8 host bits ($2^8 - 2 = 254$ usable hosts)
- \`/26\` = 26 network bits, 6 host bits ($2^6 - 2 = 62$ usable hosts)`,
            keyConcepts: [
              "Network Address (all host bits 0) and Broadcast Address (all host bits 1) are reserved and cannot be assigned to individual hosts.",
              "Subnetting prevents broadcast storms and isolates organizational departments."
            ],
            practiceQuestions: [
              {
                q: "How many usable host IP addresses are available in a /28 subnet?",
                a: "14 usable hosts (2^4 - 2 = 14)"
              }
            ]
          }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Routing & Application Layer Protocols",
        lessons: [
          {
            id: "cn-l4",
            title: "Lesson 4: Routing Algorithms: Link-State vs Distance-Vector",
            duration: "24 mins",
            videoPlaceholderTitle: "Dijkstra's Link-State vs Bellman-Ford Distance-Vector",
            videoDuration: "18:00",
            notes: "Study routing information protocols (RIP), Open Shortest Path First (OSPF), and Border Gateway Protocol (BGP).",
            keyConcepts: ["Link-State floods complete topological maps.", "BGP is the glue of the global internet."],
            practiceQuestions: [{ q: "Which algorithm does OSPF use?", a: "Dijkstra's Shortest Path First" }]
          },
          {
            id: "cn-l5",
            title: "Lesson 5: DNS, HTTP/2, HTTP/3 and Web Protocols",
            duration: "20 mins",
            videoPlaceholderTitle: "How DNS Recursion and HTTP/3 QUIC Work",
            videoDuration: "15:30",
            notes: "Domain Name System resolution hierarchy from Root servers down to Authoritative nameservers.",
            keyConcepts: ["DNS maps domain names to IP addresses.", "HTTP/3 uses QUIC over UDP to eliminate head-of-line blocking."],
            practiceQuestions: [{ q: "Which port does HTTPS typically operate on?", a: "Port 443" }]
          },
          {
            id: "cn-l6",
            title: "Lesson 6: Network Security, Firewalls & Cryptography",
            duration: "22 mins",
            videoPlaceholderTitle: "TLS 1.3 Handshake, Asymmetric Encryption & Firewalls",
            videoDuration: "17:40",
            notes: "Symmetric vs asymmetric keys, RSA, Elliptic Curve Cryptography, and packet-filtering firewalls.",
            keyConcepts: ["TLS uses asymmetric crypto for session key negotiation, then switches to fast AES symmetric crypto."],
            practiceQuestions: [{ q: "What does TLS provide?", a: "Confidentiality, Integrity, and Authentication" }]
          }
        ]
      }
    ]
  },
  {
    id: "py-101",
    title: "Python Programming",
    category: "Software Development",
    difficulty: "Beginner - Intermediate",
    description: "From core procedural programming to OOP, functional generators, decorators, and production patterns.",
    icon: "Code",
    color: "#10b981", // Strong area (82%)
    badge: "Strong Area (82%)",
    totalLessons: 6,
    durationHours: 14,
    rating: 4.9,
    instructor: "Prof. Priya Nair",
    modules: [
      {
        id: "py-mod-1",
        title: "Module 1: Advanced Data Structures & Comprehensions",
        lessons: [
          {
            id: "py-l1",
            title: "Lesson 1: Deep Dive into List & Dict Comprehensions",
            duration: "15 mins",
            videoPlaceholderTitle: "Idiomatic Pythonic Data Transformations",
            videoDuration: "12:00",
            notes: "Learn concise list comprehensions, conditional filtering, and dictionary mapping expressions.",
            keyConcepts: ["Comprehensions are faster than manual for-loops in CPython bytecode."],
            practiceQuestions: [{ q: "Can list comprehensions be nested?", a: "Yes, though readability should be preserved." }]
          },
          {
            id: "py-l2",
            title: "Lesson 2: Object-Oriented Python & Dunder Methods",
            duration: "22 mins",
            videoPlaceholderTitle: "Magic Methods (__init__, __str__, __repr__, __call__)",
            videoDuration: "18:00",
            notes: "Master custom object behavior, operator overloading, and class inheritance.",
            keyConcepts: ["Dunder methods allow custom classes to integrate with built-in language semantics."],
            practiceQuestions: [{ q: "What method defines string representation for developers?", a: "__repr__" }]
          },
          {
            id: "py-l3",
            title: "Lesson 3: Decorators and Higher-Order Functions",
            duration: "20 mins",
            videoPlaceholderTitle: "Function Decorators and Closures Demystified",
            videoDuration: "16:30",
            notes: "Wrapping function behaviors with @syntax, timing decorators, and authentication wrappers.",
            keyConcepts: ["Functions are first-class citizens in Python."],
            practiceQuestions: [{ q: "What does functools.wraps do?", a: "Preserves the decorated function's original docstring and name." }]
          }
        ]
      }
    ]
  },
  {
    id: "db-101",
    title: "Database Management (DBMS)",
    category: "Data & Storage",
    difficulty: "Intermediate",
    description: "Relational modeling, SQL optimization, ACID transactions, Normalization (1NF to BCNF), and NoSQL engines.",
    icon: "Database",
    color: "#f59e0b", // Average (68%)
    badge: "Average Area (68%)",
    totalLessons: 5,
    durationHours: 10,
    rating: 4.7,
    instructor: "Dr. Vikram Seth",
    modules: [
      {
        id: "db-mod-1",
        title: "Module 1: Relational Theory & Normalization",
        lessons: [
          {
            id: "db-l1",
            title: "Lesson 1: Entity-Relationship Diagrams to Relational Tables",
            duration: "20 mins",
            videoPlaceholderTitle: "ER Modeling and Foreign Key Relationships",
            videoDuration: "15:00",
            notes: "Translate business entities and relationships into normalized relational schemas.",
            keyConcepts: ["Cardinality ratios: 1:1, 1:N, M:N relationships."],
            practiceQuestions: [{ q: "How are Many-to-Many relationships represented?", a: "Through a junction/associative table with composite foreign keys." }]
          },
          {
            id: "db-l2",
            title: "Lesson 2: Database Normalization (1NF, 2NF, 3NF, BCNF)",
            duration: "25 mins",
            videoPlaceholderTitle: "Eliminating Update Anomalies with Normalization",
            videoDuration: "21:00",
            notes: "Identify insertion, deletion, and update anomalies and decompose tables gracefully.",
            keyConcepts: ["3NF removes transitive functional dependencies."],
            practiceQuestions: [{ q: "What does 1NF guarantee?", a: "Atomic values in every column." }]
          }
        ]
      }
    ]
  },
  {
    id: "ai-101",
    title: "Artificial Intelligence",
    category: "AI & Machine Learning",
    difficulty: "Advanced",
    description: "Search algorithms, knowledge representation, game playing, probabilistic reasoning, and introduction to neural networks.",
    icon: "Cpu",
    color: "#10b981", // Strong area (88%)
    badge: "Strong Area (88%)",
    totalLessons: 6,
    durationHours: 16,
    rating: 4.9,
    instructor: "Dr. Elena Rostova",
    modules: [
      {
        id: "ai-mod-1",
        title: "Module 1: Search & Heuristics",
        lessons: [
          {
            id: "ai-l1",
            title: "Lesson 1: Uninformed vs Informed Heuristic Search",
            duration: "22 mins",
            videoPlaceholderTitle: "BFS, DFS, Uniform Cost Search, and A* Search",
            videoDuration: "19:00",
            notes: "Formulating problems as state-space trees and applying heuristic evaluation functions.",
            keyConcepts: ["A* combines past cost g(n) with projected heuristic h(n)."],
            practiceQuestions: [{ q: "When is A* search optimal?", a: "When the heuristic h(n) is admissible and consistent." }]
          }
        ]
      }
    ]
  },
  {
    id: "cc-101",
    title: "Cloud Computing",
    category: "Cloud & DevOps",
    difficulty: "Intermediate",
    description: "Cloud service models (IaaS/PaaS/SaaS), virtualization, containerization, serverless computing, and AWS/Azure architectures.",
    icon: "Cloud",
    color: "#f59e0b", // Average area (76%)
    badge: "Average Area (76%)",
    totalLessons: 5,
    durationHours: 11,
    rating: 4.6,
    instructor: "Marcus Vance",
    modules: [
      {
        id: "cc-mod-1",
        title: "Module 1: Cloud Architecture Fundamentals",
        lessons: [
          {
            id: "cc-l1",
            title: "Lesson 1: Cloud Deployment Models & Shared Responsibility",
            duration: "18 mins",
            videoPlaceholderTitle: "Public, Private, Hybrid Cloud & The Shared Responsibility Matrix",
            videoDuration: "14:00",
            notes: "Understand who secures what in cloud environments across IaaS, PaaS, and SaaS.",
            keyConcepts: ["In IaaS, the customer secures the OS and runtime."],
            practiceQuestions: [{ q: "Give an example of SaaS.", a: "Google Workspace, Microsoft 365" }]
          }
        ]
      }
    ]
  },
  {
    id: "dsa-101",
    title: "Data Structures & Algorithms",
    category: "Computer Science Core",
    difficulty: "Intermediate - Advanced",
    description: "Arrays, linked lists, trees, graphs, sorting algorithms, dynamic programming, and complexity analysis.",
    icon: "Binary",
    color: "#3b82f6",
    badge: "CS Core Essential",
    totalLessons: 6,
    durationHours: 18,
    rating: 4.8,
    instructor: "Prof. Rajesh K.",
    modules: [
      {
        id: "dsa-mod-1",
        title: "Module 1: Linear Data Structures & Complexity",
        lessons: [
          {
            id: "dsa-l1",
            title: "Lesson 1: Big-O Asymptotic Complexity & Space Invariants",
            duration: "20 mins",
            videoPlaceholderTitle: "Visualizing O(1), O(log n), O(n), O(n log n) and O(n^2)",
            videoDuration: "16:00",
            notes: "Master asymptotic notations: Big-O (upper bound), Big-Omega (lower bound), and Big-Theta (tight bound).",
            keyConcepts: ["Constant factors are omitted in asymptotic Big-O analysis."],
            practiceQuestions: [{ q: "What is binary search time complexity?", a: "O(log n)" }]
          }
        ]
      }
    ]
  },
  {
    id: "js-101",
    title: "JavaScript & Modern Web Architectures",
    category: "Web Development",
    difficulty: "Beginner - Intermediate",
    description: "ES6+, Event Loop, asynchronous Promises, DOM manipulation, and modern component design.",
    icon: "Globe",
    color: "#f59e0b",
    badge: "Web Core",
    totalLessons: 5,
    durationHours: 12,
    rating: 4.7,
    instructor: "Sarah Jenkins",
    modules: [
      {
        id: "js-mod-1",
        title: "Module 1: JavaScript Runtime & Asynchrony",
        lessons: [
          {
            id: "js-l1",
            title: "Lesson 1: The Event Loop, Call Stack & Microtask Queue",
            duration: "18 mins",
            videoPlaceholderTitle: "How JavaScript Executes Async Code Under the Hood",
            videoDuration: "15:00",
            notes: "Demystifying single-threaded concurrency in Node.js and modern browser engines.",
            keyConcepts: ["Promise microtasks execute before setTimeout macrotasks."],
            practiceQuestions: [{ q: "Is JavaScript multi-threaded by default?", a: "No, it is single-threaded with an event loop." }]
          }
        ]
      }
    ]
  }
];

import { storageService } from "./storage";

export const courseService = {
  getAllCourses() {
    const customCourses = storageService.getCustomCourses();
    return [...customCourses, ...COURSES];
  },

  getCourseById(id) {
    const all = this.getAllCourses();
    return all.find((c) => c.id === id) || all[0];
  },

  addCustomCourse(courseData) {
    return storageService.saveCustomCourse(courseData);
  },

  deleteCustomCourse(id) {
    return storageService.deleteCustomCourse(id);
  }
};

