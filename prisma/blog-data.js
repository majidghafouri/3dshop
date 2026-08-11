// Blog seed data for figureforge.
// body uses markdown-lite: "## " h2, "- " bullets, "1. " numbered, "> " quote, "---" hr, **bold**, `code`.

const BLOG_POSTS = [
  {
    slug: "buying-guide-anime-figures",
    category: "guide",
    published: true,
    readingTime: 7,
    daysAgo: 60,
    createdDaysAgo: 70,
    title: {
      fa: "راهنمای خرید فیگور انیمه؛ از کجا شروع کنیم؟",
      en: "Anime Figure Buying Guide: Where to Start?",
      ar: "دليل شراء فيجورات الأنمي: من أين نبدأ؟",
    },
    tag: { fa: "راهنما", en: "Guide", ar: "دليل" },
    excerpt: {
      fa: "اگر تازه وارد دنیای کلکسیون فیگورهای انیمه شده‌اید، این راهنما قدم‌به‌قدم شما را به اولین خرید می‌رساند.",
      en: "New to collecting anime figures? This guide walks you through your very first purchase step by step.",
      ar: "هل أنت جديد في عالم جمع فيجورات الأنمي؟ يرشدك هذا الدليل خطوة بخطوة نحو أول عملية شراء.",
    },
    body: {
      fa: `ورود به دنیای فیگورهای انیمه هیجان‌انگیز است، اما انتخاب اولین فیگور می‌تواند گیج‌کننده باشد. برندهای زیاد، مقیاس‌های متفاوت و قیمت‌های متنوع، تصمیم را سخت می‌کنند. در این راهنما می‌خواهیم ساده و قدم‌به‌قدم به سراغ اولین خرید برویم.

## از شخصیت محبوبت شروع کن
بهترین نقطه شروع، شخصیتی است که دوستش داری. کلکسیون با یک شخصیت ماندگار شروع می‌شود و بعداً می‌توانی آن را گسترش دهی. به جای شکارِ گران‌ترین یا کمیاب‌ترین فیگور، اول از یک شخصیت اصلی و محبوب شروع کن.

## برند را بشناس
هر برند سبک و کیفیت متفاوتی دارد:

- **بانپرستو (Banpresto):** اقتصادی و مناسب شروع کلکسیون
- **S.H.Figuarts:** جزئیات بالا و مفاصل زیاد برای ژست‌های پویا
- **McFarlane و NECA:** برای طرفداران سریال‌ها و بازی‌ها
- **Bandai Namco:** انتخاب مطمئن برای سری‌های محبوب انیمه

## به مقیاس و اندازه دقت کن
فیگورها در اندازه‌های متفاوتی ساخته می‌شوند. رایج‌ترین مقیاس‌ها عبارت‌اند از:

1. مقیاس ۱/۱۲ با قد حدود ۱۵ سانتی‌متر؛ مناسب قفسه‌های کوچک
2. مقیاس ۱/۸ و ۱/۷ با قد ۲۰ تا ۲۵ سانتی‌متر؛ پرطرفدارترین سایز
3. فیگورهای بزرگ ۳۰ تا ۴۰ سانتی‌متری؛ نقطه‌ی کانونی کلکسیون

> قبل از خرید، جای قفسه و ارتفاع جعبه را اندازه بگیر؛ غافلگیر نشو!

## جمع‌بندی
اولین خرید نباید کامل‌ترین یا گران‌ترین باشد؛ باید شروعی درست باشد. شخصیت محبوب + برند معتبر + سایز مناسب، فرمول یک شروع بی‌نقص است.`,
      en: `Entering the world of anime figures is exciting, but choosing your first figure can be overwhelming. Lots of brands, different scales and a wide range of prices make the decision hard. In this guide we keep it simple and step by step.

## Start with a character you love
The best starting point is a character you actually like. A collection starts with one memorable figure and grows from there. Instead of hunting the most expensive or rarest figure, begin with a main character you enjoy.

## Know the brands
Every brand has its own style and quality:

- **Banpresto:** affordable and great for starting out
- **S.H.Figuarts:** high detail and lots of joints for dynamic poses
- **McFarlane and NECA:** perfect for TV show and game fans
- **Bandai Namco:** a safe pick for popular anime series

## Mind the scale and size
Figures come in many sizes. The most common scales are:

1. 1/12 scale, about 15 cm tall; great for small shelves
2. 1/8 and 1/7 scale, 20 to 25 cm tall; the most popular size
3. Large figures of 30 to 40 cm; the centerpiece of your collection

> Measure your shelf space and the box height before buying — don't get surprised!

## Wrap up
Your first purchase doesn't need to be the biggest or most expensive; it needs to be a right start. A favorite character + a trusted brand + the right size is the formula for a perfect beginning.`,
      ar: `الدخول إلى عالم فيجورات الأنمي مثير، لكن اختيار أول فيجور قد يكون مربكًا. علامات كثيرة ومقاسات مختلفة وأسعار متباينة تجعل القرار صعبًا. في هذا الدليل نبسّط الأمور خطوة بخطوة.

## ابدأ بشخصية تحبها
أفضل نقطة بداية هي شخصية تحبها فعلًا. تبدأ المجموعة بفيجور واحد لا يُنسى ثم تكبر مع الوقت. بدلًا من مطاردة أغلى أو أندر فيجور، ابدأ بشخصية رئيسية تعجبك.

## اعرف العلامات التجارية
لكل علامة أسلوبها وجودتها الخاصة:

- **بانبريستو (Banpresto):** اقتصادية ومثالية للبداية
- **S.H.Figuarts:** تفاصيل عالية ومفاصل كثيرة لحركات ديناميكية
- **McFarlane وNECA:** مثالية لمحبي المسلسلات والألعاب
- **بانداي نامكو (Bandai Namco):** خيار آمن لسلاسل الأنمي الشهيرة

## انتبه للمقاس والحجم
تصنع الفيجورات بأحجام متعددة. أشهر المقاسات:

1. مقاس 1/12 بارتفاع حوالي 15 سم؛ مناسب للرفوف الصغيرة
2. مقاس 1/8 و1/7 بارتفاع 20 إلى 25 سم؛ الحجم الأكثر شعبية
3. فيجورات كبيرة من 30 إلى 40 سم؛ قطعة مميزة في المجموعة

> قس مساحة الرف وارتفاع الصندوق قبل الشراء حتى لا تتفاجأ!

## الخلاصة
أول عملية شراء لا تحتاج أن تكون الأكبر أو الأغلى؛ بل يجب أن تكون بداية صحيحة. شخصية محبوبة + علامة موثوقة + مقاس مناسب هي معادلة البداية المثالية.`,
    },
  },
  {
    slug: "top-10-marvel-figures-collectors",
    category: "feature",
    published: true,
    readingTime: 6,
    daysAgo: 50,
    createdDaysAgo: 62,
    title: {
      fa: "معرفی ۱۰ فیگور برتر مارول برای کلکسیونرها",
      en: "Top 10 Marvel Figures for Collectors",
      ar: "أفضل 10 فيجورات مارفل للجامعين",
    },
    tag: { fa: "معرفی", en: "Feature", ar: "تقرير" },
    excerpt: {
      fa: "از آیرون من تا ونوم؛ این ده فیگور مارول باید جای ثابتی در قفسه هر کلکسیونر داشته باشند.",
      en: "From Iron Man to Venom — these ten Marvel figures deserve a permanent spot on every collector's shelf.",
      ar: "من آيرون مان إلى فينوم — تستحق هذه الفيجورات العشر مكانًا دائمًا على رف كل جامع.",
    },
    body: {
      fa: `دنیای مارول پر از شخصیت‌های نمادین است و برندهای زیادی برای آن فیگور می‌سازند. اما بعضی فیگورها به لطف طراحی، مفصل‌بندی و ارزش کلکسیونی، از بقیه جدا می‌شوند.

## ده انتخاب برتر
- **آیرون من Mk5 (ZD Toys):** زره قرمز طلایی کلاسیک با جزئیات ریاکتور
- **وار ماشین Mk1 (ZD Toys):** طراحی زرهی سنگین با استایل کمیک‌بوکی
- **ونوم (Play Arts Kai):** قد ۲۸ سانتی‌متری و عضلات اغراق‌شده
- **جان ویک (Mafex):** شباهت خیره‌کننده به کیانو ریوز
- **اسپایدرمن مایلز مورالس (Marvel Legends):** مفاصل روان و طراحی جوان
- **اسپایدرمن پیتر پارکر (S.H.Figuarts):** استایل انیمیشنی اسپایدر ورس
- **گودزیلا علیه کونگ (NECA):** هیولایی با جزئیات پوسته عالی
- **هانیبال لکتر (NECA):** طراحی سینمایی دقیق با اکسسوری ماسک
- **دارث ویدر (Kaidoyo):** شمشیر نورانی قرمز و شنل پارچه‌ای
- **بیگانه زنومورف (NECA):** ترسناک، دقیق و بی‌رقیب

## چرا این‌ها خاص‌اند؟
مشترکات این ده فیگور را می‌توان این‌طور خلاصه کرد:

1. **شباهت بالا** به نسخه اصلی روی پرده یا در کمیک
2. **مفاصل باکیفیت** که ژست‌های متنوع می‌سازند
3. **ارزش ماندگار** که بعد از سال‌ها هم خریدش منطقی است

> کلکسیون خوب فقط «بزرگ» نیست؛ «انتخاب‌شده» است.

## سخن آخر
اگر می‌خواهی کلکسیون مارول را شروع کنی یا کاملش کنی، این لیست نقطه شروع مطمئنی است.`,
      en: `The Marvel universe is full of iconic characters and many brands make figures for them. But some figures stand out thanks to their design, articulation and collector value.

## Ten top picks
- **Iron Man Mk5 (ZD Toys):** classic red and gold armor with reactor detail
- **War Machine Mk1 (ZD Toys):** heavy armored look with comic style
- **Venom (Play Arts Kai):** 28 cm tall with exaggerated muscles
- **John Wick (Mafex):** striking Keanu Reeves likeness
- **Spider-Man Miles Morales (Marvel Legends):** smooth joints and youthful style
- **Spider-Man Peter Parker (S.H.Figuarts):** animated Spider-Verse style
- **Godzilla vs Kong (NECA):** monstrous with excellent shell detail
- **Hannibal Lecter (NECA):** movie-accurate with mask accessory
- **Darth Vader (Kaidoyo):** red lightsaber and cloth cape
- **Alien Xenomorph (NECA):** terrifying, accurate and unmatched

## Why are these special?
You can sum up what these ten share:

1. **High likeness** to the on-screen or comic original
2. **Quality joints** that allow varied poses
3. **Lasting value** — still a smart buy years later

> A great collection isn't just "big"; it's "curated".

## Final word
Whether you're starting or completing a Marvel collection, this list is a safe starting point.`,
      ar: `عالم مارفل مليء بالشخصيات الرمزية والعديد من العلامات تصنع لها فيجورات. لكن بعض الفيجورات تبرز بفضل تصميمها ومفاصلها وقيمتها الجمعية.

## عشر اختيارات مميزة
- **آيرون مان Mk5 (ZD Toys):** درع أحمر وذهبي كلاسيكي مع تفاصيل المفاعل
- **وار ماشين Mk1 (ZD Toys):** مظهر مدرّع ثقيل بأسلوب القصص المصورة
- **فينوم (Play Arts Kai):** ارتفاع 28 سم وعضلات مبالغ فيها
- **جون ويك (Mafex):** تشابه مذهل بكيانو ريفز
- **سبايدرمان مايلز موراليس (Marvel Legends):** مفاصل سلسة وأسلوب شبابي
- **سبايدرمان بيتر باركر (S.H.Figuarts):** أسلوب سبايدر-فرس الكرتوني
- **جودزيلا ضد كونغ (NECA):** وحشي مع تفاصيل صدفية رائعة
- **هانيبال ليكتر (NECA):** تصميم دقيق من الفيلم مع قناع
- **دارث فيدر (Kaidoyo):** سيف ضوئي أحمر وعباءة قماشية
- **الكائن الغريب زينومورف (NECA):** مرعب ودقيق ولا منافس له

## لماذا هي مميزة؟
يمكن تلخيص القاسم المشترك بين هذه العشر:

1. **تشابه عالٍ** مع الأصل على الشاشة أو في القصص المصورة
2. **مفاصل عالية الجودة** تسمح بأوضاع متنوعة
3. **قيمة دائمة** — شراء ذكي حتى بعد سنوات

> المجموعة الرائعة ليست فقط «كبيرة»؛ بل «منتقاة».

## ختامًا
سواء كنت تبدأ أو تُكمل مجموعة مارفل، فهذه القائمة نقطة بداية آمنة.`,
    },
  },
  {
    slug: "receive-figures-safely",
    category: "guide",
    published: true,
    readingTime: 5,
    daysAgo: 40,
    createdDaysAgo: 52,
    title: {
      fa: "چگونه فیگورها را سالم تحویل بگیریم؟",
      en: "How to Receive Figures Safely",
      ar: "كيف تستلم الفيجورات بأمان؟",
    },
    tag: { fa: "راهنما", en: "Guide", ar: "دليل" },
    excerpt: {
      fa: "جعبه را باز کن، کالا را چک کن و اگر مشکل بود مرجوع کن؛ راهنمای تحویل‌گیری اصولی.",
      en: "Open the box, inspect the figure and return it if needed — the proper way to receive your order.",
      ar: "افتح الصندوق وافحص الفيجور وأعده إذا لزم الأمر — الطريقة الصحيحة لاستلام طلبك.",
    },
    body: {
      fa: `خرید آنلاین فیگور هیجان دارد، اما نکته مهم بعد از رسیدن بسته است: تحویل‌گیری اصولی. با چند قدم ساده می‌توانی مطمئن شوی کالا سالم و مطابق انتظار است.

## قبل از باز کردن
- فیلم بگیر یا عکس بردار تا وضعیت بسته ثبت شود
- بسته را از نظر ضربه، فشار یا پارگی بررسی کن
- اگر بسته به‌شدت آسیب دیده بود، جلوی مامور پست باز نکن و ثبت خسارت بخواه

## بعد از باز کردن
حالا نوبت بازرسی کالاست:

1. کارتن و فوم را با دقت خارج کن؛ از کشیدن بی‌مورد قطعات بپرهیز
2. جعبه محصول را از نظر فشردگی و رطوبت بررسی کن
3. فیگور را از جعبه خارج کن و این موارد را چک کن:

- قطعات شکسته یا جدا
- رنگ پریدگی یا خراش
- مفاصل سست یا گیرکرده
- کامل بودن اکسسوری‌ها و پایه

> هرچه زودتر متوجه مشکل شوی، مرجوعی ساده‌تر است.

## اگر مشکل پیدا کردی
با پشتیبانی فروشگاه تماس بگیر و عکس یا فیلم مشکل را ارسال کن. بیشتر فروشگاه‌های معتبر فرصت بازگشت ۷ روزه دارند.

## نتیجه‌گیری
چند دقیقه دقت موقع تحویل، از یک سال ناراحتی جلوگیری می‌کند.`,
      en: `Buying a figure online is exciting, but the key moment is when the package arrives: receiving it properly. A few simple steps let you make sure everything is intact and as expected.

## Before opening
- Film or photograph the package so its condition is recorded
- Check the box for impacts, pressure or tears
- If the box is badly damaged, don't open it in front of the courier — file a damage claim

## After opening
Now it's time to inspect the goods:

1. Take the cardboard and foam out carefully; avoid pulling pieces
2. Check the product box for crushing or moisture
3. Take the figure out and check the following:

- Broken or detached parts
- Faded paint or scratches
- Loose or stuck joints
- All accessories and base present

> The sooner you notice a problem, the easier the return.

## If you find a problem
Contact the store's support and send photos or a video. Most reputable stores offer a 7-day return window.

## Takeaway
A few minutes of care at delivery saves a year of regret.`,
      ar: `شراء فيجور أونلاين مثير، لكن اللحظة المهمة هي وصول الطرد: الاستلام الصحيح. بضع خطوات بسيطة تضمن أن كل شيء سليم كما هو متوقع.

## قبل الفتح
- صوّر الطرد أو التقط صورًا لتوثيق حالته
- افحص الصندوق بحثًا عن الصدمات أو الضغط أو التمزق
- إذا كان الصندوق متضررًا بشدة، لا تفتحه أمام موظف التوصيل — قدّم بلاغ ضرر

## بعد الفتح
حان وقت فحص المنتج:

1. أخرج الكرتون والإسفنج بحذر؛ تجنب شد القطع
2. افحص صندوق المنتج بحثًا عن الضغط أو الرطوبة
3. أخرج الفيجور وافحص التالي:

- قطع مكسورة أو منفصلة
- بهتان اللون أو الخدوش
- مفاصل مرتخية أو عالقة
- اكتمال الملحقات والقاعدة

> كلما لاحظت المشكلة أبكر، كان الإرجاع أسهل.

## إذا وجدت مشكلة
تواصل مع دعم المتجر وأرسل الصور أو الفيديو. تمنح معظم المتاجر الموثوقة نافذة إرجاع 7 أيام.

## الخلاصة
دقائق من العناية عند الاستلام تمنع سنة من الندم.`,
    },
  },
  {
    slug: "movie-figures-that-make-a-collection",
    category: "feature",
    published: true,
    readingTime: 6,
    daysAgo: 32,
    createdDaysAgo: 44,
    title: {
      fa: "فیگورهای سینمایی که کلکسیون را خاص می‌کنند",
      en: "Movie Figures That Make a Collection Special",
      ar: "فيجورات السينما التي تميّز المجموعة",
    },
    tag: { fa: "معرفی", en: "Feature", ar: "تقرير" },
    excerpt: {
      fa: "از بیگانه تا جان ویک؛ فیگورهای سینمایی روح سینما را به قفسه کلکسیون می‌آورند.",
      en: "From Alien to John Wick — movie figures bring the spirit of cinema to your shelf.",
      ar: "من Alien إلى جون ويك — تجلب فيجورات السينما روح الشاشة إلى رفك.",
    },
    body: {
      fa: `بعض فیگورها فقط «جسم» هستند؛ بعضی دیگر یک «صحنه» را در ذهن زنده می‌کنند. فیگورهای سینمایی آن دسته دوم‌اند؛ پلانی از یک فیلم خاطره‌انگیز را در خانه‌ات نگه می‌داری.

## قهرمان‌ها
- **جان ویک (Mafex):** کت و شلوار مشکی و اسلحه‌هایش، فصل ۲ را یادت می‌آورد
- **هانیبال لکتر (NECA):** لحظه فرار از زندان با ماسک روی صورت
- **اسپایدرمن پیتر پارکر (S.H.Figuarts):** دنیای انیمیشنی اسپایدر ورس

## هیولاها و ضدقهرمان‌ها
- **بیگانه زنومورف (NECA):** تجسم ترس کلاسیک سینمای وحشت
- **گودزیلا علیه کونگ (NECA):** نبرد تایتان‌ها روی قفسه‌ات
- **ونوم (Play Arts Kai):** سیبیوت مارول با طراحی اغراق‌شده

## چرا ارزش دارند؟
فیگور سینمایی خوب سه کار انجام می‌دهد:

1. **لحظه‌ساز است؛** یک صحنه به‌یادماندنی را زنده می‌کند
2. **گفتگو می‌سازد؛** اولین چیزی است که مهمان‌ها می‌پرسند
3. **ارزشش ماندگار است؛** به‌مرور کمیاب و ارزشمندتر می‌شود

> یک کلکسیون بدون فیگور سینمایی، مثل سینما بدون موسیقی است.

## جمع‌بندی
این فیگورها فقط کالا نیستند؛ خاطره‌اند. اگر کلکسیونت به یک «قلب» نیاز دارد، یک فیگور سینمایی انتخابش کن.`,
      en: `Some figures are just "objects"; others bring a "scene" to life in your mind. Movie figures belong to the second kind — you keep a frame from a memorable film at home.

## The heroes
- **John Wick (Mafex):** the black suit and guns bring Chapter 2 back
- **Hannibal Lecter (NECA):** the prison escape moment, mask and all
- **Spider-Man Peter Parker (S.H.Figuarts):** the animated Spider-Verse world

## The monsters and anti-heroes
- **Alien Xenomorph (NECA):** the embodiment of classic horror cinema
- **Godzilla vs Kong (NECA):** the battle of titans on your shelf
- **Venom (Play Arts Kai):** Marvel's symbiote with a stylized look

## Why they matter
A great movie figure does three things:

1. **It makes a moment;** it revives a memorable scene
2. **It starts conversations;** it's the first thing guests ask about
3. **Its value lasts;** it becomes rarer and more precious over time

> A collection without a movie figure is like cinema without music.

## Wrap up
These figures aren't just products; they're memories. If your collection needs a "heart", pick a movie figure.`,
      ar: `بعض الفيجورات مجرد «أشياء»؛ وبعضها الآخر يحيي «مشهدًا» في ذهنك. فيجورات السينما من النوع الثاني — تحتفظ بلقطة من فيلم لا يُنسى في منزلك.

## الأبطال
- **جون ويك (Mafex):** البدلة السوداء والمسدسات تعيدك إلى الفصل الثاني
- **هانيبال ليكتر (NECA):** لحظة الهروب من السجن بالقناع
- **سبايدرمان بيتر باركر (S.H.Figuarts):** عالم سبايدر-فرس الكرتوني

## الوحوش ومضادو الأبطال
- **الكائن الغريب زينومورف (NECA):** تجسيد الرعب الكلاسيكي
- **جودزيلا ضد كونغ (NECA):** معركة العمالقة على رفك
- **فينوم (Play Arts Kai):** سيمبيوت مارفل بتصميم مميز

## لماذا تهم؟
فيجور سينمائي رائع يفعل ثلاثة أشياء:

1. **يصنع اللحظة؛** يحيي مشهدًا لا يُنسى
2. **يبدأ الأحاديث؛** وهو أول ما يسأل عنه الضيوف
3. **قيمته دائمة؛** يصبح أندر وأثمن مع الوقت

> مجموعة بلا فيجور سينمائي مثل سينما بلا موسيقى.

## الخلاصة
هذه الفيجورات ليست مجرد منتجات؛ إنها ذكريات. إذا كانت مجموعتك بحاجة إلى «قلب»، فاختر فيجورًا سينمائيًا.`,
    },
  },
  {
    slug: "trusted-figure-brands",
    category: "learn",
    published: true,
    readingTime: 6,
    daysAgo: 24,
    createdDaysAgo: 36,
    title: {
      fa: "برندهای معتبر سازنده فیگور را بشناسید",
      en: "Know the Trusted Figure Brands",
      ar: "تعرّف على علامات الفيجورات الموثوقة",
    },
    tag: { fa: "دانستنی‌ها", en: "Learn", ar: "معلومات" },
    excerpt: {
      fa: "کیفیت، مفصل‌بندی و ارزش کلکسیونی؛ شناخت برندها، خرید شما را هوشمندتر می‌کند.",
      en: "Quality, articulation and collector value — knowing the brands makes you a smarter buyer.",
      ar: "الجودة والمفاصل والقيمة الجمعية — معرفة العلامات تجعلك مشتريًا أذكى.",
    },
    body: {
      fa: `در بازار فیگور، «برند» مهم‌ترین نشانه کیفیت است. هر برند مخاطب، سبک و محدوده قیمت خاص خودش را دارد. شناخت این تفاوت‌ها قبل از خرید، از پشیمانی جلوگیری می‌کند.

## برندهای ژاپنی و نخبگان
- **S.H.Figuarts (باندای):** مفاصل پیشرفته و شباهت بالا؛ انتخابی حرفه‌ای
- **Play Arts Kai:** طراحی هنری و اغراق‌شده با حضور قوی
- **Mafex (مدیکام):** کیفیت نفیس و لایسنس‌های درجه یک هالیوود

## برندهای اقتصادی و پرمخاطب
- **Banpresto:** محبوب ژاپن و گنجینه مقرون‌به‌صرفه برای شروع
- **Marvel Legends (هاسبرو):** استاندارد کلکسیون مارول با قیمت مناسب
- **McFarlane Toys:** انتخاب درست برای بازی‌ها و سریال‌ها

## برندهای تخصصی
- **NECA:** پادشاه هورور و فیگورهای لایسنس‌شده سینما
- **Hasbro (بسته‌های پریمیوم):** محصولات تعاملی مثل بیبی یودای رباتیک

> برند، ضامن «کیفیت» است، نه ضامن «قیمت مناسب»؛ هر دو را با هم بسنج.

## چگونه انتخاب کنیم؟
یک انتخاب هوشمندانه چهار قدم دارد:

1. برند را با سلیقه‌ات هماهنگ کن
2. بودجه را شفاف مشخص کن
3. بررسی‌ها و ویدیوهای آنباکسینگ را ببین
4. از فروشگاه معتبر و با ضمانت اصالت بخر

## سخن آخر
برند خوب به‌تنهایی کافی نیست، اما خرید بدون شناخت برند، قمار است.`,
      en: `In the figure market, "brand" is the most important sign of quality. Each brand has its own audience, style and price range. Knowing these differences before buying prevents regret.

## Japanese and premium brands
- **S.H.Figuarts (Bandai):** advanced joints and high likeness; a pro choice
- **Play Arts Kai:** artistic, exaggerated design with strong presence
- **Mafex (Medicom):** exquisite quality and top Hollywood licenses

## Budget-friendly and mass-market
- **Banpresto:** a Japan favorite and an affordable treasure to start with
- **Marvel Legends (Hasbro):** the Marvel collection standard at a fair price
- **McFarlane Toys:** the right pick for games and TV shows

## Specialist brands
- **NECA:** king of horror and licensed cinema figures
- **Hasbro (premium sets):** interactive items like the robotic Baby Yoda

> A brand guarantees "quality", not "a good price" — weigh both together.

## How to choose
A smart choice has four steps:

1. Match the brand with your taste
2. Set your budget clearly
3. Watch reviews and unboxing videos
4. Buy from a reputable store with an authenticity guarantee

## Final word
A good brand isn't enough on its own, but buying without knowing the brand is a gamble.`,
      ar: `في سوق الفيجورات، «العلامة التجارية» أهم مؤشر على الجودة. لكل علامة جمهورها وأسلوبها ونطاق سعرها. معرفة هذه الفروق قبل الشراء تمنع الندم.

## العلامات اليابانية والفاخرة
- **S.H.Figuarts (بانداي):** مفاصل متقدمة وتشابه عالٍ؛ خيار محترف
- **Play Arts Kai:** تصميم فني ومبالغ فيه بحضور قوي
- **Mafex (ميديكوم):** جودة فاخرة وتراخيص هوليوود من الدرجة الأولى

## الاقتصادية والجماهيرية
- **بانبريستو (Banpresto):** مفضلة في اليابان وكنز اقتصادي للبداية
- **مارفل ليجندز (هاسبرو):** معيار مجموعات مارفل بسعر مناسب
- **McFarlane Toys:** الاختيار الصحيح للألعاب والمسلسلات

## العلامات المتخصصة
- **NECA:** ملك الرعب وفيجورات السينما المرخصة
- **هاسبرو (المجموعات الفاخرة):** منتجات تفاعلية مثل بيبي يودا الروبوتي

> العلامة تضمن «الجودة»، وليست ضمان «السعر المناسب» — وازن بينهما معًا.

## كيف تختار؟
الاختيار الذكي له أربع خطوات:

1. وازن العلامة مع ذوقك
2. حدد ميزانيتك بوضوح
3. شاهد المراجعات وفيديوهات فتح العلبة
4. اشترِ من متجر موثوق مع ضمان الأصالة

## ختامًا
العلامة الجيدة ليست كافية وحدها، لكن الشراء دون معرفة العلامة مقامرة.`,
    },
  },
  {
    slug: "shelving-and-display-ideas",
    category: "ideas",
    published: true,
    readingTime: 5,
    daysAgo: 18,
    createdDaysAgo: 30,
    title: {
      fa: "قفسه‌بندی و نمایش کلکسیون؛ ایده‌هایی برای دیوراما",
      en: "Shelving and Display Ideas for a Diorama",
      ar: "أفكار لترتيب الرفوف وعرض الديوراما",
    },
    tag: { fa: "ایده", en: "Ideas", ar: "أفكار" },
    excerpt: {
      fa: "با چیدمان درست، قفسه‌ای معمولی به صحنه‌ای نمایشی برای کلکسیونت تبدیل می‌شود.",
      en: "With the right layout, an ordinary shelf becomes a showcase for your collection.",
      ar: "مع الترتيب الصحيح، يتحول الرف العادي إلى واجهة عرض لمجموعتك.",
    },
    body: {
      fa: `کلکسیون تو ارزش دیده شدن را دارد. یک قفسه درست چیده‌شده، نه‌تنها فیگورها را قشنگ‌تر نشان می‌دهد، بلکه خانه‌ات را هم زیباتر می‌کند.

## اصول پایه چیدمان
- **ارتفاع بندی:** فیگورهای بزرگ پشت و کوچک‌ها جلو قرار بگیرند
- **فاصله‌گذاری:** به هر فیگور فضای تنفس بده؛ شلوغی اعتبارش را کم می‌کند
- **زمینه ساده:** پس‌زمینه بی‌نقش، جزئیات فیگور را برجسته می‌کند

## ایده‌های خلاقانه
۱. **دیوراما:** یک پس‌زمینه چاپی ساده (مثل دیوار شهر یا جنگل) پشت گروه بگذار
۲. **نورپردازی:** نوار LED با رنگ گرم، حس ویترین موزه می‌سازد
۳. **چرخش فصلی:** هر فصل چند فیگور را جابه‌جا کن تا کلکسیون همیشه تازه بماند
۴. **گروه‌بندی تم:** شخصیت‌های یک فیلم یا بازی را کنار هم بچین

> نظم، بهترین دوست یک کلکسیون است.

## جمع‌بندی
نیازی به تجهیزات گران نیست؛ با کمی خلاقیت و دقت، قفسه‌ات به ویترینی حرفه‌ای تبدیل می‌شود.`,
      en: `Your collection deserves to be seen. A well-arranged shelf not only shows your figures better — it also makes your home more beautiful.

## Basic layout principles
- **Layering:** put large figures in the back and small ones in front
- **Spacing:** give each figure breathing room; clutter lowers its value
- **Simple backdrop:** a plain background makes details pop

## Creative ideas
1. **Diorama:** place a simple printed backdrop (city wall or forest) behind a group
2. **Lighting:** warm LED strips create a museum showcase feel
3. **Seasonal rotation:** swap figures each season to keep the collection fresh
4. **Theme grouping:** arrange characters from the same film or game together

> Order is a collection's best friend.

## Wrap up
You don't need expensive gear; with a little creativity and care, your shelf becomes a professional showcase.`,
      ar: `مجموعتك تستحق أن تُرى. الرف المرتب جيدًا لا يُظهر الفيجورات بشكل أجمل فحسب — بل يجعل منزلك أجمل أيضًا.

## مبادئ الترتيب الأساسية
- **الطبقات:** ضع الفيجورات الكبيرة في الخلف والصغيرة في الأمام
- **المسافات:** امنح كل فيجور مساحة تنفس؛ الازدحام يقلل قيمته
- **خلفية بسيطة:** الخلفية النقية تُبرز التفاصيل

## أفكار إبداعية
1. **الديوراما:** ضع خلفية مطبوعة بسيطة (جدار مدينة أو غابة) خلف المجموعة
2. **الإضاءة:** أشرطة LED بضوء دافئ تخلق إحساس متحف
3. **التدوير الموسمي:** بدّل الفيجورات كل موسم لتبقى المجموعة حية
4. **التجميع حسب الموضوع:** رتّب شخصيات الفيلم أو اللعبة نفسها معًا

> النظام أفضل صديق للمجموعة.

## الخلاصة
لا تحتاج معدات باهظة؛ بقليل من الإبداع والعناية يتحول رفك إلى واجهة عرض احترافية.`,
    },
  },
  {
    slug: "top-10-figures-2026",
    category: "trend",
    published: false,
    readingTime: 6,
    daysAgo: 0,
    createdDaysAgo: 12,
    title: {
      fa: "۱۰ فیگور برتر ۲۰۲۶ که باید همین حالا بخرید",
      en: "Top 10 Figures of 2026 You Should Grab Now",
      ar: "أفضل 10 فيجورات لعام 2026 يجب أن تحصل عليها الآن",
    },
    tag: { fa: "ترند", en: "Trending", ar: "رائج" },
    excerpt: {
      fa: "پرطرفدارترین و خوش‌قیمت‌ترین فیگورهای امسال، در یک لیست به‌روز.",
      en: "The most popular and best-priced figures of the year, in one fresh list.",
      ar: "الفيجورات الأكثر شعبية والأفضل سعرًا هذا العام، في قائمة واحدة.",
    },
    body: {
      fa: `هر سال برندها فیگورهای تازه‌ای روانه بازار می‌کنند، اما بعضی از آن‌ها در عرض چند ماه کمیاب و گران می‌شوند. این لیست، فیگورهایی است که در سال ۲۰۲۶ ارزش خرید زودهنگام را دارند.

## انتخاب‌های برتر ۲۰۲۶
- **بیبی یودای رباتیک (Hasbro):** نسخه‌های ۲۵ و ۴۰ افکتی، هر سال داغ‌تر می‌شوند
- **ماندالوری و کودک (Hasbro):** زره بسکار و جزئیات سریال، ترکیبی برنده
- **کاکاشی هاتاکه ۴۰ سانتی (Banpresto):** قد بلند و ژست‌پذیری عالی
- **کریتوس (NECA):** نقطه ورود ارزان به دنیای گاد آو وار
- **گرالت (McFarlane):** شمشیر نقره و فولاد؛ محبوب همیشگی گیمرها
- **بایک ۳۲ سانتی (Ubisoft):** کلکسیونی و با جزئیات سلاح عقاب
- **آلتایر (McFarlane):** کلاسیک بی‌مرگ اساسین کرید
- **آیا (Ubisoft):** لباس مصر باستان با تیغه پنهان
- **اسپایدرمن مایلز (Marvel Legends):** محبوبیت نسل جدید
- **دارث ویدر (Kaidoyo):** یکی از نمادین‌ترین شرورهای تاریخ سینما

## چرا الان بخریم؟
دلایل منطقی برای خرید زودهنگام:

1. موجودی نسخه اولیه محدود است
2. قیمت فیگورهای محبوب معمولاً صعودی است
3. نسخه‌های کلاسیک بعداً با قیمت بالاتر فروخته می‌شوند

> در دنیای فیگور، تأخیر همیشه گران‌تر از خرید زودهنگام است.

## جمع‌بندی
اگر بودجه‌ات اجازه می‌دهد، نسخه‌های پرطرفدار را زودتر تهیه کن؛ سال بعد حسرت نخواهی خورد.`,
      en: `Every year brands release fresh figures, but some become rare and expensive within months. This list covers the figures worth buying early in 2026.

## Top picks for 2026
- **Robotic Baby Yoda (Hasbro):** the 25 and 40 effect versions get hotter each year
- **Mandalorian & Child (Hasbro):** beskar armor and show accuracy, a winning combo
- **Kakashi Hatake 40cm (Banpresto):** tall presence and great posing
- **Kratos (NECA):** a cheap entry point into God of War
- **Geralt (McFarlane):** silver and steel swords; an all-time gamer favorite
- **Bayek 32cm (Ubisoft):** collector-grade with eagle weapon detail
- **Altair (McFarlane):** the timeless Assassin's Creed classic
- **Aya (Ubisoft):** ancient Egypt outfit with a hidden blade
- **Spider-Man Miles (Marvel Legends):** loved by the new generation
- **Darth Vader (Kaidoyo):** one of cinema's most iconic villains

## Why buy now?
Logical reasons to buy early:

1. First-run stock is limited
2. Prices of popular figures usually go up
3. Classic versions resell for higher prices later

> In the figure world, waiting always costs more than buying early.

## Wrap up
If your budget allows, grab the popular releases early — you won't regret it next year.`,
      ar: `في كل عام تطلق العلامات فيجورات جديدة، لكن بعضها يصبح نادرًا وغاليًا خلال أشهر. تغطي هذه القائمة الفيجورات التي تستحق الشراء المبكر في 2026.

## أفضل الاختيارات لعام 2026
- **بيبي يودا الروبوتي (هاسبرو):** نسختا 25 و40 مؤثرًا تزدادان حرارة كل عام
- **الماندلوري والطفل (هاسبرو):** درع البيسكار والدقة من المسلسل
- **كاكاشي هاتاكي 40 سم (بانبريستو):** حضور طويل ووضعيات رائعة
- **كراتوس (NECA):** نقطة دخول رخيصة لعالم غود أوف وور
- **جيرالت (McFarlane):** سيفا الفضة والفولاذ؛ مفضل دائم لدى اللاعبين
- **بايك 32 سم (يوبيسوفت):** بجودة جامعية وتفاصيل سلاح النسر
- **ألتير (McFarlane):** كلاسيكية أساسنز كريد الخالدة
- **آيا (يوبيسوفت):** زي مصر القديمة مع نصل خفي
- **سبايدرمان مايلز (مارفل ليجندز):** محبوب الجيل الجديد
- **دارث فيدر (Kaidoyo):** أحد أشهر الأشرار في تاريخ السينما

## لماذا تشتري الآن؟
أسباب منطقية للشراء المبكر:

1. كمية الإصدار الأول محدودة
2. أسعار الفيجورات الشعبية ترتفع عادة
3. النسخ الكلاسيكية تُباع لاحقًا بأسعار أعلى

> في عالم الفيجورات، الانتظار يكلف أكثر من الشراء المبكر.

## الخلاصة
إذا سمحت ميزانيتك، اقتنِ الإصدارات الشعبية مبكرًا — لن تندم العام المقبل.`,
    },
  },
  {
    slug: "new-anime-figures-preorder",
    category: "news",
    published: false,
    readingTime: 5,
    daysAgo: 0,
    createdDaysAgo: 10,
    title: {
      fa: "فیگورهای جدید انیمه در راه‌اند؛ پیش‌سفارش چطور کار می‌کند؟",
      en: "New Anime Figures Are Coming: How Does Preorder Work?",
      ar: "فيجورات أنمي جديدة قادمة: كيف يعمل الطلب المسبق؟",
    },
    tag: { fa: "اخبار", en: "News", ar: "أخبار" },
    excerpt: {
      fa: "با پیش‌سفارش، فیگورهای محبوب را قبل از تمام شدن رزرو کن و با خیال راحت منتظر بمان.",
      en: "With preorder you can reserve popular figures before they sell out and wait worry-free.",
      ar: "مع الطلب المسبق يمكنك حجز الفيجورات الشهيرة قبل نفادها والانتظار بلا قلق.",
    },
    body: {
      fa: `هر فصل برندها فیگورهای جدیدی از انیمه‌های محبوب معرفی می‌کنند. سری‌هایی مثل ناروتو، وَن‌پیس و اویتاکو هر بار کلکسیونرها را هیجان‌زده می‌کنند. اما خیلی از این محصولات قبل از رسیدن به بازار، در پیش‌سفارش فروخته می‌شوند.

## پیش‌سفارش چیست؟
پیش‌سفارش یعنی خرید کالا قبل از تولید نهایی. تو مبلغ را می‌پردازی و محصول در موعد اعلام‌شده تحویل می‌گیری. این روش مزایای زیادی دارد:

- **رزرو تضمینی** نسخه محدود
- **قیمت ثابت** حتی اگر بعداً گران شود
- **رسیدن به دست اول؛** بدون واسطه و بدون تأخیر

## نکات مهم
قبل از پیش‌سفارش به این موارد توجه کن:

1. تاریخ تقریبی عرضه را چک کن
2. سیاست بازگشت و کنسلی را بخوان
3. مطمئن شو فروشگاه، ضمانت اصالت دارد
4. عکس‌های رسمی نمونه را با نسخه نهایی مقایسه کن

> پیش‌سفارش، «ریسک» را کاهش می‌دهد، نه اینکه حذف کند؛ پس شریک مطمئن انتخاب کن.

## در پایان
اگر عاشق انیمه هستی، پیش‌سفارش راهی مطمئن برای از دست ندادن فیگورهای موردعلاقه‌ات است.`,
      en: `Every season brands reveal new figures from popular anime. Series like Naruto, One Piece and Hokage keep exciting collectors every time. But many of these products sell out via preorder before hitting the market.

## What is preorder?
Preorder means buying before final production. You pay the amount and receive the product on the announced date. It has many benefits:

- **Guaranteed reservation** of a limited release
- **Fixed price** even if it goes up later
- **First-hand arrival;** no middlemen, no delay

## Important notes
Before preordering, pay attention to:

1. Check the estimated release date
2. Read the return and cancellation policy
3. Make sure the store offers an authenticity guarantee
4. Compare official prototype photos with the final version

> Preorder reduces "risk", it doesn't remove it — so pick a reliable partner.

## Finally
If you love anime, preorder is a safe way not to miss your favorite figures.`,
      ar: `في كل موسم تكشف العلامات عن فيجورات جديدة من الأنمي الشهير. سلاسل مثل ناروتو وون بيس وأوتاكو تُثير الحماس دائمًا. لكن الكثير من هذه المنتجات يُباع عبر الطلب المسبق قبل الوصول إلى السوق.

## ما هو الطلب المسبق؟
الطلب المسبق يعني الشراء قبل الإنتاج النهائي. تدفع المبلغ وتستلم المنتج في الموعد المعلن. له فوائد عديدة:

- **حجز مضمون** لإصدار محدود
- **سعر ثابت** حتى لو ارتفع لاحقًا
- **وصول مباشر؛** بدون وسطاء وتأخير

## ملاحظات مهمة
قبل الطلب المسبق انتبه لما يلي:

1. تحقق من تاريخ الإطلاق التقريبي
2. اقرأ سياسة الإرجاع والإلغاء
3. تأكد أن المتجر يقدم ضمان الأصالة
4. قارن صور النموذج الرسمية بالنسخة النهائية

> الطلب المسبق يقلل «المخاطرة» ولا يلغيها — فاختر شريكًا موثوقًا.

## أخيرًا
إذا كنت تحب الأنمي، فالطلب المسبق وسيلة آمنة لعدم تفويت فيجوراتك المفضلة.`,
    },
  },
  {
    slug: "original-vs-knockoff",
    category: "guide",
    published: false,
    readingTime: 6,
    daysAgo: 0,
    createdDaysAgo: 8,
    title: {
      fa: "تفاوت فیگور اورجینال و کپی (نک) را چگونه تشخیص دهیم؟",
      en: "How to Tell Original Figures from Knockoffs",
      ar: "كيف تميّز الفيجور الأصلي عن المقلد؟",
    },
    tag: { fa: "راهنما", en: "Guide", ar: "دليل" },
    excerpt: {
      fa: "جعبه، بسته‌بندی، رنگ و جزئیات؛ نشانه‌هایی که تقلبی بودن فیگور را لو می‌دهند.",
      en: "Box, packaging, paint and details — the signs that reveal a fake figure.",
      ar: "الصندوق والتغليف والطلاء والتفاصيل — العلامات التي تكشف الفيجور المزيف.",
    },
    body: {
      fa: `بازار فیگور کپی (نک) پر از محصولات کم‌کیفیتی است که شبیه نسخه اصلی‌اند. تشخیص اصل از کپی با چند بررسی ساده ممکن است، به‌شرطی که بدانی به کجا نگاه کنی.

## نشانه‌های ظاهری
- **جعبه و لیبل:** چاپ کدر، رنگ‌های محو و اشتباه تایپی یعنی هشدار
- **هولوگرام و بارکد:** نسخه اصل بارکد و هولوگرام تمیز و خوانا دارد
- **رنگ و جزئیات:** کپی‌ها معمولاً رنگ‌های غلط و خطوط نامنظم دارند
- **مفاصل و قطعات:** قطعات شل، ترک‌دار یا نامتقارن نشانه تقلبی است

## بررسی‌های دقیق‌تر
1. عکس‌های رسمی محصول را با کالا مقایسه کن
2. بوی پلاستیک تند و نامطبوع را جدی بگیر
3. قیمت فوق‌العاده پایین را زیر سؤال ببر؛ هیچ‌کس ضرر نمی‌کند
4. از فروشنده گارانتی و فاکتور معتبر بخواه

> اگر قیمت «بیش از حد خوب» باشد، معمولاً حقه است.

## چرا اورجینال بخریم؟
- دوام و کیفیت ساخت به‌مراتب بهتر
- حفظ ارزش کلکسیون برای فروش بعدی
- حمایت از برند و تولیدکننده‌های واقعی

## جمع‌بندی
چند دقیقه بررسی دقیق، تو را از یک خرید اشتباه و خرج دور ریختنی نجات می‌دهد.`,
      en: `The knockoff figure market is full of low-quality products that look like the real thing. Telling original from fake is possible with a few simple checks — as long as you know where to look.

## Visual signs
- **Box and label:** dull print, faded colors and typos are a warning
- **Hologram and barcode:** the original has clean, readable barcodes and holograms
- **Paint and details:** fakes usually have wrong colors and uneven lines
- **Joints and parts:** loose, cracked or asymmetric parts point to a fake

## Deeper checks
1. Compare official product photos with the item
2. Take a strong, unpleasant plastic smell seriously
3. Question extremely low prices — nobody sells at a loss
4. Ask the seller for a guarantee and a valid invoice

> If the price looks "too good", it usually is.

## Why buy original?
- Much better durability and build quality
- Your collection keeps its resale value
- You support the real brand and makers

## Wrap up
A few minutes of careful checking save you from a wrong purchase and wasted money.`,
      ar: `سوق الفيجورات المقلدة مليء بمنتجات منخفضة الجودة تشبه الأصل. التمييز بين الأصل والمزيف ممكن ببعض الفحوصات البسيطة — طالما تعرف أين تنظر.

## العلامات البصرية
- **الصندوق والملصق:** الطباعة الباهتة والألوان الضعيفة والأخطاء الإملائية تحذير
- **الهولوغرام والباركود:** الأصل يحتوي باركود وهولوغرام نظيفين وواضحين
- **الطلاء والتفاصيل:** المقلد عادة بألوان خاطئة وخطوط غير متساوية
- **المفاصل والقطع:** القطع المرتخية أو المتشققة أو غير المتناظرة تشير إلى التقليد

## فحوصات أعمق
1. قارن صور المنتج الرسمية بالقطعة
2. خذ رائحة البلاستيك النفاذة على محمل الجد
3. شكك في الأسعار المنخفضة جدًا — لا أحد يبيع بخسارة
4. اطلب من البائع ضمانًا وفاتورة موثوقة

> إذا كان السعر «جيدًا جدًا»، فهو كذلك غالبًا.

## لماذا تشتري الأصلي؟
- متانة وجودة بناء أفضل بكثير
- تحافظ مجموعتك على قيمتها عند إعادة البيع
- تدعم العلامة والمصنعين الحقيقيين

## الخلاصة
بضع دقائق من الفحص الدقيق تنقذك من شراء خاطئ ومال ضائع.`,
    },
  },
  {
    slug: "figure-care-guide",
    category: "guide",
    published: false,
    readingTime: 5,
    daysAgo: 0,
    createdDaysAgo: 6,
    title: {
      fa: "راهنمای نگهداری فیگور؛ گردگیری، نور و رطوبت",
      en: "Figure Care Guide: Dusting, Light and Humidity",
      ar: "دليل العناية بالفيجورات: الغبار والضوء والرطوبة",
    },
    tag: { fa: "راهنما", en: "Guide", ar: "دليل" },
    excerpt: {
      fa: "با چند عادت ساده، فیگورهایت را سال‌ها مثل روز اول نو نگه دار.",
      en: "Keep your figures like new for years with a few simple habits.",
      ar: "حافظ على فيجوراتك كالجديدة لسنوات ببعض العادات البسيطة.",
    },
    body: {
      fa: `فیگورها سرمایه و خاطره‌اند؛ مراقبت درست از آن‌ها سخت نیست، فقط نیاز به چند عادت ساده دارد. در این راهنما سه عامل اصلی را بررسی می‌کنیم.

## گردگیری
- از برس نرم، جاروی مو و یا قلم مو با الیاف ظریف استفاده کن
- پارچه میکروفایبر خشک برای سطوح صاف عالی است
- از اسپری‌های شیمیایی مستقیم روی فیگور بپرهیز

## نور و گرما
- اشعه مستقیم خورشید باعث زرد شدن و رنگ‌پریدگی می‌شود؛ فیگور را دور از پنجره بگذار
- گرمای زیاد مفاصل را خشک و شکننده می‌کند
- نور ال‌ای‌دی با حرارت پایین انتخاب بهتری است

## رطوبت
- رطوبت بالا باعث کپک و لکه روی پلاستیک می‌شود
- رطوبت خیلی کم هم شکنندگی را بالا می‌برد
- محدوده رطوبت ایده‌آل ۴۰ تا ۶۰ درصد است

> یک ویترین شیشه‌ای، بهترین محافظ فیگور توست.

## چک‌لیست ماهانه
1. گردگیری ملایم با برس نرم
2. بررسی مفاصل برای ترک یا شل شدن
3. جابه‌جایی فیگور و بازنشینی موقعیت نمایش
4. کنترل رطوبت و نور محیط

## سخن آخر
مراقبت منظم، ارزش و زیبایی کلکسیونت را برای سال‌ها حفظ می‌کند.`,
      en: `Figures are investments and memories; caring for them isn't hard, just a few simple habits. In this guide we cover the three main factors.

## Dusting
- Use a soft brush, static duster or fine-bristle brush
- Dry microfiber cloth is great for flat surfaces
- Avoid spraying chemicals directly on the figure

## Light and heat
- Direct sunlight causes yellowing and fading; keep figures away from windows
- Excessive heat dries out and weakens joints
- Low-heat LED lighting is a better choice

## Humidity
- High humidity causes mold and stains on plastic
- Very low humidity increases brittleness
- The ideal range is 40 to 60 percent

> A glass display case is your figure's best protector.

## Monthly checklist
1. Gentle dusting with a soft brush
2. Inspect joints for cracks or loosening
3. Reposition figures and refresh the display
4. Check humidity and ambient light

## Final word
Regular care keeps your collection's value and beauty for years.`,
      ar: `الفيجورات استثمارات وذكريات؛ العناية بها ليست صعبة، بل مجرد عادات بسيطة. في هذا الدليل نغطي العوامل الثلاثة الرئيسية.

## الغبار
- استخدم فرشاة ناعمة أو مكنسة ساكنة أو فرشاة شعر رفيعة
- قطعة قماش ميكروفايبر جافة ممتازة للأسطح المستوية
- تجنب رش المواد الكيميائية مباشرة على الفيجور

## الضوء والحرارة
- أشعة الشمس المباشرة تسبب الاصفرار والبهتان؛ أبقِ الفيجورات بعيدًا عن النوافذ
- الحرارة الزائدة تجفف المفاصل وتضعفها
- إضاءة LED منخفضة الحرارة خيار أفضل

## الرطوبة
- الرطوبة العالية تسبب العفن والبقع على البلاستيك
- الرطوبة المنخفضة جدًا تزيد الهشاشة
- النطاق المثالي بين 40 و60 بالمئة

> خزانة العرض الزجاجية أفضل حامٍ لفيجورك.

## قائمة شهرية
1. تنظيف لطيف بفرشاة ناعمة
2. فحص المفاصل بحثًا عن تشققات أو ارتخاء
3. إعادة تموضع الفيجورات وتحديث العرض
4. فحص الرطوبة والإضاءة المحيطة

## ختامًا
العناية المنتظمة تحافظ على قيمة وجمال مجموعتك لسنوات.`,
    },
  },
  {
    slug: "theme-collections-ideas",
    category: "ideas",
    published: false,
    readingTime: 5,
    daysAgo: 0,
    createdDaysAgo: 4,
    title: {
      fa: "کلکسیون‌های تم؛ ایده‌های جذاب برای شروع",
      en: "Theme Collections: Fun Ideas to Get Started",
      ar: "مجموعات الثيمات: أفكار ممتعة للبداية",
    },
    tag: { fa: "ایده", en: "Ideas", ar: "أفكار" },
    excerpt: {
      fa: "با یک تم خوب، کلکسیون‌ات هویت پیدا می‌کند و روایت جذابی برای نمایش دارد.",
      en: "A good theme gives your collection identity and a story worth showing.",
      ar: "الثيم الجيد يمنح مجموعتك هوية وقصة تستحق العرض.",
    },
    body: {
      fa: `یک کلکسیون بی‌تم، «مجموعه اشیاء» است؛ یک کلکسیون تم‌دار، «یک داستان» است. انتخاب تم نه‌تنها خرید را هدفمند می‌کند، بلکه قفسه‌ات را هم روایت‌محور می‌کند.

## ایده‌های تم
- **تم ضدقهرمان‌ها:** ونوم، دارث ویدر و هانیبال؛ تاریک‌های محبوب
- **تم خانواده دیزنی:** وال-ای، سالیوان و تنتن؛ دلنشین و خاطره‌انگیز
- **تم نبرد تایتان‌ها:** گودزیلا، کونگ و کریتوس؛ حماسی و قدرتمند
- **تم نینجا و افسانه:** کاکاشی، بایک و آلتایر؛ ترکیب مشرق‌زمین و باستان
- **تم سفر قهرمان:** گرالت، جان ویک و اسپایدرمن؛ قهرمان‌های مسیر سخت

## ایده‌های خلاقانه
1. برای هر تم یک «قطعه کانونی» بزرگ انتخاب کن و بقیه دورش بچینند
2. یک متن کوتاه مخصوص تم روی یک پلاک کوچک بنویس
3. رنگ قفسه را با حال‌وهوای تم هماهنگ کن

> تم خوب، حتی یک فیگور ساده را هم خاص نشان می‌دهد.

## چطور شروع کنم؟
- از یک تم که شخصیت‌هایش را دوست داری شروع کن
- اول ۳ تا ۵ فیگور اصلی را جمع کن
- بعد سراغ نسخه‌های کمیاب و مکمل برو

## جمع‌بندی
تم انتخاب کن، هدفمند بخر و از داستانی که قفسه‌ات تعریف می‌کند لذت ببر.`,
      en: `A collection without a theme is a "set of objects"; a themed collection is "a story". Choosing a theme makes buying purposeful and turns your shelf into a narrative.

## Theme ideas
- **Anti-heroes:** Venom, Darth Vader and Hannibal; the beloved dark side
- **Disney family:** WALL-E, Sulley and Tintin; warm and nostalgic
- **Battle of titans:** Godzilla, Kong and Kratos; epic and powerful
- **Ninjas and legends:** Kakashi, Bayek and Altair; East meets ancient
- **Hero's journey:** Geralt, John Wick and Spider-Man; heroes of hard paths

## Creative ideas
1. Pick one large "centerpiece" per theme and arrange the rest around it
2. Write a short theme caption on a small plaque
3. Match the shelf color to the theme's mood

> A good theme makes even a simple figure look special.

## How to start?
- Begin with a theme whose characters you love
- First collect 3 to 5 main figures
- Then move on to rare and complementary versions

## Wrap up
Pick a theme, buy with purpose and enjoy the story your shelf tells.`,
      ar: `مجموعة بلا ثيم هي «مجموعة أشياء»؛ والمجموعة ذات الثيم هي «قصة». اختيار الثيم يجعل الشراء هادفًا ويحوّل رفك إلى حكاية.

## أفكار للثيمات
- **مضادو الأبطال:** فينوم ودارث فيدر وهانيبال؛ الجانب المظلم المحبوب
- **عائلة ديزني:** وال-إي وسولي وتان تان؛ دافئ وحنين
- **معركة العمالقة:** جودزيلا وكونغ وكراتوس؛ ملحمي وقوي
- **النينجا والأساطير:** كاكاشي وبايك وألتير؛ الشرق يلتقي القديم
- **رحلة البطل:** جيرالت وجون ويك وسبايدرمان؛ أبطال الطرق الصعبة

## أفكار إبداعية
1. اختر «قطعة مركزية» كبيرة لكل ثيم ورتب البقية حولها
2. اكتب جملة قصيرة عن الثيم على لوحة صغيرة
3. وازن لون الرف مع مزاج الثيم

> الثيم الجيد يجعل حتى الفيجور البسيط مميزًا.

## كيف أبدأ؟
- ابدأ بثيم تحب شخصياته
- اجمع أولًا من 3 إلى 5 فيجورات رئيسية
- ثم انتقل إلى النسخ النادرة والمكملة

## الخلاصة
اختر ثيمًا، واشترِ بهدف، واستمتع بالقصة التي يرويها رفك.`,
    },
  },
];

module.exports = { BLOG_POSTS };
