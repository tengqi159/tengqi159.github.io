---
layout: page
title: 项目
permalink: /projects/
---

<style>
.project-card {
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.project-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-5px);
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.project-desc {
  color: var(--text-color);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.project-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>

## 研究项目

<div class="project-card">
  <h3 class="project-title">深度学习在人体活动识别中的应用</h3>
  <p class="project-desc">
    研究基于深度学习的人体活动识别方法，开发高效的卷积神经网络架构，提升可穿戴设备上的活动识别准确率。
  </p>
  <div class="project-meta">
    <span class="badge badge-primary">深度学习</span>
    <span class="badge badge-primary">HAR</span>
    <span class="badge badge-success">进行中</span>
  </div>
</div>

<div class="project-card">
  <h3 class="project-title">可穿戴计算与健康监测</h3>
  <p class="project-desc">
    利用可穿戴传感器数据进行健康状态监测和疾病预警，开发智能健康管理系统。
  </p>
  <div class="project-meta">
    <span class="badge badge-primary">可穿戴计算</span>
    <span class="badge badge-primary">健康监测</span>
    <span class="badge badge-success">进行中</span>
  </div>
</div>

<div class="project-card">
  <h3 class="project-title">长尾分布下的活动识别优化</h3>
  <p class="project-desc">
    针对现实场景中活动数据的长尾分布问题，研究类别平衡和模型优化方法。
  </p>
  <div class="project-meta">
    <span class="badge badge-primary">长尾学习</span>
    <span class="badge badge-primary">模型优化</span>
    <span class="badge badge-success">进行中</span>
  </div>
</div>

## 合作机会

欢迎对以下方向感兴趣的同学和研究者联系合作：

- 深度学习算法优化
- 可穿戴计算应用
- 人体活动识别
- 健康医疗数据分析

<div style="text-align: center; margin-top: 2rem;">
  <a href="{{ '/admissions/' | relative_url }}" class="btn btn-primary">了解招生信息</a>
</div>
