export const seedData = {
  activeLearner: {
    id: "learner_01",
    name: "Alex Mercer",
    role: "student",
    xp: 2840,
    level: 7,
    streak: 6,
    lastActive: new Date().toISOString(),
    cognitiveMetrics: {
      averageAccuracy: 0.78,
      metacognitiveCalibration: 0.86, // How well confidence correlates with correctness
      cognitiveStamina: 92, // % sustained focus
      learningVelocity: 1.35, // concept acquisition multiplier
      totalSessionsCompleted: 24,
      totalQuestionsAnswered: 148
    },
    domainMastery: {
      // BKT mastery probability P(L) in [0, 1]
      math_foundations: 0.94,
      gradient_descent: 0.88,
      neural_networks: 0.81,
      backprop: 0.65,
      regularization: 0.42,
      cnn: 0.15,
      rnn_lstm: 0.0,
      transformers: 0.0,
      llm_alignment: 0.0,

      // Distributed Systems domain
      concurrency: 0.85,
      networking: 0.76,
      db_internals: 0.62,
      caching: 0.45,
      consensus: 0.10,
      event_driven: 0.0,
      microservices: 0.0
    },
    srsCards: [
      {
        id: "srs_1",
        conceptId: "backprop",
        front: "What happens to gradients during backpropagation in a very deep sigmoid network?",
        back: "Vanishing Gradients: the derivative of sigmoid maxes out at 0.25, causing multiplicative decay across layers.",
        intervalDays: 3,
        repetitions: 2,
        easeFactor: 2.5,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Due now
        masteryLevel: "Review Needed"
      },
      {
        id: "srs_2",
        conceptId: "gradient_descent",
        front: "What is the key advantage of Adam optimizer over standard SGD?",
        back: "It computes adaptive learning rates for each parameter using first (mean) and second (uncentered variance) moments.",
        intervalDays: 7,
        repetitions: 4,
        easeFactor: 2.6,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        masteryLevel: "Stable"
      },
      {
        id: "srs_3",
        conceptId: "db_internals",
        front: "Why do relational databases prefer B+ Trees over standard Binary Search Trees for disk storage?",
        back: "High branching factor reduces tree depth, minimizing expensive random disk I/O operations.",
        intervalDays: 1,
        repetitions: 1,
        easeFactor: 2.3,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // Due now
        masteryLevel: "Critical"
      }
    ],
    recentTelemetry: [
      { timestamp: "2026-09-18", accuracy: 0.82, cognitiveLoad: 45, sessionMinutes: 35 },
      { timestamp: "2026-09-19", accuracy: 0.75, cognitiveLoad: 60, sessionMinutes: 42 },
      { timestamp: "2026-09-20", accuracy: 0.88, cognitiveLoad: 52, sessionMinutes: 28 },
      { timestamp: "2026-09-21", accuracy: 0.79, cognitiveLoad: 68, sessionMinutes: 50 },
      { timestamp: "2026-09-22", accuracy: 0.85, cognitiveLoad: 55, sessionMinutes: 40 }
    ]
  },

  courses: [
    {
      id: "course_ai",
      title: "Neural Architectures & Deep Learning",
      description: "Master modern AI from vector calculus to self-attention transformers with real-time adaptive guidance.",
      category: "Artificial Intelligence",
      totalConcepts: 9,
      tags: ["Deep Learning", "Transformers", "Calculus", "PyTorch"],
      nodes: [
        {
          id: "math_foundations",
          title: "Linear Algebra & Gradient Math",
          prerequisites: [],
          level: "Foundational",
          description: "Vectors, matrices, dot products, eigenvalues, and partial derivatives.",
          category: "Theory",
          estimatedMinutes: 20
        },
        {
          id: "gradient_descent",
          title: "Loss Landscapes & Optimization",
          prerequisites: ["math_foundations"],
          level: "Foundational",
          description: "Stochastic Gradient Descent, Momentum, Adam, learning rate schedules.",
          category: "Optimization",
          estimatedMinutes: 25
        },
        {
          id: "neural_networks",
          title: "Multilayer Perceptrons & Activations",
          prerequisites: ["gradient_descent"],
          level: "Intermediate",
          description: "Feedforward architecture, non-linear activations (ReLU, GELU, Swish), expressivity.",
          category: "Architecture",
          estimatedMinutes: 30
        },
        {
          id: "backprop",
          title: "Backpropagation & Autodiff",
          prerequisites: ["neural_networks"],
          level: "Intermediate",
          description: "Chain rule computation graphs, reverse-mode autodiff, gradient flow.",
          category: "Algorithms",
          estimatedMinutes: 35
        },
        {
          id: "regularization",
          title: "Regularization & Normalization",
          prerequisites: ["backprop"],
          level: "Intermediate",
          description: "Batch Normalization, LayerNorm, Dropout, L1/L2 weight decay, avoiding overfitting.",
          category: "Optimization",
          estimatedMinutes: 25
        },
        {
          id: "cnn",
          title: "Convolutional Neural Networks",
          prerequisites: ["regularization"],
          level: "Advanced",
          description: "Convolutions, receptive fields, residual connections (ResNet), spatial invariance.",
          category: "Architecture",
          estimatedMinutes: 40
        },
        {
          id: "rnn_lstm",
          title: "Sequential Modeling & Attention",
          prerequisites: ["regularization"],
          level: "Advanced",
          description: "Recurrence, vanishing gradients in sequences, gating mechanisms (LSTM/GRU), Bahdanau attention.",
          category: "Architecture",
          estimatedMinutes: 45
        },
        {
          id: "transformers",
          title: "Transformers & Scaled Dot-Product Attention",
          prerequisites: ["rnn_lstm"],
          level: "Expert",
          description: "Multi-Head Self-Attention, QKV projections, positional encodings, FlashAttention.",
          category: "Architecture",
          estimatedMinutes: 50
        },
        {
          id: "llm_alignment",
          title: "LLM Post-Training & Alignment",
          prerequisites: ["transformers"],
          level: "Expert",
          description: "Instruction tuning, RLHF, DPO, Parameter-Efficient Fine-Tuning (LoRA, QLoRA).",
          category: "Frontier",
          estimatedMinutes: 60
        }
      ]
    },
    {
      id: "course_sys",
      title: "Distributed Systems & Cloud Scale Architecture",
      description: "Engineer resilient high-throughput distributed backends, consensus algorithms, and event streaming systems.",
      category: "Software Architecture",
      totalConcepts: 7,
      tags: ["Distributed Systems", "Raft", "Kafka", "Databases"],
      nodes: [
        {
          id: "concurrency",
          title: "Concurrency, Threads & Event Loops",
          prerequisites: [],
          level: "Foundational",
          description: "Race conditions, deadlocks, mutexes, lock-free queues, async I/O.",
          category: "Core Systems",
          estimatedMinutes: 25
        },
        {
          id: "networking",
          title: "Protocols & Low-Latency I/O",
          prerequisites: ["concurrency"],
          level: "Foundational",
          description: "TCP flow control, head-of-line blocking, HTTP/3, WebSockets, gRPC protobufs.",
          category: "Networking",
          estimatedMinutes: 30
        },
        {
          id: "db_internals",
          title: "Database Storage Engines & Indexing",
          prerequisites: ["concurrency"],
          level: "Intermediate",
          description: "B+ Trees, LSM Trees, write-ahead logging (WAL), MVCC isolation levels.",
          category: "Databases",
          estimatedMinutes: 40
        },
        {
          id: "caching",
          title: "Distributed Caching & Invalidation",
          prerequisites: ["db_internals"],
          level: "Intermediate",
          description: "Cache-aside, write-through, thundering herd, Redis clustering, consistent hashing.",
          category: "Performance",
          estimatedMinutes: 30
        },
        {
          id: "consensus",
          title: "Consensus & Fault Tolerance",
          prerequisites: ["networking", "db_internals"],
          level: "Advanced",
          description: "CAP theorem, split-brain mitigation, Raft leader election and log replication.",
          category: "Reliability",
          estimatedMinutes: 50
        },
        {
          id: "event_driven",
          title: "Event Streaming & CQRS Architecture",
          prerequisites: ["caching"],
          level: "Advanced",
          description: "Kafka partitions, consumer groups, idempotency, event sourcing patterns.",
          category: "Architecture",
          estimatedMinutes: 45
        },
        {
          id: "microservices",
          title: "Resilience, Service Mesh & Observability",
          prerequisites: ["consensus", "event_driven"],
          level: "Expert",
          description: "Circuit breakers, bulkhead pattern, distributed tracing with OpenTelemetry, Envoy.",
          category: "Production",
          estimatedMinutes: 55
        }
      ]
    }
  ],

  // Calibrated questions repository across 4 IRT difficulty bands:
  // Novice (0.1 - 0.3), Intermediate (0.31 - 0.6), Advanced (0.61 - 0.8), Expert (0.81 - 1.0)
  questions: [
    // --- math_foundations ---
    {
      id: "q_mf_1",
      conceptId: "math_foundations",
      difficulty: 0.2, // b-parameter
      discrimination: 1.1, // a-parameter
      guessing: 0.25, // c-parameter
      bloomLevel: "Recall",
      title: "Matrix-Vector Dimensions",
      questionText: "If matrix A has dimensions (4, 8) and vector x has dimensions (8, 1), what are the dimensions of the product Ax?",
      codeSnippet: "A = np.random.randn(4, 8)\nx = np.random.randn(8, 1)\n# What is A.dot(x).shape?",
      options: [
        { id: "opt_1", text: "(4, 1)", isCorrect: true, explanation: "Inner dimensions match (8), resulting in row count of A and col count of x (4, 1)." },
        { id: "opt_2", text: "(8, 4)", isCorrect: false, explanation: "Reversing dimensions is a common matrix multiplication transpose confusion.", misconceptionType: "Dimension Inversion" },
        { id: "opt_3", text: "(4, 4)", isCorrect: false, explanation: "A non-square product only yields square matrices if both dimensions are identical.", misconceptionType: "Square Assumption" },
        { id: "opt_4", text: "Incompatible shapes error", isCorrect: false, explanation: "The inner dimensions both equal 8, so the operation is fully valid.", misconceptionType: "Rule Misapplication" }
      ],
      hints: [
        "Recall the standard rule: for (m, k) multiplied by (k, n), the inner dimension 'k' must cancel out.",
        "The output shape always inherits the outer dimensions: rows of the first, columns of the second."
      ]
    },
    {
      id: "q_mf_2",
      conceptId: "math_foundations",
      difficulty: 0.5,
      discrimination: 1.4,
      guessing: 0.25,
      bloomLevel: "Application",
      title: "Jacobian vs Gradient",
      questionText: "What mathematical object describes the matrix of all first-order partial derivatives of a vector-valued function f: R^n -> R^m?",
      codeSnippet: null,
      options: [
        { id: "opt_1", text: "The Jacobian Matrix of size (m, n)", isCorrect: true, explanation: "The Jacobian collects all first partial derivatives of an m-dimensional vector function with respect to n inputs." },
        { id: "opt_2", text: "The Hessian Matrix of size (n, n)", isCorrect: false, explanation: "The Hessian contains second-order partial derivatives of a scalar function, not first derivatives of a vector function.", misconceptionType: "Derivative Order Confusion" },
        { id: "opt_3", text: "The Laplacian Operator", isCorrect: false, explanation: "The Laplacian is the divergence of the gradient (second-order scalar).", misconceptionType: "Operator Confusion" },
        { id: "opt_4", text: "The Covariance Tensor", isCorrect: false, explanation: "Covariance measures joint variability of random variables, not functional derivatives.", misconceptionType: "Statistical Substitution" }
      ],
      hints: [
        "Think about first-order derivatives versus second-order derivatives.",
        "When dealing with vector outputs, you have multiple output functions each differentiated against multiple inputs."
      ]
    },

    // --- gradient_descent ---
    {
      id: "q_gd_1",
      conceptId: "gradient_descent",
      difficulty: 0.35,
      discrimination: 1.2,
      guessing: 0.25,
      bloomLevel: "Recall",
      title: "Momentum in Gradient Descent",
      questionText: "How does the 'Momentum' term physically assist optimization on ill-conditioned loss surfaces (e.g. narrow ravines)?",
      codeSnippet: "v = beta * v + (1 - beta) * grad\ntheta = theta - alpha * v",
      options: [
        { id: "opt_1", text: "It dampens oscillations in high-curvature directions while accumulating velocity along flatter slopes.", isCorrect: true, explanation: "By averaging successive gradients, opposing zig-zag vectors cancel out while consistent forward directions build velocity." },
        { id: "opt_2", text: "It guarantees convergence to the global minimum in non-convex landscapes.", isCorrect: false, explanation: "No gradient descent variant guarantees global optimality for general non-convex objectives.", misconceptionType: "Overgeneralization" },
        { id: "opt_3", text: "It dynamically adjusts the learning rate independently for each parameter dimension.", isCorrect: false, explanation: "Adaptive learning rate scaling across dimensions is handled by RMSprop/Adam, not pure classical momentum.", misconceptionType: "Algorithm Conflation" },
        { id: "opt_4", text: "It computes the exact second derivative to step directly to the minimum.", isCorrect: false, explanation: "That describes Newton-Raphson methods, which require inverting the Hessian.", misconceptionType: "Second-Order Misconception" }
      ],
      hints: [
        "Picture a heavy ball rolling down a steep U-shaped ravine.",
        "What happens to the left-right bouncing motions when you average them over time?"
      ]
    },
    {
      id: "q_gd_2",
      conceptId: "gradient_descent",
      difficulty: 0.72,
      discrimination: 1.6,
      guessing: 0.25,
      bloomLevel: "Analysis",
      title: "Adam Bias Correction",
      questionText: "In the Adam optimizer, why is bias correction applied to the first and second moment estimates (m_hat = m / (1 - beta1^t))?",
      codeSnippet: "m = beta1 * m + (1 - beta1) * g\nv = beta2 * v + (1 - beta2) * (g ** 2)\n# Bias correction applied next",
      options: [
        { id: "opt_1", text: "Because m and v are initialized to zero, biasing early step estimates severely toward zero.", isCorrect: true, explanation: "At t=1, m=(1-beta1)g. If beta1=0.9, m is only 0.1g! Dividing by 1 - 0.9^1 = 0.1 unbiases the expectation." },
        { id: "opt_2", text: "To prevent exploding gradients when beta2 approaches 1.0.", isCorrect: false, explanation: "Bias correction does not clip gradients; gradient clipping handles explosions.", misconceptionType: "Mechanism Misattribution" },
        { id: "opt_3", text: "To convert stochastic gradients into deterministic batch gradients.", isCorrect: false, explanation: "Adam remains inherently stochastic when trained with minibatches.", misconceptionType: "Stochasticity Misunderstanding" },
        { id: "opt_4", text: "To guarantee positive definiteness of the parameter covariance matrix.", isCorrect: false, explanation: "Adam does not construct parameter covariance matrices.", misconceptionType: "Second-Order Theory Slip" }
      ],
      hints: [
        "Look at what value 'm' holds at the very first iteration t = 1 when m_0 = 0.",
        "Notice that as time step t becomes large, beta^t rapidly decays to zero, making (1 - beta^t) close to 1."
      ]
    },

    // --- backprop ---
    {
      id: "q_bp_1",
      conceptId: "backprop",
      difficulty: 0.45,
      discrimination: 1.3,
      guessing: 0.25,
      bloomLevel: "Application",
      title: "Chain Rule in Computational Graphs",
      questionText: "Given z = f(y) and y = g(x), what is the correct backpropagation message passed from node z to node x?",
      codeSnippet: "dz_dx = (dz / dy) * (dy / dx)",
      options: [
        { id: "opt_1", text: "The upstream gradient dz/dy is multiplied by the local Jacobian dy/dx.", isCorrect: true, explanation: "Reverse-mode automatic differentiation systematically applies the multi-variable chain rule." },
        { id: "opt_2", text: "The upstream gradient is added to the local gradient: dz/dy + dy/dx.", isCorrect: false, explanation: "Chain rule requires multiplication; gradients only sum when branches reconverge.", misconceptionType: "Operator Confusion" },
        { id: "opt_3", text: "The local gradient dy/dx is divided by dz/dy.", isCorrect: false, explanation: "Gradients compose via multiplication along computational paths.", misconceptionType: "Algebraic Slip" },
        { id: "opt_4", text: "The gradient is solely dy/dx because x only touches y directly.", isCorrect: false, explanation: "Ignoring upstream sensitivity dz/dy disconnects the loss from the parameter.", misconceptionType: "Loss Disconnection" }
      ],
      hints: [
        "Recall how small perturbations in x ripple through y and finally affect z.",
        "Think of Leibniz notation: dz/dx = dz/dy * dy/dx."
      ]
    },
    {
      id: "q_bp_2",
      conceptId: "backprop",
      difficulty: 0.82,
      discrimination: 1.7,
      guessing: 0.25,
      bloomLevel: "Synthesis",
      title: "Gradient Flow Through Residual Connections",
      questionText: "In ResNet with identity mapping y = F(x, W) + x, why do gradients flow without vanishing even when F has many layers?",
      codeSnippet: "# Forward: y = F(x) + x\n# Backward: dL/dx = dL/dy * (dF/dx + 1)",
      options: [
        { id: "opt_1", text: "The additive term '+ 1' ensures the gradient has a direct highway dL/dx = dL/dy + dL/dy*(dF/dx), never decaying to zero even if dF/dx approaches 0.", isCorrect: true, explanation: "Because of the distributive property of differentiation over addition, the +1 term passes the upstream gradient directly backward unattenuated." },
        { id: "opt_2", text: "The skip connection multiplies the weights by the identity matrix, reversing gradient decay.", isCorrect: false, explanation: "Identity shortcuts do not involve matrix multiplications; they are pure parameter-free additions.", misconceptionType: "Operation Misconception" },
        { id: "opt_3", text: "The skip connection normalizes the activation variance to 1.0.", isCorrect: false, explanation: "That is the role of LayerNorm or BatchNorm, not the residual skip connection itself.", misconceptionType: "Module Conflation" },
        { id: "opt_4", text: "It causes the loss function to become strictly convex.", isCorrect: false, explanation: "Deep ResNets remain highly non-convex.", misconceptionType: "Loss Geometry Misunderstanding" }
      ],
      hints: [
        "Take the derivative of y = F(x) + x with respect to x.",
        "What is d(x)/dx?"
      ]
    },

    // --- transformers ---
    {
      id: "q_tf_1",
      conceptId: "transformers",
      difficulty: 0.58,
      discrimination: 1.4,
      guessing: 0.25,
      bloomLevel: "Recall",
      title: "Scaled Dot-Product Attention Formula",
      questionText: "Why is the dot product of Queries (Q) and Keys (K) divided by sqrt(d_k) in Scaled Dot-Product Attention?",
      codeSnippet: "Attention(Q, K, V) = softmax((Q @ K.T) / np.sqrt(d_k)) @ V",
      options: [
        { id: "opt_1", text: "To prevent the dot products from growing large in high dimensions, which pushes softmax into regions with vanishingly small gradients.", isCorrect: true, explanation: "For large d_k, the dot product variance scales with d_k. Large logits saturate the softmax, killing gradients during backpropagation." },
        { id: "opt_2", text: "To ensure that the attention matrix has determinant equal to 1.", isCorrect: false, explanation: "Attention weights are stochastic probabilities (summing to 1 per row), but the matrix determinant is not constrained to 1.", misconceptionType: "Linear Algebra Fallacy" },
        { id: "opt_3", text: "To enforce orthogonality between Query and Key vector spaces.", isCorrect: false, explanation: "Scaling by a scalar preserves angles and cannot enforce orthogonality.", misconceptionType: "Geometric Confusion" },
        { id: "opt_4", text: "To reduce the computational time complexity of the matrix multiplication.", isCorrect: false, explanation: "Dividing by a scalar does not change the O(N^2 * d) time complexity.", misconceptionType: "Complexity Fallacy" }
      ],
      hints: [
        "Think about what happens to the variance of the sum of d_k independent random variables.",
        "What happens to the derivative of softmax when the input values are extremely large?"
      ]
    },
    {
      id: "q_tf_2",
      conceptId: "transformers",
      difficulty: 0.88,
      discrimination: 1.8,
      guessing: 0.25,
      bloomLevel: "Expert",
      title: "FlashAttention Memory Hierarchy",
      questionText: "What architectural innovation enables FlashAttention to achieve 2-4x speedups without changing the exact mathematical output of attention?",
      codeSnippet: null,
      options: [
        { id: "opt_1", text: "Tiling attention computation using online softmax to keep intermediate QK^T matrices in fast GPU SRAM, avoiding slow High Bandwidth Memory (HBM) round-trips.", isCorrect: true, explanation: "FlashAttention is IO-aware: it computes softmax incrementally in blocks without materializing the N x N attention matrix in global memory." },
        { id: "opt_2", text: "Quantizing all Key and Value vectors to 4-bit integers on the fly.", isCorrect: false, explanation: "FlashAttention is an exact attention algorithm, preserving standard FP16/BF16 numerical precision without quantization.", misconceptionType: "Approximation Confusion" },
        { id: "opt_3", text: "Pruning 90% of attention heads using low-rank singular value decomposition.", isCorrect: false, explanation: "FlashAttention evaluates all heads exactly without structural pruning.", misconceptionType: "Pruning Misattribution" },
        { id: "opt_4", text: "Replacing standard multi-head attention with state-space linear recurrences (Mamba).", isCorrect: false, explanation: "FlashAttention accelerates true attention, whereas State Space Models are an alternate architecture.", misconceptionType: "Architectural Substitution" }
      ],
      hints: [
        "Consider the bottleneck in modern GPUs: is it floating-point computation (TFLOPs) or memory bandwidth (GB/s)?",
        "How big is an N x N matrix when context length N is 32,768 tokens?"
      ]
    },

    // --- db_internals ---
    {
      id: "q_db_1",
      conceptId: "db_internals",
      difficulty: 0.38,
      discrimination: 1.2,
      guessing: 0.25,
      bloomLevel: "Recall",
      title: "Write-Ahead Logging (WAL)",
      questionText: "What critical guarantee does the Write-Ahead Log provide before committing changes to data pages?",
      codeSnippet: null,
      options: [
        { id: "opt_1", text: "Durability and Atomicity: change records are flushed sequentially to disk before modified dirty buffer pages are written back asynchronously.", isCorrect: true, explanation: "If the server crashes, the WAL can replay committed transactions (REDO) and roll back uncommitted ones (UNDO)." },
        { id: "opt_2", text: "It guarantees zero disk fragmentation over long table lifespans.", isCorrect: false, explanation: "WAL does not manage table page fragmentation.", misconceptionType: "Physical Layout Confusion" },
        { id: "opt_3", text: "It eliminates the need for B-Tree indexes on primary keys.", isCorrect: false, explanation: "WAL is an append-only log; it is not an indexed query search structure.", misconceptionType: "Data Structure Conflation" },
        { id: "opt_4", text: "It prevents two transactions from modifying the same row simultaneously.", isCorrect: false, explanation: "Concurrency control (locks or MVCC) prevents race conditions, not WAL.", misconceptionType: "Concurrency Mechanism Conflation" }
      ],
      hints: [
        "Notice the phrase 'Write-Ahead': write to what, ahead of what?",
        "What happens if power is cut right in the middle of writing modified memory pages to disk?"
      ]
    },
    {
      id: "q_db_2",
      conceptId: "db_internals",
      difficulty: 0.78,
      discrimination: 1.6,
      guessing: 0.25,
      bloomLevel: "Analysis",
      title: "LSM Tree vs B+ Tree Tradeoffs",
      questionText: "Why do high-write storage systems like Cassandra and RocksDB use Log-Structured Merge (LSM) Trees rather than B+ Trees?",
      codeSnippet: null,
      options: [
        { id: "opt_1", text: "LSM Trees convert random writes into sequential writes via an in-memory MemTable flushed to append-only SSTables, dramatically improving write throughput.", isCorrect: true, explanation: "B+ Trees suffer from random disk writes and page splits. LSM trees defer and amortize organization through background compaction." },
        { id: "opt_2", text: "LSM Trees provide O(1) worst-case point lookup latencies without caching.", isCorrect: false, explanation: "LSM lookups are slower than B+ Trees because multiple SSTables and bloom filters may need scanning.", misconceptionType: "Lookup Complexity Error" },
        { id: "opt_3", text: "LSM Trees do not consume any RAM during write bursts.", isCorrect: false, explanation: "LSM trees rely heavily on RAM for the active MemTable.", misconceptionType: "Memory Model Inversion" },
        { id: "opt_4", text: "LSM Trees completely eliminate read and write amplification.", isCorrect: false, explanation: "LSM background compaction creates significant write and read amplification.", misconceptionType: "Amplification Myth" }
      ],
      hints: [
        "Compare the speed of sequential disk/SSD writes versus scattered random writes.",
        "Where do new incoming writes land first in an LSM tree?"
      ]
    },

    // --- consensus ---
    {
      id: "q_cs_1",
      conceptId: "consensus",
      difficulty: 0.48,
      discrimination: 1.3,
      guessing: 0.25,
      bloomLevel: "Application",
      title: "Raft Quorum Requirements",
      questionText: "In a 5-node cluster running the Raft consensus protocol, what is the minimum number of nodes required to form a majority quorum for leader election and log commits?",
      codeSnippet: null,
      options: [
        { id: "opt_1", text: "3 nodes (floor(N/2) + 1)", isCorrect: true, explanation: "A strict majority of 5 is 3. Any two quorums of 3 nodes must overlap by at least one node, preventing split-brain." },
        { id: "opt_2", text: "2 nodes", isCorrect: false, explanation: "2 nodes out of 5 could allow two conflicting minorities of 2 nodes each to claim leadership.", misconceptionType: "Minority Split-Brain" },
        { id: "opt_3", text: "4 nodes", isCorrect: false, explanation: "4 out of 5 is a supermajority (80%), which is overly strict and reduces fault tolerance.", misconceptionType: "Supermajority Overkill" },
        { id: "opt_4", text: "All 5 nodes must agree synchronously", isCorrect: false, explanation: "Requiring unanimous agreement means a single node failure would halt the entire system.", misconceptionType: "Unanimity Misconception" }
      ],
      hints: [
        "A quorum must be strictly greater than half of the total cluster nodes.",
        "Consider the Pigeonhole Principle: two majorities must always share at least one common member."
      ]
    }
  ],

  // Cohort analytics for Educator Studio
  cohortTelemetry: {
    cohortName: "Deep Systems Engineering 2026",
    totalStudents: 32,
    activeToday: 24,
    classAverageMastery: 71.4,
    atRiskStudentsCount: 3,
    students: [
      { id: "s1", name: "Alex Mercer", mastery: 78, velocity: 1.35, riskLevel: "low", lastTopic: "Transformers", confidenceCalibration: 86 },
      { id: "s2", name: "Elena Rostova", mastery: 94, velocity: 1.62, riskLevel: "low", lastTopic: "LLM Alignment", confidenceCalibration: 92 },
      { id: "s3", name: "Marcus Vance", mastery: 41, velocity: 0.65, riskLevel: "critical", lastTopic: "Backpropagation", confidenceCalibration: 48, struggleConcept: "Gradient Flow" },
      { id: "s4", name: "Priya Sharma", mastery: 88, velocity: 1.40, riskLevel: "low", lastTopic: "FlashAttention", confidenceCalibration: 89 },
      { id: "s5", name: "Jordan Reed", mastery: 52, velocity: 0.82, riskLevel: "moderate", lastTopic: "Regularization", confidenceCalibration: 62, struggleConcept: "Batch Normalization" },
      { id: "s6", name: "Sophia Chen", mastery: 84, velocity: 1.28, riskLevel: "low", lastTopic: "LSM Trees", confidenceCalibration: 85 },
      { id: "s7", name: "Tariq Mansoor", mastery: 46, velocity: 0.70, riskLevel: "critical", lastTopic: "Database WAL", confidenceCalibration: 51, struggleConcept: "ACID Isolation" },
      { id: "s8", name: "Chloe Dupont", mastery: 77, velocity: 1.15, riskLevel: "low", lastTopic: "Raft Quorums", confidenceCalibration: 80 }
    ],
    conceptBottlenecks: [
      { conceptId: "backprop", conceptTitle: "Backpropagation & Autodiff", failureRate: 48, commonMisconception: "Conflating gradient summation with multiplication along branches" },
      { conceptId: "regularization", conceptTitle: "Regularization & Normalization", failureRate: 39, commonMisconception: "Applying train-time running statistics during inference" },
      { conceptId: "transformers", conceptTitle: "Scaled Dot-Product Attention", failureRate: 35, commonMisconception: "Softmax saturation due to unscaled variance" },
      { conceptId: "db_internals", conceptTitle: "Database Storage & Indexing", failureRate: 31, commonMisconception: "Underestimating random I/O cost in deep B+ Trees" }
    ]
  }
};
