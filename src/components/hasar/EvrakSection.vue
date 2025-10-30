<template>
  <div class="evrak-section section-card">
    <div class="section-header">
      <h2 class="section-title">
        <i class="bi bi-paperclip" style="font-size: 16px;"></i>
        {{ t('hasarDosyaArabulucu.sections.evrak') }}
      </h2>
    </div>
    
    <div class="section-content">
      <!-- Evrak Ekleme Formu -->
      <div class="evrak-section__form">
        <div class="evrak-section__form-row">
          <label class="evrak-section__label">{{ t('hasarDosyaArabulucu.evrak.selectType') }}</label>
          <q-select
            v-model="newEvrak.type"
            :options="evrakOptions"
            :loading="evrakOptionsLoading"
            outlined
            dense
            class="evrak-section__input"
            clearable
          >
            <template v-slot:append>
              <i class="bi bi-chevron-down select-arrow"></i>
            </template>
          </q-select>
          <q-btn
            flat
            :label="t('hasarDosyaArabulucu.evrak.requestDocument')"
            @click="handleAdd"
            :disable="!newEvrak.type"
            icon="bi-floppy"
            class="evrak-section__btn"
          />
        </div>
      </div>

      <!-- Evrak Tablosu -->
      <div class="evrak-section__table">
        <q-table
          :rows="evrakList"
          :columns="evrakColumns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          flat
          bordered
        >
          <!-- Custom Header with Inner Template -->
          <template v-slot:header-cell="props">
            <q-th :props="props" :class="props.col.name === 'actions' ? 'text-center' : 'text-left'">
              <div v-if="props.col.name === 'actions'" class="evrak-section__actions-header">
                <span class="evrak-section__header-text">{{ props.col.label }}</span>
              </div>
              <div v-else class="evrak-section__header-content">
                <span class="evrak-section__header-text">{{ props.col.label }}</span>
                <i 
                  v-if="props.col.sortable" 
                  class="bi bi-arrow-down evrak-section__sort-icon"
                ></i>
              </div>
            </q-th>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-group flat dense>
                <q-btn 
                  flat 
                  round 
                  dense 
                  @click="handleView(props.row)"
                  v-if="props.row.evrakBelgeDurum === 'Alındı' || props.row.evrakBelgeDurum === 'Bekleniyor'"
                  class="action-btn action-btn--view"
                >
                  <i class="bi bi-eye"></i>
                  <q-tooltip>{{ t('common.view') }}</q-tooltip>
                </q-btn>
                <q-btn 
                  flat 
                  round 
                  dense 
                  @click="handleOpenInNewTab(props.row)"
                  class="action-btn action-btn--new-tab"
                >
                  <i class="bi bi-box-arrow-up-right"></i>
                  <q-tooltip>{{ t('common.openInNewTab') }}</q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// import { API_CONFIG } from 'src/api/index.js'
// import baseApiClient from 'src/api/index.js'
import { baseApi } from 'src/api/baseApi.js'
// Mock data import removed

const { t } = useI18n()

// Sorting state
// const sortBy = ref(null)
// const sortOrder = ref('asc')

// Sort icon functionality removed - using static icon

