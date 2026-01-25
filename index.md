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
/* Modern Gradient Background */
body {
  background: #f0f2f5;
}

/* Hero Section with Glassmorphism */
.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 3.5rem 2rem;
  border-radius: 20px;
  margin-bottom: 2.5rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 80%);
  animation: pulse 15s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  position: relative;
  z-index: 1;
}

.hero-section .subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
  margin-bottom: 1.5rem;
  font-weight: 300;
  position: relative;
  z-index: 1;
}

/* Stats Cards */
.stats-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1.2rem 2rem;
  border-radius: 16px;
  text-align: center;
  min-width: 140px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.stat-card .number {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.stat-card .label {
  font-size: 0.9rem;
  opacity: 0.9;
  color: #e0e0e0;
}

/* Admissions Card - COOL ANIMATION */
.admissions-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin: 3rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(30, 60, 114, 0.15);
  border: 1px solid rgba(30, 60, 114, 0.1);
}

.admissions-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #1e3c72, #2a5298, #6dd5ed);
}

.admissions-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admissions-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 5px solid #2a5298;
}


/* Info Cards */
.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  border-color: #1e3c72;
}

.info-card h3 {
  margin: 0 0 0.5rem;
  color: #1e3c72;
  font-size: 1.2rem;
  font-weight: 600;
}

.info-card p {
  margin: 0;
  color: #555;
  font-size: 1.05rem;
}

/* Research Areas */
.research-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  margin: 1.5rem 0;
}

.research-item {
  background: white;
  color: #1e3c72;
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 2px solid transparent;
}

.research-item:hover {
  transform: translateY(-5px);
  border-color: #1e3c72;
  color: #1e3c72;
  box-shadow: 0 10px 25px rgba(30, 60, 114, 0.15);
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
  margin: 1.5rem 0 2rem;
}

