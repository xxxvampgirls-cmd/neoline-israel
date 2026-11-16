/* NEOLINE Israel product facts — curated from model-specific manufacturer pages
   on neoline.ru, 16 Nov 2026. Feature descriptions are original short summaries,
   not verbatim reproductions. Russian -> English/Hebrew/Arabic. */
window.NEOLINE_DETAILS = (() => {
  const order=['ru','en','he','ar'];
  const L=(a,lang)=>a?.[Math.max(0,order.indexOf(lang))]||a?.[0]||'';
  const ui={
    description:['Описание и особенности','Overview & features','תיאור ויתרונות','الوصف والمميزات'],
    characteristics:['Характеристики','Specifications','מפרט טכני','المواصفات'],
    included:['Комплектация','In the box','תכולת האריזה','محتويات العلبة'],
    installation:['Установка и замечания','Setup & notes','התקנה והערות','التركيب والملاحظات'],
    documentation:['Инструкция и источник','Manual & official source','מדריך ומקור רשמי','الدليل والمصدر الرسمي'],
    downloadManual:['Инструкция производителя (PDF, русский) ↗','Manufacturer manual (PDF, Russian) ↗','מדריך היצרן (PDF, רוסית) ↗','دليل الشركة (PDF بالروسية) ↗'],
    source:['Карточка на сайте NEOLINE','Manufacturer product page','דף המוצר באתר היצרן','صفحة المنتج لدى الشركة'],
    checked:['Данные сверены с русским сайтом производителя. Изложение сокращено; уточняйте совместимость и комплектацию по инструкции.','Facts checked against the manufacturer’s Russian website. Summarized; check compatibility and box contents in the manual.','הנתונים נבדקו מול האתר הרוסי של היצרן. המידע תומצת; יש לבדוק תאימות ותכולה במדריך.','تم التحقق من المعلومات في موقع الشركة الروسي. النص ملخّص؛ يرجى مراجعة الدليل للتوافق والمحتويات.'],
    sourceNotice:['Цены на этом сайте — демонстрационные, не официальная цена NEOLINE и не предложение о продаже.','Prices on this site are illustrative, not NEOLINE’s official prices or an offer for sale.','המחירים באתר להמחשה בלבד ואינם מחירים רשמיים של NEOLINE או הצעת מכר.','الأسعار في هذا الموقع توضيحية وليست أسعار NEOLINE الرسمية أو عرض بيع.'],
    noInfo:['Не указано производителем','Not specified by manufacturer','לא צוין על ידי היצרן','غير مذكور من الشركة'],
    yes:['Есть','Yes','כן','نعم'],
    no:['Нет','No','לא','لا'],
    cardInfo:['Обзор','Overview','סקירה','نظرة عامة'],
    more:['Подробности по разделам','Explore full details','כל פרטי המוצר','التفاصيل الكاملة'],
    external:['Оригинал на русском языке ↗','Original Russian source ↗','המקור ברוסית ↗','المصدر الروسي الأصلي ↗'],
    imageNote:['Ракурсы взяты из доступных изображений производителя и продавцов; состав фотографий может отличаться.','Images come from available manufacturer and seller photos; views may vary.','התמונות ממקורות היצרן והמשווקים; זוויות הצילום עשויות להשתנות.','الصور من الشركة والبائعين؛ قد تختلف الزوايا.']
  };
  const specNames={
    front:['Съёмка передней камеры','Front camera video','צילום מצלמה קדמית','تصوير الكاميرا الأمامية'],
    rear:['Съёмка задней камеры','Rear camera video','צילום מצלמה אחורית','تصوير الكاميرا الخلفية'],
    cameras:['Количество камер','Cameras','מספר מצלמות','عدد الكاميرات'],
    angle:['Угол обзора','Field of view','זווית ראייה','زاوية الرؤية'],
    lens:['Объектив / диафрагма','Lens / aperture','עדשה / צמצם','العدسة / فتحة العدسة'],
    screen:['Дисплей','Display','מסך','الشاشة'],
    sensor:['Матрица','Image sensor','חיישן תמונה','مستشعر الصورة'],
    wireless:['Беспроводные соединения','Wireless connectivity','חיבורים אלחוטיים','الاتصال اللاسلكي'],
    app:['Приложение','Phone application','אפליקציה','التطبيق'],
    storage:['Карта памяти (макс.)','Memory card (max)','כרטיס זיכרון (מקס׳)','بطاقة الذاكرة (حد أقصى)'],
    recording:['Формат записи','Recording format','פורמט הקלטה','صيغة التسجيل'],
    GPS:['GPS / ГЛОНАСС','GPS / GLONASS','GPS / GLONASS','GPS / GLONASS'],
    radar:['База радаров','Speed camera database','מאגר מצלמות אכיפה','قاعدة بيانات الرادارات'],
    parking:['Парковочный режим','Parking mode','מצב חניה','وضع ركن السيارة'],
    impact:['Датчик удара','G-sensor','חיישן זעזוע','مستشعر الصدمات'],
    power:['Питание','Power storage','אספקת כוח','الطاقة'],
    install:['Способ крепления','Mounting','התקנה','التثبيت'],
    temp:['Рабочая температура','Operating temperature','טמפרטורת עבודה','درجة حرارة التشغيل'],
    size:['Размер / масса','Dimensions / weight','מידות / משקל','الأبعاد / الوزن'],
    protection:['Защита второй камеры','Rear camera protection','הגנת מצלמה אחורית','حماية الكاميرا الخلفية'],
    assistant:['Подключение смартфона','Smartphone features','חיבור לסמארטפון','ميزات الهاتف'],
    voice:['Голосовые оповещения','Voice alerts','התראות קוליות','تنبيهات صوتية'],
    cpl:['Поляризационный фильтр','CPL polarizing filter','מסנן CPL מקטב','مرشح CPL للاستقطاب']
  };
  const kits={
    main:['Основной видеорегистратор','Main dash camera','מצלמת דרך ראשית','كاميرا الطريق الرئيسية'],
    back:['Камера заднего вида','Rear camera','מצלמה אחורית','كاميرا خلفية'],
    tape:['Крепление на 3M-скотче','3M adhesive mount','תושבת דבק 3M','حامل لاصق 3M'],
    charger:['Кабель питания для автомобильной розетки','Car socket power cable','כבל חשמל לשקע הרכב','كابل طاقة لمقبس السيارة'],
    manual:['Руководство пользователя','User manual','מדריך למשתמש','دليل المستخدم'],
    mounting:['Монтажный комплект','Installation accessories','ערכת התקנה','لوازم التثبيت'],
    rearCable55:['Кабель второй камеры (5,5 м)','Rear camera cable (5.5 m)','כבל מצלמה אחורית (5.5 מ׳)','كابل الكاميرا الخلفية (5.5 م)'],
    rearCable6:['Кабель задней камеры (6 м)','Rear camera cable (6 m)','כבל מצלמה אחורית (6 מ׳)','كابل الكاميرا الخلفية (6 م)'],
    rearCable65:['Кабель задней камеры (6,5 м)','Rear camera cable (6.5 m)','כבל מצלמה אחורית (6.5 מ׳)','كابل الكاميرا الخلفية (6.5 م)'],
    hardwire:['Кабель питания в блок предохранителей','Fuse-box power cable','כבל הזנה לתיבת הנתיכים','كابل توصيل بعلبة الفيوزات'],
    cpl37:['Антибликовый фильтр CPL 37 мм','CPL anti-glare filter, 37 mm','מסנן CPL למניעת השתקפויות, 37 מ״מ','مرشح CPL مضاد للانعكاس 37 مم'],
    suction:['Крепление на присоске','Suction-cup mount','תושבת ואקום','حامل بشفاط'],
    aux:['Кабель AUX (1 м)','AUX cable (1 m)','כבל AUX (מטר אחד)','كابل AUX (متر واحد)'],
    quick:['Краткое руководство','Quick-start guide','מדריך מקוצר','دليل البدء السريع'],
    control:['Центральный блок регистратора','Recorder control unit','יחידת הקלטה מרכזית','وحدة التسجيل الرئيسية'],
    front5:['Фронтальная камера с кабелем 5 м','Front camera with 5 m cable','מצלמה קדמית עם כבל 5 מ׳','كاميرا أمامية مع كابل 5 م'],
    rear10:['Дополнительная камера с кабелем 10 м','Auxiliary camera with 10 m cable','מצלמה נוספת עם כבל 10 מ׳','كاميرا إضافية مع كابل 10 م'],
    hardwire4:['Кабель питания в блок предохранителей (4 м)','Fuse-box power cable (4 m)','כבל חשמל לתיבת הנתיכים (4 מ׳)','كابل طاقة لعلبة الفيوزات (4 م)'],
    mic3:['Внешний микрофон с кабелем 3 м','External microphone with 3 m cable','מיקרופון חיצוני עם כבל 3 מ׳','ميكروفون خارجي مع كابل 3 م'],
    gps3:['Внешняя антенна GPS/ГЛОНАСС с кабелем 3 м','GPS/GLONASS antenna with 3 m cable','אנטנת GPS/GLONASS חיצונית עם כבל 3 מ׳','هوائي GPS/GLONASS خارجي مع كابل 3 م'],
    protect3:['Проводная кнопка защиты файла с кабелем 3 м','Wired event-lock button with 3 m cable','לחצן חוטי להגנת קובץ עם כבל 3 מ׳','زر سلكي لحماية الملفات مع كابل 3 م'],
    ties:['Кабельные стяжки (2 шт.)','Cable ties (2)','אזיקונים (2)','رباطات كابلات (2)'],
    screws:['Саморезы (4 шт.)','Self-tapping screws (4)','ברגים (4)','براغٍ (4)']
  };
  const feat={
    tiny:[['Скрытая установка','Compact behind-mirror fit','התקנה דיסקרטית','تركيب غير ظاهر'],['Компактный корпус размещается за зеркалом и почти не перекрывает обзор.','Small body fits behind the mirror with minimal obstruction.','גוף קטן שמותקן מאחורי המראה ואינו מסתיר כמעט את שדה הראייה.','حجم صغير يثبت خلف المرآة دون حجب الرؤية تقريباً.']],
    wifi:[['Управление через Wi-Fi','Control via Wi-Fi','שליטה דרך Wi-Fi','التحكم عبر Wi-Fi'],['Просмотр, сохранение и управление файлами прямо со смартфона через приложение модели.','View, save and manage recordings from the model’s phone app.','צפייה, שמירה וניהול הקלטות דרך אפליקציית הטלפון.','مشاهدة التسجيلات وحفظها وإدارتها من تطبيق الهاتف.']],
    park:[['Охранная запись на парковке','Parking surveillance','צילום בזמן חניה','التصوير أثناء الوقوف'],['Режим отслеживает события у припаркованной машины; для непрерывной работы требуется соответствующее питание.','Records parking events; suitable hardwired power is needed for unattended operation.','מצלם אירועים בזמן חניה; להפעלה רציפה נדרש חיבור חשמל מתאים.','يسجل أحداث الوقوف؛ التشغيل المستمر يتطلب توصيلاً مناسباً للكهرباء.']],
    g:[['Защита записи при ударе','G-sensor file protection','הגנה על הקלטות בעת פגיעה','حماية التسجيل عند الصدمة'],['При ударе важный видеофайл защищается от циклической перезаписи.','An impact protects the current event video from loop overwriting.','בזמן זעזוע קובץ האירוע מוגן מדריסה בהקלטה מחזורית.','عند الصدمة تُحمى لقطة الحدث من الكتابة فوقها.']],
    super:[['Суперконденсатор','Supercapacitor','קבל־על','مكثف فائق'],['Вместо обычного аккумулятора используется устойчивое к перепадам температур решение для питания устройства.','A temperature-tolerant supercapacitor replaces a conventional battery.','קבל־על עמיד לשינויי טמפרטורה במקום סוללה רגילה.','مكثف فائق يتحمل تغيرات الحرارة بدلاً من البطارية التقليدية.']],
    full:[['Full HD с широким обзором','Wide-angle Full HD','צילום Full HD רחב','دقة Full HD وزاوية واسعة'],['Разрешение 1920×1080 и угол 140° позволяют записывать дорожную обстановку перед автомобилем.','1920×1080 recording with a 140° view captures the road ahead.','צילום 1920×1080 עם זווית 140° מתעד את הדרך מלפנים.','تسجيل 1920×1080 بزاوية 140° يوثق الطريق أمام السيارة.']],
    video2k:[['Чёткая 2K-съёмка','Sharp 2K video','צילום 2K חד','تصوير 2K واضح'],['Видео 2560×1440 сохраняет больше мелких деталей, чем обычный Full HD.','2560×1440 video retains finer detail than standard Full HD.','וידאו 2560×1440 שומר יותר פרטים לעומת Full HD רגיל.','فيديو 2560×1440 يحفظ تفاصيل أكثر من Full HD المعتاد.']],
    hdr:[['HDR для сложного света','HDR in mixed lighting','HDR בתאורה משתנה','HDR للإضاءة الصعبة'],['Технология HDR помогает различать детали при ярком солнце, в тоннелях и при встречном свете фар.','HDR improves detail during bright sunlight, tunnel exits and headlight glare.','HDR מסייע לשמור על פרטים בשמש חזקה, במנהרות ובסנוור פנסים.','تحسّن HDR التفاصيل مع الشمس الساطعة والخروج من الأنفاق ووهج المصابيح.']],
    timelapse:[['Интервальная съёмка','Time-lapse recording','הקלטה בהילוך מואץ','التصوير بفواصل زمنية'],['Ускоренная запись помогает сократить занимаемое место при длительном парковочном наблюдении.','Low-frame-rate recording saves storage during prolonged parking monitoring.','צילום בקצב פריימים נמוך חוסך מקום בזמן חניה ממושכת.','التسجيل بمعدل إطارات منخفض يوفر مساحة أثناء مراقبة الوقوف.']],
    dual2k:[['Две камеры — два направления','Front and rear coverage','צילום קדמי ואחורי','تغطية أمامية وخلفية'],['Передняя камера снимает в 2K, дополнительная — в Full HD; обе стороны дороги попадают в запись.','2K front recording plus Full HD rear recording cover both directions.','המצלמה הקדמית מצלמת ב־2K והאחורית ב־Full HD לשני הכיוונים.','الكاميرا الأمامية 2K والخلفية Full HD لتغطية الاتجاهين.']],
    rearip:[['Защита задней камеры IP67','IP67 rear camera','מצלמה אחורית בתקן IP67','كاميرا خلفية بحماية IP67'],['Корпус второй камеры защищён от пыли и воды и подходит для наружной установки.','The rear camera is dust- and water-resistant for exterior mounting.','המצלמה האחורית אטומה לאבק ולמים ומתאימה להתקנה חיצונית.','الكاميرا الخلفية مقاومة للغبار والماء ومناسبة للتركيب الخارجي.']],
    mirror:[['Экран вместо обычного зеркала','Touchscreen mirror camera','מראת דרך עם מסך מגע','مرآة بشاشة لمس'],['Устройство устанавливается поверх штатного зеркала и выводит видео с обеих камер на большой дисплей.','The camera fits over the factory mirror and displays both camera feeds.','המכשיר מותקן מעל המראה המקורית ומציג צילום משתי המצלמות.','يُركب فوق مرآة السيارة الأصلية ويعرض تصوير الكاميرتين.']],
    parkassist:[['Помощь при парковке','Parking assistance','סיוע בחניה','المساعدة في ركن السيارة'],['Изображение второй камеры и парковочные линии помогают маневрировать задним ходом при правильном подключении.','Rear-view video and guide lines assist reversing when wired correctly.','תמונת המצלמה האחורית וקווי העזר מסייעים בנסיעה לאחור בחיבור מתאים.','تساعد صورة الكاميرا الخلفية وخطوط التوجيه عند الرجوع للخلف بعد التوصيل الصحيح.']],
    sony4k:[['Матрица Sony Starvis IMX415','Sony Starvis IMX415 sensor','חיישן Sony Starvis IMX415','مستشعر Sony Starvis IMX415'],['Детализированная 4K-запись с современным светочувствительным сенсором Sony.','Detailed 4K recording using Sony’s light-sensitive imaging sensor.','צילום 4K מפורט עם חיישן תמונה רגיש לאור של Sony.','تسجيل 4K غني بالتفاصيل بمستشعر Sony الحساس للضوء.']],
    cpl:[['Семилинзовый объектив и CPL','Seven-lens optics + CPL','עדשה בת שבעה רכיבים ומסנן CPL','عدسة من سبع قطع ومرشح CPL'],['Оптика и поляризационный фильтр уменьшают отражения в лобовом стекле и блики.','Glass optics and a polarizing filter reduce windshield reflections and glare.','אופטיקה עם מסנן מקטב מפחיתה השתקפויות וסנוור בשמשה.','تقلل العدسات ومرشح الاستقطاب انعكاسات الزجاج والوهج.']],
    gps:[['GPS и уведомления','GPS and alerts','GPS והתראות','GPS والتنبيهات'],['GPS-модуль и база камер позволяют получать оповещения; доступность предупреждений зависит от региона и базы.','GPS provides camera alerts where the installed regional database has coverage.','GPS מאפשר התראות בכפוף לכיסוי המאגר האזורי המותקן.','يوفر GPS تنبيهات حيث تتوفر تغطية في قاعدة البيانات الإقليمية.']],
    dual4k:[['4K спереди, Full HD сзади','4K front + Full HD rear','4K מקדימה ו־Full HD מאחור','4K أماماً وFull HD خلفاً'],['Запись на основной 4K-камере дополняется отдельной камерой Full HD для салона или заднего вида.','The 4K front camera is paired with a Full HD cabin or rear camera.','מצלמת 4K קדמית לצד מצלמת Full HD לפנים הרכב או לאחור.','كاميرا 4K أمامية مع كاميرا Full HD للمقصورة أو الخلف.']],
    carplay:[['Apple CarPlay и Android Auto','Apple CarPlay & Android Auto','Apple CarPlay ו־Android Auto','Apple CarPlay وAndroid Auto'],['Навигация, музыка и совместимые приложения смартфона отображаются на экране регистратора.','Phone navigation, music and supported apps appear on the device screen.','ניווט, מוזיקה ואפליקציות תואמות מוצגים על מסך המכשיר.','يظهر التنقل والموسيقى والتطبيقات المتوافقة على شاشة الجهاز.']],
    ips6:[['Сенсорный дисплей 6″','6-inch IPS touch display','מסך מגע IPS בגודל 6″','شاشة IPS لمس 6 بوصات'],['Большой IPS-дисплей показывает изображение камер и интерфейс подключённого телефона.','The IPS screen shows camera feeds and the connected phone interface.','מסך IPS גדול מציג את המצלמות ואת ממשק הטלפון המחובר.','تعرض شاشة IPS الكبيرة صور الكاميرات وواجهة الهاتف المتصل.']],
    link:[['Wi-Fi 2,4/5 ГГц и Bluetooth 5','Dual-band Wi-Fi and Bluetooth 5','Wi-Fi דו־תדרי ו־Bluetooth 5','Wi-Fi مزدوج النطاق وBluetooth 5'],['Беспроводное подключение к смартфону для мультимедийных функций и управления файлами.','Wireless phone pairing for media features and recording management.','חיבור אלחוטי לסמארטפון למדיה ולניהול הקלטות.','اتصال لاسلكي بالهاتف للوسائط وإدارة التسجيلات.']],
    flexible:[['Два варианта крепления','Two mounting options','שתי אפשרויות התקנה','خياران للتركيب'],['Можно установить на торпедо или лобовое стекло с помощью комплектных креплений.','Mount on the dashboard or windshield using the included attachments.','התקנה על הדשבורד או השמשה באמצעות התושבות המצורפות.','التركيب على لوحة القيادة أو الزجاج الأمامي باستخدام الحوامل المرفقة.']],
    hidden:[['Разнесённая система','Discreet split design','מערכת מפוצלת נסתרת','تصميم منفصل وخفي'],['Центральный блок размещается скрыто, а миниатюрные камеры устанавливаются отдельно.','The control unit can be concealed while the compact cameras mount separately.','ניתן להסתיר את יחידת הבקרה ולהתקין את המצלמות בנפרד.','يمكن إخفاء وحدة التحكم وتركيب الكاميرات الصغيرة بشكل منفصل.']],
    panorama:[['Угол обзора 170° + 170°','170° + 170° coverage','זוויות צפייה 170° + 170°','زوايا تصوير 170° + 170°'],['Два широкоугольных объектива записывают происходящее спереди и сзади автомобиля.','Two ultra-wide cameras record both front and rear surroundings.','שתי מצלמות רחבות זווית מצלמות את הסביבה מלפנים ומאחור.','تسجل كاميرتان عريضتا الزاوية الأمام والخلف.']],
    microphone:[['Внешний микрофон','External microphone','מיקרופון חיצוני','ميكروفون خارجي'],['Микрофон можно установить ближе к водителю для более разборчивой записи речи.','Place the microphone near the driver for clearer speech capture.','ניתן להתקין את המיקרופון ליד הנהג להקלטת דיבור ברורה יותר.','يمكن تركيب الميكروفون قرب السائق لتسجيل صوت أوضح.']],
    button:[['Отдельная кнопка защиты файла','Dedicated video-lock button','כפתור חיצוני להגנת קובץ','زر مستقل لحماية التسجيل'],['Проводная кнопка позволяет быстро защитить важную запись от перезаписи.','The wired button quickly locks an important clip against overwriting.','כפתור חוטי מאפשר לנעול במהירות הקלטה חשובה.','يحمي الزر السلكي مقطعاً مهماً بسرعة من الكتابة فوقه.']],
    voice:[['Голосовые предупреждения','Voice notifications','התראות קוליות','إشعارات صوتية'],['Система сообщает о событиях записи и, при наличии покрытия базы, о дорожных камерах.','Voice feedback covers recorder status and supported speed-camera alerts.','התראות קוליות על מצב ההקלטה ועל מצלמות אכיפה באזורים נתמכים.','تنبيهات صوتية لحالة التسجيل وكاميرات السرعة حيث تتوفر البيانات.']]
  };
  const data={
    1:{
      source:'https://neoline.ru/landing/wowcam/',
      summary:['Миниатюрный Full HD-видеорегистратор без экрана, с Wi-Fi, приложением Neoline Connect и суперконденсатором. Подходит для почти незаметного размещения за зеркалом.','A tiny screenless Full HD dash cam with Wi-Fi, Neoline Connect and a supercapacitor. Designed to sit discreetly behind the mirror.','מצלמת דרך זעירה ללא מסך, עם צילום Full HD, קישוריות Wi-Fi, אפליקציית Neoline Connect וקבל־על. מתאימה להתקנה כמעט נסתרת מאחורי המראה.','كاميرا طريق صغيرة جداً بلا شاشة بدقة Full HD مع Wi-Fi وتطبيق Neoline Connect ومكثف فائق. صممت للتركيب الخفي خلف المرآة.'],
      features:['tiny','full','wifi','g','park','super'],
      specs:{front:'1920×1080 · 30 fps',cameras:'1',angle:'140°',lens:'F/2.1',screen:'no',wireless:'Wi-Fi 2.4 GHz',app:'Neoline Connect',storage:'microSD ≤128 GB',recording:'MP4 · H.265',GPS:'no',parking:'yes',impact:'yes',power:'Supercapacitor',size:'39×36×36 mm · 40 g',temp:'−20…+65 °C',install:'3M adhesive'},
      kit:['main','tape','charger','manual','mounting'],
      note:['Режим парковки требует подходящего подключения к постоянному питанию. Карта памяти приобретается отдельно.','Parking mode needs a compatible constant-power connection. Memory card sold separately.','מצב חניה דורש חיבור חשמל קבוע מתאים. כרטיס זיכרון נמכר בנפרד.','وضع الوقوف يحتاج إلى توصيل كهربائي مستمر مناسب. بطاقة الذاكرة تباع منفصلة.']
    },
    2:{
      source:'https://neoline.ru/shop/videoregistrator-neoline-flash-2k-wi-fi/',
      summary:['Компактная камера 2K с HDR, светосильным объективом F/1.7, экраном 1,47″, приложением Road Video и парковочным режимом.','A compact 2K camera with HDR, an F/1.7 lens, 1.47-inch screen, Road Video app and parking mode.','מצלמת 2K קומפקטית עם HDR, עדשת F/1.7, מסך 1.47″, אפליקציית Road Video ומצב חניה.','كاميرا 2K مدمجة تدعم HDR وعدسة F/1.7 وشاشة 1.47 بوصة وتطبيق Road Video ووضع الوقوف.'],
      features:['video2k','hdr','wifi','tiny','g','timelapse','park'],
      specs:{front:'2560×1440 · 30 fps · HDR',cameras:'1',angle:'170°',lens:'F/1.7',screen:'1.47″',sensor:'GalaxyCore',wireless:'Wi-Fi',app:'Road Video',storage:'microSD ≤256 GB',recording:'TS · loop',GPS:'no',impact:'yes',parking:'yes',temp:'−10…+60 °C',size:'90×50×35 mm · 95 g',install:'3M adhesive'},
      kit:['main','tape','charger','manual','mounting'],
      note:['На рекламной странице производителя встречается угол 140°, тогда как в актуальной карточке магазина указан 170°. Здесь использована спецификация из карточки товара. Для парковки нужно постоянное питание.','The landing page lists 140°, while the shop product specification lists 170°. We use the shop specification. Parking mode requires continuous power.','בדף הנחיתה רשום 140° ובדף המוצר 170°. כאן מוצג נתון דף המוצר. מצב חניה דורש חשמל קבוע.','تذكر صفحة الإعلان 140° بينما تذكر صفحة المنتج 170°. نعتمد مواصفات صفحة المنتج. وضع الوقوف يحتاج طاقة مستمرة.']
    },
    3:{
      source:'https://neoline.ru/shop/neoline-flash-2k-dual/',
      summary:['Двухканальный регистратор с 2K-видео спереди, Full HD сзади, HDR, IPS-дисплеем 3,2″ и влагозащищённой задней камерой IP67.','Dual-channel recording with 2K front video, Full HD rear video, HDR, a 3.2-inch IPS screen and an IP67 rear camera.','הקלטה דו־ערוצית: 2K מקדימה ו־Full HD מאחור, HDR, מסך IPS בגודל 3.2″ ומצלמה אחורית בתקן IP67.','تسجيل مزدوج بدقة 2K أماماً وFull HD خلفاً مع HDR وشاشة IPS مقاس 3.2 بوصة وكاميرا خلفية IP67.'],
      features:['dual2k','hdr','rearip','wifi','g','park','timelapse'],
      specs:{front:'2560×1440 · 25 fps',rear:'1920×1080 · Full HD',cameras:'2',angle:'170° + 120°',lens:'F/1.7 (front)',screen:'3.2″ IPS',sensor:'GalaxyCore',wireless:'Wi-Fi',app:'Road Video',storage:'microSD ≤256 GB',GPS:'no',impact:'yes',parking:'yes',protection:'IP67 (rear)',install:'Windshield / 3M'},
      kit:['main','back','tape','charger','rearCable6','manual','mounting'],
      note:['Для парковочного режима требуется постоянное питание. На официальной странице заявлена влагозащита задней камеры IP67; GPS-модуль отсутствует.','Continuous power is required for parking mode. The official page specifies IP67 rear-camera protection and no GPS module.','מצב חניה דורש חשמל קבוע. האתר הרשמי מציין IP67 למצלמה האחורית וללא מודול GPS.','وضع الوقوف يتطلب طاقة دائمة. تحدد صفحة الشركة حماية IP67 للخلفية وعدم وجود GPS.']
    },
    4:{
      source:'https://neoline.ru/shop/zerkalo-neoline-easydrive-2k-wi-fi-dual/',
      summary:['Видеорегистратор-зеркало с двумя камерами, большим сенсорным экраном IPS 9,66″, Wi-Fi и помощником парковки.','A dual-camera mirror dash cam with a large 9.66-inch IPS touchscreen, Wi-Fi and parking assistance.','מצלמת דרך בצורת מראה עם שתי מצלמות, מסך מגע IPS בגודל 9.66″, Wi-Fi ועזר לחניה.','كاميرا على شكل مرآة مع كاميرتين وشاشة IPS لمس 9.66 بوصة وWi-Fi ومساعدة للركن.'],
      features:['mirror','dual2k','hdr','wifi','parkassist','rearip','park'],
      specs:{front:'2560×1440 · 30 fps',rear:'1920×1080 · 30 fps',cameras:'2',angle:'170° + 120°',lens:'F/1.7',screen:'9.66″ IPS touch',sensor:'GC4663 / GC2053',wireless:'Wi-Fi',app:'Road Video',storage:'microSD ≤256 GB',GPS:'no',impact:'yes',parking:'yes',protection:'IP67 (rear)',power:'Supercapacitor',install:'Rear-view mirror'},
      kit:['main','back','rearCable6','tape','charger'],
      note:['Для автоматического показа камеры при включении заднего хода потребуется подключение к фонарю заднего хода. Дополнительное постоянное питание нужно для парковочного режима.','Reverse-gear display needs wiring to the reverse light. Parking recording needs continuous power.','להצגת צילום בנסיעה לאחור דרוש חיבור לפנס הרוורס; צילום בחניה דורש מתח קבוע.','عرض الكاميرا تلقائياً عند الرجوع يتطلب توصيلاً بضوء الرجوع، ووضع الوقوف يتطلب كهرباء مستمرة.']
    },
    5:{
      source:'https://neoline.ru/shop/videoregistrator-neoline-argus-4k-wi-fi/',
      summary:['Флагманская одиночная 4K-камера на матрице Sony Starvis IMX415: GPS, Wi-Fi, IPS 3,19″, антибликовый CPL-фильтр и суперконденсатор.','A flagship single 4K camera using the Sony Starvis IMX415, with GPS, Wi-Fi, 3.19-inch IPS, CPL filter and supercapacitor.','מצלמת דגל יחידה ב־4K עם חיישן Sony Starvis IMX415, GPS, Wi-Fi, מסך IPS בגודל 3.19″, מסנן CPL וקבל־על.','كاميرا 4K رائدة منفردة بمستشعر Sony Starvis IMX415 وGPS وWi-Fi وشاشة IPS 3.19 بوصة ومرشح CPL ومكثف فائق.'],
      features:['sony4k','cpl','gps','wifi','g','park','super'],
      specs:{front:'4K 3840×2160 / QHD 2848×1600 / FHD 1920×1080',cameras:'1',angle:'140°',lens:'7 glass elements',screen:'3.19″ IPS',sensor:'SONY Starvis IMX415',wireless:'Wi-Fi',app:'Neoline Assist',storage:'microSD ≤256 GB',GPS:'yes',radar:'International database',impact:'yes',parking:'yes',power:'Supercapacitor',cpl:'CPL 37 mm',install:'3M adhesive'},
      kit:['main','tape','cpl37','charger','mounting','manual'],
      note:['Для некоторых режимов парковки требуется отдельный фирменный кабель постоянного питания, который не входит в стандартную комплектацию. Базы камер зависят от региона.','Certain parking features need an optional dedicated hardwire cable. Camera database coverage depends on region.','חלק ממצבי החניה דורשים כבל חשמל קבוע נוסף שאינו בערכה. כיסוי מאגר מצלמות האכיפה משתנה לפי אזור.','تتطلب بعض أوضاع الوقوف كابل طاقة دائم إضافياً غير مرفق. يعتمد تغطية قاعدة الكاميرات على المنطقة.']
    },
    6:{
      source:'https://neoline.ru/shop/videoregistrator-neoline-argus-4k-s-kameroy-zadnego-vida/',
      summary:['Двухкамерная версия Argus 4K: сенсор Sony Starvis IMX415, задняя Full HD-камера, GPS, Wi-Fi и антибликовый CPL-фильтр.','The dual-camera Argus 4K combines a Sony Starvis IMX415 front sensor, Full HD rear camera, GPS, Wi-Fi and CPL glare filter.','דגם Argus 4K בעל שתי מצלמות: חיישן Sony Starvis IMX415 מקדימה, מצלמת Full HD אחורית, GPS, Wi-Fi ומסנן CPL.','طراز Argus 4K بكاميرتين: مستشعر Sony Starvis IMX415 أماماً وكاميرا Full HD خلفاً مع GPS وWi-Fi ومرشح CPL.'],
      features:['sony4k','dual4k','cpl','gps','wifi','g','park'],
      specs:{front:'4K 3840×2160 / QHD 2848×1600 / FHD 1920×1080',rear:'Full HD 1920×1080',cameras:'2',angle:'140° + 120°',lens:'7 glass elements',screen:'3.19″ IPS',sensor:'SONY Starvis IMX415',wireless:'Wi-Fi',app:'Neoline Assist',storage:'microSD ≤256 GB',GPS:'yes',radar:'International database',impact:'yes',parking:'yes',power:'Supercapacitor',cpl:'CPL 37 mm',install:'3M adhesive'},
      kit:['main','back','tape','cpl37','charger','rearCable55','hardwire','mounting','manual'],
      note:['В комплект входит кабель подключения к блоку предохранителей. Производитель предупреждает: минимальный порог напряжения комплектного кабеля — 11,8 В; заранее проверьте совместимость с аккумулятором автомобиля.','A fuse-box power cable is included. Manufacturer warns that its lower voltage cutoff is 11.8 V: check compatibility with your car battery.','כבל הזנה לתיבת הנתיכים כלול. היצרן מציין סף מתח מינימלי של 11.8V; יש לבדוק התאמה למצבר.','كابل علبة الفيوزات مرفق. تنبه الشركة إلى حد جهد أدنى قدره 11.8 فولت؛ تحقق من التوافق مع بطارية السيارة.']
    },
    7:{
      source:'https://neoline.ru/shop/videoregistrator-neoline-smartway-a100/',
      summary:['Двухканальный 4K-видеорегистратор с 6-дюймовым сенсорным IPS-экраном, Apple CarPlay, Android Auto, Screen Mirroring и второй камерой.','Dual-channel 4K dash cam with a 6-inch IPS touchscreen, Apple CarPlay, Android Auto, screen mirroring and rear camera.','מצלמת דרך דו־ערוצית ב־4K עם מסך מגע IPS בגודל 6″, תמיכה ב־Apple CarPlay, ב־Android Auto ובשיקוף מסך ומצלמה אחורית.','كاميرا طريق مزدوجة 4K بشاشة IPS لمس 6 بوصات وApple CarPlay وAndroid Auto وعرض شاشة الهاتف وكاميرا خلفية.'],
      features:['dual4k','carplay','ips6','link','flexible','rearip','parkassist','park'],
      specs:{front:'3840×2160 · 25 fps (4K UHD)',rear:'1920×1080 · 25 fps (Full HD)',cameras:'2',angle:'160° + 120°',lens:'F/1.8 (front)',screen:'6″ IPS touch · 1560×720',sensor:'GC4653 + GC5060',wireless:'Wi-Fi 2.4/5 GHz · Bluetooth 5.0',app:'Viidure',assistant:'Apple CarPlay · Android Auto · Screen Mirror',storage:'microSD ≤256 GB',GPS:'no',impact:'yes',parking:'yes',protection:'IP67 (rear)',install:'3M adhesive + suction'},
      kit:['main','back','rearCable65','tape','suction','charger','aux','mounting','quick'],
      note:['Для парковочного режима требуется отдельное питание к блоку предохранителей; кабель для него не входит в комплект. При подключении задней передачи нужен провод к фонарю заднего хода.','Parking mode needs an additional fuse-box power cable (not included). Automatic reverse view needs wiring to the reverse lamp.','מצב חניה דורש כבל נוסף לתיבת הנתיכים (אינו כלול). לתצוגת רוורס אוטומטית דרוש חיבור לפנס הרוורס.','وضع الوقوف يحتاج كابل طاقة إضافياً لعلبة الفيوزات (غير مرفق). عرض الرجوع تلقائياً يحتاج توصيل ضوء الرجوع.']
    },
    8:{
      source:'https://neoline.ru/shop/videoregistrator-neoline-g-tech-x54-dual/',
      summary:['Разнесённый двухканальный регистратор Full HD с незаметным центральным блоком, GPS/ГЛОНАСС, базой дорожных камер, Wi-Fi и выносным микрофоном.','Discreet split-system dual Full HD recorder with concealed control unit, GPS/GLONASS camera alerts, Wi-Fi and external microphone.','מערכת הקלטה מפוצלת לשתי מצלמות Full HD עם יחידת בקרה נסתרת, GPS/GLONASS, מאגר מצלמות אכיפה, Wi-Fi ומיקרופון חיצוני.','مسجل منفصل بكاميرتين Full HD ووحدة تحكم خفية وGPS/GLONASS وتنبيهات كاميرات الطريق وWi-Fi وميكروفون خارجي.'],
      features:['hidden','panorama','gps','wifi','microphone','button','voice','park'],
      specs:{front:'1920×1080 · 30 fps',rear:'1920×1080 · 30 fps',cameras:'2',angle:'170° + 170°',sensor:'SONY',wireless:'Wi-Fi',app:'Neoline On Air',storage:'microSD ≤128 GB',GPS:'GPS / GLONASS',radar:'Regional GPS database',impact:'yes',parking:'yes',power:'Supercapacitor',install:'Discreet split system',temp:'−20…+50 °C',voice:'yes'},
      kit:['control','front5','rear10','hardwire4','ties','screws','mic3','gps3','protect3','manual'],
      note:['База камер на российском сайте описывает покрытие РФ и других регионов; работа предупреждений в Израиле не подтверждена. Для парковочного режима требуется постоянное питание.','The Russian database description concerns Russia and other regions; speed-camera alert coverage in Israel is not confirmed. Parking monitoring needs continuous power.','מאגר מצלמות האכיפה מתואר עבור רוסיה ואזורים נוספים; לא אומתה פעילות ההתראות בישראל. מצב חניה דורש מתח קבוע.','تغطي قاعدة بيانات الرادارات مناطق روسيا وغيرها؛ لم نؤكد عمل تنبيهاتها في إسرائيل. المراقبة أثناء الوقوف تحتاج طاقة دائمة.']
    }
  };
  const valueNames={
    'Supercapacitor':['Суперконденсатор','Supercapacitor','קבל־על','مكثف فائق'],
    '3M adhesive':['На 3M-скотче','3M adhesive','דבק 3M','لاصق 3M'],
    'Windshield / 3M':['На стекло / 3M','Windshield / 3M','שמשה / דבק 3M','الزجاج الأمامي / 3M'],
    'Rear-view mirror':['Поверх салонного зеркала','Over the rear-view mirror','מעל המראה הפנימית','فوق المرآة الداخلية'],
    '3M adhesive + suction':['3M-скотч + присоска','3M adhesive + suction','דבק 3M + תושבת ואקום','لاصق 3M + شفاط'],
    'Discreet split system':['Разнесённая скрытая установка','Discreet split system','מערכת מפוצלת נסתרת','نظام منفصل وخفي'],
    'Regional GPS database':['Региональная GPS-база камер','Regional GPS database','מאגר GPS אזורי','قاعدة GPS إقليمية'],
    'International database':['Международная база камер','International database','מאגר מצלמות בינלאומי','قاعدة بيانات دولية'],
    '7 glass elements':['7 стеклянных линз','7 glass elements','7 רכיבי עדשה מזכוכית','7 عناصر عدسة زجاجية'],
    'TS · loop':['TS · циклическая запись','TS · loop recording','TS · הקלטה מחזורית','TS · تسجيل حلقي']
  };
  function localValue(v,lang){if(v==='yes')return L(ui.yes,lang);if(v==='no')return L(ui.no,lang);return valueNames[v]?L(valueNames[v],lang):v}
  /* Direct PDF destinations extracted from the documentation links in the
     Russian official product pages. Documents are hosted by NEOLINE. */
  const manuals={
    1:'https://neoline.ru/upload/iblock/410/b4hdz0tiqy9nlj8t5wjuhp510bjovumq/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%20Wowcam.pdf?v=1763388577',
    3:'https://neoline.ru/upload/iblock/912/0yppwdistetvjcb2djulbewlrhny56zk/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%20Flash2k%20Dual.pdf?v=1759390526',
    4:'https://neoline.ru/upload/iblock/a5c/gh0t40y599hnrscwd4jpppd5mw5lw32i/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%20Easydrive2k.pdf?v=1759390540',
    5:'https://neoline.ru/upload/iblock/36d/4p70m4jkyjm7zhvlisxbiboslgje2282/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%20Argus4k.pdf?v=1759734230',
    6:'https://neoline.ru/upload/iblock/36d/4p70m4jkyjm7zhvlisxbiboslgje2282/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%20Argus4k.pdf?v=1759734230',
    7:'https://neoline.ru/upload/iblock/7e6/7iwh3bqpazaogk2853kf62kiw5ll23bu/%D0%98%D0%BD%D1%81%D1%82%D1%80%D0%A3%D0%9A%D0%A6%D0%98%D0%AF%20SMARTWAY.pdf?v=1745914198',
    8:'https://neoline.ru/upload/iblock/7e6/4v70n3qjgw7mlv3x2cf3kvf2ja1xnhlh/%D0%98%D0%BD%D1%81%D1%82%D1%80%D0%A3%D0%9A%D0%A6%D0%98%D0%AF%20X54.pdf?v=1759390549'
  };
  const read=(id,lang='ru')=>{
    const p=data[id];if(!p)return null;
    return {source:p.source,manual:manuals[id]||null,summary:L(p.summary,lang),
      features:p.features.map(key=>({title:L(feat[key][0],lang),desc:L(feat[key][1],lang)})),
      specs:Object.entries(p.specs).map(([key,v])=>({key,label:L(specNames[key],lang),value:localValue(v,lang)})),
      kit:p.kit.map(key=>L(kits[key],lang)),
      note:L(p.note,lang)};
  };
  const tr=(key,lang='ru')=>L(ui[key],lang);
  return {read,tr,models:Object.keys(data)};
})();
