# 🧪 UI Test Planı - Optimizasyon Sonrası

## 📋 Test Kapsamı
Bu test planı, proje optimizasyonu sonrası tüm UI bileşenlerinin doğru çalıştığını doğrulamak için hazırlanmıştır.

---

## 🚀 **1. ANA GİRİŞ TESTLERİ**

### 1.1 Login Sayfası Testi
**URL:** `http://localhost:8086/`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Login sayfası açılıyor
   - [ ] Logo görünüyor (`src/assets/logo.png`)
   - [ ] "Giriş Yap" başlığı görünüyor

2. **Form Alanları**
   - [ ] Kullanıcı Kodu input'u aktif
   - [ ] Şifre input'u aktif (password tipinde)
   - [ ] Captcha görseli görünüyor ("AAA" yazısı)
   - [ ] Şifre göster/gizle butonu çalışıyor
   - [ ] **Enter tuşu desteği:** Her input'ta Enter tuşuna basıldığında giriş yapılıyor

3. **Demo Giriş Testi**
   - [ ] **Kullanıcı Kodu:** `admin` (büyük/küçük harf fark etmez)
   - [ ] **Şifre:** `12`
   - [ ] **Captcha:** `aaa` (büyük/küçük harf fark etmez)
   - [ ] "Giriş Yap" butonuna tıkla VEYA Enter tuşuna bas
   - [ ] Başarılı mesajı görünüyor
   - [ ] `/home` sayfasına yönlendiriliyor

4. **Hatalı Giriş Testi**
   - [ ] Yanlış kullanıcı kodu ile giriş yapmayı dene
   - [ ] Hata mesajı görünüyor
   - [ ] Captcha yenileniyor

---

## 🏠 **2. DASHBOARD TESTLERİ**

### 2.1 Ana Sayfa (IndexPage)
**URL:** `http://localhost:8086/home`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Dashboard açılıyor
   - [ ] Loading spinner gösteriliyor (kısa süre)
   - [ ] Tüm kartlar yükleniyor

2. **Özet İstatistikler**
   - [ ] **Bekleyen İşler:** 29 (turuncu kart)
   - [ ] **Üzerimdeki İşler:** 20 (mavi kart)
   - [ ] **Gönderdiğim İşler:** 68 (yeşil kart)

3. **Detaylı İş Sayıları - Arabuluculuk Süreçleri**
   - [ ] 9 farklı arabuluculuk süreç kartı görünüyor
   - [ ] Her kartta 3 sütun (Bekleyen, Üzerimdeki, Gönderdiğim)
   - [ ] **Süreçler:** Hasar Kayıt, Hasar İnceleme, Hasar Onay, Hasar Ödeme, Hasar Kapanış, Arabuluculuk Görüşmesi, Arabuluculuk Kararı, Arabuluculuk İmzası, Arabuluculuk Takibi
   - [ ] Demo veriler görünüyor (5, 7, 4, 6, 2, 3, 4, 2, 1 gibi değerler)

4. **Grafikler (DashboardCharts)**
   - [ ] **Pasta Grafik:** İş Durumu Dağılımı görünüyor
   - [ ] **Çizgi Grafik:** Haftalık İş Trendi görünüyor
   - [ ] **Bar Grafik:** Arabuluculuk Süreç Bazlı İş Yükü görünüyor
   - [ ] Bar grafikte 9 arabuluculuk süreci görünüyor
   - [ ] Grafikler demo verilerle dolu (29, 20, 68 değerleri)

5. **İş Havuzları - Arabuluculuk İş Havuzları**
   - [ ] 6 farklı arabuluculuk havuz kartı görünüyor
   - [ ] **Havuzlar:** Arabuluculuk Başvuru, Arabuluculuk Görüşme, Arabuluculuk Karar, Arabuluculuk İmza, Arabuluculuk Takip, Arabuluculuk Tamamlama
   - [ ] Demo veriler görünüyor (15, 8, 12, 6, 4, 3 değerleri)

6. **Duyuru Listesi**
   - [ ] 3 demo duyuru görünüyor
   - [ ] "Devamını Oku" butonları çalışıyor
   - [ ] Duyurular genişletiliyor/daraltılıyor

7. **Zaman Bilgisi**
   - [ ] Sağ üstte güncel saat görünüyor
   - [ ] Saat her saniye güncelleniyor

---

## 🍔 **3. MENÜ TESTLERİ**

### 3.1 Menü Sayfası
**URL:** `http://localhost:8086/home/menu`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Menü sayfası açılıyor
   - [ ] "Menü Bulunmuyor" mesajı görünüyor (boş durum)

2. **Hızlı Erişim**
   - [ ] Hızlı erişim alanı boş görünüyor
   - [ ] "Hızlı Erişim Bulunmuyor" mesajı görünüyor

---

## 🔍 **4. HASAR SORGULAMA TESTLERİ**

### 4.1 Hasar Sorgula Arabulucu
**URL:** `http://localhost:8086/menu/hasar-sorgula-arabulucu`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Sayfa açılıyor
   - [ ] Tab yapısı görünüyor

