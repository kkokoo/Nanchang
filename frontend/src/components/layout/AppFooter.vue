<script setup>
const year = new Date().getFullYear()
const navs = [
  { to: '/events', label: '历史事件' },
  { to: '/figures', label: '英雄人物' },
  { to: '/timeline', label: '历史长河' },
  { to: '/faq', label: '用户留言' },
  { to: '/about', label: '关于' }
]
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-col footer-brand">
        <div class="footer-logo">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2 2 7v2h20V7L12 2zM4 11v7H2v2h20v-2h-2v-7h-2v7h-3v-7h-2v7h-2v-7H9v7H6v-7H4z"/></svg>
          <span>南昌历史云志</span>
        </div>
        <p class="footer-desc">挖掘、传播南昌红色文化与千年历史。<br/>一城风华，千载史章。</p>
      </div>
      <div class="footer-col">
        <h5>快速导航</h5>
        <ul>
          <li v-for="n in navs" :key="n.to"><RouterLink :to="n.to">{{ n.label }}</RouterLink></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>专题</h5>
        <ul>
          <li><RouterLink to="/special-81">八一南昌起义</RouterLink></li>
          <li><RouterLink to="/quiz">互动问答</RouterLink></li>
          <li><RouterLink to="/leaderboard">积分排行</RouterLink></li>
          <li><RouterLink to="/3d">3D 文物</RouterLink></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>关于项目</h5>
        <p class="footer-desc">课程项目：不报错全队</p>
        <p class="footer-desc">技术栈：Spring Boot + Vue 3 + GSAP</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">© {{ year }} 南昌历史展示项目 · 英雄城南昌</div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative; z-index: 10;
  background: linear-gradient(180deg, #1A1614 0%, #0F0D0B 100%);
  color: #B8AEA4; margin-top: 40px;
}
.footer-inner { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.4fr; gap: 40px; padding: 56px 24px 40px; }
.footer-logo { display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 800; font-size: 18px; margin-bottom: 14px; }
.footer-logo svg { color: var(--nc-red); }
.footer-desc { font-size: 13px; line-height: 1.7; color: #8C8278; }
.footer-col h5 { color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 16px; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul li a { font-size: 13px; color: #B8AEA4; transition: color .2s; }
.footer-col ul li a:hover { color: var(--nc-gold-light); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding: 18px 0; text-align: center; font-size: 12px; color: #6B6259; }
@media (max-width: 768px) {
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 28px; }
}
</style>
