<template>
  <q-page class="hasar-sorgula-arabulucu">
    <div class="page-container">
      <!-- Page Header -->
      <PageHeader :title="pageTitle" icon="scales" :show-actions="false" />

      <!-- Search Form -->
      <SearchFormSection
        v-model:search-form="searchForm"
        :loading="isSearching"
        @search="handleSearch"
        @clear="handleClear"
      />

      <!-- Results Table -->
      <ResultsTableSection
        :rows="searchResults"
        :columns="resultColumns"
        :loading="isSearching"
        :pagination="{ rowsPerPage: 50 }"
        @view="viewDetails"
        @openInNewTab="openInNewTab"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
// import { API_CONFIG } from 'src/api/index.js'
// import baseApiClient from 'src/api/index.js'
import { baseApi } from 'src/api/baseApi.js'

// Components
import PageHeader from 'src/components/PageHeader.vue'
import SearchFormSection from 'src/components/hasar/SearchFormSection.vue'
import ResultsTableSection from 'src/components/hasar/ResultsTableSection.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

// Page title
const pageTitle = computed(() => t('damageQueryMediator.title'))

// Search form
const searchForm = ref({
  fileNumber: '',
  victimNumber: '',
})

// Search state
const isSearching = ref(false)

const DEMO_SEARCH_DATA = {
  searchResults: [
    {
      fileNumber: '2025311003010',
      victimNumber: '2',
      fileNumberWithMagdur: '2025311003010/2',
      policyNumber: 'POL001234567',
      sigortaliAd: 'Ahmet',
      sigortaliSoyad: 'Yılmaz',
      sigortaliPlaka: '34ABC123',
      sigortaliKusurOrani: '30%',
      magdurAd: 'Mehmet',
      magdurSoyad: 'Demir',
      magdurAracPlaka: '06XYZ789',
      ihbarTarihi: '2024-01-15',
      damageDate: '2024-01-14',
      damageLocation: 'İstanbul/Kadıköy',
      damageReason: 'Çarpışma',
      damageAmount: 15000,
      status: 'Açık'
    },
    {
      fileNumber: '2025311003011',
      victimNumber: '1',
      fileNumberWithMagdur: '2025311003011/1',
      policyNumber: 'POL001234568',
      sigortaliAd: 'Ayşe',
      sigortaliSoyad: 'Kaya',
      sigortaliPlaka: '35DEF456',
      sigortaliKusurOrani: '50%',
      magdurAd: 'Fatma',
      magdurSoyad: 'Şahin',
      magdurAracPlaka: '07GHI012',
      ihbarTarihi: '2024-01-16',
      damageDate: '2024-01-15',
      damageLocation: 'Ankara/Çankaya',
      damageReason: 'Kaza',
      damageAmount: 25000,
      status: 'İnceleme'
    },
    {
      fileNumber: '2025311003012',
      victimNumber: '3',
      fileNumberWithMagdur: '2025311003012/3',
      policyNumber: 'POL001234569',
      sigortaliAd: 'Ali',
      sigortaliSoyad: 'Özkan',
      sigortaliPlaka: '41JKL345',
      sigortaliKusurOrani: '0%',
      magdurAd: 'Zeynep',
      magdurSoyad: 'Arslan',
      magdurAracPlaka: '16MNO678',
      ihbarTarihi: '2024-01-17',
      damageDate: '2024-01-16',
      damageLocation: 'İzmir/Konak',
      damageReason: 'Çarpışma',
      damageAmount: 8500,
      status: 'Kapalı'
    }
  ]
}

const searchResults = ref(DEMO_SEARCH_DATA.searchResults)

