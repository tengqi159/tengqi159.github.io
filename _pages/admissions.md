---
layout: page
title: 招生信息
permalink: /admissions/
---

<style>
.admission-hero {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
  margin-bottom: 3rem;
}

.admission-hero h2 {
  color: var(--white);
  margin-bottom: 1rem;
}

.admission-section {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  border-left: 4px solid var(--secondary-color);
}

.admission-section h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.requirements-list {
  list-style: none;
  padding: 0;
}

.requirements-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
}

.requirements-list li:last-child {
  border-bottom: none;
}

.requirements-list li::before {
  content: "✓";
  color: var(--secondary-color);
  font-weight: bold;
  margin-right: 1rem;
  font-size: 1.25rem;
}

.highlight-box {
  background: var(--light-bg);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--accent-color);
  margin: 1.5rem 0;
}

.contact-box {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
  margin-top: 3rem;
}

.contact-box h3 {
  color: var(--white);
  margin-bottom: 1rem;
}

.contact-box p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
</style>

<div class="admission-hero">
  <h2>🎓 欢迎加入我们的研究团队</h2>
  <p>探索人工智能与健康医疗的交叉领域</p>
</div>

<div class="admission-section">
  <h3>📋 招生方向</h3>
  <p>我们欢迎对以下研究方向感兴趣的同学：</p>
  <ul class="requirements-list">
    <li>深度学习算法优化与模型设计</li>
    <li>可穿戴计算技术与应用</li>
    <li>人体活动识别（HAR）</li>
    <li>主动健康管理与智能医疗</li>
    <li>时间序列分析与预测</li>
    <li>长尾学习与类别不平衡问题</li>
  </ul>
</div>

<div class="admission-section">
  <h3>💡 我们期望你</h3>
  <ul class="requirements-list">
    <li>对科研有浓厚兴趣，愿意长期投入研究工作</li>
    <li>踏实勤奋，具有良好的学习能力和自我驱动力</li>
    <li>具备扎实的数学基础（线性代数、概率论、优化理论等）</li>
    <li>熟悉至少一门编程语言（Python 优先）</li>
    <li>有深度学习框架使用经验（PyTorch / TensorFlow）者优先</li>
    <li>有论文阅读和写作经验者优先</li>
    <li>英语阅读能力良好，能够阅读英文文献</li>
  </ul>
</div>

<div class="highlight-box">
  <h4>🌟 特别欢迎</h4>
  <p>具备以下技能或经验的同学：</p>
  <ul>
    <li>熟练使用 <strong>Python</strong> 和 <strong>PyTorch</strong></li>
    <li>有机器学习或深度学习项目经验</li>
    <li>有数据分析和可视化能力</li>
    <li>有传感器数据处理经验</li>
    <li>有论文发表经验</li>
  </ul>
</div>

<div class="admission-section">
  <h3>🎯 我们提供</h3>
  <ul class="requirements-list">
    <li>系统的科研训练和学术指导</li>
    <li>充足的计算资源和实验设备</li>
    <li>参与国家级科研项目的机会</li>
    <li>国内外学术交流和会议参与机会</li>
    <li>论文发表指导和支持</li>
    <li>良好的科研氛围和团队协作环境</li>
    <li>有竞争力的奖助学金</li>
  </ul>
</div>

<div class="admission-section">
  <h3>📚 研究成果</h3>
  <p>我们的研究团队在以下方面取得了显著成果：</p>
  <ul class="requirements-list">
    <li>在 IEEE JBHI、IEEE TIM、IEEE TIE 等顶级期刊发表论文 10+ 篇</li>
    <li>谷歌学术引用 {{ site.statistics.citations }}+ 次</li>
    <li>h-index: {{ site.statistics.h_index }}</li>
    <li>多篇高被引论文（200+ 引用）</li>
    <li>参与国家重点研发计划和社科基金重大项目</li>
  </ul>
</div>

<div class="admission-section">
  <h3>📝 申请流程</h3>
  <ol style="line-height: 2;">
    <li>发送邮件至 <strong>{{ site.author.email }}</strong></li>
    <li>邮件标题：<strong>【研究生申请】姓名-学校-专业</strong></li>
    <li>邮件内容包括：
      <ul>
        <li>个人简历（包括教育背景、研究经历、技能特长）</li>
        <li>成绩单（本科/硕士）</li>
        <li>研究兴趣和未来规划</li>
        <li>代表性项目或论文（如有）</li>
      </ul>
    </li>
    <li>初步沟通后安排面试</li>
  </ol>
</div>

<div class="contact-box">
  <h3>📧 联系方式</h3>
  <p>如果你对我们的研究方向感兴趣，欢迎随时联系！</p>
  <p><strong>邮箱</strong>: {{ site.author.email }}</p>
  <p><strong>单位</strong>: {{ site.author.affiliation }}</p>
  <div style="margin-top: 2rem;">
    <a href="mailto:{{ site.author.email }}" class="btn btn-secondary">发送邮件</a>
  </div>
</div>

<div style="text-align: center; margin-top: 3rem; color: var(--text-light);">
  <p>期待与你一起探索人工智能的无限可能！</p>
</div>
