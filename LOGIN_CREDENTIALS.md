# 🔐 Login Bilgileri

## Demo Kullanıcı Bilgileri

Bu dosya, uygulamanın demo versiyonu için giriş bilgilerini içerir.

### 📋 Login Bilgileri

| Alan | Değer | Açıklama |
|------|-------|----------|
| **Kullanıcı Kodu** | `admin` | Büyük/küçük harf duyarsız |
| **Şifre** | `12` | Sayısal şifre |
| **Captcha** | `aaa` | Büyük/küçük harf duyarsız |

### 🎯 Kullanım

1. **Kullanıcı Kodu**: `admin` (veya `ADMIN`, `Admin`)
2. **Şifre**: `12`
3. **Captcha**: `aaa` (veya `AAA`, `Aaa`)

### ✅ Başarılı Giriş

Doğru bilgilerle giriş yapıldığında:
- ✅ Başarı mesajı gösterilir
- ✅ `/home` sayfasına yönlendirilir
- ✅ Demo kullanıcı profili yüklenir

### 🔄 Backend Entegrasyonu

Backend hazır olduğunda:
1. `LoginPage.vue`'da tek satır değişiklik yapılacak
2. Demo data yerine gerçek API çağrısı aktif olacak
3. Bu demo bilgiler geçersiz olacak

### 📝 Demo Kullanıcı Profili

```json
{
  "userCode": "admin",
  "kullaniciAd": "Admin",
  "soyad": "Kullanıcı", 
  "email": "admin@sompo.com.tr",
  "department": "Bilgi İşlem",
  "role": "Administrator",
  "permissions": ["dashboard", "hasar", "muhasebe", "raporlama"]
}
```

### 🚨 Önemli Notlar

- Bu bilgiler sadece demo amaçlıdır
- Gerçek üretim ortamında geçerli değildir
- Captcha her zaman görünür durumda
- Case insensitive validation aktif

---
*Son güncelleme: Demo versiyon için hazırlanmıştır*
