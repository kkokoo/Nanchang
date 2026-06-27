// 验证首页固定背景效果
// 1. 检查 .fixed-bg 元素是否存在且 position: fixed
// 2. Hero 区域透明（能看到固定的背景图）
// 3. 内容区域（精选史话、主题导览）有纯色背景覆盖在固定背景上方
// 4. 滚动时固定背景始终保持在屏幕原位
// 5. 截图两张：初始 / 滚动后
// 6. 检查控制台 JS 错误
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright/index.js');
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:5175';
const ROOT = 'd:/Desktop/trae/Nanchang';

const results = {
  fixedBg: {},
  hero: {},
  contentSections: {},
  scrollStability: {},
  screenshots: {},
  consoleErrors: [],
  pageErrors: [],
  failedRequests: []
};

function attachListeners(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('response', resp => {
    if (resp.status() >= 400) failedRequests.push(`${resp.status()} ${resp.url()}`);
  });
  return { consoleErrors, pageErrors, failedRequests };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const L = attachListeners(page);

  console.log('\n========== 访问首页 ==========');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('goto warn:', e.message));
  await page.waitForTimeout(2500);

  // ===== 1. 检查 .fixed-bg 元素 + CSS =====
  console.log('\n----- 1. .fixed-bg 元素检查 -----');
  const fixedBgInfo = await page.evaluate(() => {
    const el = document.querySelector('.fixed-bg');
    if (!el) return { exists: false };
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      exists: true,
      position: cs.position,
      inset: cs.inset,
      top: cs.top, left: cs.left, right: cs.right, bottom: cs.bottom,
      zIndex: cs.zIndex,
      backgroundImage: cs.backgroundImage,
      backgroundSize: cs.backgroundSize,
      backgroundRepeat: cs.backgroundRepeat,
      backgroundPosition: cs.backgroundPosition,
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
    };
  });
  results.fixedBg = fixedBgInfo;
  console.log('.fixed-bg:', JSON.stringify(fixedBgInfo, null, 2));

  // ===== 2. Hero 区域透明（无纯色背景遮住 fixed-bg）=====
  console.log('\n----- 2. Hero 区域透明度检查 -----');
  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return { exists: false };
    const cs = getComputedStyle(hero);
    const overlay = document.querySelector('.hero-overlay');
    const overlayCs = overlay ? getComputedStyle(overlay) : null;
    return {
      exists: true,
      heroZIndex: cs.zIndex,
      heroBgColor: cs.backgroundColor,
      heroBgImage: cs.backgroundImage,
      heroOpacity: cs.opacity,
      overlayExists: !!overlay,
      overlayBg: overlayCs ? overlayCs.background : null,
      overlayBgImage: overlayCs ? overlayCs.backgroundImage : null,
      // 检查 hero 是否在 fixed-bg 之上
      heroAboveFixed: parseInt(cs.zIndex) >= 1
    };
  });
  results.hero = heroInfo;
  console.log('Hero:', JSON.stringify(heroInfo, null, 2));

  // ===== 截图 1：初始位置（Hero 可见）=====
  console.log('\n----- 截图 1: 初始位置 -----');
  const shot1 = path.join(ROOT, 'home-fixed-1.png');
  await page.screenshot({ path: shot1, fullPage: false });
  const shot1Saved = fs.existsSync(shot1) && fs.statSync(shot1).size > 0;
  results.screenshots.initial = { path: shot1, saved: shot1Saved, size: shot1Saved ? fs.statSync(shot1).size : 0 };
  console.log('初始截图已保存:', shot1Saved, shot1);

  // ===== 3. 缓慢滚动到内容区域，检查内容区纯色背景 =====
  console.log('\n----- 3. 滚动到内容区域 (精选史话 / 主题导览) -----');

  // 记录滚动前后 fixed-bg 的位置（应该不变）
  const fixedBgPosBeforeScroll = await page.evaluate(() => {
    const el = document.querySelector('.fixed-bg');
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });

  // 缓慢滚动到 精选史话 section
  await page.evaluate(() => {
    const section = document.querySelector('.section');
    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);

  // 滚动到精选史话后取视口中点元素背景
  const jingxuanBg = await page.evaluate(() => {
    // 找到包含 "精选史话" 的 section
    const sections = Array.from(document.querySelectorAll('.section'));
    const jx = sections.find(s => s.textContent.includes('精选'));
    if (!jx) return { found: false };
    const cs = getComputedStyle(jx);
    return {
      found: true,
      className: jx.className,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      zIndex: cs.zIndex,
      // 视口中点（约 y=450）的元素
      midEl: (() => {
        const el = document.elementFromPoint(720, 450);
        if (!el) return null;
        let cur = el, depth = 0;
        while (cur && depth < 8) {
          const c = getComputedStyle(cur);
          if (c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') {
            return {
              tag: cur.tagName,
              className: cur.className,
              backgroundColor: c.backgroundColor,
              depth
            };
          }
          cur = cur.parentElement;
          depth++;
        }
        return { tag: el.tagName, className: el.className, noSolidBg: true };
      })()
    };
  });
  results.contentSections.jingxuan = jingxuanBg;
  console.log('精选史话 section:', JSON.stringify(jingxuanBg, null, 2));

  // 继续滚动到 主题导览
  await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('.section'));
    const theme = sections.find(s => s.textContent.includes('主题') && s.textContent.includes('导览'));
    if (theme) theme.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);

  const themeBg = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('.section'));
    const theme = sections.find(s => s.textContent.includes('主题') && s.textContent.includes('导览'));
    if (!theme) return { found: false };
    const cs = getComputedStyle(theme);
    return {
      found: true,
      className: theme.className,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      zIndex: cs.zIndex,
      midEl: (() => {
        const el = document.elementFromPoint(720, 450);
        if (!el) return null;
        let cur = el, depth = 0;
        while (cur && depth < 8) {
          const c = getComputedStyle(cur);
          if (c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') {
            return {
              tag: cur.tagName,
              className: cur.className,
              backgroundColor: c.backgroundColor,
              depth
            };
          }
          cur = cur.parentElement;
          depth++;
        }
        return { tag: el.tagName, className: el.className, noSolidBg: true };
      })()
    };
  });
  results.contentSections.theme = themeBg;
  console.log('主题导览 section:', JSON.stringify(themeBg, null, 2));

  // ===== 截图 2：滚动到内容区域后 =====
  console.log('\n----- 截图 2: 滚动到内容区域后 -----');
  const shot2 = path.join(ROOT, 'home-fixed-2.png');
  await page.screenshot({ path: shot2, fullPage: false });
  const shot2Saved = fs.existsSync(shot2) && fs.statSync(shot2).size > 0;
  results.screenshots.scrolled = { path: shot2, saved: shot2Saved, size: shot2Saved ? fs.statSync(shot2).size : 0 };
  console.log('滚动截图已保存:', shot2Saved, shot2);

  // ===== 4. 固定背景在滚动过程中是否保持在屏幕原位 =====
  console.log('\n----- 4. 固定背景位置稳定性 -----');
  const fixedBgPosAfterScroll = await page.evaluate(() => {
    const el = document.querySelector('.fixed-bg');
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });

  // 多次采样：滚到顶部、中部、底部各取一次 fixed-bg 的 rect
  const samples = [];
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  samples.push({ label: 'top', pos: await page.evaluate(() => { const r = document.querySelector('.fixed-bg').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }) });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(300);
  samples.push({ label: 'middle', pos: await page.evaluate(() => { const r = document.querySelector('.fixed-bg').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }) });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.8));
  await page.waitForTimeout(300);
  samples.push({ label: 'near-bottom', pos: await page.evaluate(() => { const r = document.querySelector('.fixed-bg').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }) });

  const allSamePosition = samples.every(s => s.pos.x === samples[0].pos.x && s.pos.y === samples[0].pos.y && s.pos.w === samples[0].pos.w && s.pos.h === samples[0].pos.h);
  results.scrollStability = {
    beforeScroll: fixedBgPosBeforeScroll,
    afterScroll: fixedBgPosAfterScroll,
    samples,
    fixedInPlace: allSamePosition
  };
  console.log('滚动前后 fixed-bg 位置:');
  console.log('  滚动前:', JSON.stringify(fixedBgPosBeforeScroll));
  console.log('  滚动后:', JSON.stringify(fixedBgPosAfterScroll));
  console.log('  多点采样:', JSON.stringify(samples));
  console.log('  固定原位:', allSamePosition);

  // ===== 5. 控制台错误 =====
  results.consoleErrors = L.consoleErrors;
  results.pageErrors = L.pageErrors;
  results.failedRequests = L.failedRequests;
  console.log('\n----- 5. 控制台错误 -----');
  console.log('console errors:', L.consoleErrors);
  console.log('page errors:', L.pageErrors);
  console.log('failed requests:', L.failedRequests);

  await page.close();
  fs.writeFileSync(path.join(ROOT, '.browser-check', 'verify-fixed-bg-results.json'), JSON.stringify(results, null, 2), 'utf-8');
  await browser.close();
  console.log('\n========== 验证完成 ==========');
}

main().catch(e => {
  console.error('脚本执行失败:', e);
  process.exit(1);
});
