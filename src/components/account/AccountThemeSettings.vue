<template>
  <div class="account-menu__section">
    <div class="account-menu__section-header">
      <div class="account-menu__section-title">{{ $t('themeSettings.title') }}</div>
    </div>
    
    <div class="theme-info">
      <div class="theme-info__text">
        Uygulama görünümünü kişiselleştirmek için bir tema seçin. Seçiminiz otomatik olarak kaydedilir.
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isThemeLoading" class="theme-loading">
      <q-spinner size="24px" color="primary" />
      <span class="theme-loading__text">Tüm elemanların tema geçişi tamamlanıyor...</span>
    </div>
    
    <div class="account-menu__list">
      <!-- Light Theme Card -->
      <div 
        class="theme-card"
        :class="{ 
          'theme-card--active': !darkMode && !sompoMode,
          'theme-card--disabled': isThemeLoading
        }"
        @click="!isThemeLoading && selectTheme('light')"
        role="button"
        tabindex="0"
        :aria-label="$t('themeSettings.lightTheme')"
        @keydown.enter="!isThemeLoading && selectTheme('light')"
        @keydown.space.prevent="!isThemeLoading && selectTheme('light')"
      >
               <div class="theme-card__preview">
                 <div class="theme-card__colors">
                   <div class="color-swatch color-swatch--primary" style="background: #ffffff;" title="Ana Arka Plan"></div>
                   <div class="color-swatch color-swatch--secondary" style="background: #f8fafc;" title="İkincil Arka Plan"></div>
                   <div class="color-swatch color-swatch--accent" style="background: #e2e8f0;" title="Vurgu Rengi"></div>
                   <div class="color-swatch color-swatch--border" style="background: #cbd5e1;" title="Kenarlık Rengi"></div>
                   <div class="color-swatch color-swatch--text" style="background: #1e293b;" title="Metin Rengi"></div>
                   <div class="color-swatch color-swatch--accent2" style="background: #3b82f6;" title="Primary Renk"></div>
                 </div>
          <div class="theme-card__icon">
            <i class="bi bi-sun" style="font-size: 16px;"></i>
          </div>
        </div>
        <div class="theme-card__content">
          <div class="theme-card__title">{{ $t('themeSettings.lightTheme') }}</div>
          <div class="theme-card__description">{{ $t('themeSettings.lightDescription') }}</div>
          <div class="theme-card__features">
            <span class="feature-tag">
              <i class="bi bi-eye" style="font-size: 10px; margin-right: 4px;"></i>
              Göz Dostu
            </span>
            <span class="feature-tag">
              <i class="bi bi-sun" style="font-size: 10px; margin-right: 4px;"></i>
              Parlak
            </span>
          </div>
        </div>
        <div class="theme-card__selector">
          <div 
            class="theme-selector"
            :class="{ 'theme-selector--active': !darkMode && !sompoMode }"
          >
            <div class="theme-selector__dot">
              <i v-if="!darkMode && !sompoMode" class="bi bi-check" style="font-size: 10px; color: white;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Dark Theme Card -->
      <div 
        class="theme-card"
        :class="{ 
          'theme-card--active': darkMode && !sompoMode,
          'theme-card--disabled': isThemeLoading
        }"
        @click="!isThemeLoading && selectTheme('dark')"
        role="button"
        tabindex="0"
        :aria-label="$t('themeSettings.darkTheme')"
        @keydown.enter="!isThemeLoading && selectTheme('dark')"
        @keydown.space.prevent="!isThemeLoading && selectTheme('dark')"
      >
               <div class="theme-card__preview">
                 <div class="theme-card__colors">
                   <div class="color-swatch color-swatch--primary" style="background: #030514;" title="Ana Arka Plan"></div>
                   <div class="color-swatch color-swatch--secondary" style="background: #242735;" title="İkincil Arka Plan"></div>
                   <div class="color-swatch color-swatch--accent" style="background: #374151;" title="Vurgu Rengi"></div>
                   <div class="color-swatch color-swatch--border" style="background: #4b5563;" title="Kenarlık Rengi"></div>
                   <div class="color-swatch color-swatch--text" style="background: #f8fafc;" title="Metin Rengi"></div>
                   <div class="color-swatch color-swatch--accent2" style="background: #60a5fa;" title="Primary Renk"></div>
                 </div>
          <div class="theme-card__icon">
            <i class="bi bi-moon" style="font-size: 16px;"></i>
          </div>
        </div>
        <div class="theme-card__content">
          <div class="theme-card__title">{{ $t('themeSettings.darkTheme') }}</div>
          <div class="theme-card__description">{{ $t('themeSettings.darkDescription') }}</div>
          <div class="theme-card__features">
            <span class="feature-tag">
              <i class="bi bi-moon" style="font-size: 10px; margin-right: 4px;"></i>
              Gece Modu
            </span>
            <span class="feature-tag">
              <i class="bi bi-battery-charging" style="font-size: 10px; margin-right: 4px;"></i>
              Batarya Tasarrufu
            </span>
          </div>
        </div>
        <div class="theme-card__selector">
          <div 
            class="theme-selector"
            :class="{ 'theme-selector--active': darkMode && !sompoMode }"
          >
            <div class="theme-selector__dot">
              <i v-if="darkMode && !sompoMode" class="bi bi-check" style="font-size: 10px; color: white;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Sompo Theme Card -->
      <div 
        class="theme-card"
        :class="{ 
          'theme-card--active': sompoMode && !darkMode,
          'theme-card--disabled': isThemeLoading
        }"
        @click="!isThemeLoading && selectTheme('sompo')"
        role="button"
        tabindex="0"
        :aria-label="$t('themeSettings.sompoTheme')"
        @keydown.enter="!isThemeLoading && selectTheme('sompo')"
        @keydown.space.prevent="!isThemeLoading && selectTheme('sompo')"
      >
               <div class="theme-card__preview">
                 <div class="theme-card__colors">
                   <div class="color-swatch color-swatch--primary" style="background: #f8f3f4;" title="Ana Arka Plan"></div>
                   <div class="color-swatch color-swatch--secondary" style="background: #f8dee0;" title="İkincil Arka Plan"></div>
                   <div class="color-swatch color-swatch--accent" style="background: #f3c5c5;" title="Vurgu Rengi"></div>
                   <div class="color-swatch color-swatch--border" style="background: #f3c5c5;" title="Kenarlık Rengi"></div>
                   <div class="color-swatch color-swatch--text" style="background: #1e293b;" title="Metin Rengi"></div>
                   <div class="color-swatch color-swatch--accent2" style="background: #b42029;" title="SOMPO Kırmızı"></div>
                 </div>
          <div class="theme-card__icon">
            <div class="sompo-logo-icon">
              <div class="sompo-circle-fill"></div>
              <div class="sompo-circle-stroke"></div>
            </div>
          </div>
        </div>
        <div class="theme-card__content">
          <div class="theme-card__title">{{ $t('themeSettings.sompoTheme') }}</div>
          <div class="theme-card__description">{{ $t('themeSettings.sompoDescription') }}</div>
          <div class="theme-card__features">
            <span class="feature-tag">
              <i class="bi bi-heart" style="font-size: 10px; margin-right: 4px;"></i>
              Marka Kimliği
            </span>
            <span class="feature-tag">
              <i class="bi bi-palette" style="font-size: 10px; margin-right: 4px;"></i>
              Özel Renkler
            </span>
          </div>
        </div>
        <div class="theme-card__selector">
          <div 
            class="theme-selector"
            :class="{ 'theme-selector--active': sompoMode && !darkMode }"
          >
            <div class="theme-selector__dot">
              <i v-if="sompoMode && !darkMode" class="bi bi-check" style="font-size: 10px; color: white;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Dark } from 'quasar'
