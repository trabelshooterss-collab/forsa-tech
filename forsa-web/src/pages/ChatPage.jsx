import { chats } from '../data'

export default function ChatPage() {
    return (
        <>
            <div className="pg-header">
                <div>
                    <h1>💬 مركز الرسائل والصفقات</h1>
                    <p className="sub">لديك {chats.filter(c => c.unread > 0).length} تنبيهات لم يتم الرد عليها</p>
                </div>
            </div>

            <div className="sec">
                <div className="glass" style={{ overflow: 'hidden', padding: '5px 0' }}>
                    {chats.map(c => (
                        <div key={c.id} className="chat-row" style={{ borderBottom: '1px solid var(--border)' }}>
                            <div className="chat-av glass" style={{ border: 'none', background: 'var(--red-glow)', color: 'var(--red)', fontWeight: 900 }}>{c.avatar}</div>
                            <div className="chat-body">
                                <div className="nm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    {c.name}
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} title="Online"></div>
                                </div>
                                <div className="mg" style={{ fontWeight: c.unread > 0 ? 800 : 500, color: c.unread > 0 ? 'var(--text)' : 'var(--text-3)' }}>{c.msg}</div>
                            </div>
                            <div className="chat-end">
                                <div className="tm" style={{ fontWeight: 700 }}>{c.time}</div>
                                {c.unread > 0 ? (
                                    <div className="chat-dot">{c.unread}</div>
                                ) : (
                                    <div style={{ fontSize: '.8rem', color: 'var(--red)', marginTop: 5 }}>✓✓</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state hint */}
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
                    <p style={{ fontSize: '.75rem' }}>🔒 المحادثات مشفرة تماماً لضمان خصوصيتك.</p>
                </div>
            </div>
        </>
    )
}
