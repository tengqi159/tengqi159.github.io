---
layout: archive
title: "项目与专利"
permalink: /projects/
author_profile: true
---

<style>
/* Modern Card Style */
.project-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #eee;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #1e3c72, #2a5298);
}

.project-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 1rem;
}

.project-role {
  display: inline-block;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.patent-card {
  background: #fafafa;
  padding: 1.5rem;
  border-left: 4px solid #1e3c72;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.section-head {
  font-size: 1.8rem;
  color: #333;
  margin: 3rem 0 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
</style>

<div class="section-head">
  🚀 科研项目
</div>

<div class="project-card">
  <div class="project-title">研究方向概览</div>
  <div class="project-role">深度学习 · 可穿戴计算 · HAR · 主动健康</div>
  <p>围绕人体活动识别与健康管理场景，开展算法模型、传感器融合与应用落地研究，服务于智能健康、医疗监测与公共健康管理。</p>
</div>

<div class="project-card">
  <div class="project-title">国家重点研发计划</div>
  <div class="project-role">核心参与</div>
  <p><strong>项目内容：</strong>聚焦智能健康与可穿戴计算关键技术，针对老年人及特殊人群的日常活动监测与健康评估需求，设计高精度人体活动识别模型。提出基于注意力机制的多模态融合算法，有效解决了复杂场景下的动作识别难题。</p>
  <p><strong>关键词：</strong>深度学习、智能健康、可穿戴传感器、行为分析</p>
</div>

<div class="project-card">
  <div class="project-title">国家社科基金重大项目</div>
  <div class="project-role">核心参与</div>
  <p><strong>项目内容：</strong>面向数据驱动的社会治理与智能公共服务场景，探索多源异构数据的融合分析方法。负责健康医疗大数据的挖掘与模式识别模块，为公共卫生决策支持提供算法支撑。</p>
  <p><strong>关键词：</strong>数字政府、信息管理、公共服务、数据挖掘</p>
</div>

<div class="section-head">
  💡 发明专利
</div>

<div class="patent-card">
  <strong>基于双重注意力机制的可穿戴人体活动识别方法及系统</strong>
  <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
    提出一种结合通道注意力与时间注意力的深度神经网络模型，显著提升了传感器数据在噪声环境下的特征提取能力。（实审中/已授权）
  </p>
</div>

<div class="patent-card">
  <strong>一种面向长尾分布数据的行为识别模型训练方法</strong>
  <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
    针对人体活动数据类别不平衡问题，设计类别特定的损失函数优化策略，有效提升了少样本类别的识别精度。
  </p>
</div>

<div class="patent-card">
  <strong>基于轻量级卷积神经网络的可穿戴设备端侧推理方法</strong>
  <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
    通过滤波器剪枝与层级解耦设计，实现了高精度模型在低功耗可穿戴设备上的实时运行。
  </p>
</div>
