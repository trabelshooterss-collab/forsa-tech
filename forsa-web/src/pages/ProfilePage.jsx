import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import { insforge } from '../lib/insforge'

export default function ProfilePage() {
    const { user, logout } = useContext(AuthContext)
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [adCount, setAdCount] = useState(0)
    const nav = useNavigate()

    useEffect(() => {
        if (user) {
            const fetchAdCount = async () => {
                const { count, error } = await insforge.db
                    .from('ads')
                    .select('*', { count: 'exact', head: true })
                    .eq('advertiser_id', user.id)

                if (!error) setAdCount(count || 0)
            }
            fetchAdCount()
        }
    }, [user])

    const menuGroups = [
        {
            title: 'إدارة حسابي الفني',
            items: [
                { icon: '💰', label: 'المحفظة والتمويل', desc: 'إدارة العملات والمعاملات', bg: '#FFEBEE', go: () => nav('/wallet') },
                { icon: '📋', label: 'إعلاناتي النشطة', desc: `${adCount} إعلان قيد العرض`, bg: '#E3F2FD' },
                { icon: '📊', label: 'إحصائيات الأداء', desc: 'مشاهدات، نقرات، تفاعل', bg: '#E8F5E9' },
            ]
        },
        {
            title: 'إعدادات المنصة',
            items: [
                { icon: '🛡️', label: 'الأمان والخصوصية', desc: 'توثيق الحساب، كلمة المرور', bg: '#F3E5F5', go: () => nav('/verify') },
                { icon: '⚙️', label: 'التفضيلات', desc: 'اللغة، المنطقة، التنبيهات', bg: '#F5F5F5' },
                { icon: theme === 'light' ? '🌙' : '☀️', label: `الوضع ${theme === 'light' ? 'الداكن' : 'الفاتح'}`, desc: 'تبديل مظهر التطبيق', bg: '#FFF3E0', go: toggleTheme },
            ]
        }
    ]

    return (
        <>
            <div className="prof-hero glass" style={{ margin: '20px 28px', borderRadius: 'var(--r-lg)', border: 'none' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div className="prof-av">{user?.user_metadata?.full_name?.charAt(0) || '👤'}</div>
                    <div style={{ position: 'absolute', bottom: 15, left: 0, background: '#1da1f2', color: '#fff', fontSize: '.6rem', padding: '2px 8px', borderRadius: 10, border: '2px solid #fff', fontWeight: 900 }}>PRO</div>
                </div>
                <div className="nm" style={{ marginTop: 10 }}>{user?.user_metadata?.full_name || 'مستخدم فرصة'}</div>
                <div className="em">{user?.email || 'admin@forsa.com'}</div>

                <div className="prof-stats glass" style={{ margin: '20px auto 0', maxWidth: 500, padding: 20, boxShadow: 'none', background: 'rgba(255,255,255,0.4)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="st"><div className="v">{adCount}</div><div className="l">إعلان</div></div>
                    <div className="st"><div className="v">420</div><div className="l">متابِع</div></div>
                    <div className="st"><div className="v" style={{ color: 'var(--red)' }}>⭐️ 4.9</div><div className="l">تقييم</div></div>
                    <div className="st"><div className="v">🥈</div><div className="l">بائع فضي</div></div>
                </div>
            </div>

            <div className="sec">
                {menuGroups.map((group, idx) => (
                    <div key={idx} style={{ marginBottom: 30 }}>
                        <h4 style={{ fontWeight: 900, marginBottom: 15, paddingRight: 5, fontSize: '.9rem', color: 'var(--text-3)' }}>{group.title}</h4>
                        <div className="glass" style={{ padding: '5px 0', overflow: 'hidden' }}>
                            {group.items.map((m, i) => (
                                <div key={i} className="menu-row" onClick={m.go} style={{ borderBottom: i === group.items.length - 1 ? 'none' : '1px solid var(--border)' }}>
                                    <div className="m-ico glass" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : m.bg }}>{m.icon}</div>
                                    <div className="m-txt" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700 }}>{m.label}</span>
                                        <span style={{ fontSize: '.65rem', color: 'var(--text-3)', fontWeight: 600 }}>{m.desc}</span>
                                    </div>
                                    <span className="m-arr">◀</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="glass" style={{ padding: 5, marginBottom: 40 }}>
                    <div className="menu-row" onClick={logout} style={{ border: 'none' }}>
                        <div className="m-ico" style={{ background: '#FFEBEE' }}>🚪</div>
                        <div className="m-txt"><span style={{ color: 'var(--red)', fontWeight: 800 }}>تسجيل الخروج الآمن</span></div>
                        <span className="m-arr" style={{ color: 'var(--red)' }}>◀</span>
                    </div>
                </div>
            </div>
        </>
    )
}
