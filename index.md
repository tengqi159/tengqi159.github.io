---
layout: archive
permalink: /
title: ""
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<style>
/* Modern Academic Homepage Styling - Inspired by Siteng Huang */
:root {
  --primary-color: #1a1a1a;
  --secondary-color: #2563eb;
  --accent-color: #3b82f6;
  --text-color: #374151;
  --light-bg: #f9fafb;
  --border-color: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  font-weight: 300;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.intro-section {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: var(--shadow);
  margin-bottom: 3rem;
  border: 1px solid var(--border-color);
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.news-section {
  margin-bottom: 3rem;
}

.news-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.news-timeline {
  position: relative;
  padding-left: 2rem;
}

.news-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--secondary-color);
}

.news-item {
  position: relative;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--secondary-color);
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateX(5px);
  box-shadow: var(--shadow-lg);
}

.news-date {
  color: var(--secondary-color);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.news-content {
  color: var(--text-color);
  line-height: 1.6;
}

.research-section {
  margin-bottom: 3rem;
}

.research-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.research-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.research-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  text-align: center;
}

.research-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-color);
}

.research-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.research-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.research-desc {
  color: var(--text-color);
  line-height: 1.6;
}

.publications-section {
  margin-bottom: 3rem;
}

.pub-title-section {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.pub-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--secondary-color);
  transition: all 0.3s ease;
}

.pub-item:hover {
  transform: translateX(5px);
  box-shadow: var(--shadow-lg);
}

.pub-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.pub-venue {
  color: var(--text-color);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.pub-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.pub-badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.cta-button {
  display: inline-block;
  background: var(--secondary-color);
  color: white !important;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(37, 99, 235, 0.5);
  background: #1d4ed8;
}

.section-divider {
  height: 1px;
  background: var(--border-color);
  margin: 3rem 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .research-grid {
    grid-template-columns: 1fr;
  }
  
  .news-timeline {
    padding-left: 1rem;
  }
}
</style>

<!-- Hero Section -->
<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">滕起</h1>
    <p class="hero-subtitle">南京大学博士 · 直聘副研究员（郑州大学）</p>
    
    <div class="hero-stats">
      <div class="stat-item">
        <span class="stat-number">630+</span>
        <span class="stat-label">谷歌学术引用</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">10+</span>
        <span class="stat-label">高水平论文</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">11</span>
        <span class="stat-label">h-index</span>
      </div>
    </div>
  </div>
</div>

<!-- Introduction Section -->
<div class="intro-section">
  <div class="intro-text">
    <p><strong>滕起</strong>，南京大学博士，直聘副研究员。主要从事<strong>深度学习、可穿戴计算、人体活动识别（HAR）与主动健康管理</strong>等领域研究。</p>
    <p>近年来在 <span style="color: var(--secondary-color); font-weight: 600;">IEEE JBHI、IEEE TIM、IEEE TIE</span> 等国际期刊发表高水平论文10余篇，谷歌学术引用630余次。参与国家重点研发计划及社科基金重大项目多项，担任 IEEE TIM、Scientific Reports、Pattern Recognition 等期刊审稿人。</p>
    <p>欢迎对人工智能与健康医疗交叉领域感兴趣的同学报考。更欢迎具备 <span style="color: var(--secondary-color); font-weight: 600;">Python / PyTorch</span> 或数学基础、踏实勤奋、愿意长期投入科研训练的同学。</p>
  </div>
  <div style="text-align: center;">
    <a href="/admissions/" class="cta-button">📌 查看招生详情</a>
  </div>
</div>

<!-- News Timeline -->
<div class="news-section">
  <h2 class="news-title">📢 最新消息</h2>
  <div class="news-timeline">
    <div class="news-item">
      <div class="news-date">2025/01</div>
      <div class="news-content">加入郑州大学信息管理学院，担任直聘副研究员，开启新的科研征程</div>
    </div>
    <div class="news-item">
      <div class="news-date">2024/12</div>
      <div class="news-content">CSFO: A Category-Specific Flattening Optimization Method 被 IEEE Sensors Journal 接收</div>
    </div>
    <div class="news-item">
      <div class="news-date">2024/11</div>
      <div class="news-content">Dual Stage-Wise Decoupling Networks 被 Pattern Recognition 接收</div>
    </div>
    <div class="news-item">
      <div class="news-date">2024/08</div>
      <div class="news-content">Innovative dual-decoupling CNN 被 IEEE JBHI 接收</div>
    </div>
  </div>
</div>

<div class="section-divider"></div>

<!-- Research Areas -->
<div class="research-section">
  <h2 class="research-title">🔬 研究方向</h2>
  <div class="research-grid">
    <div class="research-card">
      <div class="research-icon">🤖</div>
      <div class="research-name">深度学习</div>
      <div class="research-desc">Deep Learning 算法优化与模型设计</div>
    </div>
    <div class="research-card">
      <div class="research-icon">⌚</div>
      <div class="research-name">可穿戴计算</div>
      <div class="research-desc">Wearable Computing 技术与应用</div>
    </div>
    <div class="research-card">
      <div class="research-icon">🏃</div>
      <div class="research-name">人体活动识别</div>
      <div class="research-desc">Human Activity Recognition (HAR)</div>
    </div>
    <div class="research-card">
      <div class="research-icon">🏥</div>
      <div class="research-name">主动健康管理</div>
      <div class="research-desc">Smart Health 系统与应用</div>
    </div>
  </div>
</div>

<!-- Selected Publications -->
<div class="publications-section">
  <h2 class="pub-title-section">📚 代表作</h2>
  
  <div class="pub-item">
    <div class="pub-title">DanHAR: Dual Attention Network for Multimodal Human Activity Recognition Using Wearable Sensors</div>
    <div class="pub-venue">Applied Soft Computing, 2021</div>
    <div class="pub-stats">
      <span class="pub-badge">🔥 222 Citations</span>
      <span class="pub-badge">高被引论文</span>
    </div>
  </div>
  
  <div class="pub-item">
    <div class="pub-title">The Layer-Wise Training Convolutional Neural Networks Using Local Loss for Sensor-Based Human Activity Recognition</div>
    <div class="pub-venue">IEEE Sensors Journal, 2020</div>
    <div class="pub-stats">
      <span class="pub-badge">📌 209 Citations</span>
      <span class="pub-badge">期刊亮点</span>
    </div>
  </div>
  
  <div class="pub-item">
    <div class="pub-title">Layer-Wise Training Convolutional Neural Networks with Smaller Filters for Human Activity Recognition Using Wearable Sensors</div>
    <div class="pub-venue">IEEE Sensors Journal, 2020</div>
    <div class="pub-stats">
      <span class="pub-badge">⭐ 158 Citations</span>
      <span class="pub-badge">编辑推荐</span>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 2rem;">
    <a href="/publications/" class="cta-button">查看所有论文 →</a>
  </div>
</div>

<!-- Education Background -->
<div class="section-divider"></div>

<div style="text-align: center; margin-top: 3rem; color: #6b7280;">
  <p>© 2025 滕起 | 郑州大学信息管理学院 | 邮箱: teqi159@gmail.com</p>
</div>