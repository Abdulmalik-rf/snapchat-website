# فيديو الخلفية

الموقع يعرض فيديو ثابتًا خلف كل الأقسام. وضعان:

| الوضع | السلوك | متى تستخدمه |
| --- | --- | --- |
| `scrub` (افتراضي) | يتقدّم الفيديو مع تمرير الصفحة (مثل صفحات Apple) | فيديو "قصة" من 5–15 ثانية بدون صوت |
| `autoplay` | تشغيل تلقائي صامت متكرّر | فيديو أجواء / حركة مستمرة |

## الملفات

ضع الملفات في `public/video/` ثم اضبط:

```env
NEXT_PUBLIC_BG_VIDEO=/video/bg.mp4
NEXT_PUBLIC_BG_VIDEO_WEBM=/video/bg.webm
NEXT_PUBLIC_BG_POSTER=/video/poster.jpg
NEXT_PUBLIC_BG_MODE=scrub
```

حتى تصل الملفات يعرض الموقع خلفية متحركة بديلة (بقع ضوء صفراء + شبكة خفيفة).

## تجهيز الفيديو بـ ffmpeg

لوضع `scrub` يجب أن يكون **كل إطار مفتاحيًا** (keyframe) حتى يكون التقدّم مع التمرير سلسًا بلا تقطيع:

```bash
# MP4 (H.264) — كل الإطارات مفتاحية، بدون صوت، 1080p، جاهز للبث
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=30" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -keyint_min 1 \
  -crf 24 -preset slow -movflags +faststart public/video/bg.mp4

# WebM (VP9) — أخف حجمًا لمتصفحات Chrome/Firefox
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=30" \
  -c:v libvpx-vp9 -g 1 -crf 34 -b:v 0 -row-mt 1 public/video/bg.webm

# صورة Poster تظهر قبل تحميل الفيديو
ffmpeg -i source.mov -ss 00:00:01 -frames:v 1 -vf "scale=1920:-2" public/video/poster.jpg
```

لوضع `autoplay` يمكنك ترك `-g` على الإعداد الافتراضي (ملف أصغر):

```bash
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -pix_fmt yuv420p \
  -crf 26 -preset slow -movflags +faststart public/video/bg.mp4
```

## توصيات

- **المدة:** 6–12 ثانية لوضع `scrub`، وحتى 20 ثانية لوضع `autoplay`.
- **الحجم:** استهدف أقل من 6 MB للـ MP4 (الجوال أولًا). قلّل الدقة إلى 1280 عرضًا إن لزم.
- **المحتوى:** حركة بطيئة، تباين منخفض، بدون نصوص — فوق الفيديو طبقة تعتيم تضمن قراءة النص.
- **الحركة المخفّضة:** إن فعّل الزائر "تقليل الحركة" في نظامه يتحوّل الفيديو تلقائيًا إلى تشغيل صامت بدل التمرير.
