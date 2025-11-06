<template>
  <div class="captcha-container">
    <q-input
      outlined
      dense
      readonly
      class="captcha-display-input login-page__input"
      :disable="loading"
    >
      <template #prepend>
        <button @click="refreshCaptcha" :disabled="loading" class="captcha-refresh-icon-btn">
          <i class="bi bi-arrow-clockwise captcha-icon"></i>
        </button>
      </template>
      <template #default>
        <div v-if="loading" class="captcha-loading">
          <q-spinner color="primary" size="20px" />
        </div>
        <canvas
          v-else-if="showPlaceholder"
          ref="captchaCanvas"
          class="captcha-canvas"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
        <img
          v-else-if="captchaUrl && !imageError"
          :src="captchaUrl"
          alt="Captcha"
          class="captcha-image"
          @load="onImageLoad"
          @error="onImageError"
        />
        <canvas
          v-else
          ref="captchaCanvas"
          class="captcha-canvas"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { createLogger } from 'src/utils/logger'
import { getCaptchaUrl } from 'src/api/index.js'

const logger = createLogger('CaptchaImage')

const captchaUrl = ref('')
const loading = ref(false)
const captchaToken = ref('')
const imageError = ref(false)
const showPlaceholder = ref(false)
const captchaCanvas = ref(null)
const canvasWidth = 180
const canvasHeight = 40

const generatePlaceholderCaptcha = () => {
  nextTick(() => {
    if (!captchaCanvas.value) return

    const canvas = captchaCanvas.value
    const ctx = canvas.getContext('2d')

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Background - dark mode support
    const isDark = document.body.classList.contains('body--dark')
    ctx.fillStyle = isDark ? '#1f2937' : '#f8fafc'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Generate random text
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let text = ''
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Draw text with distortion
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < text.length; i++) {
      const x = (canvasWidth / (text.length + 1)) * (i + 1)
      const y = canvasHeight / 2 + (Math.random() * 6 - 3)
      const angle = Math.random() * 0.4 - 0.2

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 20 + 30}%)`
      ctx.fillText(text[i], 0, 0)
      ctx.restore()
    }

    // Add noise lines
    ctx.strokeStyle = isDark ? '#374151' : '#cbd5e1'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
      ctx.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
      ctx.stroke()
    }

    // Add noise dots
    ctx.fillStyle = isDark ? '#4b5563' : '#e2e8f0'
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(Math.random() * canvasWidth, Math.random() * canvasHeight, 1, 1)
    }

    captchaToken.value = `placeholder-${text}-${Date.now()}`
    logger.info('Placeholder captcha generated')
  })
}

const loadCaptchaWithApi = async () => {
  try {
    loading.value = true
    imageError.value = false
    showPlaceholder.value = false

    const response = await fetch(`${getCaptchaUrl()}?_=${Date.now()}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    captchaToken.value = `api-captcha-token-${Date.now()}`
    captchaUrl.value = `${getCaptchaUrl()}?t=${captchaToken.value}&_=${Date.now()}`

    logger.info('API Captcha loaded successfully')
  } catch (error) {
    logger.error('Error loading API captcha:', error)
    imageError.value = true
    showPlaceholder.value = true
    captchaToken.value = ''
    captchaUrl.value = ''
    generatePlaceholderCaptcha()
  } finally {
    loading.value = false
  }
}

const loadCaptcha = async () => {
  return await loadCaptchaWithApi()
}

const refreshCaptcha = () => {
  loadCaptcha()
}

const onImageLoad = () => {
  logger.debug('Captcha image loaded successfully')
  imageError.value = false
  showPlaceholder.value = false
}

const onImageError = error => {
  logger.error('Captcha image failed to load:', error)
  imageError.value = true
  showPlaceholder.value = true
  generatePlaceholderCaptcha()
}

watch(showPlaceholder, newVal => {
  if (newVal) {
    generatePlaceholderCaptcha()
  }
})

onMounted(() => {
  loadCaptcha()
  // Initial placeholder in case of immediate error
  setTimeout(() => {
    if (imageError.value || (!captchaUrl.value && !loading.value)) {
      showPlaceholder.value = true
      generatePlaceholderCaptcha()
    }
  }, 1000)
})

defineExpose({
  refreshCaptcha,
  getCaptchaToken: () => captchaToken.value,
})
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.captcha-display-input {
  width: 100%;

  :deep(.q-field) {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  :deep(.q-field__control) {
    border-radius: 4px;
    min-height: 40px;
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0;
    flex: 1 1 auto;

    &:hover {
      border-color: $border-hover;
    }
  }

  :deep(.q-field__control-container) {
    width: 100%;
    display: flex;
    align-items: center;
    flex: 1;
  }

  :deep(.q-field__marginal) {
    flex-shrink: 0;
  }

  :deep(.q-field__label) {
    display: none;
  }

  :deep(.q-field__native) {
    display: none;
  }

  :deep(.q-field__placeholder) {
    display: none;
  }

  :deep(.q-field__control):before {
    border-color: $border-lighter;
  }

  :deep(.q-field__prepend) {
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: auto;
  }

  :deep(.q-field__inner) {
    padding: 0 8px;
    display: flex;
    align-items: center;
    flex: 1;
    min-height: 40px;
    width: 100%;
  }

  :deep(.q-field__append) {
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: auto;
  }
}

.captcha-refresh-icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: auto;
  min-height: auto;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .captcha-icon {
    font-size: 16px;
    color: $text-secondary;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  &:hover .captcha-icon {
    opacity: 1;
  }

  &:disabled .captcha-icon {
    opacity: 0.5;
  }
}

.captcha-image {
  width: 100%;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  border: none;
  border-radius: 0;
  background-color: transparent;
  margin: 0;
  padding: 0;
  display: block;
  object-fit: contain;
  object-position: center;
  flex-shrink: 0;
}

.captcha-canvas {
  width: 100%;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  border: none;
  border-radius: 0;
  background-color: transparent;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  flex-shrink: 0;
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  min-height: 40px;
  background-color: transparent;
  padding: 0 8px;
}

// Mobile responsive - küçük ekranlarda captcha boyutları
@media (max-width: 480px) {
  .captcha-display-input {
    :deep(.q-field__control) {
      min-height: 36px;
      height: 36px;
    }

    :deep(.q-field__inner) {
      min-height: 36px;
    }
  }

  .captcha-image,
  .captcha-canvas {
    height: 36px;
    min-height: 36px;
    max-height: 36px;
  }

  .captcha-loading {
    height: 36px;
    min-height: 36px;
  }

  .captcha-refresh-icon-btn {
    padding: 0;

    .captcha-icon {
      font-size: 16px;
    }
  }
}

// Tablet responsive - orta boyut ekranlar
@media (max-width: 768px) and (min-width: 481px) {
  .captcha-display-input {
    :deep(.q-field__control) {
      min-height: 38px;
      height: 38px;
    }

    :deep(.q-field__inner) {
      min-height: 38px;
    }
  }

  .captcha-image,
  .captcha-canvas {
    height: 38px;
    min-height: 38px;
    max-height: 38px;
  }

  .captcha-loading {
    height: 38px;
    min-height: 38px;
  }
}
</style>