// Props
const props = defineProps({
  evrakList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  dosyaNo: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['add', 'view', 'openInNewTab'])

// New evrak form
const newEvrak = ref({
  type: ''
})

// Evrak options - Load from API
const evrakOptions = ref([])
const evrakOptionsLoading = ref(false)

// Load evrak options on component mount
onMounted(async () => {
  await loadEvrakOptions()
})

/**
 * Load evrak options from API
 */
const loadEvrakOptions = async () => {
  evrakOptionsLoading.value = true
  
  try {
    // Empty data - will be populated by real API calls
    evrakOptions.value = []
    // In production, use real API
    // const response = await hasarApi.getTalepEdilebilirEvrakListesi()
    // if (response.success) {
    //   evrakOptions.value = response.data.map(item => item.name)
    // }
  } catch (error) {
    console.error('Error loading evrak options:', error)
    
    // Kullanıcı dostu hata mesajı göster
    const userMessage = error.userMessage || 'Evrak seçenekleri yüklenirken bir hata oluştu'
    
    $q.notify({
      type: 'negative',
      message: userMessage,
      position: 'top',
      timeout: 3000,
      actions: [
        { label: 'Tamam', color: 'white' }
      ]
    })
    
    // Fallback to default options
    evrakOptions.value = [
      'Kaza Tespit Tutanağı',
      'Ruhsat Fotokopisi',
      'Ehliyet Fotokopisi',
      'Ekspertiz Raporu',
      'Tamir Faturası',
      'Fotoğraf',
      'Diğer'
    ]
  } finally {
    evrakOptionsLoading.value = false
  }
}


// Table columns
const evrakColumns = [
  {
    name: 'evrakAdi',
    label: t('hasarDosyaArabulucu.evrak.documentName'),
    field: 'evrakAdi',
    align: 'left',
    sortable: true
  },
  {
    name: 'evrakBelgeDurum',
    label: t('hasarDosyaArabulucu.evrak.status'),
    field: 'evrakBelgeDurum',
    align: 'left',
    sortable: true
  },
  {
    name: 'tarih',
    label: t('hasarDosyaArabulucu.evrak.date'),
    field: 'tarih',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: t('hasarDosyaArabulucu.evrak.actions'),
    field: 'actions',
    align: 'center'
  }
]

// Evrak API Functions - baseApi yapısıyla implement edildi
const evrakApi = {
  async getHasarDosyaEvrak(userOid, dosyaNo, options = {}) {
    return baseApi.getClient().dispatch('getHasarDosyaEvrak', { userOid, dosyaNo, ...options }, {})
  },
  
  async getEvrakList(dosyaNo) {
    return baseApi.getClient().dispatch('getEvrakList', { dosyaNo }, {})
  },
  
  async addEvrak(userOid, dosyaNo, evrakData) {
    const formData = new FormData()
    formData.append('userOid', userOid)
    formData.append('dosyaNo', dosyaNo)
    formData.append('evrakTuru', evrakData.evrakTuru)
    formData.append('evrakAdi', evrakData.evrakAdi)
    formData.append('dosya', evrakData.dosya)
    formData.append('aciklama', evrakData.aciklama || '')
    
    return baseApi.getClient().dispatch('addEvrak', formData, {})
  },
  
  async deleteEvrak(evrakId) {
    return baseApi.getClient().dispatch('deleteEvrak', { evrakId }, {})
  }
}

// Demo Data
const DEMO_EVRAK_DATA = [
  {
    id: 1,
    evrakAdi: 'Poliçe',
    evrakBelgeDurum: 'Bekleniyor',
    tarih: '2024-01-15',
    aciklama: 'Poliçe belgesi'
  },
  {
    id: 2,
    evrakAdi: 'Rapor',
    evrakBelgeDurum: 'Tamamlandı',
    tarih: '2024-01-14',
    aciklama: 'Hasar raporu'
  },
  {
    id: 3,
    evrakAdi: 'Fotoğraf',
    evrakBelgeDurum: 'İnceleniyor',
    tarih: '2024-01-13',
    aciklama: 'Hasar fotoğrafları'
  }
]

const addEvrakWithDemo = async (evrakData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvrak = {
        id: Date.now(),
        ...evrakData,
        tarih: new Date().toISOString().split('T')[0]
      }
      resolve({ success: true, data: newEvrak })
    }, 500)
  })
}

const addEvrakWithApi = async (evrakData) => {
  const dosyaNo = props.dosyaNo
  return await evrakApi.addEvrak('', dosyaNo, evrakData)
}

/**
 * Handle add evrak
 */
