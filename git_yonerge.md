GitHub ve Azure Repos’a Aynı Projeyi Push Etme Yönergeleri

1. GitHub’dan Projeyi Klonla
-----------------------------
GitHub’daki projenin bağlantısını kullanarak local bilgisayarına klonla:

git clone https://github.com/kullaniciAdi/projeAdi.git
cd projeAdi

2. Azure Repos için Yeni Remote Tanımla
---------------------------------------
Azure DevOps’ta bir repo oluşturduktan sonra sana verilen bağlantıyı kullanarak yeni bir remote ekle:

git remote add azure https://dev.azure.com/organization/projeAdi/_git/projeAdi

Not: 'azure' burada remote’un adı. İstersen farklı bir isim de verebilirsin.

3. Değişiklikleri Commit Et
---------------------------
Kodda yaptığın değişiklikleri Git’e ekleyip commit’le:

git add .
git commit -m "Yeni özellik eklendi"

4. Değişiklikleri Her İki Repoya Push Et
----------------------------------------
Aynı commit’i hem GitHub’a hem Azure Repos’a göndermek için:

git push origin main     # GitHub'a gönderir
git push azure main      # Azure Repos'a gönderir

Not: Eğer branch’in adı 'main' değilse, kendi branch adını kullan.

5. Güncellemeleri Her İki Repodan Çekmek
----------------------------------------
Her iki repodan da güncel kodları almak için:

git pull origin main
git pull azure main

6. Remote’ları Kontrol Etmek
----------------------------
Tanımlı olan uzak repoları görmek için:

git remote -v
