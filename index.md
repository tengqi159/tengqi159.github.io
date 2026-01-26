---
layout: home
title: 首页
---

<!-- Hero Section -->
<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">{{ site.author.name }}</h1>
    <p class="hero-subtitle">{{ site.author.position }} · {{ site.author.affiliation }}</p>
    
    <div class="hero-stats">
      <div class="stat-item">
        <span class="stat-number">{{ site.statistics.citations }}+</span>
        <span class="stat-label">谷歌学术引用</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ site.statistics.publications }}+</span>
        <span class="stat-label">高水平论文</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ site.statistics.h_index }}</span>
        <span class="stat-label">h-index</span>
      </div>
    </div>
  </div>
</div>

<!-- Introduction Section -->
<div class="intro-section">
  <div class="intro-text">
    <p><strong>{{ site.author.name }}</strong>，南京大学博士，直聘副研究员。主要从事<strong>深度学习、可穿戴计算、人体活动识别（HAR）与主动健康管理</strong>等领域研究。</p>
    <p>近年来在 <span class="highlight">IEEE JBHI、IEEE TIM、IEEE TIE</span> 等国际期刊发表高水平论文10余篇，谷歌学术引用630余次。参与国家重点研发计划及社科基金重大项目多项，担任 IEEE TIM、Scientific Reports、Pattern Recognition 等期刊审稿人。</p>
    <p>欢迎对人工智能与健康医疗交叉领域感兴趣的同学报考。更欢迎具备 <span class="highlight">Python / PyTorch</span> 或数学基础、踏实勤奋、愿意长期投入科研训练的同学。</p>
  </div>
  <div style="text-align: center;">
    <a href="{{ '/admissions/' | relative_url }}" class="btn btn-primary">📌 查看招生详情</a>
  </div>
</div>

<!-- News Timeline -->
<div class="news-section">
  <h2 class="section-title">📢 最新消息</h2>
  <div class="news-timeline">
    {% for item in site.data.news %}
    <div class="news-item">
      <div class="news-date">{{ item.date }}</div>
      <div class="news-content">{{ item.content }}</div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="section-divider"></div>

<!-- Research Areas -->
<div class="research-section">
  <h2 class="section-title">🔬 研究方向</h2>
  <div class="research-grid">
    {% for area in site.data.research_areas %}
    <div class="research-card">
      <div class="research-icon">{{ area.icon }}</div>
      <div class="research-name">{{ area.title }}</div>
      <div class="research-desc">{{ area.description }}</div>
    </div>
    {% endfor %}
  </div>
</div>

<!-- Selected Publications Preview -->
<div class="publications-preview">
  <h2 class="section-title">📚 代表作</h2>
  
  <div class="pub-item">
    <div class="pub-title">DanHAR: Dual Attention Network for Multimodal Human Activity Recognition Using Wearable Sensors</div>
    <div class="pub-venue">Applied Soft Computing, 2021</div>
    <div class="pub-stats">
      <span class="badge badge-gradient">🔥 222 Citations</span>
      <span class="badge badge-primary">高被引论文</span>
    </div>
  </div>
  
  <div class="pub-item">
    <div class="pub-title">The Layer-Wise Training Convolutional Neural Networks Using Local Loss for Sensor-Based Human Activity Recognition</div>
    <div class="pub-venue">IEEE Sensors Journal, 2020</div>
    <div class="pub-stats">
      <span class="badge badge-gradient">📌 209 Citations</span>
      <span class="badge badge-primary">期刊亮点</span>
    </div>
  </div>
  
  <div class="pub-item">
    <div class="pub-title">Layer-Wise Training Convolutional Neural Networks with Smaller Filters for Human Activity Recognition Using Wearable Sensors</div>
    <div class="pub-venue">IEEE Sensors Journal, 2020</div>
    <div class="pub-stats">
      <span class="badge badge-gradient">⭐ 158 Citations</span>
      <span class="badge badge-primary">编辑推荐</span>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 2rem;">
    <a href="{{ '/publications/' | relative_url }}" class="btn btn-primary">查看所有论文 →</a>
  </div>
</div>
