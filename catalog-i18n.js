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
 // Human-reviewed, model-specific paraphrases of the available official
 // manufacturer text for accessories that have no structured spec tables.
 // Stored by the same stable source URL-derived product IDs used by catalog.json.
 const curatedAccessoryText={
 "133214697389": {
  "en": "A combined power cable and mounting accessory for the NEOLINE G-Tech X77. It is designed for a fixed connection to the vehicle fuse box.",
  "he": "כבל חשמל משולב בתושבת עבור NEOLINE G-Tech X77. מיועד לחיבור קבוע לתיבת הנתיכים של הרכב.",
  "ar": "كابل طاقة مع حامل مخصص لجهاز NEOLINE G-Tech X77، للتوصيل الثابت بعلبة مصهرات السيارة."
 },
 "962010999584": {
  "en": "NEOLINE Power Cord Radar is a power cable for radar-detector equipment. Before ordering, check that the connector and device model are compatible.",
  "he": "כבל חשמל NEOLINE Power Cord Radar לציוד גלאי מכ״ם. לפני רכישה יש לוודא התאמה של המחבר לדגם המכשיר.",
  "ar": "كابل طاقة NEOLINE Power Cord Radar لأجهزة كشف الرادار. تأكد من توافق الموصل مع طراز جهازك قبل الشراء."
 },
 "425441257138": {
  "en": "The X-COP Magnet is a rubber-coated magnetic mount, approximately 5 cm in diameter. Its adhesive base attaches to the dashboard, allowing a compatible radar detector to be fitted and removed easily.",
  "he": "X-COP Magnet הוא מעמד מגנטי מצופה גומי, בקוטר של כ־5 ס״מ. הבסיס המודבק נצמד ללוח המחוונים ומאפשר הצמדה והסרה נוחות של גלאי מכ״ם תואם.",
  "ar": "حامل X-COP Magnet مغناطيسي مغطى بالمطاط بقطر نحو 5 سم. تُثبَّت قاعدته اللاصقة على لوحة القيادة لتسهيل تركيب كاشف رادار متوافق وإزالته."
 },
 "747440919228": {
  "en": "The X-COP Pad is an adhesive-backed silicone dashboard mat. It helps hold radar detectors, smartphones and other small items in position.",
  "he": "X-COP Pad הוא משטח סיליקון עם בסיס דביק ללוח המחוונים. הוא מסייע להחזיק גלאי מכ״ם, טלפונים ופריטים קטנים אחרים במקומם.",
  "ar": "X-COP Pad وسادة سيليكون ذات قاعدة لاصقة للوحة القيادة. تساعد على تثبيت كاشفات الرادار والهواتف والأغراض الصغيرة الأخرى."
 },
 "53159148980": {
  "en": "This X-COP H90 Smart Click windscreen mount uses 3M adhesive and has no active power connection: the power cable connects directly to the hybrid device. The manufacturer warns that near-vertical windscreens may complicate installation and states that X-COP 9500/9500s are not compatible.",
  "he": "תושבת X-COP H90 Smart Click נדבקת לשמשה הקדמית באמצעות 3M, ללא אספקת חשמל פעילה; יש לחבר את הכבל ישירות למכשיר המשולב. היצרן מזהיר מפני קושי בשמשות כמעט אנכיות ומציין ש־X-COP 9500/9500s אינם תואמים.",
  "ar": "يثبّت حامل X-COP H90 Smart Click باللاصق 3M على الزجاج الأمامي دون تغذية كهربائية نشطة؛ يوصل كابل الطاقة بالجهاز الهجين مباشرةً. تحذر الشركة من صعوبة التركيب على الزجاج شبه العمودي وتوضح عدم توافق X-COP 9500/9500s."
 },
 "53499792058": {
  "en": "The H91 3M Power is a windscreen mount with an active power connection for compatible NEOLINE hybrid units. It uses 3M adhesive; check the exact supported model before installation.",
  "he": "H91 3M Power היא תושבת לשמשה הקדמית עם חיבור חשמל פעיל למכשירים משולבים תואמים של NEOLINE. ההתקנה באמצעות דבק 3M; יש לבדוק התאמה לדגם המדויק.",
  "ar": "H91 3M Power حامل للزجاج الأمامي مزود بتوصيل طاقة نشط لأجهزة NEOLINE الهجينة المتوافقة، ويُثبَّت بلاصق 3M. تحقّق من الطراز المتوافق قبل التركيب."
 },
 "26547920530": {
  "en": "The X-COP H90 Smart Click suction mount attaches a compatible hybrid unit to the windscreen. The mount has no active power connection, so power is connected directly to the device.",
  "he": "תושבת הוואקום X-COP H90 Smart Click מחברת מכשיר משולב תואם לשמשה הקדמית. אין בה חיבור חשמל פעיל, ולכן כבל החשמל מתחבר ישירות למכשיר.",
  "ar": "يثبّت حامل الشفط X-COP H90 Smart Click الجهاز الهجين المتوافق على الزجاج الأمامي. لا يحتوي الحامل على توصيل طاقة نشط، لذا يُوصل الكابل بالجهاز مباشرةً."
 },
 "969355328957": {
  "en": "NEOLINE Fuse Cord 3 pin is a power cable intended for compatible three-pin hybrid devices. Confirm the pin layout and voltage requirements before connecting it.",
  "he": "NEOLINE Fuse Cord 3 pin הוא כבל חשמל המיועד למכשירים משולבים תואמים בעלי מחבר בן שלושה פינים. יש לבדוק את סידור הפינים ודרישות המתח לפני חיבור.",
  "ar": "NEOLINE Fuse Cord 3 pin كابل طاقة مخصص للأجهزة الهجينة المتوافقة ذات موصل ثلاثي السنون. تأكد من ترتيب السنون ومتطلبات الجهد قبل التوصيل."
 },
 "951833046070": {
  "en": "NEOLINE Power Cord Hybrid connects a compatible hybrid unit to a vehicle's 12/24 V accessory socket. The approximately 3 m cable has a built-in fuse; on supported installations, the unit powers on when the engine starts.",
  "he": "NEOLINE Power Cord Hybrid מחבר מכשיר משולב תואם לשקע אביזרים של רכב במתח 12/24 וולט. לכבל באורך כ־3 מטרים יש נתיך מובנה; בהתקנה מתאימה המכשיר נדלק עם התנעת המנוע.",
  "ar": "يوصل NEOLINE Power Cord Hybrid جهازاً هجيناً متوافقاً بمقبس ملحقات السيارة 12/24 فولت. طول الكابل نحو 3 أمتار ويحتوي على مصهر مدمج؛ ويمكن تشغيل الجهاز عند بدء المحرك في التركيبات المدعومة."
 },
 "9377540786": {
  "en": "NEOLINE Fuse Cord is a power cable for compatible X-COP radar detectors. Verify the supported connector and model before fitting the cable.",
  "he": "NEOLINE Fuse Cord הוא כבל חשמל לגלאי מכ״ם תואמים מסדרת X-COP. יש לבדוק את הדגם והמחבר לפני התקנה.",
  "ar": "NEOLINE Fuse Cord كابل طاقة لكاشفات الرادار المتوافقة من سلسلة X-COP. تحقّق من الطراز والموصل المدعوم قبل التركيب."
 },
 "825044539847": {
  "en": "NEOLINE Fuse Cord X7 combines a power cable and mount for G-Tech X72/X73 dash cameras, designed for connection to the vehicle's fuse box.",
  "he": "NEOLINE Fuse Cord X7 משלב כבל חשמל ותושבת למצלמות הדרך G-Tech X72/X73, ומיועד לחיבור לתיבת הנתיכים ברכב.",
  "ar": "يجمع NEOLINE Fuse Cord X7 بين كابل طاقة وحامل لكاميرات G-Tech X72/X73، وهو مخصص للتوصيل بعلبة مصهرات السيارة."
 },
 "176789604743": {
  "en": "NEOLINE Fuse Cord X74/X75 combines a power cable and mount for G-Tech X74/X75 dash cameras, designed for connection to the vehicle fuse box.",
  "he": "NEOLINE Fuse Cord X74/X75 משלב כבל חשמל ותושבת למצלמות הדרך G-Tech X74/X75 ומיועד לחיבור לתיבת הנתיכים ברכב.",
  "ar": "يجمع NEOLINE Fuse Cord X74/X75 بين كابل طاقة وحامل لكاميرات G-Tech X74/X75، وهو مصمم للتوصيل بعلبة مصهرات السيارة."
 },
 "189185819046": {
  "en": "The X-COP Visor is a mount for attaching compatible NEOLINE X-COP radar detectors to a vehicle sun visor.",
  "he": "X-COP Visor היא תושבת לחיבור גלאי מכ״ם תואמים מסדרת NEOLINE X-COP לסוכך השמש ברכב.",
  "ar": "X-COP Visor حامل لتثبيت كاشفات الرادار المتوافقة من سلسلة NEOLINE X-COP على حاجب الشمس في السيارة."
 },
 "314310319880": {
  "en": "The NEOLINE CPL 93 polarizing filter uses the manufacturer's Fix&Roll mount to reduce sun glare and reflections of the dashboard in the windscreen. The official compatibility list includes NEOLINE Spectrum, CitySmart and selected X-COP models; confirm the exact model before purchase.",
  "he": "המסנן המקטב NEOLINE CPL 93 עם תושבת Fix&Roll מיועד לצמצם סנוור שמש והשתקפויות של לוח המחוונים בשמשה הקדמית. ברשימת ההתאמה של היצרן מופיעים NEOLINE Spectrum, ‏CitySmart ודגמי X-COP מסוימים; יש לבדוק התאמה לדגם המדויק לפני רכישה.",
  "ar": "مرشح الاستقطاب NEOLINE CPL 93 المزود بحامل Fix&Roll يقلل وهج الشمس وانعكاسات لوحة القيادة على الزجاج الأمامي. تشمل قائمة التوافق الرسمية NEOLINE Spectrum وCitySmart وبعض طرازات X-COP؛ تأكد من الطراز المحدد قبل الشراء."
 },
 "414463685743": {
  "en": "NEOLINE Knife M is a folding multi-tool combining a knife, a bottle opener and a corkscrew. The original catalog also identifies a screen-printed NEOLINE logo. The source does not list further materials or dimensions.",
  "he": "NEOLINE Knife M הוא כלי רב־תכליתי מתקפל הכולל סכין, פותחן בקבוקים וחולץ פקקים. לפי קטלוג היצרן מופיע עליו לוגו NEOLINE בהדפסת משי. לא פורטו חומרי הייצור והמידות.",
  "ar": "NEOLINE Knife M أداة متعددة الاستخدامات قابلة للطي، تتضمن سكيناً وفتّاحة زجاجات ومفتاح فلّين. يذكر كتالوج الشركة شعار NEOLINE المطبوع على الأداة. لا تتوفر تفاصيل إضافية عن المواد أو الأبعاد."
 },
 "637819513172": {
  "en": "NEOLINE Pliers L is a compact folding multi-tool for routine repairs and outdoor use. The manufacturer's list includes pliers, a straight and serrated blade, screwdrivers, scissors and a file. Listed weight: 300 g.",
  "he": "NEOLINE Pliers L הוא כלי רב־תכליתי מתקפל לתיקונים יומיומיים ולשימוש מחוץ לבית. לפי היצרן הוא כולל צבת, להב רגיל ומשונן, מברגים, מספריים ופצירה. משקל מצוין: 300 גרם.",
  "ar": "NEOLINE Pliers L أداة متعددة الاستخدامات قابلة للطي للصيانة اليومية والاستخدام الخارجي. تتضمن وفقاً للشركة كماشة وشفرتين عادية ومسننة ومفكات ومقصاً ومبرداً. الوزن المذكور: 300 غرام."
 },
 "445754661251": {
  "en": "This optional rear/cabin camera is intended for NEOLINE Spectrum. The manufacturer specifies Full HD 1920 × 1080 at 30 fps, a 6 m cable and a 3M adhesive mount. It can record the vehicle's rear area or cabin, depending on installation.",
  "he": "מצלמה אחורית/פנימית אופציונלית למכשיר NEOLINE Spectrum. לפי היצרן היא מצלמת ב־Full HD ‏1920×1080 ב־30 תמונות בשנייה, עם כבל באורך 6 מ׳ ותושבת הדבקה 3M. ניתן להתקין לתיעוד מאחורי הרכב או בתא הנוסעים.",
  "ar": "كاميرا خلفية أو داخلية اختيارية لجهاز NEOLINE Spectrum. توضح مواصفات الشركة تسجيل Full HD ‏1920×1080 بمعدل 30 إطاراً/ثانية، وكابلاً بطول 6 أمتار وحامل تثبيت بلاصق 3M. تستخدم لتصوير خلف السيارة أو المقصورة حسب التركيب."
 },
 "665637135112": {
  "en": "NEOLINE Fuse Cord X3x provides a fixed connection to a car's fuse box for G-Tech X35/X36/X38, Flash 2K, Flash 2K Dual and SmartWay. The manufacturer lists 12/24 V input, 5 V/2 A output, USB-C and a 3.5 m cable. Important: the source warns against use in Euro 6 or newer vehicles.",
  "he": "NEOLINE Fuse Cord X3x מיועד לחיבור קבוע לתיבת הנתיכים ברכב עבור G-Tech X35/X36/X38, Flash 2K, Flash 2K Dual ו־SmartWay. היצרן מציין כניסת ‎12/24V‎, יציאת ‎5V/2A‎, חיבור USB‑C וכבל 3.5 מ׳. אזהרה: בדף היצרן מצוין שהכבל אינו מתאים לרכבי Euro 6 ומעלה.",
  "ar": "NEOLINE Fuse Cord X3x كابل توصيل ثابت بعلبة مصهرات السيارة لأجهزة G-Tech X35/X36/X38 وFlash 2K وFlash 2K Dual وSmartWay. يذكر المصدر دخل 12/24 فولت وخرج 5 فولت/2 أمبير وموصل USB‑C وطول 3.5 م. تنبيه: تحذر الشركة من استخدامه في سيارات معيار Euro 6 أو أحدث."
 },
 "145705044329": {
  "en": "This NEOLINE Fuse Cord is a fuse-box power cable for compatible WowCam and Argus recorders. The published specifications list USB‑C, 5 V/2.4 A output and a 2.8 m cable. Check your car's battery-voltage cut-off requirements: the manufacturer warns against use where its minimum threshold is unsuitable.",
  "he": "כבל NEOLINE Fuse Cord לחיבור קבוע לתיבת הנתיכים עבור מצלמות WowCam ו־Argus תואמות. המפרט מציין USB‑C, יציאת ‎5V/2.4A‎ וכבל באורך 2.8 מ׳. יש לבדוק את סף ניתוק המתח של מצבר הרכב; היצרן מזהיר מפני שימוש כאשר ערך הסף אינו מתאים.",
  "ar": "كابل NEOLINE Fuse Cord للتوصيل الثابت بعلبة المصهرات لكاميرات WowCam وArgus المتوافقة. تشمل المواصفات USB‑C وخرج 5 فولت/2.4 أمبير وكابلاً بطول 2.8 م. تحقق من حد فصل جهد بطارية سيارتك؛ تحذر الشركة من استخدامه إذا لم يناسب الحد الأدنى المطلوب."
 },
 "159268200852": {
  "en": "NEOLINE Dela-B is a portable car tyre inflator with a 90 W motor, a digital pressure gauge, five inflation presets, automatic stop and an LED lamp. The manufacturer specifies an air flow of 23 L/min and describes three supplied nozzle attachments. The six optional illustrations below are official feature artwork, not six different product angles.",
  "he": "NEOLINE Dela-B הוא מדחס נייד לניפוח צמיגים, עם מנוע בהספק 90 ואט, מד לחץ דיגיטלי, חמישה מצבי ניפוח, עצירה אוטומטית ופנס LED. היצרן מציין ספיקת אוויר של 23 ליטר לדקה ושלוש פיות נלוות. ששת האיורים הנוספים הם המחשות תכונות רשמיות, ולא שישה צילומים מזוויות שונות.",
  "ar": "NEOLINE Dela-B منفاخ إطارات محمول بقدرة 90 واط، مع مقياس ضغط رقمي وخمسة أوضاع نفخ وإيقاف تلقائي ومصباح LED. تذكر الشركة تدفقاً قدره 23 لتراً/الدقيقة وثلاث فوهات مرفقة. الصور التوضيحية الست الإضافية هي رسومات رسمية للميزات، وليست ست زوايا تصوير مختلفة."
 },
 "1087255377614": {
  "en": "NEOLINE Dela-S is a portable compressor for tyre inflation. Its documented specifications include a 100 W motor, 23 L/min output, a digital pressure gauge, automatic stop, a 0.54 m hose and a 12 V vehicle power connection.",
  "he": "NEOLINE Dela-S הוא מדחס נייד לניפוח צמיגים. לפי היצרן הוא מצויד במנוע 100 ואט, ספיקת אוויר 23 ליטר לדקה, מד לחץ דיגיטלי, עצירה אוטומטית, צינור 0.54 מ׳ וחיבור למתח רכב 12 וולט.",
  "ar": "NEOLINE Dela-S ضاغط محمول لنفخ الإطارات. تتضمن المواصفات محركاً بقدرة 100 واط وتدفق هواء 23 لتراً/الدقيقة ومقياس ضغط رقمي وإيقافاً تلقائياً وخرطوماً بطول 0.54 م وتغذية من السيارة بجهد 12 فولت."
 },
 "105776419608": {
  "en": "NEOLINE X-COP Holder is a silicone-based windscreen mount for compatible X-COP radar detectors. The source does not list speaker components; speaker specifications are not applicable to this mount.",
  "he": "NEOLINE X-COP Holder היא תושבת על בסיס סיליקון לשמשה הקדמית עבור גלאי מכ״ם תואמים מסדרת X-COP. רכיבי רמקולים אינם חלק ממפרט התושבת.",
  "ar": "NEOLINE X-COP Holder حامل للزجاج الأمامي يعتمد على السيليكون لكاشفات الرادار المتوافقة من سلسلة X-COP. مواصفات مكونات السماعات لا تنطبق على هذا الحامل."
 }
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
  const specific=curatedAccessoryText[item.id]?.[l];
  const details=specific || (selected.length
   ?c.facts+": "+selected.map(k=>k.label+" — "+k.value).join("; ")+"."
   :c.missing);
  return lead+"\n"+details;
 };
 window.NEOLINE_CATALOG_I18N=Object.freeze({
  locale,copy:lang=>copy[locale(lang)],
  isSourceOnly,formatSpecs,displayName,overview,modelIdentifier:extractedModel,
  coverage:()=>({translatedLabels:labels.size})
 });
})();