import { useI18n } from 'vue-i18n'
// Store imports removed - using local state instead
import { createLogger } from 'src/utils/logger.js'

const { t: $t } = useI18n()
// Store instance removed - using local state instead
const logger = createLogger('AccountThemeSettings')

// Local theme state - initialize with current theme
const darkMode = ref(false)
const sompoMode = ref(false)
const isThemeLoading = ref(false)

// Initialize theme state from localStorage or default
const initializeTheme = () => {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true'
  const savedSompoMode = localStorage.getItem('sompoMode') === 'true'
  
  darkMode.value = savedDarkMode
  sompoMode.value = savedSompoMode
  // TODO: Sompo modu için body sınıfını uygula/kaldır
  // if (savedSompoMode) document.body.classList.add('sompo-mode')
  // else document.body.classList.remove('sompo-mode')
}

// Initialize on component mount
initializeTheme()

// Tema geçişinin tamamlandığını kontrol et
const waitForThemeTransition = async () => {
  // CSS transition'ların tamamlanmasını bekle (en uzun 0.3s + güvenlik payı)
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // DOM güncellemelerinin tamamlanmasını bekle
  await new Promise(resolve => requestAnimationFrame(resolve))
  await new Promise(resolve => requestAnimationFrame(resolve))
  
  // Quasar'ın tema geçiş animasyonlarının tamamlanmasını bekle
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Son bir kez DOM güncellemelerini bekle
  await new Promise(resolve => requestAnimationFrame(resolve))
  
  // Ek güvenlik için kısa bir bekleme
  await new Promise(resolve => setTimeout(resolve, 150))
}

