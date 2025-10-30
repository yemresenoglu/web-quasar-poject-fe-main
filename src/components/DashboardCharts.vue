<template>
  <div class="row q-col-gutter-md">
    <!-- İlk Satır -->
    <div class="col-12 col-md-6">
      <q-card class="dashboard-charts__card">
        <q-card-section>
          <div class="text-h6">{{ t('dashboard.charts.workStatusDistribution') }}</div>
          <div class="dashboard-charts__container">
            <Pie :data="workStatusData" :options="pieChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6">
      <q-card class="dashboard-charts__card">
        <q-card-section>
          <div class="text-h6">{{ t('dashboard.charts.weeklyWorkTrend') }}</div>
          <div class="dashboard-charts__container">
            <Line :data="weeklyTrendData" :options="lineChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- İkinci Satır -->
    <div class="col-12">
      <q-card class="dashboard-charts__card dashboard-charts__card--horizontal">
        <q-card-section>
          <div class="text-h6">{{ t('dashboard.charts.processBasedWorkload') }}</div>
          <div class="dashboard-charts__container dashboard-charts__container--horizontal">
            <Bar :data="workloadByProcessData" :options="horizontalBarOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { Line, Pie, Bar } from 'vue-chartjs'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { API_CONFIG } from 'src/api/index.js'
// import baseApiClient from 'src/api/index.js'
import { baseApi } from 'src/api/baseApi.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js'

const { t } = useI18n()

const DEMO_CHART_DATA = {
  // İş Durumu Dağılımı (Pie Chart)
  workStatus: {
    labels: ['Bekleyen', 'Üzerimdeki', 'Gönderdiğim'],
    datasets: [
      {
        data: [29, 20, 68],
        backgroundColor: [
          '#FF9800', // warning - Bekleyen
          '#2196F3', // info - Üzerimdeki
          '#4CAF50'  // positive - Gönderdiğim
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff'
      }
    ]
  },

  // Haftalık İş Trendi (Line Chart)
  weeklyTrend: {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [
      {
        label: 'Bekleyen',
        data: [12, 19, 15, 25, 22, 8, 5],
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF9800',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      },
      {
        label: 'Üzerimdeki',
        data: [8, 12, 18, 15, 20, 6, 4],
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      },
      {
        label: 'Gönderdiğim',
        data: [15, 22, 18, 28, 25, 12, 8],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }
    ]
  },

  // Süreç Bazlı İş Yükü - Arabuluculuk Süreçleri (Horizontal Bar Chart)
  workloadByProcess: {
    labels: [
      'Hasar Kayıt',
      'Hasar İnceleme',
      'Hasar Onay',
      'Hasar Ödeme',
      'Hasar Kapanış',
      'Arabuluculuk Görüşmesi',
      'Arabuluculuk Kararı',
      'Arabuluculuk İmzası',
      'Arabuluculuk Takibi'
    ],
    datasets: [
      {
        label: 'Bekleyen',
        data: [5, 7, 4, 6, 2, 3, 4, 2, 1],
        backgroundColor: '#FF9800',
        borderColor: '#FF9800',
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Üzerimdeki',
        data: [3, 4, 2, 3, 1, 2, 2, 1, 1],
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Gönderdiğim',
        data: [12, 8, 6, 9, 4, 5, 7, 3, 2],
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  }
}

const loadChartDataWithDemo = async (userOid, options = {}) => {
  return DEMO_CHART_DATA
}

// Dashboard API Functions - baseApi yapısıyla implement edildi
const dashboardApi = {
  async getDashboardData(userOid) {
    return baseApi.getClient().dispatch('getDashboardData', { userOid }, {})
  },
  
  async getChartData(userOid, options = {}) {
    return baseApi.getClient().dispatch('getChartData', { userOid, ...options }, {})
  },
  
  async getHasarStatistics(userOid, filters = {}) {
    return baseApi.getClient().dispatch('getHasarStatistics', { userOid, ...filters }, {})
  },
  
  async getAnnouncements(filters = {}) {
    return baseApi.getClient().dispatch('getAnnouncements', filters, {})
  }
}

const loadChartDataWithApi = async (userOid, options = {}) => {
  try {
    const result = await dashboardApi.getChartData(userOid, options)
    if (result.success && result.data) {
      return result.data
    }
    throw new Error('Failed to fetch chart data')
  } catch (error) {
    console.error('Chart data fetch error:', error)
    
    // Kullanıcı dostu hata mesajı göster
    const userMessage = error.userMessage || 'Grafik verileri yüklenirken bir hata oluştu'
    
    $q.notify({
      type: 'negative',
      message: userMessage,
      position: 'top',
      timeout: 3000,
      actions: [
        { label: 'Tamam', color: 'white' }
      ]
    })
    
    throw error
  }
}

const loadDashboardDataWithDemo = async (userOid) => {
  return DEMO_CHART_DATA
}

const loadDashboardDataWithApi = async (userOid) => {
  try {
    const result = await dashboardApi.getDashboardData(userOid)
    if (result.success && result.data) {
      return result.data.charts || {}
    }
    throw new Error('Failed to fetch dashboard data')
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    
    // Kullanıcı dostu hata mesajı göster
    const userMessage = error.userMessage || 'Dashboard verileri yüklenirken bir hata oluştu'
    
    $q.notify({
      type: 'negative',
      message: userMessage,
      position: 'top',
      timeout: 3000,
      actions: [
        { label: 'Tamam', color: 'white' }
      ]
    })
    
    throw error
  }
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  BarElement,
  Filler
)

// Dark mode aware colors
const isDark = computed(() => document.body.classList.contains('body--dark'))

const colors = computed(() => ({
  primary: '#2196F3',
  secondary: '#FF9800',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#00BCD4',
  background: isDark.value ? 'rgba(36, 39, 53, 0.95)' : 'rgba(255, 255, 255, 0.9)',
  text: isDark.value ? '#e2e8f0' : '#333',
  textSecondary: isDark.value ? '#94a3b8' : '#666',
  border: isDark.value ? 'rgba(255, 255, 255, 0.08)' : '#eee',
  grid: isDark.value ? 'rgba(255, 255, 255, 0.04)' : '#f0f0f0'
}))

const commonOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: true,
    mode: 'nearest'
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        },
        color: colors.value.textSecondary
      }
    },
    tooltip: {
      backgroundColor: colors.value.background,
      titleColor: colors.value.text,
      bodyColor: colors.value.textSecondary,
      borderColor: colors.value.border,
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      animation: {
        duration: 0
      },
      enabled: true,
      external: null
    }
  }
}))

