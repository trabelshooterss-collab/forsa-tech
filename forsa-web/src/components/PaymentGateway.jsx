import { useState } from 'react'
import { insforge } from '../lib/insforge'

export default function PaymentGateway({ amount, onSuccess, onCancel, orderId }) {
    const [selectedMethod, setSelectedMethod] = useState('card')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        fawryNumber: ''
    })

    const paymentMethods = [
        { id: 'card', name: 'بطاقة ائتمانية', icon: '💳' },
        { id: 'visa', name: 'Visa', icon: '💳' },
        { id: 'mastercard', name: 'Mastercard', icon: '💳' },
        { id: 'fawry', name: 'فوري', icon: '📱' },
        { id: 'wallet', name: 'محفظة فرصة', icon: '💰' }
    ]

    const handlePayment = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Create payment record in database
            const { data: paymentData, error: paymentError } = await insforge.db
                .from('payments')
                .insert([{
                    order_id: orderId,
                    user_id: (await insforge.auth.getUser()).data.user.id,
                    amount: amount,
                    method: selectedMethod,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()

            if (paymentError) throw paymentError

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Update payment status
            const { error: updateError } = await insforge.db
                .from('payments')
                .update({ status: 'completed' })
                .eq('id', paymentData.id)

            if (updateError) throw updateError

            onSuccess(paymentData)
        } catch (error) {
            console.error('Payment error:', error)
            alert('فشلت عملية الدفع: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="payment-gateway glass" style={{
            padding: 30,
            borderRadius: 20,
            maxWidth: 500,
            margin: '0 auto'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30, fontWeight: 900 }}>
                💳 إتمام الدفع
            </h2>

            {/* Payment Methods */}
            <div style={{ marginBottom: 30 }}>
                <label style={{ display: 'block', marginBottom: 10, fontWeight: 700 }}>
                    اختر طريقة الدفع
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                    {paymentMethods.map(method => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            style={{
                                padding: 15,
                                borderRadius: 12,
                                border: `2px solid ${selectedMethod === method.id ? 'var(--red)' : 'var(--border)'}`,
                                background: selectedMethod === method.id ? 'rgba(229, 57, 53, 0.05)' : 'var(--bg)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>{method.icon}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{method.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment}>
                {selectedMethod === 'card' || selectedMethod === 'visa' || selectedMethod === 'mastercard' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
                                رقم البطاقة
                            </label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={formData.cardNumber}
                                onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                maxLength={19}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
                                    تاريخ الانتهاء
                                </label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input
                                        type="text"
                                        placeholder="MM"
                                        value={formData.expiryMonth}
                                        onChange={e => setFormData({ ...formData, expiryMonth: e.target.value })}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 8,
                                            border: '1px solid var(--border)',
                                            background: 'var(--bg)',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            textAlign: 'center'
                                        }}
                                        maxLength={2}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="YY"
                                        value={formData.expiryYear}
                                        onChange={e => setFormData({ ...formData, expiryYear: e.target.value })}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 8,
                                            border: '1px solid var(--border)',
                                            background: 'var(--bg)',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            textAlign: 'center'
                                        }}
                                        maxLength={2}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    value={formData.cvv}
                                    onChange={e => setFormData({ ...formData, cvv: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        borderRadius: 8,
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg)',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        textAlign: 'center'
                                    }}
                                    maxLength={3}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
                                اسم حامل البطاقة
                            </label>
                            <input
                                type="text"
                                placeholder="الاسم كما هو مكتوب على البطاقة"
                                value={formData.holderName}
                                onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                    </div>
                ) : selectedMethod === 'fawry' ? (
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
                            رقم فوري
                        </label>
                        <input
                            type="text"
                            placeholder="أدخل رقم فوري الخاص بك"
                            value={formData.fawryNumber}
                            onChange={e => setFormData({ ...formData, fawryNumber: e.target.value })}
                            style={{
                                width: '100%',
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                outline: 'none',
                                fontSize: '1rem',
                                direction: 'ltr',
                                textAlign: 'center'
                            }}
                            required
                        />
                        <p style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-3)' }}>
                            سيتم إرسال رمز تأكيد إلى رقم فوري الخاص بك
                        </p>
                    </div>
                ) : (
                    <div style={{
                        padding: 20,
                        textAlign: 'center',
                        background: 'rgba(229, 57, 53, 0.05)',
                        borderRadius: 12,
                        border: '1px solid var(--red-glow)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 10 }}>💰</div>
                        <h3 style={{ marginBottom: 10 }}>الدفع من محفظة فرصة</h3>
                        <p style={{ color: 'var(--text-3)' }}>
                            سيتم خصم المبلغ من رصيدك في محفظة فرصة
                        </p>
                    </div>
                )}

                {/* Amount Display */}
                <div style={{
                    marginTop: 30,
                    padding: 20,
                    background: 'var(--bg-soft)',
                    borderRadius: 12,
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', marginBottom: 5 }}>
                        المبلغ الإجمالي
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--red)' }}>
                        {amount.toLocaleString('ar-EG')} ج.م
                    </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: 15,
                            borderRadius: 12,
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            cursor: 'pointer',
                            fontWeight: 700
                        }}
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: 15,
                            borderRadius: 12,
                            border: 'none',
                            background: 'var(--red)',
                            color: '#fff',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <span className="spinner" /> : 'دفع الآن'}
                    </button>
                </div>
            </form>
        </div>
    )
}