const handleAdd = async () => {
  if (!newEvrak.value.type) return
  
  try {
    const evrakData = {
      evrakAdi: newEvrak.value.type,
      evrakBelgeDurum: 'Bekleniyor'
    }
    
    // Demo/API geçiş yapısı
    const result = await addEvrakWithDemo(evrakData)
    // const result = await addEvrakWithApi(evrakData)
    
    if (result.success) {
      emit('add', evrakData)
      // Reset form
      newEvrak.value = { type: '' }
    } else {
      console.error('Add evrak failed:', result.error)
    }
  } catch (error) {
    console.error('Add evrak error:', error)
    
    // Kullanıcı dostu hata mesajı göster
    const userMessage = error.userMessage || 'Evrak eklenirken bir hata oluştu'
    
    $q.notify({
      type: 'negative',
      message: userMessage,
      position: 'top',
      timeout: 3000,
      actions: [
        { label: 'Tamam', color: 'white' }
      ]
    })
  }
}

/**
 * Handle view document
 * @param {Object} doc - Document to view
 */
const handleView = (doc) => {
  emit('view', doc)
}

/**
 * Handle open in new tab
 * @param {Object} doc - Document to open in new tab
 */
const handleOpenInNewTab = (doc) => {
  emit('openInNewTab', doc)
}
</script>

<style lang="scss" scoped>

.evrak-section {
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

  .section-header {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .q-icon {
        color: #6b7280;
      }
    }
  }

  .section-content {
    padding: 16px;
  }
}

.evrak-section__form {
  margin-bottom: 20px;
  max-width: 800px;
}

.evrak-section__form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.evrak-section__label {
  font-size: 10px;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
  min-width: 80px;
}

.evrak-section__input {
  flex: 1;
  max-width: 400px;
  
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
    
    &[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
      
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
        -webkit-appearance: none;
        margin: 0;
      }
    }
    
    // Placeholder styling removed
  }
  
  :deep(.q-select__dropdown-icon) {
    display: none !important;
  }
  
  :deep(.q-field__append) {
    display: flex !important;
    padding-right: 8px !important;
    height: 26px !important;
    align-items: center !important;
  }
  
  .select-arrow {
    font-size: 10px !important;
          color: #6b7280 !important;
    opacity: 0.8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }
  
  :deep(.q-field--focused) {
    .select-arrow {
      transform: rotate(180deg);
      color: #3b82f6 !important;
      opacity: 1;
    }
  }
  
  &:hover {
    .select-arrow {
      color: #1a202c !important;
      opacity: 1;
    }
  }
  
  :deep(.q-menu) {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    margin-top: 4px;
  }
  
  :deep(.q-item) {
    min-height: 32px !important;
    padding: 6px 12px !important;
    font-size: 12px !important;
    color: #1a202c !important;
    transition: all 0.15s ease;
    
    &:hover {
      background: #f1f5f9 !important;
    }
    
    &.q-manual-focusable--focused {
      background: #f1f5f9 !important;
    }
    
    // Seçili item
    &[aria-selected="true"] {
      background: rgba(59, 130, 246, 0.1) !important;
      color: #3b82f6 !important;
      font-weight: 600;
      
      &:before {
        content: '✓';
        margin-right: 8px;
        font-size: 11px;
      }
    }
  }
  
  // ─────────────────────────────────────────────
  // Q-FIELD SUFFIX (TL yazısı için - select'te yok)
  // ─────────────────────────────────────────────
  :deep(.q-field__suffix) {
    font-size: 11px !important;
          color: #6b7280 !important;
    padding: 0 8px 0 6px !important;
    font-weight: 500;
    opacity: 0.8;
    line-height: 14px !important;
    height: 26px !important;
    display: flex !important;
    align-items: center !important;
  }
}

