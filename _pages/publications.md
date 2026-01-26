---
layout: page
title: 论文
permalink: /publications/
---

<style>
.pub-header {
  background: var(--gradient-primary);
  padding: 2rem;
  border-radius: var(--radius-lg);
  color: var(--white);
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

.pub-header h2 {
  margin: 0 0 1rem;
  font-size: 1.8rem;
  color: var(--white);
}

.pub-stats-grid {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.pub-stat {
  text-align: center;
}

.pub-stat-number {
  font-size: 2.5rem;
  font-weight: 700;
}

.pub-stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.scholar-btn {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  color: var(--white);
  padding: 0.6rem 1.5rem;
  border-radius: var(--radius-full);
  text-decoration: none;
  margin-top: 1rem;
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.scholar-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  color: var(--white);
}

.year-section {
  margin-bottom: 3rem;
}

.year-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary-color);
}

.pub-card {
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.pub-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: var(--gradient-primary);
}

.pub-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

.pub-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.pub-card-venue {
  color: var(--text-light);
  font-style: italic;
  font-size: 0.95rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
}

.pub-card-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-left: 0.5rem;
}
</style>

<div class="pub-header">
  <h2>📚 论文与成果</h2>
  <div class="pub-stats-grid">
    <div class="pub-stat">
      <div class="pub-stat-number">{{ site.statistics.citations }}+</div>
      <div class="pub-stat-label">谷歌学术引用</div>
    </div>
    <div class="pub-stat">
      <div class="pub-stat-number">{{ site.statistics.publications }}+</div>
      <div class="pub-stat-label">高水平论文</div>
    </div>
    <div class="pub-stat">
      <div class="pub-stat-number">{{ site.statistics.h_index }}</div>
      <div class="pub-stat-label">h-index</div>
    </div>
  </div>
  <a href="{{ site.author.scholar }}" class="scholar-btn" target="_blank">
    🎓 查看谷歌学术主页
  </a>
</div>

{% assign publications_by_year = site.data.publications | group_by: "year" | sort: "name" | reverse %}

{% for year_group in publications_by_year %}
<div class="year-section">
  <h2 class="year-title">{{ year_group.name }}</h2>
  
  {% for pub in year_group.items %}
  <div class="pub-card">
    <div class="pub-card-title">{{ pub.title }}</div>
    <div class="pub-card-venue">{{ pub.venue }}, {{ pub.year }}</div>
    <div class="pub-card-meta">
      {% if pub.citations > 0 %}
      <span class="badge badge-gradient">📖 {{ pub.citations }} 引用</span>
      {% else %}
      <span class="badge badge-primary">🆕 最新</span>
      {% endif %}
      <span class="badge badge-primary">{{ pub.type }}</span>
      {% if pub.highlight %}
      <span class="badge badge-warning">⭐ 高亮</span>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>
{% endfor %}