// ===== CHART DATA STATE =====
const chartData = ref({})
const isLoading = ref(false)
const error = ref(null)

// ===== CHART DATA COMPUTED PROPERTIES =====
const workStatusData = computed(() => {
  return chartData.value.workStatus || DEMO_CHART_DATA.workStatus
})

const weeklyTrendData = computed(() => {
  return chartData.value.weeklyTrend || DEMO_CHART_DATA.weeklyTrend
})

const workloadByProcessData = computed(() => {
  return chartData.value.workloadByProcess || DEMO_CHART_DATA.workloadByProcess
})

const pieChartOptions = computed(() => ({
  ...commonOptions.value,
  cutout: '60%',
  plugins: {
    ...commonOptions.value.plugins,
    legend: {
      ...commonOptions.value.plugins.legend,
      position: 'bottom'
    }
  }
}))

const lineChartOptions = computed(() => ({
  ...commonOptions.value,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: colors.value.grid
      },
      ticks: {
        color: colors.value.textSecondary
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: colors.value.textSecondary
      }
    }
  }
}))

const horizontalBarOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1.2, // Yüksekliği artır
  layout: {
    padding: {
      left: 10,
      right: 30,
      top: 20,
      bottom: 20
    }
  },
  interaction: {
    mode: 'nearest',
    intersect: false,
    axis: 'y'
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        font: {
          size: 11,
          family: "var(--font-primary)",
          weight: '500'
        },
        color: colors.value.textSecondary,
        boxWidth: 8,
        boxHeight: 8
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: colors.value.background,
      titleColor: colors.value.text,
      bodyColor: colors.value.textSecondary,
      borderColor: colors.value.border,
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: {
        size: 13,
        weight: '600',
        family: "var(--font-primary)"
      },
      bodyFont: {
        size: 12,
        family: "var(--font-primary)"
      },
      displayColors: true,
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || ''
          const value = context.parsed.x || 0
          const processName = context.label || ''
          return `${processName} - ${label}: ${value} iş`
        }
      }
    }
  },
  scales: {
    x: {
      stacked: false,
      beginAtZero: true,
      max: 35,
      ticks: {
        stepSize: 5,
        font: {
          size: 11,
          family: "var(--font-primary)"
        },
        color: colors.value.textSecondary,
        padding: 8
      },
      grid: {
        display: true,
        color: colors.value.grid,
        lineWidth: 1,
        drawBorder: false,
        drawTicks: false
      },
      border: {
        display: false
      }
    },
    y: {
      stacked: false,
      ticks: {
        font: {
          size: 11.5,
          family: "var(--font-primary)",
          weight: '500'
        },
        color: colors.value.textSecondary,
        padding: 10,
        crossAlign: 'far',
        autoSkip: false
      },
      grid: {
        display: false,
        drawBorder: false
      },
      border: {
        display: false
      }
    }
  },
  barThickness: 16,
  categoryPercentage: 0.85,
  barPercentage: 0.75,
  borderRadius: 4,
  borderSkipped: false
}))

// ===== LIFECYCLE HOOKS =====
const loadDashboardData = async () => {
  // Demo/API geçiş yapısı
  return await loadDashboardDataWithDemo('DEMO_USER')
  // return await loadDashboardDataWithApi('DEMO_USER')
}

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await loadDashboardData()
    chartData.value = data
    console.log('Chart data loaded:', data)
  } catch (err) {
    console.error('Failed to load chart data:', err)
    error.value = err.message
    // Fallback to demo data
    chartData.value = DEMO_CHART_DATA
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="sass" scoped>
.dashboard-charts
  &__card
    border-radius: 12px
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
    transition: all 0.3s ease
    
    &:hover
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
      transform: translateY(-2px)
    
    &--horizontal
      background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)
      border: 1px solid rgba(0, 0, 0, 0.06)
      
      .text-h6
        font-size: 15px
        font-weight: 600
        color: #202124
        letter-spacing: -0.2px
      
  &__container
    height: 300px
    position: relative
    margin-top: 16px
    
    &--horizontal
      height: 500px // 9 süreç için daha yüksek

// Mobile responsive
@media (max-width: 768px)
  .dashboard-charts
    &__container
      height: 250px
      
      &--horizontal
        height: 450px // Mobilde de daha yüksek
</style>