const selectTheme = async (theme) => {
  logger.info('Theme selection:', theme)
  
  // Loading state'i aktif et
  isThemeLoading.value = true
  
  // Tema adlarını belirle
  const themeNames = {
    light: 'Aydınlık Tema',
    dark: 'Karanlık Tema', 
    sompo: 'SOMPO Tema'
  }
  
  try {
    switch (theme) {
      case 'light':
        darkMode.value = false
        sompoMode.value = false
        localStorage.setItem('darkMode', 'false')
        localStorage.setItem('sompoMode', 'false')
        // TODO: document.body.classList.remove('sompo-mode')
        Dark.set(false) // Apply light mode
        break
      case 'dark':
        darkMode.value = true
        sompoMode.value = false
        localStorage.setItem('darkMode', 'true')
        localStorage.setItem('sompoMode', 'false')
        // TODO: document.body.classList.remove('sompo-mode')
        Dark.set(true) // Apply dark mode
        break
      case 'sompo':
        darkMode.value = false
        sompoMode.value = true
        localStorage.setItem('darkMode', 'false')
        localStorage.setItem('sompoMode', 'true')
        // TODO: document.body.classList.add('sompo-mode')
        break
    }
    
    // Tema geçişinin tamamlanmasını bekle
    await waitForThemeTransition()
    
    // Kullanıcıya bildirim göster
    logger.info(`${themeNames[theme]} aktif edildi`)
    
    logger.info('Theme changed to:', theme)
  } finally {
    // Loading state'i kapat
    isThemeLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.account-menu__section {
  padding: 8px 0;
}

// Loading state styles
.theme-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  margin: 8px 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  &__text {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
}

// Disabled state for theme cards
.theme-card--disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
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

.theme-info {
  padding: 0 16px 8px;
}

.theme-info__text {
  font-size: 11px;
  color: $text-secondary;
  line-height: 1.4;
  opacity: 0.8;
}

.account-menu__list {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// Theme Card Styles
.theme-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid $border-lighter;
  border-radius: 8px;
  background: $background-card;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
  
  // Dark mode background fix
  .body--dark & {
    background: #64748b;
    border-color: #030514 !important;
  }
  
    &:hover {
      background: $background-light;
      border-color: $border-accent;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      
      // Dark mode hover fix
      .body--dark & {
        background: #475569;
        border-color: #030514 !important;
      }
      
      .theme-card__colors {
        .color-swatch {
          transform: scale(1.1);
        }
      }
      
      &::before {
        opacity: 1;
      }
    }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:focus {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
  
  &--active {
    border-color: $primary;
    background: rgba($primary, 0.05);
    box-shadow: 0 0 0 1px rgba($primary, 0.2);
    
    // Dark mode active state fix
    .body--dark & {
      background: rgba(100, 116, 139, 0.8);
      border-color: #030514 !important;
    }
    
    &:hover {
      background: rgba($primary, 0.1);
      box-shadow: 0 0 0 1px rgba($primary, 0.3);
      
      // Dark mode active hover fix
      .body--dark & {
        background: rgba(100, 116, 139, 0.9);
      }
    }
    
    .theme-card__title {
      color: $primary;
      font-weight: 700;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: $primary;
      border-radius: 50%;
      animation: theme-pulse 2s infinite;
    }
  }
}

.theme-card__preview {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.theme-card__colors {
  display: flex;
  gap: 3px;
}

  .color-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: help;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
      z-index: 1;
      position: relative;
    }
    
    &--primary {
      border-radius: 2px 0 0 2px;
    }
    
    &--accent2 {
      border-radius: 0 2px 2px 0;
    }
    
    &--text {
      border-radius: 0;
    }
  }

.theme-card__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
}

.theme-card__content {
  flex: 1;
  min-width: 0;
}

.theme-card__title {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2px;
  
  // Dark mode title color fix
  .body--dark & {
    color: #e2e8f0;
  }
  
  // Light mode'da tema başlıklarının rengini düzelt
  .body--light & {
    color: #1e293b;
  }
}

.theme-card__description {
  font-size: 11px;
  color: $text-secondary;
  line-height: 1.4;
  margin-bottom: 6px;
  
  // Dark mode description color fix
  .body--dark & {
    color: #94a3b8;
  }
}

.theme-card__features {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  color: $text-secondary;
  background: rgba($text-secondary, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  // Dark mode feature tag fix
  .body--dark & {
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.1);
  }
  
  // Hover durumunda renk değişmez, tema rengi korunur
}

.theme-card__selector {
  flex-shrink: 0;
}

.theme-selector {
  width: 20px;
  height: 20px;
  border: 2px solid $text-secondary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: $primary;
    transform: scale(1.1);
  }
  
  &--active {
    border-color: $primary;
  }
}

