// 浏览器验证脚本：验证首页、八一专题、3D2 三个页面
// 使用项目根目录 node_modules 中的 playwright
import { pathToFileURL } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../node_modules/playwright/index.js');
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:5175';
const ROOT = 'd:/Desktop/trae/Nanchang';

const results = {
  home: {},
  special81: {},
  threeD2: {}
};

function ensurePng(filepath) {
  return fs.existsSync(filepath) && fs.statSync(filepath).size > 0;
}

async function collectConsoleAnd404(page, label) {
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
  const homeListeners = await collectConsoleAnd404(homePage, 'home');

  await homePage.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('home goto warn:', e.message));
  await homePage.waitForTimeout(2500);

  // 检查全页背景图（.page-bg, opacity 0.12）
  const homeBgInfo = await homePage.evaluate(() => {
    const el = document.querySelector('.page-bg');
    if (!el) return { exists: false };
    const cs = getComputedStyle(el);
    return {
      exists: true,
      opacity: cs.opacity,
      background: cs.backgroundImage,
      rect: el.getBoundingClientRect()
    };
  });

  // 检查 Hero 渐变遮罩透明度（应从 0.78 降到 0.45，能看到背景图）
  const homeOverlayInfo = await homePage.evaluate(() => {
    const el = document.querySelector('.hero-overlay');
    if (!el) return { exists: false };
    const cs = getComputedStyle(el);
    return {
      exists: true,
      background: cs.backgroundImage,
      rect: el.getBoundingClientRect()
    };
  });

  // 检查 hero-bg 背景图加载情况
  const homeHeroBgInfo = await homePage.evaluate(() => {
    const el = document.querySelector('.hero-bg');
    if (!el) return { exists: false };
    const cs = getComputedStyle(el);
    return { exists: true, background: cs.backgroundImage };
  });

  // 检查关键文本
  const homeHeroTitle = await homePage.locator('.hero-title').first().textContent().catch(() => null);

  const homeShot = path.join(ROOT, 'home-bg-check.png');
  await homePage.screenshot({ path: homeShot, fullPage: true });

  results.home = {
    pageBg: homeBgInfo,
    heroOverlay: homeOverlayInfo,
    heroBg: homeHeroBgInfo,
    heroTitle: homeHeroTitle ? homeHeroTitle.replace(/\s+/g, ' ').trim() : null,
    consoleErrors: homeListeners.consoleErrors,
    pageErrors: homeListeners.pageErrors,
    notFoundUrls: homeListeners.notFoundUrls,
    failedRequests: homeListeners.failedRequests,
    screenshot: { path: homeShot, saved: ensurePng(homeShot) }
  };

  console.log('首页 page-bg:', JSON.stringify(homeBgInfo));
  console.log('首页 hero-overlay:', JSON.stringify(homeOverlayInfo));
  console.log('首页 hero-bg:', JSON.stringify(homeHeroBgInfo));
  console.log('首页 hero-title:', homeHeroTitle);
  console.log('首页 404:', homeListeners.notFoundUrls);
  console.log('首页 console errors:', homeListeners.consoleErrors);
  console.log('首页截图已保存:', ensurePng(homeShot));

  await homePage.close();

  // ============== 2. 八一专题 ==============
  console.log('\n========== 2. 八一专题 ==========');
  const spPage = await context.newPage();
  const spListeners = await collectConsoleAnd404(spPage, 'special81');

  await spPage.goto(`${BASE}/special-81`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('sp goto warn:', e.message));
  await spPage.waitForTimeout(3000);

  // Hero 标题
  const spHeroTitle = await spPage.locator('.s-hero-title').first().textContent().catch(() => null);

  // 三个数字 1927 / 08.01 / 02:00
  const spMetaNums = await spPage.evaluate(() => {
    return Array.from(document.querySelectorAll('.s-hero-meta .meta-num')).map(el => el.textContent.trim());
  });

  // 7 个章节
  const spSections = await spPage.evaluate(() => {
    return Array.from(document.querySelectorAll('.ch-section')).map(el => {
      const num = el.querySelector('.ch-num')?.textContent?.trim();
      const title = el.querySelector('.ch-title')?.textContent?.trim();
      return { id: el.id, num, title };
    });
  });

  // 文章导航条 sticky
  const spNavInfo = await spPage.evaluate(() => {
    const nav = document.querySelector('.section-nav');
    if (!nav) return { exists: false };
    const cs = getComputedStyle(nav);
    return {
      exists: true,
      position: cs.position,
      top: cs.top,
      zIndex: cs.zIndex,
      linkCount: nav.querySelectorAll('.nav-link').length,
      linkTexts: Array.from(nav.querySelectorAll('.nav-link')).map(a => a.textContent.trim())
    };
  });

  // Bilibili 视频
  const spBilibili = await spPage.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    const bili = iframes.find(f => f.src.includes('bilibili') || f.src.includes('player.bilibili'));
    return bili ? { src: bili.src } : null;
  });

  // VR iframe
  const spVr = await spPage.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    const vr = iframes.find(f => f.src.includes('720yun'));
    return vr ? { src: vr.src } : null;
  });

  // 5 位领导人头像
  const spLeaders = await spPage.evaluate(() => {
    return Array.from(document.querySelectorAll('.leader-card')).map(card => {
      const name = card.querySelector('.leader-name')?.textContent?.trim();
      const img = card.querySelector('img');
      return { name, imgSrc: img ? img.src : null, imgComplete: img ? img.complete : false, imgNaturalWidth: img ? img.naturalWidth : 0 };
    });
  });

  // 全页背景图
  const spPageBg = await spPage.evaluate(() => {
    const el = document.querySelector('.page-bg');
    if (!el) return { exists: false };
    const cs = getComputedStyle(el);
    return { exists: true, opacity: cs.opacity, background: cs.backgroundImage };
  });

  const spShot = path.join(ROOT, 'special81-full-check.png');
  await spPage.screenshot({ path: spShot, fullPage: true });

  results.special81 = {
    heroTitle: spHeroTitle ? spHeroTitle.trim() : null,
    metaNums: spMetaNums,
    sections: spSections,
    sectionCount: spSections.length,
    nav: spNavInfo,
    bilibili: spBilibili,
    vr: spVr,
    leaders: spLeaders,
    leaderCount: spLeaders.length,
    pageBg: spPageBg,
    consoleErrors: spListeners.consoleErrors,
    pageErrors: spListeners.pageErrors,
    notFoundUrls: spListeners.notFoundUrls,
    failedRequests: spListeners.failedRequests,
    screenshot: { path: spShot, saved: ensurePng(spShot) }
  };

  console.log('八一 hero title:', spHeroTitle);
  console.log('八一 meta nums:', spMetaNums);
  console.log('八一 章节数:', spSections.length, spSections.map(s => s.title).join(' | '));
  console.log('八一 导航:', JSON.stringify(spNavInfo));
  console.log('八一 bilibili:', spBilibili);
  console.log('八一 VR:', spVr);
  console.log('八一 领导人:', spLeaders);
  console.log('八一 page-bg:', JSON.stringify(spPageBg));
  console.log('八一 404:', spListeners.notFoundUrls);
  console.log('八一 console errors:', spListeners.consoleErrors);
  console.log('八一 page errors:', spListeners.pageErrors);
  console.log('八一截图已保存:', ensurePng(spShot));

  await spPage.close();

  // ============== 3. 3D2 页面 ==============
  console.log('\n========== 3. 3D2 页面 ==========');
  const tdPage = await context.newPage();
  const tdListeners = await collectConsoleAnd404(tdPage, '3d2');

  await tdPage.goto(`${BASE}/3d2`, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('3d2 goto warn:', e.message));
  await tdPage.waitForTimeout(5000); // 等待 3D 模型加载

  // 检查页面标题
  const tdTitle = await tdPage.locator('.frame-head h3').first().textContent().catch(() => null);

  // 检查 iframe
  const tdIframeInfo = await tdPage.evaluate(() => {
    const f = document.querySelector('.model-iframe');
    if (!f) return { exists: false };
    return { exists: true, src: f.src, complete: f.complete };
  });

  // 进入 iframe 检查 3D 渲染情况
  let tdCanvasInfo = null;
  let tdLoadingInfo = null;
  try {
    const frame = tdPage.frameLocator('.model-iframe');
    // 检查 canvas 是否渲染
    tdCanvasInfo = await tdPage.evaluate(() => {
      const f = document.querySelector('.model-iframe');
      if (!f || !f.contentDocument) return { accessible: false };
      const doc = f.contentDocument;
      const canvas = doc.querySelector('canvas');
      const loading = doc.querySelector('#loading-status');
      const error = doc.querySelector('#error-info');
      return {
        accessible: true,
        canvasExists: !!canvas,
        canvasW: canvas ? canvas.width : 0,
        canvasH: canvas ? canvas.height : 0,
        loadingText: loading ? loading.textContent.trim() : null,
        loadingDisplay: loading ? getComputedStyle(loading).display : null,
        errorDisplay: error ? getComputedStyle(error).display : null,
        errorText: error ? error.textContent.trim().replace(/\s+/g, ' ') : null
      };
    });
  } catch (e) {
    tdCanvasInfo = { accessible: false, error: e.message };
  }

  const tdShot = path.join(ROOT, '3d2-check.png');
  await tdPage.screenshot({ path: tdShot, fullPage: true });

  results.threeD2 = {
    title: tdTitle ? tdTitle.trim() : null,
    iframe: tdIframeInfo,
    canvas: tdCanvasInfo,
    consoleErrors: tdListeners.consoleErrors,
    pageErrors: tdListeners.pageErrors,
    notFoundUrls: tdListeners.notFoundUrls,
    failedRequests: tdListeners.failedRequests,
    screenshot: { path: tdShot, saved: ensurePng(tdShot) }
  };

  console.log('3d2 title:', tdTitle);
  console.log('3d2 iframe:', tdIframeInfo);
  console.log('3d2 canvas:', tdCanvasInfo);
  console.log('3d2 404:', tdListeners.notFoundUrls);
  console.log('3d2 console errors:', tdListeners.consoleErrors);
  console.log('3d2 page errors:', tdListeners.pageErrors);
  console.log('3d2截图已保存:', ensurePng(tdShot));

  await tdPage.close();

  // 输出汇总 JSON
  fs.writeFileSync(path.join(ROOT, '.browser-check', 'verify-results.json'), JSON.stringify(results, null, 2), 'utf-8');

  await browser.close();
  console.log('\n========== 验证完成 ==========');
}

main().catch(e => {
  console.error('脚本执行失败:', e);
  process.exit(1);
});
