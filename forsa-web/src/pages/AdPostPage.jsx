import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'
import { categories } from '../data'
import './AdPost.css'

export default function AdPostPage() {
    const { user, isLoggedIn } = useContext(AuthContext)
    const nav = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [adType, setAdType] = useState('regular') // regular, featured, auction

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        desc: '',
        catId: '',
        subId: '',
        city: 'القاهرة',
        phone: '',
        isFeatured: false,
        images: [],
        imageUrls: []
    })

    useEffect(() => {
        if (!isLoggedIn) {
            nav('/login')
        }
    }, [isLoggedIn])

    const activeCatData = categories.find(c => c.id === formData.catId)
    const activeSubs = activeCatData?.subs || []

    const handleFile = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const newPreviews = selectedFiles.map(f => URL.createObjectURL(f))
        setFormData({
            ...formData,
            images: [...formData.images, ...selectedFiles],
            imageUrls: [...formData.imageUrls, ...newPreviews]
        })
    }

    const removeImg = (index) => {
        const u = [...formData.imageUrls]
        const f = [...formData.images]
        u.splice(index, 1)
        f.splice(index, 1)
        setFormData({ ...formData, imageUrls: u, images: f })
    }

    const _submit = async () => {
        if (!formData.title || !formData.catId || !formData.price || !formData.phone) {
            return alert('يرجى إكمال جميع البيانات الأساسية')
        }

        setLoading(true)
        try {
            const uploadedUrls = []
            for (const file of formData.images) {
                const fileName = `${user?.id || 'anon'}/${Date.now()}-${file.name}`
                const { error } = await insforge.storage.from('ad-images').upload(fileName, file)
                if (error) throw error
                const { data: { publicUrl } } = insforge.storage.from('ad-images').getPublicUrl(fileName)
                uploadedUrls.push(publicUrl)
            }

            const { error } = await insforge.db.from('ads').insert([{
                advertiser_id: user?.id,
                title: formData.title,
                description: formData.desc,
                price: parseFloat(formData.price),
                city: formData.city,
                category_id: formData.catId,
                subcategory_id: formData.subId,
                image_urls: uploadedUrls,
                is_featured: adType === 'featured' || formData.isFeatured,
                advertiser_phone: formData.phone,
                created_at: new Date().toISOString()
            }])

            if (error) throw error
            alert('🚀 تم النشر بنجاح!')
            nav('/')
        } catch (err) {
            alert('حدث خطأ أثناء النشر: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const StepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                    width: 50, height: 5, borderRadius: 10,
                    background: step >= i ? 'var(--grad-gold)' : 'var(--border)',
                    boxShadow: step >= i ? 'var(--shadow-gold-small)' : 'none',
                    transition: '.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
            ))}
        </div>
    )

    return (
        <div className="pg pg-premium animate-fade-in" style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div className="brand-reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 className="premium-text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>بيّع أي حاجة.. في أي حتة! 🚀</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '1.1rem', marginTop: 10 }}>خطوات بسيطة ويوصل إعلانك للملايين</p>
                </div>

                <StepIndicator />

                {/* Step 1: Type Selection */}
                {step === 1 && (
                    <div className="glass-gold animate-slide-up" style={{ padding: 40, borderRadius: 32 }}>
                        <h2 style={{ fontWeight: 900, marginBottom: 30, textAlign: 'center' }}>إيه نوع الإعلان اللي حابب تنشره؟</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                            <div className="cat-card-premium glass shine-effect" onClick={() => { setAdType('regular'); setStep(2) }} style={{ padding: 30 }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: 15 }}>📝</div>
                                <h3 style={{ fontWeight: 900 }}>إعلان عادي</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>نشر مجاني وبسيط</p>
                            </div>
                            <div className="cat-card-premium glass-gold is-gold animate-pulse-gold shine-effect" onClick={() => { setAdType('featured'); setStep(2) }} style={{ padding: 30 }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: 15 }}>⭐</div>
                                <h3 style={{ fontWeight: 900 }}>إعلان ذهبي</h3>
                                <p style={{ fontSize: '0.8rem' }}>ظهور مضاعف في المقدمة</p>
                            </div>
                            <div className="cat-card-premium glass shine-effect" onClick={() => nav('/create-auction')} style={{ padding: 30, border: '1px solid var(--red)' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: 15 }}>🔴</div>
                                <h3 style={{ fontWeight: 900, color: 'var(--red)' }}>مزاد حي</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>بيع لأعلى سعر فوراً</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Category */}
                {step === 2 && (
                    <div className="glass animate-slide-up" style={{ padding: 40, borderRadius: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                            <button className="btn-icon glass shine-effect" onClick={() => setStep(1)}>←</button>
                            <h2 style={{ fontWeight: 900 }}>اختر القسم المناسب</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 15 }}>
                            {categories.map(c => (
                                <div key={c.id} className={`cat-card-premium glass shine-effect ${formData.catId === c.id ? 'active' : ''}`}
                                    onClick={() => { setFormData({ ...formData, catId: c.id }); setStep(3); }}
                                    style={{ padding: 25 }}>
                                    <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>{c.icon}</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                    <div className="glass animate-slide-up" style={{ padding: 40, borderRadius: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                            <button className="btn-icon glass shine-effect" onClick={() => setStep(2)}>←</button>
                            <h2 style={{ fontWeight: 900 }}>تفاصيل الإعلان</h2>
                        </div>

                        <div className="fg" style={{ marginBottom: 25 }}>
                            <label style={{ fontWeight: 800, marginBottom: 10, display: 'block' }}>القسم الفرعي</label>
                            <select className="fselect premium-select" style={{ width: '100%', padding: '15px', borderRadius: 15, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}
                                value={formData.subId} onChange={e => setFormData({ ...formData, subId: e.target.value })}>
                                <option value="">اختر القسم الفرعي...</option>
                                {activeSubs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="fg" style={{ marginBottom: 25 }}>
                            <label style={{ fontWeight: 800, marginBottom: 10, display: 'block' }}>عنوان الإعلان</label>
                            <input className="finput premium-input" placeholder="مثال: آيفون 15 برو ماكس حالة الزيرو" style={{ width: '100%', padding: '15px' }}
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 25 }}>
                            <div className="fg">
                                <label style={{ fontWeight: 800, marginBottom: 10, display: 'block' }}>السعر (ج.م)</label>
                                <input className="finput" type="number" placeholder="0" style={{ width: '100%' }}
                                    value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="fg">
                                <label style={{ fontWeight: 800, marginBottom: 10, display: 'block' }}>رقم الموبايل</label>
                                <input className="finput" placeholder="01xxxxxxxxx" style={{ width: '100%' }}
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="fg" style={{ marginBottom: 30 }}>
                            <label style={{ fontWeight: 800, marginBottom: 10, display: 'block' }}>وصف الإعلان</label>
                            <textarea className="finput" rows={5} placeholder="اكتب كل التفاصيل اللي تهم المشتري (اللون، الضمان، الحالة...)" style={{ width: '100%' }}
                                value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                        </div>

                        <button className="btn-premium-large shine-effect" style={{ width: '100%', background: 'var(--grad-liquid)' }} onClick={() => setStep(4)}>التالي (الصور) ←</button>
                    </div>
                )}

                {/* Step 4: Images & Reveal */}
                {step === 4 && (
                    <div className="glass animate-slide-up" style={{ padding: 40, borderRadius: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                            <button className="btn-icon glass shine-effect" onClick={() => setStep(3)}>←</button>
                            <h2 style={{ fontWeight: 900 }}>صور الإعلان</h2>
                        </div>

                        <div className="dropzone glass-hover" onClick={() => document.getElementById('fi').click()}
                            style={{ border: '3px dashed var(--border)', borderRadius: 20, padding: 60, textAlign: 'center', cursor: 'pointer' }}>
                            <input type="file" id="fi" multiple hidden onChange={handleFile} />
                            <div style={{ fontSize: '4rem' }}>📸</div>
                            <p style={{ fontWeight: 900, marginTop: 15 }}>اضغط لإضافة صور لسلعتك</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>يفضل صور واضحة من زوايا مختلفة</p>
                        </div>

                        {formData.imageUrls.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginTop: 25 }}>
                                {formData.imageUrls.map((url, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                                        <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 15, border: '2px solid var(--gold)' }} />
                                        <button onClick={() => removeImg(i)} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--red)', border: 'none', borderRadius: '50%', color: '#fff', width: 26, height: 26, fontWeight: 900 }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="premium-banner glass-gold shine-effect" style={{ padding: 25, borderRadius: 20, marginTop: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontWeight: 900, color: 'var(--gold)' }}>🛒 جاهز للانطلاق؟</h4>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>إعلانك هيكون متاح لآلاف المستخدمين فوراً</p>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <small>الإجمالي:</small>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{parseFloat(formData.price || 0).toLocaleString()} ج.م</div>
                            </div>
                        </div>

                        <button className="btn-premium-large shine-effect" style={{ width: '100%', marginTop: 30, background: 'var(--grad-gold)', color: '#000' }} onClick={_submit} disabled={loading}>
                            {loading ? 'جاري التحليق بإعلانك... 🚀' : 'نشر الإعلان الآن ✨'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
