# İlk Milyonum Landing

Fərhad Pərvizi / Potensialist üçün `parvizi.org/ilkmilyonum` ünvanına nəzərdə tutulmuş yüngül statik landing səhifəsi.

## Fayllar

- `index.html` - bütün səhifə strukturu, SEO/OG meta teqləri və konfiqurasiya obyektləri
- `styles.css` - mobile-first responsiv dizayn
- `script.js` - mobil menyu, akkordeonlar, WhatsApp linkləri, forma POST-u, UTM ötürülməsi və analitika event-ləri
- `assets/` - Potensialist loqosu, foto yeri, favicon və OG vizualı

## Doldurulmalı məlumatlar

`index.html` daxilində `window.ILK_MILYONUM_CONFIG` obyektini yenilə:

- `appsScriptEndpoint` - Google Apps Script POST URL-i
- `whatsappNumber` - `994XXXXXXXXX` formatında WhatsApp nömrəsi
- `ga4Id` - GA4 ölçmə ID-si
- `metaPixelId` - Meta Pixel ID-si
- `privacyPolicyUrl` - məxfilik siyasəti səhifəsi
- `courseCtaUrl` - v2-də "İndi qoşul" düyməsini ödəniş səhifəsinə yönləndirmək üçün URL; boş qalanda forma bölməsinə skrol edir
- `courseCtaTarget` - ödəniş linki verilərsə `_self` və ya `_blank`
- `coursePriceLabel` - kurs qiyməti
- `accessDurationLabel` - dərslərə giriş müddəti
- `certificateLabel` - sertifikat statusu

Səhifədəki sosial media və hüquqi keçidlər də final URL-lərlə əvəz olunmalıdır. Müştəri fotosu hazır olduqda `assets/farhad-photo-placeholder.svg` yerinə WebP/AVIF foto faylı əlavə etmək daha yaxşıdır.

## Texniki tapşırıq xəritəsi

- Sticky header: loqo, anchor naviqasiya, "Qeydiyyat" CTA, mobil hamburger
- Hero: H1, alt mətn, qiymətə skrol CTA, WhatsApp CTA, "İlk dalğada 200+ iştirakçı" sətri və foto yeri
- Kimlər üçün: 3 kart
- Proqram: 3 moduldan ibarət, default bağlı, eyni anda bir modul açılan akkordeon
- Nə daxildir: 6 maddəlik checklist, `[MÜDDƏT]` və sertifikat statusu konfiqurasiyadan idarə olunur
- Qiymət: 2 kart; kurs kartı vurğulanır, Fərdi Portfel Sessiyası add-on kimi ikinci plandadır
- Fərhad kimdir: foto yeri, bio bəndləri və sosial media keçidləri
- FAQ: 7 sual, ödəniş üsulları və başlanğıc tarixi daxil
- Footer + forma: ad, telefon, e-mail, razılıq checkbox-u, UTM pass-through və inline uğur/xəta mesajları
- Floating WhatsApp: bütün ekran ölçülərində sağ aşağıda
- Analitika hook-ları: `form_submit`, `whatsapp_click`, `pricing_view`, hər CTA üçün `cta_click`
- Out of scope saxlanılıb: online ödəniş inteqrasiyası, LMS, CMS/blog, çoxdilli versiya, popup forma, installment bloku, ikinci spiker bölməsi

## Müştəridən gözlənən final materiallar

- Hero, proqram, FAQ və bio üçün təsdiqlənmiş Azərbaycan dilində mətnlər
- Fərhad Pərvizinin hero və haqqında bölməsi üçün WebP/AVIF fotoları
- Təsdiqlənmiş əlavə brend qaydaları varsa, logo əsasında qurulan cyan/indigo/navy rəng sisteminə tətbiq edilməlidir
- WhatsApp nömrəsi, sosial media URL-ləri və əlaqə e-maili
- Google Apps Script endpoint URL-i
- Məxfilik siyasəti URL-i və hüquqi keçidlər
- Kursun `[QİYMƏT]` dəyəri, girişin `[MÜDDƏT]` dəyəri və sertifikat statusu
- Final OG şəkli

## Lokal yoxlama

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Sonra səhifəni aç:

```text
http://127.0.0.1:4173/
```

Əgər 4173 portu tutuludursa, eyni əmri 4174 və ya başqa boş portla işə salmaq olar.

## Deploy təklifi

V1 üçün statik hostinq uyğundur: mövcud hostinq, Cloudflare Pages və ya ekvivalent. Online ödəniş, LMS və CMS bu versiyada daxil deyil.

Deploy-dan əvvəl qəbul yoxlaması:

- Formanın real Google Apps Script endpoint-ə tam yol boyu göndərişi yoxlanmalıdır
- GA4 və Meta Pixel ID-ləri daxil edildikdən sonra event-lər brauzer developer tools və analitika panellərində təsdiqlənməlidir
- Final fotolar WebP/AVIF formatında, `loading="lazy"` ilə və ümumi səhifə çəkisi 1.5 MB-dan aşağı qalacaq şəkildə əlavə olunmalıdır
- `https://parvizi.org/ilkmilyonum` canonical URL-i deploy mühitində açılmalıdır
