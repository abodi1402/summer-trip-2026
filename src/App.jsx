import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  CreditCard, 
  MapPin, 
  Users, 
  Plane, 
  Hotel, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Info,
  ChevronLeft,
  Award,
  User,
  ShieldAlert,
  Briefcase,
  MessageSquare,
  Send,
  Lock,
  Unlock,
  LogOut,
  Phone,
  EyeOff,
  Compass,
  Map,
  Sparkles,
  Menu,
  X,
  Settings,
  Bell,
  Share2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Megaphone,
  AlertTriangle,
  Globe,
  Home,
  LayoutDashboard,
  Shield,
  Bot,
  Zap,
  LockKeyhole,
  CheckCircle,
  Trash,
  Coins,
  Percent,
  UserCheck,
  Crown,
  Upload,
  Eye,
  Vote,
  Edit,
  Edit3
} from 'lucide-react';
import russiaHero from './assets/russia_hero.png';
import { supabase } from './supabaseClient';
import './App.css';

// ─── Supabase ⇄ JS data mappers (snake_case ↔ camelCase) ───
const mapTaskFromDb = (r) => ({ id: r.id, title: r.title, assignee: r.assignee, category: r.category, completed: r.completed, isCritical: r.is_critical });
const mapTaskToDb = (t) => ({ title: t.title, assignee: t.assignee, category: t.category, completed: !!t.completed, is_critical: !!t.isCritical });

const mapBookingFromDb = (r) => ({ id: r.id, type: r.type, title: r.title, status: r.status, details: r.details });
const mapBookingToDb = (b) => ({ type: b.type, title: b.title, status: b.status, details: b.details });

const mapExpenseFromDb = (r) => ({ id: r.id, description: r.description, amountSar: Number(r.amount_sar), paidBy: r.paid_by, date: r.date });
const mapExpenseToDb = (e) => ({ description: e.description, amount_sar: Number(e.amountSar), paid_by: e.paidBy, date: e.date });

const mapItineraryFromDb = (r) => ({ id: r.id, day: r.day, date: r.date, city: r.city, title: r.title, activities: r.activities, leader: r.leader, notes: r.notes || '', places: Array.isArray(r.places) ? r.places : [] });
const mapItineraryToDb = (i) => ({ day: i.day, date: i.date, city: i.city, title: i.title, activities: i.activities, leader: i.leader, notes: i.notes || '', places: Array.isArray(i.places) ? i.places : [] });

const DEFAULT_PASSWORD = '123456';

// ─── Casual, per-person welcome lines ─────
// Picked by phone number to keep the data structure simple. Each entry returns
// an array of variations — the modal picks one at random for variety on each login.
const WELCOME_LINES = {
  '0506230054': [ // عبدالله — منظم الرحلة
    { headline: 'حيّ الله أبو الشباب 👑', sub: 'قائدنا الكبير ومنظم الرحلة وصل، صار كل شي على بعضه.' },
    { headline: 'هلا والله بقائدنا عبدالله 🧭', sub: 'الرحلة ما تمشي إلا بحضورك، حياك الله بين أصحابك.' },
    { headline: 'يا هلا بأبو الفكرة عبدالله ✨', sub: 'منظم الرحلة دخل، خلونا نبدأ التنسيق.' },
  ],
  '0555255181': [ // عبدالعزيز — المشرف المالي
    { headline: 'حياك الله يا حامي القطة 💰', sub: 'محاسبنا المعتمد عبدالعزيز وصل، الفلوس بأمان.' },
    { headline: 'هلا بأبو الحسابات 🧾', sub: 'وزير المالية حضر، خلونا نشوف الميزانية على آخرها.' },
    { headline: 'حياك يا عبدالعزيز ⚖️', sub: 'كل ريال محسوب من يوم تدخل، ما يضيع شي.' },
  ],
  '0599967664': [ // حسن — الخدمات اللوجستية
    { headline: 'أرررحب ألف ومليون يا حسن 🎉', sub: 'مسؤول اللوجستيك حضر، الرحلة صارت أخف على القلب.' },
    { headline: 'يا هلا بأبو الخطط 🗺️', sub: 'حسن دخل، الترتيبات والمواعيد كلها بإيد أمينة.' },
    { headline: 'حياك ألف يا حسن الدوسري 🛬', sub: 'منسق الترحال بيننا حاضر، خلونا نرتب الجولات.' },
  ],
  '0590099919': [ // فهد — منسق الأنشطة
    { headline: 'يا هلا بأبو الأجواء 🎯', sub: 'منسق الأنشطة فهد دخل، الفعاليات راح تنشط من الحين.' },
    { headline: 'حياك يا فهد بن جديد 🎟️', sub: 'مسؤول البرامج والترفيه وصل، الرحلة بتصير حماس.' },
    { headline: 'أهلين أهلين بفهد ⭐', sub: 'منسقنا للأنشطة حاضر، استعد لجدول مليان متعة.' },
  ],
};

const getWelcomeLine = (user) => {
  const lines = WELCOME_LINES[user.phone] || [
    { headline: `أهلاً وسهلاً يا ${user.name} 👋`, sub: 'حياك الله بين أصحابك في مخطط الرحلة.' }
  ];
  return lines[Math.floor(Math.random() * lines.length)];
};

// Russian-themed logo: St Basil's onion domes inside a circle, with a Russian flag accent.
function ShaddadLogo({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A3F7E" />
          <stop offset="100%" stopColor="#1B2D64" />
        </linearGradient>
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="#FAF7F2" stroke="#2A3F7E" strokeWidth="2" />

      {/* Russian flag stripes inside circle, as a soft background */}
      <g clipPath="url(#circleClip)" opacity="0.08">
        <rect x="0" y="4"  width="100" height="32" fill="#FFFFFF" />
        <rect x="0" y="36" width="100" height="30" fill="#2A3F7E" />
        <rect x="0" y="66" width="100" height="32" fill="#D52B1E" />
      </g>

      {/* Center onion dome (St Basil's silhouette) */}
      <g fill="url(#navyGrad)">
        {/* Center dome */}
        <path d="M50 22 C55 30, 60 38, 50 50 C40 38, 45 30, 50 22 Z" />
        <rect x="48" y="50" width="4" height="18" />
        <line x1="50" y1="22" x2="50" y2="14" stroke="#2A3F7E" strokeWidth="1.5" />
        <circle cx="50" cy="13" r="1.8" fill="#D52B1E" />

        {/* Left dome */}
        <path d="M32 36 C36 42, 40 47, 32 56 C25 47, 29 42, 32 36 Z" />
        <rect x="30" y="56" width="4" height="12" />
        <line x1="32" y1="36" x2="32" y2="30" stroke="#2A3F7E" strokeWidth="1" />
        <circle cx="32" cy="29.5" r="1.2" fill="#D52B1E" />

        {/* Right dome */}
        <path d="M68 36 C72 42, 76 47, 68 56 C61 47, 65 42, 68 36 Z" />
        <rect x="66" y="56" width="4" height="12" />
        <line x1="68" y1="36" x2="68" y2="30" stroke="#2A3F7E" strokeWidth="1" />
        <circle cx="68" cy="29.5" r="1.2" fill="#D52B1E" />

        {/* Cathedral base wall */}
        <rect x="22" y="68" width="56" height="4" />
        <rect x="22" y="72" width="56" height="8" fill="#2A3F7E" opacity="0.85" />

        {/* Small arched windows in the base */}
        <path d="M28 80 L28 75 C28 72, 32 72, 32 75 L32 80 Z" fill="#FAF7F2" />
        <path d="M46 80 L46 74 C46 71, 54 71, 54 74 L54 80 Z" fill="#FAF7F2" />
        <path d="M68 80 L68 75 C68 72, 72 72, 72 75 L72 80 Z" fill="#FAF7F2" />
      </g>
    </svg>
  );
}

const TRAVEL_QUOTES = [
  "السفر ليس مجرد رحلة إلى أماكن جديدة، بل هو رحلة لاكتشاف الذات.",
  "العالم كتاب، ومن لا يسافر لا يقرأ منه سوى صفحة واحدة.",
  "الذكريات التي نصنعها مع الأصدقاء هي أثمن ما نحمله في حقائبنا."
];

