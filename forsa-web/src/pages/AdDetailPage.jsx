import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import { useState, useEffect } from 'react'
import { insforge } from '../lib/insforge'
import LazyImage from '../components/LazyImage'

export default function AdDetailPage() {
    const { id } = useParams()
    const nav = useNavigate()
    const [ad, setAd] = useState(null)
    const [seller, setSeller] = useState(null)
    const [loading, setLoading] = useState(true)
    const [similar, setSimilar] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            // 1. Fetch Ad
            const { data: adData, error: adError } = await insforge.db
                .from('ads')
                .select('*')
                .eq('id', id)
                .single()

            if (adError || !adData) {
                setLoading(false)
                return
            }
            setAd(adData)

            // 2. Fetch Seller Profile
            const { data: profData } = await insforge.db
                .from('profiles')
                .select('*')
                .eq('id', adData.advertiser_id)
                .single()

            if (profData) setSeller(profData)

            // 3. Fetch Similar Ads (same category)
            const { data: simData } = await insforge.db
                .from('ads')
                .select('*')
                .eq('category_id', adData.category_id)
                .neq('id', id)
                .limit(3)

            if (simData) setSimilar(simData)

            setLoading(false)
        }
        fetchData()
    }, [id])

    if (loading) return <div style={{ textAlign: 'center', padding: 100 }}>جاري تحميل تفاصيل الفرصة... ⚡</div>
    if (!ad) return <div style={{ textAlign: 'center', padding: 100 }}>الإعلان غير موجود أو تم حذفه. ❌</div>

    const mainImg = ad.image_urls?.[0] || 'https://placehold.co/800x600?text=No+Image'

    return (
        <div className="ad-detail-page pg-anim">
            <BackButton label="العودة للإعلانات" />

            <div className="ad-grid-layout">
                <div className="glass" style={{ padding: '4px', overflow: 'hidden', marginBottom: 24 }}>
                    <LazyImage 
                        className="hero-img" 
                        src={mainImg} 
                        alt={ad.title} 
                        style={{ borderRadius: 'var(--r-sm)' }}
                    />
                </div>

                <div className="d-head">
                    <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            {ad.is_featured && <span className="d-tag" style={{ background: 'var(--red)', color: '#fff', fontSize: '.65rem' }}>مميز 🔥</span>}
                            <span className="d-tag">📂 {ad.category_name || 'عام'}</span>
                        </div>
                        <h1>{ad.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, color: 'var(--text-3)', fontSize: '.8rem', fontWeight: 600 }}>
                            <span>📍 {ad.city || 'المنطقة'}</span>
                            <span>•</span>
                            <span>⏱️ {new Date(ad.created_at).toLocaleDateString('ar-EG')}</span>
                            <span>•</span>
                            <span>👁️ {ad.views_count || 0} مشاهدة</span>
                        </div>
                    </div>
                    <div className="price">{ad.price} {ad.currency || 'ج.م'}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }} className="search-layout">
                    {/* Main Info */}
                    <div>
                        <div className="d-section">
                            <h3>📝 وصف الإعلان</h3>
                            <p style={{ color: 'var(--text-2)', lineHeight: 2.2, whiteSpace: 'pre-line', fontSize: '.95rem' }}>{ad.description}</p>
                        </div>

                        {ad.image_urls?.length > 1 && (
                            <div className="d-section">
                                <h3 style={{ marginBottom: 16 }}>📸 صور إضافية</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    {ad.image_urls.slice(1).map((url, i) => (
                                        <div key={i} className="glass" style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'zoom-in' }}>
                                            <LazyImage 
                                                src={url} 
                                                alt="sub" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Sidebar */}
                    <div style={{ position: 'sticky', top: 20 }}>
                        <div className="d-section" style={{ border: ad.is_featured ? '2px solid var(--red-glow)' : '1px solid var(--border)' }}>
                            <h3>👤 معلومات البائع</h3>
                            <div className="seller-row" style={{ marginTop: 10 }}>
                                <div className="s-av" style={{ border: '2px solid var(--red)', position: 'relative', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                    {seller?.full_name?.charAt(0) || '👤'}
                                </div>
                                <div>
                                    <div className="s-nm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        {seller?.full_name || 'بائع مجهول'}
                                    </div>
                                    <div className="s-rt">⭐️⭐️⭐️⭐️⭐️ (4.9)</div>
                                </div>
                            </div>

                            <div className="contact-row" style={{ marginTop: 24, flexDirection: 'column' }}>
                                <button className="btn btn-primary" style={{ width: '100%', padding: 15 }}>💬 أرسل رسالة</button>
                                <a href={`tel:${ad.phone}`} className="btn btn-accent" style={{ width: '100%', padding: 15, textAlign: 'center', textDecoration: 'none' }}>📞 اتصل الآن</a>
                            </div>
                        </div>

                        {/* Forsa Shield Box */}
                        <div className="shield-box glass" style={{ border: ad.has_shield ? '2px solid #10B981' : '1px solid var(--border)' }}>
                            <div className="shield-top">
                                <span className="ico" style={{ animation: ad.has_shield ? 'pulse-shield 2s infinite' : 'none' }}>🛡️</span>
                                <div>
                                    <h3>Forsa Shield</h3>
                                    <p>{ad.has_shield ? 'هذا الإعلان محمي بالكامل' : 'ضمان المشتري وحماية الدفع'}</p>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{
                                width: '100%',
                                background: ad.has_shield ? 'linear-gradient(135deg, #10B981, #059669)' : 'var(--bg-soft)',
                                color: ad.has_shield ? '#fff' : 'var(--text-2)',
                                border: 'none',
                                fontWeight: 800
                            }}>
                                {ad.has_shield ? `🛡️ اشتري بأمان - ${ad.price}` : 'تفعيل حماية Shield'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Items */}
            {similar.length > 0 && (
                <div style={{ marginTop: 40 }}>
                    <div className="sec-head">
                        <h2>🔗 إعلانات مشابهة</h2>
                    </div>
                    <div className="ad-grid">
                        {similar.map(s => (
                            <div key={s.id} className="ad-card glass" onClick={() => { nav(`/ad/${s.id}`); window.scrollTo(0, 0) }}>
                                <LazyImage 
                                    className="thumb" 
                                    src={s.image_urls?.[0] || 'https://placehold.co/400x300'} 
                                    alt={s.title}
                                    style={{ width: '100%', height: '100%' }}
                                />
                                <div className="body">
                                    <h3>{s.title}</h3>
                                    <div className="price">{s.price} {s.currency}</div>
                                    <span style={{ fontSize: '.7rem', color: 'var(--text-3)' }}>📍 {s.city}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .v-tick-small {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    background: var(--red);
                    color: white;
                    border-radius: 50%;
                    width: 14px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.5rem;
                    border: 1.5px solid var(--bg);
                }
                .verified-badge-text {
                    background: var(--red-soft);
                    color: var(--red);
                    font-size: 0.65rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 800;
                }
                .shield-box {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: var(--r-sm);
                    position: relative;
                    overflow: hidden;
                }
                .shield-top {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .shield-top .ico {
                    font-size: 1.8rem;
                }
                .shield-top h3 {
                    font-size: 1.1rem;
                    font-weight: 900;
                    margin: 0;
                }
                .shield-top p {
                    font-size: 0.75rem;
                    color: var(--text-3);
                    margin: 0;
                }
                @keyframes pulse-shield {
                    0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0.4)); }
                    70% { transform: scale(1.1); filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.6)); }
                    100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0)); }
                }
            `}</style>
        </div>
    )
}
