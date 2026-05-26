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

const mapItineraryFromDb = (r) => ({ id: r.id, day: r.day, date: r.date, city: r.city, title: r.title, activities: r.activities, leader: r.leader, notes: r.notes || '' });
const mapItineraryToDb = (i) => ({ day: i.day, date: i.date, city: i.city, title: i.title, activities: i.activities, leader: i.leader, notes: i.notes || '' });

const DEFAULT_PASSWORD = '123456';

// Premium Custom SVG Logo for Summer Trip (Russian Onion Domes + Travel Compass detailing)
function ShaddadLogo({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        {/* Luxury Gold and Emerald Gradients */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2E6" />
          <stop offset="30%" stopColor="#F5D38A" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="50%" stopColor="#1B4332" />
          <stop offset="100%" stopColor="#081C15" />
        </linearGradient>
      </defs>
      
      {/* Main Round Emblem */}
      <circle cx="50" cy="50" r="44" fill="url(#emeraldGradient)" stroke="url(#goldGradient)" strokeWidth="2" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="url(#goldGradient)" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />
      
      {/* Castle/Cathedral Domes Graphic */}
      <g transform="translate(0, 2)" fill="url(#goldGradient)">
        {/* Center Dome Foundation / Spire */}
        <path d="M44 70 L44 52 L56 52 L56 70 Z" opacity="0.8" />
        {/* Center Onion Dome */}
        <path d="M50 24 C53 32, 57 38, 50 52 C43 38, 47 32, 50 24 Z" stroke="url(#goldGradient)" strokeWidth="0.75" />
        <line x1="50" y1="24" x2="50" y2="16" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <polygon points="50,14 51.5,16.5 48.5,16.5" />
        
        {/* Left Dome Foundation / Spire */}
        <path d="M28 70 L28 58 L38 58 L38 70 Z" opacity="0.8" />
        {/* Left Onion Dome */}
        <path d="M33 38 C35.5 44, 39 48, 33 58 C27 48, 30.5 44, 33 38 Z" stroke="url(#goldGradient)" strokeWidth="0.5" />
        <line x1="33" y1="38" x2="33" y2="32" stroke="url(#goldGradient)" strokeWidth="1" />
        <circle cx="33" cy="32" r="0.75" />

        {/* Right Dome Foundation / Spire */}
        <path d="M62 70 L62 58 L72 58 L72 70 Z" opacity="0.8" />
        {/* Right Onion Dome */}
        <path d="M67 38 C69.5 44, 73 48, 67 58 C61 48, 64.5 44, 67 38 Z" stroke="url(#goldGradient)" strokeWidth="0.5" />
        <line x1="67" y1="38" x2="67" y2="32" stroke="url(#goldGradient)" strokeWidth="1" />
        <circle cx="67" cy="32" r="0.75" />
        
        {/* Horizontal Castle Wall Base */}
        <path d="M20 68 L80 68 L80 72 L20 72 Z" />
        
        {/* Small Arches inside the foundations */}
        <path d="M47 70 C47 67, 53 67, 53 70 Z" fill="#1B4332" />
        <path d="M31 70 C31 68, 35 68, 35 70 Z" fill="#1B4332" />
        <path d="M65 70 C65 68, 69 68, 69 70 Z" fill="#1B4332" />
      </g>
      
      {/* Subtle Decorative Star Dots */}
      <circle cx="25" cy="30" r="0.75" fill="url(#goldGradient)" opacity="0.6" />
      <circle cx="75" cy="30" r="0.75" fill="url(#goldGradient)" opacity="0.6" />
      <circle cx="50" cy="88" r="1.5" fill="url(#goldGradient)" />
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
  { id: '1', name: 'عبدالله الزهراني', role: 'منظم الرحلة', phone: '0506230054', avatarColor: 'from-[#2D6A4F] to-[#74C69D]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: true, password: '123456' },
  { id: '2', name: 'عبدالعزيز الحميد', role: 'المشرف المالي', phone: '0555255181', avatarColor: 'from-[#2D6A4F] to-[#D8D0C5]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: true, password: '123456' },
  { id: '3', name: 'حسن الدوسري', role: 'مسؤول الخدمات اللوجستية', phone: '0599967664', avatarColor: 'from-[#2D6A4F] to-[#b8b0a5]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: false, password: '123456' },
  { id: '4', name: 'فهد بن جديد', role: 'منسق الأنشطة والبرامج', phone: '0590099919', avatarColor: 'from-[#2D6A4F] to-[#40916C]', visaStatus: 'معفى (دخول بدون تأشيرة)', flightBooked: true, password: '123456' },
];

const INITIAL_ITINERARY = [
  { id: 'd1', day: 1, date: '2026-06-24', city: 'موسكو', title: 'الوصول واستكشاف شارع نيكولسكايا', activities: 'الوصول إلى مطار شيريميتيفو بموسكو، الانتقال إلى الفندق والاستقرار. في المساء، جولة مشي في شارع نيكولسكايا (Nikolskaya Street) القريب من الساحة الحمراء للاستمتاع بالإنارة الليلية الرائعة.', notes: 'اقتراح عشاء/قهوة: كافيه Grand Kafe Dr. Zhivago (تجربة كيكة العسل بالتوت - يتطلب انتظار أو حجز مسبق).', leader: 'عبدالله الزهراني' },
  { id: 'd2', day: 2, date: '2026-06-25', city: 'موسكو', title: 'الكرملين، الساحة الحمراء وحديقة زريادي', activities: 'جولة تاريخية تشمل قصر الكرملين، الساحة الحمراء، وكاتدرائية سانت باسيل الاستثنائية. الاستمتاع بالتسوق في مجمع GUM التاريخي. عصراً، زيارة حديقة زريادي (Zaryadye Park) الحديثة والمشي فوق الجسر الطائر (Floating Bridge) ذو الإطلالة البانورامية على نهر موسكفا.', notes: 'اقتراح قهوة: Bosco Coffee في مول GUM (القهوة والتيراميسو). عشاء: برقر SHE أو مطعم إيطالي IL PIZZAIOLO.', leader: 'عبدالله الزهراني' },
  { id: 'd3', day: 3, date: '2026-06-26', city: 'موسكو', title: 'شوارع التسوق وبحيرة البطريرك', activities: 'التمشي في شارع تفيرسكايا (Tverskaya Street) الرئيسي، وشارع بتروفكا (Petrovka Street) الشهير بالبوتيكات والماركات الفخمة. الانتقال بعد العصر إلى شارع ملايا برونايا (Malaya Bronnaya Street) الهادئ للتمشي بجوار بحيرة البطريرك (Patriarch Ponds) الجميلة.', notes: 'اقتراح فطور: Remy Kitchen Bakery. قهوة: Surf Coffee أو كافيه Pino (تجربة الفرنش توست والكريم بروليه).', leader: 'عبدالله الزهراني' },
  { id: 'd4', day: 4, date: '2026-06-27', city: 'ريف موسكو', title: 'استجمام وهدوء في ريف موسكو الطبيعي', activities: 'قضاء يوم كامل خارج صخب المدينة للاستمتاع بالطبيعة الريفية الروسية، والمشي في الغابات المحيطة وتناول وجبة تقليدية في الهواء الطلق.', notes: 'اقتراح قهوة: Skuratov Coffee Roasters أو Rockets Concept Store.', leader: 'عبدالعزيز الحميد' },
  { id: 'd5', day: 5, date: '2026-06-28', city: 'موسكو', title: 'جولة أربات التاريخية والمترو الفني', activities: 'استكشاف محطات مترو موسكو التاريخية الفنية، ثم قضاء فترة العصر والمشاة في شارع أربات القديم (Old Arbat) المليء بالفنانين والمقاهي ومحلات الهدايا التذكارية، ومقارنته بشارع أربات الجديد الذاخر بالمطاعم الكبيرة.', notes: 'فطور: Remy Kitchen Bakery. قهوة مختصة: Surf Coffee أو ABC Coffee.', leader: 'عبدالعزيز الحميد' },
  { id: 'd6', day: 6, date: '2026-06-29', city: 'موسكو', title: 'حديقة غوركي وسكاي بارك', activities: 'قضاء يوم مفتوح في حديقة غوركي (Gorky Park) الشاسعة لركوب الدراجات أو القوارب المائية. الانتقال عصراً بالمترو إلى سكاي بارك (Skypark) بالقرب من محطة Vorobyovy Gory للمشاركة في الفعاليات الترفيهية والتلفريك.', notes: 'قهوة: كافيه Aist (يضم محمصة قهوة في الداخل). عشاء: مطعم هندي Tandoor أو Taj Mahal.', leader: 'فهد بن جديد' },
  { id: 'd7', day: 7, date: '2026-06-30', city: 'موسكو', title: 'حديقة فدنخا الترفيهية والتلفريك', activities: 'زيارة حديقة فدنخا (VDNKh) التاريخية لمشاهدة عين موسكو الدوارة، وركوب التلفريك، وزيارة الأكواريوم ومتحف الفضاء.', notes: 'اقتراح كافيه: Miss You (كروسان اللوز).', leader: 'فهد بن جديد' },
  { id: 'd8', day: 8, date: '2026-07-01', city: 'سانت بطرسبرغ', title: 'السفر بقطار سابسان السريع إلى سانت بطرسبرغ', activities: 'الانتقال صباحاً بقطار سابسان (Sapsan) السريع من موسكو إلى العاصمة الثقافية سانت بطرسبرغ. الاستقرار في السكن، ثم جولة حرة في شارع نيفسكي (Nevsky Prospekt) للتمشي والاستطلاع الأول للمدينة وقنواتها المائية.', notes: 'قهوة مساءً في كافيه Bolshoi أو Surf Coffee.', leader: 'عبدالعزيز الحميد' },
  { id: 'd9', day: 9, date: '2026-07-02', city: 'سانت بطرسبرغ', title: 'متحف الإرميتاج العريق وجولة القنوات المائية', activities: 'تخصيص يوم كامل لاستكشاف متحف الإرميتاج (Hermitage Museum) الضخم الذي يضم كنوز القياصرة الروس. في المساء، جولة تفصيلية بالقارب في القنوات المائية الساحرة تحت الجسور المتحركة.', notes: 'عشاء: مطعم Tandoor أو Taj Mahal الهندي في سانت بطرسبرغ.', leader: 'حسن الدوسري' },
  { id: 'd10', day: 10, date: '2026-07-03', city: 'سانت بطرسبرغ', title: 'قصر بيترهوف والنافورات الذهبية وكاتدرائية الدم', activities: 'زيارة قصر القيصر بطرس الأكبر (بيترهوف Peterhof Palace) المطل على خليج فنلندا ومشاهدة النافورات الذهبية العجيبة. العودة للمدينة لزيارة كاتدرائية المخلص على الدم المراق (Savior on Spilled Blood).', notes: 'يوم طويل للتصوير واستنشاق أجواء بحر البلطيق.', leader: 'حسن الدوسري' },
  { id: 'd11', day: 11, date: '2026-07-04', city: 'موسكو', title: 'العودة بقطار سابسان وجولة في شوارع المقاهي المزدحمة', activities: 'ركوب قطار سابسان للعودة إلى موسكو والاستقرار. قضاء العصر في التمشي الطويل بشارعي مياسنيتسكايا (Myasnitskaya Street) وبيايتنيتسكايا (Pyatnitskaya Street) المليئين بالمقاهي المتنوعة والأجواء الحيوية الشبابية.', notes: 'تعد الشوارع أقل سياحية ولكنها من الأكثر متعة للمشي الطويل والمطاعم.', leader: 'فهد بن جديد' },
  { id: 'd12', day: 12, date: '2026-07-05', city: 'موسكو', title: 'شراء الهدايا التذكارية والمغادرة للوطن', activities: 'شراء الهدايا التذكارية وأحذية الفرو والجلود بأسعار معقولة من السوق تحت الأرضي بجوار الساحة الحمراء، ثم تسجيل الخروج والتوجه لمطار شيريميتيفو للعودة بسلامة الله إلى أرض الوطن.', notes: 'نهاية الرحلة والعودة إلى الرياض.', leader: 'فهد بن جديد' }
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
    if (!currentUser || !newPersonalItem.title.trim()) return;
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
    if (!newTask.title.trim() || !canEdit) return;
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
    if (!newExpense.description.trim() || !newExpense.amountSar || !newExpense.paidBy || !canEdit) return;
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
    if (!newBooking.title.trim() || !canEdit) return;
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
    if (!newActivity.title.trim() || !canEdit) return;
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
      <div className="min-h-screen flex items-center justify-center p-0 md:p-6 bg-[#F9F7F4] relative font-sans" dir="rtl">
        {/* Decorative Background Accents for Mobile */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-[#74C69D]/10 to-[#2D6A4F]/10 rounded-full blur-3xl opacity-40 md:hidden"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-[#D4AF37]/5 to-[#74C69D]/10 rounded-full blur-3xl opacity-40 md:hidden"></div>
 
        <div className="w-full max-w-5xl bg-white border border-[#E8E0D5] rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[640px] relative z-10">
          
          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between space-y-8 bg-white">
            {/* Top header/logo */}
            <div className="flex items-center gap-4 justify-start">
              <div className="w-14 h-14 md:w-12 md:h-12">
                <ShaddadLogo />
              </div>
              <div className="text-right">
                <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] m-0">رحلة صيف ٢٠٢٦</h2>
                <p className="text-sm md:text-base text-[#2D6A4F] font-bold m-0">بوابة دخول الأصدقاء والمنسقين</p>
              </div>
            </div>

            {/* Travel Quote Banner above the login inputs */}
            <div className="bg-[#2D6A4F]/5 border border-[#2D6A4F]/10 px-5 py-4 rounded-2xl text-center">
              <p className="text-sm md:text-base text-[#2D6A4F] font-bold leading-relaxed m-0">
                « السفر يُريك الدنيا بعيونٍ جديدة، ويصنع ذكريات تدوم مدى العمر. سفرة ممتعة يا أصدقاء »
              </p>
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
                      className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-4 py-4 text-base md:text-lg text-center focus:outline-none focus:border-[#2D6A4F] focus:bg-white tracking-widest text-[#1A1A1A]"
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
                      className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-4 py-4 text-base md:text-lg text-center focus:outline-none focus:border-[#2D6A4F] focus:bg-white tracking-widest text-[#1A1A1A]"
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
                      className="flex-1 bg-[#2D6A4F] hover:bg-[#1b4332] text-white font-black py-4 rounded-xl text-base md:text-lg transition duration-300 cursor-pointer shadow-sm text-center"
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
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm md:text-base font-bold text-gray-700 block">أدخل رقم جوالك لتسجيل الدخول</label>
                    <input
                      type="text"
                      placeholder="05XXXXXXXX"
                      value={loginPhoneInput}
                      onChange={(e) => setLoginPhoneInput(e.target.value)}
                      className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-4 py-4 text-base md:text-lg text-center font-mono focus:outline-none focus:border-[#2D6A4F] focus:bg-white tracking-widest text-[#1A1A1A]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm md:text-base font-bold text-gray-700 block">كلمة المرور</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={loginPasswordInput}
                      onChange={(e) => setLoginPasswordInput(e.target.value)}
                      className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-4 py-4 text-base md:text-lg text-center focus:outline-none focus:border-[#2D6A4F] focus:bg-white tracking-widest text-[#1A1A1A]"
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
                    className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white font-black py-4 rounded-xl text-base md:text-lg transition duration-300 cursor-pointer shadow-md text-center"
                  >
                    تأكيد ودخول للرحلة
                  </button>
                </form>
              )}
            </div>

            {/* Mobile Quote Footer */}
            <div className="block md:hidden text-center bg-[#F9F7F4] p-4 rounded-2xl border border-[#E8E0D5]/60">
              <p className="text-[10px] text-gray-600 font-medium leading-relaxed m-0">
                « السفر يُريك الدنيا بعيونٍ جديدة، ويصنع ذكريات تدوم مدى العمر »
              </p>
            </div>

            {/* Footer — handcrafted credit */}
            <div className="text-center space-y-1.5 pt-2 border-t border-[#E8E0D5]/60">
              <p className="text-xs md:text-sm text-[#2D6A4F] font-bold m-0 leading-relaxed">
                صُنع بحب للأصحاب · نظام تفاعلي لتنسيق رحلتنا إلى روسيا 2026
              </p>
              <p className="text-[10px] md:text-[11px] text-gray-500 font-medium m-0">
                بإشراف وتنظيم: <span className="text-[#1A1A1A] font-bold">عبدالله الزهراني</span>
              </p>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-mono m-0">
                Summer Trip Planner © 2026
              </p>
            </div>
          </div>

          {/* Left Side: St. Basil's Green Cathedral Card (Artistic Banner Side) */}
          <div className="hidden md:flex w-1/2 bg-[#1B4332] p-12 relative flex-col justify-between overflow-hidden">
            {/* Background design accents */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-tr from-[#74C69D]/15 to-transparent rounded-full blur-3xl"></div>
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
                  <span className="absolute top-3 right-3 bg-white/95 text-[#1B4332] px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm">
                    وجهتنا: روسيا
                  </span>
                </div>
                <div className="text-right text-white space-y-1">
                  <h3 className="font-extrabold text-sm text-white m-0">موسكو • سان بطرسبرغ • سوتشي</h3>
                  <p className="text-[10px] text-emerald-100 opacity-90 leading-relaxed font-light m-0">
                    نظام موحد لإدارة مسار الرحلة، الحجوزات، الميزانية المشتركة، وجاهزية الحقائب مع الأصدقاء.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Travel Quote at the bottom of the art side */}
            <div className="relative z-10 text-center border-t border-white/10 pt-4">
              <p className="text-[10px] text-emerald-200 font-medium leading-relaxed m-0">
                « السفر يُريك الدنيا بعيونٍ جديدة، ويصنع ذكريات تدوم مدى العمر »
              </p>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A] flex flex-col md:flex-row font-sans relative pb-20 md:pb-0" dir="rtl">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-[#E8E0D5] px-5 py-4 flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 hover:bg-[#E8E0D5]/40 rounded-lg text-[#1A1A1A] cursor-pointer"
            aria-label="القائمة"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 shrink-0">
              <ShaddadLogo />
            </div>
            <span className="font-extrabold text-sm text-[#1A1A1A] font-sans">رحلة صيف ٢٠٢٦</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-[#F9F7F4] border border-[#E8E0D5] px-2.5 py-1 rounded-lg">
          <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center font-bold text-white text-[9px]`}>
            {currentUser.name[0]}
          </div>
          <span className="text-[10px] font-bold text-[#1A1A1A]">{currentUser.name.split(' ')[0]}</span>
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
      <aside className={`fixed md:sticky top-0 right-0 h-screen w-72 bg-white border-l border-[#E8E0D5] p-6 flex flex-col shrink-0 gap-6 z-50 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
         isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 left-4 p-1.5 hover:bg-[#E8E0D5]/50 rounded-lg text-gray-500 cursor-pointer"
          aria-label="إغلاق القائمة"
        >
          <X size={18} />
        </button>

        <div className="space-y-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-3 border-b border-[#E8E0D5] pb-4">
            <div className="w-10 h-10 shrink-0">
              <ShaddadLogo />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-[#1A1A1A] font-sans m-0">رحلة صيف ٢٠٢٦</h1>
              <p className="text-[10px] text-[#2D6A4F] font-bold m-0">المخطط الجماعي للأصدقاء</p>
            </div>
          </div>

          {/* Current Traveler Profile Card */}
          <div className="bg-[#F9F7F4] border border-[#E8E0D5] p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center font-bold text-white text-xs`}>
                {currentUser.name[0]}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-[#1A1A1A] text-xs">{currentUser.name}</h4>
                  {/* Private Group Planner */}
                </div>
                <p className="text-[10px] text-gray-500 m-0">{currentUser.role}</p>
              </div>
            </div>
            
            <div className="border-t border-[#E8E0D5]/60 pt-2 flex items-center justify-between text-[10px] text-gray-500">
              <span>الجوال: <strong className="font-mono">{currentUser.phone}</strong></span>
              <button 
                onClick={handleLogout}
                className="text-[#2D6A4F] hover:text-red-700 flex items-center gap-0.5 font-bold cursor-pointer"
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
                      ? 'bg-[#2D6A4F] text-white font-bold' 
                      : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-[#E8E0D5]/40'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

          </nav>
        </div>

        {/* Footer in Sidebar */}
        <div className="text-[10px] text-gray-400 border-t border-[#E8E0D5] pt-4 font-sans text-center">
          <p className="m-0">رحلتنا الخاصة · صيف 2026</p>
        </div>
      </aside>

      {/* 2. LEFT MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">



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
                  {t.title} - <span className="font-extrabold text-[#2D6A4F]">{t.assignee}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Lighter/Premium Hero Section */}
            <div className="hero-container relative h-48 md:h-72 rounded-2xl border border-[#E8E0D5] shadow-sm flex items-end">
              <img 
                src={russiaHero} 
                alt="Russia Custom illustration" 
                className="hero-image absolute inset-0 w-full h-full object-cover object-center animate-fadeIn"
              />
              <div className="relative p-6 md:p-8 text-right space-y-1 z-10">
                <span className="bg-[#2D6A4F] text-white px-2.5 py-0.5 rounded text-[10px] font-bold">صيف 2026</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#1A1A1A] m-0">رحلتنا الصيفية إلى روسيا</h2>
                <p className="text-gray-600 text-xs md:text-sm max-w-xl font-light">
                  المخطط الجماعي لرحلة روسيا | من {getDateForDay(tripStartDate, 1)} إلى {getDateForDay(tripStartDate, 12)}
                </p>
              </div>
            </div>

            {/* Travel Quote Banner */}
            <div className="bg-gradient-to-r from-[#2D6A4F]/10 via-[#74C69D]/5 to-transparent border-r-4 border-[#2D6A4F] p-4 rounded-xl text-right animate-fadeIn">
              <p className="text-xs text-[#1B4332] font-black italic m-0">
                « السفر ميزان الأخلاق، وترياق العقول، ومولد الذكريات الجميلة التي لا تنتهي. سفرة ممتعة يا أصدقاء »
              </p>
            </div>

            {/* COUNTDOWN TIMER WIDGET */}
            <div className="white-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="text-[#2D6A4F]" size={16} />
                  <h3 className="text-xs font-black text-gray-800">مؤقت العد التنازلي التفاعلي لإنطلاق الرحلة</h3>
                </div>
                <span className="text-[10px] text-[#2D6A4F] font-bold">تاريخ البداية الحالي: {tripStartDate}</span>
              </div>
              
              {timeLeft.isPast ? (
                <div className="text-center py-4 bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#2D6A4F] rounded-xl font-bold text-sm">
                  الرحلة نشطة حالياً وسعيدة للشباب!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto text-center font-mono">
                  {[
                    { label: 'أيام', val: timeLeft.days },
                    { label: 'ساعات', val: timeLeft.hours },
                    { label: 'دقائق', val: timeLeft.minutes },
                    { label: 'ثواني', val: timeLeft.seconds }
                  ].map((unit, uIdx) => (
                    <div key={uIdx} className="bg-[#F9F7F4] border border-[#E8E0D5] p-3 rounded-xl">
                      <div className="text-xl md:text-2xl font-black text-[#2D6A4F]">{String(unit.val).padStart(2, '0')}</div>
                      <div className="text-[9px] font-bold text-gray-400 mt-1">{unit.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Two-Column Grid Layout for Widgets and Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left/Main Column: Simulated active day, leader checklists, and Abdullah's admin alert controls */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Simulated Day & Leader Widget */}
                {simulatedActiveDay > 0 && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between gap-4 text-right shadow-xs">
                      <div className="flex items-center gap-3">
                        <Crown className="text-emerald-700 animate-bounce" size={24} />
                        <div>
                          <h4 className="font-extrabold text-xs text-emerald-800">اليوم النشط للرحلة حالياً: اليوم {simulatedActiveDay}</h4>
                          <p className="text-[11px] text-emerald-700 font-medium">قائد اليوم المسؤول عن التوجيه والتنظيم: <strong className="font-bold underline">{activeLeaderName || 'عبدالله الزهراني'}</strong></p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold animate-pulse">اليوم نشط</span>
                    </div>

                    {/* Daily Leader Checklist Card */}
                    {(() => {
                      const leaderInfo = getLeaderRoleAndChecklist(activeLeaderName || 'عبدالله الزهراني');
                      return (
                        <div className={`p-6 rounded-2xl border ${leaderInfo.themeClass} space-y-4 text-right animate-fadeIn shadow-xs`}>
                          <div className="flex items-center justify-between border-b border-current/10 pb-3">
                            <div className="flex items-center gap-2">
                              <Crown size={16} />
                              <h4 className="text-xs font-black">مهام القيادة التنفيذية لليوم</h4>
                            </div>
                            <span className={`text-[9px] font-black border px-2.5 py-0.5 rounded-full ${leaderInfo.badgeClass}`}>
                              {leaderInfo.role}
                            </span>
                          </div>

                          <p className="text-[11px] opacity-80 leading-relaxed font-light">
                            تتطلب قيادة اليوم متابعة المهام التشغيلية التالية وضمان إنجازها لتسهيل ترحال المجموعة:
                          </p>

                          <div className="space-y-2.5">
                            {leaderInfo.tasks.map((taskText, taskIdx) => {
                              const stateKey = `${simulatedActiveDay}-${taskIdx}`;
                              const isChecked = !!leaderChecklistState[stateKey];
                              return (
                                <label 
                                  key={taskIdx} 
                                  className={`flex items-start gap-3 p-3 bg-white/70 border border-black/5 hover:border-black/10 rounded-xl cursor-pointer transition select-none ${
                                    isChecked ? 'opacity-70 line-through text-gray-500' : ''
                                  }`}
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      setLeaderChecklistState(prev => ({
                                        ...prev,
                                        [stateKey]: e.target.checked
                                      }));
                                    }}
                                    className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F] mt-0.5 cursor-pointer shrink-0"
                                  />
                                  <span className="text-xs font-medium leading-relaxed">{taskText}</span>
                                </label>
                              );
                            })}
                          </div>

                          {/* Checklist completion progress bar */}
                          {(() => {
                            const total = leaderInfo.tasks.length;
                            const completed = leaderInfo.tasks.filter((_, idx) => !!leaderChecklistState[`${simulatedActiveDay}-${idx}`]).length;
                            const pct = Math.round((completed / total) * 100);
                            return (
                              <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 mb-1.5">
                                  <span>نسبة إنجاز مهام القائد اليومي</span>
                                  <span>{completed} من {total} ({pct}%)</span>
                                </div>
                                <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-[#2D6A4F] h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Group Announcements from Admin */}
                {marketingBanners.filter(b => b.isActive).length > 0 && (
                  <div className="white-card p-6 rounded-2xl space-y-4 text-right shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                      <Megaphone className="text-[#2D6A4F]" size={16} />
                      <h3 className="text-xs font-black text-gray-800">إعلانات وتنبيهات الإدارة</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {marketingBanners
                        .filter(b => b.isActive)
                        .map((banner) => (
                          <div 
                            key={banner.id}
                            className={`border p-4.5 rounded-2xl flex items-start justify-between gap-3 text-right shadow-2xs relative ${
                              banner.theme === 'gold' 
                                ? 'bg-amber-50/70 border-amber-300 text-amber-900' 
                                : banner.theme === 'green'
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                                  : 'bg-blue-50/70 border-blue-300 text-blue-900'
                            }`}
                          >
                            <div className="flex gap-2.5">
                              <Megaphone className="shrink-0 mt-0.5 text-current opacity-80" size={15} />
                              <div className="space-y-0.5 flex-1">
                                <h4 className="font-extrabold text-xs text-current m-0">{banner.title}</h4>
                                <p className="text-[11px] font-medium leading-relaxed mt-1 mb-0 text-current/90">{banner.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Travelers Preparation progress */}
              <div className="lg:col-span-4 space-y-6">
                <div className="white-card p-6 rounded-2xl space-y-4 text-right shadow-xs">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3 justify-start">
                    <Briefcase className="text-[#2D6A4F] shrink-0" size={16} />
                    <h3 className="text-xs font-black text-gray-800">مؤشر جاهزية الأصدقاء للرحلة</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                    يقيس هذا المؤشر نسبة جاهزية كل مسافر بناءً على إنجاز قائمة مستلزمات حقيبته ورفع وثائق السفر الرسمية بنجاح.
                  </p>

                  <div className="space-y-4">
                    {travelers.map((t) => {
                      const packing = personalPacking[t.id] || [];
                      const docs = personalDocs[t.id] || [];
                      const totalPacking = packing.length;
                      const completedPacking = packing.filter(item => item.checked).length;
                      const totalDocs = docs.length;
                      const completedDocs = docs.filter(doc => doc.fileData || doc.status === 'معتمد').length;
                      
                      const total = totalPacking + totalDocs;
                      const pct = total === 0 ? 0 : Math.round(((completedPacking + completedDocs) / total) * 100);

                      return (
                        <div key={t.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`w-6.5 h-6.5 rounded-md bg-gradient-to-br ${t.avatarColor} flex items-center justify-center font-black text-white text-[9px]`}>
                                {t.name[0]}
                              </div>
                              <span className="font-extrabold text-gray-700">{t.name.split(' ')[0]}</span>
                            </div>
                            <span className="font-mono font-bold text-[#2D6A4F]">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-l from-[#2D6A4F] to-[#74C69D] h-full rounded-full transition-all duration-500" 
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>



            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'الوجهة والمدة', value: '3 وجهات | 12 يوماً', desc: 'موسكو، ريف موسكو، سان بطرسبرغ', icon: Calendar, color: 'text-[#2D6A4F]' },
                { label: 'رصيد الصندوق المتبقي', value: `${financeStats.remainingFund.toLocaleString()} ر.س`, desc: `المجمع: ${financeStats.totalFundCollected.toLocaleString()} ر.س`, icon: Coins, color: 'text-amber-700' },
                { label: 'إنجاز المهام المشتركة', value: `${financeStats.taskPercent}%`, desc: `${financeStats.completedTasks} من أصل ${financeStats.totalTasks} مهام`, icon: CheckSquare, color: 'text-blue-700' },
                { label: 'حقيبتك الشخصية', value: `${financeStats.packingPercent}%`, desc: `${financeStats.packedCount} من أصل ${financeStats.totalPacking} مجهزة`, icon: Briefcase, color: 'text-rose-700' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="white-card p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-500 font-bold">{card.label}</p>
                      <h3 className="text-base md:text-lg font-black text-[#1A1A1A]">{card.value}</h3>
                      <p className="text-[9px] text-gray-400 font-medium">{card.desc}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-[#F9F7F4] border border-[#E8E0D5] flex items-center justify-center ${card.color}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Travelers list */}
            <div className="white-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="text-[#2D6A4F]" size={18} />
                  <h3 className="text-sm font-bold text-[#1A1A1A]">أعضاء الرحلة وجاهزيتهم</h3>
                </div>
                <span className="text-[10px] text-gray-400 font-bold">4 أعضاء</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {travelers.map((traveler) => {
                  const isSelf = traveler.id === currentUser.id;
                  
                  const userList = personalPacking[traveler.id] || [];
                  const packed = userList.filter(item => item.checked).length;
                  const total = userList.length;
                  const packingPercent = total ? Math.round((packed / total) * 100) : 0;
                  
                  return (
                    <div 
                      key={traveler.id} 
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                        isSelf ? 'border-[#2D6A4F] bg-[#2D6A4F]/5' : 'border-[#E8E0D5]/70 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${traveler.avatarColor} flex items-center justify-center font-bold text-white text-[10px]`}>
                          {traveler.name[0]}
                        </div>
                        <div className="text-right">
                          <h4 className="font-bold text-[#1A1A1A] text-xs flex items-center gap-1">
                            {traveler.name}
                            {isSelf && <span className="bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 px-1 py-0.5 rounded text-[8px]">أنت</span>}
                          </h4>
                          <p className="text-[9px] text-gray-500 m-0">{traveler.role}</p>
                        </div>
                      </div>

                      <div className="bg-[#F9F7F4] border border-[#E8E0D5] p-2 rounded-lg flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 font-bold">حقيبة السفر:</span>
                        {isSelf ? (
                          <span className="text-[#2D6A4F] font-black">{packingPercent}% ({packed}/{total})</span>
                        ) : (
                          <span className="text-gray-400 font-bold flex items-center gap-0.5">
                            <EyeOff size={10} className="text-gray-400" />
                            <span>{packingPercent}% (خاص)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL SPACE (PACKING & DOCUMENTS) - PRIVATE */}
        {activeTab === 'personal' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E0D5] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 flex items-center justify-center text-[#2D6A4F]">
                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">
                    المساحة الشخصية والوثائق لـ {currentUser.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">تجهيز حقيبتك ومستندات سفرك. هذه البيانات خاصة بك وتظهر فقط للمستخدم النشط.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-[#E8E0D5]/50 border border-[#E8E0D5] px-4 py-2 rounded-xl text-xs">
                <span className="text-gray-500">جوال الدخول:</span>
                <span className="font-bold font-mono text-[#2D6A4F]">{currentUser.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Document Tracker List (FileUpload integration) */}
              <div className="white-card p-6 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3">
                  <FileText className="text-[#2D6A4F]" size={18} />
                  <h3 className="text-sm font-bold text-[#1A1A1A]">أوراق ومستندات السفر الرسمية</h3>
                </div>

                <div className="space-y-4">
                  {(personalDocs[currentUser.id] || []).map((doc) => {
                    const isExpiring = doc.id === 'doc1' && doc.expiryDate && isDocExpiringSoon(doc.expiryDate);
                    return (
                      <div key={doc.id} className={`bg-[#F9F7F4] p-4 rounded-xl border space-y-2 text-right transition-colors ${
                        isExpiring ? 'border-red-300 bg-red-50/20' : 'border-[#E8E0D5]/70'
                      }`}>
                        <div>
                          <h4 className="font-bold text-[#1A1A1A] text-xs flex items-center justify-between gap-1">
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

                        <div className="flex items-center justify-between border-t border-[#E8E0D5]/60 pt-2 text-xs">
                          <span className="text-[10px] text-gray-500">الحالة:</span>
                          <select
                            value={doc.status}
                            onChange={(e) => changeDocumentStatus(doc.id, e.target.value)}
                            className="bg-white border border-[#E8E0D5] rounded-lg px-2 py-1 text-[10px] text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer"
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
                              className="bg-white border border-[#E8E0D5] rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-[#2D6A4F] font-mono text-left"
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
                          <div className="pt-2 flex items-center justify-between bg-white border border-[#E8E0D5] px-3 py-2 rounded-xl text-xs gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDocForView({ name: doc.title, data: doc.fileData })}
                              className="text-[#2D6A4F] hover:underline flex items-center gap-1 text-[10px] font-bold cursor-pointer"
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
                              className="w-full bg-white hover:bg-gray-50 border border-dashed border-[#E8E0D5] hover:border-[#2D6A4F] py-2 px-3 rounded-xl text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
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

              {/* Personal Packing Checklist */}
              <div className="lg:col-span-2 white-card p-6 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D5] pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-[#2D6A4F]" size={18} />
                    <h3 className="text-sm font-bold text-[#1A1A1A]">حقيبتي الشخصية (مستلزمات السفر)</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-bold">الأغراض المجهزة:</span>
                    <span className="bg-[#2D6A4F]/10 text-[#2D6A4F] px-2.5 py-0.5 rounded-full font-bold border border-[#2D6A4F]/20">
                      {financeStats.packedCount} من {financeStats.totalPacking} ({financeStats.packingPercent}%)
                    </span>
                  </div>
                </div>

                {/* Form to add personal item */}
                <form onSubmit={addPersonalPackingItem} className="flex gap-2 bg-[#F9F7F4] p-2 rounded-xl border border-[#E8E0D5]">
                  <input 
                    type="text" 
                    placeholder="أضف غرض شخصي آخر..."
                    value={newPersonalItem.title}
                    onChange={(e) => setNewPersonalItem(prev => ({ ...prev, title: e.target.value }))}
                    className="flex-1 bg-transparent border-none px-2 text-xs text-[#1A1A1A] focus:outline-none placeholder-gray-500 text-right"
                  />
                  <select
                    value={newPersonalItem.category}
                    onChange={(e) => setNewPersonalItem(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-white border border-[#E8E0D5] rounded-lg px-2 text-[10px] text-gray-600 focus:outline-none cursor-pointer"
                  >
                    <option value="إلكترونيات">إلكترونيات</option>
                    <option value="عناية شخصية">عناية شخصية</option>
                    <option value="ملابس ومستلزمات">ملابس ومستلزمات</option>
                    <option value="وثائق وأموال">وثائق وأموال</option>
                  </select>
                  <button 
                    type="submit"
                    className="bg-[#2D6A4F] hover:bg-[#1b4332] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    إضافة
                  </button>
                </form>

                {/* Packing list categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['إلكترونيات', 'عناية شخصية', 'ملابس ومستلزمات', 'وثائق وأموال'].map((cat) => {
                    const catItems = (personalPacking[currentUser.id] || []).filter(item => item.category === cat);
                    return (
                      <div key={cat} className="space-y-3 bg-[#F9F7F4]/40 border border-[#E8E0D5]/50 p-4 rounded-xl">
                        <h4 className="font-extrabold text-[#2D6A4F] text-xs border-b border-[#E8E0D5] pb-1.5 text-right">{cat}</h4>
                        
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
                                    className="w-4 h-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-0 cursor-pointer"
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E0D5] pb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">مسار الرحلة والنشاطات اليومية</h2>
                <p className="text-xs text-gray-500 mt-1">تتبع خط سير الرحلة وقادة اليوم المسؤولين عن التنسيق والمجموعات</p>
              </div>

              {/* City selector buttons */}
              <div className="flex gap-1.5 bg-[#E8E0D5]/50 p-1 rounded-xl border border-[#E8E0D5]">
                {['الكل', 'موسكو', 'سان بطرسبرغ', 'سوتشي'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setItineraryCityFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      itineraryCityFilter === c 
                        ? 'bg-[#2D6A4F] text-white shadow-xs' 
                        : 'text-gray-600 hover:text-[#1A1A1A]'
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
                      <div key={item.id} className="relative pl-0 pr-6 border-r border-[#E8E0D5] last:border-0 pb-1">
                        {/* Timeline dot */}
                        <span className={`absolute top-1 right-[-4.5px] w-2.5 h-2.5 rounded-full border border-white ${
                          isActive ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-[#2D6A4F]'
                        }`} />
                        
                        <div className={`white-card p-5 rounded-xl transition-all space-y-2 ${
                          isActive 
                            ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30' 
                            : 'hover:border-[#2D6A4F]/40'
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
                                    className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-left font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-400 font-bold block">المدينة</label>
                                  <select
                                    value={editActivityData.city}
                                    onChange={(e) => setEditActivityData(prev => ({ ...prev, city: e.target.value }))}
                                    className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-right cursor-pointer"
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
                                  className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-right cursor-pointer"
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
                                  className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-bold block">الأنشطة والتفاصيل</label>
                                <textarea 
                                  rows="3"
                                  value={editActivityData.activities}
                                  onChange={(e) => setEditActivityData(prev => ({ ...prev, activities: e.target.value }))}
                                  className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs leading-relaxed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-bold block">ملاحظات (مطاعم ومقاهي مقترحة)</label>
                                <input 
                                  type="text"
                                  value={editActivityData.notes}
                                  onChange={(e) => setEditActivityData(prev => ({ ...prev, notes: e.target.value }))}
                                  className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveActivityEdit(item.id)}
                                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
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
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E0D5]/60 pb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#2D6A4F] font-bold px-2 py-0.5 rounded text-[10px] font-mono">اليوم {item.day}</span>
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
                                  <span className="flex items-center gap-1 text-[10px] text-[#2D6A4F] font-bold">
                                    <MapPin size={11} />
                                    {item.city}
                                  </span>
                                  {canEdit && (
                                    <div className="flex items-center gap-1.5">
                                      <button 
                                        onClick={() => startEditingActivity(item)}
                                        className="text-gray-400 hover:text-[#2D6A4F] p-0.5 rounded transition cursor-pointer"
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
                              
                              <h4 className="font-extrabold text-[#1A1A1A] text-sm">{item.title}</h4>
                              <p className="text-xs text-gray-600 font-light leading-relaxed m-0">{item.activities}</p>
                              {item.notes && (
                                <div className="bg-[#2D6A4F]/5 border-r-2 border-[#2D6A4F] p-2.5 rounded-l-lg text-[11px] text-[#1B4332] font-semibold mt-1">
                                  · {item.notes}
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
                <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                  <Plus className="text-[#2D6A4F]" size={18} />
                  <h3 className="text-sm font-bold text-[#1A1A1A]">إضافة يوم جديد للمسار</h3>
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-left font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">الوجهة / المدينة</label>
                      <select
                        value={newActivity.city}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">التفاصيل والأنشطة</label>
                      <textarea 
                        rows="3"
                        placeholder="صف نشاطات هذا اليوم بالتفصيل..."
                        value={newActivity.activities}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, activities: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">ملاحظات (مطاعم ومقاهي مقترحة)</label>
                      <input 
                        type="text" 
                        placeholder="مثال: تجربة كافيه Grand Kafe..."
                        value={newActivity.notes || ''}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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
            <div className="border-b border-[#E8E0D5] pb-6">
              <h2 className="text-xl font-bold text-[#1A1A1A]">الحجوزات والتذاكر المؤكدة</h2>
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
                  <div key={booking.id} className="white-card p-5 rounded-xl flex flex-col justify-between gap-4 hover:border-[#E8E0D5] transition-all duration-200">
                    {editingBookingId === booking.id ? (
                      <div className="w-full space-y-3 text-right">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold block">النوع</label>
                            <select
                              value={editBookingData.type}
                              onChange={(e) => setEditBookingData(prev => ({ ...prev, type: e.target.value }))}
                              className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-right cursor-pointer"
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
                              className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-right cursor-pointer"
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
                            className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold block">التفاصيل</label>
                          <textarea 
                            rows="2"
                            value={editBookingData.details}
                            onChange={(e) => setEditBookingData(prev => ({ ...prev, details: e.target.value }))}
                            className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs leading-relaxed"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveBookingEdit(booking.id)}
                            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
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
                          <div className="w-10 h-10 rounded-lg bg-[#F9F7F4] border border-[#E8E0D5] flex items-center justify-center shrink-0 text-[#2D6A4F]">
                            {booking.type === 'طيران' ? <Plane size={20} /> : booking.type === 'سكن' ? <Hotel size={20} /> : <FileText size={20} />}
                          </div>
                          <div className="text-right space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-[#2D6A4F] bg-[#2D6A4F]/10 px-1.5 py-0.5 rounded font-bold">{booking.type}</span>
                              <h4 className="font-extrabold text-[#1A1A1A] text-sm">{booking.title}</h4>
                            </div>
                            <p className="text-xs text-gray-600 font-light leading-relaxed m-0">{booking.details}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[#E8E0D5] pt-3 sm:pt-0">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                            booking.status === 'مؤكد' 
                              ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/25' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {booking.status === 'مؤكد' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            <span>{booking.status}</span>
                          </span>
                          
                          {canEdit && (
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => startEditingBooking(booking)}
                                className="text-gray-400 hover:text-[#2D6A4F] p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
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
                <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                  <Plus className="text-[#2D6A4F]" size={18} />
                  <h3 className="text-sm font-bold text-[#1A1A1A]">إضافة حجز جديد للرحلة</h3>
                </div>

                {canEdit ? (
                  <form onSubmit={handleAddBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">نوع الحجز</label>
                      <select
                        value={newBooking.type}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">حالة الحجز</label>
                      <select
                        value={newBooking.status}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] leading-relaxed"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E0D5] pb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">قائمة المهام المشتركة</h2>
                <p className="text-xs text-gray-500 mt-1">توزيع التجهيزات والمهام التنظيمية العامة قبل الرحلة ومتابعة جاهزيتها</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 justify-end">
                <span>المهام المنجزة:</span>
                <span className="bg-[#2D6A4F]/10 text-[#2D6A4F] px-2.5 py-0.5 rounded-full border border-[#2D6A4F]/20">
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
                      task.completed ? 'border-r-[#2D6A4F] bg-[#2D6A4F]/5' : 'border-r-[#E8E0D5]'
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
                            className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-400 font-bold block">المسؤول</label>
                            <select
                              value={editTaskData.assignee}
                              onChange={(e) => setEditTaskData(prev => ({ ...prev, assignee: e.target.value }))}
                              className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-right cursor-pointer font-bold"
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
                              className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-lg p-2 text-xs text-right cursor-pointer"
                            >
                              <option value="تجهيزات">تجهيزات واستعدادات</option>
                              <option value="لوجستيات">حجوزات ولوجستيات</option>
                              <option value="برامج">أنشطة ومخططات</option>
                              <option value="مالية">أمور مالية وتكاليف</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-[#F9F7F4] rounded-lg border border-[#E8E0D5]">
                          <input 
                            type="checkbox" 
                            id={`edit-critical-${task.id}`}
                            checked={editTaskData.isCritical}
                            onChange={(e) => setEditTaskData(prev => ({ ...prev, isCritical: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor={`edit-critical-${task.id}`} className="text-xs font-bold text-gray-600 cursor-pointer select-none">تعليم هذه المهمة كحرجة وعاجلة</label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveTaskEdit(task.id)}
                            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
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
                                ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white' 
                                : 'border-gray-300 hover:border-[#2D6A4F] text-transparent'
                            }`}
                          >
                            <Check size={12} className="stroke-[3]" />
                          </button>
                          
                          <div className="text-right">
                            <span className={`text-xs ${task.completed ? 'text-gray-400 line-through' : 'text-[#1A1A1A] font-semibold'} flex items-center gap-1.5`}>
                              {task.title}
                              {task.isCritical && !task.completed && (
                                <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[8px] font-black">هام وعاجل</span>
                              )}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[9px] text-gray-500">
                              <span className="bg-[#E8E0D5]/50 px-1.5 py-0.2 rounded font-semibold">{task.category}</span>
                              <span>المسؤول: <strong className="text-[#2D6A4F] font-bold">{task.assignee}</strong></span>
                            </div>
                          </div>
                        </div>

                        {canEdit && (
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => startEditingTask(task)}
                              className="text-gray-400 hover:text-[#2D6A4F] p-1 rounded hover:bg-gray-100 transition cursor-pointer"
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
                <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                  <Plus className="text-[#2D6A4F]" size={18} />
                  <h3 className="text-sm font-bold text-[#1A1A1A] font-sans">إنشاء مهمة جديدة</h3>
                </div>

                {canEdit ? (
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المهمة</label>
                      <input 
                        type="text" 
                        placeholder="مثال: حجز طيران سوتشي الداخلي"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المسؤول عن التجهيز</label>
                      <select
                        value={newTask.assignee}
                        onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
                      >
                        <option value="تجهيزات">تجهيزات واستعدادات</option>
                        <option value="لوجستيات">حجوزات ولوجستيات</option>
                        <option value="برامج">أنشطة ومخططات</option>
                        <option value="مالية">أمور مالية وتكاليف</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-[#F9F7F4] rounded-xl border border-[#E8E0D5]">
                      <input 
                        type="checkbox" 
                        id="critical-task-checkbox"
                        checked={newTask.isCritical}
                        onChange={(e) => setNewTask(prev => ({ ...prev, isCritical: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="critical-task-checkbox" className="text-xs font-bold text-gray-600 cursor-pointer select-none">تعليم هذه المهمة كحرجة وعاجلة</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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
            <div className="border-b border-[#E8E0D5] pb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">صندوق الرحلة والميزانية العامة (المالية والقطة)</h2>
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

            {/* Fund State Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#2D6A4F]/5 border-2 border-[#2D6A4F] p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="z-10">
                  <span className="text-[10px] text-gray-500 font-bold block">الرصيد المتبقي بالصندوق المشترك</span>
                  <span className="text-2xl font-black text-[#2D6A4F] block mt-1">
                    {financeStats.remainingFund.toLocaleString()} ر.س
                  </span>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-3">
                    <div 
                      className="bg-[#2D6A4F] h-full" 
                      style={{ width: `${Math.min(100, Math.round((financeStats.remainingFund / (financeStats.totalFundCollected || 1)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
                <Coins className="absolute left-2 bottom-2 text-[#2D6A4F]/10 w-24 h-24" />
              </div>

              <div className="white-card p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">إجمالي المحصل بالصندوق (القطة)</span>
                  <span className="text-xl font-bold text-gray-800 block mt-1">
                    {financeStats.totalFundCollected.toLocaleString()} ر.س
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-1 font-semibold">
                    القطة من الأعضاء: {(financeStats.totalFundCollected - reserveFund).toLocaleString()} ر.س | الاحتياطي: {reserveFund.toLocaleString()} ر.س
                  </span>
                </div>
              </div>

              <div className="white-card p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">المنصرف من الصندوق لحساب المشتريات</span>
                  <span className="text-xl font-bold text-amber-800 block mt-1">
                    {financeStats.spentFromFund.toLocaleString()} ر.س
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-1 font-semibold">
                    المدفوعات الشخصية الأخرى (توزع لاحقاً): {financeStats.totalPersonalSpent.toLocaleString()} ر.س
                  </span>
                </div>
              </div>
            </div>

            {/* Contribution and Reserve Cash Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contributions & Reserve editing */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Member Contributions */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
                    <h3 className="text-xs font-black text-gray-800">حالة دفع قطة السفر المشتركة (المستهدف: 5,000 ر.س لكل شخص)</h3>
                    {isFinanceSupervisor && (
                      <span className="text-[8px] bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] px-2 py-0.5 rounded font-black">
                        أنت مخول بالتعديل
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right divide-y divide-[#E8E0D5]">
                      <thead>
                        <tr className="text-gray-500 font-bold">
                          <th className="pb-2">اسم العضو</th>
                          <th className="pb-2 text-center">المستهدف (ر.س)</th>
                          <th className="pb-2 text-center">المدفوع الفعلي (ر.س)</th>
                          <th className="pb-2 text-center">المتبقي (ر.س)</th>
                          <th className="pb-2 text-left">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E0D5]/50 text-gray-700 font-medium">
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
                                    className="bg-[#F9F7F4] border border-[#E8E0D5] rounded px-1.5 py-1 text-[10px] text-center w-20 font-mono"
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
                                    className="bg-[#F9F7F4] border border-[#E8E0D5] rounded px-1.5 py-1 text-[10px] text-center w-20 font-mono"
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
                  <div className="pt-4 border-t border-[#E8E0D5] flex items-center justify-between flex-wrap gap-4 bg-[#F9F7F4] p-3 rounded-xl">
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
                            className="bg-white border border-[#E8E0D5] rounded-lg px-2 py-1 text-xs text-center w-24 font-mono font-bold focus:outline-none focus:border-[#2D6A4F]"
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
                    <span className="text-[9px] text-[#2D6A4F] font-bold">معدل الصرف: 1 ر.س = {currencyRates.rub} روبل</span>
                  </div>

                  {pricingPlan === 'free' ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 bg-[#F9F7F4]/80 rounded-2xl border border-dashed border-[#E8E0D5] p-6">
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
                      <div className="bg-[#F9F7F4] border border-[#E8E0D5] p-4 rounded-xl space-y-3">
                        <h4 className="text-xs font-bold text-gray-700">تحويل من ريال سعودي (SAR)</h4>
                        <div className="space-y-2">
                          <div>
                            <input 
                              type="number"
                              value={calcAmountSar}
                              onChange={(e) => setCalcAmountSar(e.target.value)}
                              className="w-full bg-white border border-[#E8E0D5] rounded-lg p-2 text-xs font-mono text-left focus:outline-none focus:border-[#2D6A4F]"
                              placeholder="أدخل المبلغ بالريال..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-200/50">
                            <div>
                              <span className="text-[9px] text-gray-400 block">الروبل الروسي:</span>
                              <span className="font-mono font-bold text-[#2D6A4F]">{((parseFloat(calcAmountSar) || 0) * currencyRates.rub).toLocaleString(undefined, { maximumFractionDigits: 2 })} RUB</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 block">الدولار الأمريكي:</span>
                              <span className="font-mono font-bold text-gray-700">{((parseFloat(calcAmountSar) || 0) * currencyRates.usd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Convert RUB to SAR */}
                      <div className="bg-[#F9F7F4] border border-[#E8E0D5] p-4 rounded-xl space-y-3">
                        <h4 className="text-xs font-bold text-gray-700">تحويل من روبل روسي (RUB)</h4>
                        <div className="space-y-2">
                          <div>
                            <input 
                              type="number"
                              value={calcAmountRub}
                              onChange={(e) => setCalcAmountRub(e.target.value)}
                              className="w-full bg-white border border-[#E8E0D5] rounded-lg p-2 text-xs font-mono text-left focus:outline-none focus:border-[#2D6A4F]"
                              placeholder="أدخل المبلغ بالروبل..."
                            />
                          </div>
                          <div className="text-xs pt-1 border-t border-gray-200/50">
                            <span className="text-[9px] text-gray-400 block">الريال السعودي الموازي:</span>
                            <span className="font-mono font-bold text-[#2D6A4F]">{((parseFloat(calcAmountRub) || 0) / currencyRates.rub).toLocaleString(undefined, { maximumFractionDigits: 2 })} SAR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Advanced Settlement ledger */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-start gap-2.5 justify-start">
                    <Info className="text-[#2D6A4F] shrink-0 mt-0.5" size={16} />
                    <div className="text-right">
                      <h4 className="font-black text-xs text-gray-800">مخلص التسوية المالية الخاصة (للشباب)</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                        هذا التقرير يستعرض تسوية المبالغ المدفوعة من الجيوب الخاصة (المصروفات غير المدفوعة من الصندوق المشترك). يتم احتساب حصة الفرد العادلة لتحديد من يجب عليه التحويل ومقدار التحويل للآخرين.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F9F7F4] border border-[#E8E0D5] p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                      <span>إجمالي المدفوع شخصياً:</span>
                      <span className="font-mono text-[#1A1A1A]">{financeStats.totalPersonalSpent.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#2D6A4F] border-b border-[#E8E0D5] pb-2">
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
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 bg-[#F9F7F4]/60 rounded-xl border border-dashed border-[#E8E0D5] p-4">
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
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black text-gray-800 border-b border-gray-100 pb-3">سجل المصروفات ومشتريات الصندوق</h3>
                  
                  <div className="divide-y divide-[#E8E0D5]/50">
                    {expenses.map((expense) => {
                      const isFund = expense.paidBy === 'الصندوق';
                      return (
                        <div key={expense.id} className="py-3 flex items-center justify-between text-xs gap-3">
                          <div className="text-right space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                                isFund 
                                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20'
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
                              <span className="font-extrabold text-[#2D6A4F] font-mono">{expense.amountSar.toLocaleString()} ر.س</span>
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

              {/* Add Expense Sidebar Form */}
              <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                  <Plus className="text-[#2D6A4F]" size={18} />
                  <h3 className="text-sm font-bold text-[#1A1A1A]">تسجيل مصروف جديد</h3>
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] font-mono text-left"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">طريقة الدفع (خصم من)</label>
                      <select
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, paidBy: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
                      >
                        <option value="الصندوق">الصندوق المشترك (خصم من رصيد القطة)</option>
                        {travelers.map(t => (
                          <option key={t.id} value={t.name}>{t.name} (دفع من جيبه الخاص)</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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
            <div className="border-b border-[#E8E0D5] pb-6">
              <h2 className="text-xl font-bold text-[#1A1A1A]">مجلس المقترحات والقرارات المشتركة</h2>
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
                        poll.isActive ? 'border-[#2D6A4F]/30 bg-[#2D6A4F]/2' : 'border-gray-200 bg-gray-50/40'
                      } space-y-4`}>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] text-gray-400 font-bold block">الهدف: اليوم {poll.targetDay} في {poll.targetCity}</span>
                          <span className="text-[10px] text-gray-500 font-extrabold">طرح بواسطة: <strong className="text-[#2D6A4F]">{poll.creator}</strong></span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-[#1A1A1A] text-sm flex items-center gap-1.5">
                            <Vote size={16} className="text-[#2D6A4F]" />
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
                                        ? 'bg-[#2D6A4F]/10 border-[#2D6A4F] text-[#2D6A4F]'
                                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                  } ${poll.isActive ? 'cursor-pointer' : ''}`}
                                >
                                  <div className="flex items-center gap-2">
                                    {poll.isActive && (
                                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                        hasVoted ? 'border-[#2D6A4F]' : 'border-gray-300'
                                      }`}>
                                        {hasVoted && <div className="w-2 h-2 rounded-full bg-[#2D6A4F]"></div>}
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
                                      isWinningOption ? 'bg-amber-500' : hasVoted ? 'bg-[#2D6A4F]' : 'bg-gray-300'
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
                        <div key={prop.id} className="white-card p-5 rounded-2xl border border-[#E8E0D5]/70 space-y-4 transition hover:border-[#2D6A4F]/20">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 font-bold block">تاريخ النشر: {prop.date}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold">المقترح بواسطة: <strong className="text-[#2D6A4F]">{prop.proposer}</strong></span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-extrabold text-[#1A1A1A] text-sm">{prop.title}</h4>
                            <p className="text-xs text-gray-600 font-light leading-relaxed m-0">{prop.description}</p>
                          </div>

                          {/* Votes breakdown */}
                          <div className="space-y-2 bg-[#F9F7F4] p-3 rounded-xl border border-[#E8E0D5]/60">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                              <span>نسبة التأييد: {percentUp}%</span>
                              <span>إجمالي الأصوات: {totalVotes} صوت</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                              <div className="bg-[#2D6A4F] h-full" style={{ width: `${percentUp}%` }}></div>
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
                                  : 'bg-white border-[#E8E0D5] text-gray-600 hover:bg-emerald-50/50'
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
                                  : 'bg-white border-[#E8E0D5] text-gray-600 hover:bg-rose-50/50'
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
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                    <Plus className="text-[#2D6A4F]" size={18} />
                    <h3 className="text-sm font-bold text-[#1A1A1A] font-sans">طرح استطلاع خيارات متعددة</h3>
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 block">الخيارات المتاحة (أدخل خيارين على الأقل)</label>
                      <input 
                        name="pollOpt1"
                        type="text" 
                        placeholder="الخيار الأول (إلزامي)"
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                        required
                      />
                      <input 
                        name="pollOpt2"
                        type="text" 
                        placeholder="الخيار الثاني (إلزامي)"
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                        required
                      />
                      <input 
                        name="pollOpt3"
                        type="text" 
                        placeholder="الخيار الثالث (اختياري)"
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">يوم الرحلة</label>
                        <select 
                          name="pollDay"
                          className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-2 py-2 text-xs focus:outline-none cursor-pointer"
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
                          className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-2 py-2 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="موسكو">موسكو</option>
                          <option value="ريف موسكو">ريف موسكو</option>
                          <option value="سانت بطرسبرغ">سانت بطرسبرغ</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>نشر استبيان الخيارات</span>
                    </button>
                  </form>
                </div>

                {/* B. Create Standard Up/Down Proposal */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                    <Plus className="text-[#2D6A4F]" size={18} />
                    <h3 className="text-sm font-bold text-[#1A1A1A] font-sans">طرح مقترح ثنائي</h3>
                  </div>

                  <form onSubmit={handleAddProposal} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">عنوان المقترح</label>
                      <input 
                        type="text" 
                        placeholder="مثال: زيادة يوم في موسكو"
                        value={newProposal.title}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-[#F9F7F4] rounded-xl border border-[#E8E0D5]">
                      <input 
                        type="checkbox" 
                        id="proposal-alert-checkbox"
                        checked={newProposal.sendAlert}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, sendAlert: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="proposal-alert-checkbox" className="text-xs font-bold text-gray-600 cursor-pointer select-none">بث إشعار عاجل للشباب بالتطبيق</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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
            <div className="border-b border-[#E8E0D5] pb-6">
              <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2 justify-start">
                <Shield size={22} className="text-[#2D6A4F]" />
                <span>لوحة تحكم مدير الرحلة (عبدالله الزهراني)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">أدوات إشرافية متكاملة للتحكم في تواريخ الرحلة، بث التنبيهات العاجلة، وقفل التعديل والمحاكاة.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'عدد أيام الرحلة', value: '12 يوماً', desc: 'تغطي الفترة المحددة', icon: Calendar, color: 'text-[#2D6A4F]' },
                { label: 'أعضاء القروب', value: '4 أعضاء', desc: 'عبدالله، عبدالعزيز، حسن، فهد', icon: Users, color: 'text-blue-700' },
                { label: 'الحجوزات المنجزة', value: `${financeStats.confirmedBookings} من ${financeStats.totalBookings}`, desc: 'تذاكر طيران وفنادق وقطارات', icon: Hotel, color: 'text-amber-700' },
                { label: 'المهام المشتركة المكتملة', value: `${financeStats.completedTasks} من ${financeStats.totalTasks}`, desc: `نسبة الإنجاز الفعلي ${financeStats.taskPercent}%`, icon: CheckSquare, color: 'text-purple-700' }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="white-card p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-500 font-bold">{m.label}</p>
                      <h3 className="text-base font-black text-[#1A1A1A]">{m.value}</h3>
                      <p className="text-[9px] text-gray-400 font-medium">{m.desc}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-[#F9F7F4] border border-[#E8E0D5] flex items-center justify-center ${m.color}`}>
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
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3">
                    <Settings className="text-[#2D6A4F]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">إعدادات الرحلة وتعديل التواريخ</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">تاريخ الذهاب والانطلاق</label>
                      <input 
                        type="date"
                        value={tripStartDate}
                        onChange={(e) => setTripStartDate(e.target.value)}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-mono text-left focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">تاريخ العودة والرجوع</label>
                      <input 
                        type="date"
                        value={tripEndDate}
                        onChange={(e) => setTripEndDate(e.target.value)}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-mono text-left focus:outline-none focus:border-[#2D6A4F]"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl flex items-center justify-between gap-4">
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
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3">
                    <Bot className="text-[#2D6A4F]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">محاكاة يوم الرحلة النشط والتقارير</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">اختر اليوم النشط الحالي للمحاكاة</label>
                      <select
                        value={simulatedActiveDay}
                        onChange={(e) => setSimulatedActiveDay(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer"
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
                        className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#2D6A4F]/20"
                      >
                        <Send size={14} />
                        <span>بث إشعار اليوم النشط لقروب تيليجرام</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 3: Urgent Broadcast Alerts */}
                <div className="white-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3">
                    <Megaphone className="text-[#2D6A4F]" size={18} />
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
                      className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] leading-relaxed"
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
                    <Megaphone className="text-[#2D6A4F]" size={18} />
                    <h3 className="text-sm font-bold text-gray-800">إدارة الإعلانات وتوجيهات الإدارة</h3>
                  </div>

                  {marketingBanners.length === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">لا توجد إعلانات نشطة حالياً.</p>
                  ) : (
                    <div className="space-y-3">
                      {marketingBanners.map(banner => (
                        <div key={banner.id} className="p-4 bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl flex items-center justify-between gap-4 text-xs">
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
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                    <Plus className="text-[#2D6A4F]" size={18} />
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">محتوى الإعلان</label>
                      <textarea 
                        name="bannerText"
                        rows="3"
                        placeholder="اكتب تفاصيل الإعلان أو التوجيه هنا..."
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">النمط البصري</label>
                      <select
                        name="bannerTheme"
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
                      >
                        <option value="green">أخضر هادئ (تنبيه داخلي)</option>
                        <option value="gold">ذهبي فخم (تنبيه هام جداً)</option>
                        <option value="blue">أزرق سماوي (تنبيه معلوماتي)</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} />
                      <span>نشر الإعلان للجميع</span>
                    </button>
                  </form>
                </div>

                {/* Card 6: Quick Task Assignment Form */}
                <div className="white-card p-6 rounded-2xl h-fit space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E8E0D5] pb-3 justify-start">
                    <Plus className="text-[#2D6A4F]" size={18} />
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">المسؤول عن التجهيز</label>
                      <select
                        value={newTask.assignee}
                        onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
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
                        className="w-full bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2D6A4F] text-right cursor-pointer font-bold"
                      >
                        <option value="تجهيزات">تجهيزات واستعدادات</option>
                        <option value="لوجستيات">حجوزات ولوجستيات</option>
                        <option value="برامج">أنشطة ومخططات</option>
                        <option value="مالية">أمور مالية وتكاليف</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-[#F9F7F4] rounded-xl border border-[#E8E0D5]">
                      <input 
                        type="checkbox" 
                        id="admin-critical-task-checkbox"
                        checked={newTask.isCritical}
                        onChange={(e) => setNewTask(prev => ({ ...prev, isCritical: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#2D6A4F] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="admin-critical-task-checkbox" className="text-xs font-bold text-gray-600 cursor-pointer select-none">مهمة عاجلة وحرجة</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E0D5] flex justify-around py-2.5 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe-bottom">
        {[
          { id: 'dashboard', label: 'الرئيسية', icon: Award },
          { id: 'itinerary', label: 'الجدول', icon: Calendar },
          { id: 'personal', label: 'حقيبتي', icon: Lock },
          { id: 'tasks', label: 'المهام', icon: CheckSquare },
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
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'text-[#2D6A4F] font-bold' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[9px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
        
        {/* 'More' Button to toggle Sidebar Drawer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <Menu size={18} className="stroke-[1.8]" />
          <span className="text-[9px] font-semibold">المزيد</span>
        </button>
      </nav>

      {/* TELEGRAM SIMULATION MODAL DIALOG */}
      {telegramMockOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E8E0D5] max-w-md w-full rounded-2xl p-6 space-y-4 text-right shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 justify-start">
              <Bot className="text-[#2D6A4F]" size={20} />
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
              className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
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
              <FileText size={16} className="text-[#2D6A4F]" />
              <span>معاينة مستند: {selectedDocForView.name}</span>
            </h3>
            <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center bg-gray-50 rounded-xl p-2 border border-[#E8E0D5]">
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
      {showWelcome && currentUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] overflow-y-auto animate-fadeIn"
          onClick={() => setShowWelcome(false)}
        >
          <div className="min-h-full flex items-center justify-center p-4">
            <div
              className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 space-y-5 text-center shadow-2xl relative border border-[#E8E0D5]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2D6A4F] to-[#74C69D] rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                <Compass size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-black text-gray-800">أهلاً بك يا {currentUser.name}</h3>
                <p className="text-sm text-gray-500 font-bold">عضو في فريق: {currentUser.role}</p>

                <div className="py-4 px-3 bg-[#F9F7F4] border border-[#E8E0D5] rounded-xl text-sm text-[#2D6A4F] leading-relaxed font-bold">
                  نتمنى لك وللأصدقاء سفرة ممتعة ومغامرة شيقة وجميلة في ربوع روسيا صيف 2026
                </div>

                <p className="text-xs text-gray-400 leading-relaxed pt-2">
                  تطبيق الرحلة يتيح لك متابعة الجدول اليومي، التذاكر، المهام المطلوبة منك، وتفاصيل القطة المالية المشتركة بشكل فوري.
                </p>
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-3 rounded-xl text-base font-black transition shadow-md cursor-pointer text-center"
              >
                دخول واستكشاف المخطط
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