// Table columns
const resultColumns = [
  {
    name: 'fileNumber',
    label: t('damageQueryMediator.results.columns.fileNumber'),
    field: 'fileNumberWithMagdur',
    align: 'left',
    sortable: true,
  },
  {
    name: 'policyNumber',
    label: t('damageQueryMediator.results.columns.policyNumber'),
    field: 'policyNumber',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sigortaliAd',
    label: 'Sigortalı Ad',
    field: 'sigortaliAd',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sigortaliSoyad',
    label: 'Sigortalı Soyad',
    field: 'sigortaliSoyad',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sigortaliPlaka',
    label: 'Sigortalı Plaka',
    field: 'sigortaliPlaka',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sigortaliKusurOrani',
    label: 'Sigortalı Kusur Oranı',
    field: 'sigortaliKusurOrani',
    align: 'left',
    sortable: true,
  },
  {
    name: 'magdurAd',
    label: 'Mağdur Ad',
    field: 'magdurAd',
    align: 'left',
    sortable: true,
  },
  {
    name: 'magdurSoyad',
    label: 'Mağdur Soyad',
    field: 'magdurSoyad',
    align: 'left',
    sortable: true,
  },
  {
    name: 'magdurAracPlaka',
    label: 'Mağdur Araç Plaka',
    field: 'magdurAracPlaka',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ihbarTarihi',
    label: 'İhbar Tarihi',
    field: 'ihbarTarihi',
    align: 'left',
    sortable: true,
  },
  {
    name: 'damageDate',
    label: t('damageQueryMediator.results.columns.damageDate'),
    field: 'damageDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: t('damageQueryMediator.results.columns.status'),
    field: 'status',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: t('damageQueryMediator.results.columns.actions'),
    field: 'actions',
    align: 'center',
  },
]

// Hasar API Functions - baseApi yapısıyla implement edildi
const hasarApi = {
  async searchHasarFiles(searchParams = {}) {
    return baseApi.getClient().dispatch('searchHasarFiles', searchParams, {})
  },
  
  async getHasarFileDetails(dosyaNo) {
    return baseApi.getClient().dispatch('getHasarFileDetails', { dosyaNo }, {})
  },
  
  async createHasarFile(fileData) {
    return baseApi.getClient().dispatch('createHasarFile', fileData, {})
  },
  
  async updateHasarFile(dosyaNo, updateData) {
    return baseApi.getClient().dispatch('updateHasarFile', { dosyaNo, ...updateData }, {})
  },
  
  async deleteHasarFile(dosyaNo) {
    return baseApi.getClient().dispatch('deleteHasarFile', { dosyaNo }, {})
  },
  
  async getHasarTurleri() {
    return baseApi.getClient().dispatch('getHasarTurleri', {}, {})
  },
  
  // Alias for searchHasarFiles
  async searchFiles(searchForm) {
    return this.searchHasarFiles(searchForm)
  }
}

// Demo Data
const DEMO_SEARCH_RESULTS = [
  {
    fileNumber: 'HAS-2024-001',
    victimNumber: 'MAG-001',
    fileNumberWithMagdur: 'HAS-2024-001/MAG-001',
    policyNumber: 'POL-001',
    sigortaliAd: 'ABC',
    sigortaliSoyad: 'Sigorta A.Ş.',
    sigortaliPlaka: '34ABC123',
    sigortaliKusurOrani: '70%',
    magdurAd: 'Ahmet',
    magdurSoyad: 'Yılmaz',
    magdurAracPlaka: '34XYZ456',
    ihbarTarihi: '2024-01-15',
    damageDate: '2024-01-14',
    damageLocation: 'İstanbul/Kadıköy',
    damageReason: 'Trafik Kazası',
    damageAmount: 50000,
    status: 'Açık'
  },
  {
    fileNumber: 'HAS-2024-002',
    victimNumber: 'MAG-002',
    fileNumberWithMagdur: 'HAS-2024-002/MAG-002',
    policyNumber: 'POL-002',
    sigortaliAd: 'XYZ',
    sigortaliSoyad: 'Sigorta Ltd.',
    sigortaliPlaka: '06DEF789',
    sigortaliKusurOrani: '50%',
    magdurAd: 'Fatma',
    magdurSoyad: 'Demir',
    magdurAracPlaka: '06GHI012',
    ihbarTarihi: '2024-01-20',
    damageDate: '2024-01-19',
    damageLocation: 'Ankara/Çankaya',
    damageReason: 'İş Kazası',
    damageAmount: 75000,
    status: 'İnceleniyor'
  }
]