.highlight-card {
  background: linear-gradient(135deg, #ffffff 0%, #f6f8ff 100%);
  border: 1px solid #e6ebf5;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 6px 18px rgba(30, 60, 114, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px rgba(30, 60, 114, 0.18);
}

.highlight-title {
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 0.4rem;
}

.highlight-text {
  color: #1e3c72;
  font-weight: 600;
}

.highlight-desc {
  color: #555;
  font-size: 0.98rem;
  line-height: 1.6;
}

/* Section Title */
.section-title {
  font-size: 1.8rem;
  color: #1e3c72;
  margin: 3rem 0 1.5rem;
  padding-bottom: 0.5rem;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60%;
  height: 4px;
  background: #2a5298;
  border-radius: 2px;
}

/* Publication Highlights */
.pub-highlight {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid #f0f0f0;
}

.pub-highlight:hover {
  transform: translateX(10px);
  border-left: 5px solid #1e3c72;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.pub-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.pub-venue {
  font-size: 0.95rem;
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.pub-stats-badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

<div class="hero-section">
  <h1>滕起</h1>
  <p class="subtitle">南京大学博士 · 直聘副研究员（郑州大学）</p>
  <div class="stats-container">
    <div class="stat-card">
      <div class="number">630+</div>
      <div class="label">谷歌学术引用</div>
    </div>
    <div class="stat-card">
      <div class="number">10+</div>
      <div class="label">高水平论文</div>
    </div>
    <div class="stat-card">
      <div class="number">11</div>
      <div class="label">h-index</div>
    </div>
  </div>
</div>

<div class="admissions-card">
  <div class="admissions-title">
    👋 招生信息
  </div>
  <div class="admissions-content">
    <p><strong>滕起</strong>，南京大学博士，直聘副研究员。主要从事<strong>深度学习、可穿戴计算、人体活动识别（HAR）与主动健康管理</strong>等领域研究。</p>
    <p>近年来在 <span class="highlight-text">IEEE JBHI、IEEE TIM、IEEE TIE</span> 等国际期刊发表高水平论文10余篇，谷歌学术引用630余次。参与国家重点研发计划及社科基金重大项目多项，担任 IEEE TIM、Scientific Reports、Pattern Recognition 等期刊审稿人。</p>
    <p>欢迎对人工智能与健康医疗交叉领域感兴趣的同学报考。更欢迎具备 <span class="highlight-text">Python / PyTorch</span> 或数学基础、踏实勤奋、愿意长期投入科研训练的同学。</p>
    <p>我的学业导师职责是指导你逐步完成 <span class="highlight-text">SCIE/SSCI 论文</span>，为保研升学、科研深造与就业打下扎实基础。</p>
    <div style="text-align: center; margin-top: 2rem;">
      <a href="/admissions/" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 1rem 3rem; border-radius: 50px; text-decoration: none; font-weight: 600; box-shadow: 0 10px 20px rgba(30, 60, 114, 0.3); transition: all 0.3s ease; display: inline-block;">
        📌 查看招生详情
      </a>
    </div>
  </div>
</div>

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<!-- Left Column -->
<div style="flex: 2; min-width: 300px;">

  <!-- Research Interests -->
  <h2 class="section-title">🔬 研究方向</h2>
  <div class="research-grid">
    <div class="research-item">🤖 深度学习（Deep Learning）</div>
    <div class="research-item">⌚ 可穿戴计算（Wearable Computing）</div>
    <div class="research-item">🏃 人体活动识别（HAR）</div>
    <div class="research-item">🏥 主动健康管理（Smart Health）</div>
  </div>

  <h2 class="section-title">✨ 研究亮点</h2>
  <div class="highlight-grid">
    <div class="highlight-card">
      <div class="highlight-title">📈 高质量产出</div>
      <div class="highlight-desc">IEEE JBHI、IEEE TIM、IEEE TIE 等期刊论文 10+，聚焦可穿戴计算与HAR。</div>
    </div>
    <div class="highlight-card">
      <div class="highlight-title">🧠 方法创新</div>
      <div class="highlight-desc">提出多项HAR模型结构改进与长尾分布优化策略，强调可复现与可落地。</div>
    </div>
    <div class="highlight-card">
      <div class="highlight-title">🩺 交叉融合</div>
      <div class="highlight-desc">深度学习 × 健康医疗场景，推动智能健康评估与干预应用。</div>
    </div>
  </div>

  <!-- Selected Publications -->
  <h2 class="section-title">📚 代表作</h2>

  <div class="pub-highlight">
    <div class="pub-title">DanHAR: Dual Attention Network for Multimodal Human Activity Recognition Using Wearable Sensors</div>
    <div class="pub-venue">Applied Soft Computing, 2022</div>
    <span class="pub-stats-badge">🔥 222 Citations</span>
  </div>

  <div class="pub-highlight">
    <div class="pub-title">The Layer-Wise Training Convolutional Neural Networks Using Local Loss for Sensor-Based Human Activity Recognition</div>
    <div class="pub-venue">IEEE Sensors Journal, 2020</div>
    <span class="pub-stats-badge">📌 209 Citations</span>
  </div>

  <div class="pub-highlight">
    <div class="pub-title">Triple Cross-Domain Attention on Human Activity Recognition Using Wearable Sensors</div>
    <div class="pub-venue">IEEE TNNLS, 2022</div>
    <span class="pub-stats-badge">⭐ 128 Citations</span>
  </div>

</div>

<div style="flex: 1; min-width: 250px;">
  <h2 class="section-title">💼 现任</h2>
  <div class="info-card">
    <h3>🔬 直聘副研究员</h3>
    <p><strong>郑州大学 信息管理学院</strong></p>
    <p style="color: #1e3c72; font-weight: 500;">研究方向：深度学习与可穿戴健康</p>
  </div>

  <h2 class="section-title">🧭 学术服务</h2>
  <div class="info-card">
    <h3>期刊审稿</h3>
    <p>IEEE TIM、Scientific Reports、Pattern Recognition 等</p>
  </div>

  <h2 class="section-title">🔗 入口</h2>
  <div class="info-card">
    <p><a href="/publications/">论文列表</a></p>
    <p><a href="/projects/">项目与专利</a></p>
    <p><a href="/admissions/">招生详情</a></p>
  </div>
</div>

</div>

---

<p style="text-align: center; margin-top: 3rem; color: #888;">
  <a href="https://clustrmaps.com/site/1bkl9" title="Visit tracker">
    <img src="//www.clustrmaps.com/map_v2.png?d=Low9E1eDuwQC9_4r3QNfSbfjL1XZUwXz09oQFvUEK2s&cl=ffffff" alt="Visitor Map" style="max-width: 100%; border-radius: 12px;"/>
  </a>
</p>