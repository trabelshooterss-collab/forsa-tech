import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { categories } from '../data'
import { insforge } from '../lib/insforge'

const years = ['الكل', ...Array.from({ length: 25 }, (_, i) => (2025 - i).toString())]
const cities = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية',
    'الغربية', 'البحيرة', 'أسيوط', 'سوهاج', 'المنيا', 'الفيوم', 'بني سويف', 'قنا',
    'الأقصر', 'أسوان', 'الإسماعيلية', 'بورسعيد', 'السويس', 'دمياط', 'كفر الشيخ',
    'الجيزة', 'الوادي الجديد', 'مطروح', 'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر'
]

export default function SearchPage() {
    const nav = useNavigate()
    const [params, setSearchParams] = useSearchParams()

    const catName = params.get('cat') || 'الكل'
    const subName = params.get('sub') || 'الكل'
    const brandName = params.get('brand') || ''

    const [type, setType] = useState('rent') // rent or sell
    const [q, setQ] = useState('')
    const [city, setCity] = useState('القاهرة')
    const [realAds, setRealAds] = useState([])
    const [loadingAds, setLoadingAds] = useState(true)
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [sortBy, setSortBy] = useState('newest') // newest, price_asc, price_desc, popular
    const [condition, setCondition] = useState('all') // all, new, used

    const activeCategory = useMemo(() => categories.find(c => c.name === catName), [catName])
    const activeSubcategories = activeCategory?.subs || []

    // Fetch real ads from database
    useEffect(() => {
        const fetchAds = async () => {
            setLoadingAds(true)
            try {
                let query = insforge.db
                    .from('ads')
                    .select('*')

                // Apply filters
                if (catName !== 'الكل') {
                    const cat = await insforge.db
                        .from('categories')
                        .select('id')
                        .eq('name', catName)
                        .single()
                    if (cat.data) {
                        query = query.eq('category_id', cat.data.id)
                    }
                }

                if (brandName) {
                    query = query.ilike('title', `%${brandName}%`)
                }

                if (city !== 'الكل') {
                    query = query.eq('city', city)
                }

                if (priceRange.min) {
                    query = query.gte('price', parseInt(priceRange.min))
                }

                if (priceRange.max) {
                    query = query.lte('price', parseInt(priceRange.max))
                }

                // Apply sorting
                switch (sortBy) {
                    case 'newest':
                        query = query.order('created_at', { ascending: false })
                        break
                    case 'price_asc':
                        query = query.order('price', { ascending: true })
                        break
                    case 'price_desc':
                        query = query.order('price', { ascending: false })
                        break
                    case 'popular':
                        query = query.order('views_count', { ascending: false })
                        break
                }

                const { data, error } = await query.limit(50)
                if (!error && data) {
                    setRealAds(data)
                }
            } catch (error) {
                console.error('Error fetching ads:', error)
            } finally {
                setLoadingAds(false)
            }
        }
        fetchAds()
    }, [catName, brandName, city, priceRange, sortBy])

    const results = useMemo(() => {
        let filtered = [...realAds]

        // Apply text search
        if (q) {
            filtered = filtered.filter(a => 
                a.title?.toLowerCase().includes(q.toLowerCase()) ||
                a.description?.toLowerCase().includes(q.toLowerCase())
            )
        }

        // Apply subcategory filter
        if (subName !== 'الكل') {
            filtered = filtered.filter(a => a.subcategory_name === subName)
        }

        // Apply property type filter
        if (catName === 'عقارات') {
            if (type === 'sale') {
                filtered = filtered.filter(a => !a.subcategory_name?.includes('إيجار'))
            } else if (type === 'rent') {
                filtered = filtered.filter(a => a.subcategory_name?.includes('إيجار'))
            }
        }

        // Apply condition filter
        if (condition !== 'all') {
            filtered = filtered.filter(a => {
                const title = a.title?.toLowerCase() || ''
                const desc = a.description?.toLowerCase() || ''
                if (condition === 'new') {
                    return title.includes('جديد') || title.includes('برشام') || desc.includes('جديد')
                } else if (condition === 'used') {
                    return title.includes('مستعمل') || desc.includes('مستعمل')
                }
                return true
            })
        }

        return filtered
    }, [realAds, catName, subName, q, type, condition])

    return (
        <div className="search-page-v2 pg-anim">
            {/* Header and Search Bar */}
            <div className="search-header glass" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="ابحث عن سيارات، عقارات، هواتف..."
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', borderRadius: '12px' }}
                    >
                        🔍 بحث
                    </button>
                </div>
            </div>

            <div className="search-body">
                {/* Results Grid */}
                <div className="results-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                            {loadingAds ? 'جاري البحث...' : `${results.length} نتيجة`}
                        </h2>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="newest">الأحدث أولاً</option>
                            <option value="price_asc">الأقل سعراً</option>
                            <option value="price_desc">الأعلى سعراً</option>
                            <option value="popular">الأكثر شعبية</option>
                        </select>
                    </div>

                    {loadingAds ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <span className="spinner" />
                            <p style={{ marginTop: 20, color: 'var(--text-3)' }}>جاري تحميل النتائج...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 60 }}>
                            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔍</div>
                            <h3 style={{ marginBottom: 10 }}>لا توجد نتائج</h3>
                            <p style={{ color: 'var(--text-3)' }}>جرب تغيير معايير البحث</p>
                        </div>
                    ) : (
                        <div className="ad-grid">
                            {results.map(ad => (
                                <div key={ad.id} className="ad-card glass" onClick={() => nav(`/ad/${ad.id}`)}>
                                    <img className="thumb" src={ad.image_urls?.[0] || 'https://placehold.co/400x300'} alt={ad.title} loading="lazy" />
                                    <div className="body">
                                        <h3>{ad.title}</h3>
                                        <div className="price">{ad.price} {ad.currency || 'ج.م'}</div>
                                        <div className="meta">
                                            <span>📍 {ad.city}</span>
                                            <span>📂 {catName}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Left Sidebar Filters */}
                <aside className="search-sidebar">
                    <div className="filter-card glass">
                        {/* City Filter */}
                        <div className="filter-section">
                            <label>المدينة</label>
                            <select
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none' }}
                            >
                                <option value="الكل">كل المدن</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="filter-section">
                            <label>نطاق السعر (ج.م)</label>
                            <div className="range-inputs" style={{ display: 'flex', gap: 10 }}>
                                <input
                                    type="number"
                                    placeholder="من"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none' }}
                                />
                                <input
                                    type="number"
                                    placeholder="إلى"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Condition Filter */}
                        <div className="filter-section">
                            <label>الحالة</label>
                            <select
                                value={condition}
                                onChange={e => setCondition(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', outline: 'none' }}
                            >
                                <option value="all">الكل</option>
                                <option value="new">جديد</option>
                                <option value="used">مستعمل</option>
                            </select>
                        </div>

                        {/* CATEGORY SPECIFIC FILTERS */}
                        {catName === 'سيارات ومحركات' ? (
                            // ... Motors Filters (Unchanged) ...
                            <>
                                <div className="sort-section" style={{ marginBottom: 20 }}>
                                    <h5>عن السيارة 🏎️</h5>
                                </div>
                                <div className="filter-section">
                                    <label>الماركة</label>
                                    <select value={subName} onChange={e => setSearchParams({ cat: catName, sub: e.target.value })}>
                                        <option value="الكل">كل الماركات</option>
                                        {activeSubcategories.find(s => s.id === 'used-cars')?.brands?.map(b => (
                                            <option key={b.name} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* ... Rest of Motors Filters ... */}
                                <div className="filter-section">
                                    <label>السنة</label>
                                    <select>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>الممشى (كم)</label>
                                    <div className="range-inputs">
                                        <input type="number" placeholder="من" />
                                        <input type="number" placeholder="إلى" />
                                    </div>
                                </div>
                            </>
                        ) : catName === 'عقارات' ? (
                            <>
                                <div className="sort-section" style={{ marginBottom: 20 }}>
                                    <h5>عن العقار 🏠</h5>
                                </div>
                                <div className="type-toggle">
                                    <button
                                        className={type === 'sell' ? 'active' : ''}
                                        onClick={() => {
                                            setType('sell')
                                            setSearchParams({ cat: catName, sub: 'الكل' }) // Reset specific sub to apply broad filter
                                        }}
                                    >للبيع</button>
                                    <button
                                        className={type === 'rent' ? 'active' : ''}
                                        onClick={() => {
                                            setType('rent')
                                            setSearchParams({ cat: catName, sub: 'الكل' })
                                        }}
                                    >للإيجار</button>
                                </div>
                                <div className="filter-section">
                                    <label>النوع</label>
                                    <select value={subName} onChange={e => setSearchParams({ cat: catName, sub: e.target.value })}>
                                        <option value="الكل">كل الأنواع</option>
                                        {activeSubcategories
                                            .filter(s => type === 'rent' ? s.name.includes('إيجار') : !s.name.includes('إيجار'))
                                            .map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>

                                {/* CONDITIONAL FILTERS based on SubCategory */}
                                {!['أراضي', 'عقارات تجارية', 'مباني'].some(k => subName.includes(k)) && (
                                    <div className="filter-section">
                                        <label>غرف نوم</label>
                                        <select>
                                            <option>غير محدد</option>
                                            <option>1</option><option>2</option><option>3</option><option>4+</option>
                                        </select>
                                    </div>
                                )}

                                <div className="filter-section">
                                    <label>المساحة (م²)</label>
                                    <div className="range-inputs">
                                        <input type="number" placeholder="من" />
                                        <input type="number" placeholder="إلى" />
                                    </div>
                                </div>
                            </>
                        ) : catName === 'وظائف خالية' ? (
                            <>
                                <div className="sort-section" style={{ marginBottom: 20 }}>
                                    <h5>عن الوظيفة 💼</h5>
                                </div>
                                <div className="type-toggle">
                                    <button className={type === 'hiring' ? 'active' : ''} onClick={() => setType('hiring')}>صاحب عمل</button>
                                    <button className={type === 'seeker' ? 'active' : ''} onClick={() => setType('seeker')}>باحث عن عمل</button>
                                </div>
                                <div className="filter-section">
                                    <label>التخصص</label>
                                    <select value={subName} onChange={e => setSearchParams({ cat: catName, sub: e.target.value })}>
                                        <option value="الكل">كل التخصصات</option>
                                        {activeSubcategories.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>نوع العمل</label>
                                    <select>
                                        <option>الكل</option>
                                        <option>دوام كامل</option>
                                        <option>دوام جزئي</option>
                                        <option>عن بعد</option>
                                        <option>تدريب</option>
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>{type === 'hiring' ? 'الراتب المعروض (ج.م)' : 'الراتب المتوقع (ج.م)'}</label>
                                    <div className="range-inputs">
                                        <input type="number" placeholder="من" />
                                        <input type="number" placeholder="إلى" />
                                    </div>
                                </div>
                            </>
                        ) : catName === 'خدمات' ? (
                            <>
                                <div className="sort-section" style={{ marginBottom: 20 }}>
                                    <h5>نوع الخدمة 🛠️</h5>
                                </div>
                                <div className="filter-section">
                                    <label>التخصص</label>
                                    <select value={subName} onChange={e => setSearchParams({ cat: catName, sub: e.target.value })}>
                                        <option value="الكل">كل الخدمات</option>
                                        {activeSubcategories.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>ميزانية الخدمة (ج.م)</label>
                                    <div className="range-inputs">
                                        <input type="number" placeholder="من" />
                                        <input type="number" placeholder="إلى" />
                                    </div>
                                </div>
                            </>
                        ) : (catName === 'أجهزة وإلكترونيات' && (subName === 'موبايلات' || subName === 'تابلت')) ? (
                            <>
                                <div className="sort-section" style={{ marginBottom: 20 }}>
                                    <h5>المواصفات التقنية 📱</h5>
                                </div>
                                <div className="filter-section">
                                    <label>الماركة</label>
                                    <select value={params.get('brand') || 'الكل'}>
                                        <option value="الكل">كل الماركات</option>
                                        {activeSubcategories.find(s => s.name === subName)?.brands?.map(b => (
                                            <option key={b.name} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>الموديل</label>
                                    <select disabled={!params.get('brand')}>
                                        <option value="الكل">كل الموديلات</option>
                                        {activeSubcategories.find(s => s.name === subName)?.brands?.find(b => b.name === params.get('brand'))?.models?.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>الحالة</label>
                                    <select>
                                        <option>الكل</option>
                                        <option>جديد (برشام)</option>
                                        <option>مستعمل - كسر زيرو</option>
                                        <option>مستعمل - بحالة ممتازة</option>
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label>السعر (ج.م)</label>
                                    <div className="range-inputs">
                                        <input type="number" placeholder="من" />
                                        <input type="number" placeholder="إلى" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="filter-section">
                                <label>الفئة الفرعية</label>
                                <select value={subName} onChange={e => setSearchParams({ cat: catName, sub: e.target.value })}>
                                    <option value="الكل">الكل</option>
                                    {activeSubcategories.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="filter-section">
                            <label>السعر (ج.م)</label>
                            <div className="range-inputs">
                                <input type="number" placeholder="من" />
                                <input type="number" placeholder="إلى" />
                            </div>
                        </div>

                        <div className="filter-section">
                            <input type="text" placeholder="بحث بكلمات محددة..." className="keyword-search" />
                        </div>

                        <div className="sort-section">
                            <h5>ترتيب حسب</h5>
                            <div className="sort-options">
                                <label><input type="checkbox" defaultChecked /> الأحدث أولاً</label>
                                <label><input type="checkbox" /> الأقل سعراً</label>
                                <label><input type="checkbox" /> الأعلى سعراً</label>
                            </div>
                        </div>

                        <button className="apply-btn">تحديث النتائج ⚡</button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
