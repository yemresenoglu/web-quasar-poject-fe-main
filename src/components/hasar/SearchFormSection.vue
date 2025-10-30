<template>
  <div class="section-card">
    <div class="section-content">
      <!-- Tab Structure -->
      <q-tabs
        v-model="activeTab"
        class="search-tabs"
        indicator-color="transparent"
        active-color="primary"
        align="left"
      >
        <q-tab
          name="damage-info"
          :label="t('damageQueryMediator.tabs.damageInfo')"
          class="search-tab"
        />
        <q-tab
          name="policy-info"
          :label="t('damageQueryMediator.tabs.policyInfo')"
          class="search-tab"
        />
      </q-tabs>

      <q-separator class="tab-separator" />

      <q-tab-panels v-model="activeTab" class="search-tab-panels">
        <!-- Hasar Dosya Bilgileri Tab -->
        <q-tab-panel name="damage-info" class="search-tab-panel">
          <div class="info-grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('damageQueryMediator.fields.damageFileNumber') }}</label>
              <q-input
                v-model="localForm.damageFileNumber"
                outlined
                dense
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('damageQueryMediator.fields.victimNumber') }}</label>
              <q-input
                v-model="localForm.victimNumber"
                outlined
                dense
                class="form-input"
              />
            </div>
          </div>
        </q-tab-panel>

        <!-- Poliçe Bilgileri Tab -->
        <q-tab-panel name="policy-info" class="search-tab-panel">
          <div class="info-grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('damageQueryMediator.fields.policyNumber') }}</label>
              <q-input
                v-model="localForm.policyNumber"
                outlined
                dense
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('damageQueryMediator.fields.insuredName') }}</label>
              <q-input
                v-model="localForm.insuredName"
                outlined
                dense
                class="form-input"
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <div class="search-form-actions">
        <q-btn
          @click="handleSearch"
          :loading="loading"
          icon="bi-search"
          class="search-btn"
          :label="t('damageQueryMediator.searchForm.searchButton')"
        />
        <q-btn
          @click="clearForm"
          icon="bi-x-lg"
          class="clear-btn"
          :label="t('damageQueryMediator.actions.clear')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  searchForm: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:searchForm', 'search', 'clear'])

// Local form state
const localForm = ref({ ...props.searchForm })

// Active tab state
const activeTab = ref('damage-info')

// Watch for prop changes
watch(() => props.searchForm, (newForm) => {
  localForm.value = { ...newForm }
}, { deep: true })

// Watch for local form changes
watch(localForm, (newForm) => {
  emit('update:searchForm', { ...newForm })
}, { deep: true })

// Methods
const handleSearch = () => {
  emit('search', { ...localForm.value })
}

const clearForm = () => {
  localForm.value = {
    damageFileNumber: '',
    victimNumber: '',
    policyNumber: '',
    insuredName: ''
  }
  emit('update:searchForm', { ...localForm.value })
  emit('clear')
}
</script>

<style lang="scss" scoped>
.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

// Global grid class kullanılıyor - utilities.scss'den

// Responsive grid global utilities.scss'de tanımlı

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-input .q-field__control {
  border-radius: 8px;
}

// Tab Styles
.search-tabs {
  margin-bottom: 0;
  
  .q-tab {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-transform: none;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    
    // Dark mode theme transition
    .body--dark & {
      color: #d1d5db;
    }
    
    &.q-tab--active {
      color: #64748b !important; // Aktif tab'da da aynı renk - zorla uygula
      border-bottom-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);
      
      .q-tab__label {
        color: #64748b !important; // Label'a da aynı rengi zorla uygula
      }
    }
    
    &:hover {
      color: #64748b; // Hover'da da aynı renk
      background: rgba(59, 130, 246, 0.05);
    }
  }
}

.tab-separator {
  margin: 0;
  background: #e2e8f0;
  height: 1px;
}

.search-tab-panels {
  background: transparent;
  
  .q-tab-panel {
    padding: 20px 0 0 0;
  }
}

// Search form actions (buttons) - AccountEditProfile.vue ile birebir aynı
.search-form-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

// 🔧 Search Button (BUL) - Light tema için mavi border
.search-btn {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  height: 26px !important;
  min-height: 26px !important;
  background: #f8fafc !important;
  padding: 2px 6px !important;
  border-radius: 2px !important;
  font-weight: 600 !important;
  font-size: 9px !important;
  color: #64748b !important;
  border-left: 2px solid #3b82f6 !important; // Light tema için mavi
  letter-spacing: 0.3px !important;
  line-height: 1.1 !important;
  text-transform: uppercase !important;
  
  // Icon styling
  :deep(.q-icon) {
    font-size: 9px !important;
    margin-right: 4px !important;
    color: #64748b !important;
    opacity: 1 !important;
  }
  
  // Loading state
  &.q-btn--loading {
    :deep(.q-icon) {
      font-size: 9px !important;
      color: #64748b !important;
    }
  }
}

// 🔧 Clear Button (TEMİZLE) - Light tema için mavi border
.clear-btn {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  height: 26px !important;
  min-height: 26px !important;
  background: #f8fafc !important;
  padding: 2px 6px !important;
  border-radius: 2px !important;
  font-weight: 600 !important;
  font-size: 9px !important;
  color: #64748b !important;
  border: none !important;
  border-top: none !important;
  border-right: none !important;
  border-bottom: none !important;
  border-left: 2px solid #3b82f6 !important; // Light tema için mavi
  letter-spacing: 0.3px !important;
  line-height: 1.1 !important;
  text-transform: uppercase !important;
  
  // Icon styling
  :deep(.q-icon) {
    font-size: 9px !important;
    margin-right: 4px !important;
    color: #64748b !important;
    opacity: 1 !important;
  }
  
  // Hover/Focus states
  &:hover, &:focus, &:active {
    border: none !important;
    border-top: none !important;
    border-right: none !important;
    border-bottom: none !important;
    border-left: 2px solid #3b82f6 !important; // Light tema için mavi
  }
}
</style>
