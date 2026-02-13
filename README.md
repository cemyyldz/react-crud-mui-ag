Kullanıcı Yönetim Paneli (User Management Dashboard)

Bu proje, kullanıcıların listelendiği, detaylarının görüntülendiği, yeni kullanıcı eklenebildiği ve mevcut kullanıcıların düzenlenip silinebildiği, **React** ve **Material UI** tabanlı modern bir web uygulamasıdır.

Proje geliştirilirken **Temiz Kod (Clean Code)**, **Separation of Concerns (İlgi Alanlarının Ayrımı)** ve **Adapter Pattern** gibi yazılım mimarisi prensiplerine sadık kalınmıştır.

##  Özellikler

* **Gelişmiş Veri Tablosu:** **AG Grid** kullanılarak sayfalama (pagination), sıralama ve filtreleme özellikleri.
* **Akıllı Arama:** Tablo içinde **Debounce** (gecikmeli) mekanizması ile performanslı arama.
* **CRUD İşlemleri:**
    * **Ekleme & Düzenleme:** Sağdan açılan (Drawer) panel ile kullanıcı yönetimi.
    * **Silme:** Güvenli silme işlemi için onay diyalog penceresi.
    * **Detay Görüntüleme:** Her kullanıcı için dinamik ID ile yönlendirilen özel detay sayfası.
* **Form Yönetimi:**
    * Form validasyonu (Boş alan, Email Regex, Telefon formatı kontrolü).
    * Kontrollü bileşenler (Controlled Components) ile state yönetimi.
* **Responsive Tasarım:** Mobil cihazlarda sütun gizleme ve butonların ikonlaşması (MUI Breakpoints).
* **Kullanıcı Bildirimleri:** Başarılı/Hatalı işlemler için **React Toastify** entegrasyonu.

##  Teknolojiler

* **Core:** React.js (Vite)
* **UI Framework:** Material UI (MUI) v5
* **Data Grid:** AG Grid React
* **Routing:** React Router DOM v6
* **HTTP Client:** Axios
* **Notifications:** React Toastify

##  Proje Mimarisi ve Tasarım Kararları

Projenin sürdürülebilirliğini artırmak için aşağıdaki mimari desenler uygulanmıştır:

1. Adaptör Deseni (Adapter Pattern) - `userService.js`
Backend API (MockAPI) verileri Türkçe anahtarlarla (`isim`, `soyisim`, `telefon`) tutarken, Frontend tarafında standart İngilizce isimlendirme (`name`, `surname`, `phone`) kullanılmıştır.

2. Akıllı Bileşen (Smart Component) - UserFormDrawer
Form yönetimi ve veri çekme işlemleri, sayfalardan (Dashboard veya UserDetail) soyutlanarak UserFormDrawer bileşenine devredilmiştir. Bu sayede sayfa bileşenleri (Page Components) sadece gösterimden sorumlu hale gelmiştir.
Sorumluluk: Veriyi API'den çekmek, formu doldurmak, doğrulamak ve API'ye göndermek (Create/Update) tamamen Drawer'ın sorumluluğundadır.

Çalışma Mantığı:
Drawer'a sadece editId prop'u gönderilir.
Düzenleme Modu: Eğer editId varsa, Drawer kendi içinde useEffect ile API isteği atarak veriyi çeker ve yükleniyor (Spinner) durumunu yönetir.
Ekleme Modu: Eğer editId yoksa (null), form boş açılır ve "Yeni Kayıt" moduna geçer.

İşlem başarılı olduğunda onSuccess callback'i tetiklenir ve ebeveyn bileşenin listeyi yenilemesi sağlanır.

3. Tek Doğruluk Kaynağı (Single Source of Truth) ve State Yönetimi
Form düzenleme işleminde Orijinal Veri (Props/API Data) ile Taslak Veri (Local State) birbirinden ayrılmıştır. React'in "Tek Yönlü Veri Akışı" (One-way data flow) prensibi korunmuştur.

Kopyalama: Drawer açıldığında, API'den gelen veya eldeki veri geçici bir formData state'ine kopyalanır.
Düzenleme: Kullanıcı inputlara yazı yazdığında sadece bu formData (Taslak) güncellenir. Orijinal veri asla mutasyona uğramaz.
Kayıt: Kullanıcı "Kaydet" butonuna bastığında, formData içindeki son hal paketlenerek API'ye gönderilir.
İptal: Kullanıcı "Vazgeç" dediğinde veya çekmeceyi kapattığında, formData silinir ve orijinal veri bozulmamış olarak kalır.
