---
permalink: /
title: ""
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<style>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.hero-section .subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  margin-bottom: 1rem;
}

.hero-section .tagline {
  font-size: 1rem;
  opacity: 0.85;
}

/* Stats Cards */
.stats-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
}

.stat-card .number {
  font-size: 1.8rem;
  font-weight: 700;
}

.stat-card .label {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Section Styling */
.section-title {
  font-size: 1.5rem;
  color: #333;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #667eea;
  display: inline-block;
}

/* Info Cards */
.info-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #667eea;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.info-card h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.info-card p {
  margin: 0;
  color: #666;
}

.info-card .date {
  font-size: 0.85rem;
  color: #888;
}

/* Research Areas */
.research-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.research-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  transition: transform 0.3s ease;
  cursor: default;
}

.research-item:hover {
  transform: scale(1.05);
}

/* Publication Highlights */
.pub-highlight {
  background: white;
  border: 1px solid #eee;
  padding: 1.2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pub-highlight::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.pub-highlight:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transform: translateX(5px);
}

.pub-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.pub-venue {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.pub-citations {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

/* Skills */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.skill-tag {
  background: #f0f0f0;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #555;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: #667eea;
  color: white;
}

/* Collaborator Cards */
.collab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.collab-card {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.collab-card:hover {
  transform: translateY(-5px);
}

.collab-card img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
  margin-bottom: 0.5rem;
}

.collab-card .name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.collab-card .affiliation {
  font-size: 0.75rem;
  color: #888;
}

/* Visitor Map */
.map-container {
  text-align: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  border-radius: 12px;
}

/* News Section */
.news-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: #fafafa;
  border-radius: 8px;
}

.news-date {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  margin-right: 1rem;
  white-space: nowrap;
}

.news-content {
  color: #555;
  font-size: 0.9rem;
}
</style>

<!-- Hero Section -->
<div class="hero-section">
  <h1>👋 Welcome!</h1>
  <p class="subtitle">I'm <strong>Dr. Qi Teng (滕琦)</strong></p>
  <p class="tagline">Associate Research Fellow @ Zhengzhou University</p>
  
  <div class="stats-container">
    <div class="stat-card">
      <div class="number">900+</div>
      <div class="label">Citations</div>
    </div>
    <div class="stat-card">
      <div class="number">14+</div>
      <div class="label">Publications</div>
    </div>
    <div class="stat-card">
      <div class="number">11</div>
      <div class="label">h-index</div>
    </div>
  </div>
</div>

<!-- About Me -->
<h2 class="section-title">📖 About Me</h2>

I am an **Associate Research Fellow (直聘副研究员)** at the [School of Information Management, Zhengzhou University](http://www5.zzu.edu.cn/glxy/). I received my Ph.D. degree from [Nanjing University](https://www.nju.edu.cn/) in June 2026, supervised by [Prof. Guangwei Hu](https://im.nju.edu.cn/hgw/list.htm).

My research focuses on **Deep Learning for Human Activity Recognition (HAR)** using wearable sensors, with applications in smart healthcare, digital government, and intelligent community services.

---

<!-- Education -->
<h2 class="section-title">🎓 Education</h2>

<div class="info-card">
  <h3>🏛️ Ph.D. in Information Science</h3>
  <p><strong>Nanjing University</strong>, School of Information Management</p>
  <p class="date">Sep 2021 - Jun 2026</p>
</div>

<div class="info-card">
  <h3>📚 M.S. in Computer Science</h3>
  <p><strong>Nanjing Normal University</strong></p>
  <p class="date">Sep 2018 - Jun 2021</p>
</div>

---

<!-- Current Position -->
<h2 class="section-title">💼 Current Position</h2>

<div class="info-card">
  <h3>🔬 Associate Research Fellow (直聘副研究员)</h3>
  <p><strong>Zhengzhou University</strong>, School of Information Management</p>
  <p class="date">Jul 2026 - Present</p>
</div>

---

<!-- Research Interests -->
<h2 class="section-title">🔬 Research Interests</h2>

<div class="research-grid">
  <div class="research-item">🤖 Deep Learning</div>
  <div class="research-item">⌚ Wearable Computing</div>
  <div class="research-item">🏃 Human Activity Recognition</div>
  <div class="research-item">🏛️ Digital Government</div>
  <div class="research-item">📊 Time Series Analysis</div>
  <div class="research-item">🧠 Attention Mechanisms</div>
</div>

---

<!-- Selected Publications -->
<h2 class="section-title">📚 Selected Publications</h2>

<div class="pub-highlight">
  <div class="pub-title">DanHAR: Dual Attention Network for Multimodal Human Activity Recognition Using Wearable Sensors</div>
  <div class="pub-venue">Applied Soft Computing, 2022</div>
  <span class="pub-citations">📖 222 Citations</span>
</div>

<div class="pub-highlight">
  <div class="pub-title">The Layer-Wise Training Convolutional Neural Networks Using Local Loss for Sensor-Based Human Activity Recognition</div>
  <div class="pub-venue">IEEE Sensors Journal, 2020</div>
  <span class="pub-citations">📖 209 Citations</span>
</div>

<div class="pub-highlight">
  <div class="pub-title">Layer-Wise Training Convolutional Neural Networks with Smaller Filters for Human Activity Recognition Using Wearable Sensors</div>
  <div class="pub-venue">IEEE Sensors Journal, 2020</div>
  <span class="pub-citations">📖 158 Citations</span>
</div>

<div class="pub-highlight">
  <div class="pub-title">Triple Cross-Domain Attention on Human Activity Recognition Using Wearable Sensors</div>
  <div class="pub-venue">IEEE TNNLS, 2022</div>
  <span class="pub-citations">📖 128 Citations</span>
</div>

<p style="text-align: center; margin-top: 1.5rem;">
  <a href="/publications/" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.8rem 2rem; border-radius: 30px; text-decoration: none; font-weight: 600; display: inline-block; transition: transform 0.3s ease;">View All Publications →</a>
</p>

---

<!-- Skills -->
<h2 class="section-title">🛠️ Technical Skills</h2>

<div class="skill-tags">
  <span class="skill-tag">Python</span>
  <span class="skill-tag">PyTorch</span>
  <span class="skill-tag">TensorFlow</span>
  <span class="skill-tag">Keras</span>
  <span class="skill-tag">NumPy</span>
  <span class="skill-tag">Pandas</span>
  <span class="skill-tag">Scikit-learn</span>
  <span class="skill-tag">MATLAB</span>
  <span class="skill-tag">Deep Learning</span>
  <span class="skill-tag">Time Series Analysis</span>
  <span class="skill-tag">Signal Processing</span>
</div>

---

<!-- Collaborators -->
<h2 class="section-title">🤝 Research Advisors & Collaborators</h2>

<div class="collab-grid">
  <div class="collab-card">
    <a href="https://im.nju.edu.cn/hgw/list.htm">
      <img src="huangwei.png" alt="Guangwei Hu"/>
      <div class="name">Guangwei Hu</div>
      <div class="affiliation">Professor, NJU</div>
    </a>
  </div>
  
  <div class="collab-card">
    <a href="http://d.njnu.edu.cn/person/3288.html">
      <img src="leizhang.png" alt="Lei Zhang"/>
      <div class="name">Lei Zhang</div>
      <div class="affiliation">Assoc. Prof., NNU</div>
    </a>
  </div>
  
  <div class="collab-card">
    <a href="https://sites.google.com/site/hejunzz/">
      <img src="../images/junhe.jpg" alt="Jun He"/>
      <div class="name">Jun He</div>
      <div class="affiliation">Assoc. Prof., NUIST</div>
    </a>
  </div>
  
  <div class="collab-card">
    <a href="http://www.ise.ynu.edu.cn/teacher/805">
      <img src="../images/haowu.jpg" alt="Hao Wu"/>
      <div class="name">Hao Wu</div>
      <div class="affiliation">Assoc. Prof., YNU</div>
    </a>
  </div>
</div>

---

<!-- News -->
<h2 class="section-title">📢 News</h2>

<div class="news-item">
  <span class="news-date">Jan 2026</span>
  <span class="news-content">🎉 Successfully defended my Ph.D. dissertation at Nanjing University!</span>
</div>

<div class="news-item">
  <span class="news-date">Jul 2026</span>
  <span class="news-content">🏢 Joined Zhengzhou University as Associate Research Fellow.</span>
</div>

<div class="news-item">
  <span class="news-date">2025</span>
  <span class="news-content">📄 New paper on Long-Tailed Activity Recognition accepted to Pattern Recognition.</span>
</div>

---

<!-- Visitor Map -->
<div class="map-container">
  <h3 style="margin-top: 0;">🌍 Visitor Map</h3>
  <a href="https://clustrmaps.com/site/1bkl9" title="Visit tracker">
    <img src="//www.clustrmaps.com/map_v2.png?d=Low9E1eDuwQC9_4r3QNfSbfjL1XZUwXz09oQFvUEK2s&cl=ffffff" alt="Visitor Map"/>
  </a>
</div>

---

<p style="text-align: center; color: #888; font-size: 0.9rem;">
  📧 Contact: <a href="mailto:teqi159@gmail.com">teqi159@gmail.com</a> | 
  <a href="https://scholar.google.com/citations?user=D5kHbeAAAAAJ">Google Scholar</a> | 
  <a href="https://github.com/tengqi159">GitHub</a>
</p>
