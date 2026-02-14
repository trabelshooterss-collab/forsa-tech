import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { insforge } from '../lib/insforge'
import LazyImage from '../components/LazyImage'

export default function AuctionsPage() {
    const nav = useNavigate()
    const [auctions, setAuctions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, live, ending_soon, new
    const [auctionsEnabled, setAuctionsEnabled] = useState(true)

    useEffect(() => {
        fetchAuctions()
    }, [filter])

    const fetchAuctions = async () => {
        setLoading(true)
        try {
            let query = insforge.db
                .from('auctions')
                .select('*')
                .order('created_at', { ascending: false })

            // Apply filters
            if (filter === 'live') {
                const now = new Date().toISOString()
                query = query.gte('end_time', now).lte('start_time', now)
            } else if (filter === 'ending_soon') {
                const nowIso = new Date().toISOString()
                const hourLaterIso = new Date(Date.now() + 60 * 60 * 1000).toISOString()
                query = query.gte('end_time', nowIso).lte('end_time', hourLaterIso)
            } else if (filter === 'new') {
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                query = query.gte('created_at', dayAgo)
            }

            const { data, error } = await query.limit(50)
            if (error) {
                if (error.code === '42P01') setAuctionsEnabled(false)
                setAuctions([])
            } else {
                setAuctionsEnabled(true)
                setAuctions(data)
            }
        } catch (error) {
            console.error('Error fetching auctions:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTimeLeft = (endTime) => {
        if (!endTime) return '—'
        const now = new Date()
        const end = new Date(endTime)
        const diff = end - now

        if (diff <= 0) return 'انتهى'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        if (days > 0) return `${days}ي ${hours % 24}س`
        return `${hours}س ${minutes}د ${seconds}ث`
    }

    return (
        <div className="auctions-page pg-anim">
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
                {/* Header */}
                <div className="glass" style={{ 
                    padding: 30, 
                    borderRadius: 20, 
                    marginBottom: 30,
                    background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.1), rgba(255, 109, 0, 0.1))'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 10 }}>
                        🔴 المزادات المباشرة
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-3)', marginBottom: 20 }}>
                        اشترك في المزادات المباشرة وافز بأفضل الأسعار
                    </p>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
                        <button className="btn btn-primary" onClick={() => nav('/create-auction')}>
                            إنشاء مزاد
                        </button>
                        <button className="btn btn-outline" onClick={() => nav('/create')}>
                            إضافة (مزاد أو إعلان)
                        </button>
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: 20,
                                border: '2px solid var(--border)',
                                background: filter === 'all' ? 'var(--red)' : 'var(--bg)',
                                color: filter === 'all' ? '#fff' : 'var(--text)',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setFilter('live')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: 20,
                                border: '2px solid var(--border)',
                                background: filter === 'live' ? '#E53935' : 'var(--bg)',
                                color: filter === 'live' ? '#fff' : 'var(--text)',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            🔴 مباشر الآن
                        </button>
                        <button
                            onClick={() => setFilter('ending_soon')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: 20,
                                border: '2px solid var(--border)',
                                background: filter === 'ending_soon' ? 'var(--orange)' : 'var(--bg)',
                                color: filter === 'ending_soon' ? '#fff' : 'var(--text)',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            ⏰ ينتهي قريباً
                        </button>
                        <button
                            onClick={() => setFilter('new')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: 20,
                                border: '2px solid var(--border)',
                                background: filter === 'new' ? 'var(--blue)' : 'var(--bg)',
                                color: filter === 'new' ? '#fff' : 'var(--text)',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            🆕 جديد
                        </button>
                    </div>
                </div>

                {/* Auctions Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <span className="spinner" />
                        <p style={{ marginTop: 20, color: 'var(--text-3)' }}>جاري تحميل المزادات...</p>
                    </div>
                ) : !auctionsEnabled ? (
                    <div className="glass" style={{ padding: 30, textAlign: 'center' }}>
                        <h3 style={{ marginBottom: 10 }}>ميزة المزادات غير مفعلة بعد</h3>
                        <p style={{ color: 'var(--text-3)' }}>
                            لازم يتعمل جدول المزادات في قاعدة البيانات علشان صفحة المزادات تشتغل بشكل حقيقي.
                        </p>
                    </div>
                ) : auctions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔴</div>
                        <h3 style={{ marginBottom: 10 }}>لا توجد مزادات حالياً</h3>
                        <p style={{ color: 'var(--text-3)' }}>جرب تغيير الفلاتر أو العودة لاحقاً</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: 20 
                    }}>
                        {auctions.map(auction => (
                            <div 
                                key={auction.id}
                                className="auction-card glass"
                                onClick={() => nav(`/auction/${auction.id}`)}
                                style={{
                                    borderRadius: 15,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                {/* Live Badge */}
                                {(() => {
                                    const now = new Date()
                                    const start = auction.start_time ? new Date(auction.start_time) : null
                                    const end = auction.end_time ? new Date(auction.end_time) : null
                                    const started = !start || start <= now
                                    const ended = !!end && end <= now
                                    const live = started && !ended && !['sold', 'ended', 'cancelled'].includes(auction.status)
                                    return live ? (
                                    <div style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        background: '#E53935',
                                        color: '#fff',
                                        padding: '5px 15px',
                                        borderRadius: 20,
                                        fontSize: '0.8rem',
                                        fontWeight: 900,
                                        animation: 'pulse 2s infinite',
                                        zIndex: 2
                                    }}>
                                        🔴 مباشر
                                    </div>
                                    ) : null
                                })()}

                                {/* Image */}
                                <LazyImage 
                                    src={auction.image_urls?.[0] || 'https://placehold.co/400x300'}
                                    alt={auction.title}
                                    style={{ 
                                        width: '100%',
                                        aspectRatio: '4/3',
                                        objectFit: 'cover'
                                    }}
                                />

                                {/* Info */}
                                <div style={{ padding: 15 }}>
                                    <h3 style={{ 
                                        fontSize: '1.1rem', 
                                        fontWeight: 900, 
                                        marginBottom: 10,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {auction.title}
                                    </h3>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: 5 }}>
                                                السعر الحالي
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--red)' }}>
                                                {Number(auction.current_bid ?? auction.start_price ?? 0).toLocaleString('ar-EG')} ج.م
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: 5 }}>
                                                ينتهي في
                                            </div>
                                            <div style={{ 
                                                fontSize: '1.2rem', 
                                                fontWeight: 900,
                                                color: getTimeLeft(auction.end_time) === 'انتهى' ? 'var(--text-3)' : 'var(--orange)'
                                            }}>
                                                {getTimeLeft(auction.end_time)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buy Now */}
                                    {auction.buy_now_price && (
                                        <button 
                                            style={{
                                                width: '100%',
                                                padding: 12,
                                                background: 'linear-gradient(135deg, var(--red), var(--orange))',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 10,
                                                fontSize: '1rem',
                                                fontWeight: 900,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            💰 شراء فوري - {Number(auction.buy_now_price).toLocaleString('ar-EG')} ج.م
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
