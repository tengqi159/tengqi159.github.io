window.paperStories = [
  {
    "id": "mirage",
    "title": "MIRAGE: Hierarchical MI-Surrogate Regulation for Graph Contrastive Learning",
    "publicationStatus": "accepted",
    "presentationLabel": "Accepted · NeurIPS 2026 · Proceedings forthcoming",
    "evidenceLevel": "primary-framework",
    "shortName": "MIRAGE",
    "summary": "MIRAGE addresses uneven agreement between graph views: some nodes benefit from strong alignment, while noisy or boundary nodes may not. It learns bounded node-specific MI-surrogate targets and stabilizes each branch, with a gated structural supplement for weak anchors.",
    "steps": [
      {
        "label": "Construct attribute and structural views",
        "description": "The attribute branch forms GCN and adaptive-propagation views. The structural branch encodes the original and feature-space KNN graphs, then mixes their representations. Contrastive learning aligns views within each branch."
      },
      {
        "label": "Give each node a bounded target",
        "description": "A learned setpoint assigns each node a target for its InfoNCE-based MI surrogate. The allocation loss increases alignment pressure below the target and limits further surrogate growth above it."
      },
      {
        "label": "Stabilize the branch-level signal",
        "description": "The stability loss penalizes drift of each branch's mean surrogate from a target and excessive spread across nodes. This complements the node-specific allocation targets."
      },
      {
        "label": "Supplement weak anchors and fuse",
        "description": "After warmup, low-setpoint structural anchors can receive filtered higher-order neighbor features. A label-free reliability gate limits this supplement; the resulting structural view is fused with both attribute views for node classification."
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
          "y": 0.02,
          "width": 0.417,
          "height": 0.82
        },
        {
          "x": 0.417,
          "y": 0.328,
          "width": 0.288,
          "height": 0.366
        },
        {
          "x": 0.436,
          "y": 0,
          "width": 0.253,
          "height": 0.315
        },
        [
          {
            "x": 0.447,
            "y": 0.712,
            "width": 0.255,
            "height": 0.282
          },
          {
            "x": 0.719,
            "y": 0.097,
            "width": 0.278,
            "height": 0.79
          }
        ]
      ]
    },
    "problem": "Should every graph node be pushed equally hard to agree across views, even when its attributes and neighborhood provide conflicting evidence?",
    "takeaway": "Node-classification experiments on six small-to-medium graphs show competitive representations. Training trajectories and fixed-target sweeps demonstrate that the MI-surrogate targets affect both optimization and downstream accuracy.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    }
  },
  {
    "id": "psdnet",
    "title": "When a Window Is Not an Action: Selective Phase-Script Deliberation for Sliding-Window Human Activity Recognition",
    "publicationStatus": "accepted",
    "presentationLabel": "Accepted · NeurIPS 2026 · Proceedings forthcoming",
    "evidenceLevel": "primary-framework",
    "shortName": "PSDNet",
    "summary": "A fixed sensor window may contain only part of an action, or a fragment shared by several activities. PSDNet interprets it using learned phase primitives and recent history, then adds script-aware residual correction when the local prediction remains uncertain.",
    "steps": [
      {
        "label": "Represent partial motion and recent history",
        "description": "A shared encoder maps the current window to a mixture of learned phase primitives. Valid preceding windows use the same encoder and are summarized separately as recent phase context."
      },
      {
        "label": "Check class-specific phase scripts",
        "description": "Combine the current phase vector with the history summary, then score compatibility with each learned class script. These scores help form an evidential local prediction and its uncertainty."
      },
      {
        "label": "Use uncertainty to choose a path",
        "description": "At inference, extra deliberation runs only when uncertainty exceeds the learned threshold and valid history exists. Other windows keep the local prediction. Boundary supervision is an auxiliary training objective."
      },
      {
        "label": "Apply a targeted residual correction",
        "description": "For routed windows, System 2 retrieves historical context and adds a residual to the local logits. It gives likely candidate classes extra capacity while retaining a dense correction over all classes."
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
          "y": 0.12,
          "width": 0.318,
          "height": 0.84
        },
        {
          "x": 0.32,
          "y": 0.11,
          "width": 0.377,
          "height": 0.827
        },
        [
          {
            "x": 0.735,
            "y": 0.005,
            "width": 0.086,
            "height": 0.318
          },
          {
            "x": 0.895,
            "y": 0.076,
            "width": 0.068,
            "height": 0.156
          }
        ],
        [
          {
            "x": 0.713,
            "y": 0.385,
            "width": 0.194,
            "height": 0.363
          },
          {
            "x": 0.918,
            "y": 0.445,
            "width": 0.074,
            "height": 0.29
          }
        ]
      ]
    },
    "problem": "How can an activity classifier interpret a short window that contains only a partial motion or mixed evidence near an activity change?",
    "takeaway": "Across eight HAR datasets, PSDNet achieves the best mean accuracy and weighted F1 among the compared methods. Boundary and look-alike analyses examine ambiguous windows; selective-routing experiments measure the accuracy–computation trade-off.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
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
    "summary": "DanHAR combines channel attention and temporal attention in CNN and residual backbones to reweight features from wearable sensor windows.",
    "steps": [
      {
        "label": "Extract window features",
        "description": "Segment the sensor streams into fixed-length windows and encode each window with convolutional or residual blocks.",
        "phase": "inference"
      },
      {
        "label": "Weight feature channels",
        "description": "Average and max pooling summarize each feature channel. Shared fully connected layers produce sigmoid weights that rescale these channels.",
        "phase": "inference"
      },
      {
        "label": "Weight temporal positions",
        "description": "Pool the channel-attended features across channels, concatenate the pooled maps, and use a convolution and sigmoid to produce the temporal attention map before classification.",
        "phase": "inference"
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
          "x": 0.235,
          "y": 0.02,
          "width": 0.602,
          "height": 0.424
        },
        {
          "x": 0.324,
          "y": 0.678,
          "width": 0.202,
          "height": 0.268
        },
        {
          "x": 0.544,
          "y": 0.596,
          "width": 0.222,
          "height": 0.323
        }
      ],
      "sourceUrl": "https://arxiv.org/pdf/2006.14435"
    },
    "problem": "Temporal attention alone does not model which convolutional feature channels should receive more weight.",
    "takeaway": "In the author-version experiments, dual attention improved the tested CNN and residual baselines on four public HAR datasets and a weakly labeled dataset.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
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
    "summary": "This CNN training method combines local label-prediction and similarity-matching losses, detaching gradients between layers to address backward locking.",
    "steps": [
      {
        "label": "Predict labels locally",
        "description": "Attach a linear classifier to a hidden layer and compare its activity prediction with the label using cross-entropy.",
        "phase": "training"
      },
      {
        "label": "Match label similarities",
        "description": "Compare pairwise hidden-feature similarities within a batch with the similarities of the corresponding one-hot activity labels.",
        "phase": "training"
      },
      {
        "label": "Update layers locally",
        "description": "Combine the two losses and detach the computation graph between hidden layers so each layer can be updated without a network-wide backward pass.",
        "phase": "training"
      },
      {
        "label": "Run forward inference",
        "description": "The final classifier is trained with cross-entropy. At deployment, the trained network recognizes activity through an ordinary CNN forward path.",
        "phase": "inference"
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
          "x": 0.478,
          "y": 0.6,
          "width": 0.179,
          "height": 0.376
        },
        {
          "x": 0.27,
          "y": 0.608,
          "width": 0.177,
          "height": 0.36
        },
        [
          {
            "x": 0.266,
            "y": 0.455,
            "width": 0.4,
            "height": 0.51
          },
          {
            "x": 0.679,
            "y": 0.503,
            "width": 0.22,
            "height": 0.228
          }
        ],
        {
          "x": 0.344,
          "y": 0.12,
          "width": 0.635,
          "height": 0.33
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2020.2978772"
    },
    "problem": "Global backpropagation retains hidden activations for the full backward pass, limiting memory reuse during HAR model training.",
    "takeaway": "The combined local loss improved test accuracy over the tested global-loss CNNs on five public HAR datasets; inference still uses the trained CNN's forward path.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughNote": "The local-loss arrows describe training. Inference follows the forward CNN path."
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
    "summary": "Lego CNN shares filters with fewer input channels, reuses their intermediate responses, and adds layer-wise local training for wearable activity recognition.",
    "steps": [
      {
        "label": "Share smaller filters",
        "description": "Construct convolutional filters from a shared Lego bank with fewer input channels. Learn the discrete filter selections using a straight-through estimator.",
        "phase": "model-design-and-training"
      },
      {
        "label": "Reuse fragment responses",
        "description": "Split feature channels into fragments and convolve each fragment with the shared Lego bank to compute reusable intermediate feature maps.",
        "phase": "convolution"
      },
      {
        "label": "Select and merge",
        "description": "Use the learned masks to select an intermediate response for each fragment, then sum the selected responses into each output feature map.",
        "phase": "convolution"
      },
      {
        "label": "Train with local objectives",
        "description": "The layer-wise variant combines local prediction and similarity-matching losses and detaches gradients between hidden layers; the first convolution and final classifier remain uncompressed.",
        "phase": "training"
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
        [
          {
            "x": 0.396,
            "y": 0.48,
            "width": 0.124,
            "height": 0.117
          },
          {
            "x": 0.868,
            "y": 0.477,
            "width": 0.118,
            "height": 0.5
          }
        ],
        {
          "x": 0.064,
          "y": 0.59,
          "width": 0.51,
          "height": 0.353
        },
        {
          "x": 0.565,
          "y": 0.59,
          "width": 0.242,
          "height": 0.369
        },
        {
          "x": 0.5,
          "y": 0.167,
          "width": 0.19,
          "height": 0.225
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2020.3015521"
    },
    "problem": "Wearable HAR CNNs can be costly to deploy; the paper asks whether shared filters can reduce storage and computation.",
    "takeaway": "The evaluated compression settings reduced model size and FLOPs with a recognition-performance tradeoff; a WISDM model also ran faster on the tested Honor 20i.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughNote": "The inset shows shared-filter convolution. Layer-wise training is described in the paper and applied to the marked LWConv blocks."
  },
  {
    "id": "triple-attention",
    "title": "Triple cross-domain attention on human activity recognition using wearable sensors",
    "link": "https://doi.org/10.1109/TETCI.2021.3136642",
    "aliases": [
      "https://doi.org/10.1109/TETCI.2021.3136642"
    ],
    "shortName": "Triple Attention",
    "summary": "Triplet attention forms parallel maps for temporal-channel, channel-sensor and temporal-sensor interactions, then learns how to combine their reweighted features.",
    "steps": [
      {
        "label": "View three dimension pairs",
        "description": "Send the C x T x S feature tensor through three parallel branches. Permute dimensions where needed to expose temporal-channel, channel-sensor and temporal-sensor interactions.",
        "phase": "attention"
      },
      {
        "label": "Build pairwise attention maps",
        "description": "Concatenate max and average pooling along the remaining dimension, then apply a convolution, batch normalization and sigmoid to obtain an attention map for each pair.",
        "phase": "attention"
      },
      {
        "label": "Reweight each view",
        "description": "Multiply each branch tensor by its attention map and restore the permuted dimensions so all branch outputs have a common shape.",
        "phase": "attention"
      },
      {
        "label": "Learn the branch combination",
        "description": "Combine the three reweighted outputs using coefficients learned during training, then pass the refined features to the activity-recognition backbone.",
        "phase": "attention"
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
          "x": 0,
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
    },
    "problem": "Separate channel and spatial attention can miss interactions between feature channels, temporal positions and sensor dimensions.",
    "takeaway": "The paper reports F1 gains on four public datasets and a weakly labeled dataset, with additional average gains in PAMAP2 leave-one-subject-out tests.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughFigure": {
      "src": "assets/paper-figures/triple-attention-detail.webp",
      "width": 1389,
      "height": 650,
      "label": "Original attention module · Figure 2",
      "alt": "Original triplet-attention module: one unchanged and two permuted feature tensors pass through parallel Z_Pooling, convolution and sigmoid branches; their attention maps reweight the tensors, which are restored to a common dimension order and combined.",
      "sourceFigureNumber": 2,
      "sourceUrl": "https://yinntag.github.io/publications/P3.pdf",
      "regions": [
        [
          {
            "x": 0.006,
            "y": 0.039,
            "width": 0.325,
            "height": 0.926
          }
        ],
        [
          {
            "x": 0.315,
            "y": 0.025,
            "width": 0.298,
            "height": 0.305
          },
          {
            "x": 0.315,
            "y": 0.35,
            "width": 0.298,
            "height": 0.3
          },
          {
            "x": 0.315,
            "y": 0.667,
            "width": 0.298,
            "height": 0.3
          }
        ],
        [
          {
            "x": 0.606,
            "y": 0.047,
            "width": 0.198,
            "height": 0.302
          },
          {
            "x": 0.606,
            "y": 0.35,
            "width": 0.198,
            "height": 0.305
          },
          {
            "x": 0.606,
            "y": 0.66,
            "width": 0.198,
            "height": 0.305
          },
          {
            "x": 0.79,
            "y": 0.12,
            "width": 0.08,
            "height": 0.72
          }
        ],
        [
          {
            "x": 0.855,
            "y": 0.348,
            "width": 0.14,
            "height": 0.32
          }
        ]
      ]
    },
    "walkthroughNote": "The three dimension-pair branches operate in parallel. The pooling and gating are shown in Figure 2; the learned fusion coefficients are specified in the method equations."
  },
  {
    "id": "channel-selectivity",
    "title": "The convolutional neural networks training with channel-selectivity for human activity recognition based on sensors",
    "link": "https://doi.org/10.1109/JBHI.2021.3092396",
    "aliases": [
      "https://doi.org/10.1109/JBHI.2021.3092396"
    ],
    "shortName": "Channel Selectivity",
    "summary": "Channel-selective CNN training estimates the effect of removing feature channels, reallocates low-impact channels to important ones, and learns shifts to diversify copied features.",
    "steps": [
      {
        "label": "Estimate removal damage",
        "description": "Use the Expected Channel Damage Matrix to estimate how removing each input feature channel changes the output; a normalized damage threshold controls deallocation.",
        "phase": "training"
      },
      {
        "label": "Reallocate channel capacity",
        "description": "Block low-contribution channels and remap their released positions to selected Top-K important channels, resetting the corresponding convolution weights.",
        "phase": "training"
      },
      {
        "label": "Diversify copied features",
        "description": "Learn spatial shifts for the copied channels so repeated copies provide different information rather than identical convolution inputs.",
        "phase": "training"
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
          "x": 0,
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
    },
    "problem": "Fixed channel connections can spend capacity on features that have little effect on the convolutional output.",
    "takeaway": "Across five public HAR datasets, the paper reports accuracy gains over its CNN and ResNet baselines; smartphone inference latency remained close to the plain CNN.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughFigure": {
      "src": "assets/paper-figures/channel-selectivity-detail.webp",
      "width": 1270,
      "height": 1190,
      "label": "Original Figures 2 and 3 · Channel-selective training",
      "alt": "Original channel-selectivity diagrams: Figure 2 shows channel deallocation and reallocation with a channel-importance color scale; Figure 3 shows spatial shifting of channel copies.",
      "sourceFigureNumber": "2 and 3",
      "sourceUrl": "https://wenbohuang1002.github.io/papers/JBHI-2021-1.pdf",
      "regions": [
        [
          {
            "x": 0.055118,
            "y": 0.008403,
            "width": 0.771654,
            "height": 0.243697
          },
          {
            "x": 0.866142,
            "y": 0.021008,
            "width": 0.074803,
            "height": 0.42437
          }
        ],
        [
          {
            "x": 0.055118,
            "y": 0.197479,
            "width": 0.771654,
            "height": 0.302521
          },
          {
            "x": 0.866142,
            "y": 0.021008,
            "width": 0.074803,
            "height": 0.42437
          }
        ],
        [
          {
            "x": 0.043307,
            "y": 0.659664,
            "width": 0.200787,
            "height": 0.226891
          },
          {
            "x": 0.279528,
            "y": 0.659664,
            "width": 0.700787,
            "height": 0.235294
          }
        ]
      ]
    },
    "walkthroughNote": "Figures 2 and 3 show channel rewiring and spatial shifts during training."
  },
  {
    "id": "rephar",
    "title": "RepHAR: Decoupling networks with accuracy-speed tradeoff for sensor-based human activity recognition",
    "link": "https://doi.org/10.1109/TIM.2023.3240198",
    "aliases": [
      "https://doi.org/10.1109/TIM.2023.3240198"
    ],
    "shortName": "RepHAR",
    "summary": "RepHAR trains a multi-branch convolutional model and converts its convolution and batch-normalization parameters into a plain CNN for wearable activity recognition.",
    "steps": [
      {
        "label": "Train with multiple branches",
        "description": "Train the convolutional model with parallel branches and batch normalization, using the multi-branch architecture for feature learning.",
        "phase": "training"
      },
      {
        "label": "Convert trained parameters",
        "description": "After training, fold batch-normalization parameters into the convolution, pad smaller branch kernels to a common size, and sum the kernels and biases as described in the paper.",
        "phase": "conversion-after-training"
      },
      {
        "label": "Deploy the plain network",
        "description": "Load the converted CNN for activity inference. The deployed model follows a plain convolutional path rather than evaluating the training-time branches.",
        "phase": "inference"
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
          "x": 0,
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
    },
    "problem": "Multi-branch HAR networks can improve recognition while increasing inference overhead; FLOPs alone do not predict device latency.",
    "takeaway": "On four public HAR datasets, CNN_Rep improved the paper's plain CNN baseline; a Raspberry Pi 3B+ test reported lower latency than the multi-branch model.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughFigure": {
      "src": "assets/paper-figures/rephar-detail.webp",
      "width": 1235,
      "height": 1465,
      "label": "Original structural re-parameterization · Fig. 2",
      "alt": "Original RepHAR Figure 2: two convolution-plus-batch-normalization training branches, CNN and BN parameter conversion with zero-padding, and the resulting single-convolution inference block.",
      "sourceFigureNumber": "2",
      "sourceUrl": "https://doi.org/10.1109/TIM.2023.3240198",
      "regions": [
        [
          {
            "x": 0.04453,
            "y": 0.00683,
            "width": 0.33198,
            "height": 0.32423
          }
        ],
        [
          {
            "x": 0.4251,
            "y": 0.00683,
            "width": 0.56275,
            "height": 0.87372
          },
          {
            "x": 0.04453,
            "y": 0.35836,
            "width": 0.33198,
            "height": 0.28669
          }
        ],
        [
          {
            "x": 0.08907,
            "y": 0.66553,
            "width": 0.25506,
            "height": 0.21843
          },
          {
            "x": 0.5749,
            "y": 0.72014,
            "width": 0.25911,
            "height": 0.16382
          }
        ]
      ]
    },
    "walkthroughNote": "Figure 2 details one convolutional block. Its parameter conversion is performed after training and used to build the plain inference network."
  },
  {
    "id": "multistep-cldnn",
    "title": "Data driven nonlinear dynamical systems identification using multi-step CLDNN",
    "link": "https://doi.org/10.1063/1.5100558",
    "aliases": [
      "https://doi.org/10.1063/1.5100558"
    ],
    "shortName": "Multi-Step CLDNN",
    "summary": "Multi-step CLDNN learns a nonlinear dynamical vector field from observed states using convolutional features, LSTM memory and a numerical multistep residual loss.",
    "steps": [
      {
        "label": "Learn the dynamical vector field",
        "description": "Convolution extracts features, an LSTM models temporal dependence, and the fully connected layer approximates f(x(t)), the rate of change of the system state."
      },
      {
        "label": "Fit a numerical multistep residual",
        "description": "Minimize the mean squared residual of a linear multistep time-stepping rule. Training uses observed states without separately approximating their temporal gradients."
      },
      {
        "label": "Integrate the learned dynamics",
        "description": "Use SciPy's odeint to turn the learned vector field into state trajectories. The paper tests oscillator, Lorenz, Hopf and reduced fluid-flow benchmarks."
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
    },
    "problem": "The baseline multistep DNN does not explicitly model temporal dependencies in observations of nonlinear dynamical systems.",
    "takeaway": "On four reported dynamical-system benchmarks, adding convolutional and LSTM modelling to the multistep residual improves trajectory reconstruction over the compared DNN; accurate Lorenz tracking remains limited in time.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughNote": "The multistep residual trains the vector field; numerical integration generates the state trajectory."
  },
  {
    "id": "dual-decoupling-attention",
    "title": "Innovative dual-decoupling CNN with layer-wise temporal-spatial attention for sensor-based human activity recognition",
    "link": "https://doi.org/10.1109/JBHI.2024.3488528",
    "aliases": [
      "https://doi.org/10.1109/JBHI.2024.3488528"
    ],
    "shortName": "Dual-Decoupling CNN",
    "summary": "CNN-TSFDU-LW combines parallel temporal and sensor-channel attention with layer-local training driven by a Huber similarity loss and cross-entropy.",
    "steps": [
      {
        "label": "CNN activity pipeline",
        "description": "Sensor windows pass through convolutional TSFDU blocks and a final fully connected activity classifier."
      },
      {
        "label": "Temporal attention branch",
        "description": "Depthwise, dilated depthwise and 1x1 convolutions build temporal attention from the same feature map used by the channel branch."
      },
      {
        "label": "Parallel channel attention",
        "description": "Average pooling and a fully connected layer produce channel weights; the temporal and channel maps jointly reweight the feature map."
      },
      {
        "label": "Huber-based local learning",
        "description": "Each hidden layer combines Huber matching of feature and label similarities with local cross-entropy; the final classifier uses its own cross-entropy."
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
          "x": 0.2,
          "y": 0.405,
          "width": 0.38,
          "height": 0.31
        },
        {
          "x": 0.19,
          "y": 0.7,
          "width": 0.385,
          "height": 0.29
        },
        {
          "x": 0.59,
          "y": 0.39,
          "width": 0.4,
          "height": 0.6
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JBHI.2024.3488528"
    },
    "problem": "Sensor-based HAR needs temporal and sensor-channel modeling while controlling the memory cost of global training.",
    "takeaway": "The paper reports stronger recognition than reproduced baselines on four HAR datasets and demonstrates Raspberry Pi inference, while noting extra memory-access costs during training.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughNote": "Temporal and channel attention operate in parallel; local losses supervise training."
  },
  {
    "id": "blockwise-resnet",
    "title": "Block-wise training residual networks on multi-channel time series for human activity recognition",
    "link": "https://doi.org/10.1109/JSEN.2021.3085360",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2021.3085360"
    ],
    "shortName": "Block-Wise ResNet",
    "summary": "Predsim ResNet retains residual connections but trains each block with supervised similarity matching and cross-entropy, stopping gradients between blocks.",
    "steps": [
      {
        "label": "Multichannel sensor windows",
        "description": "Sliding windows segment body-worn or smartphone sensor streams into multichannel inputs for activity recognition."
      },
      {
        "label": "Residual feature blocks",
        "description": "Convolutional residual units retain skip connections while learning sensor-window features."
      },
      {
        "label": "Predsim local supervision",
        "description": "A weighted combination of label-similarity matching and local cross-entropy updates each residual block; detaching the graph stops gradients between blocks."
      },
      {
        "label": "Separate activity classifier",
        "description": "The final fully connected head predicts the activity and uses cross-entropy without sending its gradient back into earlier blocks."
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
          "y": 0.015,
          "width": 0.635,
          "height": 0.37
        },
        {
          "x": 0.23,
          "y": 0.39,
          "width": 0.635,
          "height": 0.43
        },
        {
          "x": 0.88,
          "y": 0.02,
          "width": 0.115,
          "height": 0.96
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2021.3085360"
    },
    "problem": "Deep residual networks require stored activations for global backpropagation, increasing training-memory demands.",
    "takeaway": "In four HAR benchmark evaluations, combined local losses improved recognition over reproduced baselines; Raspberry Pi inference remained close to the plain ResNet.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughNote": "Residual skips are preserved. The auxiliary losses supply block-local training gradients."
  },
  {
    "id": "large-receptive-field",
    "title": "Large receptive field attention: An innovation in decomposing large-kernel convolution for sensor-based activity recognition",
    "link": "https://doi.org/10.1109/JSEN.2024.3364187",
    "aliases": [
      "https://doi.org/10.1109/JSEN.2024.3364187"
    ],
    "shortName": "Large-Field Attention",
    "summary": "LRF attention cascades depthwise, dilated depthwise and pointwise convolutions to reweight sensor features inside a hierarchical network with convolutional token embedding and residual feed-forward blocks.",
    "steps": [
      {
        "label": "Sensor windows to tokens",
        "description": "Filtered, normalized sensor windows retain their time-by-modality layout as a convolutional stem produces tokens."
      },
      {
        "label": "Convolutional LRF attention",
        "description": "Depthwise, dilated depthwise and 1x1 convolutions generate an attention map that is multiplied element-wise with the input features."
      },
      {
        "label": "Residual blocks and classifier",
        "description": "Three hierarchical blocks combine normalized LRF attention and feed-forward updates with residual connections before activity classification."
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
          "x": 0.005,
          "y": 0.05,
          "width": 0.196,
          "height": 0.91
        },
        {
          "x": 0.229,
          "y": 0.2,
          "width": 0.049,
          "height": 0.57
        },
        {
          "x": 0.335,
          "y": 0.015,
          "width": 0.66,
          "height": 0.97
        }
      ],
      "sourceUrl": "https://doi.org/10.1109/JSEN.2024.3364187"
    },
    "problem": "The time and modality axes of sensor data have different meanings; enlarging receptive fields alone does not guarantee better HAR.",
    "takeaway": "LRF outperformed reproduced baselines on four HAR datasets and KU-HAR; ablations show that kernel choice matters, while mobile hardware acceleration remains future work.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
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
    "summary": "CSFO addresses long-tailed HAR with class-dependent parameter perturbations, followed by class-balanced classifier training on original and gradient-perturbed features.",
    "steps": [
      {
        "label": "Two-stage long-tail learning",
        "description": "First train a CNN feature extractor and classifier; then freeze the extractor and refine only the classifier under class-balanced sampling."
      },
      {
        "label": "Class-conditioned flattening",
        "description": "Class frequencies and class-specific gradients set parameter-perturbation radii and directions for learning the feature extractor and classifier."
      },
      {
        "label": "Frozen-feature classifier refinement",
        "description": "Freeze the extractor, perturb features along normalized loss gradients, and progressively shift classifier training from empirical loss toward adversarial loss."
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
    },
    "problem": "Frequent activities can dominate training, leaving underrepresented activity categories harder to recognize.",
    "takeaway": "Across four HAR datasets, CSFO reports higher overall accuracy than reproduced baselines; class-group gains vary, and the paper notes computational overhead and limited gains for rare classes.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
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
    "summary": "This attention-based CLDNN weights convolutional features by compatibility with a global representation, then learns a nonlinear dynamical vector field through a numerical multistep residual loss.",
    "steps": [
      {
        "label": "Encode observed dynamics",
        "description": "The CLDNN backbone combines convolutional features with LSTM temporal modelling and forms a global representation of the observed state sequence."
      },
      {
        "label": "Weight local features by global context",
        "description": "Compare features from the third, fourth and fifth convolutional layers with the global vector. Softmax-normalize the compatibility scores, form weighted representations and merge them."
      },
      {
        "label": "Fit the residual and generate trajectories",
        "description": "Learn the vector field with a linear multistep residual loss, then use odeint to generate state trajectories. Comparisons cover Lorenz, Rössler and Hopf systems."
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
    },
    "problem": "Nonlinear system identification needs temporal modelling and a way to emphasize useful observations rather than giving every feature equal influence.",
    "takeaway": "Lorenz, Rössler and Hopf benchmark comparisons report lower trajectory errors than the tested DNN and CLDNN baselines. Accurate tracking of chaotic dynamics remains limited to a finite prediction interval.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    },
    "walkthroughNote": "Feature weighting and the multistep loss train the vector field; numerical integration generates the state trajectory."
  },
  {
    "id": "dswd",
    "title": "Dual Stage-Wise Decoupling Networks for Long-Tailed Activity Recognition Using Wearable Sensors",
    "link": "https://doi.org/10.22967/HCIS.2024.14.052",
    "aliases": [
      "https://doi.org/10.22967/HCIS.2024.14.052"
    ],
    "shortName": "Stage-Wise Decoupling",
    "summary": "DSWD tackles long-tailed wearable activity recognition with two decouplings: feature learning from classifier rebalancing, and multi-branch training from single-branch inference.",
    "steps": [
      {
        "label": "Wearable signals and class imbalance",
        "description": "Collect and window sensor measurements for activity recognition. The long-tail evaluation includes UCI-HAR training sets downsampled to create uneven class frequencies."
      },
      {
        "label": "Learn features, then rebalance the classifier",
        "description": "Train the multi-branch backbone with cross-entropy and weight decay. Freeze the backbone, then fine-tune the classifier with class-balanced loss, weight decay and MaxNorm."
      },
      {
        "label": "Fuse training branches for inference",
        "description": "Fold convolution and batch-normalization parameters and combine the branches into a single inference path. The fine-tuned classifier produces the activity label."
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
    },
    "problem": "Class imbalance biases wearable activity recognition toward frequent activities, while multi-branch feature extractors add deployment cost.",
    "takeaway": "On the four evaluated HAR datasets, DSWD improves overall accuracy over the tested CNN variants while using a simpler inference structure; embedded evidence is limited to the reported Raspberry Pi latency benchmark.",
    "contentReview": {
      "status": "verified",
      "basis": "full-manuscript",
      "reviewedAt": "2026-10-03"
    }
  }
];
