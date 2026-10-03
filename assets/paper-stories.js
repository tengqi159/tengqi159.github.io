window.paperStories = [
  {
    "id": "mirage",
    "title": "MIRAGE: Hierarchical MI-Surrogate Regulation for Graph Contrastive Learning",
    "publicationStatus": "accepted",
    "presentationLabel": "Accepted · NeurIPS 2026 · Proceedings forthcoming",
    "evidenceLevel": "primary-framework",
    "shortName": "MIRAGE",
    "summary": "MIRAGE calibrates cross-view agreement through bounded node-wise alignment budgets and dual-view MI-surrogate stabilization.",
    "steps": [
      {
        "label": "Graph branches",
        "description": "The attributed graph and a KNN graph provide attribute and structural representations."
      },
      {
        "label": "Hierarchical MI regulation",
        "description": "Anchor-wise MI targets and view-level stabilization regulate alignment; a reliability-gated structural supplement supports weak anchors."
      },
      {
        "label": "Fused prediction",
        "description": "Fuse attribute and structural representations before the downstream classification head."
      }
    ],
    "figure": {
      "src": "assets/paper-figures/mirage.webp",
      "width": 2345,
      "height": 990,
      "label": "Figure 1 · Original framework",
      "alt": "Original framework figure from the MIRAGE manuscript",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0,
          "y": 0,
          "width": 0.41,
          "height": 0.96
        },
        {
          "x": 0.41,
          "y": 0,
          "width": 0.3,
          "height": 1
        },
        {
          "x": 0.7,
          "y": 0.07,
          "width": 0.3,
          "height": 0.82
        }
      ]
    }
  },
  {
    "id": "psdnet",
    "title": "When a Window Is Not an Action: Selective Phase-Script Deliberation for Sliding-Window Human Activity Recognition",
    "publicationStatus": "accepted",
    "presentationLabel": "Accepted · NeurIPS 2026 · Proceedings forthcoming",
    "evidenceLevel": "primary-framework",
    "shortName": "PSDNet",
    "summary": "PSDNet combines local phase evidence with recent history and selectively checks class-specific phase scripts when a sliding window remains ambiguous.",
    "steps": [
      {
        "label": "Window and recent history",
        "description": "Encode the current sensor window into phase primitives and summarize the available short-term history."
      },
      {
        "label": "Phase-script local recognition",
        "description": "Evaluate compatibility with learned class-specific phase scripts and form an evidential local prediction."
      },
      {
        "label": "Uncertainty-triggered deliberation",
        "description": "Use uncertainty to activate targeted residual correction for ambiguous windows; clear windows keep the direct prediction."
      }
    ],
    "figure": {
      "src": "assets/paper-figures/psdnet.webp",
      "width": 2763,
      "height": 911,
      "label": "Figure 1 · Original framework",
      "alt": "Original framework figure from the PSDNet manuscript",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0,
          "y": 0.02,
          "width": 0.31,
          "height": 0.98
        },
        {
          "x": 0.31,
          "y": 0.02,
          "width": 0.38,
          "height": 0.98
        },
        {
          "x": 0.7,
          "y": 0,
          "width": 0.3,
          "height": 0.84
        }
      ]
    }
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
        "label": "Wearable inputs",
        "description": "Sensor windows enter the residual CNN."
      },
      {
        "label": "Channel then temporal attention",
        "description": "The inset shows successive channel and temporal attention weighting."
      },
      {
        "label": "Activity classifier",
        "description": "The attended representation feeds the activity classifier."
      }
    ],
    "evidenceUrl": "https://arxiv.org/abs/2006.14435",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/danhar.webp",
      "width": 1084,
      "height": 733,
      "label": "Original framework · Figure 1 · arXiv author version",
      "alt": "DanHAR original framework: wearable signals pass through residual CNN blocks, with a channel-attention module followed by temporal attention, before activity classification.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.0,
          "y": 0.17,
          "width": 0.25,
          "height": 0.28
        },
        {
          "x": 0.14,
          "y": 0.5,
          "width": 0.64,
          "height": 0.48
        },
        {
          "x": 0.78,
          "y": 0.14,
          "width": 0.22,
          "height": 0.32
        }
      ],
      "sourceUrl": "https://arxiv.org/pdf/2006.14435"
    }
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
        "label": "Preprocess sensor signals",
        "description": "Raw accelerometer, gyroscope and magnetometer data enter the CNN."
      },
      {
        "label": "Local learning at each layer",
        "description": "Similarity-matching and cross-entropy losses provide local learning signals. The original arrows distinguish forward, activation and local gradient flows."
      },
      {
        "label": "Activity classification",
        "description": "The final representation feeds the activity classifier."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2020.2978772",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/local-loss-cnn.webp",
      "width": 1021,
      "height": 413,
      "label": "Original framework · Figure 1",
      "alt": "Original layer-wise CNN framework: sensor preprocessing, successive CNN modules, and a local loss block combining similarity-matching loss with cross-entropy loss. Colored arrows distinguish activation and local gradient flow.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.0,
          "y": 0.0,
          "width": 0.29,
          "height": 0.4
        },
        {
          "x": 0.23,
          "y": 0.39,
          "width": 0.47,
          "height": 0.61
        },
        {
          "x": 0.78,
          "y": 0.0,
          "width": 0.22,
          "height": 0.42
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2020.2978772"
    }
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
        "label": "Wearable signal input",
        "description": "Signals from body-worn sensors enter the HAR pipeline."
      },
      {
        "label": "Split, transform and merge",
        "description": "The inset shows small Lego filters transforming segmented feature maps and merging their outputs."
      },
      {
        "label": "Activity classification",
        "description": "Layer-wise convolution blocks feed the fully connected layer and softmax classifier."
      }
    ],
    "evidenceUrl": "https://arxiv.org/abs/2005.03948",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/lego-cnn.webp",
      "width": 1058,
      "height": 492,
      "label": "Original framework · Figure 1",
      "alt": "Original Lego CNN framework: wearable signals enter layer-wise convolution blocks. The inset shows split, transform and merge operations, with small Lego filters used to construct output feature maps.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.0,
          "y": 0.01,
          "width": 0.37,
          "height": 0.46
        },
        {
          "x": 0.0,
          "y": 0.46,
          "width": 1.0,
          "height": 0.54
        },
        {
          "x": 0.68,
          "y": 0.01,
          "width": 0.32,
          "height": 0.4
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2020.3015521"
    }
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
        "label": "Collect and preprocess",
        "description": "Wearable sensor time series are segmented before model training."
      },
      {
        "label": "Three interaction branches",
        "description": "T & S, T & C and C & S denote temporal-sensor, temporal-channel and channel-sensor interactions."
      },
      {
        "label": "Recognize activity",
        "description": "Residual features feed the fully connected softmax classifier."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/TETCI.2021.3136642",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/triple-attention.webp",
      "width": 2137,
      "height": 441,
      "label": "Original framework · Figure 1 · author-hosted version",
      "alt": "Original triplet attention HAR framework: sensor signals pass through residual blocks with temporal-sensor, temporal-channel and channel-sensor interaction branches, then a fully connected softmax activity classifier.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.0,
          "y": 0.15,
          "width": 0.3,
          "height": 0.8
        },
        {
          "x": 0.31,
          "y": 0.22,
          "width": 0.49,
          "height": 0.68
        },
        {
          "x": 0.8,
          "y": 0.13,
          "width": 0.2,
          "height": 0.87
        }
      ],
      "sourceUrl": "https://yinntag.github.io/publications/P3.pdf"
    }
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
        "label": "Sensor preprocessing",
        "description": "Accelerometer, gyroscope and magnetometer streams provide input windows."
      },
      {
        "label": "Select and recycle channels",
        "description": "Channel-selective convolution uses deallocation, reallocation and spatial shifting, as shown by the replacement arrows."
      },
      {
        "label": "Activity classifier",
        "description": "The resulting features feed the fully connected classifier."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JBHI.2021.3092396",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/channel-selectivity.webp",
      "width": 1933,
      "height": 667,
      "label": "Original framework · Figure 1 · author-hosted version",
      "alt": "Original channel-selective CNN framework: wearable signals are preprocessed, and conventional convolution is replaced by channel deallocation, reallocation and spatial shift operations before activity classification.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.0,
          "y": 0.12,
          "width": 0.38,
          "height": 0.53
        },
        {
          "x": 0.38,
          "y": 0.12,
          "width": 0.39,
          "height": 0.88
        },
        {
          "x": 0.79,
          "y": 0.11,
          "width": 0.21,
          "height": 0.62
        }
      ],
      "sourceUrl": "https://wenbohuang1002.github.io/papers/JBHI-2021-1.pdf"
    }
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
        "label": "Wearable signals",
        "description": "Preprocessed inertial-sensor signals enter the network."
      },
      {
        "label": "Multi-branch training",
        "description": "The green path uses the training-time multi-branch CNN blocks."
      },
      {
        "label": "Reparameterize for inference",
        "description": "Structural reparameterization converts those blocks into the plain CNN illustrated by the red inference path."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/TIM.2023.3240198",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/rephar.webp",
      "width": 2021,
      "height": 763,
      "label": "Original framework · Figure 1",
      "alt": "Original RepHAR framework: multi-branch CNN blocks are trained with green paths, then structurally reparameterized into a plain inference-time CNN shown by the red path, ending in an activity classifier.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.0,
          "y": 0.2,
          "width": 0.27,
          "height": 0.55
        },
        {
          "x": 0.27,
          "y": 0.05,
          "width": 0.61,
          "height": 0.56
        },
        {
          "x": 0.28,
          "y": 0.66,
          "width": 0.57,
          "height": 0.33
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/TIM.2023.3240198"
    }
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
        "label": "CNN + LSTM representation",
        "description": "Observed time-series data pass through convolution, pooling, LSTM and a fully connected layer."
      },
      {
        "label": "Multistep training objective",
        "description": "A multistep residual and loss define the backpropagation loop."
      },
      {
        "label": "Predicted dynamics",
        "description": "The trained model produces predicted dynamical data."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1063/1.5100558",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/multistep-cldnn.webp",
      "width": 975,
      "height": 1355,
      "label": "Original framework · Fig. 1",
      "alt": "Original multi-step CLDNN framework with observed data, CNN and LSTM processing, a fully connected layer, the multistep loss and backpropagation loop, and predicted data.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.02,
          "y": 0.005,
          "width": 0.965,
          "height": 0.63
        },
        {
          "x": 0.02,
          "y": 0.63,
          "width": 0.965,
          "height": 0.27
        },
        {
          "x": 0.3,
          "y": 0.93,
          "width": 0.32,
          "height": 0.065
        }
      ],
      "sourceUrl": "https://doi.org/10.1063/1.5100558"
    }
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
        "label": "Layer-wise HAR pipeline",
        "description": "CNN and TSFDU blocks pass sensor representations to an activity classifier."
      },
      {
        "label": "Temporal-spatial decoupling",
        "description": "The TSFDU diagram separates temporal convolutions and sensor-channel attention before feature combination."
      },
      {
        "label": "Local-loss training",
        "description": "Each block uses similarity matching and cross-entropy losses for local supervision."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JBHI.2024.3488528",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/dual-decoupling-attention.webp",
      "width": 1940,
      "height": 880,
      "label": "Original framework · Fig. 1",
      "alt": "Original CNN-TSFDU-LW framework, showing the sensor-to-classifier pipeline, temporal-spatial feature decoupling unit, and layer-wise local-loss training.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.02,
          "y": 0.01,
          "width": 0.96,
          "height": 0.37
        },
        {
          "x": 0.02,
          "y": 0.39,
          "width": 0.57,
          "height": 0.6
        },
        {
          "x": 0.59,
          "y": 0.39,
          "width": 0.4,
          "height": 0.6
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JBHI.2024.3488528"
    }
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
        "label": "Sensor windows",
        "description": "Wearable sensing streams are segmented with sliding windows."
      },
      {
        "label": "Residual units + local losses",
        "description": "Residual blocks receive local supervision from similarity matching and cross-entropy losses."
      },
      {
        "label": "Activity classifier",
        "description": "A fully connected head produces the activity output."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2021.3085360",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/blockwise-resnet.webp",
      "width": 2052,
      "height": 644,
      "label": "Original framework · Fig. 1",
      "alt": "Original predsim ResNet framework showing wearable sensing and sliding windows, residual units with local loss blocks, and a fully connected activity classifier.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.005,
          "y": 0.02,
          "width": 0.22,
          "height": 0.96
        },
        {
          "x": 0.23,
          "y": 0.02,
          "width": 0.64,
          "height": 0.96
        },
        {
          "x": 0.88,
          "y": 0.02,
          "width": 0.115,
          "height": 0.96
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2021.3085360"
    }
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
        "label": "Sensor input",
        "description": "A multichannel sensor sequence enters the network."
      },
      {
        "label": "LRF network blocks",
        "description": "Convolutional token embedding, LRF attention and feed-forward layers process the representation."
      },
      {
        "label": "Activity classification",
        "description": "The activity classifier maps the final representation to activity categories."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2024.3364187",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/large-receptive-field.webp",
      "width": 2060,
      "height": 444,
      "label": "Original framework · Fig. 3",
      "alt": "Original large receptive field HAR model: sensor input, repeated blocks containing convolutional token embedding, LRF attention and feed-forward processing, and activity classification.",
      "sourceFigureNumber": "3",
      "regions": [
        {
          "x": 0,
          "y": 0.1,
          "width": 0.12,
          "height": 0.9
        },
        {
          "x": 0.12,
          "y": 0.02,
          "width": 0.75,
          "height": 0.97
        },
        {
          "x": 0.87,
          "y": 0.07,
          "width": 0.13,
          "height": 0.91
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2024.3364187"
    }
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
        "label": "Two-stage HAR pipeline",
        "description": "The overview separates feature-extractor training from classifier refinement."
      },
      {
        "label": "Stage 1: class-specific fit",
        "description": "Perturb parameters at a class-conditioned scale while training the feature extractor and classifier."
      },
      {
        "label": "Stage 2: robust classifier",
        "description": "Freeze backbone weights and refine the classifier with progressively generated adversarial features."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2025.3534413",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/csfo.webp",
      "width": 1996,
      "height": 1724,
      "label": "Original framework · Fig. 1",
      "alt": "Original CSFO overview with the overall two-stage HAR pipeline, class-conditioned parameter perturbations in Stage 1, and progressively generated adversarial features for classifier training in Stage 2.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.01,
          "y": 0.25,
          "width": 0.99,
          "height": 0.46
        },
        {
          "x": 0.08,
          "y": 0.005,
          "width": 0.87,
          "height": 0.24
        },
        {
          "x": 0.08,
          "y": 0.72,
          "width": 0.87,
          "height": 0.28
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2025.3534413"
    }
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
        "label": "Convolutional features",
        "description": "Observed data feed the convolutional feature pipeline."
      },
      {
        "label": "Attention modules + merge",
        "description": "Compare local and global features, then merge the attention-module outputs."
      },
      {
        "label": "Multistep loss + prediction",
        "description": "The multistep residual loss updates model weights and the learned model predicts dynamical data."
      }
    ],
    "evidenceUrl": "https://doi.org/10.1063/5.0015600",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/attention-multistep-dynamics.webp",
      "width": 1220,
      "height": 835,
      "label": "Original framework · Fig. 1",
      "alt": "Original attention-based multistep model with observed data, convolutional feature extraction, three attention modules and a merge operation, and the multistep loss and prediction loop.",
      "sourceFigureNumber": "1",
      "regions": [
        {
          "x": 0.005,
          "y": 0.005,
          "width": 0.99,
          "height": 0.37
        },
        {
          "x": 0.43,
          "y": 0.3,
          "width": 0.54,
          "height": 0.35
        },
        {
          "x": 0.005,
          "y": 0.65,
          "width": 0.99,
          "height": 0.345
        }
      ],
      "sourceUrl": "https://doi.org/10.1063/5.0015600"
    }
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
    "steps": [],
    "evidenceUrl": "https://doi.org/10.1109/JSEN.2025.3610164",
    "evidenceLevel": "title-only",
    "presentationLabel": "Publication notice"
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
        "label": "Collect + preprocess",
        "description": "Wearable measurements form the sensor input and long-tailed activity distribution."
      },
      {
        "label": "Stage-wise training",
        "description": "Separate representation learning from classifier learning in the multi-branch training network."
      },
      {
        "label": "Re-parameterized inference",
        "description": "Convert the trained multi-branch blocks into the single-branch inference path."
      }
    ],
    "evidenceUrl": "https://doi.org/10.22967/HCIS.2024.14.052",
    "evidenceLevel": "primary-framework",
    "presentationLabel": "Original paper framework",
    "figure": {
      "src": "assets/paper-figures/dswd.webp",
      "width": 1484,
      "height": 644,
      "label": "Original framework · Fig. 3",
      "alt": "Original DSWD framework showing data collection and preprocessing, stage-wise representation and classifier learning, and conversion to the inference architecture.",
      "sourceFigureNumber": "3",
      "regions": [
        {
          "x": 0.005,
          "y": 0.02,
          "width": 0.335,
          "height": 0.97
        },
        {
          "x": 0.355,
          "y": 0.02,
          "width": 0.64,
          "height": 0.595
        },
        {
          "x": 0.355,
          "y": 0.61,
          "width": 0.64,
          "height": 0.385
        }
      ],
      "sourceUrl": "https://doi.org/10.22967/HCIS.2024.14.052"
    }
  }
];
