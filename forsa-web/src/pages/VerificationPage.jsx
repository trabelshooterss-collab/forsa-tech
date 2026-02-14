import { useState } from 'react'

export default function VerificationPage() {
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)

    const nextStep = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setStep(prev => prev + 1)
        }, 1500)
    }

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{ fontWeight: 900 }}>🛡️ توثيق هويتك</h1>
                <p style={{ color: 'var(--text-3)' }}>كن بائعاً موثوقاً في مجتمع فرصة-تك</p>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 10, background: step >= 0 ? 'var(--red)' : 'var(--bg-soft)' }} />
                <div style={{ flex: 1, height: 6, borderRadius: 10, background: step >= 1 ? 'var(--red)' : 'var(--bg-soft)' }} />
                <div style={{ flex: 1, height: 6, borderRadius: 10, background: step >= 2 ? 'var(--red)' : 'var(--bg-soft)' }} />
            </div>

            <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
                {step === 0 && (
                    <>
                        <div style={{ fontSize: '5rem', marginBottom: 20 }}>💎</div>
                        <h2 style={{ fontWeight: 900, marginBottom: 15 }}>لماذا يجب أن توثق حسابك؟</h2>
                        <ul style={{ textAlign: 'right', display: 'inline-block', margin: '20px 0 30px', padding: 0, listStyle: 'none' }}>
                            <li style={{ marginBottom: 12 }}>🛡️ حماية كاملة عبر <b>Forsa Shield</b></li>
                            <li style={{ marginBottom: 12 }}>✔️ علامة التوثيق الزرقاء بجانب اسمك</li>
                            <li style={{ marginBottom: 12 }}>🚀 أولوية 2x في ظهور إعلاناتك</li>
                            <li style={{ marginBottom: 12 }}>🤝 ثقة فورية من المشترين الجاديين</li>
                        </ul>
                        <button className="btn btn-primary" style={{ width: '100%', padding: 18 }} onClick={() => setStep(1)}>ابدأ التوثيق الآن (مجاناً)</button>
                    </>
                )}

                {step === 1 && (
                    <>
                        <h3 style={{ fontWeight: 900, marginBottom: 10 }}>🆔 تصوير الهوية</h3>
                        <p style={{ fontSize: '.85rem', color: 'var(--text-3)', marginBottom: 30 }}>تأكد من أن البيانات واضحة والإضاءة جيدة</p>

                        <div className="dropzone" style={{ border: '2px dashed var(--border)', padding: 50, marginBottom: 30, borderRadius: 15 }}>
                            <div style={{ fontSize: '3rem', marginBottom: 15 }}>🪪</div>
                            <p>ارفع صورة البطاقة الأمامية</p>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: 18 }} onClick={nextStep} disabled={loading}>
                            {loading ? <span className="spinner" /> : 'متابعة ←'}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 style={{ fontWeight: 900, marginBottom: 10 }}>🎥 سيلفي الفيديو</h3>
                        <p style={{ fontSize: '.85rem', color: 'var(--text-3)', marginBottom: 30 }}>التحقق من الكائنات الحية (Liveness Detection)</p>

                        <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 30px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--red)' }}>
                            <div style={{ background: 'var(--bg-soft)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: '4rem' }}>🤳</div>
                            </div>
                            <div style={{ position: 'absolute', inset: 0, border: '6px solid transparent', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'rotate 2s linear infinite' }} />
                        </div>

                        <p style={{ color: 'var(--red)', fontWeight: 900, marginBottom: 25 }}>يرجى تحريك رأسك ببطء داخل الدائرة</p>

                        <button className="btn btn-primary" style={{ width: '100%', padding: 18 }} onClick={nextStep} disabled={loading}>
                            {loading ? <span className="spinner" /> : 'تأكيد الفيديو ←'}
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div style={{ fontSize: '5rem', marginBottom: 20 }}>🎉</div>
                        <h2 style={{ fontWeight: 900, marginBottom: 15 }}>تم إرسال طلبك!</h2>
                        <p style={{ color: 'var(--text-3)', marginBottom: 30 }}>فريق المراجعة سيقوم بالتحقق من بياناتك خلال 24 ساعة.</p>
                        <button className="btn btn-primary" style={{ width: '100%', padding: 18 }} onClick={() => window.location.href = '/profile'}>العودة للملف الشخصي</button>
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
