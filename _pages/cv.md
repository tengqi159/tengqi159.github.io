---
layout: page
title: 简历
permalink: /cv/
---

<style>
.cv-section {
  margin-bottom: 3rem;
}

.cv-section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary-color);
}

.cv-item {
  margin-bottom: 2rem;
  padding-left: 1.5rem;
  border-left: 3px solid var(--border-color);
}

.cv-item-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.cv-item-meta {
  color: var(--text-light);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.cv-item-desc {
  color: var(--text-color);
  line-height: 1.8;
}
</style>

## 个人信息

- **姓名**: {{ site.author.name }} ({{ site.author.name_en }})
- **职位**: {{ site.author.position }}
- **单位**: {{ site.author.affiliation }}
- **邮箱**: {{ site.author.email }}
- **研究方向**: 深度学习、可穿戴计算、人体活动识别、主动健康管理

---

<div class="cv-section">
  <h2 class="cv-section-title">🎓 教育背景</h2>
  
  <div class="cv-item">
    <div class="cv-item-title">博士 - 计算机科学与技术</div>
    <div class="cv-item-meta">南京大学 | 2019 - 2024</div>
    <div class="cv-item-desc">
      研究方向：深度学习、人体活动识别<br>
      导师：[导师姓名]
    </div>
  </div>
  
  <div class="cv-item">
    <div class="cv-item-title">硕士 - 计算机科学与技术</div>
    <div class="cv-item-meta">南京大学 | 2016 - 2019</div>
  </div>
  
  <div class="cv-item">
    <div class="cv-item-title">学士 - 计算机科学与技术</div>
    <div class="cv-item-meta">[本科院校] | 2012 - 2016</div>
  </div>
</div>

<div class="cv-section">
  <h2 class="cv-section-title">💼 工作经历</h2>
  
  <div class="cv-item">
    <div class="cv-item-title">直聘副研究员</div>
    <div class="cv-item-meta">郑州大学信息管理学院 | 2025/01 - 至今</div>
    <div class="cv-item-desc">
      从事深度学习、可穿戴计算、人体活动识别等领域的研究工作
    </div>
  </div>
</div>

<div class="cv-section">
  <h2 class="cv-section-title">🏆 荣誉奖项</h2>
  
  <div class="cv-item">
    <div class="cv-item-title">高被引论文</div>
    <div class="cv-item-meta">2021</div>
    <div class="cv-item-desc">
      DanHAR 论文获得 222 次引用，成为领域内高被引论文
    </div>
  </div>
</div>

<div class="cv-section">
  <h2 class="cv-section-title">📊 学术统计</h2>
  
  <div class="cv-item">
    <div class="cv-item-desc">
      - 谷歌学术引用: <strong>{{ site.statistics.citations }}+</strong><br>
      - h-index: <strong>{{ site.statistics.h_index }}</strong><br>
      - 发表论文: <strong>{{ site.statistics.publications }}+</strong> 篇<br>
      - 期刊审稿: IEEE TIM, Scientific Reports, Pattern Recognition 等
    </div>
  </div>
</div>

<div class="cv-section">
  <h2 class="cv-section-title">🔬 研究项目</h2>
  
  <div class="cv-item">
    <div class="cv-item-title">国家重点研发计划</div>
    <div class="cv-item-meta">参与</div>
    <div class="cv-item-desc">
      参与国家重点研发计划项目，从事人体活动识别相关研究
    </div>
  </div>
  
  <div class="cv-item">
    <div class="cv-item-title">社科基金重大项目</div>
    <div class="cv-item-meta">参与</div>
    <div class="cv-item-desc">
      参与社科基金重大项目，研究智能健康管理系统
    </div>
  </div>
</div>

---

<div style="text-align: center; margin-top: 3rem;">
  <a href="{{ site.author.scholar }}" class="btn btn-primary" target="_blank">查看完整学术档案</a>
  <a href="{{ '/publications/' | relative_url }}" class="btn btn-secondary">查看论文列表</a>
</div>
