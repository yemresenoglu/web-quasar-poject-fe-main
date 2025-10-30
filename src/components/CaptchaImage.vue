<template>
  <div class="captcha-container">
    <q-input outlined dense readonly class="captcha-input" :disable="loading">
      <template v-slot:prepend>
        <button @click="refreshCaptcha" :disabled="loading" class="captcha-refresh-btn">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </template>
      <template v-slot:default>
        <q-img
          :src="captchaUrl"
          alt="Captcha"
          class="captcha-image"
          @load="onImageLoad"
          @error="onImageError"
          spinner-color="primary"
          spinner-size="20px"
        >
          <template v-slot:loading>
            <div class="captcha-loading">
              <q-spinner color="primary" size="20px" />
            </div>
          </template>
        </q-img>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createLogger } from 'src/utils/logger'
import { getCaptchaUrl } from 'src/api/index.js'

const logger = createLogger('CaptchaImage')

const captchaUrl = ref('')
const loading = ref(false)
const captchaToken = ref('')

const loadCaptchaWithApi = async () => {
  try {
    loading.value = true

    const response = await fetch(`${getCaptchaUrl()}?_=${Date.now()}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    captchaToken.value = 'api-captcha-token-' + Date.now()
    captchaUrl.value = `${getCaptchaUrl()}?t=${captchaToken.value}&_=${Date.now()}`

    logger.info('API Captcha loaded successfully')
  } catch (error) {
    logger.error('Error loading API captcha:', error)
    captchaToken.value = ''
    captchaUrl.value = ''
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
}

const onImageError = (error) => {
  logger.error('Captcha image failed to load:', error)
}

onMounted(() => {
  loadCaptcha()
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
}

// LoginPage stili - q-input
.captcha-input {
  :deep(.q-field__control) {
    border-radius: 4px;
    min-height: 40px;

    &:hover {
      border-color: $border-hover;
    }
  }

  :deep(.q-field__label) {
    font-size: 13px;
    color: $text-secondary;
    font-weight: 400;
  }

  :deep(.q-field__native) {
    display: none;
  }

  :deep(.q-field__placeholder) {
    display: none;
  }

  :deep(.q-field__control) {
    padding: 0;
  }

  :deep(.q-field__control):before {
    border-color: $border-lighter;
  }

  :deep(.q-field__prepend),
  :deep(.q-field__append) {
    .q-icon,
    i {
      font-size: 16px;
      color: $text-secondary;
      opacity: 0.7;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
}

.captcha-refresh-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: $text-secondary;
  border-radius: 2px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  // Dark mode theme transition
  .body--dark & {
    color: #d1d5db;
  }

  &:hover {
    color: $text-primary;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    font-size: 14px;
  }
}

.captcha-image {
  height: 40px;
  min-width: 180px;
  max-width: 180px;
  border: 1px solid $border-light;
  border-radius: 4px;
  background-color: $background-card;
  margin: 0;
  padding: 0;

  object-fit: contain;
  object-position: center;

  &:hover {
    border-color: $border-hover;
  }

  // Quasar q-img için ek kontroller
  :deep(img) {
    width: 100% !important;
    height: 100% !important;
    object-position: center !important;
    max-width: 100% !important;
    max-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: $background-card;
}

// Mobile responsive - küçük ekranlarda captcha boyutları
@media (max-width: 480px) {
  .captcha-image {
    height: 36px;
    min-width: 100px;
    max-width: 140px;

    :deep(img) {
      height: 36px !important;
    }
  }

  .captcha-refresh-btn {
    padding: 2px;

    i {
      font-size: 12px;
    }
  }
}

// Tablet responsive - orta boyut ekranlar
@media (max-width: 768px) and (min-width: 481px) {
  .captcha-image {
    height: 38px;
    min-width: 110px;
    max-width: 160px;

    :deep(img) {
      height: 38px !important;
    }
  }
}
</style>
