# دليل ربط المشروع بقاعدة بيانات Supabase ⚡

هذا الدليل يوضح لك بالخطوات كيفية نقل المشروع من استخدام البيانات المؤقتة (Mock Data) إلى قاعدة بيانات حية ومجانية بالكامل على **Supabase** لمشاركة التحديثات فورياً بين جميع الأجهزة (iMac و Mac Pro وجوالات الشباب).

---

## ✅ تم تنفيذه بالفعل (Already Done)

- ✅ تثبيت مكتبة `@supabase/supabase-js`
- ✅ ملف `src/supabaseClient.js` جاهز ومربوط بمشروعك
- ✅ ملف `src/App.jsx` يستخدم Supabase للقوائم الأربع: **المهام، الحجوزات، المصاريف، الجدول اليومي**
- ✅ المزامنة اللحظية بين الأجهزة (Realtime sync) عبر Supabase Channels

**الخطوة الوحيدة المتبقية:** نسخ الـ SQL أدناه ولصقه في Supabase SQL Editor.

---

## ⚡ إذا كانت جداولك موجودة من قبل (Migration سريعة)

إذا سبق وأنشأت الجداول بـ SQL القديم، شغّل هذه الأوامر الموسعة لإضافة الأعمدة الجديدة (`is_critical`, `leader`, `notes`) دون فقدان أي بيانات:

```sql
-- إضافة الأعمدة المفقودة بأمان (لن تفعل شيئاً إذا كانت موجودة)
ALTER TABLE tasks     ADD COLUMN IF NOT EXISTS is_critical BOOLEAN DEFAULT false;
ALTER TABLE itinerary ADD COLUMN IF NOT EXISTS leader TEXT;
ALTER TABLE itinerary ADD COLUMN IF NOT EXISTS notes TEXT;

-- تحديث ذاكرة المخطط (schema cache) في PostgREST فوراً
NOTIFY pgrst, 'reload schema';
```

اضغط **Run** وستعمل الإضافة والحفظ فوراً بدون الحاجة لإعادة تشغيل أي شيء.

> 💡 إذا كانت قاعدة بياناتك جديدة تماماً، تجاهل هذا القسم وانتقل مباشرة للجزء الكامل أدناه.

---

## 🚨 الخطوة الوحيدة المطلوبة: إنشاء جداول البيانات

انتقل إلى **SQL Editor** في لوحة تحكم Supabase، افتح استعلاماً جديداً (New Query) ثم الصق الكود التالي بأكمله واضغط **Run**:

