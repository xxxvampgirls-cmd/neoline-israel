/* Catalog fact labels translated conservatively from sourced Russian specs.
 * No fabricated product claims. Unknown source text stays in an explicit RU-only disclosure.
 * Distinguish navigation/firmware entries from technical specs. */
(function(){
 "use strict";
 const labelRows=[
 [
  "Выходное напряжение",
  "Output voltage",
  "מתח יציאה",
  "جهد الخرج"
 ],
 [
  "Максимальный выходной ток",
  "Maximum output current",
  "זרם יציאה מרבי",
  "أقصى تيار خرج"
 ],
 [
  "Длина кабеля",
  "Cable length",
  "אורך הכבל",
  "طول الكابل"
 ],
 [
  "Разъем питания",
  "Power connector",
  "מחבר חשמל",
  "موصل الطاقة"
 ],
 [
  "Вес",
  "Weight",
  "משקל",
  "الوزن"
 ],
 [
  "Вес без кабеля",
  "Weight without cable",
  "משקל ללא כבל",
  "الوزن دون الكابل"
 ],
 [
  "Размер",
  "Dimensions",
  "מידות",
  "الأبعاد"
 ],
 [
  "Разрешение",
  "Video resolution",
  "רזולוציית וידאו",
  "دقة الفيديو"
 ],
 [
  "Крепление",
  "Mount",
  "תושבת",
  "الحامل"
 ],
 [
  "Входное напряжение",
  "Input voltage",
  "מתח כניסה",
  "جهد الدخل"
 ],
 [
  "Интерфейс для подключения устройства",
  "Device interface",
  "ממשק חיבור המכשיר",
  "واجهة توصيل الجهاز"
 ],
 [
  "Верхний предел напряжения сети",
  "Maximum supply voltage",
  "מתח הזנה מרבי",
  "الجهد الأقصى للتغذية"
 ],
 [
  "Размер предохранителей на кабеле",
  "Cable fuse size",
  "גודל נתיכי הכבל",
  "مقاس مصهرات الكابل"
 ],
 [
  "Производительность, л/мин",
  "Air delivery (L/min)",
  "ספיקת אוויר (ל׳/דקה)",
  "تدفق الهواء (لتر/دقيقة)"
 ],
 [
  "Максимальное давление, атм (кг/см2)",
  "Maximum pressure (atm / kg/cm²)",
  "לחץ מרבי (אטמ׳ / ק״ג/סמ״ר)",
  "الضغط الأقصى (جو / كغ/سم²)"
 ],
 [
  "Автостоп",
  "Auto-stop",
  "עצירה אוטומטית",
  "إيقاف تلقائي"
 ],
 [
  "Длина шланга, м",
  "Hose length (m)",
  "אורך צינור (מ׳)",
  "طول الخرطوم (م)"
 ],
 [
  "Вид компрессора",
  "Compressor type",
  "סוג מדחס",
  "نوع الضاغط"
 ],
 [
  "Вид манометра",
  "Pressure gauge type",
  "סוג מד לחץ",
  "نوع مقياس الضغط"
 ],
 [
  "Мощность, Вт",
  "Power (W)",
  "הספק (ואט)",
  "القدرة (واط)"
 ],
 [
  "Питание",
  "Power supply",
  "מקור מתח",
  "مصدر الطاقة"
 ],
 [
  "Длина шнура питания",
  "Power cord length",
  "אורך כבל החשמל",
  "طول سلك الطاقة"
 ],
 [
  "Особенности компрессора",
  "Compressor features",
  "מאפייני המדחס",
  "ميزات الضاغط"
 ],
 [
  "Два варианта питания",
  "Two power options",
  "שתי אפשרויות מתח",
  "خيارا طاقة"
 ],
 [
  "Сумка-чехол в комплекте",
  "Carry bag included",
  "תיק נשיאה כלול",
  "حقيبة حمل مرفقة"
 ],
 [
  "Диффузор",
  "Cone",
  "ממברנה",
  "مخروط السماعة"
 ],
 [
  "Подвес",
  "Surround",
  "מתלה הרמקול",
  "محيط مخروط السماعة"
 ],
 [
  "Материал купола",
  "Dome material",
  "חומר הכיפה",
  "مادة القبة"
 ],
 [
  "Способ установки",
  "Installation method",
  "שיטת התקנה",
  "طريقة التثبيت"
 ],
 [
  "Тип акустической системы",
  "Speaker system type",
  "סוג מערכת הרמקולים",
  "نوع نظام السماعات"
 ],
 [
  "Форм-фактор",
  "Form factor",
  "גודל/תצורה",
  "عامل الشكل"
 ],
 [
  "Частотный диапазон",
  "Frequency response",
  "טווח תדרים",
  "نطاق الترددات"
 ],
 [
  "Импеданс, Ом",
  "Impedance (Ω)",
  "עכבה (Ω)",
  "الممانعة (أوم)"
 ],
 [
  "Размер купола",
  "Dome size",
  "קוטר כיפה",
  "حجم القبة"
 ],
 [
  "Plug & Play",
  "Plug & Play",
  "חיבור והפעלה",
  "التوصيل والتشغيل"
 ],
 [
  "Wi-Fi обновление",
  "Wi-Fi updates",
  "עדכונים דרך Wi-Fi",
  "تحديث عبر Wi-Fi"
 ],
 [
  "Дисплей",
  "Display",
  "מסך",
  "الشاشة"
 ],
 [
  "Матрица",
  "Image sensor",
  "חיישן תמונה",
  "مستشعر الصورة"
 ],
 [
  "Угол обзора",
  "Viewing angle",
  "זווית צילום",
  "زاوية الرؤية"
 ],
 [
  "Поворот камеры в салоне",
  "Interior camera rotation",
  "סיבוב המצלמה הפנימית",
  "دوران كاميرا المقصورة"
 ],
 [
  "Количество камер",
  "Number of cameras",
  "מספר מצלמות",
  "عدد الكاميرات"
 ],
 [
  "Голосовые подсказки",
  "Voice alerts",
  "התרעות קוליות",
  "تنبيهات صوتية"
 ],
 [
  "GPS-модуль",
  "GPS module",
  "מודול GPS",
  "وحدة GPS"
 ],
 [
  "GPS-база полицейских радаров",
  "GPS speed-camera database",
  "מאגר מצלמות מהירות GPS",
  "قاعدة بيانات كاميرات السرعة GPS"
 ],
 [
  "Датчик удара",
  "G-sensor",
  "חיישן זעזועים",
  "مستشعر الصدمات"
 ],
 [
  "Датчик движения",
  "Motion sensor",
  "חיישן תנועה",
  "مستشعر الحركة"
 ],
 [
  "Режим парковки",
  "Parking mode",
  "מצב חניה",
  "وضع الركن"
 ],
 [
  "Слот для карт памяти",
  "Memory card slots",
  "חריצים לכרטיסי זיכרון",
  "فتحات بطاقات الذاكرة"
 ],
 [
  "Макс. объем карты памяти",
  "Maximum memory card capacity",
  "קיבולת כרטיס זיכרון מרבית",
  "السعة القصوى لبطاقة الذاكرة"
 ],
 [
  "Аккумулятор/Суперконденсатор",
  "Battery / supercapacitor",
  "סוללה / קבל־על",
  "البطارية / المكثف الفائق"
 ],
 [
  "Производство",
  "Country of manufacture",
  "ארץ ייצור",
  "بلد الصنع"
 ],
 [
  "Автоматический ночной режим записи",
  "Automatic night recording",
  "צילום לילה אוטומטי",
  "تصوير ليلي تلقائي"
 ],
 [
  "Экстренная запись",
  "Emergency recording",
  "הקלטת חירום",
  "تسجيل الطوارئ"
 ],
 [
  "Интервальная съемка",
  "Time-lapse recording",
  "צילום במרווחי זמן",
  "تصوير بفاصل زمني"
 ],
 [
  "Интеллектуальная обработка камер контроля средней скорости",
  "Average-speed camera processing",
  "עיבוד מצלמות מהירות ממוצעת",
  "معالجة كاميرات قياس السرعة المتوسطة"
 ],
 [
  "Заставка с отображением спидометра",
  "Speedometer screensaver",
  "שומר מסך עם מד מהירות",
  "شاشة توقف تعرض السرعة"
 ],
 [
  "HDR",
  "HDR",
  "HDR",
  "HDR"
 ],
 [
  "Усилитель сигнала (LNA)",
  "Low-noise amplifier (LNA)",
  "מגבר אות (LNA)",
  "مضخّم الإشارة (LNA)"
 ],
 [
  "Сигнатура",
  "Signature detection",
  "זיהוי חתימות",
  "كشف البصمات الرادارية"
 ],
 [
  "Фильтр Z-сигнатур",
  "Z-signature filter",
  "מסנן חתימות Z",
  "مرشح بصمة Z"
 ],
 [
  "Детектирование Multa Radar (диапазон М)",
  "Multa Radar detection (M band)",
  "זיהוי Multa Radar (תחום M)",
  "كشف Multa Radar (النطاق M)"
 ],
 [
  "Motion Control (управление жестами)",
  "Gesture control (Motion Control)",
  "שליטה במחוות (Motion Control)",
  "التحكم بالإيماءات (Motion Control)"
 ],
 [
  "Переворот дисплея",
  "Display flip",
  "היפוך תצוגה",
  "قلب الشاشة"
 ],
 [
  "Настройка допустимого превышения скорости",
  "Speed tolerance setting",
  "הגדרת חריגת מהירות מותרת",
  "ضبط هامش تجاوز السرعة"
 ],
 [
  "Допустимое превышение скорости",
  "Speed tolerance",
  "חריגת מהירות מותרת",
  "هامش تجاوز السرعة"
 ],
 [
  "Предупреждение \"Снижайте скорость!\"",
  "Slow down warning",
  "התראת האטה",
  "تنبيه خفّض السرعة"
 ],
 [
  "Приоритет в оповещении (GPS/RD)",
  "Alert priority (GPS/RD)",
  "עדיפות התרעות (GPS/RD)",
  "أولوية التنبيهات (GPS/RD)"
 ],
 [
  "Дальность обнаружения радаров",
  "Radar detection range",
  "טווח זיהוי מכ״ם",
  "مدى كشف الرادار"
 ],
 [
  "Автоматический режим \"Х-СОР\" от скорости",
  "Speed-based X-COP mode",
  "מצב X-COP אוטומטי לפי מהירות",
  "وضع X-COP التلقائي حسب السرعة"
 ],
 [
  "Добавление ложных и опасных зон с настройкой радиуса",
  "Custom false-alert / danger zones",
  "אזורי התראת שווא/סכנה מותאמים",
  "تخصيص مناطق الإنذار الكاذب والخطر"
 ],
 [
  "Отключение отдельных типов камер в базе GPS",
  "Disable selected camera types in GPS database",
  "כיבוי סוגי מצלמות במאגר GPS",
  "تعطيل أنواع كاميرات محددة بقاعدة GPS"
 ],
 [
  "Максимальная скорость",
  "Maximum speed setting",
  "מהירות מרבית",
  "السرعة القصوى"
 ],
 [
  "Модуль EXD 2.0",
  "EXD 2.0 module",
  "מודול EXD 2.0",
  "وحدة EXD 2.0"
 ],
 [
  "EXD 2.0",
  "EXD 2.0",
  "EXD 2.0",
  "EXD 2.0"
 ],
 [
  "Детектируемые комплексы контроля (К-диапазон)",
  "Detected systems (K band)",
  "מערכות מזוהות (תחום K)",
  "أنظمة الرصد المكتشفة (النطاق K)"
 ],
 [
  "Детектирование лидара Полискан (диапазон Laser)",
  "Poliscan lidar detection (laser)",
  "זיהוי ליידר Poliscan (לייזר)",
  "كشف ليدار Poliscan (ليزر)"
 ],
 [
  "Крепление с активным питанием",
  "Powered mount",
  "תושבת עם אספקת מתח",
  "حامل مزود بالطاقة"
 ],
 [
  "Обновление ПО и GPS-базы",
  "Firmware and GPS database updates",
  "עדכוני תוכנה ומאגר GPS",
  "تحديث البرنامج وقاعدة GPS"
 ],
 [
  "Рабочая температура",
  "Operating temperature",
  "טמפרטורת עבודה",
  "درجة حرارة التشغيل"
 ],
 [
  "Автоматическая смена настроек при смене региона",
  "Automatic settings change by region",
  "שינוי הגדרות אוטומטי לפי אזור",
  "تغيير الإعدادات تلقائياً حسب المنطقة"
 ],
 [
  "Антибликовый CPL-фильтр",
  "CPL anti-glare filter",
  "מסנן CPL נגד סנוור",
  "مرشح CPL مضاد للوهج"
 ],
 [
  "Автояркость дисплея",
  "Automatic screen brightness",
  "בהירות מסך אוטומטית",
  "سطوع الشاشة التلقائي"
 ],
 [
  "Беззвучный режим \"Тишины\"",
  "Silent mode",
  "מצב שקט",
  "الوضع الصامت"
 ],
 [
  "RD без звука до",
  "Radar detector silent below",
  "גלאי מכ״ם שקט עד",
  "كاشف رادار صامت حتى"
 ],
 [
  "Автоматический режим \"Турбо\" от скорости",
  "Speed-based Turbo mode",
  "מצב טורבו אוטומטי לפי מהירות",
  "وضع توربو تلقائي حسب السرعة"
 ],
 [
  "Два ножа",
  "Two knives",
  "שני סכינים",
  "سكينان"
 ],
 [
  "Пассатижи",
  "Pliers",
  "צבת",
  "كماشة"
 ],
 [
  "Отвёртки",
  "Screwdrivers",
  "מברגים",
  "مفكات"
 ],
 [
  "Ножницы",
  "Scissors",
  "מספריים",
  "مقص"
 ],
 [
  "Пилка",
  "File",
  "פצירה",
  "مبرد"
 ],
 [
  "Мультитул",
  "Multi-tool",
  "כלי רב־תכליתי",
  "أداة متعددة الاستخدامات"
 ],
 [
  "4K + HDR",
  "4K + HDR",
  "4K + HDR",
  "4K + HDR"
 ],
 [
  "Motion Control",
  "Motion Control",
  "Motion Control",
  "Motion Control"
 ],
 [
  "Пластиковые стяжки",
  "Cable ties",
  "אזיקונים",
  "أربطة كابلات"
 ],
 [
  "Саморезы",
  "Screws",
  "ברגים",
  "براغٍ"
 ]
];
 const labels=new Map(labelRows.map(([ru,en,he,ar])=>[ru,{ru,en,he,ar}]));
 const copy={
  ru:{description:"Описание производителя",short:"Краткие характеристики",all:"Все данные источника (русский)",notes:"Данные производителя; наличие и совместимость зависят от версии.",source:"Описание и дополнительные сведения",empty:"Для этой модели нет структурированных характеристик. Подробнее — на сайте производителя.",video:"Видео и обзоры",category:{accessories:"Аксессуары",audio:"Автоакустика",hybrid:"Гибридный видеорегистратор",radar:"Радар-детектор",single:"Видеорегистратор",dual:"Двухкамерный видеорегистратор",sale:"Товар из каталога"}},
  en:{description:"Model overview",short:"Technical specifications",all:"Original manufacturer data (Russian)",notes:"Information from the Russian manufacturer catalog; features and compatibility may vary by model revision.",source:"Original description and additional details",empty:"No structured specifications are available for this item. See the manufacturer's page for more details.",video:"Videos & reviews",category:{accessories:"Vehicle accessory",audio:"Car speakers",hybrid:"Dash cam / radar-detector hybrid",radar:"Radar detector",single:"Dash cam",dual:"Dual-camera dash cam",sale:"Catalog item"}},
  he:{description:"סקירת דגם",short:"מפרט טכני",all:"נתוני היצרן המקוריים (ברוסית)",notes:"המידע נלקח מקטלוג היצרן הרוסי. תכונות ותאימות עשויות להשתנות בין גרסאות.",source:"תיאור ומידע נוסף בשפת המקור",empty:"אין מפרט מובנה לפריט זה. למידע נוסף ראו את אתר היצרן.",video:"סרטונים וסקירות",category:{accessories:"אביזר לרכב",audio:"רמקולים לרכב",hybrid:"מצלמת דרך משולבת גלאי מכ״ם",radar:"גלאי מכ״ם",single:"מצלמת דרך",dual:"מצלמת דרך דו־ערוצית",sale:"מוצר בקטלוג"}},
  ar:{description:"نظرة عامة على الطراز",short:"المواصفات الفنية",all:"بيانات الشركة الأصلية (بالروسية)",notes:"البيانات من كتالوج الشركة الروسي؛ قد تختلف الميزات والتوافق حسب إصدار الجهاز.",source:"الوصف والمعلومات الإضافية باللغة الأصلية",empty:"لا تتوفر مواصفات منظمة لهذا المنتج. راجع صفحة الشركة لمزيد من التفاصيل.",video:"فيديوهات ومراجعات",category:{accessories:"ملحق سيارة",audio:"سماعات سيارة",hybrid:"كاميرا قيادة مع كاشف رادار",radar:"كاشف رادار",single:"كاميرا قيادة",dual:"كاميرا قيادة مزدوجة",sale:"منتج في الكتالوج"}}
 };
 const ruValues={
  "Есть":["Yes","כן","نعم"],"Нет":["No","לא","لا"],"Китай":["China","סין","الصين"],
  "Суперконденсатор":["Supercapacitor","קבל־על","مكثف فائق"],
  "Международная":["International","בינלאומי","دولية"],
  "Однопоршневой":["Single-piston","בוכנה אחת","مكبس واحد"],
  "Цифровой":["Digital","דיגיטלי","رقمي"],
  "Коаксиальная":["Coaxial","קואקסיאלי","محوري"],
  "Стекловолокно":["Fiberglass","פיברגלס","ألياف زجاجية"],
  "Шелк":["Silk","משי","حرير"],
  "Бутилкаучуковая резина":["Butyl rubber","גומי בוטילי","مطاط بوتيل"],
  "На лобовое стекло на 3М":["3M adhesive windscreen mount","תושבת הדבקה 3M לשמשה הקדמית","حامل زجاج أمامي بلاصق 3M"],
  "На лобовое стекло":["Windscreen mount","תושבת לשמשה הקדמית","حامل على الزجاج الأمامي"],
  "Скачать":["Download","הורדה","تنزيل"],
  "Ссылка":["Link","קישור","رابط"]
 };
 const descriptions={
  en:{
   single:"A NEOLINE dash camera designed to record the journey ahead. The recording, storage and driver-assistance features below are taken from the manufacturer's specification for this model.",
   dual:"A multi-camera NEOLINE recording system intended to cover more than one view of the vehicle. Check the manufacturer's listed number of cameras, recording modes and installation requirements below.",
   hybrid:"This NEOLINE hybrid combines a driving recorder with radar-detection alerts. The available recording and detection functions depend on the exact hardware revision and region.",
   radar:"A NEOLINE radar detector intended to alert drivers to supported speed-control systems. Radar bands, GPS data and supported warning modes vary by product and region.",
   accessories:"A vehicle accessory for compatible NEOLINE equipment. Check the device name, connector, power requirements and vehicle installation before ordering.",
   audio:"NEOLINE automotive speakers. Installation size, impedance, speaker design and materials are shown from the manufacturer’s specifications.",
   sale:"An item listed in the original NEOLINE catalog. The manufacturer’s product description and any structured specifications are available below.",
   facts:"Model specifications",missing:"No structured specifications have been published for this accessory. See the original source description for compatibility and installation details."
  },
  he:{
   single:"מצלמת דרך של NEOLINE המיועדת לתיעוד הנסיעה מלפנים. נתוני ההקלטה, האחסון והעזר לנהג שלהלן מבוססים על המפרט שפרסם היצרן לדגם זה.",
   dual:"מערכת צילום של NEOLINE עם יותר מערוץ צילום אחד, המיועדת לתיעוד מספר זוויות ברכב. מספר המצלמות, מצבי ההקלטה ודרישות ההתקנה מפורטים בנתוני היצרן שלהלן.",
   hybrid:"מכשיר משולב של NEOLINE הכולל מצלמת דרך והתרעות זיהוי מכ״ם. אפשרויות הצילום והזיהוי תלויות בגרסת החומרה ובאזור השימוש.",
   radar:"גלאי מכ״ם של NEOLINE המיועד להתריע על מערכות אכיפת מהירות נתמכות. תחומי הזיהוי, נתוני ה-GPS וסוגי ההתרעות משתנים בין דגמים ואזורים.",
   accessories:"אביזר רכב המיועד לציוד תואם של NEOLINE. לפני הזמנה יש לבדוק את שם הדגם, המחבר, דרישות החשמל ותנאי ההתקנה ברכב.",
   audio:"רמקולים לרכב מבית NEOLINE. מידות ההתקנה, העכבה, מבנה הרמקול והחומרים מפורטים במפרט היצרן שלהלן.",
   sale:"מוצר המופיע בקטלוג המקורי של NEOLINE. בהמשך מופיעים תיאור היצרן והמפרט הזמין.",
   facts:"נתוני הדגם",missing:"לפריט זה לא פורסם מפרט טכני מובנה. למידע על התאמה והתקנה יש לעיין בתיאור המקורי של היצרן."
  },
  ar:{
   single:"كاميرا قيادة من NEOLINE لتوثيق الطريق أمام السيارة. بيانات التسجيل والتخزين وميزات مساعدة السائق أدناه مستندة إلى مواصفات الشركة لهذا الطراز.",
   dual:"نظام تسجيل من NEOLINE يستخدم أكثر من قناة تصوير لتغطية زوايا مختلفة من السيارة. تحقّق أدناه من عدد الكاميرات وأوضاع التسجيل ومتطلبات التركيب الواردة في مواصفات الشركة.",
   hybrid:"جهاز هجين من NEOLINE يجمع بين تسجيل الطريق والتنبيه إلى أنظمة الرادار. تختلف ميزات التسجيل والكشف باختلاف إصدار الجهاز والمنطقة.",
   radar:"كاشف رادار من NEOLINE لتنبيه السائق إلى أنظمة مراقبة السرعة المدعومة. تختلف نطاقات الكشف وبيانات GPS وأوضاع التنبيه بحسب الطراز والمنطقة.",
   accessories:"ملحق سيارة مُخصص لأجهزة NEOLINE المتوافقة. تحقّق من اسم الطراز ونوع الموصل ومتطلبات الطاقة والتركيب في سيارتك قبل الطلب.",
   audio:"سماعات سيارات من NEOLINE. يوضح وصف الشركة أدناه مقاس التركيب والممانعة وتصميم السماعة وموادها.",
   sale:"منتج مُدرج في كتالوج NEOLINE الأصلي. تظهر أدناه تفاصيل المصدر والمواصفات الفنية المتاحة.",
   facts:"معلومات الطراز",missing:"لم تُنشر مواصفات تقنية منظمة لهذا الملحق. راجع وصف الشركة الأصلي للتحقق من التوافق ومتطلبات التركيب."
  }
 };
 const locale=lang=>copy[lang]?lang:"ru";
 const isSourceOnly=label=>/^(?:Сплит|Название|Внимание|Режим работы техподдержки|Прошивка(?:\s|$)|Инструкция по обновлению|Мобильное приложение|База радаров для|Голосовой пакет|Альтернативный голосовой пакет|2\. Изменена функция|«Превышаешь\?)/iu.test(label);
 // Never silently treat firmware download instructions as product specifications.
 const translateValue=(raw,lang)=>{
  const value=String(raw??"").trim(),l=locale(lang);
  if(l==="ru")return value;
  const mapped=ruValues[value];if(mapped)return mapped[["en","he","ar"].indexOf(l)]||value;
  return value.replace(/Гб(?=$|[^А-Яа-яЁё])/gu,"GB").replace(/кГц(?=$|[^А-Яа-яЁё])/gu,"kHz")
   .replace(/Гц(?=$|[^А-Яа-яЁё])/gu,"Hz").replace(/(\d)\s*к\/с(?=$|[^А-Яа-яЁё])/gu,"$1 fps")
   .replace(/дюйма(?=$|[^А-Яа-яЁё])/gu,"in")
   .replace(/(\d)\s*В(?=$|[^А-Яа-яЁё])/gu,"$1 V")
   .replace(/(\d)\s*А(?=$|[^А-Яа-яЁё])/gu,"$1 A")
   .replace(/(\d)\s*г(?=$|[^А-Яа-яЁё])/gu,"$1 g")
   .replace(/(\d)\s*м(?=$|[^А-Яа-яЁё])/gu,"$1 m");
 };
 const formatSpecs=(specs,lang)=>{
  const l=locale(lang);
  return (Array.isArray(specs)?specs:[])
   .filter(item=>item&&typeof item.label==="string"&&typeof item.value==="string"&&!isSourceOnly(item.label))
   .map(item=>({label:labels.get(item.label)?.[l]||item.label,
    value:translateValue(item.value,l),isOriginal:l!=="ru"&&!labels.has(item.label),rawLabel:item.label}))
 };
 // Latin model and product identifiers are preserved; marketing statements aren't inferred.
 const extractedModel=name=>{
  const clean=String(name||"").trim();
  const main=clean.match(/(?:NEOLINE|Neoline)\s+([^\u0400-\u04FF]+)/i);
  if(main){
   const model=main[0].replace(/\s+$/,"").replace(/[\s,;.:/-]+$/,"");
   return model.length>=9?model:clean;
  }
  return clean;
 };
 const displayName=(item,lang)=>{
  const l=locale(lang);
  if(l==="ru")return item.name;
  const cat=copy[l].category[item.category]||copy[l].category.accessories;
  const identifier=extractedModel(item.name);
  // Avoid promising that a full Russian title has been translated.
  const hasCyrillic=/[\u0400-\u04FF]/.test(identifier);
  return hasCyrillic?item.name:identifier+" · "+cat;
 };
 const overview=(item,lang)=>{
  const l=locale(lang);
  if(l==="ru")return item.description||item.name;
  const c=descriptions[l]||descriptions.en;
  const lead=c[item.category]||c.accessories;
  const keyLabels=[
   "Количество камер","Разрешение","Матрица","Угол обзора","Дисплей",
   "Тип акустической системы","Форм-фактор","Частотный диапазон",
   "Максимальное давление, атм (кг/см2)","Производительность, л/мин",
   "Напряжение","Выходное напряжение","Входное напряжение",
   "Мощность, Вт","Длина кабеля","Разъем питания",
   "Wi-Fi обновление","GPS-модуль","Режим парковки","Крепление",
   "Автостоп","Импеданс, Ом","Макс. объем карты памяти"
  ];
  const facts=formatSpecs(item.specs,l)
   .filter(k=>!k.isOriginal&&!/[А-Яа-яЁё]/u.test(k.value))
   .sort((a,b)=>keyLabels.indexOf(a.rawLabel)===-1?1:keyLabels.indexOf(b.rawLabel)===-1?-1:
    keyLabels.indexOf(a.rawLabel)-keyLabels.indexOf(b.rawLabel));
  const selected=facts.slice(0,9);
  const details=selected.length
   ?c.facts+": "+selected.map(k=>k.label+" — "+k.value).join("; ")+"."
   :c.missing;
  return lead+"\n"+details;
 };
 window.NEOLINE_CATALOG_I18N=Object.freeze({
  locale,copy:lang=>copy[locale(lang)],
  isSourceOnly,formatSpecs,displayName,overview,modelIdentifier:extractedModel,
  coverage:()=>({translatedLabels:labels.size})
 });
})();
