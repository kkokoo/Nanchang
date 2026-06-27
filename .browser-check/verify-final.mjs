// 最终验证脚本：针对当前 HomeView.vue / Special81View.vue 实际类名结构
// 选择器：.hero / .hero-bg / .hero-overlay / .chapter / .ch-no / .ch-title
//         .ch-grid / .ch-text-left / .ch-img-left / .ch-full / .hl
//         .nav-bar / .nav-btn / .leaders-band / .leader-item
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright/index.js');
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:5175';
const ROOT = 'd:/Desktop/trae/Nanchang';

const results = {
  home: {},
  special81: {}
};

function ensurePng(filepath) {
  return fs.existsSync(filepath) && fs.statSync(filepath).size > 0;
}

function attachListeners(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const notFoundUrls = [];
  const failedRequests = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('response', resp => {
    if (resp.status() === 404) notFoundUrls.push(resp.url());
    if (resp.status() >= 400) failedRequests.push(`${resp.status()} ${resp.url()}`);
  });
  return { consoleErrors, pageErrors, notFoundUrls, failedRequests };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  // ============== 1. 首页 ==============
  console.log('\n========== 1. 首页 ==========');
  const homePage = await context.newPage();
  const homeL = attachListeners(homePage);

  await homePage.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('home goto warn:', e.message));
  await homePage.waitForTimeout(2500);

  // Hero 背景图 + 渐变遮罩透明度（应已降低，能看到背景图）
  const homeHero = await homePage.evaluate(() => {
    const bg = document.querySelector('.hero-bg');
    const overlay = document.querySelector('.hero-overlay');
    const hero = document.querySelector('.hero');
    const get = el => el ? {
      bgImage: getComputedStyle(el).backgroundImage,
      opacity: getComputedStyle(el).opacity,
      rect: el.getBoundingClientRect()
    } : null;
    return {
      hero: get(hero),
      heroBg: bg ? { ...get(bg), inlineStyle: bg.getAttribute('style') } : null,
      heroOverlay: overlay ? {
        ...get(overlay),
        background: getComputedStyle(overlay).backgroundImage
      } : null
    };
  });

  // 取 hero 中心点像素，验证不是纯黑/纯色（说明背景图可见）
  const homeHeroPixels = await homePage.evaluate(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return null;
    const rect = hero.getBoundingClientRect();
    // 用 canvas 截取 hero 中心区域像素
    return new Promise(resolve => {
      // 用 html2canvas 不现实，直接读取背景图加载状态
      const bg = document.querySelector('.hero-bg');
      const url = bg ? getComputedStyle(bg).backgroundImage : '';
      const m = url.match(/url\(["']?(.*?)["']?\)/);
      if (!m) return resolve({ hasUrl: false });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ hasUrl: true, loaded: true, naturalW: img.naturalWidth, naturalH: img.naturalHeight });
      img.onerror = () => resolve({ hasUrl: true, loaded: false });
      img.src = m[1];
    });
  });

  // 滚动到内容区，检查内容区背景是否为纯色覆盖（不透出）
  await homePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
  await homePage.waitForTimeout(800);

  const homeContentBg = await homePage.evaluate(() => {
    // 取视口中部的元素，看它的背景是否为纯色（非透明）
    const cx = 720, cy = 450;
    const el = document.elementFromPoint(cx, cy);
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    // 向上找直到遇到有背景的祖先
    let cur = el, depth = 0;
    while (cur && depth < 8) {
      const c = getComputedStyle(cur);
      const bg = c.backgroundColor;
      const bgImg = c.backgroundImage;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return {
          found: true,
          tag: cur.tagName,
          className: cur.className,
          backgroundColor: bg,
          backgroundImage: bgImg,
          opacity: c.opacity,
          depth
        };
      }
      cur = cur.parentElement;
      depth++;
    }
    return { found: false, tag: el.tagName, className: el.className };
  });

  // body / main 背景
  const homeBodyBg = await homePage.evaluate(() => {
    const body = getComputedStyle(document.body);
    const main = document.querySelector('.app-main');
    return {
      bodyBg: body.backgroundColor,
      bodyBgImage: body.backgroundImage,
      mainBg: main ? getComputedStyle(main).backgroundColor : null,
      mainBgImage: main ? getComputedStyle(main).backgroundImage : null
    };
  });

  // 检查页面是否有 .page-bg（不应再有）
  const homeHasPageBg = await homePage.evaluate(() => !!document.querySelector('.page-bg'));

  // 全页截图
  const homeShot = path.join(ROOT, 'home-final.png');
  await homePage.screenshot({ path: homeShot, fullPage: true });

  // 滚动后视口截图（验证内容区背景）
  const homeScrollShot = path.join(ROOT, '.browser-check', 'home-scrolled.png');
  await homePage.screenshot({ path: homeScrollShot, fullPage: false });

  results.home = {
    hero: homeHero,
    heroBgLoaded: homeHeroPixels,
    contentBg: homeContentBg,
    bodyBg: homeBodyBg,
    hasPageBg: homeHasPageBg,
    consoleErrors: homeL.consoleErrors,
    pageErrors: homeL.pageErrors,
    notFoundUrls: homeL.notFoundUrls,
    failedRequests: homeL.failedRequests,
    screenshot: { path: homeShot, saved: ensurePng(homeShot) }
  };

  console.log('首页 hero-bg:', JSON.stringify(homeHero.heroBg));
  console.log('首页 hero-overlay:', JSON.stringify(homeHero.heroOverlay));
  console.log('首页 背景图加载:', JSON.stringify(homeHeroPixels));
  console.log('首页 内容区背景:', JSON.stringify(homeContentBg));
  console.log('首页 body/main 背景:', JSON.stringify(homeBodyBg));
  console.log('首页 有.page-bg:', homeHasPageBg);
  console.log('首页 404:', homeL.notFoundUrls);
  console.log('首页 console errors:', homeL.consoleErrors);
  console.log('首页截图已保存:', ensurePng(homeShot));

  await homePage.close();

  // ============== 2. 八一专题 ==============
  console.log('\n========== 2. 八一专题 ==========');
  const spPage = await context.newPage();
  const spL = attachListeners(spPage);

  await spPage.goto(`${BASE}/special-81`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('sp goto warn:', e.message));
  await spPage.waitForTimeout(3000);

  // Hero
  const spHero = await spPage.evaluate(() => {
    const t = document.querySelector('.hero-title');
    const bg = document.querySelector('.hero-bg');
    return {
      title: t ? t.textContent.trim() : null,
      heroBgInline: bg ? bg.getAttribute('style') : null,
      heroBgComputed: bg ? getComputedStyle(bg).backgroundImage : null
    };
  });

  // 7 个章节 + 交替布局验证
  const spSections = await spPage.evaluate(() => {
    return Array.from(document.querySelectorAll('.chapter')).map(el => {
      const no = el.querySelector('.ch-no')?.textContent?.trim();
      const title = el.querySelector('.ch-title')?.textContent?.trim();
      const grid = el.querySelector('.ch-grid');
      const layoutClass = grid ? grid.className : null;
      // 检查实际 DOM 顺序：ch-text 和 ch-visual 谁在前
      const textEl = el.querySelector('.ch-text');
      const visualEl = el.querySelector('.ch-visual');
      let domOrder = null;
      if (textEl && visualEl) {
        domOrder = Array.from(el.querySelectorAll('.ch-text, .ch-visual'))
          .map(e => e.classList.contains('ch-text') ? 'text' : 'visual');
      }
      // 通过 getBoundingClientRect 检查实际左右位置（视觉布局）
      let visualPos = null;
      if (textEl && visualEl) {
        const tr = textEl.getBoundingClientRect();
        const vr = visualEl.getBoundingClientRect();
        visualPos = {
          textLeft: tr.left,
          visualLeft: vr.left,
          visualIsRight: vr.left > tr.left
        };
      }
      return {
        id: el.id,
        no,
        title,
        hasGrid: !!grid,
        layoutClass,
        domOrder,
        visualPos,
        isFull: el.querySelector('.ch-full') ? true : false
      };
    });
  });

  // 高亮文字 .hl 黄色底色
  const spHl = await spPage.evaluate(() => {
    const els = Array.from(document.querySelectorAll('.hl'));
    if (els.length === 0) return { count: 0 };
    const first = els[0];
    const cs = getComputedStyle(first);
    return {
      count: els.length,
      sample: first.textContent.trim().slice(0, 30),
      background: cs.background,
      backgroundImage: cs.backgroundImage,
      color: cs.color
    };
  });

  // 文字鲜明度：检查正文字号 / 颜色对比
  const spTextReadability = await spPage.evaluate(() => {
    const body = document.querySelector('.ch-body p');
    const title = document.querySelector('.ch-title');
    if (!body || !title) return { hasBody: !!body, hasTitle: !!title };
    const bc = getComputedStyle(body);
    const tc = getComputedStyle(title);
    return {
      bodyFontSize: bc.fontSize,
      bodyColor: bc.color,
      bodyLineHeight: bc.lineHeight,
      titleFontSize: tc.fontSize,
      titleColor: tc.color,
      titleFontWeight: tc.fontWeight
    };
  });

  // 导航栏 sticky + 高亮当前章节
  const spNav = await spPage.evaluate(() => {
    const nav = document.querySelector('.nav-bar');
    if (!nav) return { exists: false };
    const cs = getComputedStyle(nav);
    const btns = Array.from(nav.querySelectorAll('.nav-btn'));
    return {
      exists: true,
      position: cs.position,
      top: cs.top,
      zIndex: cs.zIndex,
      btnCount: btns.length,
      btnTexts: btns.map(b => b.textContent.trim()),
      activeBtn: btns.find(b => b.classList.contains('on'))?.textContent?.trim() || null
    };
  });

  // 滚动到第3章，验证 active 高亮切换
  await spPage.evaluate(() => {
    const el = document.getElementById('process');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'instant' });
  });
  await spPage.waitForTimeout(800);
  const spActiveAfterScroll = await spPage.evaluate(() => {
    const on = document.querySelector('.nav-btn.on');
    return on ? on.textContent.trim() : null;
  });

  // 领导人深色背景
  const spLeaders = await spPage.evaluate(() => {
    const band = document.querySelector('.leaders-band');
    if (!band) return { exists: false };
    const cs = getComputedStyle(band);
    const items = Array.from(band.querySelectorAll('.leader-item')).map(it => {
      const img = it.querySelector('img');
      return {
        name: it.querySelector('.leader-name')?.textContent?.trim(),
        role: it.querySelector('.leader-role')?.textContent?.trim(),
        imgSrc: img ? img.src : null,
        imgComplete: img ? img.complete : false,
        imgNaturalW: img ? img.naturalWidth : 0
      };
    });
    return {
      exists: true,
      backgroundColor: cs.backgroundColor,
      background: cs.background,
      count: items.length,
      items
    };
  });

  // Bilibili + VR iframe
  const spIframes = await spPage.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    return iframes.map(f => ({
      src: f.src,
      width: f.getBoundingClientRect().width,
      height: f.getBoundingClientRect().height,
      isBilibili: f.src.includes('bilibili'),
      isVR: f.src.includes('720yun')
    }));
  });

  // 全页背景（不应有 .page-bg 透明背景透出）
  const spBodyBg = await spPage.evaluate(() => {
    const body = getComputedStyle(document.body);
    const main = document.querySelector('.app-main');
    const chapter = document.querySelector('.chapter');
    return {
      bodyBg: body.backgroundColor,
      bodyBgImage: body.backgroundImage,
      mainBg: main ? getComputedStyle(main).backgroundColor : null,
      chapterBg: chapter ? getComputedStyle(chapter).backgroundColor : null,
      chapterAltBg: document.querySelector('.chapter-alt') ? getComputedStyle(document.querySelector('.chapter-alt')).backgroundColor : null,
      hasPageBg: !!document.querySelector('.page-bg')
    };
  });

  // 全页截图
  const spShot = path.join(ROOT, 'special81-final.png');
  await spPage.screenshot({ path: spShot, fullPage: true });

  results.special81 = {
    hero: spHero,
    sections: spSections,
    sectionCount: spSections.length,
    hl: spHl,
    textReadability: spTextReadability,
    nav: spNav,
    activeAfterScrollToProcess: spActiveAfterScroll,
    leaders: spLeaders,
    iframes: spIframes,
    bodyBg: spBodyBg,
    consoleErrors: spL.consoleErrors,
    pageErrors: spL.pageErrors,
    notFoundUrls: spL.notFoundUrls,
    failedRequests: spL.failedRequests,
    screenshot: { path: spShot, saved: ensurePng(spShot) }
  };

  console.log('八一 hero:', JSON.stringify(spHero));
  console.log('八一 章节数:', spSections.length);
  spSections.forEach(s => console.log(`  ${s.no} ${s.id} | ${s.title} | layout=${s.layoutClass} | domOrder=${JSON.stringify(s.domOrder)} | visualRight=${s.visualPos?.visualIsRight} | full=${s.isFull}`));
  console.log('八一 高亮 .hl:', JSON.stringify(spHl));
  console.log('八一 文字可读性:', JSON.stringify(spTextReadability));
  console.log('八一 导航:', JSON.stringify(spNav));
  console.log('八一 滚到第3章后高亮:', spActiveAfterScroll);
  console.log('八一 领导人:', JSON.stringify(spLeaders));
  console.log('八一 iframe:', JSON.stringify(spIframes));
  console.log('八一 body/chapter 背景:', JSON.stringify(spBodyBg));
  console.log('八一 404:', spL.notFoundUrls);
  console.log('八一 console errors:', spL.consoleErrors);
  console.log('八一 page errors:', spL.pageErrors);
  console.log('八一 failed requests:', spL.failedRequests);
  console.log('八一截图已保存:', ensurePng(spShot));

  await spPage.close();

  fs.writeFileSync(path.join(ROOT, '.browser-check', 'verify-final-results.json'), JSON.stringify(results, null, 2), 'utf-8');
  await browser.close();
  console.log('\n========== 验证完成 ==========');
}

main().catch(e => {
  console.error('脚本执行失败:', e);
  process.exit(1);
});
