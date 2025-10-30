<template>
  <div class="account-menu__section">
    <div class="account-profile">
      <div class="account-profile__avatar">
        <q-avatar v-if="avatar" size="64px" class="account-profile__avatar-image">
          <img :src="avatar" :alt="fullName" />
        </q-avatar>
        <i
          v-else
          class="bi bi-person-circle account-profile__avatar-icon"
          style="font-size: 64px"
        ></i>
      </div>
      <div class="account-profile__info">
        <div class="account-profile__fullname">{{ fullName ?? $t('account.defaultFullName') }}</div>

        <div class="account-profile__field">
          <span class="account-profile__label">{{ $t('account.userCode') }}:</span>
          <span class="account-profile__value">{{ userCode || '' }}</span>
        </div>

        <div class="account-profile__field">
          <span class="account-profile__label">{{ $t('account.duty') }}:</span>
          <span class="account-profile__value">{{ duty || '' }}</span>
        </div>

        <div class="account-profile__field">
          <span class="account-profile__label">{{ $t('account.email') }}:</span>
          <span class="account-profile__value">{{ email || eposta || '' }}</span>
        </div>

        <div class="account-profile__field">
          <span class="account-profile__label">{{ $t('account.position') }}:</span>
          <span class="account-profile__value">{{ tittle || '' }}</span>
        </div>

        <div class="account-profile__status">
          <div class="account-profile__last-login">
            <span class="account-profile__status-label">{{ $t('account.lastLogin') }}:</span>
            <span class="account-profile__status-value">{{ lastLoginTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const userid = ref('')
const userCode = ref('')
const firstName = ref('')
const lastName = ref('')
const fullName = ref('')
const email = ref('')
const duty = ref('')
const lastLoginTime = ref(null)
const avatar = ref(null)
const tittle = ref('')

onMounted(async () => {
  try {
    const userSessionInfo = JSON.parse(localStorage.getItem('userSessionInfo'))
    userid.value = userSessionInfo.USERID
    firstName.value = userSessionInfo.name
    lastName.value = userSessionInfo.surname
    fullName.value = userSessionInfo.USER_NAME
    email.value = userSessionInfo.user_email
    userCode.value = userSessionInfo.kullaniciKodu.toUpperCase()
    duty.value = userSessionInfo.group
    tittle.value = userSessionInfo.title
    lastLoginTime.value = userSessionInfo.sonGirisZamani
  } catch (error) {
    console.error('Kullanıcı session bilgileri alınamadı:', error)
  }
})
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.account-menu__section {
  padding: 8px 0;
}

// Account Profile Styles
.account-profile {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;

  &__avatar {
    flex-shrink: 0;
  }

  &__avatar-image {
    border: 2px solid $border-light !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  &__avatar-icon {
    color: $text-secondary !important;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__fullname {
    font-weight: 600;
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 8px;
  }

  &__field {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    gap: 8px;
  }

  &__label {
    font-size: 12px;
    color: $text-secondary;
    font-weight: 500;
    min-width: 80px;
    flex-shrink: 0;
    text-align: right;
  }

  &__value {
    font-size: 12px;
    color: $text-secondary;
    font-weight: 500;
    flex: 1;
    word-break: break-word;
  }

  &__status {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid $border-lighter;
  }

  &__last-login {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__status-label {
    font-size: 9px;
    color: $text-secondary;
    font-weight: 500;
    letter-spacing: 0.3px;
    margin-bottom: 2px;
    display: block;
  }

  &__status-value {
    padding: 4px 6px;
    background: $background-card;
    border: 1px solid $border-light;
    border-radius: 3px;
    font-size: 11px;
    color: $text-secondary;
    font-weight: 500;
    font-family: var(--font-monospace);
    height: 26px;
    min-height: 26px;
    display: flex;
    align-items: center;
    line-height: 1.1;
    transition: all 0.2s ease;

    // Dark mode theme transition
    .body--dark & {
      color: #d1d5db;
    }

    &:hover {
      border-color: $border-hover;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
