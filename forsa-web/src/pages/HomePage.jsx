import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import { categories } from '../data'
import AdCard from '../components/AdCard'
import { insforge } from '../lib/insforge'
import LazyImage from '../components/LazyImage'

export default function HomePage() {
    const nav = useNavigate()
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [activeCat, setActiveCat] = useState(null)
    const [drillSub, setDrillSub] = useState(null)
    const [realAds, setRealAds] = useState([])
    const [loadingAds, setLoadingAds] = useState(true)
    const [liveAuctions, setLiveAuctions] = useState([])
    const [loadingAuctions, setLoadingAuctions] = useState(true)
    const [auctionsEnabled, setAuctionsEnabled] = useState(true)

    useEffect(() => {
        const fetchAds = async () => {
            const { data, error } = await insforge.db
                .from('ads')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)

            if (!error) setRealAds(data || [])
            setLoadingAds(false)
        }
        fetchAds()
    }, [])

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoadingAuctions(true)
            try {
                const nowIso = new Date().toISOString()
                const { data, error } = await insforge.db
                    .from('auctions')
                    .select('*')
                    .gte('end_time', nowIso)
                    .order('end_time', { ascending: true })
                    .limit(12)

                if (error) {
                    // Table not created yet
                    if (error.code === '42P01') setAuctionsEnabled(false)
                    setLiveAuctions([])
                } else {
                    setAuctionsEnabled(true)
                    setLiveAuctions(data || [])
                }
            } catch {
                setLiveAuctions([])
            } finally {
                setLoadingAuctions(false)
            }
        }
        fetchAuctions()
    }, [])

    const fmtShort = (seconds) => {
        const s = Math.max(0, Number(seconds) || 0)
        const d = Math.floor(s / (24 * 60 * 60))
        const h = Math.floor((s % (24 * 60 * 60)) / (60 * 60))
        const m = Math.floor((s % (60 * 60)) / 60)
        if (d > 0) return `${d}ي ${h}س`
        if (h > 0) return `${h}س ${m}د`
        return `${m}د`
    }

    const handleCatClick = (cat) => {
        if (['motors', 'properties', 'mobiles-tablets', 'electronics', 'home-garden', 'fashion-beauty', 'pets', 'kids-babies', 'hobbies-sport', 'jobs', 'services', 'business-industrial'].includes(cat.id)) {
            setActiveCat(activeCat === cat.id ? null : cat.id)
            setDrillSub(null) // Reset drill down on main cat change
        } else {
            nav(`/search?cat=${encodeURIComponent(cat.name)}`)
        }
    }

    const motorBrands = categories.find(c => c.id === 'motors')?.subs?.find(s => s.id === 'used-cars')?.brands || []

    return (
        <>
            {/* Header */}
            <div className="pg-header">
                <div>
                    <h1>مرحباً بك في فرصة-تك ⚡</h1>
                    <p className="sub">اشتبك مع الملايين في أكبر سوق ذكي في المنطقة</p>
                </div>
                <div className="row-btns" style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-icon" onClick={toggleTheme} title="تغيير المظهر">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button className="btn-icon" onClick={() => nav('/profile')} title="الإشعارات">
                        🔔 <span className="chat-dot" style={{ top: -2, right: -2 }}>3</span>
                    </button>
                </div>
            </div>

            {/* Search Hero */}
            <div className="sec">
                <div className="search-bar glass" style={{ padding: '10px 15px', display: 'flex', gap: 10, alignItems: 'center', borderRadius: 12 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 8, padding: '5px 15px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '1.2rem', marginLeft: 10 }}>🔍</span>
                        <input
                            placeholder="ابحث عن سيارات، عقارات، هواتف..."
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    nav(`/search?q=${encodeURIComponent(e.target.value)}`)
                                }
                            }}
                        />
                    </div>
                    <select
                        style={{ padding: '10px 15px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', outline: 'none' }}
                        onChange={(e) => {
                            if (e.target.value !== 'all') {
                                nav(`/search?cat=${encodeURIComponent(e.target.value)}`)
                            }
                        }}
                    >
                        <option value="all">كل الأقسام</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <button
                        className="s-btn"
                        type="button"
                        onClick={() => {
                            const input = document.querySelector('.search-bar input');
                            nav(`/search?q=${encodeURIComponent(input.value)}`);
                        }}
                    >
                        ابحث الآن
                    </button>
                </div>
            </div>

            {/* Categories Horizontal Tabs (Like Reference Image 1) */}
            <div className="sec">
                <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                    {categories.slice(0, 20).map(c => (
                        <div key={c.id}
                            onClick={() => handleCatClick(c)}
                            className={`glass cat-tab ${activeCat === c.id ? 'active' : ''}`}
                            style={{
                                width: 150, padding: '25px 10px', textAlign: 'center', cursor: 'pointer',
                                background: activeCat === c.id ? 'var(--blue)' : 'var(--bg-card)',
                                color: activeCat === c.id ? '#fff' : 'var(--text)',
                                borderBottom: `5px solid ${activeCat === c.id ? 'var(--red)' : 'transparent'}`
                            }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 10, position: 'relative', zIndex: 2 }}>{c.icon}</div>
                            <div style={{ fontWeight: 900, fontSize: '0.9rem', position: 'relative', zIndex: 2 }}>{c.name}</div>
                            {activeCat === c.id && <div className="icon-bg">{c.icon}</div>}
                        </div>
                    ))}
                </div>

                {/* Brand/Type/Job Picker - PREMIUM GRID */}
                {activeCat && (
                    <div className="glass brand-grid-premium">
                        <div className="bg-head">
                            <span>
                                {activeCat === 'motors' ? '🚀 🏁' :
                                    activeCat === 'properties' ? '🏢 🏠' :
                                        activeCat === 'mobiles-tablets' ? '📱 📟' :
                                            activeCat === 'electronics' ? '💻 🎮' :
                                                activeCat === 'fashion-beauty' ? '👗 👠' :
                                                    activeCat === 'pets' ? '🐾 🐱' : '🏷️ ✨'}
                            </span>
                            <span>
                                {
                                    activeCat === 'motors' ? 'تصفح حسب الوكلاء والمتصدرين' :
                                        activeCat === 'properties' ? 'تصفح حسب نوع العقار والمكان' :
                                            activeCat === 'mobiles-tablets' ? 'أشهر الماركات العالمية' :
                                                activeCat === 'jobs' ? 'تصفح الوظائف حسب التخصص' :
                                                    activeCat === 'services' ? 'تصفح الخدمات المتاحة' :
                                                        'تصفح الأقسام الفرعية'
                                }
                            </span>
                        </div>
                        <div className="grid-body">
                            {activeCat === 'motors'
                                ? motorBrands.map(b => (
                                    <div key={b.name}
                                        className={`brand-card-mini ${b.gold ? 'is-gold' : ''}`}
                                        onClick={() => nav(`/search?cat=${encodeURIComponent('سيارات ومحركات')}&brand=${encodeURIComponent(b.name)}`)}>
                                        <div className="b-logo-wrap">
                                            {(b.logo.startsWith('http') || b.logo.startsWith('/')) ? (
                                                <img src={b.logo} alt={b.name} className="b-logo-img" loading="lazy" />
                                            ) : (
                                                <span style={{ fontSize: '2rem' }}>{b.logo}</span>
                                            )}
                                        </div>
                                        <div className="b-name">{b.name}</div>
                                    </div>
                                ))
                                : (drillSub ? (
                                    categories.find(c => c.id === activeCat)?.subs?.find(s => s.id === drillSub)?.brands?.map(b => (
                                        <div key={b.name}
                                            className="brand-card-mini"
                                            onClick={() => nav(`/search?cat=${encodeURIComponent(categories.find(c => c.id === activeCat).name)}&sub=${encodeURIComponent(categories.find(c => c.id === activeCat).subs.find(s => s.id === drillSub).name)}&brand=${encodeURIComponent(b.name)}`)}>
                                            <div className="b-logo-wrap">
                                                {(b.logo && (b.logo.startsWith('http') || b.logo.startsWith('/'))) ? (
                                                    <img src={b.logo} alt={b.name} className="b-logo-img" loading="lazy" />
                                                ) : (
                                                    <span style={{ fontSize: '2rem' }}>{b.logo || '🔹'}</span>
                                                )}
                                            </div>
                                            <div className="b-name">{b.name}</div>
                                        </div>
                                    ))
                                ) : (
                                    categories.find(c => c.id === activeCat)?.subs?.map(s => (
                                        <div key={s.id}
                                            className="brand-card-mini"
                                            onClick={() => {
                                                if (s.brands) setDrillSub(s.id);
                                                else nav(`/search?cat=${encodeURIComponent(categories.find(c => c.id === activeCat).name)}&sub=${encodeURIComponent(s.name)}`);
                                            }}>
                                            <div className="b-logo-wrap">
                                                <span style={{ fontSize: '2.5rem' }}>{s.icon}</span>
                                            </div>
                                            <div className="b-name">{s.name}</div>
                                        </div>
                                    ))
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>

            {/* Forsa LIVE - Streamed Auctions */}
            <div className="sec">
                <div className="sec-head">
                    <h2>🔴 Forsa LIVE (مزادات مباشرة)</h2>
                    <button className="more" onClick={() => nav('/auctions')}>شاهد الكل ←</button>
                </div>

                {!auctionsEnabled ? (
                    <div className="glass" style={{ padding: 22 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>ميزة المزادات غير مفعلة بعد</div>
                        <div style={{ color: 'var(--text-3)', fontSize: '.85rem', marginTop: 6, lineHeight: 1.8 }}>
                            أول ما يتفعل جدول المزادات في قاعدة البيانات، هتلاقي المزادات هنا بشكل مباشر.
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                            <button className="btn btn-primary" onClick={() => nav('/create')}>إنشاء مزاد أو إعلان</button>
                            <button className="btn btn-outline" onClick={() => nav('/auctions')}>صفحة المزادات</button>
                        </div>
                    </div>
                ) : loadingAuctions ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <span className="spinner" /> جاري تحميل المزادات...
                    </div>
                ) : liveAuctions.length === 0 ? (
                    <div className="glass" style={{ padding: 22, textAlign: 'center' }}>
                        <div style={{ fontWeight: 900 }}>لا توجد مزادات حالياً</div>
                        <div style={{ color: 'var(--text-3)', fontSize: '.85rem', marginTop: 6 }}>
                            ابدأ أول مزاد، وخليه يظهر للناس في الصفحة الرئيسية فوراً.
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => nav('/create')}>
                            إنشاء مزاد
                        </button>
                    </div>
                ) : (
                    <div className="stories-row">
                        {liveAuctions.map(a => {
                            const now = new Date()
                            const start = a.start_time ? new Date(a.start_time) : null
                            const end = a.end_time ? new Date(a.end_time) : null
                            const started = !start || start <= now
                            const ended = !!end && end <= now
                            const live = started && !ended && !['sold', 'ended', 'cancelled'].includes(a.status)
                            const seconds = end ? Math.floor((end - now) / 1000) : 0
                            const toStart = start ? Math.floor((start - now) / 1000) : 0
                            const tag = live ? '🔴 مباشر' : (started ? `⏰ ${fmtShort(seconds)}` : `⏳ ${fmtShort(toStart)}`)
                            const price = Number(a.current_bid ?? a.start_price ?? 0)
                            const priceLabel = live ? `السعر: ${price.toLocaleString('ar-EG')} ج.م` : `يبدأ من ${price.toLocaleString('ar-EG')} ج.م`
                            return (
                                <div key={a.id} className="story-card glass" onClick={() => nav(`/auction/${a.id}`)}>
                                    <LazyImage
                                        src={a.image_urls?.[0] || 'https://placehold.co/400x300'}
                                        alt={a.title || 'مزاد'}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                    <div className="grad" />
                                    <span className={`live-tag ${live ? 'on' : 'timer'}`}>
                                        {tag}
                                    </span>
                                    <div className="txt">
                                        <h4>{a.title || 'مزاد'}</h4>
                                        <div className="pr">{priceLabel}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>


            {/* Featured / Trending Ads */}
            <div className="sec">
                <div className="sec-head">
                    <h2>🔥 فرص لا تفوت (رائج الآن)</h2>
                    <button className="more" onClick={() => nav('/search')}>عرض الجميع ←</button>
                </div>
                {loadingAds ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <span className="spinner" /> جاري تحميل أحدث الفرص...
                    </div>
                ) : (
                    <div className="ad-grid">
                        {realAds.map((ad, idx) => (
                            <AdCard
                                key={ad.id}
                                ad={{
                                    ...ad,
                                    isVerified: idx === 0 || idx === 2,
                                    shield: ad.has_shield || ad.is_featured
                                }}
                            />
                        ))}
                        {realAds.length === 0 && (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: 40, opacity: 0.5 }}>
                                لا توجد إعلانات منشورة بعد. كن أول من ينشر! 🚀
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Promotion Banner */}
            <div className="sec" style={{ marginBottom: 20 }}>
                <div className="glass" style={{ background: 'linear-gradient(135deg, var(--red), var(--orange))', padding: '30px', color: '#fff', textAlign: 'center' }}>
                    <h2 style={{ fontWeight: 900 }}>هل لديك ما تبيعه؟ 🚀</h2>
                    <p style={{ opacity: 0.9, marginTop: 10, marginBottom: 20 }}>انضم إلى ملايين المستخدمين وبع منتجاتك في دقائق</p>
                    <button className="btn" style={{ background: '#fff', color: 'var(--red)' }} onClick={() => nav('/create')}>ابدأ الآن</button>
                </div>
            </div>
        </>
    )
}