.theme-selector__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .theme-selector--active & {
    background: $primary;
  }
}

// Sompo Logo Icon
.sompo-logo-icon {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sompo-circle-fill {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #b42029;
  border-radius: 50%;
  z-index: 2;
}

.sompo-circle-stroke {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #b42029;
  border-radius: 50%;
  z-index: 1;
}

// Dark mode adjustments
body.dark-mode {
  .theme-card {
    border-color: $border-lighter;
    
    &:hover {
      background: $background-light;
      border-color: $border-accent;
    }
    
    &--active {
      border-color: $primary;
      background: rgba($primary, 0.1);
      
      &:hover {
        background: rgba($primary, 0.15);
      }
    }
  }
}

// Sompo mode adjustments
body.sompo-mode {
  .theme-card {
    border-color: rgba(243, 197, 197, 0.3);
    
    &:hover {
      background: rgba(248, 222, 223, 0.5);
      border-color: rgba(180, 32, 41, 0.3);
    }
    
    &--active {
      border-color: rgba(180, 32, 41, 0.6);
      background: rgba(180, 32, 41, 0.05);
      
      &:hover {
        background: rgba(180, 32, 41, 0.1);
      }
    }
  }
  
  .theme-selector {
    border-color: rgba(180, 32, 41, 0.4);
    
    &--active {
      border-color: rgba(180, 32, 41, 1);
    }
  }
  
  .theme-selector__dot {
    .theme-selector--active & {
      background: rgba(180, 32, 41, 1);
    }
  }
}

// Animasyon tanımları
@keyframes theme-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
