import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const articles = [
  {
    slug: "web-paint-resin-miniatures-wash-highlight",
    coverImage: "https://resinandrolls.com/images/hero-how-to-paint-3d-printed-resin-miniatures.jpg",
    category: "painting",
    readingTime: 8,
    publishedAt: new Date("2026-08-20"),
    sourceType: "RSS",
    sourceUrl: "https://resinandrolls.com/guides/how-to-paint-3d-printed-resin-miniatures/",
    sourceAuthor: "Resin & Rolls",
    sourceSiteName: "Resin & Rolls",
    en: {
      tag: "Painting",
      title: "How to Paint 3D Printed Resin Miniatures: From Wash to Highlight",
      excerpt: "A step-by-step painting guide built specifically for 3D printed resin miniatures, covering surface prep, primer, basecoat, wash, and highlight for beginners.",
      body: `## What You Need

- 2-4 basecoat colors (blacks, browns, mid-tones)
- 1-2 wash/shade paints (Citadel Nuln Oil, Army Painter Dark Tone, Vallejo Smoke)
- 2-3 highlight colors (lighter versions of your basecoats)
- Miniature primer (spray or brush-on)
- Flush cutters and needle files for support cleanup

## Step 1: Surface Prep

Wash the model. Soak in soapy water (a few drops of dish soap in warm water) for 5-10 minutes. This removes any mold release residue and leftover IPA from the wash step. Rinse clean and let dry completely.

## Step 2: Primer

Apply primer in a thin, even coat. You want coverage without filling in the detail.

**Color of primer:**

- **Black primer:** Natural shading because recesses stay dark. Good for dark-themed models.
- **Grey primer:** Neutral base, easiest to work from, shows detail well. Best starting choice.
- **White primer:** Best under bright colors (yellows, reds, light skin tones). Less forgiving.

## Step 3: Basecoat

The basecoat establishes the primary colors of the model. Paints should be the consistency of whole milk. **Two thin coats, not one thick one.** This applies to almost everything in miniature painting.

## Step 4: Washing (Where the Magic Happens)

A wash is a thin, low-viscosity paint that flows into recesses and deepens shadows automatically. Load a large brush (size 2 or bigger) and flow the wash over an entire section. Don't scrub it in. Let it settle.

## Step 5: Layering and Highlighting

Drybrushing: load a brush with paint, remove almost all of it on a paper towel, and lightly drag the near-dry brush across the model's surface. The tiny amount of remaining paint catches on raised edges and textures.

For **layering**, apply progressively lighter paints in successively smaller areas, working from the basecoat up to bright highlights.

## Step 6: Details

Metals: drybrush with Citadel Leadbelcher over a dark basecoat, wash with Nuln Oil, then edge highlight with a silver on prominent edges.

## Step 7: Basing

Apply texture paste or sand and static grass. Let dry. Drybrush lightly with a light grey or stone color.

## Step 8: Varnishing

Matte varnish is standard for most miniatures. It kills any gloss from the washes and gives a natural finish.

## Painting Workflow Summary

1. Clean support marks, wash model in soapy water, dry completely
2. Apply primer (grey recommended for beginners)
3. Basecoat all major areas in flat color (two thin coats)
4. Apply wash/shade to each section; let fully dry
5. Drybrush or layer highlights back onto raised surfaces
6. Paint details (eyes, metals, leather)
7. Base the miniature
8. Varnish to protect`,
    },
    fa: {
      tag: "نقاشی",
      title: "نحوه رنگ‌آمیزی مینیاتورهای رزینی چاپ سه‌بعدی: از شستشو تا هایلایت",
      excerpt: "راهنمای گام‌به‌گام رنگ‌آمیزی مینیاتورهای رزینی چاپ سه‌بعدی، شامل آماده‌سازی سطح، پرایمر، رنگ پایه، واش و هایلایت برای مبتدیان.",
      body: `## چه چیزهایی نیاز دارید

- ۲ تا ۴ رنگ پایه (مشکی، قهوه‌ای، رنگ‌های میانه)
- ۱ تا ۲ رنگ واش (Citadel Nuln Oil, Army Painter Dark Tone)
- ۲ تا ۳ رنگ هایلایت (نسخه‌های روشن‌تر رنگ‌های پایه)
- پرایمر مینیاتور (اسپری یا قلممو)
- ابزارهای تمیزکاری ساپورت‌ها

## مرحله ۱: آماده‌سازی سطح

مدل را بشویید. آن را به مدت ۵ تا ۱۰ دقیقه در آب صابونی خیس کنید. این کار باقی‌مانده مواد قالب‌گیری و الکل ایزوپروپیل را از بین می‌برد. خوب بشویید و کاملاً خشک کنید.

## مرحله ۲: پرایمر

پرایمر را به صورت لایه‌ای نازک و یکنواخت اعمال کنید. پوشش کافی بدون پر کردن جزئیات.

**رنگ پرایمر:**

- **پرایمر مشکی:** سایه طبیعی ایجاد می‌کند چون فرورفتگی‌ها تاریک می‌مانند.
- **پرایمر خاکستری:** پایه خنثی، بهترین انتخاب برای شروع.
- **پرایمر سفید:** بهترین برای رنگ‌های روشن. کمتر بخشش‌پذیر است.

## مرحله ۳: رنگ پایه

رنگ پایه رنگ‌های اصلی مدل را مشخص می‌کند. غلظت رنگ باید مانند شیر باشد. **دو لایه نازک، نه یک لایه ضخیم.** این قانون تقریباً در تمام رنگ‌آمیزی مینیاتور صدق می‌کند.

## مرحله ۴: واش (جایی که جادو اتفاق می‌افتد)

واش رنگ رقیقی است که به طور خودکار در فرورفتگی‌ها جمع شده و سایه‌ها را عمیق‌تر می‌کند. قلمموی بزرگ (سایز ۲ یا بزرگتر) را خیس کنید و روی کل بخش اعمال کنید. نمالید. بگذارید خودش جا بیفتد.

## مرحله ۵: لایه‌گذاری و هایلایت

درای‌براشینگ: قلممو را به رنگ آغشته کنید، تقریباً تمام آن را روی حوله کاغذی پاک کنید و به آرامی روی سطح مدل بکشید.

برای **لایه‌گذاری**، رنگ‌های روشن‌تر را به تدریج در نواحی کوچک‌تر اعمال کنید.

## مرحله ۶: جزئیات

فلزات: با Citadel Leadbelcher درای‌براش کنید، با Nuln Oil واش بزنید و هایلایت لبه‌ها را با نقره‌ای اعمال کنید.

## مرحله ۷: پایه

خمیر بافت یا شن و چمن استاتیک اعمال کنید. با رنگ خاکستری روشن درای‌براش کنید.

## مرحله ۸: وارنیش

ورنیش مات استاندارد اکثر مینیاتورهاست. برق واش‌ها را از بین می‌برد و پایان طبیعی می‌دهد.

## خلاصه فرآیند رنگ‌آمیزی

1. تمیز کردن علائم ساپورت، شستشو در آب صابونی، خشک کردن کامل
2. اعمال پرایمر (خاکستری برای مبتدیان توصیه می‌شود)
3. رنگ پایه تمام بخش‌ها (دو لایه نازک)
4. اعمال واش روی هر بخش
5. درای‌براش یا لایه‌گذاری هایلایت‌ها
6. رنگ‌آمیزی جزئیات (چشم‌ها، فلزات، چرم)
7. پایه‌گذاری مینیاتور
8. وارنیش برای محافظت`,
    },
    ar: {
      tag: "الرسوم",
      title: "كيفية تلوين Минياتورات الرزين المطبوعة ثلاثي الأبعاد: من الغسيل إلى التلوين",
      excerpt: "دليل خطوة بخطوة لتلوين مينياتورات الرزين المطبوعة ثلاثي الأبعاد، يشمل تحضير السطح، البرايمير، طبقة الأساس، والغسيل للمبتدئين.",
      body: `## ما تحتاجه

- 2-4 ألوان أساسية (أسود، بني، ألوان متوسطة)
- 1-2 لون غسيل/تعتيم (Citadel Nuln Oil, Army Painter Dark Tone)
- 2-3 ألوان تمييز (نسخ أفتح من ألوانك الأساسية)
- برايمير مينياتور (رذاذ أو فرشاة)

## الخطوة 1: تحضير السطح

اغسل النموذج. انقعه في ماءصابوني (بضع قطرات من صابون الأطباق في ماء دافئ) لمدة 5-10 دقائق. اشطفه نظيفاً واتركه يجف تماماً.

## الخطوة 2: البرايمير

ضع طبقة رقيقة ومتساوية من البرايمير. تريد تغطية دون ملء التفاصيل.

**لون البرايمير:**

- **أسود:** ظلال طبيعية لأن المنخفضات تبقى مظلمة.
- **رمادي:** قاعدة محايدة، سهل العمل عليها. أفضل خيار للمبتدئين.
- **أبيض:** الأفضل تحت الألوان الزاهية. أقل تسامحاً مع الأخطاء.

## الخطوة 3: طبقة الأساس

طبقة الأساس تحدد الألوان الرئيسية للنموذج. يجب أن يكون قوام الطلاء كcompose القهوة. **طبقتان رخيستان وليس سميكة واحدة.**

## الخطوة 4: الغسيل (حيث يحدث السحر)

الغسيل هو طلاء رقيق يتدفق إلى المنخفضات ويعمق الظلال تلقائياً. استخدم فرشاة كبيرة (مقاس 2 أو أكبر) وافردها على القسم بالكامل.

## الخطوة 5: التدرّج والتمييز

الفرك الجاف: احمِ الفرشاة بالطلاء، امسح معظمها على منديل ورقي، واسحبها برفق على سطح النموذج.

## الخطوة 6: التفاصيل

الألوان المعدنية: افركها بالـ Citadel Leadbelcher فوق طبقة أساس داكنة، اغسلها بالـ Nuln Oil.

## الخطوة 7: القاعدة

ضع عجينة ملمس أو رمل وعشب استاتيكي. افركها بلون رمادي فاتح.

## الخطوة 8: الطلاء الخارجي

الطلاء المطفي هو المعيار لمعظم المينياتورات. يزيل لمعان الغسيل ويمنح نهائة طبيعية.

## ملخص عملية التلوين

1. تنظيف علامات الدعامة، الغسل في ماءصابوني، التجفيف
2. وضع البرايمير
3. طبقة الأساس
4. تطبيق الغسيل
5. الفرك الجاف أو التدرّج
6. تلوين التفاصيل
7. تأسيس المينياتور
8. الطلاء الخارجي للحماية`,
    },
  },
  {
    slug: "web-start-anime-figure-collection-beginners",
    coverImage: "https://im-a-collector.com/wp-content/uploads/2025/08/imacollector-blog-commencer-collection-cover-OK.jpg",
    category: "collecting",
    readingTime: 7,
    publishedAt: new Date("2026-08-19"),
    sourceType: "RSS",
    sourceUrl: "https://im-a-collector.com/en/collecting-differently/how-to-start-an-anime-figure-collection-beginners-guide/",
    sourceAuthor: "imacollector",
    sourceSiteName: "imacollector",
    en: {
      tag: "Collecting",
      title: "How to Start an Anime Figure Collection: The Beginner's Guide That Actually Helps",
      excerpt: "Starting an anime figure collection gets expensive fast if you buy without a plan. This guide helps you choose the right figure lines, set a realistic budget, and avoid the beginner mistakes.",
      body: `## Define Your Collecting Focus Before You Buy

Before looking at prices, ask yourself: what do you actually want to collect? Choosing a focus means giving yourself a guiding line. That line will shape everything else in your collection: your budget, your space, and your long-term satisfaction.

## Understanding the Main Figure Categories

### Prize Figures (Banpresto, SEGA, FuRyu)

Their main strength is accessibility. They are usually not very expensive, easier to find, and make it possible to discover a license or character without a heavy financial commitment.

### Scale Figures (Good Smile Company, Kotobukiya, Alter)

Scale figures usually belong to a much more ambitious segment. They offer better sculpt quality, better paintwork, stronger visual presence and a far more refined overall finish. One well-chosen scale can sometimes be enough to establish a collection.

### Nendoroid (Good Smile Company)

Their chibi format, interchangeable faces, accessories and modular nature make them especially popular. If you like compact, expressive pieces that are easy to display, they suit you very well.

## Setting a Realistic Budget

Your budget is there to stop you from building an unstable collection. Look at the bigger picture: the price, shipping, import fees, and display costs.

Set yourself a monthly or quarterly budget. Keep some room for the unexpected. Do not let fear of missing a piece dictate your choices.

## Buying From the Right Places

You can find a piece at an attractive price and still end up with a questionable seller or counterfeit. Specialized stores, Japanese platforms, and second-hand channels each have their advantages.

## Avoiding Beginner Mistakes

The first mistake is wanting to collect everything at once. The second is buying too quickly. Take your time, think, and weigh the pros and cons.

## Protecting and Displaying Your Collection

A figure that is poorly displayed can lose quality faster than you imagine. Dust, direct light, excessive heat, and humidity can all leave their marks.

- Avoid direct sunlight
- Limit exposure to dust
- Check the stability of your pieces
- Do not overcrowd your figures
- Keep the boxes if useful for storage or transport

## Going Further

Collecting well is not about piling things up. It is about building a coherent whole that reflects you. What you need is a clear focus, a realistic budget, and a little patience.`,
    },
    fa: {
      tag: "کلکسیون",
      title: "شروع کلکسیون فیگورهای انیمه: راهنمای مبتدیان که واقعاً کمک می‌کند",
      excerpt: "شروع کلکسیون فیگورهای انیمه بدون برنامه خیلی سریع گران می‌شود. این راهنما به شما کمک می‌کند خط فیگور مناسب، بودجه واقع‌بینانه و اشتباهات رایج مبتدیان را بشناسید.",
      body: `## قبل از خرید، تمرکز کلکسیون خود را مشخص کنید

قبل از نگاه کردن به قیمت‌ها، از خودتان بپرسید: واقعاً چه چیزی می‌خواهید جمع کنید؟ انتخاب تمرکز به شما یک خط راهنما می‌دهد. این خط، همه چیز را در کلکسیون شکل می‌دهد: بودجه، فضا و رضایت بلندمدت.

## آشنایی با دسته‌بندی‌های اصلی فیگورها

### فیگورهای پرایز (Banpresto, SEGA, FuRyu)

مزیت اصلی آن‌ها دسترسی آسان است. معمولاً گران نیستند، راحت‌تر پیدا می‌شوند و امکان کشف یک لایسنس یا شخصیت بدون تعهد مالی سنگین را فراهم می‌کنند.

### فیگورهای اسکیل (Good Smile Company, Kotobukiya, Alter)

فیگورهای اسکیل معمولاً در سطح بسیار بالاتری قرار دارند. کیفیت مجسمه‌سازی بهتر، رنگ‌آمیزی بهتر، حضور بصری قوی‌تر و پایان بسیار ظریف‌تری ارائه می‌دهند.

### نندوریوید (Good Smile Company)

فرمت چیبی، صورت‌های قابل تعویض، لوازم جانبی و ماهیت ماژولار آن‌ها را بسیار محبوب کرده است. اگر قطعات فشرده و بیانگر می‌خواهید، انتخاب عالی‌ای هستند.

## تنظیم بودجه واقع‌بینانه

بودجه شما برای جلوگیری از کلکسیون ناپایدار است. به تصویر کلی نگاه کنید: قیمت، حمل‌ونقل، هزینه‌های واردات و هزینه‌های نمایش.

## خرید از فروشگاه‌های مناسب

می‌توانید فیگوری با قیمت جذاب پیدا کنید اما فروشنده مشکوک یا تقلبی داشته باشید.

## اجتناب از اشتباهات مبتدیان

اولین اشتباه می‌خواهد همه چیز را یکجا جمع کنید. دومی خیلی سریع خرید کردن. صبر کنید و مزایا و معایب را بسنجید.

## محافظت و نمایش کلکسیون

فیگوری که نادرست نمایش داده شود سریع‌تر از آنچه تصور می‌کنید کیفیتش را از دست می‌دهد. گرد و غبار، نور مستقیم، گرمای بیش از حد و رطوبت همگی اثر می‌گذارند.

- از نور مستقیم خورشید اجتناب کنید
- قرار گرفتن در معرض گرد و غبار را محدود کنید
- ثبات فیگورها را بررسی کنید
- فیگورها را شلوغ نکنید

## ادامه مسیر

کلکسیون خوب جمع کردن انباشتن چیزها نیست. ساختن مجموعه‌ای منسجم است که شما را بازتاب دهد. آنچه نیاز دارید تمرکز واضح، بودجه واقع‌بینانه و کمی صبر است.`,
    },
    ar: {
      tag: "الجمع",
      title: "كيفية بدء مجموعة تماثيل الأنمي: الدليل للمبتدئين الذي يساعد فعلاً",
      excerpt: "بدء مجموعة تماثيل الأنمي بدون خطة يصبح مكلفاً بسرعة. هذا الدليل يساعدك في اختيار الخطوط المناسبة والميزانية الواقعية وتجنب أخطاء المبتدئين.",
      body: `## حدد تركيز المجموعة قبل الشراء

قبل النظر إلى الأسعار، اسأل نفسك: ماذا تريد حقاً جمعه؟ اختيار التركيز يمنحك خطاً توجيهياً يشكّل كل شيء في مجموعتك.

## فهم الفئات الرئيسية للتماثيل

### تماثيل الجائزة (Banpresto, SEGA, FuRyu)

نقاط قوتها الرئيسية هي سهولة الوصول. عادة ما لا تكون مكلفة ويسهل العثور عليها.

### تماثيل المقياس (Good Smile Company, Kotobukiya, Alter)

تماثيل المقياس تنتمي إلى شريحة أكثر طموحاً. تقدم جودة نحت أفضل وطلاء أقوى.

### نندوريويد (Good Smile Company)

صيغة التشيباي والوجوه القابلة للتبديل تجعلها شائعة جداً.

## تحديد ميزانية واقعية

ميزانيتك تمنعك من بناء مجموعة غير مستقرة. انظر إلى الصورة الكاملة: السعر، الشحن، الرسوم الجمركية وتكاليف العرض.

## الشراء من الأماكن الصحيحة

يمكنك العثور على تمثال بسعر جذاب وتجد بائعاً مشكوكاً أو مقلداً.

## تجنب أخطاء المبتدئين

أول خطأ هو رغبة جمع كل شيء في آن واحد. الثاني هو الشراء السريع. خذ وقتك ووزن الإيجابيات والسلبيات.

## حماية وعرض المجموعة

تمثال معروض بشكل سيء يفقد جودته بسرعة أكبر مما تتخيل.

## المتابعة

جمع جيد هو بناء مجموعة منسجة تعكس أنت. ما تحتاجه هو تركيز واضح وميزانية واقعية وقلة من الصبر.`,
    },
  },
  {
    slug: "web-3d-printing-anime-gaming-figures-complete-guide",
    coverImage: "https://fbi.cults3d.com/uploaders/15112864/illustration-file/01753d67-534a-4941-8381-e0ff8089b338/Dan-Sopala-Flexi-Factory-Samurai_04.jpg",
    category: "printing",
    readingTime: 9,
    publishedAt: new Date("2026-08-18"),
    sourceType: "RSS",
    sourceUrl: "https://www.geekyinc.com/3d-printing-anime-gaming-folklore-figures/",
    sourceAuthor: "Geeky Inc",
    sourceSiteName: "Geeky Inc",
    en: {
      tag: "3D Printing",
      title: "The Complete Guide to 3D Printing Anime, Gaming & Folklore Figures (2026)",
      excerpt: "The 2026 master guide to 3D printing collectible-quality anime, gaming, and Japanese folklore figures — from picking your first printer to running your own launch.",
      body: `## Choosing Your First 3D Printer in 2026

**Bambu Lab A1 Mini ($300-350)**

The consensus best entry-level printer for figure work. It produces display-quality output out of the box, with optional multi-color via the AMS Lite.

**Elegoo Saturn 4 Ultra ($400) — Resin**

Resin printers use UV light to cure liquid resin layer by layer, producing detail that FDM simply cannot match at small scales. For anime figures with fine facial features and intricate armor details, resin is the gold standard.

## Printing Anime Figures: What Actually Works

Anime and folklore figures have specific challenges: thin hair strands, delicate clothing folds, complex color separations, and small facial features where a 0.1mm error is immediately visible.

**Layer height for detail:** 0.12mm or lower. For figure faces, hair, and fine clothing detail, drop to 0.12mm. For resin-level detail on FDM, push to 0.08mm.

**Orientation matters:** Angle the figure to minimize support marks on visible surfaces. Position the face upward so the supports attach to less visible areas.

**Hollow large figures:** This saves resin and reduces suction forces that cause print failures.

## Resin vs FDM

**Resin** produces finer detail at small scales — facial features, intricate hair, delicate armor. The tradeoff: you need ventilation, gloves, and a UV curing station.

**FDM** is cheaper to run, doesn't require ventilation or PPE, and approaches resin quality on figures 75mm and larger. Most studios run both.

## Essential Post-Processing

1. **Wash** in IPA (99%) for 5-10 minutes
2. **Cure** under UV light for 3-5 minutes per side
3. **Remove supports** with flush cutters
4. **Sand** with 400-800 grit sandpaper
5. **Prime** before painting

## Where to Find STL Files

- MyMiniFactory (curated, high quality)
- Cults3D (wide selection)
- Tribes (monthly subscription for new files)
- Printables (free community uploads)

## Tips for Beginners

- Start with pre-supported models
- Use water-washable resin for easier cleanup
- Print calibration tests before committing to large prints
- Keep your FEP film clean and replace regularly
- Document your settings for each resin brand`,
    },
    fa: {
      tag: "چاپ سه‌بعدی",
      title: "راهنمای جامع چاپ سه‌بعدی فیگورهای انیمه، گیمینگ و فولکلور (۲۰۲۶)",
      excerpt: "راهنمای جامع ۲۰۲۶ چاپ سه‌بعدی فیگورهای با کیفیت کلکسیونی انیمه، گیمینگ و فولکلور ژاپنی — از انتخاب اولین پرینتر تا راه‌اندازی کسب‌وکار.",
      body: `## انتخاب اولین پرینتر سه‌بعدی در ۲۰۲۶

**Bambu Lab A1 Mini (300-350 دلار)**

بهترین پرینتر سطح مبتدی برای کار فیگور. خروجی با کیفیت نمایشی از جعبه تولید می‌کند، با امکان رنگ‌های چندگانه از طریق AMS Lite.

**Elegoo Saturn 4 Ultra (400 دلار) — رزین**

پرینترهای رزین از نور UV برای سفت کردن رزین مایع لایه به لایه استفاده می‌کنند و جزئیاتی تولید می‌کنند که FDM در مقیاس‌های کوچک نمی‌تواند با آن رقابت کند.

## چاپ فیگورهای انیمه: چه چیزی واقعاً کار می‌کند

فیگورهای انیمه و فولکلور چالش‌های خاصی دارند: رشته‌های نازک مو، چین‌های ظریف لباس، و جزئیات صورت که خطای ۰.۱ میلیمتری بلافاصله قابل مشاهده است.

**ارتفاع لایه برای جزئیات:** ۰.۱۲ میلیمتر یا کمتر. برای چهره و مو، تا ۰.۱۲ کاهش دهید.

**جهت‌گیری مهم است:** فیگور را طوری زاویه دهید که علائم ساپورت در سطح قابل مشاهده کمتر شود.

**حفر فیگورهای بزرگ:** رزین را صرفه‌جویی می‌کند و نیروهای مکش را کاهش می‌دهد.

## رزین در مقابل FDM

**رزین** جزئیات ریزتر در مقیاس‌های کوچک تولید می‌کند. تبادل: تهویه، دستکش و ایستگاه UV مورد نیاز است.

**FDM** ارزان‌تر اجرا می‌شود و نیاز به تهویه ندارد و کیفیت رزین را در فیگورهای بزرگتر از ۷۵ میلیمتر تقریباً می‌رساند.

## پردازش پس از چاپ ضروری

1. **شستشو** در IPA (99%) به مدت 5-10 دقیقه
2. **سخت شدن** زیر نور UV به مدت 3-5 دقیقه در هر طرف
3. **حذف ساپورت‌ها** با برشگر
4. **سنباده** با 400-800
5. **پرایمر** قبل از نقاشی

## مکان‌های یافتن فایل‌های STL

- MyMiniFactory (کیفیت بالا)
- Cults3D (انتخاب گسترده)
- Tribes (اشتراک ماهانه)
- Printables (آپلودهای رایگان)

## نکات برای مبتدیان

- با مدل‌های ساپورت‌دار شروع کنید
- از رزین قابل شستشو با آب استفاده کنید
- تنظیمات خود را برای هر برند رزین مستند کنید`,
    },
    ar: {
      tag: "الطباعة ثلاثية الأبعاد",
      title: "الدليل الشامل لطباعة تماثيل الأنمي والألعاب والفلكلور ثلاثية الأبعاد (2026)",
      excerpt: "الدليل الشامل لعام 2026 لطباعة تماثيل أنمي وألعاب وفلكلور ياباني بجودة المجموعة — من اختيار أول طابعة إلى تشغيل مشروعك الخاص.",
      body: `## اختيار أول طابعة ثلاثية الأبعاد في 2026

**Bambu Lab A1 Mini (300-350 دولار)**

الإجماع على أفضل طابعة للمبتدئين لعمل التماثيل. تنتج مخرجات بجودة العرض من الصندوق.

**Elegoo Saturn 4 Ultra (400 دولار) — ريزين**

طابعات الريزين تستخدم ضوء الأشعة فوق البنفسجية لتشكيل الرزين السائل طبقة بطبقة، مما ينتج تفاصيل لا يمكن لـ FDM محاكاتها.

## طباعة تماثيل الأنمي: ما الذي يعمل فعلاً

تماثيل الأنمي لها تحديات محددة: خيوط الشعر الرقيقة، ثنيات الملابس الرقيقة، والتفاصيل الدقيقة للوجه.

**ارتفاع الطبقة للتفاصيل:** 0.12 مم أو أقل.

## الريزين مقابل FDM

**الريزين** ينتج تفاصيل أدق في المقاسات الصغيرة.

**FDM** أقل تكلفة ولا يحتاج تهوية.

## المعالجة ما بعد الطباعة

1. الغسل في IPA
2. التصلب تحت الأشعة فوق البنفسجية
3. إزالة الدعامات
4. الصنفرة
5. البرايمير قبل الطلاء

## نصائح للمبتدئين

- ابدأ بنماذج مدعومة
- استخدم رزين قابل للغسل بالماء
- وثّق إعداداتك لكل علامة تجارية`,
    },
  },
];

const LOCALES = ["fa", "en", "ar"];

async function main() {
  console.log("Seeding 3 web articles...\n");

  for (const article of articles) {
    const existing = await prisma.blogPost.findFirst({
      where: { sourceUrl: article.sourceUrl },
    });
    if (existing) {
      console.log(`⏭  Already exists: ${article.slug}`);
      continue;
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: article.slug,
        coverImage: article.coverImage,
        category: article.category,
        readingTime: article.readingTime,
        isPublished: true,
        isTrending: false,
        publishedAt: article.publishedAt,
        sourceType: "RSS",
        sourceUrl: article.sourceUrl,
        sourceAuthor: article.sourceAuthor,
        sourceSiteName: article.sourceSiteName,
        translations: {
          create: LOCALES.map((locale) => {
            const data = article[locale];
            return {
              locale,
              tag: data.tag,
              title: data.title,
              excerpt: data.excerpt,
              body: data.body,
            };
          }),
        },
      },
    });

    console.log(`✅ ${post.slug} (${post.id})`);
  }

  const count = await prisma.blogPost.count({ where: { sourceType: "RSS" } });
  console.log(`\nDone. Total RSS/web articles: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
