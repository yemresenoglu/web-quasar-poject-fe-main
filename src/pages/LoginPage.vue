<template>
  <q-page class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <img :src="logoUrl" alt="Logo" class="login-logo-img" />
        </div>
      </div>
      <div class="login-page__section">
        <div class="login-page__section-header">
          <i class="bi bi-person-circle login-page__section-icon" style="font-size: 16px"></i>
          <div class="login-page__section-title">{{ t('login.title') }}</div>
        </div>
        <q-form @submit.prevent="handleLogin" class="login-page__form">
          <div class="login-page__form-grid">
            <div class="login-page__field login-page__field--full">
              <label class="login-page__field-label">{{ t('login.userCode') }}</label>
              <q-input
                v-model="loginForm.userCode"
                outlined
                dense
                class="login-page__input"
                :disable="loading"
                @keyup.enter="handleLogin"
              >
                <template #prepend>
                  <i class="bi bi-person"></i>
                </template>
              </q-input>
            </div>
            <div class="login-page__field login-page__field--full">
              <label class="login-page__field-label">{{ t('login.password') }}</label>
              <q-input
                v-model="loginForm.password"
                outlined
                dense
                :type="showPassword ? 'text' : 'password'"
                class="login-page__input"
                :disable="loading"
                @keyup.enter="handleLogin"
              >
                <template #prepend>
                  <i class="bi bi-lock"></i>
                </template>
                <template #append>
                  <i
                    :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  ></i>
                </template>
              </q-input>
            </div>
            <div class="login-page__field login-page__field--full">
              <label class="login-page__field-label">{{ $t('login.captcha') }}</label>
              <div class="captcha-field-wrapper">
                <CaptchaImage ref="captchaRef" class="captcha-image-section" />
                <q-input
                  v-model="loginForm.captcha"
                  outlined
                  dense
                  class="login-page__input captcha-input"
                  :disable="loading"
                  @keyup.enter="handleLogin"
                />
              </div>
            </div>
            <div class="login-page__field login-page__field--full">
              <q-btn
                flat
                dense
                no-caps
                :label="$t('login.forgotPassword')"
                @click="showForgotPasswordDialog = true"
                class="login-page__forgot-password-btn"
                :disable="loading"
              />
            </div>
          </div>
          <div class="search-form-actions">
            <q-btn
              color="primary"
              :label="$t('login.loginButton')"
              type="submit"
              :disable="!isFormValid"
              :loading="loading"
              class="search-btn login-page__login-btn"
            >
              <i class="bi bi-box-arrow-in-right"></i>
            </q-btn>
          </div>
        </q-form>
      </div>
      <div class="login-footer">
        <p class="footer-text">{{ $t('login.footer') }}</p>
        <div class="footer-links">
          <q-btn flat dense no-caps color="grey-7" :label="$t('login.help')" size="sm" />
          <q-separator vertical class="q-mx-sm" />
          <q-btn flat dense no-caps color="grey-7" :label="$t('login.contact')" size="sm" />
        </div>
      </div>
    </div>
    <ForgotPasswordDialog v-model="showForgotPasswordDialog" />
  </q-page>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { handleAsyncError } from 'src/utils/error-handler.js'
import { createLogger } from 'src/utils/logger.js'
import { baseApi } from 'src/api/baseApi.js'
import CaptchaImage from 'src/components/CaptchaImage.vue'
import ForgotPasswordDialog from 'src/components/ForgotPasswordDialog.vue'
import logoUrl from 'src/assets/logo.png'

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const logger = createLogger('LoginPage')
const loginForm = ref({ userCode: '', password: '', captcha: '' })
const showForgotPasswordDialog = ref(false)
const captchaRef = ref(null)
const showPassword = ref(false)
const isAuthenticated = ref(false)
const authLoading = ref(false)

const loading = computed(() => authLoading.value)
const isFormValid = computed(() => loginForm.value.userCode && loginForm.value.password)

const authApi = {
  login: async data => baseApi.getClient().dispatch('login', data, {}),
  getUserSessionInfo: async data => baseApi.getClient().dispatch('getUserSessionInfo', data, {}),
}

const generateCaptcha = () => captchaRef.value?.refreshCaptcha()

const handleLogin = async () => {
  if (!isFormValid.value) return

  authLoading.value = true
  logger.info('Login attempt started', { userCode: loginForm.value.userCode })

  clearAllStorage()

  await handleAsyncError(
    async () => {
      const loginResponse = await authApi.login({
        userid: loginForm.value.userCode,
        password: loginForm.value.password,
        captcha: loginForm.value.captcha,
      })

      if (!loginResponse.data.data.success) throw new Error(t('login.errorMessage'))

      const getUserSessionInfoResponse = await authApi.getUserSessionInfo({})

      localStorage.setItem('userSessionInfo', JSON.stringify(getUserSessionInfoResponse.data.data))

      isAuthenticated.value = true

      $q.notify({
        type: 'positive',
        message: t('login.successMessage'),
        icon: '✓',
        position: 'top-right',
      })
      router.push('/home')
    },
    { operation: 'login', userCode: loginForm.value.userCode }
  )
    .catch(err => {
      $q.notify({
        type: 'negative',
        message: err.message || t('login.errorMessage'),
        icon: '✕',
        position: 'top-right',
      })
      logger.error('Login failed', { error: err.message })
      generateCaptcha()
    })
    .finally(() => {
      authLoading.value = false
    })
}

const clearAllStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
}
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: $background-page;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-logo {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-logo-img {
  height: 56px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
}

.login-page__section {
  background: $background-card;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  .body--dark & {
    background: #1f2937;
    border-color: #374151;
  }

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
}

.login-page__section-header {
  padding: 16px 20px;
  border-bottom: 1px solid $border-lighter;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
}

.login-page__section-icon {
  color: $text-secondary;
  font-size: 16px;
}

.login-page__section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-secondary;
  text-transform: none;
}

.login-page__form {
  padding: 20px;
}

.login-page__form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.login-page__field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &--full {
    grid-column: 1 / -1;
  }
}

.login-page__field-label {
  font-size: 13px;
  font-weight: 500;
  color: $text-secondary;
  text-transform: none;
  opacity: 0.87;

  .body--dark & {
    color: #d1d5db;
  }
}

.login-page__input {
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
    font-size: 13px;
    color: $text-primary;
    padding: 8px 12px;
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

  :deep(.q-field--error) {
    .q-field__control:before {
      border: 2px solid #f56565 !important;
      border-radius: 4px !important;
    }
    .q-field__control {
      .q-field__prepend,
      .q-field__append,
      .q-field__native {
        .q-icon,
        i,
        [class*='bi-'] {
          display: none !important;
        }
      }

      &::after {
        content: '⚠' !important;
        position: absolute !important;
        right: 12px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        font-size: 16px !important;
        color: #f56565 !important;
        z-index: 10 !important;
        pointer-events: none !important;
        display: block !important;
      }
    }

    .q-field__append {
      .q-icon.material-icons,
      i.material-icons,
      .q-icon[class*='material-icons'] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        font-size: 0 !important;
      }
    }

    .q-field__append {
      .q-icon,
      i,
      [class*='material-icons'] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        font-size: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }

    .q-field__native {
      text-decoration: none !important;
      border-bottom: none !important;
      box-shadow: none !important;
    }

    .q-field__messages {
      color: #f56565 !important;

      .q-icon {
        display: none !important;
      }

      &::before {
        display: none !important;
      }
    }
  }
}

.captcha-field-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.captcha-image-section {
  flex: 3;
  min-width: 220px;
  max-width: none;
  flex-shrink: 0;
}

.captcha-input {
  flex: 1;
  min-width: 100px;
  max-width: 140px;
  flex-grow: 0;

  :deep(.q-field) {
    max-width: 140px;
  }

  :deep(.q-field__control) {
    max-width: 140px;
  }
}

.login-page__forgot-password-btn {
  font-size: 12px;
  padding: 0;
  color: $text-secondary;
  font-weight: 500;
  text-transform: none;
  min-height: 24px;
  opacity: 0.87;

  &:hover {
    color: $border-accent;
    opacity: 1;
  }
}

.search-form-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid $border-lighter;
}

.search-btn.login-page__login-btn {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  height: 26px !important;
  min-height: 26px !important;
  background: $background-button !important;
  padding: 2px 6px !important;
  border-radius: 2px !important;
  font-weight: 600 !important;
  font-size: 9px !important;
  color: $text-secondary !important;
  border-left: 2px solid $border-accent !important;
  letter-spacing: 0.3px !important;
  line-height: 1.1 !important;
  text-transform: uppercase !important;

  :deep(.q-icon) {
    font-size: 9px !important;
    margin-right: 4px !important;
    color: $text-secondary !important;
    opacity: 1 !important;
  }

  &.q-btn--loading {
    :deep(.q-icon) {
      font-size: 9px !important;
      color: $text-secondary !important;
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.footer-text {
  font-size: 11px;
  color: $text-secondary;
  margin: 0 0 12px 0;
  opacity: 0.87;
  text-transform: none;
  letter-spacing: 0.2px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;

  .q-btn {
    font-size: 13px;
    padding: 0 8px;
    color: $text-secondary;
    text-transform: none;

    &:hover {
      color: $border-accent;
    }
  }

  .q-separator {
    background: $border-lighter;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 12px;
  }

  .login-container {
    max-width: 100%;
  }

  .section-card.minimal-design {
    .section-header {
      padding: 12px 14px;
    }

    .section-content {
      padding: 14px;
    }
  }

  .login-logo-img {
    height: 48px;
  }

  .captcha-field-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .captcha-image-section {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }

  .captcha-input {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }

  .login-form {
    .form-group {
      margin-bottom: 14px;
    }
  }
}

.section-card {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.q-btn--loading {
  .q-btn__content {
    opacity: 0.7;
  }
}

.login-page {
  text-transform: none !important;

  * {
    text-transform: none !important;
  }

  .q-field__label,
  .q-item__label,
  .login-page__section-title,
  .login-page__field-label,
  .footer-text,
  .dialog-description {
    text-transform: none !important;
  }

  .search-btn,
  .login-page__login-btn {
    text-transform: uppercase !important;

    * {
      text-transform: uppercase !important;
    }
  }
}
</style>
