import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP 动画工具集
 * 提供 Hero 入场、滚动揭示、数字滚动、视差等常用动画
 */
export function useGsap() {
  const ctx = { cleaners: [] }

  /** Hero 区域文字逐行入场 */
  function heroReveal(targets, opts = {}) {
    const els = Array.isArray(targets) ? targets : [targets]
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.9 },
      ...opts
    })
    tl.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.14 })
    ctx.cleaners.push(() => tl.kill())
    return tl
  }

  /** 滚动揭示：元素进入视口时淡入上移 */
  function scrollReveal(target, opts = {}) {
    const els = typeof target === 'string' ? document.querySelectorAll(target) : target
    if (!els || (els.length !== undefined && els.length === 0)) return []

    // 先设置初始状态，确保元素不会闪烁
    gsap.set(els, { opacity: 0, y: 50 })

    const st = ScrollTrigger.batch(els, {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          overwrite: true,
          ...opts
        }),
      onEnterBack: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          overwrite: true,
        })
    })
    ctx.cleaners.push(() => st.forEach((s) => s.kill()))
    return st
  }

  /** 数字滚动计数 */
  function countUp(el, end, opts = {}) {
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: end,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) el.textContent = Math.floor(obj.val).toLocaleString()
      },
      scrollTrigger: { trigger: el, start: 'top 85%' },
      ...opts
    })
    ctx.cleaners.push(() => tween.kill())
    return tween
  }

  /** 视差背景 */
  function parallax(el, opts = {}) {
    const tween = gsap.to(el, {
      yPercent: opts.depth || 20,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        ...opts
      }
    })
    ctx.cleaners.push(() => tween.kill())
    return tween
  }

  /** 卡片悬浮微动 */
  function tiltCard(el) {
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    ctx.cleaners.push(() => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    })
  }

  onUnmounted(() => {
    ctx.cleaners.forEach((fn) => fn())
  })

  return { heroReveal, scrollReveal, countUp, parallax, tiltCard, gsap, ScrollTrigger }
}
