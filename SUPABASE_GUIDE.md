# دليل ربط المشروع بقاعدة بيانات Supabase ⚡

هذا الدليل يوضح لك بالخطوات كيفية نقل المشروع من استخدام البيانات المؤقتة (Mock Data) إلى قاعدة بيانات حية ومجانية بالكامل على **Supabase** لمشاركة التحديثات فورياً بين جميع الأجهزة (iMac و Mac Pro وجوالات الشباب).

---

## الخطوة 1: إنشاء مشروع جديد في Supabase

1. توجه إلى [Supabase](https://supabase.com) وسجل دخولك (مجاناً).
2. اضغط على **New Project** وحدد اسم المشروع (مثلاً: `Russia Trip Planner`).
3. اختر كلمة مرور قوية لقاعدة البيانات، وحدد الخادم الأقرب لك (مثلاً غرب أوروبا أو سنغافورة).
4. انتظر بضع دقائق حتى يتم تجهيز قاعدة البيانات.

---

## الخطوة 2: إنشاء جداول البيانات (SQL Editor)

انتقل إلى قسم **SQL Editor** في لوحة تحكم Supabase، وافتح استعلاماً جديداً (New Query) ثم الصق الكود التالي لإنشاء الجداول المطلوبة مع العلاقات وصلاحيات الوصول:

```sql
-- 1. جدول المسافرين
CREATE TABLE travelers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  avatar_color TEXT,
  visa_status TEXT,
  flight_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول جدول الأيام (Itinerary)
CREATE TABLE itinerary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day INTEGER NOT NULL,
  date DATE NOT NULL,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  activities TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. جدول الحجوزات (Bookings)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- طيران، سكن، قطار، فعالية
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. جدول المهام (Tasks)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  assignee TEXT DEFAULT 'الجميع',
  category TEXT DEFAULT 'تجهيزات',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. جدول المصاريف (Expenses)
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount_sar NUMERIC(10, 2) NOT NULL,
  paid_by TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إدخال البيانات المبدئية للمسافرين
INSERT INTO travelers (name, role, avatar_color, visa_status, flight_booked) VALUES
('عبدالله الزهراني', 'منظم الرحلة', 'from-emerald-500 to-teal-600', 'مقبول ✅', true),
('عبدالعزيز الحميد', 'المشرف المالي', 'from-amber-500 to-yellow-600', 'قيد المعالجة ⏳', true),
('حسن الدوسري', 'مسؤول الخدمات اللوجستية', 'from-blue-500 to-indigo-600', 'مقبول ✅', false),
('فهد بن جديد', 'منسق الأنشطة والبرامج', 'from-rose-500 to-orange-600', 'لم يقدّم بعد ❌', true);
```

اضغط على **Run** لتنفيذ السكربت وإنشاء جميع الجداول.

---

## الخطوة 3: تثبيت مكتبة Supabase في المشروع

افتح تيرمنال المشروع وشغّل الأمر التالي لتثبيت مكتبة العميل الخاصة بـ Supabase:

```bash
export PATH="/Users/cardscart/.gemini/antigravity/scratch/node/bin:$PATH"
npm install @supabase/supabase-js
```

---

## الخطوة 4: إعداد ملف العميل والربط برياكت

1. قم بإنشاء ملف جديد باسم `src/supabaseClient.js` وضع فيه الكود التالي:

```javascript
import { createClient } from '@supabase/supabase-js'

// استبدل هذه القيم بروابط مشروعك الخاصة من إعدادات Supabase (Settings -> API)
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

2. قم بتحديث ملف `src/App.jsx` ليقوم بجلب البيانات وحفظها من قاعدة البيانات الحية. إليك مثال لكيفية جلب وحفظ المهام (Tasks):

```javascript
// استيراد العميل في أعلى App.jsx
import { supabase } from './supabaseClient';
import { useEffect } from 'react';

// داخل مكون App الرئيسي:
useEffect(() => {
  // جلب المهام عند تحميل التطبيق
  async function fetchTasks() {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
    if (data) setTasks(data);
  }
  fetchTasks();
}, []);

// عند إضافة مهمة جديدة:
const handleAddTask = async (e) => {
  e.preventDefault();
  if (!newTask.title.trim()) return;
  
  const tempTask = {
    title: newTask.title,
    assignee: newTask.assignee,
    category: newTask.category,
    completed: false
  };

  const { data, error } = await supabase.from('tasks').insert([tempTask]).select();
  if (data) {
    setTasks(prev => [...prev, data[0]]);
  }
  setNewTask({ title: '', assignee: 'الجميع', category: 'تجهيزات' });
};

// عند تعديل حالة المهمة (مكتملة/غير مكتملة):
const toggleTask = async (id, currentStatus) => {
  const { error } = await supabase
    .from('tasks')
    .update({ completed: !currentStatus })
    .eq('id', id);

  if (!error) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }
};

// عند حذف مهمة:
const deleteTask = async (id) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (!error) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }
};
```

باتباعك لهذه الخطوات البسيطة، سيعمل موقع الرحلة الصيفية بالكامل بشكل متزامن وتلقائي وآمن بين جميع أجهزة شباب الرحلة! ✈️🇷🇺