// Predefined travelers data (Exempt from Visa)
const INITIAL_TRAVELERS = [
  { id: '1', name: 'عبدالله الزهراني', role: 'منظم الرحلة', phone: '0506230054', avatarColor: 'from-[#2A3F7E] to-[#4A6BB5]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: true, password: '123456' },
  { id: '2', name: 'عبدالعزيز الحميد', role: 'المشرف المالي', phone: '0555255181', avatarColor: 'from-[#2A3F7E] to-[#D8D0C5]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: true, password: '123456' },
  { id: '3', name: 'حسن الدوسري', role: 'مسؤول الخدمات اللوجستية', phone: '0599967664', avatarColor: 'from-[#2A3F7E] to-[#b8b0a5]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: false, password: '123456' },
  { id: '4', name: 'فهد بن جديد', role: 'منسق الأنشطة والبرامج', phone: '0590099919', avatarColor: 'from-[#2A3F7E] to-[#2A3F7E]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: true, password: '123456' },
];

// ─── 4 + 4 + 4 trip structure ───
// First Moscow block (days 1-4): city + countryside on day 4
// Saint Petersburg block (days 5-8): train transfer + 3 days
// Second Moscow block (days 9-12): return + new exploration + departure
const INITIAL_ITINERARY = [
  // ─── Moscow Block 1 (Days 1-4) ───
  { id: 'd1',  day: 1,  date: '2026-06-24', city: 'موسكو',     title: 'الوصول واستكشاف شارع نيكولسكايا',          activities: 'الوصول إلى مطار شيريميتيفو، الانتقال إلى الفندق والاستقرار. في المساء، جولة مشي في شارع نيكولسكايا (Nikolskaya Street) القريب من الساحة الحمراء للاستمتاع بالإنارة الليلية.',                                                                       notes: 'عشاء/قهوة: كافيه Grand Kafe Dr. Zhivago (كيكة العسل بالتوت - يحتاج حجز).',                                                       leader: 'عبدالله الزهراني' },
  { id: 'd2',  day: 2,  date: '2026-06-25', city: 'موسكو',     title: 'الكرملين، الساحة الحمراء وحديقة زريادي',     activities: 'جولة تاريخية في قصر الكرملين، الساحة الحمراء، وكاتدرائية سانت باسيل. تسوق في مجمع GUM. عصراً زيارة حديقة زريادي (Zaryadye Park) والجسر الطائر بإطلالة على نهر موسكفا.',                                              notes: 'قهوة: Bosco Coffee في GUM. عشاء: برقر SHE أو IL PIZZAIOLO.',                                                                     leader: 'عبدالله الزهراني' },
  { id: 'd3',  day: 3,  date: '2026-06-26', city: 'موسكو',     title: 'شوارع التسوق وبحيرة البطريرك',                 activities: 'التمشي في شارع تفيرسكايا (Tverskaya) الرئيسي، وشارع بتروفكا (Petrovka) للبوتيكات. عصراً شارع ملايا برونايا (Malaya Bronnaya) الهادئ بجوار بحيرة البطريرك (Patriarch Ponds).',                                            notes: 'فطور: Remy Kitchen Bakery. قهوة: Surf Coffee أو Pino.',                                                                          leader: 'عبدالله الزهراني' },
  { id: 'd4',  day: 4,  date: '2026-06-27', city: 'ريف موسكو', title: 'يوم استجمام في ريف موسكو الطبيعي',             activities: 'يوم كامل خارج صخب المدينة في الطبيعة الريفية الروسية: غابات، مشي طويل، وجبة تقليدية في الهواء الطلق. تجهيز للسفر إلى سانت بطرسبرغ مساءً.',                                                                                     notes: 'يفضل تجهيز الحقائب الصغيرة لرحلة القطار الصباحية يوم 5.',                                                                       leader: 'عبدالعزيز الحميد' },

  // ─── Saint Petersburg Block (Days 5-8) ───
  { id: 'd5',  day: 5,  date: '2026-06-28', city: 'سانت بطرسبرغ', title: 'قطار سابسان السريع + جولة نيفسكي',            activities: 'الانتقال صباحاً بقطار سابسان (Sapsan) من موسكو إلى العاصمة الثقافية سانت بطرسبرغ. الاستقرار في السكن. مساءً جولة حرة في شارع نيفسكي (Nevsky Prospekt) للتمشي والقنوات المائية.',                                  notes: 'قهوة مساءً: كافيه Bolshoi أو Surf Coffee.',                                                                                      leader: 'عبدالعزيز الحميد' },
  { id: 'd6',  day: 6,  date: '2026-06-29', city: 'سانت بطرسبرغ', title: 'متحف الإرميتاج العريق وجولة القنوات',         activities: 'يوم كامل في متحف الإرميتاج (Hermitage Museum) لاستكشاف كنوز القياصرة. مساءً جولة بالقارب في القنوات المائية تحت الجسور المتحركة.',                                                                                                 notes: 'عشاء: مطعم Tandoor أو Taj Mahal الهندي.',                                                                                        leader: 'حسن الدوسري' },
  { id: 'd7',  day: 7,  date: '2026-06-30', city: 'سانت بطرسبرغ', title: 'قصر بيترهوف والنافورات الذهبية',              activities: 'زيارة قصر القيصر بطرس الأكبر (Peterhof Palace) المطل على خليج فنلندا ومشاهدة النافورات الذهبية. العودة لزيارة كاتدرائية المخلص على الدم المراق (Savior on Spilled Blood).',                                              notes: 'يوم طويل للتصوير واستنشاق أجواء بحر البلطيق.',                                                                                   leader: 'حسن الدوسري' },
  { id: 'd8',  day: 8,  date: '2026-07-01', city: 'سانت بطرسبرغ', title: 'قصر كاترين وسوق التحف + قطار العودة',         activities: 'زيارة قصر كاترين الذهبي (Catherine Palace) في بوشكين، وسوق التحف للهدايا التذكارية. مساءً ركوب قطار سابسان للعودة إلى موسكو.',                                                                                       notes: 'تجهيز الحقائب الكبيرة قبل الانطلاق - فندق موسكو الجديد يستقبلكم ليلاً.',                                                       leader: 'حسن الدوسري' },

  // ─── Moscow Block 2 (Days 9-12) ───
  { id: 'd9',  day: 9,  date: '2026-07-02', city: 'موسكو',     title: 'شوارع المقاهي المزدحمة',                       activities: 'تمشي طويل في شارعي مياسنيتسكايا (Myasnitskaya) وبيايتنيتسكايا (Pyatnitskaya) المليئين بالمقاهي والأجواء الحيوية الشبابية.',                                                                                                 notes: 'أقل سياحية لكن من الأمتع للمشي والمطاعم.',                                                                                        leader: 'فهد بن جديد' },
  { id: 'd10', day: 10, date: '2026-07-03', city: 'موسكو',     title: 'جولة أربات التاريخية والمترو الفني',           activities: 'استكشاف محطات مترو موسكو التاريخية الفنية. عصراً المشي في شارع أربات القديم (Old Arbat) المليء بالفنانين والمقاهي. مقارنته بشارع أربات الجديد.',                                                                          notes: 'فطور: Remy Kitchen Bakery. قهوة: Surf Coffee أو ABC Coffee.',                                                                   leader: 'فهد بن جديد' },
  { id: 'd11', day: 11, date: '2026-07-04', city: 'موسكو',     title: 'حديقة غوركي وحديقة فدنخا',                     activities: 'صباحاً حديقة غوركي (Gorky Park) لركوب الدراجات والقوارب. عصراً حديقة فدنخا (VDNKh) لعين موسكو الدوارة، التلفريك، الأكواريوم، ومتحف الفضاء.',                                                                              notes: 'قهوة: كافيه Aist. عشاء: Tandoor أو Taj Mahal الهندي.',                                                                          leader: 'فهد بن جديد' },
  { id: 'd12', day: 12, date: '2026-07-05', city: 'موسكو',     title: 'الهدايا التذكارية والمغادرة للوطن',            activities: 'شراء الهدايا التذكارية وأحذية الفرو من السوق تحت الأرضي بجوار الساحة الحمراء، ثم تسجيل الخروج والتوجه لمطار شيريميتيفو للعودة بسلامة الله.',                                                                            notes: 'نهاية الرحلة والعودة إلى الرياض.',                                                                                                leader: 'فهد بن جديد' }
];

// Packing checklist defaults per traveler
const DEFAULT_PACKING_ITEMS = [
  { id: 'pi1', title: 'شاحن سفري (Powerbank)', checked: false, category: 'إلكترونيات' },
  { id: 'pi2', title: 'شاحن جداري متعدد المداخل', checked: false, category: 'إلكترونيات' },
  { id: 'pi3', title: 'كابلات شحن إضافية', checked: false, category: 'إلكترونيات' },
  { id: 'pi4', title: 'فيش تحويل أفياش روسيا (Type C/F)', checked: false, category: 'إلكترونيات' },
  { id: 'pi5', title: 'فرشاة ومعجون أسنان', checked: false, category: 'عناية شخصية' },
  { id: 'pi6', title: 'مزيل عرق وعطور', checked: false, category: 'عناية شخصية' },
  { id: 'pi7', title: 'أدوات الحلاقة والنظافة الشخصية', checked: false, category: 'عناية شخصية' },
  { id: 'pi8', title: 'مرطب شفاه وكريم شمس', checked: false, category: 'عناية شخصية' },
  { id: 'pi9', title: 'ملابس صيفية خفيفة', checked: false, category: 'ملابس ومستلزمات' },
  { id: 'pi10', title: 'جاكيت خفيف أو هودي (للأجواء الباردة ليلاً)', checked: false, category: 'ملابس ومستلزمات' },
  { id: 'pi11', title: 'حذاء مريح جداً للمشي الطويل', checked: false, category: 'ملابس ومستلزمات' },
  { id: 'pi12', title: 'نظارة شمسية ومظلة للمطر', checked: false, category: 'ملابس ومستلزمات' },
  { id: 'pi13', title: 'شنطة كتف صغيرة لحمل الاحتياجات اليومية', checked: false, category: 'ملابس ومستلزمات' },
  { id: 'pi14', title: 'جواز السفر وتذاكر الطيران المطبوعة', checked: false, category: 'وثائق وأموال' },
  { id: 'pi15', title: 'مبالغ كاش بالروبل الروسي أو الدولار', checked: false, category: 'وثائق وأموال' },
  { id: 'pi16', title: 'بطاقات الدفع والائتمان المفعلة دولياً', checked: false, category: 'وثائق وأموال' },
];

const DEFAULT_DOCUMENTS = [
  { id: 'doc1', title: 'جواز السفر الأصلي (ساري لأكثر من 6 أشهر)', status: 'لم يكتمل', requiredFor: 'الحدود والمطارات', fileData: null, fileName: null },
  { id: 'doc3', title: 'وثيقة التأمين الطبي الدولي للسفر', status: 'لم يكتمل', requiredFor: 'التغطية الصحية بالسفر', fileData: null, fileName: null },
  { id: 'doc4', title: 'قسائم حجوزات الطيران والفنادق (مطبوعة)', status: 'لم يكتمل', requiredFor: 'الجمارك الروسية', fileData: null, fileName: null },
  { id: 'doc5', title: 'بطاقة الهجرة الروسية (تتعبأ عند الوصول بالمطار)', status: 'تعبئة بالمطار', requiredFor: 'تسجيل الإقامة الروسي', fileData: null, fileName: null },
];


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  // Pinned welcome line — chosen once when modal opens, stays put across re-renders
  const [welcomeLine, setWelcomeLine] = useState(null);
  const [loginPhoneInput, setLoginPhoneInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Password change states for first-time login
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [tempTravelerForPasswordChange, setTempTravelerForPasswordChange] = useState(null);
  
  // Authenticated User State
  const [currentUser, setCurrentUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [travelers, setTravelers] = useState(INITIAL_TRAVELERS);

  // SaaS States & Customizations
  const [isTripPlanLocked, setIsTripPlanLocked] = useState(false);
  const [broadcastAlert, setBroadcastAlert] = useState(null);
  const [simulatedActiveDay, setSimulatedActiveDay] = useState(0);
  const [leaderChecklistState, setLeaderChecklistState] = useState({});
  
  // Editable Trip Start and End Dates
  const [tripStartDate, setTripStartDate] = useState('2026-06-24');
  const [tripEndDate, setTripEndDate] = useState('2026-07-05');

  // Dynamic Date Calculator Helper
  const getDateForDay = (startDate, dayNum) => {
    try {
      const start = new Date(startDate);
      start.setDate(start.getDate() + (dayNum - 1));
      return start.toISOString().split('T')[0];
    } catch (e) {
      return startDate;
    }
  };

  const isDocExpiringSoon = (expiryDateStr) => {
    if (!expiryDateStr) return false;
    try {
      const expiry = new Date(expiryDateStr);
      const start = new Date(tripStartDate);
      const diffTime = expiry.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays < 180; // less than 6 months (180 days)
    } catch (e) {
      return false;
    }
  };

  // Fund Contribution State ("القطة والمالية")
  const [fundContributions, setFundContributions] = useState([
    { id: '1', name: 'عبدالله الزهراني', target: 0, paid: 0 },
    { id: '2', name: 'عبدالعزيز الحميد', target: 0, paid: 0 },
    { id: '3', name: 'حسن الدوسري', target: 0, paid: 0 },
    { id: '4', name: 'فهد بن جديد', target: 0, paid: 0 },
  ]);
  const [reserveFund, setReserveFund] = useState(0); // Mabalgh Ehteyateyah

  // Proposals & Voting Board State
  const [proposals, setProposals] = useState([]);

  const [pricingPlan, setPricingPlan] = useState('pro'); // Unlocked by default for friend group
  const [currencyRates, setCurrencyRates] = useState({ rub: 24.5, usd: 0.27 });
  const [multiOptionPolls, setMultiOptionPolls] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalTrips: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activePremiumTrips: 0
  });

  const [marketingBanners, setMarketingBanners] = useState([]);
  const [dismissedBanners, setDismissedBanners] = useState([]);

  // States for personal data (private per traveler ID)
  const [personalPacking, setPersonalPacking] = useState(() => {
    const lists = {};
    INITIAL_TRAVELERS.forEach(t => {
      lists[t.id] = [...DEFAULT_PACKING_ITEMS];
    });
    return lists;
  });

  const [personalDocs, setPersonalDocs] = useState(() => {
    const docs = {};
    INITIAL_TRAVELERS.forEach(t => {
      docs[t.id] = [...DEFAULT_DOCUMENTS];
    });
    return docs;
  });

  const [itinerary, setItinerary] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [dataLoadError, setDataLoadError] = useState(null);

  // Lightweight toast — used to confirm add/save actions so the user doesn't
  // have to hunt for the newly added item in long mobile lists.
  const [toast, setToast] = useState(null); // { message: string, kind: 'success' | 'error' }
  const showToast = (message, kind = 'success') => {
    setToast({ message, kind });
    setTimeout(() => setToast(t => (t && t.message === message ? null : t)), 2800);
  };

  // ─── Fetch all shared trip data from Supabase on mount ───
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [itineraryRes, bookingsRes, tasksRes, expensesRes, passwordsRes] = await Promise.all([
          supabase.from('itinerary').select('*').order('day', { ascending: true }),
          supabase.from('bookings').select('*').order('created_at', { ascending: true }),
          supabase.from('tasks').select('*').order('created_at', { ascending: true }),
          supabase.from('expenses').select('*').order('created_at', { ascending: true }),
          supabase.from('traveler_passwords').select('*'),
        ]);
        if (cancelled) return;

        // Merge stored passwords into travelers (so cross-device login works)
        if (passwordsRes.data && passwordsRes.data.length > 0) {
          setTravelers(prev => prev.map(t => {
            const stored = passwordsRes.data.find(p => p.phone === t.phone);
            return stored ? { ...t, password: stored.password } : t;
          }));
        }

        const firstErr = [itineraryRes, bookingsRes, tasksRes, expensesRes].find(r => r.error);
        if (firstErr) {
          console.error('[Supabase Error]', firstErr.error.message);
          setDataLoadError('قاعدة البيانات غير مهيأة بعد. الرجاء تنفيذ ملف SUPABASE_GUIDE.md في Supabase SQL Editor.');
        }

        // Fallback to local seed data if itinerary table is empty (first run before SQL was executed)
        const itineraryData = (itineraryRes.data && itineraryRes.data.length > 0)
          ? itineraryRes.data.map(mapItineraryFromDb)
          : INITIAL_ITINERARY;

        setItinerary(itineraryData);
        setBookings((bookingsRes.data || []).map(mapBookingFromDb));
        setTasks((tasksRes.data || []).map(mapTaskFromDb));
        setExpenses((expensesRes.data || []).map(mapExpenseFromDb));
      } catch (err) {
        console.error('[Supabase Fatal] failed to load trip data:', err);
        if (!cancelled) {
          setItinerary(INITIAL_ITINERARY);
          setDataLoadError('تعذّر الاتصال بقاعدة البيانات. تحقق من الإنترنت أو إعدادات Supabase.');
        }
      }
    }
    fetchAll();

    // ─── Realtime sync: live updates between devices ───
    const channel = supabase
      .channel('trip-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.eventType === 'INSERT')  setTasks(p => p.some(x => x.id === payload.new.id) ? p : [...p, mapTaskFromDb(payload.new)]);
        if (payload.eventType === 'UPDATE')  setTasks(p => p.map(x => x.id === payload.new.id ? mapTaskFromDb(payload.new) : x));
        if (payload.eventType === 'DELETE')  setTasks(p => p.filter(x => x.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
        if (payload.eventType === 'INSERT')  setBookings(p => p.some(x => x.id === payload.new.id) ? p : [...p, mapBookingFromDb(payload.new)]);
        if (payload.eventType === 'UPDATE')  setBookings(p => p.map(x => x.id === payload.new.id ? mapBookingFromDb(payload.new) : x));
        if (payload.eventType === 'DELETE')  setBookings(p => p.filter(x => x.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, (payload) => {
        if (payload.eventType === 'INSERT')  setExpenses(p => p.some(x => x.id === payload.new.id) ? p : [...p, mapExpenseFromDb(payload.new)]);
        if (payload.eventType === 'UPDATE')  setExpenses(p => p.map(x => x.id === payload.new.id ? mapExpenseFromDb(payload.new) : x));
        if (payload.eventType === 'DELETE')  setExpenses(p => p.filter(x => x.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'itinerary' }, (payload) => {
        if (payload.eventType === 'INSERT')  setItinerary(p => (p.some(x => x.id === payload.new.id) ? p : [...p, mapItineraryFromDb(payload.new)]).sort((a, b) => a.day - b.day));
        if (payload.eventType === 'UPDATE')  setItinerary(p => p.map(x => x.id === payload.new.id ? mapItineraryFromDb(payload.new) : x).sort((a, b) => a.day - b.day));
        if (payload.eventType === 'DELETE')  setItinerary(p => p.filter(x => x.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // Form States
  const [newActivity, setNewActivity] = useState({ day: 1, city: 'موسكو', title: '', activities: '', leader: 'عبدالله الزهراني' });
  const [newBooking, setNewBooking] = useState({ type: 'طيران', title: '', status: 'مستهدف', details: '' });
  const [newTask, setNewTask] = useState({ title: '', assignee: 'الجميع', category: 'تجهيزات', isCritical: false });
  const [newExpense, setNewExpense] = useState({ description: '', amountSar: '', paidBy: 'الصندوق' });
  const [newPersonalItem, setNewPersonalItem] = useState({ title: '', category: 'إلكترونيات' });
  const [calcAmountSar, setCalcAmountSar] = useState('100');
  const [calcAmountRub, setCalcAmountRub] = useState('1000');

  // Proposal Form State
  const [newProposal, setNewProposal] = useState({ title: '', description: '', sendAlert: false });

  // Inline editing states
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editActivityData, setEditActivityData] = useState({ day: 1, city: 'موسكو', title: '', activities: '', leader: 'عبدالله الزهراني', notes: '' });

  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editBookingData, setEditBookingData] = useState({ type: 'طيران', title: '', status: 'مستهدف', details: '' });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({ title: '', assignee: 'الجميع', category: 'تجهيزات', isCritical: false });

  // Document Modal Preview State
  const [selectedDocForView, setSelectedDocForView] = useState(null);

  // Filter States
  const [itineraryCityFilter, setItineraryCityFilter] = useState('الكل');

  // Telegram Mockup Webhook State
  const [telegramMockOpen, setTelegramMockOpen] = useState(false);
  const [telegramMockContent, setTelegramMockContent] = useState('');

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
  
  // Lock background scroll when any blocking modal is open (welcome / mobile menu)
  useEffect(() => {
    const shouldLock = showWelcome || isMobileMenuOpen;
    if (shouldLock) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showWelcome, isMobileMenuOpen]);

  useEffect(() => {
    const targetDate = new Date(`${tripStartDate}T08:00:00`).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [tripStartDate]);

  useEffect(() => {
    setMarketingBanners(prev => prev.map(banner => {
      if (banner.isActive && !dismissedBanners.includes(banner.id)) {
        return { ...banner, views: banner.views + 1 };
      }
      return banner;
    }));
  }, [activeTab, dismissedBanners]);

  const getLeaderRoleAndChecklist = (leaderName) => {
    switch (leaderName) {
      case 'عبدالله الزهراني':
        return {
          role: 'المشرف المالي للرحلة (Finance Leader)',
          themeClass: 'bg-amber-50/70 border-amber-200 text-amber-950',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          tasks: [
            'جمع الفواتير والإيصالات اليومية للمطاعم والأنشطة.',
            'تحديث الصندوق والقطة المشتركة وتسجيل المصروفات الحالية.',
            'مراجعة العلاقات المالية وتأكيد التسويات السريعة للديون الشخصية.',
            'مطابقة الكاش المتبقي في الصندوق مع الميزانية في التطبيق.'
          ]
        };
      case 'عبدالعزيز الحميد':
        return {
          role: 'مسؤول الملاحة والتوجيه (Navigation Leader)',
          themeClass: 'bg-blue-50/70 border-blue-200 text-blue-950',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          tasks: [
            'التأكد من تحميل خرائط Yandex Maps أوفلاين لموسكو/سان بطرسبرغ.',
            'التنسيق مع السائقين أو وسائل النقل العام ومطابقة إحداثيات السكن.',
            'التحقق من صلاحية بطاقات المترو لجميع أعضاء الرحلة.',
            'مراجعة حالة المرور والطقس لتفادي الازدحام المروري الصباحي.'
          ]
        };
      case 'حسن الدوسري':
        return {
          role: 'منسق الأنشطة والترجمة (Activities Coordinator)',
          themeClass: 'bg-purple-50/70 border-purple-200 text-purple-950',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
          tasks: [
            'مراجعة وحفظ تذاكر الدخول للمتاحف والفعاليات المحجوزة اليوم.',
            'تشغيل برنامج المترجم والـ VPN والاتصال بالمنظمين المحليين.',
            'تنبيه الأعضاء بقواعد المظهر والسلوك في المواقع التاريخية.',
            'رصد الأنشطة الجانبية الاختيارية وتعديل جدول التوقيت عند الحاجة.'
          ]
        };
      case 'فهد بن جديد':
        return {
          role: 'مشرف الإعاشة والخدمات اللوجستية (Logistics Leader)',
          themeClass: 'bg-rose-50/70 border-rose-200 text-rose-950',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          tasks: [
            'حجز المطاعم المقترحة لليوم وتأكيد مواعيد الغداء والعشاء.',
            'متابعة تفاصيل تسجيل الخروج/الدخول وحمل الحقائب لقروب الرحلة.',
            'تأمين مياه الشرب والمأكولات الخفيفة المخصصة للمسافات الطويلة.',
            'فحص حقيبة الإسعافات الأولية والتأكد من الاحتياجات الصحية للمسافرين.'
          ]
        };
      default:
        return {
          role: 'قائد اليوم العام (General Leader)',
          themeClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          tasks: [
            'متابعة سير الرحلة وضمان التزام الجميع بالجدول الزمني العام.',
            'التحقق من سلامة وصلاحية وثائق السفر لأعضاء الرحلة.',
            'التأكد من رضا وسعادة المسافرين وحل أي إشكاليات طارئة.',
            'التواصل مع المنظم الرئيسي للرحلة عند حدوث أي طوارئ.'
          ]
        };
    }
  };

  // Login handler with password check (always re-checks Supabase for latest password)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = loginPhoneInput.trim();
    const cleanPassword = loginPasswordInput.trim();

    const targetTraveler = travelers.find(t => t.phone === cleanPhone);
    if (!targetTraveler) {
      setLoginError('عذراً، رقم الجوال المدخل غير مطابق لأي مسافر مسجل. حاول مرة أخرى.');
      return;
    }

    // Always read the latest password from Supabase (in case it was changed on another device)
    let travelerPassword = targetTraveler.password || DEFAULT_PASSWORD;
    try {
      const { data: pwRow } = await supabase
        .from('traveler_passwords')
        .select('password')
        .eq('phone', cleanPhone)
        .maybeSingle();
      if (pwRow && pwRow.password) {
        travelerPassword = pwRow.password;
        // sync into in-memory travelers so later checks see it
        setTravelers(prev => prev.map(t => t.phone === cleanPhone ? { ...t, password: pwRow.password } : t));
      }
    } catch (err) {
      console.warn('[Supabase] could not fetch latest password, falling back to in-memory:', err);
    }

    if (cleanPassword !== travelerPassword) {
      setLoginError('عذراً، كلمة المرور المدخلة غير صحيحة. حاول مرة أخرى.');
      return;
    }

    // Force changing default password only if still on the default
    if (travelerPassword === DEFAULT_PASSWORD) {
      setTempTravelerForPasswordChange(targetTraveler);
      setIsSettingNewPassword(true);
      setLoginError('');
      return;
    }

    const finalUser = { ...targetTraveler, password: travelerPassword };
    setCurrentUser(finalUser);
    setIsLoggedIn(true);
    setWelcomeLine(getWelcomeLine(finalUser));
    setShowWelcome(true);
    setLoginError('');
    setLoginPhoneInput('');
    setLoginPasswordInput('');
    setNewExpense(prev => ({ ...prev, paidBy: 'الصندوق' }));
    setActiveTab('dashboard');
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    const newPass = newPasswordInput.trim();
    const confirmPass = confirmPasswordInput.trim();

    if (!newPass) {
      setLoginError('الرجاء إدخال كلمة مرور صالحة.');
      return;
    }

    if (newPass === DEFAULT_PASSWORD) {
      setLoginError('عذراً، يجب اختيار كلمة مرور مختلفة عن كلمة المرور الافتراضية.');
      return;
    }

    if (newPass !== confirmPass) {
      setLoginError('كلمتا المرور غير متطابقتين. يرجى التأكيد بشكل صحيح.');
      return;
    }

    // Persist to Supabase so the password works on every device
    const { error: pwErr } = await supabase
      .from('traveler_passwords')
      .upsert({ phone: tempTravelerForPasswordChange.phone, password: newPass, updated_at: new Date().toISOString() }, { onConflict: 'phone' });

    if (pwErr) {
      console.error('[Supabase Error] save password:', pwErr.message);
      setLoginError('تعذّر حفظ كلمة المرور في قاعدة البيانات. تأكد من إعداد جدول traveler_passwords.');
      return;
    }

    // Update password in travelers list (in-memory)
    const updatedTravelers = travelers.map(t => {
      if (t.id === tempTravelerForPasswordChange.id) {
        return { ...t, password: newPass };
      }
      return t;
    });
    setTravelers(updatedTravelers);
    
    // Log the user in
    const updatedUser = { ...tempTravelerForPasswordChange, password: newPass };
    setCurrentUser(updatedUser);
    setIsLoggedIn(true);
    setWelcomeLine(getWelcomeLine(updatedUser));
    setShowWelcome(true);
    setIsSettingNewPassword(false);
    setTempTravelerForPasswordChange(null);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setLoginPhoneInput('');
    setLoginPasswordInput('');
    setLoginError('');
    setNewExpense(prev => ({ ...prev, paidBy: 'الصندوق' }));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsSettingNewPassword(false);
    setTempTravelerForPasswordChange(null);
    setLoginPhoneInput('');
    setLoginPasswordInput('');
    setLoginError('');
    setActiveTab('dashboard');
  };

  // Financial Supervisor or Administrator permissions (Abdullah or Abdulaziz)
  const isFinanceSupervisor = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.phone === '0506230054' || currentUser.phone === '0555255181';
  }, [currentUser]);

  // Stats Calculations (Incorporating Fund / Qatta logic)
  const financeStats = useMemo(() => {
    // 1. Calculate Fund Collected (Contributions Paid + Reserve cash)
    const collectedFromMembers = fundContributions.reduce((sum, item) => sum + Number(item.paid), 0);
    const totalFundCollected = collectedFromMembers + reserveFund;

    // 2. Spent from Fund (Expenses paid by 'الصندوق')
    const spentFromFund = expenses
      .filter(e => e.paidBy === 'الصندوق')
      .reduce((sum, e) => sum + Number(e.amountSar), 0);

    const remainingFund = totalFundCollected - spentFromFund;

    // 3. Spent by Members personally (To be settled later)
    const personalExpenses = expenses.filter(e => e.paidBy !== 'الصندوق');
    const totalPersonalSpent = personalExpenses.reduce((sum, e) => sum + Number(e.amountSar), 0);
    const splitSharePerPerson = totalPersonalSpent / 4;

    // Calculate settlement balance per traveler
    const travelerBalances = INITIAL_TRAVELERS.map(t => {
      const personalPaid = personalExpenses
        .filter(e => e.paidBy === t.name)
        .reduce((sum, e) => sum + Number(e.amountSar), 0);
      const balance = personalPaid - splitSharePerPerson;
      return {
        name: t.name,
        paid: personalPaid,
        balance: balance // positive means they should receive, negative means they must pay
      };
    });

    // Calculate category breakdowns
    let housing = 0;
    let transport = 0;
    let food = 0;
    let activities = 0;
    let other = 0;
    
    expenses.forEach(e => {
      const desc = e.description;
      const amt = Number(e.amountSar);
      if (desc.includes('سكن') || desc.includes('شقة') || desc.includes('فندق') || desc.includes('Airbnb') || desc.includes('إقامة')) {
        housing += amt;
      } else if (desc.includes('طيران') || desc.includes('قطار') || desc.includes('تذاكر') || desc.includes('سفر') || desc.includes('سابسان') || desc.includes('رحلة') || desc.includes('تاكسي') || desc.includes('توصيل') || desc.includes('Yandex') || desc.includes('مواصلات')) {
        transport += amt;
      } else if (desc.includes('أكل') || desc.includes('وجبة') || desc.includes('عشاء') || desc.includes('مطعم') || desc.includes('غداء') || desc.includes('كافيه') || desc.includes('قهوة') || desc.includes('فطور')) {
        food += amt;
      } else if (desc.includes('جولة') || desc.includes('متحف') || desc.includes('الكرملين') || desc.includes('تذكرة دخول') || desc.includes('فعالية') || desc.includes('ترفيه') || desc.includes('سياحة')) {
        activities += amt;
      } else {
        other += amt;
      }
    });
    
    const totalSpentAll = spentFromFund + totalPersonalSpent;
    const categoryBreakdown = [
      { name: 'السكن والإقامة', amount: housing, percent: totalSpentAll ? Math.round((housing / totalSpentAll) * 100) : 0, color: 'bg-emerald-600' },
      { name: 'المواصلات والطيران', amount: transport, percent: totalSpentAll ? Math.round((transport / totalSpentAll) * 100) : 0, color: 'bg-blue-500' },
      { name: 'الوجبات والمطاعم', amount: food, percent: totalSpentAll ? Math.round((food / totalSpentAll) * 100) : 0, color: 'bg-amber-500' },
      { name: 'الأنشطة والجولات والسياحة', amount: activities, percent: totalSpentAll ? Math.round((activities / totalSpentAll) * 100) : 0, color: 'bg-indigo-500' },
      { name: 'مشتريات وطوارئ أخرى', amount: other, percent: totalSpentAll ? Math.round((other / totalSpentAll) * 100) : 0, color: 'bg-gray-400' }
    ];

    // Calculate greedy settlement instructions
    const debtors = [];
    const creditors = [];
    
    travelerBalances.forEach(tb => {
      if (tb.balance < -1) {
        debtors.push({ name: tb.name, amount: Math.abs(tb.balance) });
      } else if (tb.balance > 1) {
        creditors.push({ name: tb.name, amount: tb.balance });
      }
    });
    
    const settlementInstructions = [];
    let dIdx = 0;
    let cIdx = 0;
    
    // Copy to avoid mutation in loop
    const debtorsCopy = debtors.map(d => ({ ...d }));
    const creditorsCopy = creditors.map(c => ({ ...c }));
    
    while (dIdx < debtorsCopy.length && cIdx < creditorsCopy.length) {
      const debtor = debtorsCopy[dIdx];
      const creditor = creditorsCopy[cIdx];
      
      const transferAmount = Math.min(debtor.amount, creditor.amount);
      if (transferAmount > 1) {
        settlementInstructions.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(transferAmount)
        });
      }
      
      debtor.amount -= transferAmount;
      creditor.amount -= transferAmount;
      
      if (debtor.amount < 1) dIdx++;
      if (creditor.amount < 1) cIdx++;
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'مؤكد').length;

    let userPackingStats = { totalPacking: 0, packedCount: 0, packingPercent: 0 };
    if (currentUser) {
      const userPacking = personalPacking[currentUser.id] || [];
      const totalPacking = userPacking.length;
      const packedCount = userPacking.filter(item => item.checked).length;
      const packingPercent = totalPacking ? Math.round((packedCount / totalPacking) * 100) : 0;
      userPackingStats = { totalPacking, packedCount, packingPercent };
    }

    return {
      totalFundCollected,
      spentFromFund,
      remainingFund,
      totalPersonalSpent,
      splitSharePerPerson,
      travelerBalances,
      totalTasks,
      completedTasks,
      taskPercent,
      totalBookings,
      confirmedBookings,
      categoryBreakdown,
      settlementInstructions,
      totalSpentAll,
      ...userPackingStats
    };
  }, [fundContributions, reserveFund, expenses, tasks, bookings, personalPacking, currentUser]);

  // Check if current user has edit permission (Not locked OR is Abdullah)
  const canEdit = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.phone === '0506230054') return true;
    return !isTripPlanLocked;
  }, [currentUser, isTripPlanLocked]);

  const overdueTasksCount = useMemo(() => {
    return tasks.filter(t => t.isCritical && !t.completed).length;
  }, [tasks]);

  const criticalOverdueTasksList = useMemo(() => {
    return tasks.filter(t => t.isCritical && !t.completed);
  }, [tasks]);

  const isSuperAdmin = currentUser && currentUser.phone === '0506230054';
  const activeLeaderName = useMemo(() => {
    if (simulatedActiveDay > 0) {
      const activeDayData = itinerary.find(item => item.day === simulatedActiveDay);
      return activeDayData ? activeDayData.leader : null;
    }
    return null;
  }, [simulatedActiveDay, itinerary]);

  // Document Upload Local FileReader Logic
  const handleDocFileUpload = (travelerId, docId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPersonalDocs(prev => {
        const userDocs = prev[travelerId].map(doc => 
          doc.id === docId ? { ...doc, fileData: reader.result, fileName: file.name } : doc
        );
        return { ...prev, [travelerId]: userDocs };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDocFileRemove = (travelerId, docId) => {
    setPersonalDocs(prev => {
      const userDocs = prev[travelerId].map(doc => 
        doc.id === docId ? { ...doc, fileData: null, fileName: null } : doc
      );
      return { ...prev, [travelerId]: userDocs };
    });
  };

  // Actions for personal packing list
  const togglePackingItem = (itemId) => {
    if (!currentUser) return;
    setPersonalPacking(prev => {
      const userList = prev[currentUser.id].map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      return { ...prev, [currentUser.id]: userList };
    });
  };

  const addPersonalPackingItem = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newPersonalItem.title.trim()) {
      showToast('اكتب اسم الغرض قبل الإضافة', 'error');
      return;
    }
    setPersonalPacking(prev => {
      const userList = [
        ...prev[currentUser.id],
        {
          id: `p_${Date.now()}`,
          title: newPersonalItem.title,
          checked: false,
          category: newPersonalItem.category
        }
      ];
      return { ...prev, [currentUser.id]: userList };
    });
    setNewPersonalItem({ title: '', category: 'إلكترونيات' });
    showToast('تمت إضافة الغرض إلى حقيبتك');
  };

  const deletePersonalPackingItem = (itemId) => {
    if (!currentUser) return;
    setPersonalPacking(prev => {
      const userList = prev[currentUser.id].filter(item => item.id !== itemId);
      return { ...prev, [currentUser.id]: userList };
    });
  };

  // Actions for personal documents
  const changeDocumentStatus = (docId, newStatus) => {
    if (!currentUser) return;
    setPersonalDocs(prev => {
      const userDocs = prev[currentUser.id].map(doc => 
        doc.id === docId ? { ...doc, status: newStatus } : doc
      );
      return { ...prev, [currentUser.id]: userDocs };
    });
  };

  // Actions for proposals & voting
  const voteProposal = (proposalId, type) => {
    if (!currentUser) return;
    const userId = currentUser.id;
    
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        let ups = [...p.votesUp];
        let downs = [...p.votesDown];
        
        if (type === 'up') {
          if (ups.includes(userId)) {
            ups = ups.filter(id => id !== userId);
          } else {
            ups.push(userId);
            downs = downs.filter(id => id !== userId);
          }
        } else if (type === 'down') {
          if (downs.includes(userId)) {
            downs = downs.filter(id => id !== userId);
          } else {
            downs.push(userId);
            ups = ups.filter(id => id !== userId);
          }
        }
        
        return { ...p, votesUp: ups, votesDown: downs };
      }
      return p;
    }));
  };

  const handleAddProposal = (e) => {
    e.preventDefault();
    if (!newProposal.title.trim() || !currentUser) return;
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newId = `p_${Date.now()}`;
    
    setProposals(prev => [
      ...prev,
      {
        id: newId,
        title: newProposal.title.trim(),
        description: newProposal.description.trim(),
        proposer: currentUser.name,
        votesUp: [currentUser.id],
        votesDown: [],
        date: dateStr
      }
    ]);

    if (newProposal.sendAlert) {
      setBroadcastAlert({
        text: `اقتراح وتصويت جديد من ${currentUser.name}: ${newProposal.title.trim()}`,
        date: now.toLocaleTimeString()
      });
    }

    setNewProposal({ title: '', description: '', sendAlert: false });
  };

  // Actions for tasks (Supabase-backed)
  const toggleTask = async (id) => {
    const current = tasks.find(t => t.id === id);
    if (!current) return;
    const next = !current.completed;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: next } : t));
    const { error } = await supabase.from('tasks').update({ completed: next }).eq('id', id);
    if (error) {
      console.error('[Supabase Error] toggleTask:', error.message);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !next } : t));
    }
  };

  const deleteTask = async (id) => {
    if (!canEdit) return;
    const snapshot = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('[Supabase Error] deleteTask:', error.message);
      setTasks(snapshot);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('التعديل مقفول حالياً من قبل المنظم', 'error');
      return;
    }
    if (!newTask.title.trim()) {
      showToast('اكتب اسم المهمة قبل الإضافة', 'error');
      return;
    }
    const payload = mapTaskToDb({ ...newTask, completed: false });
    const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
    if (error) {
      console.error('[Supabase Error] handleAddTask:', error.message);
      showToast('تعذّر حفظ المهمة، حاول مرة أخرى', 'error');
      return;
    }
    setTasks(prev => prev.some(t => t.id === data.id) ? prev : [...prev, mapTaskFromDb(data)]);
    setNewTask({ title: '', assignee: 'الجميع', category: 'تجهيزات', isCritical: false });
    showToast('تمت إضافة المهمة بنجاح');
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditTaskData({
      title: task.title,
      assignee: task.assignee,
      category: task.category,
      isCritical: task.isCritical
    });
  };

  const handleSaveTaskEdit = async (id) => {
    const payload = mapTaskToDb({ ...editTaskData, completed: tasks.find(t => t.id === id)?.completed });
    const { data, error } = await supabase.from('tasks').update(payload).eq('id', id).select().single();
    if (error) {
      console.error('[Supabase Error] handleSaveTaskEdit:', error.message);
      return;
    }
    setTasks(prev => prev.map(t => t.id === id ? mapTaskFromDb(data) : t));
    setEditingTaskId(null);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('التعديل مقفول حالياً من قبل المنظم', 'error');
      return;
    }
    if (!newExpense.description.trim()) {
      showToast('اكتب وصف المصروف قبل الإضافة', 'error');
      return;
    }
    if (!newExpense.amountSar) {
      showToast('حدد المبلغ بالريال', 'error');
      return;
    }
    if (!newExpense.paidBy) {
      showToast('حدد الجهة الدافعة', 'error');
      return;
    }
    const payload = mapExpenseToDb({
      description: newExpense.description,
      amountSar: parseFloat(newExpense.amountSar),
      paidBy: newExpense.paidBy,
      date: new Date().toISOString().split('T')[0]
    });
    const { data, error } = await supabase.from('expenses').insert([payload]).select().single();
    if (error) {
      console.error('[Supabase Error] handleAddExpense:', error.message);
      showToast('تعذّر حفظ المصروف، حاول مرة أخرى', 'error');
      return;
    }
    setExpenses(prev => prev.some(x => x.id === data.id) ? prev : [...prev, mapExpenseFromDb(data)]);
    setNewExpense({ description: '', amountSar: '', paidBy: 'الصندوق' });
    showToast('تمت إضافة المصروف بنجاح');
  };

  const handleDeleteExpense = async (id) => {
    if (!canEdit) return;
    const snapshot = expenses;
    setExpenses(prev => prev.filter(e => e.id !== id));
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      console.error('[Supabase Error] handleDeleteExpense:', error.message);
      setExpenses(snapshot);
    }
  };

  const handleUpdateContribution = (travelerId, paidVal) => {
    setFundContributions(prev => prev.map(c => 
      c.id === travelerId ? { ...c, paid: parseFloat(paidVal) || 0 } : c
    ));
  };

  const handleUpdateContTarget = (travelerId, targetVal) => {
    setFundContributions(prev => prev.map(c => 
      c.id === travelerId ? { ...c, target: parseFloat(targetVal) || 0 } : c
    ));
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('التعديل مقفول حالياً من قبل المنظم', 'error');
      return;
    }
    if (!newBooking.title.trim()) {
      showToast('اكتب وصف الحجز قبل الإضافة', 'error');
      return;
    }
    const payload = mapBookingToDb(newBooking);
    const { data, error } = await supabase.from('bookings').insert([payload]).select().single();
    if (error) {
      console.error('[Supabase Error] handleAddBooking:', error.message);
      showToast('تعذّر حفظ الحجز، حاول مرة أخرى', 'error');
      return;
    }
    setBookings(prev => prev.some(x => x.id === data.id) ? prev : [...prev, mapBookingFromDb(data)]);
    setNewBooking({ type: 'طيران', title: '', status: 'مستهدف', details: '' });
    showToast('تمت إضافة الحجز بنجاح');
  };

  const handleDeleteBooking = async (id) => {
    if (!canEdit) return;
    const snapshot = bookings;
    setBookings(prev => prev.filter(b => b.id !== id));
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      console.error('[Supabase Error] handleDeleteBooking:', error.message);
      setBookings(snapshot);
    }
  };

  const startEditingBooking = (booking) => {
    setEditingBookingId(booking.id);
    setEditBookingData({
      type: booking.type,
      title: booking.title,
      status: booking.status,
      details: booking.details
    });
  };

  const handleSaveBookingEdit = async (id) => {
    const payload = mapBookingToDb(editBookingData);
    const { data, error } = await supabase.from('bookings').update(payload).eq('id', id).select().single();
    if (error) {
      console.error('[Supabase Error] handleSaveBookingEdit:', error.message);
      return;
    }
    setBookings(prev => prev.map(b => b.id === id ? mapBookingFromDb(data) : b));
    setEditingBookingId(null);
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('التعديل مقفول حالياً من قبل المنظم', 'error');
      return;
    }
    if (!newActivity.title.trim()) {
      showToast('اكتب عنوان النشاط قبل الإضافة', 'error');
      return;
    }
    const payload = mapItineraryToDb({
      day: parseInt(newActivity.day),
      date: getDateForDay(tripStartDate, parseInt(newActivity.day)),
      city: newActivity.city,
      title: newActivity.title,
      activities: newActivity.activities,
      leader: newActivity.leader,
      notes: newActivity.notes || ''
    });
    const { data, error } = await supabase.from('itinerary').insert([payload]).select().single();
    if (error) {
      console.error('[Supabase Error] handleAddActivity:', error.message);
      showToast('تعذّر حفظ النشاط، حاول مرة أخرى', 'error');
      return;
    }
    setItinerary(prev => {
      if (prev.some(x => x.id === data.id)) return prev;
      return [...prev, mapItineraryFromDb(data)].sort((a, b) => a.day - b.day);
    });
    setNewActivity({ day: 1, city: 'موسكو', title: '', activities: '', leader: 'عبدالله الزهراني', notes: '' });
    showToast('تمت إضافة النشاط بنجاح');
  };

  const handleDeleteActivity = async (id) => {
    if (!canEdit) return;
    const snapshot = itinerary;
    setItinerary(prev => prev.filter(i => i.id !== id));
    const { error } = await supabase.from('itinerary').delete().eq('id', id);
    if (error) {
      console.error('[Supabase Error] handleDeleteActivity:', error.message);
      setItinerary(snapshot);
    }
  };

  const startEditingActivity = (activity) => {
    setEditingActivityId(activity.id);
    setEditActivityData({
      day: activity.day,
      city: activity.city,
      title: activity.title,
      activities: activity.activities,
      leader: activity.leader,
      notes: activity.notes || ''
    });
  };

  const handleSaveActivityEdit = async (id) => {
    const payload = mapItineraryToDb({
      day: parseInt(editActivityData.day),
      date: getDateForDay(tripStartDate, parseInt(editActivityData.day)),
      city: editActivityData.city,
      title: editActivityData.title,
      activities: editActivityData.activities,
      leader: editActivityData.leader,
      notes: editActivityData.notes
    });
    const { data, error } = await supabase.from('itinerary').update(payload).eq('id', id).select().single();
    if (error) {
      console.error('[Supabase Error] handleSaveActivityEdit:', error.message);
      return;
    }
    setItinerary(prev => prev.map(item => item.id === id ? mapItineraryFromDb(data) : item).sort((a, b) => a.day - b.day));
    setEditingActivityId(null);
  };

  // ─── Per-day places (restaurants/cafes/sights) ───
  const updateDayPlaces = async (dayId, newPlaces) => {
    if (!canEdit) {
      showToast('التعديل مقفول حالياً', 'error');
      return false;
    }
    const day = itinerary.find(d => d.id === dayId);
    if (!day) return false;
    // Optimistic update
    setItinerary(prev => prev.map(d => d.id === dayId ? { ...d, places: newPlaces } : d));
    const { error } = await supabase.from('itinerary').update({ places: newPlaces }).eq('id', dayId);
    if (error) {
      console.error('[Supabase Error] updateDayPlaces:', error.message);
      // Rollback
      setItinerary(prev => prev.map(d => d.id === dayId ? day : d));
      if (error.message?.includes('column')) {
        showToast('فعّل عمود places في Supabase أولاً (SUPABASE_GUIDE.md)', 'error');
      } else {
        showToast('تعذّر حفظ التعديل', 'error');
      }
      return false;
    }
    return true;
  };

  const addPlaceToDay = async (dayId, place) => {
    const day = itinerary.find(d => d.id === dayId);
    if (!day) return;
    const newPlace = { id: `pl_${Date.now()}`, ...place };
    const ok = await updateDayPlaces(dayId, [...(day.places || []), newPlace]);
    if (ok) showToast('تمت إضافة المكان');
  };

  const deletePlaceFromDay = async (dayId, placeId) => {
    const day = itinerary.find(d => d.id === dayId);
    if (!day) return;
    const ok = await updateDayPlaces(dayId, (day.places || []).filter(p => p.id !== placeId));
    if (ok) showToast('تم حذف المكان');
  };

  // Inline add-place form state — keyed by day id
  const [newPlaceByDay, setNewPlaceByDay] = useState({});
  const [openPlaceFormDay, setOpenPlaceFormDay] = useState(null);

  // Simulate sending active day itinerary to Telegram group
  const triggerTelegramSimulation = () => {
    const dayData = itinerary.find(item => item.day === (simulatedActiveDay || 1)) || itinerary[0];
    const relatedTasks = tasks.filter(t => !t.completed).slice(0, 2);
    
    const formatted = `*بوت شدّاد الذكي* | جدول اليوم ${dayData.day}
-----------------------------------
*الوجهة والمدينة:* ${dayData.city}
*التاريخ:* ${getDateForDay(tripStartDate, dayData.day)}
*قائد اليوم:* ${dayData.leader || 'غير محدد'}
*النشاط الأساسي:* ${dayData.title}
*التفاصيل:* ${dayData.activities}

*المهام المشتركة المعلقة:*
${relatedTasks.map(t => `- ${t.title} (مسؤولية: ${t.assignee})`).join('\n') || '- لا توجد مهام معلقة لهذا اليوم.'}`;
    
    setTelegramMockContent(formatted);
    setTelegramMockOpen(true);
  };

  const dismissBanner = (id) => {
    setDismissedBanners(prev => [...prev, id]);
  };

  // Marketing Banners management functions
  const toggleMarketingBanner = (id) => {
    setMarketingBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const deleteMarketingBanner = (id) => {
    setMarketingBanners(prev => prev.filter(b => b.id !== id));
  };

  const addMarketingBanner = (newB) => {
    setMarketingBanners(prev => [
      ...prev,
      {
        id: `mb_${Date.now()}`,
        title: newB.title,
        text: newB.text,
        theme: newB.theme,
        isActive: newB.isActive,
        clicks: 0,
        views: 0
      }
    ]);
  };

  // Multi-option poll actions
  const voteMultiOption = (pollId, optionId) => {
    if (!currentUser) return;
    setMultiOptionPolls(prev => prev.map(poll => {
      if (poll.id !== pollId) return poll;
      
      const updatedOptions = poll.options.map(opt => {
        let votes = [...opt.votes];
        if (opt.id === optionId) {
          if (votes.includes(currentUser.id)) {
            votes = votes.filter(uid => uid !== currentUser.id);
          } else {
            votes.push(currentUser.id);
          }
        } else {
          votes = votes.filter(uid => uid !== currentUser.id);
        }
        return { ...opt, votes };
      });
      return { ...poll, options: updatedOptions };
    }));
  };

  const addMultiOptionPoll = (pollData) => {
    if (!currentUser) return;
    const newId = `mop_${Date.now()}`;
    setMultiOptionPolls(prev => [
      ...prev,
      {
        id: newId,
        question: pollData.question,
        options: pollData.options.map((text, index) => ({ id: `o_${newId}_${index}`, text, votes: [] })),
        creator: currentUser.name,
        isActive: true,
        winnerOptionId: null,
        targetDay: pollData.targetDay || 1,
        targetCity: pollData.targetCity || 'موسكو'
      }
    ]);
  };

  const closeMultiOptionPoll = async (pollId, winnerOptId) => {
    const poll = multiOptionPolls.find(p => p.id === pollId);
    if (!poll) return;
    const winningOption = poll.options.find(o => o.id === winnerOptId);
    const winningTitle = winningOption ? `نشاط مُعتمد بالتصويت: ${winningOption.text}` : null;
    const alreadyExists = winningTitle && itinerary.some(item => item.title === winningTitle && item.day === poll.targetDay);

    if (winningOption && canEdit && !alreadyExists) {
      const payload = mapItineraryToDb({
        day: poll.targetDay,
        date: getDateForDay(tripStartDate, poll.targetDay),
        city: poll.targetCity,
        title: winningTitle,
        activities: `تم حسم هذا النشاط جماعياً بالتصويت. مقترح بواسطة: ${poll.creator}`,
        leader: 'المنظم',
        notes: ''
      });
      const { data, error } = await supabase.from('itinerary').insert([payload]).select().single();
      if (error) {
        console.error('[Supabase Error] closeMultiOptionPoll insert:', error.message);
      } else if (data) {
        setItinerary(prev => {
          if (prev.some(x => x.id === data.id)) return prev;
          return [...prev, mapItineraryFromDb(data)].sort((a, b) => a.day - b.day);
        });
      }
    }

    setMultiOptionPolls(prev => prev.map(p => p.id === pollId ? { ...p, isActive: false, winnerOptionId: winnerOptId } : p));
  };

  const trackBannerClick = (id) => {
    setMarketingBanners(prev => prev.map(b => b.id === id ? { ...b, clicks: b.clicks + 1 } : b));
  };

  // IF NOT LOGGED IN: Render Direct Login Gate (Split Screen Layout)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-0 md:p-6 bg-[#FAF7F2] relative font-sans" dir="rtl">
        {/* Decorative Background Accents for Mobile */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-[#4A6BB5]/10 to-[#2A3F7E]/10 rounded-full blur-3xl opacity-40 md:hidden"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-[#D4AF37]/5 to-[#4A6BB5]/10 rounded-full blur-3xl opacity-40 md:hidden"></div>
 
        <div className="w-full max-w-5xl bg-white border border-[#ECE6DC] rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[640px] relative z-10">
          
          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between space-y-7 bg-white">
            {/* ─── TOP: Russian flag stripe + brand block ─── */}
            <div className="space-y-5">
              {/* Authentic Russian flag — official colors */}
              <div className="russian-flag-stripe h-2.5 w-20 rounded-full mx-auto md:mx-0 shadow-sm"></div>

              <div className="flex items-center gap-4 justify-start">
                <div className="w-14 h-14 md:w-16 md:h-16 shrink-0">
                  <ShaddadLogo />
                </div>
                <div className="text-right">
                  <h2 className="text-2xl md:text-3xl font-black text-[#14172A] m-0 leading-tight">رحلة روسيا 2026</h2>
                  <p className="text-sm md:text-base text-[#2A3F7E] font-bold m-0 mt-1">المخطط الجماعي للأصحاب</p>
                </div>
              </div>
            </div>

            {/* Login form or password change form */}
            <div className="space-y-6">
              {isSettingNewPassword ? (
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                  <div className="text-center py-4 px-5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm md:text-base font-bold leading-relaxed">
                    مرحباً بك يا {tempTravelerForPasswordChange?.name}<br/>
                    يرجى تعيين كلمة مرور جديدة لحماية حسابك. ستُحفظ في السحابة وستعمل من جميع أجهزتك.
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm md:text-base font-bold text-gray-700 block">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-4 py-4 text-base md:text-lg text-center focus:outline-none focus:border-[#2A3F7E] focus:bg-white tracking-widest text-[#14172A]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm md:text-base font-bold text-gray-700 block">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-4 py-4 text-base md:text-lg text-center focus:outline-none focus:border-[#2A3F7E] focus:bg-white tracking-widest text-[#14172A]"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-sm md:text-base text-rose-800 leading-relaxed font-bold text-right">
                      {loginError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#2A3F7E] hover:bg-[#1b4332] text-white font-black py-4 rounded-xl text-base md:text-lg transition duration-300 cursor-pointer shadow-sm text-center"
                    >
                      تحديث وحفظ كلمة المرور
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 px-5 rounded-xl text-sm md:text-base transition cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-5" autoComplete="on">
                  <div className="space-y-2">
                    <label htmlFor="login-phone" className="text-sm md:text-base font-bold text-gray-700 block">أدخل رقم جوالك لتسجيل الدخول</label>
                    <input
                      id="login-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="username tel"
                      placeholder="05XXXXXXXX"
                      value={loginPhoneInput}
                      onChange={(e) => setLoginPhoneInput(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-4 py-4 text-base md:text-lg text-center font-mono focus:outline-none focus:border-[#2A3F7E] focus:bg-white tracking-widest text-[#14172A]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-sm md:text-base font-bold text-gray-700 block">كلمة المرور</label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="********"
                      value={loginPasswordInput}
                      onChange={(e) => setLoginPasswordInput(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-4 py-4 text-base md:text-lg text-center focus:outline-none focus:border-[#2A3F7E] focus:bg-white tracking-widest text-[#14172A]"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-sm md:text-base text-rose-800 leading-relaxed font-bold text-right">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white font-black py-4 rounded-xl text-base md:text-lg transition duration-300 cursor-pointer shadow-md text-center"
                  >
                    تأكيد ودخول للرحلة
                  </button>
                </form>
              )}
            </div>

            {/* ─── PROFESSIONAL SIGNATURE CARD ─── */}
            <div className="relative bg-gradient-to-br from-white to-[#FAF7F2] border border-[#ECE6DC] rounded-2xl p-5 md:p-6 shadow-[0_10px_30px_-10px_rgba(42,63,126,0.15)] overflow-hidden">
              {/* Subtle flag-color accent at top of card */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-[#0036A7]"></div>
                <div className="flex-1 bg-[#D62718]"></div>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-sm md:text-base text-[#2A3F7E] font-bold leading-relaxed m-0">
                  صُنع بحب للأصحاب
                </p>
                <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed m-0">
                  نظام تفاعلي لتنسيق رحلتنا إلى روسيا 2026
                </p>

                {/* Divider with diamond accent */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ECE6DC] to-transparent"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#D62718]"></div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ECE6DC] to-transparent"></div>
                </div>

                {/* Signature */}
                <div className="space-y-0.5">
                  <p className="text-[10px] text-gray-400 font-medium m-0 tracking-wide">صمّمه وأعدّه</p>
                  <p className="text-base md:text-lg text-[#14172A] font-black m-0" style={{ fontFamily: '"Tajawal", serif', letterSpacing: '0.02em' }}>
                    عبدالله الزهراني
                  </p>
                </div>

                <p className="text-[9px] text-gray-400 font-mono m-0 pt-1">
                  Summer Trip Planner © 2026
                </p>
              </div>
            </div>
          </div>

          {/* Left Side: St. Basil's Green Cathedral Card (Artistic Banner Side) */}
          <div className="hidden md:flex w-1/2 bg-[#1B2D64] p-12 relative flex-col justify-between overflow-hidden">
            {/* Background design accents */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-tr from-[#4A6BB5]/15 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"></div>
            
            {/* Content card resembling the first design */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl space-y-4 shadow-2xl text-right">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative">
                  <img 
                    src={russiaHero} 
                    alt="روسيا" 
                    className="w-full h-full object-cover object-center scale-105"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 text-[#1B2D64] px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm">
                    وجهتنا: روسيا
                  </span>
                </div>
                <div className="text-right text-white space-y-1">
                  <h3 className="font-extrabold text-sm text-white m-0">موسكو · سان بطرسبرغ · موسكو</h3>
                  <p className="text-[10px] text-emerald-100 opacity-90 leading-relaxed font-light m-0">
                    نظام موحد لإدارة مسار الرحلة، الحجوزات، الميزانية المشتركة، وجاهزية الحقائب مع الأصدقاء.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14172A] flex flex-col md:flex-row font-sans relative pb-20 md:pb-0" dir="rtl">
      
      {/* Mobile Top Header — branding only, no burger (bottom nav handles navigation) */}
      <header className="md:hidden bg-white border-b border-[#ECE6DC] px-5 py-3.5 flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 shrink-0">
            <ShaddadLogo />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-sm text-[#14172A] leading-none">رحلة روسيا 2026</span>
            <span className="font-medium text-[10px] text-[#2A3F7E] leading-none mt-0.5">المخطط الجماعي</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#ECE6DC] px-2.5 py-1 rounded-lg">
          <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center font-bold text-white text-[9px]`}>
            {currentUser.name[0]}
          </div>
          <span className="text-[10px] font-bold text-[#14172A]">{currentUser.name.split(' ')[0]}</span>
        </div>
      </header>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 1. RIGHT SIDEBAR */}
      <aside className={`fixed md:sticky top-0 right-0 h-screen w-72 bg-white border-l border-[#ECE6DC] p-6 flex flex-col shrink-0 gap-6 z-50 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
         isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 left-4 p-1.5 hover:bg-[#ECE6DC]/50 rounded-lg text-gray-500 cursor-pointer"
          aria-label="إغلاق القائمة"
        >
          <X size={18} />
        </button>

        <div className="space-y-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-3 border-b border-[#ECE6DC] pb-4">
            <div className="w-10 h-10 shrink-0">
              <ShaddadLogo />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-[#14172A] font-sans m-0">رحلة صيف ٢٠٢٦</h1>
              <p className="text-[10px] text-[#2A3F7E] font-bold m-0">المخطط الجماعي للأصدقاء</p>
            </div>
          </div>

          {/* Current Traveler Profile Card */}
          <div className="bg-[#FAF7F2] border border-[#ECE6DC] p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center font-bold text-white text-xs`}>
                {currentUser.name[0]}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-[#14172A] text-xs">{currentUser.name}</h4>
                  {/* Private Group Planner */}
                </div>
                <p className="text-[10px] text-gray-500 m-0">{currentUser.role}</p>
              </div>
            </div>
            
            <div className="border-t border-[#ECE6DC]/60 pt-2 flex items-center justify-between text-[10px] text-gray-500">
              <span>الجوال: <strong className="font-mono">{currentUser.phone}</strong></span>
              <button 
                onClick={handleLogout}
                className="text-[#2A3F7E] hover:text-red-700 flex items-center gap-0.5 font-bold cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut size={11} />
                <span>خروج</span>
              </button>
            </div>
          </div>

          {/* No SaaS Upgrade Sidebar Banner */}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 pr-1">
            {[
              { id: 'dashboard', label: 'لوحة التحكم', icon: Award },
              { id: 'personal', label: 'حقيبتي وأوراقي', icon: Briefcase },
              { id: 'itinerary', label: 'جدول الأيام', icon: Calendar },
              { id: 'bookings', label: 'الحجوزات والتذاكر', icon: Hotel },
              { id: 'tasks', label: 'المهام المشتركة', icon: CheckSquare },
              { id: 'expenses', label: 'المالية والقطة', icon: Coins },
              { id: 'proposals', label: 'المقترحات والتصويت', icon: Vote },
              ...(isSuperAdmin ? [{ id: 'superadmin', label: 'إدارة الرحلة (عبدالله)', icon: Settings }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-right cursor-pointer ${
                    isActive 
                      ? 'bg-[#2A3F7E] text-white font-bold' 
                      : 'text-gray-600 hover:text-[#14172A] hover:bg-[#ECE6DC]/40'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

          </nav>
        </div>

        {/* Footer in Sidebar — credit moved here from login screen */}
        <div className="text-center space-y-1.5 border-t border-[#ECE6DC] pt-4 font-sans">
          <p className="text-xs text-[#2A3F7E] font-bold m-0 leading-relaxed">
            صُنع بحب للأصحاب
          </p>
          <p className="text-[11px] text-gray-500 m-0">
            نظام تفاعلي لتنسيق رحلتنا إلى روسيا 2026
          </p>
          <p className="text-[10px] text-gray-500 font-medium m-0">
            بإشراف وتنظيم: <span className="text-[#14172A] font-bold">عبدالله الزهراني</span>
          </p>
          <p className="text-[9px] text-gray-400 font-mono m-0 pt-1">
            Summer Trip Planner © 2026
          </p>
        </div>
      </aside>

      {/* 2. LEFT MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* INNER-PAGE BACK NAVIGATION — appears on every tab except home/dashboard */}
        {activeTab !== 'dashboard' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="md:hidden flex items-center gap-1.5 text-[#2A3F7E] font-bold text-sm mb-4 px-3 py-2 -mr-3 rounded-lg hover:bg-[#EEF1F8] transition cursor-pointer"
            aria-label="العودة للرئيسية"
          >
            <ChevronLeft size={18} />
            <span>الرئيسية</span>
          </button>
        )}

        {/* SUPABASE CONNECTION/SETUP WARNING */}
        {dataLoadError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-950 p-4 rounded-2xl mb-6 flex items-start gap-3 text-right shadow-xs">
            <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <h4 className="font-bold text-xs text-amber-900">قاعدة البيانات بحاجة إلى تهيئة</h4>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">{dataLoadError}</p>
              <p className="text-[10px] text-amber-700 mt-1 font-mono">سيستمر التطبيق بالعمل محلياً لكن التغييرات لن تُحفظ.</p>
            </div>
          </div>
        )}

        {/* BROADCAST ALERT FROM ADMIN */}
        {broadcastAlert && (
          <div className="bg-red-50 border border-red-200 text-red-950 p-4 rounded-2xl mb-6 flex items-center justify-between gap-3 text-right shadow-xs animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-red-700 shrink-0 animate-bounce" size={20} />
              <div>
                <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full font-bold">تنبيه عاجل من المنظم</span>
                <p className="text-xs font-bold mt-1 text-red-900">{broadcastAlert.text}</p>
              </div>
            </div>
            {isSuperAdmin && (
              <button 
                onClick={() => setBroadcastAlert(null)}
                className="text-[10px] text-red-700 hover:text-red-900 border border-red-300 bg-red-100/50 px-2 py-1 rounded-lg cursor-pointer"
              >
                حذف التنبيه
              </button>
            )}
          </div>
        )}

        {/* CRITICAL OVERDUE TASKS ALERTS */}
        {overdueTasksCount > 0 && (
          <div className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-2xl mb-6 space-y-2 text-right shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-rose-700" size={16} />
              <h4 className="font-bold text-xs text-rose-900">تنبيه: هناك {overdueTasksCount} مهام حرجة معلقة تتطلب الإنجاز العاجل:</h4>
            </div>
            <ul className="text-[11px] text-rose-800 list-disc list-inside space-y-1 pr-4">
              {criticalOverdueTasksList.map((t) => (
                <li key={t.id} className="font-medium">
                  {t.title} - <span className="font-extrabold text-[#2A3F7E]">{t.assignee}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 1: DASHBOARD — Tile-based home redesign (Russian palette) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 md:space-y-7 animate-fadeIn">

            {/* ─── 1. HERO: greeting + compact countdown ─── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A3F7E] via-[#243A7A] to-[#1B2D64] text-white p-6 md:p-8 shadow-lg">
              {/* Russian flag accent stripe — OFFICIAL flag colors */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-[#0036A7]"></div>
                <div className="flex-1 bg-[#D62718]"></div>
              </div>
              {/* Soft decorative dome silhouette */}
              <div className="absolute -bottom-6 -left-6 w-40 h-40 opacity-10 pointer-events-none">
                <ShaddadLogo />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="space-y-2 text-right">
                  <p className="text-xs md:text-sm font-medium text-white/70">رحلة صيف ٢٠٢٦ · موسكو وسانت بطرسبرغ</p>
                  <h2 className="text-2xl md:text-3xl font-black leading-tight">
                    حياك يا {currentUser.name.split(' ')[0]}
                  </h2>
                  <p className="text-sm md:text-base text-white/80">
                    {timeLeft.isPast
                      ? 'الرحلة نشطة الآن — استمتعوا!'
                      : `باقي ${timeLeft.days} يوم على انطلاق الرحلة`}
                  </p>
                </div>

                {!timeLeft.isPast && (
                  <div className="flex gap-1.5 md:gap-2 self-end md:self-auto" dir="ltr">
                    {[
                      { v: timeLeft.days,    l: 'يوم' },
                      { v: timeLeft.hours,   l: 'ساعة' },
                      { v: timeLeft.minutes, l: 'دقيقة' },
                      { v: timeLeft.seconds, l: 'ثانية', subtle: true },
                    ].map((u, i) => (
                      <div key={i} className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-2.5 py-2 text-center min-w-[52px] ${u.subtle ? 'opacity-80' : ''}`}>
                        <div className="text-lg md:text-2xl font-black tabular-nums">{String(u.v).padStart(2, '0')}</div>
                        <div className="text-[9px] md:text-[11px] text-white/75 mt-0.5">{u.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ─── 2. MAIN TILE GRID: 4 primary destinations ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  id: 'itinerary',
                  title: 'جدول الأيام',
                  subtitle: 'مسار الرحلة الكامل',
                  stat: `${itinerary.length} يوم`,
                  icon: Calendar,
                  iconBg: 'bg-[#2A3F7E]',
                  iconColor: 'text-white',
                },
                {
                  id: 'bookings',
                  title: 'الحجوزات',
                  subtitle: 'الطيران والفنادق والقطارات',
                  stat: `${financeStats.confirmedBookings}/${financeStats.totalBookings} مؤكد`,
                  icon: Plane,
                  iconBg: 'bg-[#D52B1E]',
                  iconColor: 'text-white',
                },
                {
                  id: 'expenses',
                  title: 'المالية والقطة',
                  subtitle: 'الصندوق والمصروفات',
                  stat: `${financeStats.remainingFund.toLocaleString()} ر.س`,
                  icon: Coins,
                  iconBg: 'bg-[#2A3F7E]',
                  iconColor: 'text-white',
                },
                {
                  id: 'personal',
                  title: 'حقيبتي وأوراقي',
                  subtitle: 'جاهزيتك الشخصية',
                  stat: `${financeStats.packingPercent}% جاهز`,
                  icon: Briefcase,
                  iconBg: 'bg-[#D52B1E]',
                  iconColor: 'text-white',
                },
              ].map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setActiveTab(tile.id)}
                    className="home-tile"
                  >
                    <div className={`home-tile-icon ${tile.iconBg} ${tile.iconColor}`}>
                      <Icon size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-sm md:text-base text-[#14172A]">{tile.title}</h3>
                      <p className="text-[11px] md:text-xs text-gray-500 leading-snug">{tile.subtitle}</p>
                    </div>
                    <div className="text-xs md:text-sm font-bold text-[#2A3F7E] tabular-nums">
                      {tile.stat}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ─── 3. SECONDARY TILES: Tasks + Proposals ─── */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                {
                  id: 'tasks',
                  title: 'المهام المشتركة',
                  stat: `${financeStats.completedTasks}/${financeStats.totalTasks} منجزة`,
                  icon: CheckSquare,
                },
                {
                  id: 'proposals',
                  title: 'المقترحات والتصويت',
                  stat: 'اقترح أو صوّت',
                  icon: Vote,
                },
              ].map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setActiveTab(tile.id)}
                    className="bg-white border border-[#ECE6DC] rounded-2xl p-4 flex items-center gap-3 text-right cursor-pointer transition hover:border-[#2A3F7E] hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EEF1F8] text-[#2A3F7E] flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-[#14172A]">{tile.title}</h4>
                      <p className="text-[11px] text-gray-500 truncate">{tile.stat}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ─── 4. TEAM READINESS: 4 simple progress bars ─── */}
            <div className="bg-white border border-[#ECE6DC] rounded-3xl p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm md:text-base text-[#14172A]">جاهزية الفريق</h3>
                <Users className="text-[#2A3F7E]" size={18} />
              </div>
              <div className="space-y-3">
                {travelers.map((t) => {
                  const packing = personalPacking[t.id] || [];
                  const docs = personalDocs[t.id] || [];
                  const totalP = packing.length;
                  const donePacking = packing.filter(i => i.checked).length;
                  const totalD = docs.length;
                  const doneDocs = docs.filter(d => d.fileData || d.status === 'معتمد').length;
                  const total = totalP + totalD;
                  const done = donePacking + doneDocs;
                  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                  const isYou = t.id === currentUser.id;
                  return (
                    <div key={t.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.avatarColor} text-white font-black text-xs flex items-center justify-center`}>
                            {t.name[0]}
                          </div>
                          <span className="font-bold text-[#14172A]">{t.name.split(' ')[0]}</span>
                          {isYou && <span className="text-[9px] bg-[#2A3F7E]/10 text-[#2A3F7E] font-bold px-1.5 py-0.5 rounded">أنت</span>}
                        </div>
                        <span className="font-mono font-bold text-[#2A3F7E] tabular-nums">{pct}%</span>
                      </div>
                      <div className="w-full bg-[#F2EEE7] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? '#2A3F7E' : 'linear-gradient(to left, #2A3F7E, #4A6BB5)'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── 5. ADMIN-ONLY: Active day + leader checklist ─── */}
            {simulatedActiveDay > 0 && (() => {
              const leaderInfo = getLeaderRoleAndChecklist(activeLeaderName || 'عبدالله الزهراني');
              return (
                <div className="bg-white border border-[#ECE6DC] rounded-3xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="text-[#D52B1E]" size={18} />
                      <h3 className="font-black text-sm md:text-base text-[#14172A]">
                        قائد اليوم {simulatedActiveDay}: {activeLeaderName}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{leaderInfo.role}</p>
                  <div className="space-y-2">
                    {leaderInfo.tasks.map((taskText, idx) => {
                      const stateKey = `${simulatedActiveDay}-${idx}`;
                      const isChecked = !!leaderChecklistState[stateKey];
                      return (
                        <label
                          key={idx}
                          className={`flex items-start gap-3 p-3 bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl cursor-pointer select-none ${isChecked ? 'opacity-60 line-through' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setLeaderChecklistState(prev => ({ ...prev, [stateKey]: e.target.checked }))}
                            className="w-4 h-4 mt-0.5 cursor-pointer shrink-0 accent-[#2A3F7E]"
                          />
                          <span className="text-xs md:text-sm">{taskText}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ─── 6. ADMIN ANNOUNCEMENTS (if any) ─── */}
            {marketingBanners.filter(b => b.isActive).length > 0 && (
              <div className="space-y-3">
                {marketingBanners.filter(b => b.isActive).map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-[#FCE9E8] border border-[#D52B1E]/30 rounded-2xl p-4 flex items-start gap-3 text-right"
                  >
                    <Megaphone className="text-[#D52B1E] shrink-0 mt-0.5" size={18} />
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-[#14172A]">{banner.title}</h4>
                      <p className="text-xs text-[#14172A]/80 mt-1 leading-relaxed">{banner.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── 7. SINGLE QUOTE — focused, calm ─── */}
            <div className="text-center py-4 px-2">
              <p className="text-sm md:text-base text-gray-500 italic font-medium leading-relaxed max-w-md mx-auto">
                « الذكريات التي نصنعها مع الأصدقاء أثمن ما نحمله في حقائبنا »
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL SPACE (PACKING & DOCUMENTS) - PRIVATE */}
        {activeTab === 'personal' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE6DC] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A3F7E]/10 border border-[#2A3F7E]/20 flex items-center justify-center text-[#2A3F7E]">
                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#D52B1E]">
                    المساحة الشخصية والوثائق لـ {currentUser.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">تجهيز حقيبتك ومستندات سفرك. هذه البيانات خاصة بك وتظهر فقط للمستخدم النشط.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-[#ECE6DC]/50 border border-[#ECE6DC] px-4 py-2 rounded-xl text-xs">
                <span className="text-gray-500">جوال الدخول:</span>
                <span className="font-bold font-mono text-[#2A3F7E]">{currentUser.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Document Tracker List — placed second on mobile */}
              <div className="white-card p-5 md:p-6 rounded-2xl space-y-5 order-2 lg:order-1">
                <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3">
                  <FileText className="text-[#D52B1E]" size={20} />
                  <h3 className="text-base md:text-lg font-black text-[#D52B1E]">أوراق ومستندات السفر الرسمية</h3>
                </div>

                <div className="space-y-4">
                  {(personalDocs[currentUser.id] || []).map((doc) => {
                    const isExpiring = doc.id === 'doc1' && doc.expiryDate && isDocExpiringSoon(doc.expiryDate);
                    return (
                      <div key={doc.id} className={`bg-[#FAF7F2] p-4 rounded-xl border space-y-2 text-right transition-colors ${
                        isExpiring ? 'border-red-300 bg-red-50/20' : 'border-[#ECE6DC]/70'
                      }`}>
                        <div>
                          <h4 className="font-bold text-[#14172A] text-xs flex items-center justify-between gap-1">
                            <span>{doc.title}</span>
                            {doc.id === 'doc1' && doc.expiryDate && (
                              <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${
                                isExpiring 
                                  ? 'bg-red-100 text-red-800 border-red-200' 
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {isExpiring ? 'جواز منتهي/قريب الانتهاء' : 'جواز ساري المفعول'}
                              </span>
                            )}
                          </h4>
                          <span className="text-[9px] text-gray-400 block mt-0.5">مطلوب لـ: {doc.requiredFor}</span>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#ECE6DC]/60 pt-2 text-xs">
                          <span className="text-[10px] text-gray-500">الحالة:</span>
                          <select
                            value={doc.status}
                            onChange={(e) => changeDocumentStatus(doc.id, e.target.value)}
                            className="bg-white border border-[#ECE6DC] rounded-lg px-2 py-1 text-[10px] text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer"
                          >
                            <option value="لم يكتمل">لم يكتمل</option>
                            <option value="قيد المعالجة">قيد المعالجة</option>
                            <option value="مجهز">مجهز</option>
                            <option value="تعبئة بالمطار">تعبئة بالمطار</option>
                          </select>
                        </div>

                        {/* Expiry Date input */}
                        {doc.id === 'doc1' && (
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="text-[10px] text-gray-500">تاريخ الانتهاء:</span>
                            <input 
                              type="date"
                              value={doc.expiryDate || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPersonalDocs(prev => {
                                  const userDocs = prev[currentUser.id].map(d => 
                                    d.id === doc.id ? { ...d, expiryDate: val } : d
                                  );
                                  return { ...prev, [currentUser.id]: userDocs };
                                });
                              }}
                              className="bg-white border border-[#ECE6DC] rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-[#2A3F7E] font-mono text-left"
                            />
                          </div>
                        )}

                        {/* Warnings if expiring soon */}
                        {isExpiring && (
                          <div className="bg-red-50 border border-red-200 text-red-900 p-2.5 rounded-lg text-[9px] font-bold mt-2 leading-relaxed flex items-start gap-1">
                            <AlertTriangle size={12} className="text-red-700 shrink-0 mt-0.5" />
                            <span>تنبيه عاجل: جواز سفرك ينتهي خلال أقل من 6 أشهر من انطلاق الرحلة ({tripStartDate}). قد تواجه منعاً من السفر بالمطار، يرجى تجديده فوراً</span>
                          </div>
                        )}

                        {/* File Upload / Image Preview */}
                        {doc.fileData ? (
                          <div className="pt-2 flex items-center justify-between bg-white border border-[#ECE6DC] px-3 py-2 rounded-xl text-xs gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDocForView({ name: doc.title, data: doc.fileData })}
                              className="text-[#2A3F7E] hover:underline flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>معاينة المستند</span>
                            </button>
                            <span className="text-[8px] text-gray-400 font-mono truncate max-w-[120px]">{doc.fileName}</span>
                            <button
                              type="button"
                              onClick={() => handleDocFileRemove(currentUser.id, doc.id)}
                              className="text-red-600 hover:text-red-800 p-0.5 cursor-pointer"
                              title="إزالة الصورة"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="pt-1">
                            <input 
                              type="file" 
                              accept="image/*"
                              id={`file-${doc.id}`}
                              onChange={(e) => handleDocFileUpload(currentUser.id, doc.id, e)}
                              className="hidden"
                            />
                            <label 
                              htmlFor={`file-${doc.id}`}
                              className="w-full bg-white hover:bg-gray-50 border border-dashed border-[#ECE6DC] hover:border-[#2A3F7E] py-2 px-3 rounded-xl text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                            >
                              <Upload size={12} />
                              <span>رفع صورة المستند (مجاناً)</span>
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Packing Checklist — placed first on mobile */}
              <div className="lg:col-span-2 white-card p-5 md:p-6 rounded-2xl space-y-5 order-1 lg:order-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE6DC] pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-[#D52B1E]" size={20} />
                    <h3 className="text-base md:text-lg font-black text-[#D52B1E]">حقيبتي الشخصية (مستلزمات السفر)</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-bold">الأغراض المجهزة:</span>
                    <span className="bg-[#2A3F7E]/10 text-[#2A3F7E] px-2.5 py-0.5 rounded-full font-bold border border-[#2A3F7E]/20">
                      {financeStats.packedCount} من {financeStats.totalPacking} ({financeStats.packingPercent}%)
                    </span>
                  </div>
                </div>

                {/* Form to add personal item */}
                <form onSubmit={addPersonalPackingItem} className="flex gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#ECE6DC]">
                  <input 
                    type="text" 
                    placeholder="أضف غرض شخصي آخر..."
                    value={newPersonalItem.title}
                    onChange={(e) => setNewPersonalItem(prev => ({ ...prev, title: e.target.value }))}
                    className="flex-1 bg-transparent border-none px-2 text-xs text-[#14172A] focus:outline-none placeholder-gray-500 text-right"
                  />
                  <select
                    value={newPersonalItem.category}
                    onChange={(e) => setNewPersonalItem(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-white border border-[#ECE6DC] rounded-lg px-2 text-[10px] text-gray-600 focus:outline-none cursor-pointer"
                  >
                    <option value="إلكترونيات">إلكترونيات</option>
                    <option value="عناية شخصية">عناية شخصية</option>
                    <option value="ملابس ومستلزمات">ملابس ومستلزمات</option>
                    <option value="وثائق وأموال">وثائق وأموال</option>
                  </select>
                  <button 
                    type="submit"
                    className="bg-[#2A3F7E] hover:bg-[#1b4332] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    إضافة
                  </button>
                </form>

                {/* Packing list categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['إلكترونيات', 'عناية شخصية', 'ملابس ومستلزمات', 'وثائق وأموال'].map((cat) => {
                    const catItems = (personalPacking[currentUser.id] || []).filter(item => item.category === cat);
                    return (
                      <div key={cat} className="space-y-3 bg-[#FAF7F2]/40 border border-[#ECE6DC]/50 p-4 rounded-xl">
                        <h4 className="font-extrabold text-[#2A3F7E] text-xs border-b border-[#ECE6DC] pb-1.5 text-right">{cat}</h4>
                        
                        {catItems.length === 0 ? (
                          <p className="text-[10px] text-gray-400 py-2 text-right">لا توجد أغراض مضافة بعد.</p>
                        ) : (
                          <div className="space-y-2">
                            {catItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-right flex-1">
                                  <input 
                                    type="checkbox" 
                                    checked={item.checked}
                                    onChange={() => togglePackingItem(item.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#2A3F7E] focus:ring-0 cursor-pointer"
                                  />
                                  <span className={item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}>
                                    {item.title}
                                  </span>
                                </label>
                                <button
                                  onClick={() => deletePersonalPackingItem(item.id)}
                                  className="text-gray-400 hover:text-red-700 p-0.5 rounded transition cursor-pointer"
                                  title="حذف"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header and filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE6DC] pb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#D52B1E]">مسار الرحلة والنشاطات اليومية</h2>
                <p className="text-xs text-gray-500 mt-1">تتبع خط سير الرحلة وقادة اليوم المسؤولين عن التنسيق والمجموعات</p>
              </div>

              {/* City selector buttons */}
              <div className="flex gap-1.5 bg-[#ECE6DC]/50 p-1 rounded-xl border border-[#ECE6DC]">
                {['الكل', 'موسكو', 'سان بطرسبرغ', 'ريف موسكو'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setItineraryCityFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      itineraryCityFilter === c 
                        ? 'bg-[#2A3F7E] text-white shadow-xs' 
                        : 'text-gray-600 hover:text-[#14172A]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* LOCKED WARNING */}
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <Lock size={14} className="text-amber-700" />
                <span>تم قفل تعديل المسار من قبل منظم الرحلة. يمكنك الاطلاع على الخطة فقط.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
              {/* Daily timeline list */}
              <div className="lg:col-span-2 space-y-5">
                {itinerary
                  .filter(item => itineraryCityFilter === 'الكل' || item.city.includes(itineraryCityFilter))
                  .map((item) => {
                    const isActive = item.day === simulatedActiveDay;
                    const calculatedDate = getDateForDay(tripStartDate, item.day);
                    return (
                      <div key={item.id} className="relative pl-0 pr-6 border-r border-[#ECE6DC] last:border-0 pb-1">
                        {/* Timeline dot */}
                        <span className={`absolute top-1 right-[-4.5px] w-2.5 h-2.5 rounded-full border border-white ${
                          isActive ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-[#2A3F7E]'
                        }`} />
                        
                        <div className={`white-card p-5 rounded-xl transition-all space-y-2 ${
                          isActive 
                            ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30' 
                            : 'hover:border-[#2A3F7E]/40'
                        }`}>
                          {editingActivityId === item.id ? (
                            <div className="space-y-3 text-right">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-gray-400 font-bold block">يوم الرحلة</label>
                                  <input 
                                    type="number"
                                    value={editActivityData.day}
                                    onChange={(e) => setEditActivityData(prev => ({ ...prev, day: e.target.value }))}
                                    className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-left font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-400 font-bold block">المدينة</label>
                                  <select
                                    value={editActivityData.city}
                                    onChange={(e) => setEditActivityData(prev => ({ ...prev, city: e.target.value }))}
                                    className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-right cursor-pointer"
                                  >
                                    <option value="موسكو">موسكو</option>
                                    <option value="ريف موسكو">ريف موسكو</option>
                                    <option value="سانت بطرسبرغ">سانت بطرسبرغ</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-bold block">قائد اليوم</label>
                                <select
                                  value={editActivityData.leader}
                                  onChange={(e) => setEditActivityData(prev => ({ ...prev, leader: e.target.value }))}
                                  className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-right cursor-pointer"
                                >
                                  {travelers.map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-bold block">عنوان اليوم</label>
                                <input 
                                  type="text"
                                  value={editActivityData.title}
                                  onChange={(e) => setEditActivityData(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-bold block">الأنشطة والتفاصيل</label>
                                <textarea 
                                  rows="3"
                                  value={editActivityData.activities}
                                  onChange={(e) => setEditActivityData(prev => ({ ...prev, activities: e.target.value }))}
                                  className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs leading-relaxed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-bold block">ملاحظات (مطاعم ومقاهي مقترحة)</label>
                                <input 
                                  type="text"
                                  value={editActivityData.notes}
                                  onChange={(e) => setEditActivityData(prev => ({ ...prev, notes: e.target.value }))}
                                  className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveActivityEdit(item.id)}
                                  className="bg-[#2A3F7E] hover:bg-[#1B2D64] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                                >
                                  حفظ
                                </button>
                                <button
                                  onClick={() => setEditingActivityId(null)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE6DC]/60 pb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-[#2A3F7E]/10 border border-[#2A3F7E]/20 text-[#2A3F7E] font-bold px-2 py-0.5 rounded text-[10px] font-mono">اليوم {item.day}</span>
                                  <span className="text-gray-400 text-[10px] font-mono">{calculatedDate}</span>
                                  
                                  {/* Leader Badge */}
                                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 shadow-2xs">
                                    <Crown size={10} className="text-amber-600" />
                                    <span>قائد اليوم: {item.leader || 'عبدالله'}</span>
                                  </span>

                                  {isActive && (
                                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide flex items-center gap-1 animate-pulse">
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                      <span>اليوم الحالي للرحلة</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1 text-[10px] text-[#2A3F7E] font-bold">
                                    <MapPin size={11} />
                                    {item.city}
                                  </span>
                                  {canEdit && (
                                    <div className="flex items-center gap-1.5">
                                      <button 
                                        onClick={() => startEditingActivity(item)}
                                        className="text-gray-400 hover:text-[#2A3F7E] p-0.5 rounded transition cursor-pointer"
                                        title="تعديل اليوم"
                                      >
                                        <Edit3 size={13} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteActivity(item.id)}
                                        className="text-gray-400 hover:text-red-700 p-0.5 rounded transition cursor-pointer"
                                        title="حذف اليوم"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <h4 className="font-extrabold text-[#14172A] text-sm">{item.title}</h4>
                              <p className="text-xs text-gray-600 font-light leading-relaxed m-0">{item.activities}</p>
                              {item.notes && (
                                <div className="bg-[#2A3F7E]/5 border-r-2 border-[#2A3F7E] p-2.5 rounded-l-lg text-[11px] text-[#1B2D64] font-semibold mt-1">
                                  · {item.notes}
                                </div>
                              )}

                              {/* ─── PLACES (multi-stop) ─── */}
                              {((item.places || []).length > 0 || canEdit) && (
                                <div className="mt-3 pt-3 border-t border-[#ECE6DC] space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-black text-[#D52B1E] flex items-center gap-1">
                                      <MapPin size={12} />
                                      <span>أماكن مقترحة لهذا اليوم</span>
                                    </h5>
                                    {canEdit && (
                                      <button
                                        type="button"
                                        onClick={() => setOpenPlaceFormDay(openPlaceFormDay === item.id ? null : item.id)}
                                        className="text-[10px] font-black text-[#2A3F7E] bg-[#EEF1F8] hover:bg-[#2A3F7E] hover:text-white px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                                      >
                                        <Plus size={11} />
                                        <span>{openPlaceFormDay === item.id ? 'إلغاء' : 'مكان'}</span>
                                      </button>
                                    )}
                                  </div>

                                  {/* Places list */}
                                  {(item.places || []).map((place) => {
                                    const typeColor = place.type === 'مطعم' ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : place.type === 'مقهى' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200';
                                    return (
                                      <div key={place.id} className="flex items-start gap-2 bg-white border border-[#ECE6DC] rounded-xl p-2.5 group">
                                        <span className={`text-[9px] font-black border px-2 py-0.5 rounded-full shrink-0 ${typeColor}`}>
                                          {place.type || 'معلم'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-bold text-[#14172A] truncate m-0">{place.name}</p>
                                          {place.note && <p className="text-[10px] text-gray-500 mt-0.5 m-0">{place.note}</p>}
                                        </div>
                                        {canEdit && (
                                          <button
                                            type="button"
                                            onClick={() => deletePlaceFromDay(item.id, place.id)}
                                            className="opacity-60 hover:opacity-100 text-rose-600 cursor-pointer"
                                            title="حذف"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}

                                  {/* Inline add form */}
                                  {canEdit && openPlaceFormDay === item.id && (
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        const data = newPlaceByDay[item.id] || {};
                                        if (!data.name?.trim()) {
                                          showToast('اكتب اسم المكان', 'error');
                                          return;
                                        }
                                        addPlaceToDay(item.id, {
                                          name: data.name.trim(),
                                          type: data.type || 'معلم',
                                          note: (data.note || '').trim()
                                        });
                                        setNewPlaceByDay(prev => ({ ...prev, [item.id]: { name: '', type: 'معلم', note: '' } }));
                                        setOpenPlaceFormDay(null);
                                      }}
                                      className="bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl p-3 space-y-2"
                                    >
                                      <div className="flex gap-2">
                                        <select
                                          value={newPlaceByDay[item.id]?.type || 'معلم'}
                                          onChange={(e) => setNewPlaceByDay(prev => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), type: e.target.value } }))}
                                          className="bg-white border border-[#ECE6DC] rounded-lg px-2 py-1.5 text-[11px] font-bold text-[#14172A] focus:outline-none focus:border-[#2A3F7E] cursor-pointer"
                                        >
                                          <option value="معلم">معلم</option>
                                          <option value="مطعم">مطعم</option>
                                          <option value="مقهى">مقهى</option>
                                          <option value="تسوق">تسوق</option>
                                          <option value="جولة">جولة</option>
                                        </select>
                                        <input
                                          type="text"
                                          placeholder="اسم المكان"
                                          value={newPlaceByDay[item.id]?.name || ''}
                                          onChange={(e) => setNewPlaceByDay(prev => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), name: e.target.value } }))}
                                          className="flex-1 bg-white border border-[#ECE6DC] rounded-lg px-2 py-1.5 text-[11px] text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                                        />
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="ملاحظة (اختياري)"
                                        value={newPlaceByDay[item.id]?.note || ''}
                                        onChange={(e) => setNewPlaceByDay(prev => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), note: e.target.value } }))}
                                        className="w-full bg-white border border-[#ECE6DC] rounded-lg px-2 py-1.5 text-[11px] text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                                      />
                                      <button
                                        type="submit"
                                        className="w-full bg-[#2A3F7E] hover:bg-[#1B2D64] text-white py-1.5 rounded-lg text-[11px] font-black cursor-pointer flex items-center justify-center gap-1"
                                      >
                                        <Plus size={12} />
                                        <span>حفظ المكان</span>
                                      </button>
                                    </form>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Add Activity Sidebar */}
              <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                  <Plus className="text-[#2A3F7E]" size={18} />
                  <h3 className="text-sm font-bold text-[#14172A]">إضافة يوم جديد للمسار</h3>
                </div>

                {canEdit ? (
                  <form onSubmit={handleAddActivity} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">يوم الرحلة (رقم)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={newActivity.day}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, day: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-left font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">الوجهة / المدينة</label>
                      <select
                        value={newActivity.city}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="موسكو">موسكو</option>
                        <option value="ريف موسكو">ريف موسكو</option>
                        <option value="سانت بطرسبرغ">سانت بطرسبرغ</option>
                        <option value="موسكو إلى سان بطرسبرغ">تنقل (موسكو إلى سان بطرسبرغ)</option>
                        <option value="سان بطرسبرغ إلى موسكو">تنقل (سان بطرسبرغ إلى موسكو)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">قائد اليوم المسؤول</label>
                      <select
                        value={newActivity.leader}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, leader: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        {travelers.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">عنوان اليوم</label>
                      <input 
                        type="text" 
                        placeholder="مثال: جولة كروز بحرية"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">التفاصيل والأنشطة</label>
                      <textarea 
                        rows="3"
                        placeholder="صف نشاطات هذا اليوم بالتفصيل..."
                        value={newActivity.activities}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, activities: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">ملاحظات (مطاعم ومقاهي مقترحة)</label>
                      <input 
                        type="text" 
                        placeholder="مثال: تجربة كافيه Grand Kafe..."
                        value={newActivity.notes || ''}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>إضافة إلى الجدول</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs font-medium space-y-2">
                    <Lock size={20} className="mx-auto text-gray-300" />
                    <p>نموذج الإضافة معطل بسبب قفل التعديل.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-[#ECE6DC] pb-6">
              <h2 className="text-xl md:text-2xl font-black text-[#D52B1E]">الحجوزات والتذاكر المؤكدة</h2>
              <p className="text-xs text-gray-500 mt-1">تأكيد ومتابعة حجوزات الطيران الدولي والداخلي والسكن المشترك والقطارات</p>
            </div>

            {/* LOCKED WARNING */}
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <Lock size={14} className="text-amber-700" />
                <span>تم قفل تعديل الحجوزات من قبل منظم الرحلة. يمكنك الاطلاع فقط.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bookings List */}
              <div className="lg:col-span-2 space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="white-card p-5 rounded-xl flex flex-col justify-between gap-4 hover:border-[#ECE6DC] transition-all duration-200">
                    {editingBookingId === booking.id ? (
                      <div className="w-full space-y-3 text-right">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold block">النوع</label>
                            <select
                              value={editBookingData.type}
                              onChange={(e) => setEditBookingData(prev => ({ ...prev, type: e.target.value }))}
                              className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-right cursor-pointer"
                            >
                              <option value="طيران">طيران</option>
                              <option value="سكن">سكن</option>
                              <option value="قطار">قطار</option>
                              <option value="فعالية">فعالية</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold block">الحالة</label>
                            <select
                              value={editBookingData.status}
                              onChange={(e) => setEditBookingData(prev => ({ ...prev, status: e.target.value }))}
                              className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-right cursor-pointer"
                            >
                              <option value="مستهدف">مستهدف</option>
                              <option value="مؤكد">مؤكد</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold block">اسم الحجز</label>
                          <input 
                            type="text"
                            value={editBookingData.title}
                            onChange={(e) => setEditBookingData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold block">التفاصيل</label>
                          <textarea 
                            rows="2"
                            value={editBookingData.details}
                            onChange={(e) => setEditBookingData(prev => ({ ...prev, details: e.target.value }))}
                            className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs leading-relaxed"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveBookingEdit(booking.id)}
                            className="bg-[#2A3F7E] hover:bg-[#1B2D64] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            حفظ
                          </button>
                          <button
                            onClick={() => setEditingBookingId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center shrink-0 text-[#2A3F7E]">
                            {booking.type === 'طيران' ? <Plane size={20} /> : booking.type === 'سكن' ? <Hotel size={20} /> : <FileText size={20} />}
                          </div>
                          <div className="text-right space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-[#2A3F7E] bg-[#2A3F7E]/10 px-1.5 py-0.5 rounded font-bold">{booking.type}</span>
                              <h4 className="font-extrabold text-[#14172A] text-sm">{booking.title}</h4>
                            </div>
                            <p className="text-xs text-gray-600 font-light leading-relaxed m-0">{booking.details}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[#ECE6DC] pt-3 sm:pt-0">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                            booking.status === 'مؤكد' 
                              ? 'bg-[#2A3F7E]/10 text-[#2A3F7E] border-[#2A3F7E]/25' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {booking.status === 'مؤكد' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            <span>{booking.status}</span>
                          </span>
                          
                          {canEdit && (
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => startEditingBooking(booking)}
                                className="text-gray-400 hover:text-[#2A3F7E] p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                title="تعديل الحجز"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button 
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="text-gray-400 hover:text-red-700 p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                title="حذف الحجز"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Booking Sidebar */}
              <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                  <Plus className="text-[#2A3F7E]" size={18} />
                  <h3 className="text-sm font-bold text-[#14172A]">إضافة حجز جديد للرحلة</h3>
                </div>

                {canEdit ? (
                  <form onSubmit={handleAddBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">نوع الحجز</label>
                      <select
                        value={newBooking.type}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="طيران">طيران دولي أو داخلي</option>
                        <option value="سكن">فندق أو شقة</option>
                        <option value="قطار">تذكرة قطار بين المدن</option>
                        <option value="فعالية">جولات وتذاكر فعاليات</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">اسم الحجز / الوصف</label>
                      <input 
                        type="text" 
                        placeholder="مثال: قطار سابسان"
                        value={newBooking.title}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">حالة الحجز</label>
                      <select
                        value={newBooking.status}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="مستهدف">مستهدف / غير محجوز</option>
                        <option value="مؤكد">مؤكد ومحجوز</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">تفاصيل الحجز</label>
                      <textarea 
                        rows="3"
                        placeholder="رقم الرحلة، العنوان، السعر..."
                        value={newBooking.details}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, details: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] leading-relaxed"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>إضافة الحجز جديد</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs font-medium space-y-2">
                    <Lock size={20} className="mx-auto text-gray-300" />
                    <p>نموذج الإضافة معطل بسبب قفل التعديل.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-8 animate-fadeIn text-right">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE6DC] pb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#D52B1E]">قائمة المهام المشتركة</h2>
                <p className="text-xs text-gray-500 mt-1">توزيع التجهيزات والمهام التنظيمية العامة قبل الرحلة ومتابعة جاهزيتها</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 justify-end">
                <span>المهام المنجزة:</span>
                <span className="bg-[#2A3F7E]/10 text-[#2A3F7E] px-2.5 py-0.5 rounded-full border border-[#2A3F7E]/20">
                  {financeStats.completedTasks} من {financeStats.totalTasks} ({financeStats.taskPercent}%)
                </span>
              </div>
            </div>

            {/* LOCKED WARNING */}
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <Lock size={14} className="text-amber-700" />
                <span>تم قفل تعديل المهام من قبل منظم الرحلة. يمكنك الاطلاع وتأكيد مهامك فقط.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Task List Column */}
              <div className="lg:col-span-2 space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`white-card p-4 rounded-xl flex items-center justify-between gap-4 transition-all border-r-4 ${
                      task.completed ? 'border-r-[#2A3F7E] bg-[#2A3F7E]/5' : 'border-r-[#ECE6DC]'
                    }`}
                  >
                    {editingTaskId === task.id ? (
                      <div className="w-full space-y-3 text-right">
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold block">اسم المهمة</label>
                          <input 
                            type="text"
                            value={editTaskData.title}
                            onChange={(e) => setEditTaskData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold block">المسؤول</label>
                            <select
                              value={editTaskData.assignee}
                              onChange={(e) => setEditTaskData(prev => ({ ...prev, assignee: e.target.value }))}
                              className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-right cursor-pointer font-bold"
                            >
                              <option value="الجميع">الجميع</option>
                              {travelers.map(t => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold block">التصنيف</label>
                            <select
                              value={editTaskData.category}
                              onChange={(e) => setEditTaskData(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-lg p-2 text-xs text-right cursor-pointer"
                            >
                              <option value="تجهيزات">تجهيزات واستعدادات</option>
                              <option value="لوجستيات">حجوزات ولوجستيات</option>
                              <option value="برامج">أنشطة ومخططات</option>
                              <option value="مالية">أمور مالية وتكاليف</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-lg border border-[#ECE6DC]">
                          <input 
                            type="checkbox" 
                            id={`edit-critical-${task.id}`}
                            checked={editTaskData.isCritical}
                            onChange={(e) => setEditTaskData(prev => ({ ...prev, isCritical: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-[#2A3F7E] focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor={`edit-critical-${task.id}`} className="text-xs font-bold text-gray-600 cursor-pointer select-none">تعليم هذه المهمة كحرجة وعاجلة</label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveTaskEdit(task.id)}
                            className="bg-[#2A3F7E] hover:bg-[#1B2D64] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            حفظ
                          </button>
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                              task.completed 
                                ? 'bg-[#2A3F7E] border-[#2A3F7E] text-white' 
                                : 'border-gray-300 hover:border-[#2A3F7E] text-transparent'
                            }`}
                          >
                            <Check size={12} className="stroke-[3]" />
                          </button>
                          
                          <div className="text-right">
                            <span className={`text-xs ${task.completed ? 'text-gray-400 line-through' : 'text-[#14172A] font-semibold'} flex items-center gap-1.5`}>
                              {task.title}
                              {task.isCritical && !task.completed && (
                                <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[8px] font-black">هام وعاجل</span>
                              )}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[9px] text-gray-500">
                              <span className="bg-[#ECE6DC]/50 px-1.5 py-0.2 rounded font-semibold">{task.category}</span>
                              <span>المسؤول: <strong className="text-[#2A3F7E] font-bold">{task.assignee}</strong></span>
                            </div>
                          </div>
                        </div>

                        {canEdit && (
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => startEditingTask(task)}
                              className="text-gray-400 hover:text-[#2A3F7E] p-1 rounded hover:bg-gray-100 transition cursor-pointer"
                              title="تعديل المهمة"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-400 hover:text-red-700 p-1 rounded transition cursor-pointer"
                              title="حذف المهمة"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                  <Plus className="text-[#2A3F7E]" size={18} />
                  <h3 className="text-sm font-bold text-[#14172A] font-sans">إنشاء مهمة جديدة</h3>
                </div>

                {canEdit ? (
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المهمة</label>
                      <input 
                        type="text" 
                        placeholder="مثال: حجز قطار سابسان"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المسؤول عن التجهيز</label>
                      <select
                        value={newTask.assignee}
                        onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="الجميع">الجميع</option>
                        {travelers.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">التصنيف</label>
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="تجهيزات">تجهيزات واستعدادات</option>
                        <option value="لوجستيات">حجوزات ولوجستيات</option>
                        <option value="برامج">أنشطة ومخططات</option>
                        <option value="مالية">أمور مالية وتكاليف</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-xl border border-[#ECE6DC]">
                      <input 
                        type="checkbox" 
                        id="critical-task-checkbox"
                        checked={newTask.isCritical}
                        onChange={(e) => setNewTask(prev => ({ ...prev, isCritical: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#2A3F7E] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="critical-task-checkbox" className="text-xs font-bold text-gray-600 cursor-pointer select-none">تعليم هذه المهمة كحرجة وعاجلة</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>إضافة المهمة</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs font-medium space-y-2">
                    <Lock size={20} className="mx-auto text-gray-300" />
                    <p>نموذج الإضافة معطل بسبب قفل التعديل.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FINANCIALS & FUND ("المالية والقطة" - Unified expenses, reserve and members Qatta) */}
        {activeTab === 'expenses' && (
          <div className="space-y-8 animate-fadeIn text-right">
            <div className="border-b border-[#ECE6DC] pb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#D52B1E]">صندوق الرحلة والميزانية العامة (المالية والقطة)</h2>
                <p className="text-xs text-gray-500 mt-1">تتبع الصندوق والقطة المشتركة، مبالغ الاحتياطي، وتسجيل نفقات الصندوق أو المشتريات الشخصية بالتفصيل</p>
              </div>
              {pricingPlan === 'free' && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-amber-100 border border-amber-300 text-amber-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer animate-pulse"
                >
                  <Crown size={12} className="text-amber-700" />
                  <span>تنشيط الميزات المالية الفائقة للرحلة</span>
                </button>
              )}
            </div>

            {/* ─── BUDGET BANNER: single prominent hero card with smart color states ─── */}
            {(() => {
              const isDeficit = financeStats.remainingFund < 0;
              const isLow = !isDeficit && financeStats.totalFundCollected > 0 && financeStats.remainingFund / financeStats.totalFundCollected < 0.2;
              const pctSpent = financeStats.totalFundCollected > 0
                ? Math.min(100, Math.round((financeStats.spentFromFund / financeStats.totalFundCollected) * 100))
                : 0;
              const bannerBg = isDeficit
                ? 'bg-gradient-to-br from-[#D52B1E] via-[#B92214] to-[#8C1810]'
                : 'bg-gradient-to-br from-[#2A3F7E] via-[#1B2D64] to-[#0F1E48]';
              return (
                <div className={`relative overflow-hidden rounded-3xl ${bannerBg} text-white p-5 md:p-7 shadow-lg`}>
                  {/* Russian flag stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 flex">
                    <div className="flex-1 bg-white"></div>
                    <div className="flex-1 bg-[#0036A7]"></div>
                    <div className="flex-1 bg-[#D62718]"></div>
                  </div>
                  <div className="absolute -bottom-8 -left-8 opacity-10 pointer-events-none">
                    <Coins size={140} />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs md:text-sm text-white/75 font-medium">
                          {isDeficit ? 'الصندوق في عجز - يحتاج تغذية' : 'الرصيد المتبقي في الصندوق المشترك'}
                        </p>
                        <p className="text-3xl md:text-4xl font-black tabular-nums leading-tight mt-1.5" dir="ltr" style={{ textAlign: 'right' }}>
                          {isDeficit && '−'}{Math.abs(financeStats.remainingFund).toLocaleString()} <span className="text-lg md:text-xl font-bold opacity-90">ر.س</span>
                        </p>
                      </div>
                      {isDeficit && (
                        <span className="bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] md:text-xs font-black whitespace-nowrap">
                          عجز
                        </span>
                      )}
                      {isLow && (
                        <span className="bg-amber-400/20 border border-amber-300/40 text-amber-100 rounded-full px-3 py-1 text-[10px] md:text-xs font-black whitespace-nowrap">
                          منخفض
                        </span>
                      )}
                    </div>

                    {/* Progress bar — only meaningful when there's fund collected */}
                    {financeStats.totalFundCollected > 0 && !isDeficit && (
                      <div>
                        <div className="flex justify-between text-[10px] md:text-xs text-white/70 mb-1.5 font-bold">
                          <span>صُرف {financeStats.spentFromFund.toLocaleString()} ر.س</span>
                          <span>من {financeStats.totalFundCollected.toLocaleString()} ر.س</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${pctSpent}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* Quick stats row */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-2.5 text-center">
                        <p className="text-[9px] md:text-[10px] text-white/70 font-bold">المُحصّل</p>
                        <p className="text-sm md:text-base font-black tabular-nums mt-0.5">{financeStats.totalFundCollected.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-2.5 text-center">
                        <p className="text-[9px] md:text-[10px] text-white/70 font-bold">المصروف</p>
                        <p className="text-sm md:text-base font-black tabular-nums mt-0.5">{financeStats.spentFromFund.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-2.5 text-center">
                        <p className="text-[9px] md:text-[10px] text-white/70 font-bold">شخصي مستحق</p>
                        <p className="text-sm md:text-base font-black tabular-nums mt-0.5">{financeStats.totalPersonalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Contribution and Reserve Cash Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contributions & Reserve editing */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Member Contributions */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
                    <h3 className="text-xs font-black text-gray-800">حالة دفع قطة السفر المشتركة (المستهدف: 5,000 ر.س لكل شخص)</h3>
                    {isFinanceSupervisor && (
                      <span className="text-[8px] bg-[#2A3F7E]/10 border border-[#2A3F7E]/30 text-[#2A3F7E] px-2 py-0.5 rounded font-black">
                        أنت مخول بالتعديل
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right divide-y divide-[#ECE6DC]">
                      <thead>
                        <tr className="text-gray-500 font-bold">
                          <th className="pb-2">اسم العضو</th>
                          <th className="pb-2 text-center">المستهدف (ر.س)</th>
                          <th className="pb-2 text-center">المدفوع الفعلي (ر.س)</th>
                          <th className="pb-2 text-center">المتبقي (ر.س)</th>
                          <th className="pb-2 text-left">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECE6DC]/50 text-gray-700 font-medium">
                        {fundContributions.map(contrib => {
                          const isFullyPaid = contrib.paid >= contrib.target;
                          const isPartial = contrib.paid > 0 && contrib.paid < contrib.target;
                          return (
                            <tr key={contrib.id} className="py-2.5">
                              <td className="py-3 font-extrabold">{contrib.name}</td>
                              <td className="py-3 text-center">
                                {isFinanceSupervisor ? (
                                  <input 
                                    type="number"
                                    value={contrib.target}
                                    onChange={(e) => handleUpdateContTarget(contrib.id, e.target.value)}
                                    className="bg-[#FAF7F2] border border-[#ECE6DC] rounded px-1.5 py-1 text-[10px] text-center w-20 font-mono"
                                  />
                                ) : (
                                  contrib.target.toLocaleString()
                                )}
                              </td>
                              <td className="py-3 text-center">
                                {isFinanceSupervisor ? (
                                  <input 
                                    type="number"
                                    value={contrib.paid}
                                    onChange={(e) => handleUpdateContribution(contrib.id, e.target.value)}
                                    className="bg-[#FAF7F2] border border-[#ECE6DC] rounded px-1.5 py-1 text-[10px] text-center w-20 font-mono"
                                  />
                                ) : (
                                  contrib.paid.toLocaleString()
                                )}
                              </td>
                              <td className="py-3 text-center font-mono font-bold">
                                {Math.max(0, contrib.target - contrib.paid).toLocaleString()}
                              </td>
                              <td className="py-3 text-left">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  isFullyPaid 
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : isPartial
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}>
                                  {isFullyPaid ? 'دفع بالكامل' : isPartial ? 'دفع جزئي' : 'لم يدفع بعد'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Reserve Fund Editing Box */}
                  <div className="pt-4 border-t border-[#ECE6DC] flex items-center justify-between flex-wrap gap-4 bg-[#FAF7F2] p-3 rounded-xl">
                    <div className="text-right">
                      <h4 className="text-xs font-bold text-gray-700">مبالغ الصندوق الاحتياطية والطوارئ</h4>
                      <p className="text-[9px] text-gray-400">مبلغ إضافي كاش في الصندوق لحالات الطوارئ المباغتة</p>
                    </div>
                    <div>
                      {isFinanceSupervisor ? (
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number"
                            value={reserveFund}
                            onChange={(e) => setReserveFund(parseFloat(e.target.value) || 0)}
                            className="bg-white border border-[#ECE6DC] rounded-lg px-2 py-1 text-xs text-center w-24 font-mono font-bold focus:outline-none focus:border-[#2A3F7E]"
                          />
                          <span className="text-xs text-gray-500 font-bold">ر.س</span>
                        </div>
                      ) : (
                        <span className="font-mono font-black text-gray-800">{reserveFund.toLocaleString()} ر.س</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Budget distribution categories */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-black text-gray-800">تحليلات وتوزيع ميزانية الرحلة (حسب البنود)</h3>
                    <span className="text-[9px] text-gray-400 font-bold">إجمالي النفقات المسجلة: {financeStats.totalSpentAll.toLocaleString()} ر.س</span>
                  </div>
                  <div className="space-y-4">
                    {financeStats.categoryBreakdown.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                          <span>{cat.name}</span>
                          <span className="font-mono text-gray-800">{cat.amount.toLocaleString()} ر.س ({cat.percent}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`${cat.color} h-full transition-all duration-500`} 
                            style={{ width: `${cat.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Advanced Currency Converter */}
                <div className="white-card p-6 rounded-2xl space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-black text-gray-800">حاسبة محول العملات الذكي للرحلة (SAR - RUB - USD)</h3>
                    <span className="text-[9px] text-[#2A3F7E] font-bold">معدل الصرف: 1 ر.س = {currencyRates.rub} روبل</span>
                  </div>

                  {pricingPlan === 'free' ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 bg-[#FAF7F2]/80 rounded-2xl border border-dashed border-[#ECE6DC] p-6">
                      <Lock className="text-amber-600 animate-pulse" size={24} />
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-800">ميزة محول العملات المتكامل مغلقة</h4>
                        <p className="text-[10px] text-gray-500 max-w-xs leading-relaxed mt-1">
                          قم بترقية خطة الرحلة إلى باقة **شدّاد برو** لفتح حاسبة الصرف وتحويل العملات الفوري للروبل والعملات الأخرى للتسوق بالخارج بسهولة.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] transition cursor-pointer"
                      >
                        ترقية الرحلة لفتح الحاسبة
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Convert SAR to RUB / USD */}
                      <div className="bg-[#FAF7F2] border border-[#ECE6DC] p-4 rounded-xl space-y-3">
                        <h4 className="text-xs font-bold text-gray-700">تحويل من ريال سعودي (SAR)</h4>
                        <div className="space-y-2">
                          <div>
                            <input 
                              type="number"
                              value={calcAmountSar}
                              onChange={(e) => setCalcAmountSar(e.target.value)}
                              className="w-full bg-white border border-[#ECE6DC] rounded-lg p-2 text-xs font-mono text-left focus:outline-none focus:border-[#2A3F7E]"
                              placeholder="أدخل المبلغ بالريال..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-200/50">
                            <div>
                              <span className="text-[9px] text-gray-400 block">الروبل الروسي:</span>
                              <span className="font-mono font-bold text-[#2A3F7E]">{((parseFloat(calcAmountSar) || 0) * currencyRates.rub).toLocaleString(undefined, { maximumFractionDigits: 2 })} RUB</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 block">الدولار الأمريكي:</span>
                              <span className="font-mono font-bold text-gray-700">{((parseFloat(calcAmountSar) || 0) * currencyRates.usd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Convert RUB to SAR */}
                      <div className="bg-[#FAF7F2] border border-[#ECE6DC] p-4 rounded-xl space-y-3">
                        <h4 className="text-xs font-bold text-gray-700">تحويل من روبل روسي (RUB)</h4>
                        <div className="space-y-2">
                          <div>
                            <input 
                              type="number"
                              value={calcAmountRub}
                              onChange={(e) => setCalcAmountRub(e.target.value)}
                              className="w-full bg-white border border-[#ECE6DC] rounded-lg p-2 text-xs font-mono text-left focus:outline-none focus:border-[#2A3F7E]"
                              placeholder="أدخل المبلغ بالروبل..."
                            />
                          </div>
                          <div className="text-xs pt-1 border-t border-gray-200/50">
                            <span className="text-[9px] text-gray-400 block">الريال السعودي الموازي:</span>
                            <span className="font-mono font-bold text-[#2A3F7E]">{((parseFloat(calcAmountRub) || 0) / currencyRates.rub).toLocaleString(undefined, { maximumFractionDigits: 2 })} SAR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Advanced Settlement ledger */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-start gap-2.5 justify-start">
                    <Info className="text-[#2A3F7E] shrink-0 mt-0.5" size={16} />
                    <div className="text-right">
                      <h4 className="font-black text-xs text-gray-800">مخلص التسوية المالية الخاصة (للشباب)</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                        هذا التقرير يستعرض تسوية المبالغ المدفوعة من الجيوب الخاصة (المصروفات غير المدفوعة من الصندوق المشترك). يتم احتساب حصة الفرد العادلة لتحديد من يجب عليه التحويل ومقدار التحويل للآخرين.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE6DC] p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                      <span>إجمالي المدفوع شخصياً:</span>
                      <span className="font-mono text-[#14172A]">{financeStats.totalPersonalSpent.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#2A3F7E] border-b border-[#ECE6DC] pb-2">
                      <span>نصيب الشخص الواحد للرحلة:</span>
                      <span className="font-mono">{financeStats.splitSharePerPerson.toLocaleString()} ر.س</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {financeStats.travelerBalances.map((item, idx) => {
                        const mustPay = item.balance < 0;
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-gray-700">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">دفع: {item.paid.toLocaleString()} ر.س</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                                mustPay 
                                  ? 'bg-rose-50 text-rose-800 border border-rose-100'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              }`}>
                                {mustPay 
                                  ? `يجب عليه دفع ${Math.abs(Math.round(item.balance)).toLocaleString()} ر.س`
                                  : `يستحق استلام ${Math.round(item.balance).toLocaleString()} ر.س`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Greedy matching ledger (SaaS premium lock) */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <h4 className="text-xs font-black text-gray-800">خارطة التحويلات والتسويات المباشرة لإنهاء العوالق</h4>
                    
                    {pricingPlan === 'free' ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 bg-[#FAF7F2]/60 rounded-xl border border-dashed border-[#ECE6DC] p-4">
                        <Lock className="text-amber-600" size={18} />
                        <div>
                          <h5 className="text-[11px] font-bold text-gray-800">ميزة خارطة التحويلات التلقائية مغلقة</h5>
                          <p className="text-[9px] text-gray-400 leading-normal max-w-xs mt-0.5">
                            باقة برو تمنحك تعليمات تسوية ثنائية دقيقة تحدد من يدفع لمن ومقدار الدفعة لتجنب اللخبطة.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-3 rounded-lg text-[9px] transition cursor-pointer"
                        >
                          تفعيل برو
                        </button>
                      </div>
                    ) : (
                      <div>
                        {financeStats.settlementInstructions.length === 0 ? (
                          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-center rounded-xl text-xs font-bold">
                            جميع المديونيات تمت تسويتها بالكامل. الحساب صافي بين الشباب.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {financeStats.settlementInstructions.map((inst, idx) => (
                              <div key={idx} className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl flex items-center justify-between text-xs gap-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <strong className="text-gray-900 font-extrabold">{inst.from}</strong>
                                  <span className="text-gray-500 text-[10px]">يقوم بتحويل</span>
                                  <strong className="text-emerald-700 font-black font-mono">{inst.amount.toLocaleString()} ر.س</strong>
                                  <span className="text-gray-500 text-[10px]">إلى</span>
                                  <strong className="text-gray-900 font-extrabold">{inst.to}</strong>
                                </div>
                                <div className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-black border border-emerald-100 flex items-center gap-0.5">
                                  <Check size={10} />
                                  <span>بانتظار التحويل</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Expenses Log & Registry */}
                <div className="white-card p-6 rounded-2xl space-y-4 order-2 lg:order-1">
                  <h3 className="text-sm md:text-base font-black text-[#D52B1E] border-b border-[#ECE6DC] pb-3">سجل المصروفات ومشتريات الصندوق</h3>
                  
                  <div className="divide-y divide-[#ECE6DC]/50">
                    {expenses.map((expense) => {
                      const isFund = expense.paidBy === 'الصندوق';
                      return (
                        <div key={expense.id} className="py-3 flex items-center justify-between text-xs gap-3">
                          <div className="text-right space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                                isFund 
                                  ? 'bg-[#2A3F7E]/10 text-[#2A3F7E] border border-[#2A3F7E]/20'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}>
                                {isFund ? 'خصم من الصندوق' : 'مدفوع شخصي'}
                              </span>
                              <h4 className="font-extrabold text-gray-800">{expense.description}</h4>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">{expense.date}</span>
                          </div>

                          <div className="flex items-center gap-4 text-left">
                            <div>
                              <span className="text-[9px] text-gray-400 block">دفع بواسطة:</span>
                              <span className="font-bold text-gray-700 block text-left">{expense.paidBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-extrabold text-[#2A3F7E] font-mono">{expense.amountSar.toLocaleString()} ر.س</span>
                              {canEdit && (
                                <button
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="text-gray-400 hover:text-red-700 p-1 hover:bg-gray-100 rounded transition cursor-pointer"
                                  title="حذف"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Add Expense Sidebar Form — placed first on mobile so it's easy to find */}
              <div className="white-card p-6 rounded-2xl h-fit space-y-4 order-1 lg:order-2 border-2 border-[#2A3F7E]/20">
                <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                  <Plus className="text-[#D52B1E]" size={20} />
                  <h3 className="text-base md:text-lg font-black text-[#D52B1E]">تسجيل مصروف جديد</h3>
                </div>

                {canEdit ? (
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">التفاصيل أو البند</label>
                      <input 
                        type="text" 
                        placeholder="مثال: قطار سابسان السريع"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المبلغ الإجمالي (بالريال السعودي)</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={newExpense.amountSar}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amountSar: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] font-mono text-left"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">طريقة الدفع (خصم من)</label>
                      <select
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, paidBy: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="الصندوق">الصندوق المشترك (خصم من رصيد القطة)</option>
                        {travelers.map(t => (
                          <option key={t.id} value={t.name}>{t.name} (دفع من جيبه الخاص)</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>تسجيل المصروف</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs font-medium space-y-2">
                    <Lock size={20} className="mx-auto text-gray-300" />
                    <p>نموذج الإضافة معطل بسبب قفل التعديل.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PROPOSALS & VOTING BOARD */}
        {activeTab === 'proposals' && (
          <div className="space-y-8 animate-fadeIn text-right">
            <div className="border-b border-[#ECE6DC] pb-6">
              <h2 className="text-xl md:text-2xl font-black text-[#D52B1E]">مجلس المقترحات والقرارات المشتركة</h2>
              <p className="text-xs text-gray-500 mt-1">اطرح استطلاعات رأي أو مقترحات ثنائية لتصويت الشباب لحسم الخيارات والأنشطة وإدماجها تلقائياً بالجدول</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Polls & Proposals list */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Multi-Option Polls Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 border-b border-gray-100 pb-2">استطلاعات الرأي متعددة الخيارات (حسم القرارات)</h3>
                  
                  {multiOptionPolls.map(poll => {
                    const totalPollVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
                    
                    // Find option with highest votes
                    let highestVal = -1;
                    let winnerOpt = null;
                    poll.options.forEach(o => {
                      if (o.votes.length > highestVal) {
                        highestVal = o.votes.length;
                        winnerOpt = o;
                      }
                    });

                    return (
                      <div key={poll.id} className={`white-card p-5 rounded-2xl border transition-all ${
                        poll.isActive ? 'border-[#2A3F7E]/30 bg-[#2A3F7E]/2' : 'border-gray-200 bg-gray-50/40'
                      } space-y-4`}>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] text-gray-400 font-bold block">الهدف: اليوم {poll.targetDay} في {poll.targetCity}</span>
                          <span className="text-[10px] text-gray-500 font-extrabold">طرح بواسطة: <strong className="text-[#2A3F7E]">{poll.creator}</strong></span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-[#14172A] text-sm flex items-center gap-1.5">
                            <Vote size={16} className="text-[#2A3F7E]" />
                            <span>{poll.question}</span>
                            {!poll.isActive && (
                              <span className="bg-gray-200 text-gray-700 text-[8px] font-black px-2 py-0.5 rounded-full">مغلق ومحسوم</span>
                            )}
                          </h4>
                        </div>

                        {/* Options List */}
                        <div className="space-y-3">
                          {poll.options.map(opt => {
                            const optPercent = totalPollVotes ? Math.round((opt.votes.length / totalPollVotes) * 100) : 0;
                            const hasVoted = opt.votes.includes(currentUser.id);
                            const isWinningOption = !poll.isActive && poll.winnerOptionId === opt.id;

                            return (
                              <div key={opt.id} className="space-y-1">
                                <button
                                  type="button"
                                  disabled={!poll.isActive}
                                  onClick={() => voteMultiOption(poll.id, opt.id)}
                                  className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between gap-3 ${
                                    isWinningOption 
                                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
                                      : hasVoted
                                        ? 'bg-[#2A3F7E]/10 border-[#2A3F7E] text-[#2A3F7E]'
                                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                  } ${poll.isActive ? 'cursor-pointer' : ''}`}
                                >
                                  <div className="flex items-center gap-2">
                                    {poll.isActive && (
                                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                        hasVoted ? 'border-[#2A3F7E]' : 'border-gray-300'
                                      }`}>
                                        {hasVoted && <div className="w-2 h-2 rounded-full bg-[#2A3F7E]"></div>}
                                      </div>
                                    )}
                                    {isWinningOption && <Crown size={12} className="text-amber-600 animate-bounce" />}
                                    <span>{opt.text}</span>
                                  </div>
                                  <span className="font-mono text-gray-500">{opt.votes.length} صوت ({optPercent}%)</span>
                                </button>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-300 ${
                                      isWinningOption ? 'bg-amber-500' : hasVoted ? 'bg-[#2A3F7E]' : 'bg-gray-300'
                                    }`} 
                                    style={{ width: `${optPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Leader close action */}
                        {poll.isActive && canEdit && (
                          <div className="pt-2 border-t border-gray-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (winnerOpt) {
                                  closeMultiOptionPoll(poll.id, winnerOpt.id);
                                }
                              }}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] transition flex items-center gap-1 cursor-pointer"
                            >
                              <Crown size={11} />
                              <span>إغلاق التصويت واعتماد الخيار الفائز بالمسار</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 2. Up/Down Proposals Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 border-b border-gray-100 pb-2">المقترحات الثنائية (تأييد / معارضة)</h3>
                  
                  {proposals.length === 0 ? (
                    <div className="white-card p-8 rounded-2xl text-center text-gray-400 text-xs font-medium">
                      لا توجد مقترحات ثنائية مطروحة حالياً.
                    </div>
                  ) : (
                    proposals.map((prop) => {
                      const totalVotes = prop.votesUp.length + prop.votesDown.length;
                      const percentUp = totalVotes ? Math.round((prop.votesUp.length / totalVotes) * 100) : 0;
                      
                      const userUpvoted = prop.votesUp.includes(currentUser.id);
                      const userDownvoted = prop.votesDown.includes(currentUser.id);

                      return (
                        <div key={prop.id} className="white-card p-5 rounded-2xl border border-[#ECE6DC]/70 space-y-4 transition hover:border-[#2A3F7E]/20">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 font-bold block">تاريخ النشر: {prop.date}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold">المقترح بواسطة: <strong className="text-[#2A3F7E]">{prop.proposer}</strong></span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-extrabold text-[#14172A] text-sm">{prop.title}</h4>
                            <p className="text-xs text-gray-600 font-light leading-relaxed m-0">{prop.description}</p>
                          </div>

                          {/* Votes breakdown */}
                          <div className="space-y-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#ECE6DC]/60">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                              <span>نسبة التأييد: {percentUp}%</span>
                              <span>إجمالي الأصوات: {totalVotes} صوت</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                              <div className="bg-[#2A3F7E] h-full" style={{ width: `${percentUp}%` }}></div>
                              <div className="bg-red-500 h-full" style={{ width: `${100 - percentUp}%` }}></div>
                            </div>
                          </div>

                          {/* Vote buttons */}
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              onClick={() => voteProposal(prop.id, 'up')}
                              className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer border ${
                                userUpvoted 
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                                  : 'bg-white border-[#ECE6DC] text-gray-600 hover:bg-emerald-50/50'
                              }`}
                            >
                              <span>مؤيد</span>
                              <span className="font-mono font-bold">({prop.votesUp.length})</span>
                            </button>
                            
                            <button
                              onClick={() => voteProposal(prop.id, 'down')}
                              className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer border ${
                                userDownvoted 
                                  ? 'bg-red-500 border-red-500 text-white shadow-xs' 
                                  : 'bg-white border-[#ECE6DC] text-gray-600 hover:bg-rose-50/50'
                              }`}
                            >
                              <span>معارض</span>
                              <span className="font-mono font-bold">({prop.votesDown.length})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add Proposals forms column */}
              <div className="space-y-6">
                {/* A. Create Multi-Option Poll */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                    <Plus className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-[#14172A] font-sans">طرح استطلاع خيارات متعددة</h3>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const q = e.target.elements.pollQuestion.value.trim();
                      const o1 = e.target.elements.pollOpt1.value.trim();
                      const o2 = e.target.elements.pollOpt2.value.trim();
                      const o3 = e.target.elements.pollOpt3.value.trim();
                      const day = parseInt(e.target.elements.pollDay.value) || 1;
                      const city = e.target.elements.pollCity.value;

                      if (!q || !o1 || !o2) return;
                      const opts = [o1, o2];
                      if (o3) opts.push(o3);

                      addMultiOptionPoll({ question: q, options: opts, targetDay: day, targetCity: city });
                      e.target.reset();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">سؤال الاستبيان</label>
                      <input 
                        name="pollQuestion"
                        type="text" 
                        placeholder="مثال: أين نذهب مساء اليوم الثامن؟"
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 block">الخيارات المتاحة (أدخل خيارين على الأقل)</label>
                      <input 
                        name="pollOpt1"
                        type="text" 
                        placeholder="الخيار الأول (إلزامي)"
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-1.5 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                      <input 
                        name="pollOpt2"
                        type="text" 
                        placeholder="الخيار الثاني (إلزامي)"
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-1.5 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                      <input 
                        name="pollOpt3"
                        type="text" 
                        placeholder="الخيار الثالث (اختياري)"
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-1.5 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">يوم الرحلة</label>
                        <select 
                          name="pollDay"
                          className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-2 py-2 text-xs focus:outline-none cursor-pointer"
                        >
                          {itinerary.map(item => (
                            <option key={item.id} value={item.day}>اليوم {item.day}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">المدينة</label>
                        <select 
                          name="pollCity"
                          className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-2 py-2 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="موسكو">موسكو</option>
                          <option value="ريف موسكو">ريف موسكو</option>
                          <option value="سانت بطرسبرغ">سانت بطرسبرغ</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>نشر استبيان الخيارات</span>
                    </button>
                  </form>
                </div>

                {/* B. Create Standard Up/Down Proposal */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                    <Plus className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-[#14172A] font-sans">طرح مقترح ثنائي</h3>
                  </div>

                  <form onSubmit={handleAddProposal} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">عنوان المقترح</label>
                      <input 
                        type="text" 
                        placeholder="مثال: زيادة يوم في موسكو"
                        value={newProposal.title}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">التفاصيل والتبرير</label>
                      <textarea 
                        rows="3"
                        placeholder="اشرح تبريرك وتفاصيل اقتراحك للمجموعة..."
                        value={newProposal.description}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-xl border border-[#ECE6DC]">
                      <input 
                        type="checkbox" 
                        id="proposal-alert-checkbox"
                        checked={newProposal.sendAlert}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, sendAlert: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#2A3F7E] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="proposal-alert-checkbox" className="text-xs font-bold text-gray-600 cursor-pointer select-none">بث إشعار عاجل للشباب بالتطبيق</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} />
                      <span>طرح المقترح</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: SUPER ADMIN PANEL */}
        {activeTab === 'superadmin' && isSuperAdmin && (
          <div className="space-y-8 animate-fadeIn text-right font-sans">
            <div className="border-b border-[#ECE6DC] pb-6">
              <h2 className="text-xl font-bold text-[#14172A] flex items-center gap-2 justify-start">
                <Shield size={22} className="text-[#2A3F7E]" />
                <span>لوحة تحكم مدير الرحلة (عبدالله الزهراني)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">أدوات إشرافية متكاملة للتحكم في تواريخ الرحلة، بث التنبيهات العاجلة، وقفل التعديل والمحاكاة.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'عدد أيام الرحلة', value: '12 يوماً', desc: 'تغطي الفترة المحددة', icon: Calendar, color: 'text-[#2A3F7E]' },
                { label: 'أعضاء القروب', value: '4 أعضاء', desc: 'عبدالله، عبدالعزيز، حسن، فهد', icon: Users, color: 'text-blue-700' },
                { label: 'الحجوزات المنجزة', value: `${financeStats.confirmedBookings} من ${financeStats.totalBookings}`, desc: 'تذاكر طيران وفنادق وقطارات', icon: Hotel, color: 'text-amber-700' },
                { label: 'المهام المشتركة المكتملة', value: `${financeStats.completedTasks} من ${financeStats.totalTasks}`, desc: `نسبة الإنجاز الفعلي ${financeStats.taskPercent}%`, icon: CheckSquare, color: 'text-purple-700' }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="white-card p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-500 font-bold">{m.label}</p>
                      <h3 className="text-base font-black text-[#14172A]">{m.value}</h3>
                      <p className="text-[9px] text-gray-400 font-medium">{m.desc}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center ${m.color}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Settings Panel */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Card 1: Trip Dates & Plan Lock */}
                <div className="white-card p-6 rounded-2xl space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3">
                    <Settings className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">إعدادات الرحلة وتعديل التواريخ</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">تاريخ الذهاب والانطلاق</label>
                      <input 
                        type="date"
                        value={tripStartDate}
                        onChange={(e) => setTripStartDate(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2.5 text-xs text-[#14172A] font-mono text-left focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">تاريخ العودة والرجوع</label>
                      <input 
                        type="date"
                        value={tripEndDate}
                        onChange={(e) => setTripEndDate(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2.5 text-xs text-[#14172A] font-mono text-left focus:outline-none focus:border-[#2A3F7E]"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700">قفل تعديل خطة السفر</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">عند القفل، لن يتمكن أي عضو (ما عدا عبدالله) من تعديل جدول الأيام أو الحجوزات أو المهام.</p>
                    </div>
                    <button
                      onClick={() => setIsTripPlanLocked(!isTripPlanLocked)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        isTripPlanLocked 
                          ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {isTripPlanLocked ? <Lock size={14} /> : <Unlock size={14} />}
                      <span>{isTripPlanLocked ? 'المخطط مغلق ومقفل' : 'المخطط مفتوح للتعديل'}</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Simulated Active Day & Telegram Integration */}
                <div className="white-card p-6 rounded-2xl space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3">
                    <Bot className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">محاكاة يوم الرحلة النشط والتقارير</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">اختر اليوم النشط الحالي للمحاكاة</label>
                      <select
                        value={simulatedActiveDay}
                        onChange={(e) => setSimulatedActiveDay(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2.5 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer"
                      >
                        <option value={0}>الرحلة لم تبدأ بعد (مغلق)</option>
                        {itinerary.map(item => (
                          <option key={item.id} value={item.day}>اليوم {item.day} - {item.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={triggerTelegramSimulation}
                        disabled={simulatedActiveDay === 0}
                        className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#2A3F7E]/20"
                      >
                        <Send size={14} />
                        <span>بث إشعار اليوم النشط لقروب تيليجرام</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 3: Urgent Broadcast Alerts */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3">
                    <Megaphone className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">بث تنبيه جماعي عاجل (Megaphone Broadcast)</h3>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = e.target.elements.alertText.value.trim();
                      if (!text) return;
                      setBroadcastAlert({
                        text,
                        date: new Date().toLocaleTimeString()
                      });
                      e.target.reset();
                    }}
                    className="space-y-3"
                  >
                    <textarea 
                      name="alertText"
                      rows="2"
                      placeholder="اكتب التنبيه العاجل الذي سيظهر باللون الأحمر أعلى شاشات كافة الأعضاء..."
                      className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] leading-relaxed"
                      required
                    />
                    <div className="flex justify-end gap-2">
                      {broadcastAlert && (
                        <button
                          type="button"
                          onClick={() => setBroadcastAlert(null)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                        >
                          إلغاء التنبيه النشط
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
                      >
                        بث التنبيه الآن
                      </button>
                    </div>
                  </form>
                </div>

                {/* Card 4: Announcements Lists */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Megaphone className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">إدارة الإعلانات وتوجيهات الإدارة</h3>
                  </div>

                  {marketingBanners.length === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">لا توجد إعلانات نشطة حالياً.</p>
                  ) : (
                    <div className="space-y-3">
                      {marketingBanners.map(banner => (
                        <div key={banner.id} className="p-4 bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl flex items-center justify-between gap-4 text-xs">
                          <div className="space-y-1 text-right">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full ${
                                banner.isActive 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                  : 'bg-gray-100 text-gray-500 border-gray-200'
                              }`}>
                                {banner.isActive ? 'نشط' : 'معطل'}
                              </span>
                              <h4 className="font-bold text-gray-800">{banner.title}</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 font-light leading-relaxed">{banner.text}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMarketingBanner(banner.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                                banner.isActive
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {banner.isActive ? 'تعطيل' : 'تنشيط'}
                            </button>
                            <button
                              onClick={() => deleteMarketingBanner(banner.id)}
                              className="p-1 text-gray-400 hover:text-red-700 hover:bg-gray-100 rounded transition cursor-pointer"
                              title="حذف"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Forms Column */}
              <div className="space-y-6">
                
                {/* Card 5: Add Announcement Form */}
                <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                    <Plus className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">بث إعلان / توجيه جديد</h3>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const title = e.target.elements.bannerTitle.value.trim();
                      const text = e.target.elements.bannerText.value.trim();
                      const theme = e.target.elements.bannerTheme.value;
                      if (!title || !text) return;
                      addMarketingBanner({ title, text, theme, isActive: true });
                      e.target.reset();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">عنوان الإعلان</label>
                      <input 
                        name="bannerTitle"
                        type="text" 
                        placeholder="مثال: موعد تجمع عشاء موسكو"
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">محتوى الإعلان</label>
                      <textarea 
                        name="bannerText"
                        rows="3"
                        placeholder="اكتب تفاصيل الإعلان أو التوجيه هنا..."
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">النمط البصري</label>
                      <select
                        name="bannerTheme"
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="green">أخضر هادئ (تنبيه داخلي)</option>
                        <option value="gold">ذهبي فخم (تنبيه هام جداً)</option>
                        <option value="blue">أزرق سماوي (تنبيه معلوماتي)</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} />
                      <span>نشر الإعلان للجميع</span>
                    </button>
                  </form>
                </div>

                {/* Card 6: Quick Task Assignment Form */}
                <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 justify-start">
                    <Plus className="text-[#2A3F7E]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">تفويض مهمة لعضو بالفريق</h3>
                  </div>

                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المهمة</label>
                      <input 
                        type="text" 
                        placeholder="مثال: حجز تذاكر الإرميتاج"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المسؤول عن التجهيز</label>
                      <select
                        value={newTask.assignee}
                        onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="الجميع">الجميع</option>
                        {travelers.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">التصنيف</label>
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl px-3 py-2 text-xs text-[#14172A] focus:outline-none focus:border-[#2A3F7E] text-right cursor-pointer font-bold"
                      >
                        <option value="تجهيزات">تجهيزات واستعدادات</option>
                        <option value="لوجستيات">حجوزات ولوجستيات</option>
                        <option value="برامج">أنشطة ومخططات</option>
                        <option value="مالية">أمور مالية وتكاليف</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-xl border border-[#ECE6DC]">
                      <input 
                        type="checkbox" 
                        id="admin-critical-task-checkbox"
                        checked={newTask.isCritical}
                        onChange={(e) => setNewTask(prev => ({ ...prev, isCritical: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#2A3F7E] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="admin-critical-task-checkbox" className="text-xs font-bold text-gray-600 cursor-pointer select-none">مهمة عاجلة وحرجة</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>إضافة وتفويض المهمة</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}               


      </main>

      {/* MOBILE BOTTOM NAVIGATION — slim: Home + Schedule + MyBag + More */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ECE6DC] flex justify-around py-2.5 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.04)] pb-safe-bottom">
        {[
          { id: 'dashboard', label: 'الرئيسية', icon: Home },
          { id: 'itinerary', label: 'الجدول', icon: Calendar },
          { id: 'personal',  label: 'حقيبتي',  icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? 'text-[#2A3F7E]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className={`text-[10px] ${isActive ? 'font-black' : 'font-semibold'}`}>{tab.label}</span>
            </button>
          );
        })}

        {/* 'More' opens the full menu drawer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center justify-center gap-1 px-4 py-1 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <Menu size={20} className="stroke-[1.8]" />
          <span className="text-[10px] font-semibold">المزيد</span>
        </button>
      </nav>

      {/* FLOATING ADD BUTTON — mobile, on tabs that have an add form */}
      {['tasks', 'bookings', 'itinerary', 'expenses', 'personal'].includes(activeTab) && canEdit && (
        <button
          onClick={() => {
            // Scroll to the first form input inside main content
            const main = document.querySelector('main');
            const form = main?.querySelector('form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                const firstInput = form.querySelector('input[type="text"], textarea');
                if (firstInput) firstInput.focus();
              }, 400);
            }
          }}
          aria-label="إضافة جديد"
          className="md:hidden fixed bottom-24 left-5 z-30 w-14 h-14 rounded-full bg-[#2A3F7E] text-white shadow-[0_10px_25px_-5px_rgba(42,63,126,0.5)] flex items-center justify-center cursor-pointer transition active:scale-95 hover:bg-[#1B2D64]"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      {/* TELEGRAM SIMULATION MODAL DIALOG */}
      {telegramMockOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#ECE6DC] max-w-md w-full rounded-2xl p-6 space-y-4 text-right shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 justify-start">
              <Bot className="text-[#2A3F7E]" size={20} />
              <h3 className="text-sm font-bold text-gray-800">محاكاة تكامل بوت تيليجرام</h3>
            </div>
            
            <p className="text-xs text-gray-500 font-light leading-normal">
              تم توليد التقرير الصباحي التلقائي وإرساله كمحاكاة إلى مجموعة Telegram الخاصة بالشباب بنجاح. هكذا سيظهر التقرير في قنوات التواصل:
            </p>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[10px] whitespace-pre-wrap leading-relaxed select-all text-left">
              {telegramMockContent}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 justify-end">
              <span className="text-[10px] text-emerald-800 font-bold">تم الإرسال بنجاح لمحاورة التكامل الفعلي</span>
              <CheckCircle size={14} className="text-emerald-700" />
            </div>

            <button
              onClick={() => setTelegramMockOpen(false)}
              className="w-full bg-[#2A3F7E] hover:bg-[#1b4332] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENT IMAGE MODAL PREVIEW */}
      {selectedDocForView && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 space-y-4 text-right shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedDocForView(null)}
              className="absolute top-4 left-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer"
              aria-label="إغلاق المعاينة"
            >
              <X size={18} />
            </button>
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-1.5 justify-start">
              <FileText size={16} className="text-[#2A3F7E]" />
              <span>معاينة مستند: {selectedDocForView.name}</span>
            </h3>
            <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center bg-gray-50 rounded-xl p-2 border border-[#ECE6DC]">
              <img 
                src={selectedDocForView.data} 
                alt={selectedDocForView.name} 
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION (success/error confirmations) */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-fadeIn pointer-events-none">
          <div className={`px-5 py-3 rounded-xl shadow-lg font-bold text-sm border ${
            toast.kind === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* WELCOME MODAL ON SUCCESSFUL LOGIN */}
      {showWelcome && currentUser && welcomeLine && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] overflow-y-auto animate-fadeIn"
          onClick={() => setShowWelcome(false)}
        >
            <div className="min-h-full flex items-center justify-center p-4">
              <div
                className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 space-y-5 text-center shadow-2xl relative border border-[#ECE6DC]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-md bg-gradient-to-tr ${currentUser.avatarColor}`}>
                  <span className="text-2xl font-black">{currentUser.name[0]}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">{welcomeLine.headline}</h3>
                  <p className="text-sm text-gray-500 font-medium">{currentUser.role}</p>

                  <div className="py-4 px-4 bg-[#FAF7F2] border border-[#ECE6DC] rounded-xl text-sm md:text-base text-[#14172A] leading-relaxed font-medium">
                    {welcomeLine.sub}
                  </div>
                </div>

                <button
                  onClick={() => setShowWelcome(false)}
                  className="w-full bg-[#2A3F7E] hover:bg-[#1B2D64] text-white py-3 rounded-xl text-base font-black transition shadow-md cursor-pointer text-center"
                >
                  يلا نبدأ
                </button>
              </div>
            </div>
          </div>
      )}

    </div>
  );
}

export default App;
