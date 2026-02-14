import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'
import { categories } from '../data'

export default function PostAdPage() {
    const { user, isLoggedIn } = useContext(AuthContext)
    const nav = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [adType, setAdType] = useState('regular')

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        categoryId: '',
        subcategoryId: '',
        city: 'القاهرة',
        phone: '',
        isFeatured: false,
        images: [],
        imageUrls: []
    })

    const activeCategory = categories.find(c => c.id === formData.categoryId)
    const activeSubcategories = activeCategory?.subs || []

    useEffect(() => {
        if (!isLoggedIn) {
            nav('/login')
            return
        }
    }, [isLoggedIn])

    const handleFile = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const newPreviews = selectedFiles.map(f => URL.createObjectURL(f))
        setFormData({
            ...formData,
            images: [...formData.images, ...selectedFiles],
            imageUrls: [...formData.imageUrls, ...newPreviews]
        })
    }

    const removeImage = (index) => {
        const newImages = [...formData.images]
        const newUrls = [...formData.imageUrls]
        newImages.splice(index, 1)
        newUrls.splice(index, 1)
        setFormData({
            ...formData,
            images: newImages,
            imageUrls: newUrls
        })
    }

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('يرجى إدخال عنوان الإعلان')
            return
        }
        if (!formData.categoryId) {
            alert('يرجى اختيار القسم')
            return
        }
        if (formData.images.length === 0) {
            alert('يرجى إضافة صور للإعلان')
            return
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('يرجى إدخال السعر الصحيح')
            return
        }
        if (!formData.subcategoryId) {
            alert('يرجى اختيار القسم الفرعي')
            return
        }
        if (!formData.phone.trim()) {
            alert('يرجى إدخال رقم الهاتف')
            return
        }

        setLoading(true)
        try {
            // Upload images
            const uploadedUrls = []
            for (const file of formData.images) {
                const fileName = `${user.id}/${Date.now()}-${file.name}`
                const { error } = await insforge.storage.from('ad-images').upload(fileName, file)
                if (error) throw error
                const { data: { publicUrl } } = insforge.storage.from('ad-images').getPublicUrl(fileName)
                uploadedUrls.push(publicUrl)
            }

            // Create ad
            const { error } = await insforge.db.from('ads').insert([{
                advertiser_id: user.id,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                city: formData.city,
                category_id: formData.categoryId,
                subcategory_id: formData.subcategoryId,
                image_urls: uploadedUrls,
                is_featured: adType === 'featured' || formData.isFeatured,
                advertiser_phone: formData.phone,
                created_at: new Date().toISOString()
            }])

            if (error) throw error

            alert('🎉 تم نشر إعلانك بنجاح!')
            nav('/')
        } catch (error) {
            console.error('Error posting ad:', error)
            alert('فشل نشر الإعلان: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '40px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', fontWeight: 900, marginBottom: 10, fontSize: '2.5rem' }}>
                    إضافة إعلان جديد
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-3)', marginBottom: 30, fontSize: '1.1rem' }}>
                    اتبع الخطوات البسيطة لنشر إعلانك بسرعة
                </p>

                {/* Ad Type Selection */}
                {step === 1 && (
                    <div className="glass" style={{ padding: 30, borderRadius: 20 }}>
                        <h2 style={{ marginBottom: 30, fontWeight: 900, fontSize: '1.5rem' }}>
                            اختر نوع الإعلان
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                            <div
                                onClick={() => { setAdType('regular'); setStep(2) }}
                                style={{
                                    padding: 30,
                                    borderRadius: 15,
                                    border: '3px solid var(--border)',
                                    background: 'var(--bg)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--red)'
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: 15 }}>📝</div>
                                <h3 style={{ fontWeight: 900, fontSize: '1.3rem' }}>إعلان عادي</h3>
                                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                                    نشر إعلانك مجاناً مع إمكانية التمييز
                                </p>
                            </div>

                            <div
                                onClick={() => { setAdType('featured'); setStep(2) }}
                                style={{
                                    padding: 30,
                                    borderRadius: 15,
                                    border: '3px solid var(--gold)',
                                    background: 'rgba(255, 179, 0, 0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--gold)'
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--gold)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: 15 }}>⭐</div>
                                <h3 style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--gold)' }}>إعلان مميز</h3>
                                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                                    إعلانك يظهر في الصفحة الأولى مع إمكانيات إضافية
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Selection */}
                {step === 2 && (
                    <div className="glass" style={{ padding: 30, borderRadius: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <button
                                className="btn-icon"
                                onClick={() => setStep(1)}
                                style={{ fontSize: '1.5rem', padding: 10 }}
                            >
                                ←
                            </button>
                            <h3 style={{ fontWeight: 900, fontSize: '1.5rem' }}>اختر القسم</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 15 }}>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => {
                                        setFormData({ ...formData, categoryId: cat.id, subcategoryId: '' })
                                        setStep(3)
                                    }}
                                    style={{
                                        padding: 25,
                                        borderRadius: 15,
                                        border: '3px solid var(--border)',
                                        background: formData.categoryId === cat.id ? 'var(--red)' : 'var(--bg)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        textAlign: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--red)'
                                        e.currentTarget.style.transform = 'translateY(-5px)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{cat.icon}</div>
                                    <div style={{ fontWeight: 900, fontSize: '1rem' }}>{cat.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Details */}
                {step === 3 && (
                    <div className="glass" style={{ padding: 30, borderRadius: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <button
                                className="btn-icon"
                                onClick={() => setStep(2)}
                                style={{ fontSize: '1.5rem', padding: 10 }}
                            >
                                ←
                            </button>
                            <h3 style={{ fontWeight: 900, fontSize: '1.5rem' }}>تفاصيل الإعلان</h3>
                        </div>

                        <div style={{ display: 'grid', gap: 20, marginBottom: 20 }}>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                    القسم الفرعي
                                </label>
                                <select
                                    value={formData.subcategoryId}
                                    onChange={e => setFormData({ ...formData, subcategoryId: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        borderRadius: 10,
                                        border: '2px solid var(--border)',
                                        background: 'var(--bg)',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                    required
                                >
                                    <option value="">اختر القسم الفرعي</option>
                                    {activeSubcategories.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                    المدينة
                                </label>
                                <select
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        borderRadius: 10,
                                        border: '2px solid var(--border)',
                                        background: 'var(--bg)',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option>القاهرة</option>
                                    <option>الجيزة</option>
                                    <option>الإسكندرية</option>
                                    <option>طنطا</option>
                                    <option>المنصورة</option>
                                    <option>الإسماعيلية</option>
                                    <option>أسيوط</option>
                                    <option>سوهاج</option>
                                    <option>المنيا</option>
                                    <option>الفيوم</option>
                                    <option>بني سويف</option>
                                    <option>قنا</option>
                                    <option>الأقصر</option>
                                    <option>أسوان</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                عنوان الإعلان
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="ماذا تبيع؟"
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '2px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                السعر المطلوب (ج.م)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0"
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '2px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                رقم الهاتف
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="01xxxxxxxxx"
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '2px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                وصف الإعلان
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="اكتب تفاصيل أكثر لجذب المشترين..."
                                style={{
                                    width: '100%',
                                    minHeight: 150,
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '2px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '1rem' }}>
                                صور الإعلان
                            </label>
                            <div
                                onClick={() => document.getElementById('file-input').click()}
                                style={{
                                    width: '100%',
                                    padding: 40,
                                    borderRadius: 10,
                                    border: '2px dashed var(--border)',
                                    background: 'var(--bg)',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--red)'
                                    e.currentTarget.style.background = 'rgba(229, 57, 53, 0.05)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)'
                                    e.currentTarget.style.background = 'var(--bg)'
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: 10 }}>📷</div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>اضغط لإضافة صور</div>
                                <div style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginTop: 5 }}>
                                    يمكنك إضافة صور متعددة
                                </div>
                            </div>
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFile}
                                style={{ display: 'none' }}
                            />

                            {formData.imageUrls.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginTop: 15 }}>
                                    {formData.imageUrls.map((url, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: 10,
                                                    border: '2px solid var(--border)'
                                                }}
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    background: 'var(--red)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontWeight: 900
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {adType === 'regular' && (
                            <div style={{
                                padding: 20,
                                borderRadius: 15,
                                background: 'rgba(255, 179, 0, 0.05)',
                                border: '2px solid var(--gold)',
                                marginBottom: 20
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 700 }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        style={{ width: 20, height: 20, accentColor: 'var(--gold)' }}
                                    />
                                    <span>تمييز الإعلان (يظهر في الصفحة الأولى)</span>
                                </label>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 20,
                                borderRadius: 10,
                                background: 'var(--red)',
                                color: '#fff',
                                border: 'none',
                                fontSize: '1.2rem',
                                fontWeight: 900,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? 'جاري النشر...' : '🚀 نشر الإعلان الآن'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
