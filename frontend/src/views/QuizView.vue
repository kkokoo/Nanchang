<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { questionRandom, questionSubmit } from '@/api/question'
import { useUserStore } from '@/stores/user'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'

const { gsap } = useGsap()
const user = useUserStore()

const questions = ref([])
const current = ref(0)
const selected = ref(null)
const answered = ref(false)
const score = ref(0)
const stage = ref('intro') // intro | playing | result
const loading = ref(false)
const optionLabels = ['A', 'B', 'C', 'D']

const q = computed(() => questions.value[current.value])

async function start() {
  loading.value = true
  stage.value = 'playing'
  try {
    const res = await questionRandom(10)
    questions.value = res.data || res || []
    current.value = 0
    score.value = 0
    selected.value = null
    answered.value = false
  } catch (e) { alert('加载题目失败') } finally { loading.value = false }
}

function select(opt) {
  if (answered.value) return
  selected.value = opt
  answered.value = true
  const correct = q.value.answer === opt
  if (correct) score.value += (q.value.score || 1)
  // 提交答题记录
  if (user.userId) {
    questionSubmit({ userId: user.userId, questionId: q.value.questionId, answer: opt }).catch(() => {})
  }
  gsap.fromTo('.q-feedback', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' })
}

function next() {
  if (current.value < questions.value.length - 1) {
    current.value++
    selected.value = null
    answered.value = false
    gsap.fromTo('.q-card', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
  } else {
    stage.value = 'result'
    gsap.from('.result-card', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' })
  }
}

const progress = computed(() => questions.value.length ? ((current.value + (answered.value ? 1 : 0)) / questions.value.length) * 100 : 0)

onMounted(() => {
  gsap.from('.intro-card', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })
})
</script>

<template>
  <div class="page">
    <PageHero title="互动问答" subtitle="在趣味答题中检验你的南昌历史知识" :bread="[{ label: '互动问答' }]" />

    <section class="section">
      <div class="container quiz-wrap">
        <!-- 介绍页 -->
        <div v-if="stage === 'intro'" class="intro-card card-glass">
          <div class="intro-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
          </div>
          <h2 class="font-serif">南昌历史知识挑战</h2>
          <p class="intro-desc">共 10 道随机题目，涵盖历史事件与人物，答对得分，挑战你的历史储备！</p>
          <button class="btn btn-primary btn-lg" @click="start" :disabled="loading">
            {{ loading ? '加载中…' : '开始答题' }}
          </button>
          <RouterLink to="/leaderboard" class="leader-link">查看排行榜 →</RouterLink>
        </div>

        <!-- 答题页 -->
        <div v-else-if="stage === 'playing' && q" class="playing">
          <div class="quiz-progress">
            <div class="prog-bar"><div class="prog-fill" :style="{ width: progress + '%' }"></div></div>
            <span class="prog-text">{{ current + 1 }} / {{ questions.length }} · 得分 {{ score }}</span>
          </div>

          <div class="q-card card-glass">
            <div class="q-feedback" v-if="answered" :class="{ correct: q.answer === selected, wrong: q.answer !== selected }">
              {{ q.answer === selected ? '回答正确！' : '回答错误' }}
            </div>
            <div class="q-tag tag tag-red">第 {{ current + 1 }} 题</div>
            <h3 class="q-content font-serif">{{ q.content }}</h3>
            <div class="q-options">
              <button
                v-for="(opt, i) in [q.optionA, q.optionB, q.optionC, q.optionD]"
                :key="i"
                class="q-option"
                :class="{
                  selected: selected === optionLabels[i],
                  correct: answered && q.answer === optionLabels[i],
                  wrong: answered && selected === optionLabels[i] && q.answer !== optionLabels[i]
                }"
                @click="select(optionLabels[i])"
              >
                <span class="opt-label">{{ optionLabels[i] }}</span>
                <span class="opt-text">{{ opt }}</span>
              </button>
            </div>
            <div v-if="answered && q.analysis" class="q-analysis">
              <strong>解析：</strong>{{ q.analysis }}
            </div>
            <div v-if="answered" class="q-actions">
              <button class="btn btn-primary" @click="next">
                {{ current < questions.length - 1 ? '下一题' : '查看结果' }}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 结果页 -->
        <div v-else-if="stage === 'result'" class="result-card card-glass">
          <div class="result-score">
            <div class="score-num font-serif">{{ score }}</div>
            <div class="score-total">/ {{ questions.reduce((s, q) => s + (q.score || 1), 0) }}</div>
          </div>
          <h2 class="font-serif">{{ score >= 7 ? '历史达人！' : score >= 4 ? '还需努力！' : '继续加油！' }}</h2>
          <p class="result-desc">你答对了 {{ questions.filter((_, i) => false).length }} 道题，共获得 {{ score }} 分</p>
          <div class="result-actions">
            <button class="btn btn-primary" @click="start">再来一轮</button>
            <RouterLink to="/leaderboard" class="btn btn-ghost">排行榜</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.quiz-wrap { max-width: 760px; margin: 0 auto; }
.intro-card { padding: 56px 40px; text-align: center; }
.intro-icon { color: var(--nc-red); margin-bottom: 20px; }
.intro-card h2 { font-size: 28px; font-weight: 800; color: var(--nc-ink); }
.intro-desc { margin: 16px 0 28px; color: var(--nc-text-sub); font-size: 15px; }
.leader-link { display: block; margin-top: 16px; color: var(--nc-red); font-size: 14px; font-weight: 600; }

.quiz-progress { margin-bottom: 24px; }
.prog-bar { height: 8px; background: var(--nc-line); border-radius: 4px; overflow: hidden; }
.prog-fill { height: 100%; background: var(--grad-red); transition: width .4s ease; border-radius: 4px; }
.prog-text { display: block; margin-top: 8px; font-size: 13px; color: var(--nc-text-sub); }

.q-card { padding: 36px; position: relative; }
.q-feedback { position: absolute; top: 16px; right: 16px; padding: 6px 16px; border-radius: var(--r-full); font-size: 13px; font-weight: 700; }
.q-feedback.correct { background: #dcfce7; color: #16a34a; }
.q-feedback.wrong { background: #fee2e2; color: #dc2626; }
.q-tag { margin-bottom: 16px; }
.q-content { font-size: 22px; font-weight: 700; color: var(--nc-ink); line-height: 1.5; }
.q-options { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
.q-option { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: 2px solid var(--nc-line); border-radius: var(--r-md); background: #fff; text-align: left; transition: all .2s ease; }
.q-option:hover:not(.correct):not(.wrong) { border-color: var(--nc-red-soft); background: var(--nc-red-bg); }
.opt-label { width: 32px; height: 32px; border-radius: 50%; background: var(--nc-paper-warm); color: var(--nc-text-sub); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.q-option.selected { border-color: var(--nc-red); background: var(--nc-red-bg); }
.q-option.selected .opt-label { background: var(--nc-red); color: #fff; }
.q-option.correct { border-color: #16a34a; background: #dcfce7; }
.q-option.correct .opt-label { background: #16a34a; color: #fff; }
.q-option.wrong { border-color: #dc2626; background: #fee2e2; }
.q-option.wrong .opt-label { background: #dc2626; color: #fff; }
.opt-text { font-size: 15px; color: var(--nc-text); }
.q-analysis { margin-top: 20px; padding: 16px; background: var(--nc-paper-warm); border-radius: var(--r-sm); font-size: 14px; color: var(--nc-text-sub); line-height: 1.7; border-left: 3px solid var(--nc-gold); }
.q-actions { margin-top: 24px; text-align: right; }

.result-card { padding: 56px 40px; text-align: center; }
.result-score { display: flex; justify-content: center; align-items: baseline; gap: 6px; margin-bottom: 16px; }
.score-num { font-size: 64px; font-weight: 900; color: var(--nc-red); }
.score-total { font-size: 24px; color: var(--nc-text-mute); }
.result-card h2 { font-size: 26px; font-weight: 800; color: var(--nc-ink); }
.result-desc { margin: 12px 0 28px; color: var(--nc-text-sub); }
.result-actions { display: flex; gap: 12px; justify-content: center; }
</style>