const searchWithDemo = async (searchForm) => {
  isSearching.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    // Filter demo data based on search form
    let filteredResults = [...DEMO_SEARCH_RESULTS]
    
    if (searchForm.fileNumber) {
      filteredResults = filteredResults.filter(file => 
        file.fileNumber.toLowerCase().includes(searchForm.fileNumber.toLowerCase())
      )
    }
    
    if (searchForm.victimNumber) {
      filteredResults = filteredResults.filter(file => 
        file.victimNumber.toLowerCase().includes(searchForm.victimNumber.toLowerCase())
      )
    }
    
    searchResults.value = filteredResults
  } catch (error) {
    console.error('Demo search error:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const searchWithApi = async (searchForm) => {
  isSearching.value = true
  
  try {
    const response = await hasarApi.searchFiles(searchForm)
    
    if (response.success) {
      searchResults.value = response.data.files.map((file) => {
        const sigortaliAdSoyad = file.sigortaliAdSoyad || ''
        const sigortaliParts = sigortaliAdSoyad.split(' ')
        const sigortaliAd = sigortaliParts[0] || ''
        const sigortaliSoyad = sigortaliParts.slice(1).join(' ') || ''

        const magdurAdSoyad = file.magdurAdSoyad || ''
        const magdurParts = magdurAdSoyad.split(' ')
        const magdurAd = magdurParts[0] || ''
        const magdurSoyad = magdurParts.slice(1).join(' ') || ''

        return {
          fileNumber: file.dosyaNo,
          victimNumber: file.magdurNo,
          fileNumberWithMagdur: `${file.dosyaNo}/${file.magdurNo}`,
          policyNumber: file.policeNo,
          sigortaliAd: sigortaliAd,
          sigortaliSoyad: sigortaliSoyad,
          sigortaliPlaka: file.sigortaliPlaka,
          sigortaliKusurOrani: file.sigortaliKusurOrani || '-',
          magdurAd: magdurAd,
          magdurSoyad: magdurSoyad,
          magdurAracPlaka: file.magdurAracPlaka,
          ihbarTarihi: file.ihbarTarihi,
          damageDate: file.hasarTarihi,
          damageLocation: file.hasarYeri,
          damageReason: file.hasarSebebi,
          damageAmount: file.hasarTutari || 0,
          status: file.durum,
        }
      })
    } else {
      console.error('Search failed:', response.error)
      searchResults.value = []
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
    
    // Kullanıcı dostu hata mesajı göster
    const userMessage = error.userMessage || 'Arama yapılırken bir hata oluştu'
    
    $q.notify({
      type: 'negative',
      message: userMessage,
      position: 'top',
      timeout: 3000,
      actions: [
        { label: 'Tamam', color: 'white' }
      ]
    })
  } finally {
    isSearching.value = false
  }
}

const handleSearch = async (searchResult) => {
  // Demo/API geçiş yapısı
  return await searchWithDemo(searchResult)
  // return await searchWithApi(searchResult)
}

const handleClear = () => {
  searchForm.value = {
    fileNumber: '',
    victimNumber: '',
  }
  searchResults.value = []

  $q.notify({
    type: 'info',
    message: t('damageQueryMediator.messages.searchCleared'),
    icon: 'ℹ',
    position: 'top',
  })
}

const viewDetails = (row) => {
  router.push(`/home/menu/hasar-dosya-arabulucu/${row.fileNumber}`)
}

const openInNewTab = (row) => {
  const url = `${window.location.origin}/hasar-dosya-arabulucu/${row.fileNumber}`
  window.open(url, '_blank')

  $q.notify({
    type: 'positive',
    message: t('damageQueryMediator.messages.openedInNewTab'),
    icon: 'bi-box-arrow-up-right',
    position: 'top',
  })
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.hasar-sorgula-arabulucu {
  background: $background-page;
  min-height: 100vh;

  // Text transform kuralları artık global CSS'de tanımlı

  .page-container {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px;
  }
}
</style>