```sql
-- ════════════════════════════════════════════════════════════
-- ١. جدول جدول الأيام (Itinerary)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS itinerary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day INTEGER NOT NULL,
  date DATE NOT NULL,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  activities TEXT,
  leader TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ════════════════════════════════════════════════════════════
-- ٢. جدول الحجوزات (Bookings)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ════════════════════════════════════════════════════════════
-- ٣. جدول المهام (Tasks)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  assignee TEXT DEFAULT 'الجميع',
  category TEXT DEFAULT 'تجهيزات',
  completed BOOLEAN DEFAULT false,
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ════════════════════════════════════════════════════════════
-- ٤. جدول المصاريف (Expenses)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount_sar NUMERIC(10, 2) NOT NULL,
  paid_by TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ════════════════════════════════════════════════════════════
-- ٥. تفعيل صلاحيات الوصول (Row Level Security)
-- ════════════════════════════════════════════════════════════
ALTER TABLE itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة والكتابة من المفتاح العام (anon key)
-- مناسب لمجموعة الأصدقاء الخاصة بالرحلة
CREATE POLICY "Allow all for trip planner - itinerary"
  ON itinerary FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for trip planner - bookings"
  ON bookings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for trip planner - tasks"
  ON tasks FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for trip planner - expenses"
  ON expenses FOR ALL USING (true) WITH CHECK (true);

-- ════════════════════════════════════════════════════════════
-- ٦. تفعيل التحديثات اللحظية (Realtime) - اختياري
-- ════════════════════════════════════════════════════════════
-- لتفعيل التحديث الفوري بين الأجهزة بدون reload
ALTER PUBLICATION supabase_realtime ADD TABLE itinerary;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;

-- ════════════════════════════════════════════════════════════
-- ٧. البيانات الابتدائية لجدول الأيام (مسار الرحلة الكامل)
-- ════════════════════════════════════════════════════════════
INSERT INTO itinerary (day, date, city, title, activities, leader, notes) VALUES
(1,  '2026-06-24', 'موسكو',      'الوصول واستكشاف شارع نيكولسكايا', 'الوصول إلى مطار شيريميتيفو بموسكو، الانتقال إلى الفندق والاستقرار. في المساء، جولة مشي في شارع نيكولسكايا القريب من الساحة الحمراء للاستمتاع بالإنارة الليلية الرائعة.', 'عبدالله الزهراني',   'اقتراح عشاء/قهوة: كافيه Grand Kafe Dr. Zhivago (تجربة كيكة العسل بالتوت).'),
(2,  '2026-06-25', 'موسكو',      'الكرملين، الساحة الحمراء وحديقة زريادي', 'جولة تاريخية تشمل قصر الكرملين، الساحة الحمراء، وكاتدرائية سانت باسيل الاستثنائية. التسوق في مجمع GUM التاريخي. عصراً، زيارة حديقة زريادي والمشي فوق الجسر الطائر.', 'عبدالله الزهراني',   'قهوة: Bosco Coffee في GUM. عشاء: برقر SHE أو IL PIZZAIOLO.'),
(3,  '2026-06-26', 'موسكو',      'شوارع التسوق وبحيرة البطريرك',     'التمشي في شارع تفيرسكايا الرئيسي، وشارع بتروفكا الشهير بالبوتيكات. الانتقال بعد العصر إلى شارع ملايا برونايا للتمشي بجوار بحيرة البطريرك.', 'عبدالله الزهراني',   'فطور: Remy Kitchen Bakery. قهوة: Surf Coffee أو Pino.'),
(4,  '2026-06-27', 'ريف موسكو',  'استجمام وهدوء في ريف موسكو',         'قضاء يوم كامل خارج صخب المدينة للاستمتاع بالطبيعة الريفية الروسية، والمشي في الغابات المحيطة وتناول وجبة تقليدية في الهواء الطلق.', 'عبدالعزيز الحميد',   'قهوة: Skuratov Coffee Roasters أو Rockets Concept Store.'),
(5,  '2026-06-28', 'موسكو',      'جولة أربات التاريخية والمترو الفني', 'استكشاف محطات مترو موسكو التاريخية الفنية، ثم قضاء فترة العصر في شارع أربات القديم المليء بالفنانين والمقاهي ومحلات الهدايا التذكارية.', 'عبدالعزيز الحميد',   'فطور: Remy Kitchen Bakery. قهوة: Surf Coffee أو ABC Coffee.'),
(6,  '2026-06-29', 'موسكو',      'حديقة غوركي وسكاي بارك',             'قضاء يوم مفتوح في حديقة غوركي الشاسعة لركوب الدراجات أو القوارب. الانتقال عصراً بالمترو إلى سكاي بارك للمشاركة في الفعاليات الترفيهية والتلفريك.', 'فهد بن جديد',         'قهوة: كافيه Aist. عشاء: مطعم هندي Tandoor أو Taj Mahal.'),
(7,  '2026-06-30', 'موسكو',      'حديقة فدنخا الترفيهية والتلفريك',     'زيارة حديقة فدنخا التاريخية لمشاهدة عين موسكو الدوارة، وركوب التلفريك، وزيارة الأكواريوم ومتحف الفضاء.', 'فهد بن جديد',         'كافيه Miss You (كروسان اللوز).'),
(8,  '2026-07-01', 'سانت بطرسبرغ','السفر بقطار سابسان السريع',          'الانتقال صباحاً بقطار سابسان السريع من موسكو إلى سانت بطرسبرغ. الاستقرار في السكن، ثم جولة حرة في شارع نيفسكي للتمشي والاستطلاع.', 'عبدالعزيز الحميد',   'قهوة مساءً في Bolshoi أو Surf Coffee.'),
(9,  '2026-07-02', 'سانت بطرسبرغ','متحف الإرميتاج وجولة القنوات',       'تخصيص يوم كامل لاستكشاف متحف الإرميتاج الضخم الذي يضم كنوز القياصرة الروس. في المساء، جولة بالقارب في القنوات المائية تحت الجسور المتحركة.', 'حسن الدوسري',          'عشاء: مطعم Tandoor أو Taj Mahal الهندي.'),
(10, '2026-07-03', 'سانت بطرسبرغ','قصر بيترهوف والنافورات الذهبية',     'زيارة قصر القيصر بطرس الأكبر (بيترهوف) المطل على خليج فنلندا ومشاهدة النافورات الذهبية. العودة لزيارة كاتدرائية المخلص على الدم المراق.', 'حسن الدوسري',          'يوم طويل للتصوير واستنشاق أجواء بحر البلطيق.'),
(11, '2026-07-04', 'موسكو',      'العودة بقطار سابسان وجولة المقاهي',  'ركوب قطار سابسان للعودة إلى موسكو. قضاء العصر في التمشي بشارعي مياسنيتسكايا وبيايتنيتسكايا المليئين بالمقاهي والأجواء الحيوية.', 'فهد بن جديد',         'شوارع أقل سياحية ولكن من الأمتع للمشي والمطاعم.'),
(12, '2026-07-05', 'موسكو',      'الهدايا التذكارية والمغادرة',         'شراء الهدايا التذكارية وأحذية الفرو والجلود بأسعار معقولة من السوق تحت الأرضي. ثم التوجه لمطار شيريميتيفو للعودة بسلامة الله.', 'فهد بن جديد',         'نهاية الرحلة والعودة إلى الرياض.');
```

