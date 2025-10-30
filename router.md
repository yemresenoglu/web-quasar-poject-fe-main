# Router Yapısı - SOMPO Sigorta Frontend

## Base URL
- **Development**: `http://localhost:8086`
- **Production**: `https://your-domain.com` (yapılandırmaya göre)

## Route Yapısı

### 1. Ana Sayfalar

#### Giriş Sayfası
- **URL**: `http://localhost:8086/`
- **Component**: `LoginLayout.vue` → `LoginPage.vue`
- **Route Name**: `login`
- **Meta**: 
  - Title: "Giriş Yap"
  - TitleKey: `pageTitles.login`
  - RequiresAuth: `false`
  - HideFromMenu: `true`

#### Ana Sayfa (Dashboard)
- **URL**: `http://localhost:8086/home`
- **Component**: `MainLayout.vue` → `IndexPage.vue`
- **Route Name**: `index`
- **Meta**:
  - Title: "Başlangıç"
  - TitleKey: `pageTitles.home`
  - Icon: `house`
  - RequiresAuth: `true`

### 2. Menü Sayfaları

#### Menü Ana Sayfası
- **URL**: `http://localhost:8086/home/menu`
- **Component**: `MainLayout.vue` → `MenuPage.vue`
- **Route Name**: `menu`
- **Meta**:
  - Title: "Menü"
  - TitleKey: `pageTitles.menu`
  - Icon: `grid-3x3-gap`
  - RequiresAuth: `true`

#### Hasar Sorgula (Arabulucu)
- **URL**: `http://localhost:8086/menu/hasar-sorgula-arabulucu`
- **Component**: `MainLayout.vue` → `HasarDosyaSorgulaArabulucu.vue`
- **Route Name**: `hasar-sorgula-arabulucu`
- **Meta**:
  - Title: "Hasar Dosya Sorgula (Arabulucu)"
  - TitleKey: `pageTitles.hasarSorgulaArabulucu`
  - Icon: `scales`
  - RequiresAuth: `true`

#### Hasar Dosya (Arabulucu)
- **URL**: `http://localhost:8086/menu/hasar-dosya-arabulucu/:dosyaNo?`
- **Component**: `MainLayout.vue` → `HasarDosyaArabulucu.vue`
- **Route Name**: `hasar-dosya-arabulucu`
- **Parameters**: `dosyaNo` (optional)
- **Meta**:
  - Title: "Hasar Dosya (Arabulucu)"
  - TitleKey: `pageTitles.hasarDosyaArabulucu`
  - Icon: `scales`
  - RequiresAuth: `true`

**Örnek URL'ler:**
- `http://localhost:8086/menu/hasar-dosya-arabulucu` (dosyaNo olmadan)
- `http://localhost:8086/menu/hasar-dosya-arabulucu/2025311003010` (dosyaNo ile)

### 3. Hesap Sayfaları

#### Profil Düzenle
- **URL**: `http://localhost:8086/home/account/edit-profile`
- **Component**: `MainLayout.vue` → `AccountEditProfile.vue`
- **Route Name**: `account-edit-profile`
- **Meta**:
  - Title: "Profil Düzenle"
  - TitleKey: `pageTitles.accountEditProfile`
  - Icon: `person`
  - RequiresAuth: `true`
  - HideFromMenu: `true`

#### Şifre Değiştir
- **URL**: `http://localhost:8086/home/account/change-password`
- **Component**: `MainLayout.vue` → `AccountChangePassword.vue`
- **Route Name**: `account-change-password`
- **Meta**:
  - Title: "Şifre Değiştir"
  - TitleKey: `pageTitles.accountChangePassword`
  - Icon: `key`
  - RequiresAuth: `true`
  - HideFromMenu: `true`

### 4. Hata Sayfası

#### 404 - Sayfa Bulunamadı
- **URL**: `http://localhost:8086/*` (herhangi bir tanımsız route)
- **Component**: `ErrorNotFound.vue`
- **Meta**:
  - TitleKey: `pageTitles.notFound`

## Layout Yapısı

### LoginLayout
- **Kullanıldığı Sayfalar**: Giriş sayfası
- **Özellikler**: Minimal layout, sadece giriş formu

### MainLayout
- **Kullanıldığı Sayfalar**: Tüm ana uygulama sayfaları
- **Özellikler**: 
  - Header
  - Sidebar/Taskbar
  - Main content area
  - Footer

## Route Meta Özellikleri

### Ortak Meta Alanları
- **title**: Sayfa başlığı (Türkçe)
- **titleKey**: i18n çeviri anahtarı
- **icon**: Quasar ikon adı
- **requiresAuth**: Kimlik doğrulama gerekli mi?
- **hideFromMenu**: Menüde gizli mi?

### Özel Meta Alanları
- **dosyaNo**: Hasar dosya numarası (parametreli route'larda)

## Router Konfigürasyonu

### History Mode
- **Development**: `createWebHistory` (HTML5 History API)
- **Production**: Yapılandırmaya göre

### Scroll Behavior
- Her route değişiminde sayfa en üste scroll eder

### Title Management
- Her route değişiminde dinamik title güncelleme
- i18n desteği ile çoklu dil
- Base title: "SOMPO Sigorta"

## Navigasyon Örnekleri

```javascript
// Programmatic navigation
this.$router.push('/home')
this.$router.push('/menu/hasar-sorgula-arabulucu')
this.$router.push({ name: 'hasar-dosya-arabulucu', params: { dosyaNo: '2025311003010' } })

// Route parameters
this.$route.params.dosyaNo // Hasar dosya numarası
this.$route.meta.title // Sayfa başlığı
```

## Güvenlik

- **Authentication**: Router guard kaldırıldı (development için)
- **Authorization**: Meta `requiresAuth` alanı ile kontrol
- **Route Protection**: Gerekli sayfalar için auth kontrolü

## Notlar

- Tüm route'lar `/` ile başlar
- Parametreli route'lar `:` ile tanımlanır
- Optional parametreler `?` ile işaretlenir
- Catch-all route en sonda tanımlanır
- Layout'lar route seviyesinde tanımlanır
