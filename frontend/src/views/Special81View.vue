<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useGsap } from '@/composables/useGsap'
import { onImgError } from '@/utils/image'

const { gsap, ScrollTrigger, heroReveal, parallax, scrollReveal } = useGsap()

const heroes = [
  { name: '周恩来', role: '前敌委员会书记', img: '/images/role/周恩来.jpg' },
  { name: '贺龙', role: '起义军总指挥', img: '/images/role/贺龙.jpg' },
  { name: '叶挺', role: '前敌总指挥', img: '/images/role/叶挺.jpg' },
  { name: '朱德', role: '第九军副军长', img: '/images/role/朱德.jpg' },
  { name: '刘伯承', role: '参谋团参谋长', img: '/images/role/刘伯承.jpg' }
]

const activeSection = ref('background')
const navItems = [
  { id: 'background', label: '起义背景' },
  { id: 'preparation', label: '秘密准备' },
  { id: 'process', label: '凌晨枪声' },
  { id: 'significance', label: '深远意义' },
  { id: 'archives', label: '原始文献' },
  { id: 'model', label: '模型展示' },
  { id: 'vr', label: 'VR体验' }
]

let scrollHandler = null

onMounted(() => {
  heroReveal(['.hero-badge', '.hero-title', '.hero-meta', '.hero-sub'])
  const bg = document.querySelector('.hero-bg')
  if (bg) parallax(bg, { depth: 30 })
  scrollReveal('.reveal')

  scrollHandler = () => {
    let current = ''
    navItems.forEach(s => {
      const el = document.getElementById(s.id)
      if (el && el.getBoundingClientRect().top <= 140) current = s.id
    })
    if (current) activeSection.value = current
  }
  window.addEventListener('scroll', scrollHandler)
  setTimeout(() => ScrollTrigger.refresh(), 100)
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 110
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="special81">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg" style="background-image: url('/images/history/八一南昌起义.jpg')"></div>
      <div class="hero-mask"></div>
      <div class="hero-inner">
        <div class="hero-badge">重大历史事件回顾</div>
        <h1 class="hero-title font-serif">打响武装反抗的第一枪</h1>
        <p class="hero-sub">八一南昌起义 · 1927</p>
        <div class="hero-meta">
          <div class="meta-block"><span class="meta-val">1927</span><span class="meta-key">Year</span></div>
          <div class="meta-line"></div>
          <div class="meta-block"><span class="meta-val">08.01</span><span class="meta-key">Date</span></div>
          <div class="meta-line"></div>
          <div class="meta-block"><span class="meta-val">02:00</span><span class="meta-key">Time</span></div>
        </div>
      </div>
      <div class="hero-bottom"></div>
    </section>

    <!-- 导航 -->
    <nav class="nav-bar">
      <div class="nav-scroll">
        <button v-for="n in navItems" :key="n.id"
          :class="['nav-btn', { on: activeSection === n.id }]"
          @click="scrollTo(n.id)">{{ n.label }}</button>
      </div>
    </nav>

    <!-- 1. 历史背景 -->
    <section id="background" class="chapter reveal">
      <div class="ch-grid ch-text-left">
        <div class="ch-text">
          <span class="ch-no">01</span>
          <h2 class="ch-title font-serif">历史背景：风云变幻</h2>
          <p class="ch-desc">大革命失败后的严峻时局</p>
          <div class="ch-body">
            <p>1924年至1927年，国共两党携手合作，掀起了轰轰烈烈的大革命浪潮。北伐战争势如破竹，工农运动蓬勃兴起，中国革命呈现前所未有的高涨局面。然而，正当革命即将取得重大胜利之际，国民党右派背叛革命，开始残酷镇压共产党人和革命群众。</p>
            <p><em class="hl">1927年4月12日</em>，蒋介石在上海发动反革命政变，大肆捕杀共产党员、工人领袖和革命群众，制造了震惊中外的<em class="hl">"四一二惨案"</em>。同年<em class="hl">7月15日</em>，汪精卫在武汉公开宣布"分共"，大规模逮捕屠杀共产党人，第一次国共合作彻底破裂，大革命宣告失败。</p>
            <p>在短短几个月内，数十万革命志士惨遭杀害，中国共产党面临前所未有的生存危机。面对血雨腥风、白色恐怖，中国共产党人深刻认识到，<em class="hl">只有拿起枪杆子，建立自己的武装，才能反抗国民党反动派的血腥屠杀，挽救中国革命</em>。在这样生死存亡的历史关头，中共中央毅然决定：<em class="hl">在南昌发动武装起义</em>。</p>
          </div>
        </div>
        <div class="ch-visual">
          <img src="/images/history/南昌起义旧址.jpg" alt="南昌起义旧址" @error="onImgError" />
          <p class="img-cap">南昌起义指挥部旧址 — 江西大旅社</p>
        </div>
      </div>
    </section>

    <!-- 2. 秘密准备 -->
    <section id="preparation" class="chapter chapter-alt reveal">
      <div class="ch-grid ch-text-left">
        <div class="ch-text">
          <span class="ch-no">02</span>
          <h2 class="ch-title font-serif">秘密准备：大旅社风云</h2>
          <p class="ch-desc">南昌城内的秘密军事策划</p>
          <div class="ch-body">
            <p>1927年7月下旬，南昌城内暗流涌动，一场改变中国命运的武装起义正在秘密酝酿。中共中央派<em class="hl">周恩来</em>秘密抵达南昌，担任前敌委员会书记，全面领导起义筹备工作。起义指挥部秘密设在南昌市中心的<em class="hl">江西大旅社</em>。</p>
            <p><em class="hl">7月27日</em>，<em class="hl">贺龙</em>率领第二十军、<em class="hl">叶挺</em>率领第十一军第二十四师，先后秘密进驻南昌城。<em class="hl">朱德</em>率领第三军军官教育团和南昌公安局警察武装，在城内配合行动。</p>
            <p>起义前夕，张国焘受共产国际指示赶到南昌，主张推迟甚至取消起义。<em class="hl">周恩来坚决反对，以辞职抗争，最终坚持原定8月1日凌晨起义计划</em>。</p>
          </div>
        </div>
        <div class="ch-visual ch-tl-visual">
          <div class="tl-rail">
            <div class="tl-rail-node">
              <div class="tl-rail-dot"></div>
              <div class="tl-rail-content">
                <strong>7月25日</strong>
                <p>前敌委员会成立</p>
              </div>
            </div>
            <div class="tl-rail-node">
              <div class="tl-rail-dot"></div>
              <div class="tl-rail-content">
                <strong>7月27日</strong>
                <p>主力部队集结南昌</p>
              </div>
            </div>
            <div class="tl-rail-node">
              <div class="tl-rail-dot"></div>
              <div class="tl-rail-content">
                <strong>7月30日</strong>
                <p>起义决策之争</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 凌晨枪声 -->
    <section id="process" class="chapter reveal">
      <div class="ch-grid ch-text-left">
        <div class="ch-text">
          <span class="ch-no">03</span>
          <h2 class="ch-title font-serif">凌晨枪声：激战南昌城</h2>
          <p class="ch-desc">震惊中外的武装战斗全过程</p>
          <div class="ch-body">
            <p><em class="hl">1927年8月1日凌晨2时整</em>，三颗红色信号弹划破南昌漆黑的夜空，震惊中外的南昌起义正式打响。<em class="hl">两万余名起义将士</em>按照预定部署，从四面八方同时向南昌城内国民党守军发起猛烈进攻。</p>
            <p>贺龙部主攻国民党江西省政府大楼，叶挺部歼灭敌军精锐部队，朱德部负责控制城北交通要道。起义将士冒着枪林弹雨奋勇冲锋，展现出<em class="hl">不怕牺牲、英勇无畏的革命精神</em>。</p>
            <p>经过四个多小时的浴血奋战，至清晨6时，南昌城内国民党守军被全部歼灭，<em class="hl">共毙伤俘敌军3000余人，缴获大量武器装备</em>。鲜艳的红旗在南昌城头高高升起。</p>
          </div>
        </div>
        <div class="ch-visual">
          <div class="video-box">
            <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=297880008&bvid=BV1pF41137Dk&cid=567457654&p=1"
                    scrolling="no" frameborder="0" allowfullscreen="true"></iframe>
          </div>
          <p class="img-cap">南昌起义历史影像</p>
        </div>
      </div>
    </section>

    <!-- 4. 深远意义 -->
    <section id="significance" class="chapter chapter-alt reveal">
      <div class="ch-grid ch-img-left">
        <div class="ch-visual">
          <img src="/images/history/八一建军节.jpg" alt="八一建军节" @error="onImgError" />
          <p class="img-cap">八一建军节 — 人民军队的诞生</p>
        </div>
        <div class="ch-text">
          <span class="ch-no">04</span>
          <h2 class="ch-title font-serif">深远意义：建军的开端</h2>
          <p class="ch-desc">改变中国革命走向的里程碑事件</p>
          <div class="ch-body">
            <p>南昌起义是中国革命史上具有里程碑意义的伟大事件，<em class="hl">打响了武装反抗国民党反动派的第一枪</em>，<em class="hl">标志着中国共产党独立领导革命战争、创建人民军队、武装夺取政权的正式开端</em>。</p>
            <p>南昌起义保存下来的革命火种，后来转战广东、福建、江西等地，最终与毛泽东领导的秋收起义部队在<em class="hl">井冈山胜利会师</em>，为中国革命开辟<em class="hl">"农村包围城市、武装夺取政权"</em>的正确道路奠定坚实基础。</p>
            <p><em class="hl">1933年</em>，中华苏维埃共和国临时中央政府正式将<em class="hl">8月1日定为中国工农红军成立纪念日</em>。南昌起义铸就的<em class="hl">"坚定信念、百折不挠、英勇无畏、为民奋斗"的八一精神</em>，成为中国人民解放军的精神旗帜。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 原始文献 -->
    <section id="archives" class="chapter reveal">
      <div class="ch-grid ch-text-left">
        <div class="ch-text">
          <span class="ch-no">05</span>
          <h2 class="ch-title font-serif">原始文献：历史的见证</h2>
          <p class="ch-desc">留存至今的珍贵革命史料</p>
          <div class="ch-body">
            <p>南昌起义留存的原始文献，是见证这段伟大历史的珍贵实物，记录了起义决策、军事部署、革命主张等关键内容。</p>
            <p>1927年8月1日，<em class="hl">宋庆龄、毛泽东、周恩来、贺龙、叶挺、朱德、刘伯承等22位革命志士联名发表《中央委员宣言》</em>，痛斥国民党反动派背叛革命、屠杀民众的滔天罪行，号召全国人民奋起反抗。</p>
            <p>前敌委员会会议记录、起义军作战命令、士兵誓词、往来电报等原始史料，均真实还原起义全过程，成为<em class="hl">传承红色基因、弘扬革命精神的重要载体</em>。</p>
          </div>
        </div>
        <div class="ch-visual">
          <img src="/images/history/南昌民国日报.jpg" alt="南昌民国日报" @error="onImgError" />
          <p class="img-cap">南昌民国日报 — 起义历史文献</p>
        </div>
      </div>
    </section>

    <!-- 6. 数字模型 -->
    <section id="model" class="chapter chapter-alt reveal">
      <div class="ch-grid ch-img-left">
        <div class="ch-visual">
          <div class="model-duo">
            <img src="/images/history/危难中奋起.jpg" alt="危难中奋起" @error="onImgError" />
            <img src="/images/history/石破天惊.jpg" alt="石破天惊" @error="onImgError" />
          </div>
          <p class="img-cap">左：《危难中奋起》 右：《石破天惊》</p>
        </div>
        <div class="ch-text">
          <span class="ch-no">06</span>
          <h2 class="ch-title font-serif">数字模型：还原历史场景</h2>
          <p class="ch-desc">3D沉浸式体验南昌起义历史现场</p>
          <div class="ch-body">
            <p>借助现代3D数字技术，我们精准还原了1927年南昌起义核心场景与建筑布局，通过交互式3D模型，您可以全方位、多角度查看起义指挥部、战斗核心区域等关键地点的细节。</p>
            <p>模型基于历史文献、老照片、实地测绘等多源资料构建，力求还原历史原貌，让您能够直观了解起义现场的空间布局、兵力部署和战斗进程。</p>
          </div>
          <div class="model-links">
            <RouterLink to="/3d" class="model-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2 2 7v10l10 5 10-5V7L12 2z"/></svg>
              进入《危难中奋起》3D模型
            </RouterLink>
            <RouterLink to="/3d2" class="model-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2 2 7v10l10 5 10-5V7L12 2z"/></svg>
              进入《石破天惊》3D模型
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. VR全景 -->
    <section id="vr" class="chapter reveal">
      <div class="ch-full">
        <span class="ch-no ch-no-center">07</span>
        <h2 class="ch-title ch-title-center font-serif">VR全景：身临其境红色景点</h2>
        <p class="ch-desc ch-desc-center">360° 沉浸式参观起义旧址</p>
        <p class="vr-intro">拖动下面的全景视角，身临其境地参观南昌起义红色景点，感受英雄城的历史空间布局。支持鼠标拖动、滚轮缩放、全屏查看。</p>
        <div class="vr-box">
          <iframe
            src="https://www.720yun.com/t/44vkt7fhr7m?scene_id=73584678"
            allowfullscreen webkitallowfullscreen mozallowfullscreen
            allow="fullscreen; vr; gyroscope; accelerometer"
            scrolling="no" title="红色景点VR全景"></iframe>
        </div>
        <p class="vr-hint">提示：鼠标拖动旋转视角，滚轮缩放，点击右上角全屏按钮沉浸式浏览</p>
      </div>
    </section>

    <!-- 领导人 -->
    <section class="leaders-band reveal">
      <h3 class="leaders-heading font-serif">起义核心领导集体</h3>
      <div class="leaders-row">
        <RouterLink v-for="h in heroes" :key="h.name" to="/figures" class="leader-item">
          <div class="leader-photo"><img :src="h.img" :alt="h.name" @error="onImgError" /></div>
          <span class="leader-name">{{ h.name }}</span>
          <span class="leader-role">{{ h.role }}</span>
        </RouterLink>
      </div>
    </section>

    <footer class="s-footer">
      <p>南昌历史云 · 八一专项系列</p>
    </footer>
  </div>
</template>

<style scoped>
/* ====== Hero ====== */
.hero { position: relative; height: 520px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.hero-bg { position: absolute; inset: -10% 0 0 0; height: 120%; background-size: cover; background-position: center; will-change: transform; }
.hero-mask { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,12,8,0.55) 0%, rgba(60,20,16,0.5) 50%, rgba(20,12,8,0.75) 100%); }
.hero-inner { position: relative; z-index: 2; text-align: center; color: #fff; padding: 0 24px; }
.hero-badge { display: inline-block; background: #C53030; color: #fff; padding: 6px 22px; border-radius: 4px; font-size: 13px; font-weight: 700; letter-spacing: 4px; margin-bottom: 22px; }
.hero-title { font-size: 56px; font-weight: 900; letter-spacing: 6px; text-shadow: 0 4px 30px rgba(0,0,0,0.6); }
.hero-sub { margin-top: 12px; font-size: 16px; letter-spacing: 3px; color: rgba(255,255,255,0.75); }
.hero-meta { display: flex; align-items: center; justify-content: center; gap: 28px; margin-top: 30px; }
.meta-block { text-align: center; }
.meta-val { display: block; font-size: 32px; font-weight: 800; color: #FCA5A5; font-family: var(--font-serif); }
.meta-key { display: block; font-size: 10px; text-transform: uppercase; color: rgba(252,165,165,0.6); letter-spacing: 2px; }
.meta-line { width: 1px; height: 42px; background: rgba(252,165,165,0.25); }
.hero-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent, #FAF8F5); z-index: 1; }

/* ====== 导航 ====== */
.nav-bar { background: #fff; border-bottom: 1px solid #eee; position: sticky; top: 64px; z-index: 40; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.nav-scroll { display: flex; justify-content: center; gap: 4px; padding: 12px 16px; overflow-x: auto; flex-wrap: wrap; }
.nav-btn { font-size: 13.5px; font-weight: 600; color: #888; padding: 7px 18px; border: none; background: none; border-radius: 20px; cursor: pointer; transition: all .25s; white-space: nowrap; }
.nav-btn:hover { color: #C53030; background: #FEF2F2; }
.nav-btn.on { color: #fff; background: #C53030; }

/* ====== 章节 ====== */
.chapter { padding: 90px 0; background: #FAF8F5; }
.chapter-alt { background: #fff; }
.ch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; max-width: 1180px; margin: 0 auto; padding: 0 40px; align-items: center; }
.ch-text-left .ch-text { order: 1; }
.ch-text-left .ch-visual { order: 2; }
.ch-img-left .ch-visual { order: 1; }
.ch-img-left .ch-text { order: 2; }

.ch-text { position: relative; }
.ch-no { display: block; font-size: 80px; font-weight: 900; line-height: 1; color: #FEE2E2; font-family: var(--font-serif); margin-bottom: -20px; }
.ch-title { font-size: 30px; font-weight: 800; color: #1a1a1a; line-height: 1.3; position: relative; }
.ch-desc { font-size: 15px; color: #C53030; font-weight: 600; margin-top: 6px; margin-bottom: 24px; }
.ch-body { font-size: 15.5px; line-height: 2; color: #333; }
.ch-body p { margin-bottom: 14px; }

.hl { background: linear-gradient(180deg, transparent 55%, #FEF3C7 55%); color: #B91C1C; font-style: normal; font-weight: 600; padding: 0 2px; }

/* 图片区 */
.ch-visual { position: relative; }
.ch-visual img { width: 100%; border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.12); display: block; }
.img-cap { margin-top: 12px; font-size: 13px; color: #999; text-align: center; }

/* 右侧时间轴视觉 */
.ch-tl-visual { display: flex; align-items: center; justify-content: center; min-height: 320px; }
.tl-rail {
  position: relative;
  padding: 32px 28px 32px 44px;
  background: linear-gradient(135deg, #FEF2F2 0%, #fff 60%);
  border-radius: 16px;
  border: 1px solid #FEE2E2;
  box-shadow: 0 8px 28px rgba(197,48,48,0.08);
  min-width: 280px;
}
.tl-rail::before {
  content: '';
  position: absolute;
  left: 23px; top: 28px; bottom: 28px;
  width: 2px;
  background: linear-gradient(180deg, #C53030 0%, #FCA5A5 50%, #FEE2E2 100%);
  border-radius: 1px;
}
.tl-rail-node {
  position: relative;
  padding: 12px 0;
}
.tl-rail-node:not(:last-child) { margin-bottom: 8px; }
.tl-rail-dot {
  position: absolute;
  left: -28px; top: 16px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #C53030;
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px #FEE2E2;
}
.tl-rail-content strong {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #B91C1C;
  font-family: var(--font-serif);
  letter-spacing: 1px;
}
.tl-rail-content p {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
  line-height: 1.6;
}

/* 全文居中布局（无图片时） */
.ch-full-text {
  grid-template-columns: 1fr;
  max-width: 780px;
}
.ch-text-center {
  text-align: center;
}
.ch-text-center .ch-no {
  margin-left: auto;
  margin-right: auto;
}
.ch-body-center {
  max-width: 680px;
  margin: 0 auto;
}
.mini-tl-center {
  max-width: 400px;
  margin: 28px auto 0;
  text-align: left;
  padding-left: 24px;
  border-left: 2px solid #FEE2E2;
}

/* 标签卡片 */
.tag-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
.tag-pair-col { grid-template-columns: 1fr; }
.tag-card { background: #F8F6F3; padding: 16px 20px; border-radius: 8px; border-left: 3px solid #C53030; }
.tag-card h4 { font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
.tag-card span { font-size: 12.5px; color: #888; }
.tag-card-red { background: #FEF5F5; border-left-color: #DC2626; }

/* 时间线 */
.mini-tl { margin-top: 24px; padding-left: 24px; border-left: 2px solid #FEE2E2; }
.tl-node { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; position: relative; }
.tl-dot { width: 12px; height: 12px; border-radius: 50%; background: #C53030; border: 2px solid #fff; box-shadow: 0 0 0 2px #FEE2E2; flex-shrink: 0; margin-top: 4px; position: absolute; left: -31px; }
.tl-node strong { font-size: 14px; color: #1a1a1a; }
.tl-node p { font-size: 13px; color: #888; margin-top: 2px; }

/* 战斗点 */
.battle-list { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
.battle-row { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #444; }
.battle-pin { background: #C53030; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 3px; flex-shrink: 0; margin-top: 3px; font-weight: 600; }

/* 视频 */
.video-box { width: 100%; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.12); }
.video-box iframe { width: 100%; height: 100%; border: 0; display: block; }

/* 模型双图 */
.model-duo { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.model-duo img { border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.model-links { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.model-link { display: flex; align-items: center; gap: 10px; background: #B91C1C; color: #fff; font-weight: 600; font-size: 14px; padding: 14px 24px; border-radius: 8px; text-decoration: none; transition: all .25s; box-shadow: 0 4px 12px rgba(185,28,28,0.25); }
.model-link:hover { background: #991B1B; transform: translateX(4px); box-shadow: 0 6px 18px rgba(185,28,28,0.35); }

/* VR全宽 */
.ch-full { max-width: 1000px; margin: 0 auto; padding: 0 40px; text-align: center; }
.ch-no-center { text-align: center; margin-bottom: -10px; }
.ch-title-center { text-align: center; }
.ch-desc-center { text-align: center; }
.vr-intro { font-size: 15px; line-height: 1.9; color: #555; max-width: 680px; margin: 0 auto 28px; }
.vr-box { border-radius: 12px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.12); border: 1px solid #eee; position: relative; padding-bottom: 56.25%; }
.vr-box iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vr-hint { margin-top: 14px; font-size: 13px; color: #999; }

/* 领导人 */
.leaders-band { background: #1a1410; padding: 70px 40px; text-align: center; }
.leaders-heading { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 36px; letter-spacing: 2px; }
.leaders-row { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
.leader-item { text-align: center; text-decoration: none; transition: transform .3s; }
.leader-item:hover { transform: translateY(-6px); }
.leader-photo { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin: 0 auto 12px; border: 3px solid rgba(201,162,39,0.4); }
.leader-photo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(80%); transition: filter .3s; }
.leader-item:hover .leader-photo img { filter: grayscale(0); }
.leader-name { display: block; font-size: 16px; font-weight: 700; color: #fff; }
.leader-role { display: block; font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 3px; }

/* 底部 */
.s-footer { background: #0c0908; color: #666; padding: 28px; text-align: center; font-size: 13px; }

/* ====== 响应式 ====== */
@media (max-width: 900px) {
  .ch-grid { grid-template-columns: 1fr; gap: 32px; padding: 0 24px; }
  .ch-text-left .ch-text, .ch-img-left .ch-text { order: 1; }
  .ch-text-left .ch-visual, .ch-img-left .ch-visual { order: 2; }
  .hero-title { font-size: 36px; letter-spacing: 3px; }
  .ch-no { font-size: 56px; }
  .ch-title { font-size: 24px; }
  .chapter { padding: 56px 0; }
  .tag-pair { grid-template-columns: 1fr; }
  .leaders-row { gap: 24px; }
  .ch-tl-visual { min-height: auto; justify-content: flex-start; }
  .tl-rail { min-width: 0; width: 100%; }
}
@media (max-width: 600px) {
  .hero-title { font-size: 28px; }
  .hero-meta { gap: 14px; }
  .meta-val { font-size: 22px; }
  .ch-no { font-size: 42px; }
  .ch-title { font-size: 20px; }
  .chapter { padding: 40px 0; }
  .nav-btn { font-size: 12px; padding: 5px 12px; }
  .model-duo { grid-template-columns: 1fr; }
}
</style>
