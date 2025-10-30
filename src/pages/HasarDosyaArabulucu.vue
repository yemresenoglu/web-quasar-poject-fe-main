<template>
  <q-page class="hasar-dosya-arabulucu">
    <div class="page-container">
      <PageHeader :title="pageTitle" icon="file-text" :show-actions="!!dosyaNo" />

      <!-- TODO: Backend aktif olduğunda aktif olacak - Dosya No Yoksa Uyarı Mesajı -->
      <!-- <div v-if="!dosyaNo" class="empty-state">
        <q-icon name="info" size="48px" color="primary" />
        <h3>{{ t('hasarDosyaArabulucu.messages.noFileNumber') }}</h3>
        <p>{{ t('hasarDosyaArabulucu.messages.noFileNumberDescription') }}</p>
      </div> -->

      <!-- TODO: Backend aktif olduğunda aktif olacak - Dosya No Varsa İçerik -->
      <!-- <div v-else class="content-flow"> -->
      
      <!-- Backend aktif olmadığı için tüm elemanları göster -->
      <div class="content-flow">
        <!-- Dosya Özet Bilgileri -->
        <DosyaOzetSection :file-data="fileData" />

        <!-- İhbar Veren Kişi Bilgileri -->
        <IhbarVerenSection :ihbar-data="fileData.ihbarVeren" />

        <!-- Değer Kaybı Arabuluculuk Bilgileri -->
        <DegerKaybiArabuluculukSection
          v-model:arabuluculuk="fileData.degerKaybi"
          :loading="loadingStates.degerKaybi"
          @save="saveDegerKaybi"
        />

        <!-- Evrak Bilgileri -->
        <EvrakSection
          v-model:evrak-list="evrakList"
          :loading="loadingStates.evrak"
          @add="addEvrak"
          @view="viewDocument"
          @openInNewTab="openEvrakInNewTab"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { createLogger } from 'src/utils/logger'
// Mock data import removed

const logger = createLogger('HasarDosyaArabulucu')

// Components
import PageHeader from 'src/components/PageHeader.vue'
import DosyaOzetSection from 'src/components/hasar/DosyaOzetSection.vue'
import IhbarVerenSection from 'src/components/hasar/IhbarVerenSection.vue'
import DegerKaybiArabuluculukSection from 'src/components/hasar/DegerKaybiArabuluculukSection.vue'
import EvrakSection from 'src/components/hasar/EvrakSection.vue'

// Composables
const route = useRoute()
const $q = useQuasar()
const { t } = useI18n()

// Computed properties
const dosyaNo = computed(() => route.params.dosyaNo)
const magdurNo = computed(() => fileData.value.magdurNo || '1')
const pageTitle = computed(() => {
  if (dosyaNo.value) {
    return `${dosyaNo.value}/${magdurNo.value} - SOMPO Sigorta`
  }
  return t('hasarDosyaArabulucu.title')
})

// Loading states
const loadingStates = reactive({
  degerKaybi: false,
  evrak: false,
})

// File data - Initialize with empty data
const fileData = ref({})
const evrakList = ref([])

// Load data on component mount
onMounted(() => {
  loadFileData()
})

/**
 * Load file data - null control implementation
 */
