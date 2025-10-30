<template>
  <div class="account-menu__section">
    <div class="account-menu__section-header">
      <div class="account-menu__section-title">{{ $t('account.duty') }}</div>
    </div>
    <div class="account-menu__list">
      <q-item
        v-for="duty in dutyItems"
        :key="duty.id"
        clickable
        v-ripple
        class="account-menu__item"
        @click="handleSelectDuty(duty.id)"
        role="radio"
        :aria-checked="duty.selected"
        :aria-label="`${duty.name} görevi seç`"
        tabindex="0"
      >
        <q-item-section avatar class="q-pr-none">
          <i class="bi bi-briefcase" style="font-size: 16px">
            <q-tooltip>{{ duty.name }}</q-tooltip>
          </i>
        </q-item-section>

        <q-item-section>
          <div class="account-menu__item-title">{{ duty.name }}</div>
        </q-item-section>

        <q-item-section side>
          <i
            :class="[
              duty.selected ? 'bi bi-check-circle' : 'bi bi-circle',
              'account-menu__check-icon',
              { 'account-menu__check-icon--selected': duty.selected },
            ]"
            style="font-size: 16px"
          >
            <q-tooltip>
              {{ duty.selected ? $t('account.dutySelected') : $t('account.selectDuty') }}
            </q-tooltip>
          </i>
        </q-item-section>
      </q-item>
      <div v-if="dutyItems.length === 0" class="account-menu__empty-state">
        {{ $t('account.noDuties') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { baseApi } from 'src/api/baseApi.js'
import { ref, onMounted } from 'vue'

const { t: $t } = useI18n()

const userid = ref('')
const defaultDutyId = ref('')
const dutyItems = ref([])

const dutyApi = {
  listUserDuties: async (data) => baseApi.getClient().dispatch('listKullaniciGorevler', data, {}),
}

const emit = defineEmits(['select-duty'])

const handleSelectDuty = (dutyId) => {
  dutyItems.value = dutyItems.value.map((item) => ({
    ...item,
    selected: item.id === dutyId,
  }))
  emit('select-duty', dutyId)
}

onMounted(async () => {
  try {
    userid.value = JSON.parse(localStorage.getItem('userSessionInfo')).USERID
    defaultDutyId.value = JSON.parse(localStorage.getItem('userSessionInfo')).dutyid

    const response = await dutyApi.listUserDuties({ kullaniciOid: userid.value })
    if (response.data.data) {
      localStorage.setItem('dutyInfo', response.data.data)

      response.data.data.forEach((item) => {
        if (item.value === defaultDutyId.value) {
          dutyItems.value.push({
            id: item.value,
            name: item.text,
            selected: true,
          })
        } else {
          dutyItems.value.push({
            id: item.value,
            name: item.text,
            selected: false,
          })
        }
      })
    }
  } catch (error) {
    console.error('Görev listesi alınamadı:', error)
  }
})
</script>
<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.account-menu__section {
  padding: 8px 0;
}

.account-menu__section-header {
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}

.account-menu__section-title {
  color: $text-secondary;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  padding: 0;
}

.account-menu__list {
  .account-menu__item {
    min-height: 32px;
    padding: 4px 8px;
    display: flex;
    justify-content: center;
    width: 100%;
    color: $text-secondary;
    font-size: 13px;
    border-radius: 2px;
    transition: all 0.2s ease;

    // Dark mode theme transition
    .body--dark & {
      color: #d1d5db;
    }

    :deep(.q-item__section--avatar) {
      min-width: unset;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 2px;
      transition: all 0.2s ease;

      .q-icon {
        width: 24px;
        height: 24px;
        border-radius: 2px;
        font-size: 14px;
        color: $text-secondary;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    :deep(.q-item__section--side) {
      min-width: 40px;
      padding-left: 16px;

      &:last-child {
        padding-left: 8px;
      }

      .q-icon {
        color: $text-secondary;
        opacity: 0.87;
        font-size: 14px;
      }
    }

    &:hover {
      background: $background-light;
      border-left: 2px solid $border-accent;

      :deep(.q-item__section--side .q-icon) {
        opacity: 1;
      }
    }
  }
}

.account-menu__item-title {
  font-weight: 500;
  color: $text-secondary !important;
  font-size: 13px;
}

.account-menu__empty-state {
  padding: 16px;
  text-align: center;
  color: $text-muted;
  font-size: 12px;
  font-style: italic;
}

// Check Icon Styles - Soldaki iconlarla aynı tasarım (#64748b)
.account-menu__check-icon {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  font-size: 14px;
  color: $text-secondary;
  opacity: 0.87;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    opacity 0.2s ease,
    color 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &--selected {
    color: $text-secondary;
    opacity: 1;
  }
}
</style>
