import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { insforge } from '../lib/insforge'

export default function CategoriesPage() {
    const nav = useNavigate()
    const [dbCats, setDbCats] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await insforge.db
                .from('categories')
                .select('*')
                .order('id', { ascending: true })

            if (data) setDbCats(data)
            setLoading(false)
        }
        fetchCats()
    }, [])

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontSize: '1.2rem', fontWeight: 900 }}>⚡ جاري تحميل الأقسام...</div>

    return (
        <>
            <div className="pg-header">
                <div>
                    <h1>📂 الاستكشاف الذكي</h1>
                    <p className="sub">تصفح {dbCats.length} قسماً رئيسياً وآلاف الفئات الفرعية</p>
                </div>
            </div>

            <div className="sec" style={{ marginTop: 24 }}>
                <div className="cat-grid">
                    {dbCats.map((c) => (
                        <div key={c.id} className="cat-tile glass" onClick={() => nav(`/search?cat=${encodeURIComponent(c.name)}`)}>
                            <div className="ci" style={{ color: c.color_hex }}>{c.icon_name}</div>
                            <div className="cn" style={{ color: 'var(--red)' }}>{c.name}</div>
                            <div className="cc">استكشف الفرص الآن</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Categories Banner */}
            <div className="sec" style={{ marginTop: 40, marginBottom: 40 }}>
                <div className="glass" style={{ padding: 25, display: 'flex', alignItems: 'center', gap: 20, background: 'linear-gradient(135deg, var(--bg-card), var(--red-glow))' }}>
                    <div style={{ fontSize: '3rem' }}>💎</div>
                    <div>
                        <h3 style={{ fontWeight: 900 }}>قسم المقتنيات والنادر (Forsa Luxury)</h3>
                        <p style={{ fontSize: '.85rem', color: 'var(--text-2)', marginTop: 5 }}>استكشف السيارات النادرة، الساعات الفاخرة، والعقارات الحصرية في قسمنا الجديد.</p>
                        <button className="btn btn-outline" style={{ marginTop: 12, fontSize: '.75rem' }}>اكتشف الفخامة ←</button>
                    </div>
                </div>
            </div>
        </>
    )
}