const loadFileData = () => {
  try {
    // TODO: Backend aktif olduğunda aktif olacak - Check if dosyaNo exists
    // if (!dosyaNo.value) {
    //   logger.warn('Dosya No bulunamadı - boş veri gösterilecek')
    //   fileData.value = {}
    //   evrakList.value = []
    //   return
    // }

    // Empty data - will be populated by real API calls when backend is ready
    fileData.value = {
      dosyaNo: dosyaNo.value || '',
      magdurNo: '',
      policeNo: '',
      sigortaliAdSoyad: '',
      sigortaliKusurOrani: '',
      sigortaliPlaka: '',
      magdurAdSoyad: '',
      magdurAracPlaka: '',
      hasarNedeni: '',
      altHasarNedeni: '',
      hasarTarihi: '',
      ihbarTarihi: '',
      altBrans: '',
      ihbarVeren: {
        yakinlikDerecesi: '',
        adSoyad: '',
        gsm: '',
        eposta: ''
      },
      degerKaybi: {
        teklifEdilenTutar: 0,
        vekaletTutari: 0,
        toplamTutar: 0,
        anlasmaYapilacakIslem: '',
        anlasmaDurum: '',
        talepEdilenRevizeTutar: 0,
        onaylananRevizeTutar: 0,
        anlasmaSaglananTutar: 0,
        anlasmaSaglananVekaletTutari: 0,
        anlasmaSaglananToplamTutar: 0
      }
    }
    evrakList.value = []
    
    logger.info(`File data initialized for dosyaNo: ${dosyaNo.value}`)
  } catch (error) {
    logger.error('Error initializing file data:', error)
    // Empty data
    fileData.value = {
      dosyaNo: dosyaNo.value || '',
      magdurNo: '',
      policeNo: '',
      sigortaliAdSoyad: '',
      sigortaliKusurOrani: '',
      sigortaliPlaka: '',
      magdurAdSoyad: '',
      magdurAracPlaka: '',
      hasarNedeni: '',
      altHasarNedeni: '',
      hasarTarihi: '',
      ihbarTarihi: '',
      altBrans: '',
      ihbarVeren: {
        ihbarYapanAdSoyad: '',
        gsm: '',
        eposta: '',
        yakinlikDerecesi: '',
      },
      degerKaybi: {
        teklifEdilenTutar: 0,
        vekaletTutari: 0,
        anlasmaYapilacakIslem: '',
        anlasmaDurum: '',
        talepEdilenRevizeTutar: 0,
        onaylananRevizeTutar: 0,
        anlasmaSaglananTutar: 0,
        anlasmaSaglananVekaletTutari: 0,
        anlasmaSaglananToplamTutar: 0
      },
    }
    evrakList.value = []
  }
}

// Update document title and fileData when dosyaNo changes
watch(
  [dosyaNo, magdurNo],
  ([newDosyaNo, newMagdurNo]) => {
    if (newDosyaNo) {
      // Update fileData with new dosyaNo
      fileData.value.dosyaNo = newDosyaNo

      // Update document title
      document.title = `${newDosyaNo}/${newMagdurNo} - SOMPO Sigorta`
    } else {
      document.title = 'SOMPO Sigorta'
    }
  },
  { immediate: true },
)

/**
 * Save Değer Kaybı
 */
const saveDegerKaybi = async () => {
  loadingStates.degerKaybi = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: t('hasarDosyaArabulucu.messages.saveSuccess'),
      position: 'top',
    })
  } catch (error) {
    logger.error('Error saving file:', error)
    $q.notify({
      type: 'negative',
      message: t('hasarDosyaArabulucu.messages.saveError'),
      position: 'top',
    })
  } finally {
    loadingStates.degerKaybi = false
  }
}

/**
 * Add evrak
 * @param {Object} evrakData - Evrak data
 */
const addEvrak = (evrakData) => {
  const newEvrak = {
    id: Date.now(),
    ...evrakData,
    tarih: new Date().toLocaleDateString('tr-TR'),
  }

  evrakList.value.push(newEvrak)

  $q.notify({
    type: 'positive',
    message: t('hasarDosyaArabulucu.messages.evrakAdded'),
    position: 'top',
  })
}

/**
 * View document
 */
const viewDocument = () => {
  $q.notify({
    type: 'info',
    message: t('hasarDosyaArabulucu.messages.viewingDocument'),
    position: 'top',
  })
}

/**
 * Open evrak in new tab
 * @param {Object} doc - Document to open in new tab
 */
const openEvrakInNewTab = () => {
  // Bu örnekte evrak için ayrı bir sayfa yok, bu yüzden mevcut sayfayı yeni sekmede açıyoruz
  const url = `${window.location.origin}/hasar-dosya-arabulucu/${dosyaNo.value}`
  window.open(url, '_blank')
  
  $q.notify({
    type: 'positive',
    message: 'Evrak yeni sekmede açıldı',
    icon: 'bi-box-arrow-up-right',
    position: 'top'
  })
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.hasar-dosya-arabulucu {
  background: $background-page;
  min-height: 100vh;

  // Text transform kuralları artık global CSS'de tanımlı

  .page-container {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px;
  }

  .content-flow {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    text-align: center;
    background: #f8f9fa;
    border-radius: 12px;
    margin: 24px 0;

    h3 {
      margin: 16px 0 8px;
      color: #1976d2;
      font-size: 24px;
      font-weight: 600;
    }

    p {
      color: #666;
      font-size: 16px;
      line-height: 1.5;
      max-width: 500px;
    }
  }
}
</style>
