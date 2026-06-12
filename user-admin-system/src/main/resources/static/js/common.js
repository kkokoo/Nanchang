/* ========== 全局数据缓存 ========== */
const AppCache = {
    _cache: JSON.parse(localStorage.getItem('appCache') || '{}'),
    _ttl: 5 * 60 * 1000,

    get(key) {
        const item = this._cache[key];
        if (!item) return null;
        if (Date.now() - item.time > this._ttl) {
            delete this._cache[key];
            this._save();
            return null;
        }
        return item.data;
    },
    set(key, data) {
        this._cache[key] = { data: data, time: Date.now() };
        this._save();
    },
    clear() {
        this._cache = {};
        this._save();
    },
    _save() {
        try {
            localStorage.setItem('appCache', JSON.stringify(this._cache));
        } catch (e) {
            this._cache = {};
            localStorage.setItem('appCache', '{}');
        }
    }
};

/* ========== 带缓存的请求封装 ========== */
function request(url, method, data, success, useCache) {
    if (useCache === undefined) useCache = false;
    if (useCache && method.toUpperCase() === 'GET') {
        const cacheKey = url + (data ? JSON.stringify(data) : '');
        const cached = AppCache.get(cacheKey);
        if (cached) { success(cached); return; }
    }
    showLoader();
    const isGet = method.toUpperCase() === 'GET';
    $.ajax({
        url: url,
        method: method,
        data: isGet ? data : (data ? JSON.stringify(data) : null),
        contentType: isGet ? undefined : "application/json",
        timeout: 10000,
        success: function (res) {
            hideLoader();
            success(res);
            if (useCache && isGet) {
                const cacheKey = url + (data ? JSON.stringify(data) : '');
                AppCache.set(cacheKey, res);
            }
        },
        error: function () {
            hideLoader();
        }
    });
}

/* ========== 简化版 GET 请求（带缓存） ========== */
function fetchWithCache(url, success, useCache) {
    if (useCache === undefined) useCache = true;
    if (useCache) {
        const cached = AppCache.get(url);
        if (cached) { success(cached); return; }
    }
    showLoader();
    $.ajax({
        url: url,
        method: 'GET',
        timeout: 10000,
        success: function (res) {
            hideLoader();
            success(res);
            if (useCache) AppCache.set(url, res);
        },
        error: function () { hideLoader(); }
    });
}

/* ========== 全局加载条 ========== */
function showLoader() {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.style.cssText = 'position:fixed;top:0;left:0;width:0;height:3px;background:#C53030;z-index:9999;transition:width 0.3s;';
        document.body.appendChild(loader);
    }
    loader.style.width = '70%';
}
function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        setTimeout(function () {
            loader.style.width = '100%';
            setTimeout(function () { loader.style.width = '0'; }, 200);
        }, 100);
    }
}

/* ========== 生成骨架屏 HTML ========== */
function skeletonCard(count) {
    if (count === undefined) count = 3;
    let html = '';
    for (let i = 0; i < count; i++) {
        html += '<div class="bg-white rounded-xl shadow-md p-6 flex gap-6" style="opacity:0.6;">';
        html += '<div class="skeleton w-48 h-32 rounded-lg"></div>';
        html += '<div class="flex-1">';
        html += '<div class="skeleton h-6 w-48 mb-3"></div>';
        html += '<div class="skeleton h-4 w-32 mb-2"></div>';
        html += '<div class="skeleton h-4 w-full mb-2"></div>';
        html += '<div class="skeleton h-4 w-24 mt-4"></div>';
        html += '</div></div>';
    }
    return html;
}

/* ========== 页面进入动画 ========== */
function pageReady() {
    const body = document.body;
    body.classList.add('page-transition');
    requestAnimationFrame(function () { body.classList.add('ready'); });
    lazyLoadImages();
}

/* ========== 图片懒加载 ========== */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('lazy', 'loaded');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(function (img) { observer.observe(img); });
}

/* ========== 预加载图片 ========== */
function preloadImages(urls) {
    urls.forEach(function (url) {
        const img = new Image();
        img.src = url;
    });
}