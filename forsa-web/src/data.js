// Centralized Deep Data for Forsa-Tech
// Levels: Category -> SubCategory -> Brand/Type -> Model/Spec

const getLogo = (domain) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
const localLogo = (name, ext = 'png') => `/brands/${name}.${ext}`;

export const categories = [
    {
        id: 'motors',
        name: 'سيارات ومحركات',
        icon: '🚗',
        count: 24500,
        color: '#E53935',
        subs: [
            {
                id: 'used-cars',
                name: 'سيارات مستعملة',
                count: 18000,
                brands: [
                    // --- Popular Global Heavyweights (Strategically Localized) ---
                    { name: 'تويوتا', logo: getLogo('toyota.com'), models: ['Corolla', 'Camry', 'Land Cruiser', 'Hilux', 'Yaris'] },
                    { name: 'هيونداي', logo: getLogo('hyundai.com'), models: ['Elantra', 'Tucson', 'Accent', 'Sonata', 'Santa Fe'] },
                    { name: 'كيا', logo: getLogo('kia.com'), models: ['Sportage', 'Cerato', 'Seltos', 'K5', 'Pegas'] },
                    { name: 'نيسان', logo: getLogo('nissan.co.jp'), models: ['Sunny', 'Patrol', 'Altima', 'X-Trail'] },
                    { name: 'فورد', logo: getLogo('ford.com'), models: ['Focus', 'Mustang', 'Explorer', 'F-150', 'Taurus'] },
                    { name: 'هوندا', logo: getLogo('honda.com'), models: ['Civic', 'Accord', 'CR-V', 'Pilot'] },
                    { name: 'شيفروليه', logo: getLogo('chevrolet.com'), models: ['Optra', 'Cruze', 'Tahoe', 'Malibu', 'Silverado'] },
                    { name: 'ميتسوبيشي', logo: localLogo('mitsubishi'), models: ['Lancer', 'Pajero', 'ASX', 'Outlander'] },
                    { name: 'مازدا', logo: localLogo('mazda'), models: ['Mazda 6', 'CX-5', 'Mazda 3', 'CX-9'] },
                    { name: 'سوزوكي', logo: localLogo('suzuki'), models: ['Swift', 'Dzire', 'Jimny', 'Ertiga'] },
                    { name: 'ايسوزو', logo: localLogo('isuzu'), models: ['D-Max', 'MUX'] },

                    // --- Saudi/Regional Chinese Giants (ROCK SOLID LOCAL) ---
                    { name: 'شانجان', logo: localLogo('changan'), models: ['CS75', 'CS35 Plus', 'Eado Plus', 'Uni-T'] },
                    { name: 'جيلي', logo: localLogo('geely'), models: ['Coolray', 'Emgrand', 'Tugella', 'Azkarra'] },
                    { name: 'هافال', logo: localLogo('haval'), models: ['H6', 'Jolion', 'Dargo'] },
                    { name: 'ام جي', logo: localLogo('mg'), models: ['ZS', 'HS', 'MG 5', 'MG 6', 'RX5'] },
                    { name: 'شيري', logo: localLogo('chery'), models: ['Tiggo 7', 'Tiggo 8', 'Arrizo 6'] },
                    { name: 'جيتور', logo: localLogo('jetour'), models: ['X70', 'X90', 'Dashing'] },
                    { name: 'تانك', logo: localLogo('tank'), models: ['Tank 300', 'Tank 500'] },
                    { name: 'هونشي', logo: localLogo('hongqi'), models: ['H5', 'HS5', 'E-HS9'] },
                    { name: 'بي واي دي', logo: localLogo('byd'), models: ['Song Plus', 'Han', 'Atto 3'] },
                    { name: 'بايك', logo: localLogo('baic'), models: ['X7', 'BJ40'] },
                    { name: 'جي ايه سي', logo: localLogo('gac'), models: ['GS8', 'GS4', 'GA8'] },
                    { name: 'اكسيد', logo: localLogo('exeed'), models: ['TXL', 'VX'] },
                    { name: 'فورتينج', logo: localLogo('forthing'), models: ['T5 Evo'] },
                    { name: 'بيستون', logo: localLogo('bestune'), models: ['T77', 'B70'] },
                    { name: 'جي ام سي', logo: localLogo('jmc'), models: ['Grand Avenue'] },

                    // --- European Premium ---
                    { name: 'مرسيدس', logo: getLogo('mercedes-benz.com'), gold: true, models: ['E200', 'C200', 'S-Class', 'G-Class', 'GLE'] },
                    { name: 'بي ام دبليو', logo: getLogo('bmw.com'), gold: true, models: ['320i', '520i', 'X5', '7 Series', 'X7'] },
                    { name: 'اودي', logo: getLogo('audi.com'), gold: true, models: ['A4', 'Q7', 'A6', 'Q5', 'e-tron'] },
                    { name: 'بورش', logo: getLogo('porsche.com'), gold: true, models: ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'] },
                    { name: 'فولكس فاجن', logo: getLogo('volkswagen.com'), models: ['Golf', 'Passat', 'Tiguan', 'Teramont'] },
                    { name: 'سكودا', logo: getLogo('skoda-auto.com'), models: ['Octavia', 'Superb', 'Kodiaq'] },
                    { name: 'بيجو', logo: getLogo('peugeot.com'), models: ['3008', '508', '2008'] },
                    { name: 'رينو', logo: getLogo('renault.com'), models: ['Logan', 'Megane', 'Duster', 'Koleos'] },
                    { name: 'فيات', logo: getLogo('fiat.com'), models: ['Tipo', '500'] },
                    { name: 'سيات', logo: getLogo('seat.com'), models: ['Leon', 'Ateca', 'Tarraco'] },
                    { name: 'لاند روفر', logo: getLogo('landrover.com'), gold: true, models: ['Range Rover', 'Defender', 'Vogue', 'Sport'] },
                    { name: 'جاكوار', logo: getLogo('jaguar.com'), gold: true, models: ['F-Pace', 'XF'] },
                    { name: 'فولفو', logo: getLogo('volvo.com'), gold: true, models: ['XC90', 'XC60'] },

                    // --- American Muscle & Luxury ---
                    { name: 'جيمس', logo: localLogo('gmc'), gold: true, models: ['Sierra', 'Yukon', 'Terrain'] },
                    { name: 'جيب', logo: getLogo('jeep.com'), models: ['Wrangler', 'Cherokee', 'Grand Cherokee'] },
                    { name: 'دودج', logo: getLogo('dodge.com'), models: ['Charger', 'Durango', 'Challenger'] },
                    { name: 'كاديلاك', logo: localLogo('cadillac'), gold: true, models: ['Escalade', 'CT5', 'XT6'] },
                    { name: 'لينكون', logo: getLogo('lincoln.com'), gold: true, models: ['Navigator', 'Aviator'] },
                    { name: 'رام', logo: getLogo('ramtrucks.com'), models: ['1500', '2500'] },

                    // --- Japanese Luxury ---
                    { name: 'لكزس', logo: getLogo('lexus.jp'), gold: true, models: ['LS', 'LX', 'ES', 'RX'] },
                    { name: 'انفينيتي', logo: getLogo('infiniti.com'), models: ['QX80', 'QX50', 'Q50'] },
                    { name: 'جينيسيس', logo: localLogo('genesis'), gold: true, models: ['G80', 'G90', 'GV80'] },
                    { name: 'سوبارو', logo: getLogo('subaru.jp'), models: ['XV', 'Impreza', 'Forester'] },

                    // --- Exotic & EV Future ---
                    { name: 'لوسيد', logo: localLogo('lucid'), gold: true, models: ['Air', 'Gravity'] },
                    { name: 'تسلا', logo: getLogo('tesla.com'), gold: true, models: ['Model S', 'Model 3', 'Model X', 'Model Y'] },
                    { name: 'فيراري', logo: getLogo('ferrari.com'), gold: true, models: ['488', 'Roma', 'SF90'] },
                    { name: 'لامبورجيني', logo: getLogo('lamborghini.com'), gold: true, models: ['Urus', 'Aventador', 'Huracan'] },
                    { name: 'بنتلي', logo: getLogo('bentleymotors.com'), gold: true, models: ['Bentayga', 'Continental GT'] },
                    { name: 'رولز رويس', logo: getLogo('rolls-royce.com'), gold: true, models: ['Cullinan', 'Phantom', 'Ghost'] },
                    { name: 'مكلارين', logo: getLogo('mclaren.com'), gold: true, models: ['720S', 'Artura'] },

                    { name: 'أخرى', logo: '❓', models: ['غير محدد'] }
                ]
            },
            { id: 'new-cars', name: 'سيارات جديدة', count: 4200 },
            { id: 'motorcycles', name: 'دراجات نارية', count: 1560 },
            { id: 'heavy-trucks', name: 'نقل ثقيل وباصات', count: 800, icon: '🚛' },
            { id: 'boats', name: 'قوارب ويخوت', count: 200, icon: '🛥️' },
            { id: 'parts', name: 'قطع غيار واكسسوارات', count: 740, icon: '🔧' },
            { id: 'plates', name: 'لوحات مميزة', count: 120, icon: '🔢', gold: true }
        ]
    },
    {
        id: 'properties',
        name: 'عقارات',
        icon: '🏠',
        count: 12400,
        color: '#1565C0',
        subs: [
            { id: 'sale-apartments', name: 'شقق للبيع', count: 4100, icon: '🏙️' },
            { id: 'rent-apartments', name: 'شقق للإيجار', count: 5400, icon: '🔑' },
            { id: 'villas-sale', name: 'فلل وقصور للبيع', count: 1200, icon: '🏰', gold: true },
            { id: 'villas-rent', name: 'فلل للإيجار', count: 450, icon: '🏡' },
            { id: 'commercial', name: 'عقارات تجارية', count: 890, icon: '🏢' },
            { id: 'lands', name: 'أراضي', count: 2100, icon: '🏜️' },
            { id: 'chalets', name: 'شاليهات ومصايف', count: 1400, icon: '🏖️' },
            { id: 'buildings', name: 'عمارات بالكامل', count: 120, icon: '🏗️' },
            { id: 'foreign-prop', name: 'عقارات أجنبية', count: 50, icon: '🌍' }
        ]
    },
    {
        id: 'mobiles-tablets',
        name: 'موبايلات وتابلت',
        icon: '📱',
        count: 15000,
        color: '#2E7D32',
        subs: [
            {
                id: 'mobiles',
                name: 'موبايلات',
                count: 8400,
                icon: '📱',
                brands: [
                    { name: 'آبل (iPhone)', logo: getLogo('apple.com'), models: ['iPhone 17 Pro Max (2026)', 'iPhone 17 Pro', 'iPhone 17 Air', 'iPhone 16 Pro Max', 'iPhone 15 Pro Max', 'iPhone 14 Pro', 'iPhone 13', 'iPhone 11', 'أخرى'] },
                    { name: 'سامسونج', logo: getLogo('samsung.com'), models: ['Galaxy S26 Ultra', 'Galaxy S26+', 'Galaxy S26', 'Galaxy S25 Ultra', 'Galaxy Z Fold 7', 'Galaxy Z Flip 7', 'Galaxy A55', 'Galaxy A35'] },
                    { name: 'شاومي', logo: getLogo('mi.com'), models: ['Xiaomi 15 Pro', 'Xiaomi 14 Ultra', 'Redmi Note 14 Pro', 'Redmi Note 13', 'Poco F7 Pro', 'Redmi 13'] },
                    { name: 'هواوي', logo: getLogo('huawei.com'), models: ['Mate 70 Pro', 'Pura 70 Ultra', 'Nova 13', 'Mate 60 Pro'] },
                    { name: 'أوبو / ريلمي', logo: getLogo('oppo.com'), models: ['Find X7 Ultra', 'Reno 12 Pro', 'Realme GT 6', 'Realme 13 Pro+'] },
                    { name: 'جوجل (Pixel)', logo: getLogo('google.com'), models: ['Pixel 10 Pro', 'Pixel 9 Pro XL'] },
                    { name: 'إنفينيكس', logo: getLogo('infinixmobility.com'), models: ['Note 40', 'Hot 40', 'Smart 8'] },
                    { name: 'أونر', logo: getLogo('hihonor.com'), models: ['Magic 6 Pro', 'X9b', '90'] },
                    { name: 'أخرى', logo: '📱', models: ['فيفو', 'نوكيا', 'تكنو', 'أخرى'] }
                ]
            },
            {
                id: 'tablets',
                name: 'تابلت',
                count: 5200,
                icon: '📠',
                brands: [
                    { name: 'آبل (iPad)', logo: getLogo('apple.com'), models: ['iPad Pro M5 (2026)', 'iPad Pro M4', 'iPad Air M2', 'iPad 11th Gen (2026)', 'iPad Mini 7'] },
                    { name: 'سامسونج', logo: getLogo('samsung.com'), models: ['Galaxy Tab S10 Ultra', 'Galaxy Tab S10+', 'Galaxy Tab S9', 'Galaxy Tab A9+'] },
                    { name: 'هواوي', logo: getLogo('huawei.com'), models: ['MatePad Pro', 'MatePad Air'] },
                    { name: 'لينوفو', logo: getLogo('lenovo.com'), models: ['Tab P11', 'Tab M10'] }
                ]
            },
            { id: 'accessories', name: 'اكسسوارات موبايل', count: 3000, icon: '🎧' },
            { id: 'vip-numbers', name: 'أرقام مميزة', count: 500, icon: '💎', gold: true }
        ]
    },
    {
        id: 'electronics',
        name: 'إلكترونيات وأجهزة',
        icon: '💻',
        count: 10500,
        color: '#424242',
        subs: [
            {
                id: 'laptops',
                name: 'لابتوب وكمبيوتر',
                count: 6800,
                icon: '💻',
                brands: [
                    { name: 'آبل (MacBook)', logo: getLogo('apple.com'), models: ['MacBook Pro M4 Max', 'MacBook Pro M4', 'MacBook Pro M3', 'MacBook Air M3', 'MacBook Air M2', 'MacBook Air M1'] },
                    { name: 'ديل (Dell)', logo: getLogo('dell.com'), models: ['XPS 15/13', 'Latitude 5000/7000', 'Inspiron 15/16', 'Alienware m18/x16', 'Precision 7000', 'G15/G16 Gaming', 'Vostro'] },
                    { name: 'اتش بي (HP)', logo: getLogo('hp.com'), models: ['Spectre x360', 'Envy x360', 'Pavilion 15', 'Victus 15/16', 'Omen 17/16', 'ZBook Workstation', 'HP 15s/250'] },
                    { name: 'لينوفو (Lenovo)', logo: getLogo('lenovo.com'), models: ['ThinkPad X1 Carbon', 'ThinkPad P1/E/L/T', 'Legion 9i/7/5 Pro', 'Yoga 9i/7', 'IdeaPad 5/3/Gaming'] },
                    { name: 'أسوس (ASUS)', logo: getLogo('asus.com'), models: ['Zenbook Pro/Duo', 'Vivobook S/Pro', 'ROG Zephyrus', 'ROG Strix', 'ROG Flow', 'TUF Gaming A15/F15'] },
                    { name: 'ريزر (Razer)', logo: getLogo('razer.com'), models: ['Blade 18/16/14', 'Blade Stealth'] },
                    { name: 'مايكروسوفت (Surface)', logo: getLogo('microsoft.com'), models: ['Surface Laptop 7', 'Surface Pro 11', 'Surface Laptop Studio 2'] },
                    { name: 'ام اس اي (MSI)', logo: getLogo('msi.com'), models: ['Katana GF66/76', 'Cyborg 15', 'Prestige 14/16', 'Raider GE', 'Stealth GS', 'Titan GT'] },
                    { name: 'أيسر (Acer)', logo: getLogo('acer.com'), models: ['Swift Go', 'Aspire 7/5/3', 'Predator Helios', 'Nitro 17/16', 'Spin'] }
                ]
            },
            {
                id: 'tvs',
                name: 'تلفزيونات وصوتيات',
                count: 3100,
                icon: '📺',
                brands: [
                    { name: 'إل جي (LG)', logo: getLogo('lg.com'), models: ['OLED G6 (2026)', 'OLED C6', 'QNED99', 'NanoCell'] },
                    { name: 'سامسونج', logo: getLogo('samsung.com'), models: ['Neo QLED 8K', 'The Frame 2026', 'Crystal UHD', 'OLED S95'] },
                    { name: 'سوني (Sony)', logo: getLogo('sony.com'), models: ['BRAVIA XR A95L', 'X90L', 'Bravia 9 (2026)'] },
                    { name: 'توشيبا / تورنيدو', logo: '🔴', models: ['Toshiba Z770', 'Tornado Shield'] },
                    { name: 'هاي سينس', logo: getLogo('hisense.com'), models: ['U8K', 'U7K'] }
                ]
            },
            {
                id: 'appliances',
                name: 'أجهزة منزلية',
                count: 4500,
                icon: '🧊',
                brands: [
                    { name: 'سامسونج', logo: getLogo('samsung.com'), models: ['Bespoke AI', 'Family Hub'] },
                    { name: 'إل جي', logo: getLogo('lg.com'), models: ['InstaView', 'WashTower'] },
                    { name: 'شارب', logo: getLogo('sharp.eu'), models: ['Inverter Fridges'] },
                    { name: 'بيكو', logo: getLogo('beko.com'), models: ['HarvestFresh'] },
                    { name: 'فريش', logo: '❄️', models: ['Washing Machines', 'Cookers'] }
                ]
            },
            { id: 'gaming', name: 'ألعاب فيديو وكونسول', count: 1200, icon: '🎮' },
            { id: 'cameras', name: 'كاميرات وتصوير', count: 800, icon: '📸' }
        ]
    },
    {
        id: 'home-garden',
        name: 'المنزل والحديقة',
        icon: '🛋️',
        count: 6700,
        color: '#00897B',
        subs: [
            { id: 'furniture', name: 'أثاث منزلي', count: 2100, icon: '🛋️' },
            { id: 'decoration', name: 'ديكور وإضاءة', count: 1500, icon: '💡' },
            { id: 'kitchen-tools', name: 'أدوات مطبخ', count: 1200, icon: '🍽️' },
            { id: 'garden', name: 'حديقة ومناطق خارجية', count: 500, icon: '🌻' },
            { id: 'bathroom', name: 'أثاث حمام', count: 300, icon: '🚿' },
            { id: 'carpets', name: 'سجاد ومفروشات', count: 800, icon: '🧶' }
        ]
    },
    {
        id: 'fashion-beauty',
        name: 'موضة وجمال',
        icon: '👗',
        count: 9100,
        color: '#EC4899',
        subs: [
            { id: 'womens-clothing', name: 'ملابس حريمي', count: 3500, icon: '👚' },
            { id: 'mens-clothing', name: 'ملابس رجالي', count: 3200, icon: '👔' },
            { id: 'shoes', name: 'أحذية', count: 1200, icon: '👠' },
            { id: 'bags', name: 'حقائب وشنط', count: 800, icon: '👜' },
            { id: 'watches-jewelry', name: 'ساعات ومجوهرات', count: 1500, icon: '💍', gold: true },
            { id: 'beauty', name: 'صحة وجمال', count: 600, icon: '💄' },
            { id: 'wedding', name: 'لوازم أفراح', count: 200, icon: '👰' }
        ]
    },
    {
        id: 'pets',
        name: 'حيوانات أليفة',
        icon: '🐾',
        count: 1800,
        color: '#FF6D00',
        subs: [
            { id: 'cats', name: 'قطط', count: 800, icon: '🐱' },
            { id: 'dogs', name: 'كلاب', count: 600, icon: '🐶' },
            { id: 'birds', name: 'طيور', count: 200, icon: '🐦' },
            { id: 'fish', name: 'أسماك وزينة', count: 100, icon: '🐠' },
            { id: 'pet-supplies', name: 'مستلزمات حيوانات', count: 300, icon: '🦴' },
            { id: 'farm-animals', name: 'حيوانات مزارع', count: 50, icon: '🐮' }
        ]
    },
    {
        id: 'kids-babies',
        name: 'مستلزمات أطفال',
        icon: '🧸',
        count: 1200,
        color: '#AB47BC',
        subs: [
            { id: 'kids-clothing', name: 'ملابس أطفال', count: 500, icon: '👕' },
            { id: 'baby-gear', name: 'مستلزمات أطفال ورضع', count: 300, icon: '🍼' },
            { id: 'toys', name: 'ألعاب', count: 400, icon: '🧩' },
            { id: 'strollers', name: 'عربات ومقاعد', count: 200, icon: '🛒' }
        ]
    },
    {
        id: 'hobbies-sport',
        name: 'هوايات ورياضة',
        icon: '⚽',
        count: 1500,
        color: '#FFC107',
        subs: [
            { id: 'sports-equip', name: 'معدات رياضية', count: 600, icon: '🏋️' },
            { id: 'bicycles', name: 'دراجات', count: 400, icon: '🚲' },
            { id: 'books', name: 'كتب ومجلات', count: 200, icon: '📚' },
            { id: 'musical-instruments', name: 'آلات موسيقية', count: 150, icon: '🎸' },
            { id: 'antiques', name: 'تحف ومقتنيات', count: 300, icon: '🏺' },
            { id: 'tickets', name: 'تذاكر وقسائم', count: 50, icon: '🎟️' }
        ]
    },

    {
        id: 'jobs',
        name: 'وظائف خالية',
        icon: '💼',
        count: 25000,
        color: '#3F51B5',
        subs: [
            // === قطاع البناء والحرف ===
            { id: 'job-workers', name: 'عمال', count: 500, icon: '👷' },
            { id: 'job-craftsmen', name: 'حرفيين', count: 350, icon: '🔨' },
            { id: 'job-contracting', name: 'مقاولات وبناء', count: 280, icon: '🏗️' },
            { id: 'job-plumbing', name: 'سباكة', count: 200, icon: '🔧' },
            { id: 'job-electrical', name: 'كهربائي', count: 220, icon: '⚡' },
            { id: 'job-painting', name: 'نقاشة ودهانات', count: 180, icon: '🎨' },
            { id: 'job-welding', name: 'لحام وحدادة', count: 150, icon: '🔥' },
            { id: 'job-carpentry', name: 'نجارة', count: 170, icon: '🪚' },
            { id: 'job-tiling', name: 'سيراميك وتركيبات', count: 130, icon: '🧱' },
            { id: 'job-hvac', name: 'تكييف وتبريد', count: 190, icon: '❄️' },
            { id: 'job-landscaping', name: 'حدائق ومناظر طبيعية', count: 90, icon: '🌳' },
            // === قطاع الأمن والنقل ===
            { id: 'job-security', name: 'حراسة وأمن', count: 420, icon: '👮' },
            { id: 'job-driver', name: 'سائق', count: 380, icon: '🚗' },
            { id: 'job-delivery', name: 'دليفري وتوصيل', count: 300, icon: '🛵' },
            // === قطاع الضيافة والخدمات ===
            { id: 'job-tourism-rest', name: 'فنادق ومطاعم', count: 350, icon: '🍽️' },
            { id: 'job-chef', name: 'طباخ وشيف', count: 200, icon: '👨‍🍳' },
            { id: 'job-domestic', name: 'عمالة منزلية', count: 280, icon: '🧹' },
            { id: 'job-cleaning', name: 'عمال نظافة', count: 250, icon: '🧽' },
            { id: 'job-nursery', name: 'حضانة ورعاية أطفال', count: 120, icon: '🧒' },
            { id: 'job-beauty', name: 'تجميل وكوافير', count: 160, icon: '💇' },
            { id: 'job-fitness', name: 'مدرب لياقة ورياضة', count: 100, icon: '💪' },
            // === قطاع الإدارة والمكاتب ===
            { id: 'job-management', name: 'إدارة', count: 300, icon: '📊' },
            { id: 'job-accounting', name: 'محاسبة ومالية', count: 350, icon: '💰' },
            { id: 'job-secretarial', name: 'سكرتارية وإدارة مكتبية', count: 180, icon: '📝' },
            { id: 'job-hr', name: 'موارد بشرية', count: 140, icon: '👥' },
            { id: 'job-data-entry', name: 'إدخال بيانات', count: 200, icon: '⌨️' },
            { id: 'job-cust-service', name: 'خدمة عملاء وكول سنتر', count: 280, icon: '🎧' },
            { id: 'job-sales-marketing', name: 'مبيعات وتسويق', count: 400, icon: '📈' },
            { id: 'job-pr', name: 'علاقات عامة وإعلام', count: 80, icon: '📢' },
            // === قطاع التقنية والبرمجة ===
            { id: 'job-programming', name: 'برمجة وتطوير', count: 250, icon: '💻' },
            { id: 'job-web-design', name: 'تصميم مواقع وتطبيقات', count: 180, icon: '🌐' },
            { id: 'job-it', name: 'شبكات وIT', count: 160, icon: '🖥️' },
            { id: 'job-design', name: 'تصميم جرافيك', count: 200, icon: '🎨' },
            { id: 'job-montage', name: 'مونتاج وإنتاج فيديو', count: 120, icon: '🎬' },
            // === قطاع المهن المتخصصة ===
            { id: 'job-engineering', name: 'هندسة', count: 300, icon: '🏗️' },
            { id: 'job-medical', name: 'طب وتمريض وصيدلة', count: 250, icon: '🩺' },
            { id: 'job-teaching', name: 'تعليم وتدريس', count: 220, icon: '🎓' },
            { id: 'job-legal', name: 'محاماة وقانون', count: 100, icon: '⚖️' },
            { id: 'job-translator', name: 'ترجمة ولغات', count: 80, icon: '🗣️' },
            { id: 'job-tailors', name: 'خياطة وتفصيل', count: 90, icon: '🧵' },
            { id: 'job-employees', name: 'موظفين عموم', count: 400, icon: '💼' },
            { id: 'job-technician', name: 'فنيين ومعدات', count: 180, icon: '🔧' },
            { id: 'job-fine-arts', name: 'فنون وإبداع', count: 50, icon: '🎭' },
            { id: 'job-editors', name: 'تحرير وكتابة محتوى', count: 70, icon: '✍️' },
            { id: 'job-fashion', name: 'أزياء وموضة', count: 60, icon: '👗' },
            // === أخرى ===
            { id: 'job-partnership', name: 'شراكة واستثمار', count: 120, icon: '🤝' },
            { id: 'job-travel', name: 'سياحة وطيران', count: 90, icon: '✈️' },
            { id: 'job-other', name: 'وظائف أخرى', count: 500, icon: '📋' }
        ]
    },
    {
        id: 'services',
        name: 'خدمات',
        icon: '🛠️',
        count: 18000,
        color: '#607D8B',
        subs: [
            // === صيانة وإصلاح ===
            { id: 'serv-plumbing', name: 'سباكة', count: 1500, icon: '🔧' },
            { id: 'serv-electrical', name: 'كهرباء', count: 1400, icon: '⚡' },
            { id: 'serv-ac', name: 'تكييفات وتبريد', count: 1200, icon: '❄️' },
            { id: 'serv-appliance', name: 'صيانة أجهزة منزلية', count: 900, icon: '🔌' },
            { id: 'serv-electronics', name: 'تصليح موبايلات وإلكترونيات', count: 800, icon: '📱' },
            { id: 'serv-satellite', name: 'دش وستالايت وكاميرات', count: 400, icon: '📡' },
            // === بناء وتشطيب ===
            { id: 'serv-contracting', name: 'مقاولات وتشطيبات', count: 2000, icon: '🏗️' },
            { id: 'serv-painting', name: 'دهانات وديكور', count: 1100, icon: '🎨' },
            { id: 'serv-carpentry', name: 'نجارة وأخشاب', count: 700, icon: '🪚' },
            { id: 'serv-aluminum', name: 'ألوميتال وزجاج', count: 500, icon: '🪟' },
            { id: 'serv-tiles', name: 'سيراميك ورخام', count: 600, icon: '🧱' },
            { id: 'serv-welding', name: 'حدادة ولحام', count: 400, icon: '🔥' },
            // === تنظيف ومنزلية ===
            { id: 'serv-cleaning', name: 'تنظيف منازل وفلل', count: 1800, icon: '🧹' },
            { id: 'serv-pest', name: 'مكافحة حشرات', count: 900, icon: '🐛' },
            { id: 'serv-laundry', name: 'غسيل وكي ملابس', count: 300, icon: '👕' },
            { id: 'serv-gardening', name: 'حدائق وزراعة', count: 350, icon: '🌿' },
            // === نقل وشحن ===
            { id: 'serv-moving', name: 'نقل عفش', count: 1500, icon: '🚚' },
            { id: 'serv-shipping', name: 'شحن وتوصيل', count: 800, icon: '📦' },
            { id: 'serv-storage', name: 'تخزين ومستودعات', count: 200, icon: '🏭' },
            // === سيارات ===
            { id: 'serv-cars', name: 'ميكانيكا سيارات', count: 1200, icon: '🚗' },
            { id: 'serv-tires', name: 'كاوتش وبطاريات', count: 400, icon: '🛞' },
            { id: 'serv-car-wash', name: 'غسيل وتلميع سيارات', count: 350, icon: '🚿' },
            { id: 'serv-towing', name: 'سطحة وونش', count: 200, icon: '🚛' },
            // === تعليم وتدريب ===
            { id: 'serv-teaching', name: 'دروس خصوصية', count: 1500, icon: '📚' },
            { id: 'serv-training', name: 'تدريب وكورسات', count: 600, icon: '🎯' },
            { id: 'serv-languages', name: 'تعليم لغات', count: 400, icon: '🗣️' },
            // === صحة وجمال ===
            { id: 'serv-beauty', name: 'تجميل وكوافير', count: 800, icon: '💅' },
            { id: 'serv-health', name: 'تمريض منزلي', count: 500, icon: '💉' },
            { id: 'serv-therapy', name: 'علاج طبيعي وتأهيل', count: 250, icon: '🧑‍⚕️' },
            // === إبداع وتقنية ===
            { id: 'serv-design', name: 'تصميم وطباعة', count: 700, icon: '🖨️' },
            { id: 'serv-programming', name: 'برمجة وتصميم مواقع', count: 500, icon: '💻' },
            { id: 'serv-photography', name: 'تصوير فوتو وفيديو', count: 400, icon: '📸' },
            { id: 'serv-advertising', name: 'دعاية وإعلان', count: 600, icon: '📢' },
            // === مناسبات وضيافة ===
            { id: 'serv-parties', name: 'حفلات ومناسبات', count: 700, icon: '🎉' },
            { id: 'serv-food', name: 'طعام منزلي وبوفيه', count: 500, icon: '🍲' },
            { id: 'serv-catering', name: 'كاترينج وضيافة', count: 300, icon: '☕' },
            // === قانون ومال ===
            { id: 'serv-legal', name: 'استشارات قانونية', count: 300, icon: '⚖️' },
            { id: 'serv-financial', name: 'محاسبة وضرائب', count: 250, icon: '📊' },
            { id: 'serv-insurance', name: 'تأمين', count: 200, icon: '🛡️' },
            // === حيوانات ===
            { id: 'serv-pets', name: 'رعاية حيوانات', count: 300, icon: '🐾' },
            { id: 'serv-vet', name: 'طبيب بيطري', count: 200, icon: '🐕' },
            // === سفر وترفيه ===
            { id: 'serv-travel', name: 'حجز سفر وسياحة', count: 400, icon: '✈️' },
            { id: 'serv-other', name: 'خدمات أخرى', count: 500, icon: '📋' }
        ]
    },
    {
        id: 'business-industrial',
        name: 'شركات وصناعة',
        icon: '🏭',
        count: 4800,
        color: '#455A64',
        subs: [
            { id: 'factory-equip', name: 'معدات مصانع', count: 1200, icon: '⚙️' },
            { id: 'restaurant-equip', name: 'معدات مطاعم', count: 1100, icon: '🍔' },
            { id: 'medical-equip', name: 'معدات طبية', count: 800, icon: '🩺' },
            { id: 'heavy-machinery', name: 'معدات ثقيلة', count: 900, icon: '🚜' },
            { id: 'shop-liquidation', name: 'تصفية محلات وبضائع', count: 500, icon: '📦' }
        ]
    }
]

export const ads = [
    {
        id: 1,
        title: 'تويوتا كورولا 2024 - كسر زيرو - فئة ثانية',
        price: 1250000,
        priceStr: '1,250,000 ج.م',
        category: 'محركات',
        subCategory: 'سيارات مستعملة',
        brand: 'تويوتا',
        model: 'Corolla',
        year: 2024,
        mileage: 5000,
        city: 'القاهرة',
        time: 'منذ ساعتين',
        img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop',
        seller: 'معرض النخبة للسيارات',
        sellerSince: 'عضو منذ 2021',
        rating: 4.8,
        isVerified: true,
        description: 'سيارة تويوتا كورولا موديل 2024، لون أسود ملكي. السيارة بحالة الوكالة تماماً.\n\nالمواصفات:\n• فتحة سقف\n• شاشة لمس\n• حساسات ركن\n• صيانة دورية في التوكيل\n\nالسعر غير قابل للتفاوض.',
        shield: true
    },
    {
        id: 2,
        title: 'شقة فاخرة للبيع - التجمع الخامس - فيو لاند سكيب',
        price: 7400000,
        priceStr: '7,400,000 ج.م',
        category: 'عقارات',
        subCategory: 'شقق للبيع',
        city: 'الجيزة',
        time: 'منذ 5 ساعات',
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
        seller: 'إعمار العقارية',
        sellerSince: 'عضو منذ 2018',
        rating: 4.9,
        isVerified: true,
        description: 'شقة بموقع استراتيجي في كمبوند مميز. مساحة 180 متر.\n\nتتكون من:\n• 3 غرف نوم\n• 2 حمام\n• ريسبشن كبير\n\nنصف تشطيب، استلام فوري.',
        shield: true
    },
    {
        id: 3,
        title: 'مرسيدس E200 موديل 2020 - فابريكا بالكامل',
        price: 3850000,
        priceStr: '3,850,000 ج.م',
        category: 'محركات',
        subCategory: 'سيارات مستعملة',
        brand: 'مرسيدس',
        model: 'E200',
        year: 2020,
        mileage: 45000,
        city: 'القاهرة الكبرى',
        time: 'منذ يومين',
        img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
        seller: 'Black Line Motors',
        sellerSince: 'عضو منذ 2022',
        rating: 5.0,
        isVerified: true,
        description: 'مرسيدس E200 حالة ممتازة، صيانة توكيل منتظمة. لا تحتاج لأي مصاريف.',
        shield: true
    },
    {
        id: 4,
        title: 'iPhone 15 Pro Max - 256GB - Blue Titanium',
        price: 62000,
        priceStr: '62,000 ج.م',
        category: 'موبايلات وتابلت',
        subCategory: 'موبايلات',
        city: 'الإسكندرية',
        time: 'منذ 15 دقيقة',
        img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
        seller: 'آي ستور مصر',
        sellerSince: 'عضو منذ 2023',
        rating: 4.5,
        isVerified: false,
        description: 'آيفون 15 برو ماكس جديد متبرشم، ضمان محلي.',
        shield: true
    },
    {
        id: 5,
        title: 'مطلوب مصمم جرافيك - دوام كامل - شركة تقنية',
        price: 15000,
        priceStr: '15,000 ج.م / شهر',
        category: 'وظائف خالية',
        subCategory: 'تصميم',
        city: 'عن بعد',
        time: 'منذ يوم',
        img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
        seller: 'تيك سوليوشنز',
        sellerSince: 'عضو منذ 2019',
        rating: 4.2,
        isVerified: true,
        description: 'نبحث عن مصمم جرافيك مبدع للانضمام لفريقنا.',
        shield: false
    },
    {
        id: 6,
        title: 'شقة فندقية للإيجار اليومي والشهري - أمام نادي الزمالك',
        price: 3500,
        priceStr: '3,500 ج.م / يوم',
        category: 'عقارات',
        subCategory: 'شقق للإيجار',
        city: 'القاهرة',
        time: 'منذ 3 أيام',
        img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
        rooms: 3,
        baths: 2,
        area: 160,
        photos: 5,
        seller: 'المهندس للعقارات',
        isVerified: true,
        description: 'شقة فاخرة جداً مفروشة فرش فندقي حديث. تكييفات مركزية، إنترنت مجاني، صيانة دورية.',
        shield: true
    },
    {
        id: 7,
        title: 'فيلا مستقلة للبيع في الشيخ زايد - كمبوند سوديك',
        price: 22000000,
        priceStr: '22,000,000 ج.م',
        category: 'عقارات',
        subCategory: 'فلل وقصور للبيع',
        city: 'الجيزة',
        time: 'منذ يومين',
        img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
        rooms: 5,
        baths: 4,
        area: 450,
        photos: 12,
        seller: 'Sodic Sales',
        isVerified: true,
        description: 'فيلا مميزة جداً تشطيب سوبر لوكس. حمام سباحة خاص وجاردن كبيرة.',
        shield: true
    },
    {
        id: 8,
        title: 'شقة مفروشة إيجار شهري المهندسين - ميدان لبنان',
        price: 15000,
        priceStr: '15,000 ج.م / شهر',
        category: 'عقارات',
        subCategory: 'شقق للإيجار',
        city: 'القاهرة',
        time: 'منذ 3 أيام',
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
        rooms: 2,
        baths: 1,
        area: 120,
        photos: 8,
        seller: 'عقارات المهندسين',
        isVerified: false,
        description: 'فرش نظيف جداً، موقع استراتيجي قريبة من جميع الخدمات والمواصلات.',
        shield: false
    },
    {
        id: 9,
        title: 'مكتب إداري مرخص للبيع - العاصمة الإدارية',
        price: 4500000,
        priceStr: '4,500,000 ج.م',
        category: 'عقارات',
        subCategory: 'عقارات تجارية',
        city: 'القاهرة',
        time: 'منذ 5 ساعات',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
        area: 85,
        photos: 4,
        seller: 'Admin Dev',
        isVerified: true,
        description: 'موقع متميز في الداون تاون. استلام فوري، قسط مريح.',
        shield: true
    },
    {
        id: 10,
        title: 'شاليه للبيع في الساحل الشمالي - قرية مراسي',
        price: 8900000,
        priceStr: '8,900,000 ج.م',
        category: 'عقارات',
        subCategory: 'شاليهات ومصايف',
        city: 'الإسكندرية',
        time: 'منذ يوم',
        img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop',
        rooms: 3,
        baths: 2,
        area: 140,
        photos: 9,
        seller: 'إعمار مصر',
        isVerified: true,
        description: 'إطلالة مباشرة على اللاجون. تشطيب كامل بالتكييفات والمطبخ.',
        shield: true
    },
    {
        id: 11,
        title: 'فني تكييف محترف - صيانة وتركيب جميع الماركات',
        price: 350,
        priceStr: '350 ج.م',
        category: 'خدمات',
        subCategory: 'صيانة منزلية',
        city: 'القاهرة',
        time: 'منذ ساعة',
        img: 'https://images.unsplash.com/photo-1581092921461-eab62e92c859?q=80&w=800&auto=format&fit=crop',
        seller: 'المهندس للصيانة',
        isVerified: true,
        description: 'صيانة وتركيب وشحن فريون لجميع أنواع التكييفات. خبرة 10 سنوات، التزام بالمواعيد.',
        shield: true
    },
    {
        id: 12,
        title: 'سائق خاص - خبرة في طرق القاهرة والاسكندرية',
        price: 8000,
        priceStr: '8,000 ج.م / شهر',
        category: 'وظائف خالية',
        subCategory: 'سائق',
        city: 'الجيزة',
        time: 'منذ 3 ساعات',
        img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
        seller: 'أبو علي',
        isVerified: true,
        description: 'سائق خاص ملتزم، معرفة تامة بكل طرق القاهرة الكبرى. يبحث عن عمل دوام كامل.',
        shield: false
    },
    {
        id: 13,
        title: 'شركة تنظيف منازل وفلل - تعقيم شامل',
        price: 1200,
        priceStr: '1,200 ج.م',
        category: 'خدمات',
        subCategory: 'تنظيف ومكافحة حشرات',
        city: 'الشيخ زايد',
        time: 'منذ 5 ساعات',
        img: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=800&auto=format&fit=crop',
        seller: 'Crystal Clean',
        isVerified: true,
        description: 'نقدم خدمات تنظيف عميق وتعقيم للمنازل والفلل بأحدث المعدات ومواد آمنة.',
        shield: true
    }
]

export const stories = [
    { id: 1, title: 'مزاد: تويوتا سوبرا', price: 'تبدأ من 2.5M', img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=400&auto=format&fit=crop', live: true },
    { id: 2, title: 'لايف: عقارات دبي', price: 'عرض حصري', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=400&auto=format&fit=crop', live: true },
    { id: 3, title: 'فتح صندوق: PS5 Pro', price: 'قريباً', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400&auto=format&fit=crop', timer: '02:45' },
]

export const chats = [
    { id: 1, name: 'أحمد كمال', msg: 'هل السعر قابل للتفاوض؟', time: '10:30 AM', unread: 2, avatar: '👤' },
    { id: 2, name: 'السارة محمد', msg: 'تم إرسال العرض الجديد', time: 'أمس', unread: 0, avatar: '👩' },
    { id: 3, name: 'معرض النخبة', msg: 'السيارة موجودة للمعاينة غداً', time: 'الاثنين', unread: 1, avatar: '🏢' },
]

export const transactions = [
    { id: 1, title: 'شراء عملات فرصة', amount: 500, date: '12-02-2026', icon: '💳', bg: '#FFEBEE', color: '#E53935' },
    { id: 2, title: 'تمييز إعلان (تويوتا)', amount: -50, date: '10-02-2026', icon: '🔥', bg: '#FFF7ED', color: '#FF6D00' },
    { id: 3, title: 'تحويل من مستخدم (هدية)', amount: 100, date: '08-02-2026', icon: '🎁', bg: '#F0FDFA', color: '#0D9488' },
]
