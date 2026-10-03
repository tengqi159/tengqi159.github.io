window.paperStories = [
  {
    "id": "mirage",
    "title": "MIRAGE: Hierarchical MI-Surrogate Regulation for Graph Contrastive Learning",
    "link": "https://neurips.cc/virtual/2026/poster/151455",
    "evidenceUrl": "https://neurips.cc/virtual/2026/poster/151455",
    "evidenceLevel": "method",
    "shortName": "MIRAGE",
    "summary": "MIRAGE calibrates cross-view agreement through bounded node-wise alignment budgets and dual-view MI-surrogate stabilization.",
    "steps": [
      {
        "label": "Two graph views",
        "visual": "views",
        "description": "Learn node representations from two views of an attributed graph."
      },
      {
        "label": "Node alignment budgets",
        "visual": "budgets",
        "description": "Use bounded anchor-wise targets to regulate cross-view agreement for individual nodes."
      },
      {
        "label": "Dual-view stabilization",
        "visual": "stability",
        "description": "Stabilize MI-surrogate estimates across the two views while limiting excessive dispersion."
      }
    ]
  },
  {
    "id": "psdnet",
    "title": "When a Window Is Not an Action: Selective Phase-Script Deliberation for Sliding-Window Human Activity Recognition",
    "link": "https://neurips.cc/virtual/2026/poster/154058",
    "evidenceUrl": "https://neurips.cc/virtual/2026/poster/154058",
    "evidenceLevel": "method",
    "shortName": "PSDNet",
    "summary": "PSDNet combines local phase evidence with recent history and selectively checks class-specific phase scripts when a sliding window remains ambiguous.",
    "steps": [
      {
        "label": "Partial action window",
        "visual": "windows",
        "description": "A fixed sensor window may capture only part of an action or evidence from an activity transition."
      },
      {
        "label": "Phases + recent history",
        "visual": "phases",
        "description": "Encode local phase primitives and recent history to form an initial prediction and uncertainty."
      },
      {
        "label": "Selective deliberation",
        "visual": "route",
        "description": "Clear windows take the direct path. Uncertain windows compare a small set of candidate class phase scripts."
      }
    ]
  },
  {
    "id": "danhar",
    "title": "DanHAR: Dual attention network for multimodal human activity recognition using wearable sensors",
    "link": "https://doi.org/10.1016/j.asoc.2021.107728",
    "aliases": [
      "https://doi.org/10.1016/j.asoc.2021.107728",
      "https://doi.org/10.48550/arxiv.2006.14435"
    ],
    "shortName": "DanHAR",
    "summary": "DanHAR combines channel attention and temporal attention in a CNN to interpret multimodal wearable signals for activity recognition.",
    "steps": [
      {
        "label": "Sensor modalities",
        "description": "Accelerometer and gyroscope sequences capture movement.",
        "visual": "signals"
      },
      {
        "label": "Channel + time",
        "description": "Two attention paths weight sensor channels and timesteps.",
        "visual": "attention"
      },
      {
        "label": "Activity label",
        "description": "The attended representation supports activity classification.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://arxiv.org/abs/2006.14435",
    "evidenceLevel": "primary-abstract",
    "presentationLabel": "Method overview"
  },
  {
    "id": "local-loss-cnn",
    "title": "The layer-wise training convolutional neural networks using local loss for sensor-based human activity recognition",
    "link": "https://doi.org/10.1109/JSEN.2020.2978772",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2020.2978772"
    ],
    "shortName": "Local-Loss CNN",
    "summary": "This work studies layer-wise CNN training with local losses for sensor-based human activity recognition.",
    "steps": [
      {
        "label": "Sensor sequence",
        "description": "Time-series measurements describe human movement.",
        "visual": "signals"
      },
      {
        "label": "Local supervision",
        "description": "Train CNN layers using layer-specific losses.",
        "visual": "local"
      },
      {
        "label": "Activity class",
        "description": "Use the learned representation for activity recognition.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2020.2978772",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "lego-cnn",
    "title": "Layer-wise training convolutional neural networks with smaller filters for human activity recognition using wearable sensors",
    "link": "https://doi.org/10.1109/JSEN.2020.3015521",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2020.3015521",
      "https://arxiv.org/abs/2005.03948"
    ],
    "shortName": "Lego CNN",
    "summary": "Lower-dimensional Lego filters are assembled into CNN filters, while local losses train the model for wearable activity recognition.",
    "steps": [
      {
        "label": "Wearable signals",
        "description": "Movement is recorded by wearable sensor channels.",
        "visual": "signals"
      },
      {
        "label": "Lego filters",
        "description": "Assemble smaller filters and train with local losses.",
        "visual": "kernel"
      },
      {
        "label": "Embedded HAR",
        "description": "Evaluate activity recognition, including on an Android phone.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://arxiv.org/abs/2005.03948",
    "evidenceLevel": "primary-abstract",
    "presentationLabel": "Method overview"
  },
  {
    "id": "triple-attention",
    "title": "Triple cross-domain attention on human activity recognition using wearable sensors",
    "link": "https://doi.org/10.1109/TETCI.2021.3136642",
    "aliases": [
      "https://doi.org/10.1109/TETCI.2021.3136642"
    ],
    "shortName": "Triple Attention",
    "summary": "A triple cross-domain attention design is investigated for activity recognition from wearable sensor measurements.",
    "steps": [
      {
        "label": "Wearable data",
        "description": "Sensor sequences provide activity information.",
        "visual": "signals"
      },
      {
        "label": "Triple attention",
        "description": "Represent signals through cross-domain attention.",
        "visual": "attention"
      },
      {
        "label": "Activity decision",
        "description": "Classify human activity from the resulting features.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/TETCI.2021.3136642",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "channel-selectivity",
    "title": "The convolutional neural networks training with channel-selectivity for human activity recognition based on sensors",
    "link": "https://doi.org/10.1109/JBHI.2021.3092396",
    "aliases": [
      "https://doi.org/10.1109/JBHI.2021.3092396"
    ],
    "shortName": "Channel Selectivity",
    "summary": "This work explores CNN training with channel selectivity for human activity recognition from sensor data.",
    "steps": [
      {
        "label": "Sensor channels",
        "description": "Multiple channels record movement over time.",
        "visual": "signals"
      },
      {
        "label": "Channel selectivity",
        "description": "Incorporate channel selectivity into CNN training.",
        "visual": "attention"
      },
      {
        "label": "Activity prediction",
        "description": "Use the trained model to recognize human activity.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JBHI.2021.3092396",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "rephar",
    "title": "RepHAR: Decoupling networks with accuracy-speed tradeoff for sensor-based human activity recognition",
    "link": "https://doi.org/10.1109/TIM.2023.3240198",
    "aliases": [
      "https://doi.org/10.1109/TIM.2023.3240198"
    ],
    "shortName": "RepHAR",
    "summary": "RepHAR investigates decoupled networks for sensor-based activity recognition, with the accuracy–speed tradeoff as its central design question.",
    "steps": [
      {
        "label": "Sensor windows",
        "description": "Time-series segments describe human movement.",
        "visual": "windows"
      },
      {
        "label": "Decoupled networks",
        "description": "Study network designs for activity recognition.",
        "visual": "decouple"
      },
      {
        "label": "Accuracy + speed",
        "description": "Evaluate recognition alongside inference speed.",
        "visual": "tradeoff"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/TIM.2023.3240198",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "multistep-cldnn",
    "title": "Data driven nonlinear dynamical systems identification using multi-step CLDNN",
    "link": "https://doi.org/10.1063/1.5100558",
    "aliases": [
      "https://doi.org/10.1063/1.5100558"
    ],
    "shortName": "Multi-Step CLDNN",
    "summary": "A multi-step CLDNN learns from observed time series to identify nonlinear dynamical systems.",
    "steps": [
      {
        "label": "Observed dynamics",
        "description": "Time-series data record a system's evolution.",
        "visual": "dynamics"
      },
      {
        "label": "Multi-step CLDNN",
        "description": "Fit a multi-step neural model to observations.",
        "visual": "layers"
      },
      {
        "label": "System identification",
        "description": "Represent the underlying nonlinear dynamics.",
        "visual": "dynamics"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1063/1.5100558",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "dual-decoupling-attention",
    "title": "Innovative dual-decoupling CNN with layer-wise temporal-spatial attention for sensor-based human activity recognition",
    "link": "https://doi.org/10.1109/JBHI.2024.3488528",
    "aliases": [
      "https://doi.org/10.1109/JBHI.2024.3488528"
    ],
    "shortName": "Dual-Decoupling CNN",
    "summary": "This CNN combines dual decoupling with layer-wise temporal–spatial attention for sensor-based activity recognition.",
    "steps": [
      {
        "label": "Sensor time series",
        "description": "Sensor channels capture movement across time.",
        "visual": "signals"
      },
      {
        "label": "Layer-wise attention",
        "description": "Combine dual decoupling with temporal–spatial attention.",
        "visual": "attention"
      },
      {
        "label": "Activity recognition",
        "description": "Classify activity from the learned representation.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JBHI.2024.3488528",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "blockwise-resnet",
    "title": "Block-wise training residual networks on multi-channel time series for human activity recognition",
    "link": "https://doi.org/10.1109/JSEN.2021.3085360",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2021.3085360"
    ],
    "shortName": "Block-Wise ResNet",
    "summary": "Residual networks are trained block by block on multi-channel time series for human activity recognition.",
    "steps": [
      {
        "label": "Multi-channel series",
        "description": "Parallel sensor channels capture human movement.",
        "visual": "signals"
      },
      {
        "label": "Block-wise training",
        "description": "Organize learning around residual network blocks.",
        "visual": "layers"
      },
      {
        "label": "Activity classifier",
        "description": "Map learned time-series features to activity labels.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2021.3085360",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "large-receptive-field",
    "title": "Large receptive field attention: An innovation in decomposing large-kernel convolution for sensor-based activity recognition",
    "link": "https://doi.org/10.1109/JSEN.2024.3364187",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2024.3364187"
    ],
    "shortName": "Large-Field Attention",
    "summary": "Large receptive field attention is developed by decomposing large-kernel convolution for sensor-based activity recognition.",
    "steps": [
      {
        "label": "Sensor sequence",
        "description": "Movement measurements provide temporal context.",
        "visual": "signals"
      },
      {
        "label": "Decomposed kernels",
        "description": "Build large receptive field attention from convolution.",
        "visual": "kernel"
      },
      {
        "label": "Activity label",
        "description": "Recognize activity using the resulting representation.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2024.3364187",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "csfo",
    "title": "CSFO: A category-specific flattening optimization method for sensor-based long-tailed activity recognition",
    "link": "https://doi.org/10.1109/JSEN.2025.3534413",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2025.3534413"
    ],
    "shortName": "CSFO",
    "summary": "CSFO studies category-specific flattening optimization for activity recognition when sensor-data categories have long-tailed frequencies.",
    "steps": [
      {
        "label": "Long-tailed data",
        "description": "Activity categories have unequal sample frequencies.",
        "visual": "tail"
      },
      {
        "label": "Category-specific fit",
        "description": "Apply category-specific flattening optimization.",
        "visual": "optimization"
      },
      {
        "label": "Activity recognition",
        "description": "Evaluate predictions across activity categories.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2025.3534413",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "attention-multistep-dynamics",
    "title": "Data driven governing equations approximations using attention based multistep neural networks",
    "link": "https://doi.org/10.1063/5.0015600",
    "aliases": [
      "https://doi.org/10.1063/5.0015600"
    ],
    "shortName": "Attention for Dynamics",
    "summary": "Attention-based multistep neural networks approximate governing equations from observed data.",
    "steps": [
      {
        "label": "Observed series",
        "description": "Measurements record a dynamical system over time.",
        "visual": "dynamics"
      },
      {
        "label": "Attention + multistep",
        "description": "Learn with an attention-based multistep network.",
        "visual": "attention"
      },
      {
        "label": "Dynamics model",
        "description": "Approximate the system's governing equations.",
        "visual": "dynamics"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1063/5.0015600",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  },
  {
    "id": "csfo-correction",
    "title": "CSFO: A Category-Specific Flattening Optimization Method for Sensor-Based Long-Tailed Activity Recognition (Correction)",
    "link": "https://doi.org/10.1109/JSEN.2025.3610164",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2025.3610164"
    ],
    "shortName": "CSFO Correction",
    "summary": "This notice accompanies the original CSFO article. Readers should consult the correction together with the original publication.",
    "steps": [
      {
        "label": "Original CSFO",
        "description": "Start with the category-specific optimization article.",
        "visual": "notice"
      },
      {
        "label": "Correction notice",
        "description": "Consult the published correction for amended details.",
        "visual": "notice"
      },
      {
        "label": "Read together",
        "description": "Interpret the paper alongside its correction notice.",
        "visual": "notice"
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2025.3610164",
    "evidenceLevel": "title-only",
    "presentationLabel": "Publication notice"
  },
  {
    "id": "frailty-movement-monitoring",
    "title": "Frailty-Focused Movement Monitoring: A Single-Camera System Using Joint Angles for Assessing Chair-Based Exercise Quality",
    "link": "https://doi.org/10.3390/s25133907",
    "aliases": [
      "https://doi.org/10.3390/s25133907"
    ],
    "shortName": "Camera-Based Exercise Quality",
    "summary": "A single camera estimates joint angles during chair-based exercise, and an SVM classifies movement correctness. Muscle recordings are used for physiological comparison in the study.",
    "steps": [
      {
        "label": "Single-camera video",
        "description": "Record older adults performing chair-based exercises.",
        "visual": "video"
      },
      {
        "label": "Joint-angle features",
        "description": "MediaPipe pose estimates provide inputs to an SVM.",
        "visual": "angles"
      },
      {
        "label": "Movement correctness",
        "description": "Classify correct and incorrect exercise execution.",
        "visual": "correctness"
      }
    ],
    "evidenceUrl": "https://www.mdpi.com/1424-8220/25/13/3907",
    "evidenceLevel": "primary-abstract",
    "presentationLabel": "Method overview"
  },
  {
    "id": "chair-system-design",
    "title": "Innovative Chair and System Designs to Enhance Resistance Training Outcomes for the Elderly",
    "link": "https://doi.org/10.3390/healthcare12191926",
    "aliases": [
      "https://doi.org/10.3390/healthcare12191926"
    ],
    "shortName": "Chair + Movement System",
    "summary": "The study combines modified chair designs with movement monitoring to investigate resistance-training stability and exercise correctness in older adults.",
    "steps": [
      {
        "label": "Chair-based training",
        "description": "Record movement with modified and standard chairs.",
        "visual": "video"
      },
      {
        "label": "Stability + pose",
        "description": "Analyze acceleration and video-derived joint angles.",
        "visual": "angles"
      },
      {
        "label": "Exercise assessment",
        "description": "Evaluate body stability and movement correctness.",
        "visual": "correctness"
      }
    ],
    "evidenceUrl": "https://doi.org/10.3390/healthcare12191926",
    "evidenceLevel": "primary-methods",
    "presentationLabel": "Study overview"
  },
  {
    "id": "dswd",
    "title": "Dual Stage-Wise Decoupling Networks for Long-Tailed Activity Recognition Using Wearable Sensors",
    "link": "https://doi.org/10.22967/HCIS.2024.14.052",
    "aliases": [
      "https://doi.org/10.22967/HCIS.2024.14.052"
    ],
    "shortName": "Stage-Wise Decoupling",
    "summary": "Dual stage-wise decoupling networks address activity recognition from wearable signals with long-tailed category frequencies.",
    "steps": [
      {
        "label": "Long-tailed signals",
        "description": "Wearable data contain unequal category frequencies.",
        "visual": "tail"
      },
      {
        "label": "Stage-wise decoupling",
        "description": "Organize network learning through decoupled stages.",
        "visual": "decouple"
      },
      {
        "label": "Activity categories",
        "description": "Recognize activities across the category distribution.",
        "visual": "classify"
      }
    ],
    "evidenceUrl": "https://doi.org/10.22967/HCIS.2024.14.052",
    "evidenceLevel": "title-only",
    "presentationLabel": "Concept overview"
  }
];