.evrak-section__btn {
  min-width: 150px !important;
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background: #f8fafc !important;
  padding: 2px 16px !important;
  border-radius: 2px !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  color: #4a5568 !important;
  border-left: 2px solid #3b82f6 !important;
  letter-spacing: 0.3px !important;
  text-transform: uppercase !important;
  white-space: nowrap;
  
  :deep(.q-btn__wrapper) {
    padding: 0 !important;
    min-height: 26px !important;
    height: 26px !important;
  }
  
  :deep(.q-btn__content) {
    color: #4a5568 !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    line-height: 14px !important;
  }
  
  :deep(.q-icon) {
    font-size: 11px !important;
    margin-right: 6px !important;
    color: #4a5568 !important;
  }
  
  &:hover {
    background: #f1f5f9 !important;
  }
  
  &:before {
    box-shadow: none !important;
  }
}

.evrak-section__table {
  :deep(.q-table) {
    font-size: 11px;
    
    thead tr {
      background: #ffffff;
      
      th {
        font-size: 10px;
        font-weight: 600;
        color: #4a5568;
        padding: 6px 8px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
    }
    
    tbody tr {
      td {
        padding: 6px 8px;
        color: #1a202c;
      }
    }
  }
  
  :deep(.q-table__sort-icon) {
    display: none !important;
  }
  
  // Custom header content styling
  .evrak-section__header-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    width: 100%;
  }
  
  .evrak-section__actions-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .evrak-section__header-text {
    font-size: 10px;
    font-weight: 600;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    line-height: 1.2;
  }
  
  .evrak-section__sort-icon {
    font-size: 9px;
    color: #6b7280;
    opacity: 0.6;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &.bi-arrow-down {
      color: #3b82f6;
      opacity: 1;
    }
  }
  
  // Sortable column hover
  :deep(th[aria-sort]) {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      .evrak-section__sort-icon {
        opacity: 1;
        color: #1a202c;
      }
    }
  }
  
  // Pagination dropdown icon override
  :deep(.q-table__bottom) {
    .q-select {
      .q-field__append {
        .q-select__dropdown-icon {
          display: none !important;
        }
        
        &::after {
          content: '\f282'; // Bootstrap Icons arrow-down unicode
          font-family: 'bootstrap-icons' !important;
          font-size: 12px !important;
          color: #6b7280 !important;
          opacity: 0.8;
          transition: all 0.3s ease;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      
      &:hover .q-field__append::after {
        color: #1a202c !important;
        opacity: 1;
      }
      
      &.q-field--focused .q-field__append::after {
        color: #3b82f6 !important;
        opacity: 1;
        transform: translateY(-50%) rotate(180deg);
      }
    }
  }
}

// ════════════════════════════════════════════════
// ACTION BUTTONS (ResultsTableSection'dan taşındı)
// ════════════════════════════════════════════════
.action-btn {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;

  &--view {
        color: #3b82f6 !important;
    
    &:hover {
      background: rgba(59, 130, 246, 0.1) !important;
      color: #2563eb !important;
    }
  }

  &--new-tab {
    color: #10b981 !important;
    
    &:hover {
      color: #059669 !important;
      background: rgba(16, 185, 129, 0.1) !important;
    }
  }

  :deep(.q-icon) {
    font-size: 14px;
  }
}

// ════════════════════════════════════════════════
// Q-TABLE NO DATA ICON OVERRIDE
// ════════════════════════════════════════════════
.evrak-section__table {
  :deep(.q-table__bottom-nodata-icon) {
    display: none !important;
  }
  
  :deep(.q-table__bottom-nodata) {
    &::before {
      content: "\f0f6"; // FontAwesome document icon
      font-family: "Font Awesome 5 Free";
      font-weight: 900;
      font-size: 48px;
      color: #9ca3af;
      display: block;
      margin-bottom: 16px;
    }
  }
}

// ════════════════════════════════════════════════
// BEM: RESPONSIVE (Mobile)
// ════════════════════════════════════════════════
@media (max-width: 768px) {
  .evrak-section__form {
    max-width: 100%;
  }
  
  .evrak-section__form-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .evrak-section__label {
    min-width: auto;
  }
  
  .evrak-section__input {
    max-width: 100%;
  }
}
</style>

