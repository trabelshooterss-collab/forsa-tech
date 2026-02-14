import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'

export default function CreateAuctionPage() {
    const { user, isLoggedIn } = useContext(AuthContext)
    const nav = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [auctionsEnabled, setAuctionsEnabled] = useState(true)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        city: 'القاهرة',
        condition: 'مستعمل - بحالة ممتازة',
        startPrice: '',
        buyNowPrice: '',
        minIncrement: '',
        startTime: '',
        endTime: '',
        categoryId: '',
        isFeatured: false,
        images: [],
        imageUrls: []
    })

    useEffect(() => {
        if (!isLoggedIn) {
            nav('/login')
            return
        }

        fetchCategories()
    }, [isLoggedIn])

    const fetchCategories = async () => {
        try {
            const { data } = await insforge.db
                .from('categories')
                .select('*')
                .order('name')
            if (data) setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

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

    const validateStep1 = () => {
        if (!formData.title.trim()) {
            alert('يرجى إدخال عنوان المزاد')
            return false
        }
        if (!formData.description.trim()) {
            alert('يرجى إدخال وصف المزاد')
            return false
        }
        if (!formData.categoryId) {
            alert('يرجى اختيار القسم')
            return false
        }
        return true
    }

    const validateStep2 = () => {
        if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
            alert('يرجى إدخال سعر البداية الصحيح')
            return false
        }
        if (formData.buyNowPrice && parseFloat(formData.buyNowPrice) <= parseFloat(formData.startPrice)) {
            alert('سعر الشراء الفوري يجب أن يكون أعلى من سعر البداية (أو اتركه فارغاً)')
            return false
        }
        if (!formData.minIncrement || parseFloat(formData.minIncrement) <= 0) {
            alert('يرجى إدخال الحد الأدنى للزيادة الصحيح')
            return false
        }
        if (!formData.startTime) {
            alert('يرجى اختيار وقت البداية')
            return false
        }
        if (!formData.endTime) {
            alert('يرجى اختيار وقت النهاية')
            return false
        }
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            alert('وقت النهاية يجب أن يكون بعد وقت البداية')
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateStep1() || !validateStep2()) return

        if (formData.images.length === 0) {
            alert('يرجى إضافة صور للمزاد')
            return
        }

        setLoading(true)
        try {
            // Upload images
            const uploadedUrls = []
            for (const file of formData.images) {
                const fileName = `${user.id}/${Date.now()}-${file.name}`
                const { error } = await insforge.storage.from('auction-images').upload(fileName, file)
                if (error) throw error
                const { data: { publicUrl } } = insforge.storage.from('auction-images').getPublicUrl(fileName)
                uploadedUrls.push(publicUrl)
            }

            // Create auction
            const startTime = new Date(formData.startTime)
            const status = startTime > new Date() ? 'scheduled' : 'active'
            const buyNowPrice = formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null
            const { error } = await insforge.db.from('auctions').insert([{
                title: formData.title,
                description: formData.description,
                city: formData.city,
                item_condition: formData.condition,
                start_price: parseFloat(formData.startPrice),
                buy_now_price: buyNowPrice,
                min_increment: parseFloat(formData.minIncrement),
                start_time: formData.startTime,
                end_time: formData.endTime,
                category_id: formData.categoryId,
                image_urls: uploadedUrls,
                advertiser_id: user.id,
                current_bid: parseFloat(formData.startPrice),
                status,
                is_featured: formData.isFeatured,
                created_at: new Date().toISOString()
            }])

            if (error) throw error

            alert('🎉 تم إنشاء المزاد بنجاح!')
            nav('/auctions')
        } catch (error) {
            console.error('Error creating auction:', error)
            if (error?.code === '42P01') setAuctionsEnabled(false)
            alert('فشل إنشاء المزاد: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const StepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    background: step >= i ? 'var(--red)' : 'var(--bg-soft)',
                    transition: '.3s'
                }} />
            ))}
        </div>
    )

    return (
        <div style={{ padding: '40px 20px' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', fontWeight: 900, marginBottom: 10 }}>
                    {step < 4 ? 'إنشاء مزاد جديد' : 'تم النشر!'}
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-3)', marginBottom: 30 }}>
                    اتبع الخطوات البسيطة لإنشاء مزاد ناجح
                </p>

                <StepIndicator />

                {!auctionsEnabled && (
                    <div className="glass" style={{ padding: 20, marginBottom: 20 }}>
                        <h3 style={{ marginBottom: 10, fontWeight: 900 }}>ميزة المزادات غير مفعلة بعد</h3>
                        <p style={{ color: 'var(--text-3)', lineHeight: 1.8 }}>
                            لازم يتعمل جدول المزادات (auctions + bids) في قاعدة البيانات علشان النشر والمزايدات تشتغل.
                        </p>
                        <button className="btn btn-primary" onClick={() => nav('/create')}>
                            رجوع
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="glass" style={{ padding: 20 }}>
                        <h3 style={{ marginBottom: 20, fontWeight: 800 }}>1. معلومات المزاد</h3>

                        <div className="fg" style={{ marginBottom: 20 }}>
                            <label>عنوان المزاد</label>
                            <input
                                className="finput"
                                placeholder="ماذا تبيع في المزاد؟"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="fg" style={{ marginBottom: 20 }}>
                            <label>القسم</label>
                            <select
                                className="fselect"
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">اختر القسم</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                            <div className="fg">
                                <label>المدينة</label>
                                <select
                                    className="fselect"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                >
                                    <option>القاهرة</option>
                                    <option>الجيزة</option>
                                    <option>الإسكندرية</option>
                                    <option>طنطا</option>
                                    <option>المنصورة</option>
                                    <option>الإسماعيلية</option>
                                    <option>أسيوط</option>
                                    <option>سوهاج</option>
                                </select>
                            </div>

                            <div className="fg">
                                <label>حالة المنتج</label>
                                <select
                                    className="fselect"
                                    value={formData.condition}
                                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                >
                                    <option>جديد</option>
                                    <option>مستعمل - بحالة ممتازة</option>
                                    <option>مستعمل - بحالة جيدة</option>
                                    <option>بحاجة لصيانة</option>
                                </select>
                            </div>
                        </div>

                        <div className="fg" style={{ marginBottom: 20 }}>
                            <label>وصف المزاد</label>
                            <textarea
                                className="finput"
                                rows={5}
                                placeholder="اكتب تفاصيل المزاد..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: 18, marginTop: 10 }}
                            onClick={() => {
                                if (validateStep1()) setStep(2)
                            }}
                        >
                            التالي ←
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <button className="btn-icon" onClick={() => setStep(1)}>←</button>
                            <h3 style={{ fontWeight: 800 }}>2. الأسعار والتوقيت</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                            <div className="fg">
                                <label>سعر البداية (ج.م)</label>
                                <input
                                    className="finput"
                                    type="number"
                                    placeholder="0"
                                    value={formData.startPrice}
                                    onChange={e => setFormData({ ...formData, startPrice: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="fg">
                                <label>الحد الأدنى للزيادة (ج.م)</label>
                                <input
                                    className="finput"
                                    type="number"
                                    placeholder="100"
                                    value={formData.minIncrement}
                                    onChange={e => setFormData({ ...formData, minIncrement: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="fg" style={{ marginBottom: 20 }}>
                            <label>سعر الشراء الفوري (ج.م)</label>
                            <input
                                className="finput"
                                type="number"
                                placeholder="0"
                                value={formData.buyNowPrice}
                                onChange={e => setFormData({ ...formData, buyNowPrice: e.target.value })}
                            />
                            <small style={{ color: 'var(--text-3)' }}>
                                اختياري: السعر الذي يمكن للمشتري دفعه لشراء المنتج فوراً
                            </small>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                            <div className="fg">
                                <label>وقت البداية</label>
                                <input
                                    className="finput"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="fg">
                                <label>وقت النهاية</label>
                                <input
                                    className="finput"
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: 18, marginTop: 10 }}
                            onClick={() => {
                                if (validateStep2()) setStep(3)
                            }}
                        >
                            التالي ←
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="glass" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <button className="btn-icon" onClick={() => setStep(2)}>←</button>
                            <h3 style={{ fontWeight: 800 }}>3. صور المزاد</h3>
                        </div>

                        <div className="dropzone" onClick={() => document.getElementById('auctionFileInput').click()}>
                            <input type="file" id="auctionFileInput" multiple style={{ display: 'none' }} onChange={handleFile} />
                            <div style={{ fontSize: '3rem' }}>📸</div>
                            <p style={{ fontWeight: 700, margin: '10px 0' }}>اضغط لإضافة صور</p>
                            <small>يمكنك إضافة حتى 10 صور</small>
                        </div>

                        {formData.imageUrls.length > 0 && (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                                gap: 10, 
                                marginTop: 20 
                            }}>
                                {formData.imageUrls.map((url, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                                        <img 
                                            src={url} 
                                            alt="auction" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover', 
                                                borderRadius: 8,
                                                border: '1.5px solid var(--red)'
                                            }} 
                                        />
                                        <button
                                            onClick={() => removeImage(i)}
                                            style={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                background: 'var(--red)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: 22,
                                                height: 22,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ 
                            background: 'rgba(229, 57, 53, 0.05)', 
                            padding: 20, 
                            borderRadius: 12, 
                            marginTop: 30,
                            border: '1px solid var(--red-glow)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <h4 style={{ fontWeight: 900, color: 'var(--red)', margin: 0 }}>
                                    🔥 تمييز المزاد
                                </h4>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    style={{ width: 20, height: 20, accentColor: 'var(--red)' }}
                                />
                            </div>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8, margin: 0 }}>
                                ضاعف كفاءة مزادك بظهوره في الصفحة الأولى
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: 20, marginTop: 30, fontSize: '1.1rem' }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <><span className="spinner" /> جاري النشر...</> : '🚀 نشر المزاد الآن'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