2. **Tab Yapısı**
   - [ ] **Tab 1:** "Hasar Dosya Bilgileri" (aktif)
   - [ ] **Tab 2:** "Poliçe Bilgileri"
   - [ ] Tab'lar arasında geçiş yapılabiliyor

3. **Hasar Dosya Bilgileri Tab'ı**
   - [ ] **Dosya No** input'u görünüyor
   - [ ] **Mağdur No** input'u görünüyor
   - [ ] Input'lar boş ve kullanılabilir

4. **Poliçe Bilgileri Tab'ı**
   - [ ] **Poliçe No** input'u görünüyor
   - [ ] **Sigortalı Adı** input'u görünüyor
   - [ ] Input'lar boş ve kullanılabilir

5. **Butonlar**
   - [ ] **"Bul"** butonu (mavi sol border)
   - [ ] **"Temizle"** butonu (mavi sol border)
   - [ ] Butonlar ortalanmış ve aynı tasarımda

6. **Arama Fonksiyonu**
   - [ ] Herhangi bir değer girip "Bul" butonuna tıkla
   - [ ] 1 saniye bekle
   - [ ] Başarı mesajı görünüyor
   - [ ] 3 demo sonuç tabloda görünüyor

7. **Sonuç Tablosu**
   - [ ] Tablo başlıkları görünüyor
   - [ ] 3 satır demo veri görünüyor
   - [ ] **"Görüntüle"** butonları (mavi)
   - [ ] **"Yeni Sekmede Aç"** butonları (yeşil)
   - [ ] Butonlar çalışıyor

8. **Temizle Fonksiyonu**
   - [ ] "Temizle" butonuna tıkla
   - [ ] Tüm input'lar temizleniyor
   - [ ] Tablo sonuçları temizleniyor

---

## 📄 **5. HASAR DOSYA DETAY TESTLERİ**

### 5.1 Hasar Dosya Arabulucu
**URL:** `http://localhost:8086/menu/hasar-dosya-arabulucu/2025311003010`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Sayfa açılıyor
   - [ ] URL'de dosya numarası görünüyor

2. **Dosya Özet Bilgileri**
   - [ ] **Dosya No:** `2025311003010/2` görünüyor
   - [ ] Diğer tüm alanlar boş görünüyor
   - [ ] Form elemanları düzenlenebilir değil

3. **İhbar Veren Kişi Bilgileri**
   - [ ] Tüm alanlar boş görünüyor
   - [ ] Form elemanları düzenlenebilir değil

4. **Değer Kaybı Arabuluculuk**
   - [ ] Tüm alanlar boş görünüyor
   - [ ] Dropdown'lar çalışıyor (boş seçenekler)

5. **Evrak Bölümü**
   - [ ] Evrak listesi boş görünüyor
   - [ ] "Evrak Türü" dropdown'u çalışıyor
   - [ ] Form elemanları kullanılabilir

---

## 👤 **6. HESAP TESTLERİ**

### 6.1 Profil Düzenleme
**URL:** `http://localhost:8086/home/account/edit-profile`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Profil düzenleme sayfası açılıyor
   - [ ] Tüm alanlar boş görünüyor

2. **Form Alanları**
   - [ ] **Ad** input'u boş ve düzenlenebilir
   - [ ] **Soyad** input'u boş ve düzenlenebilir
   - [ ] **Email** input'u boş ve düzenlenebilir
   - [ ] **Telefon** input'u boş ve düzenlenebilir

3. **Kaydet Fonksiyonu**
   - [ ] Bilgileri doldur
   - [ ] "KAYDET" butonuna tıkla
   - [ ] Başarı mesajı görünüyor
   - [ ] Form temizleniyor

### 6.2 Şifre Değiştirme
**URL:** `http://localhost:8086/home/account/change-password`

#### ✅ Test Adımları:
1. **Sayfa Yüklenmesi**
   - [ ] Şifre değiştirme sayfası açılıyor
   - [ ] Tüm alanlar boş görünüyor

2. **Form Alanları**
   - [ ] **Mevcut Şifre** input'u (password tipinde)
   - [ ] **Yeni Şifre** input'u (password tipinde)
   - [ ] **Şifre Tekrar** input'u (password tipinde)
   - [ ] Şifre göster/gizle butonları çalışıyor

3. **Değiştir Fonksiyonu**
   - [ ] Şifreleri doldur
   - [ ] "DEĞİŞTİR" butonuna tıkla
   - [ ] Başarı mesajı görünüyor

---

## 🎨 **7. TEMA TESTLERİ**

### 7.1 Tema Değiştirme
**Hesap Ayarları → Tema Seçimi**

#### ✅ Test Adımları:
1. **Aydınlık Tema**
   - [ ] Aydınlık tema seçili
   - [ ] Arka plan beyaz/açık renk
   - [ ] Metinler koyu renk