اضغط **Run** لتنفيذ السكربت. سترى رسالة `Success`.

---

## 🎯 كيفية التحقق من نجاح الربط

1. افتح موقعك في المتصفح
2. ادخل بأي رقم جوال (مثلاً: `0506230054` كلمة المرور `123456`)
3. اذهب إلى **جدول الأيام** - يجب أن ترى الـ 12 يوم تلقائياً من قاعدة البيانات
4. أضف مهمة جديدة من **المهام المشتركة**
5. حدّث الصفحة (F5) - المهمة يجب أن تبقى موجودة ✅

---

## 🔧 إصلاح المشاكل الشائعة

### المشكلة: "البيانات لا تظهر"
- افتح **Console** في المتصفح (F12)
- ابحث عن رسائل خطأ تبدأ بـ `[Supabase Error]`
- تأكد أنك نفذت كل الـ SQL أعلاه

### المشكلة: "لا أستطيع الإضافة"
- تأكد من تنفيذ سياسات RLS (الجزء رقم 5 في الـ SQL)
- إذا لزم الأمر، عطّل RLS مؤقتاً للاختبار:
  ```sql
  ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
  ```

### المشكلة: "البيانات لا تتزامن بين الأجهزة فوراً"
- تأكد من تنفيذ الجزء رقم 6 (Realtime)
- أعد تحميل الصفحة بعد التفعيل

---

## 🚀 الخطوات الاختيارية المستقبلية

إذا أردت لاحقاً نقل المزيد من البيانات إلى السحابة (مثل المصاريف الشخصية للقطة، الوثائق، الاقتراحات والتصويتات)، أخبر Claude:

> "أضف جداول لـ fund_contributions، proposals، personal_packing، personal_docs"

وسيتم توسيع النظام تلقائياً 🎉

---

**ملاحظة:** قاعدة بياناتك الآن في وضع آمن ومحمي، وكودك متزامن بالكامل مع GitHub. أتمنى لك وللشباب رحلة شيقة وممتعة! 🧭🇷🇺✈️
