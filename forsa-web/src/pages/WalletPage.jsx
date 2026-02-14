import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { transactions } from '../data'

export default function WalletPage() {
    const { user } = useContext(AuthContext)
    return (
        <>
            <div className="pg-header">
                <div>
                    <h1>💰 محفظتي السحابية</h1>
                    <p className="sub">إدارة عملات "فرصة" والعمليات المالية</p>
                </div>
            </div>

            <div className="wallet-banner glass" style={{ border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 15 }}>
                    <span style={{ fontSize: '3.5rem' }}>🪙</span>
                    <div style={{ textAlign: 'right' }}>
                        <div className="amt">{(user?.coins || 2450).toLocaleString()}</div>
                        <div className="lbl">عملة فرصة (Forsa Coins)</div>
                    </div>
                </div>
                <div className="w-btns" style={{ marginTop: 30 }}>
                    <button className="btn" style={{ flex: 1, padding: '15px' }}>💳 شحن الرصيد</button>
                    <button className="btn" style={{ flex: 1, padding: '15px' }}>↔️ تحويل سريع</button>
                </div>
            </div>

            <div className="sec">
                <div className="glass" style={{ padding: 25 }}>
                    <div className="sec-head">
                        <h2 style={{ fontSize: '1.1rem' }}>📋 السجل المالي الآمن</h2>
                        <button className="btn btn-ghost">تصدير PDF</button>
                    </div>
                    <div className="tx-list" style={{ padding: 0, marginTop: 10 }}>
                        {transactions.map(tx => (
                            <div key={tx.id} className="tx-row">
                                <div className="tx-ico glass" style={{ background: tx.bg, color: tx.color }}>{tx.icon}</div>
                                <div className="tx-info">
                                    <div className="t" style={{ fontSize: '.9rem' }}>{tx.title}</div>
                                    <div className="d">{tx.date} • #TX-{tx.id}9384</div>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div className={`tx-val ${tx.amount > 0 ? 'plus' : 'minus'}`} style={{ fontSize: '1.1rem' }}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '.6rem', color: 'var(--text-3)', fontWeight: 800 }}>مكتملة ✅</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {transactions.length === 0 && (
                        <div className="empty">
                            <h3>لا يوجد عمليات حالياً</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Rewards Section */}
            <div className="sec" style={{ marginBottom: 40 }}>
                <div className="glass" style={{ padding: 25, border: '1.5px dashed var(--gold)', background: 'rgba(255, 179, 0, 0.05)' }}>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                        <span style={{ fontSize: '2.5rem' }}>🎁</span>
                        <div>
                            <h4 style={{ fontWeight: 900 }}>برنامج الولاء (Forsa Rewards)</h4>
                            <p style={{ fontSize: '.8rem', color: 'var(--text-2)' }}>لقد حصلت على 45 عملة مجانية هذا الشهر من خلال تقييماتك للمشترين! استمر لتربح المزيد.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