2. **Karanlık Tema**
   - [ ] Karanlık tema kartına tıkla
   - [ ] Tüm sayfa karanlık moda geçiyor
   - [ ] **Tema kartları:** Arka plan `#64748b`
   - [ ] **Tema kartları:** Border `#030514`
   - [ ] Metinler açık renk

3. **SOMPO Tema**
   - [ ] SOMPO tema kartına tıkla
   - [ ] Tema değişikliği uygulanıyor

---

## 🧭 **8. NAVİGASYON TESTLERİ**

### 8.1 Taskbar Navigasyonu
**Sol menü çubuğu**

#### ✅ Test Adımları:
1. **Ana Menü Öğeleri**
   - [ ] **Başlangıç** → `/home` sayfasına gidiyor
   - [ ] **Menü** → `/home/menu` sayfasına gidiyor

2. **Hasar Menü Öğeleri**
   - [ ] **Hasar Sorgula Arabulucu** → `/menu/hasar-sorgula-arabulucu`
   - [ ] **Hasar Dosya Arabulucu** → `/menu/hasar-dosya-arabulucu`

3. **Hesap Menü Öğeleri**
   - [ ] **Profil Düzenle** → `/home/account/edit-profile`
   - [ ] **Şifre Değiştir** → `/home/account/change-password`

---

## 🔄 **9. RESPONSİVE TESTLERİ**

### 9.1 Mobil Görünüm
**Tarayıcı boyutunu küçült (768px altı)**

#### ✅ Test Adımları:
1. **Login Sayfası**
   - [ ] Form mobil görünümde düzgün
   - [ ] Captcha responsive boyutlarda

2. **Dashboard**
   - [ ] Kartlar mobilde tek sütun
   - [ ] Grafikler responsive

3. **Hasar Sayfaları**
   - [ ] Tab'lar mobilde düzgün
   - [ ] Tablo yatay kaydırmalı

### 9.2 Tablet Görünümü
**Tarayıcı boyutunu orta yap (768px-1024px)**

#### ✅ Test Adımları:
1. **Grid Yapıları**
   - [ ] 2 sütunlu grid'ler tek sütuna geçiyor
   - [ ] 3 sütunlu grid'ler 2 sütuna geçiyor

---

## ⚡ **10. PERFORMANS TESTLERİ**

### 10.1 Sayfa Yükleme
#### ✅ Test Adımları:
1. **İlk Yükleme**
   - [ ] Login sayfası hızlı yükleniyor
   - [ ] Loading spinner'lar kısa süre görünüyor

2. **Navigasyon**
   - [ ] Sayfa geçişleri hızlı
   - [ ] Lazy loading çalışıyor

3. **Demo Data**
   - [ ] Demo veriler anında yükleniyor
   - [ ] API simülasyonları çalışıyor

---

## 🚨 **11. HATA TESTLERİ**

### 11.1 404 Sayfası
**URL:** `http://localhost:8086/olmayan-sayfa`

#### ✅ Test Adımları:
1. **Hata Sayfası**
   - [ ] 404 sayfası görünüyor
   - [ ] "Sayfa Bulunamadı" mesajı
   - [ ] Ana sayfaya dönüş butonu

### 11.2 Captcha Hataları
#### ✅ Test Adımları:
1. **Captcha Yenileme**
   - [ ] Yenile butonuna tıkla
   - [ ] Captcha yenileniyor
   - [ ] Yeni "AAA" görseli geliyor

---

## 📊 **12. VERİ TESTLERİ**

### 12.1 Demo Data Kontrolü
#### ✅ Test Adımları:
1. **Login Demo Data**
   - [ ] `admin/12/aaa` ile giriş çalışıyor
   - [ ] Case insensitive çalışıyor

2. **Dashboard Demo Data**
   - [ ] Özet: 29, 20, 68 değerleri
   - [ ] 9 arabuluculuk süreç kartı demo verilerle dolu
   - [ ] 6 arabuluculuk iş havuzu demo verilerle dolu
   - [ ] Grafikler demo verilerle dolu

3. **Hasar Demo Data**
   - [ ] 3 demo arama sonucu
   - [ ] Tablo düzgün görünüyor

---

## 🎯 **KRİTİK TEST NOKTALARI**

### ⚠️ **Dikkat Edilmesi Gerekenler:**
1. **Template Korunması:** Hiçbir UI elementi bozulmamalı
2. **CSS Yapısı:** Orijinal tasarım korunmalı
3. **Demo Data:** Tüm demo veriler çalışmalı
4. **Navigasyon:** Tüm linkler çalışmalı
5. **Responsive:** Mobil/tablet görünümler düzgün
6. **Tema:** Dark/light tema geçişleri çalışmalı

### ✅ **Başarı Kriterleri:**
- Tüm sayfalar açılıyor
- Tüm butonlar çalışıyor
- Demo data görünüyor
- Tema değişiklikleri çalışıyor
- Responsive tasarım korunuyor
- Performance iyileşmiş

---

**📝 Test Notları:** Her test adımını kontrol edin ve sonuçları not alın. Herhangi bir sorun tespit edilirse, hangi sayfa ve hangi fonksiyonda olduğunu belirtin.
