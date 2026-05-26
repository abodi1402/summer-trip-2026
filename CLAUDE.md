# ذاكرة وسياق مشروع مخطط الرحلة الصيفية (Russia Trip Planner)

مخطط تفاعلي وعصري لرحلة الصيف إلى روسيا مع الزملاء.

## معلومات المشروع الأساسية (Project Info)

* **المسافرون (Travelers):**
  1. عبد الله الزهراني (عبدالله الزهراني)
  2. عبد العزيز الحميد (عبدالعزيز الحميد)
  3. حسن الدوسري (حسن الدوسري)
  4. فهد بن جديد (فهد بن جديد)
* **الوجهة الأساسية:** روسيا 🇷🇺 (موسكو وسان بطرسبرغ)
* **التقنيات المستخدمة:** React + Vite + Tailwind CSS v4 + Lucide React.
* **فلسفة التصميم (Design Philosophy):**
  * تصميم كلاسيكي هادئ وبسيط (Simple & Premium Light Theme).
  * خلفية الموقع: كريمية دافئة مريحة للعين (`#F9F7F4`).
  * النصوص: أسود داكن عالي التباين والوضوح (`#1A1A1A`).
  * الأخضر الرئيسي: أخضر غاباتي ملكي فخم (`#2D6A4F`).
  * الأخضر الثانوي: أخضر ربيعي ناعم (`#74C69D`).
  * البطاقات: بيضاء بظل خفيف (لا نيون ولا glassmorphism).
  * الخطوط: خط **IBM Plex Sans Arabic** من Google Fonts.
  * هيكلية التنقل: شريط جانبي ثابت على اليمين (Right Sidebar) يدعم التصفح باللغة العربية (RTL).

## أوامر التشغيل والبناء (Commands)

> [!IMPORTANT]
> يجب دائماً إلحاق مسار Node المحلي بالـ PATH لتشغيل الأوامر بشكل صحيح:
> `export PATH="/Users/cardscart/.gemini/antigravity/scratch/node/bin:$PATH"`

* **تشغيل سيرفر التطوير:**
  `export PATH="/Users/cardscart/.gemini/antigravity/scratch/node/bin:$PATH" && npm run dev`
* **بناء المشروع للإنتاج:**
  `export PATH="/Users/cardscart/.gemini/antigravity/scratch/node/bin:$PATH" && npm run build`
* **تثبيت مكتبة إضافية:**
  `export PATH="/Users/cardscart/.gemini/antigravity/scratch/node/bin:$PATH" && npm install <package_name>`

## هيكل الملفات الرئيسي

* `src/index.css`: ملف التنسيقات الأساسي (يحتوي على إعدادات الخطوط وتخصيصات Tailwind v4).
* `src/App.jsx`: الملف الرئيسي للتطبيق ولوحة التحكم الرئيسية (Dashboard).
* `src/main.jsx`: نقطة انطلاق التطبيق.
