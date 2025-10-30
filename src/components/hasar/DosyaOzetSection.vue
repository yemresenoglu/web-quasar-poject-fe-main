<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        <i class="bi bi-file-text" style="font-size: 16px;"></i>
        {{ t('hasarDosyaArabulucu.sections.dosyaOzet') }}
      </h2>
    </div>
    <div class="section-content">
      <div class="info-grid-2">
        <!-- Sol Sütun -->
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.dosyaNo') }}</label>
          <q-input 
            :model-value="displayDosyaNo"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.sigortaliAdSoyad') }}</label>
          <q-input 
            :model-value="fileData.sigortaliAdSoyad"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.sigortaliKusurOrani') }}</label>
          <q-input 
            :model-value="fileData.sigortaliKusurOrani"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.magdurAracPlaka') }}</label>
          <q-input 
            :model-value="fileData.magdurAracPlaka"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.hasarNedeni') }}</label>
          <q-input 
            :model-value="fileData.hasarNedeni"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.ihbarTarihi') }}</label>
          <q-input 
            :model-value="fileData.ihbarTarihi"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        
        <!-- Sağ Sütun -->
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.policeNo') }}</label>
          <q-input 
            :model-value="fileData.policeNo"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.sigortaliPlaka') }}</label>
          <q-input 
            :model-value="fileData.sigortaliPlaka"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.magdurAdSoyad') }}</label>
          <q-input 
            :model-value="fileData.magdurAdSoyad"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.altBrans') }}</label>
          <q-input 
            :model-value="fileData.altBrans"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.altHasarNedeni') }}</label>
          <q-input 
            :model-value="fileData.altHasarNedeni"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.hasarTarihi') }}</label>
          <q-input 
            :model-value="fileData.hasarTarihi"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  fileData: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Computed - Display dosyaNo with magdurNo
const displayDosyaNo = computed(() => {
  const dosyaNo = props.fileData.dosyaNo
  const magdurNo = props.fileData.magdurNo
  
  if (!dosyaNo) return ''
  if (!magdurNo) return dosyaNo
  
  return `${dosyaNo}/${magdurNo}`
})
</script>

<style lang="scss" scoped>

.section-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  
  // Dark mode theme transition
  .body--dark & {
    background: #1f2937;
    border-color: #374151;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.section-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  padding: 16px;
}

// .info-grid-2 utility class'i artık global utilities.scss'de tanımlı

.form-group {
  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
}

.search-input {
  :deep(.q-field__control) {
    min-height: 26px !important;
    height: 26px !important;
    font-size: 12px;
    background: #f8fafc !important;
    border: none !important;
    border-radius: 3px;
    transition: all 0.2s ease;

    &:before,
    &:after {
      border: none !important;
    }

    &:hover {
      background: #f1f5f9 !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:focus-within {
      background: white !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  }
  
  :deep(.q-field__native) {
    padding: 6px 10px !important;
    min-height: 26px !important;
    height: 26px !important;
    line-height: 14px !important;
    color: #1a202c !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    display: flex !important;
    align-items: center !important;
  }
  
  :deep(.q-field__append) {
    padding-right: 4px;
    height: 26px !important;
    display: flex !important;
    align-items: center !important;
  }
}

// Readonly input override
.readonly-input {
  :deep(.q-field--readonly) {
    opacity: 1 !important;
    
    .q-field__control {
      background: #f8fafc !important;
      opacity: 1 !important;
    }
    
    .q-field__native {
      color: #1a202c !important;
      opacity: 1 !important;
      cursor: default !important;
    }
  }
}
</style>

