import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'
import './AdPost.css'

export default function AdPostPage() {
    const { user } = useContext(AuthContext)
    const nav = useNavigate()
    const [step, setStep] = useState(1)
    const [fetchingData, setFetchingData] = useState(true)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [filteredSubs, setFilteredSubs] = useState([])

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
        const fetchData = async () => {
            setFetchingData(true)
            try {
                const { data: cats } = await insforge.db.from('categories').select('*').order('id')
                const { data: subs } = await insforge.db.from('subcategories').select('*').order('name')
                if (cats) setCategories(cats)
                if (subs) setSubcategories(subs)
            } finally {
                setFetchingData(false)
            }
        }
        fetchData()
    }, [])

    const handleFile = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const newPreviews = selectedFiles.map(f => URL.createObjectURL(f))
        setFormData({
            ...formData,
            images: [...formData.images, ...selectedFiles],
            imageUrls: [...formData.imageUrls, ...newPreviews]
        })
    }

    const selectCat = (catId) => {
        setFormData({ ...formData, catId, subId: '' })
        setFilteredSubs(subcategories.filter(s => s.category_id === catId))
        setStep(2)
    }

    const selectSub = (subId) => {
        setFormData({ ...formData, subId })
        setStep(3)
    }

    const _submitAd = async () => {
        if (!user) return alert('يجب تسجيل الدخول أولاً');
        if (!formData.title || !formData.catId || !formData.price) return alert('يرجى إكمال البيانات الأساسية');

        setLoading(true);
        try {
            const uploadedUrls = [];
            for (const file of formData.images) {
                const fileName = `${user.id}/${Date.now()}-${file.name}`;
                const { error } = await insforge.storage.from('ad-images').upload(fileName, file);
                if (error) throw error;
                const { data: { publicUrl } } = insforge.storage.from('ad-images').getPublicUrl(fileName);
                uploadedUrls.push(publicUrl);
            }

            const { error } = await insforge.db.from('ads').insert([{
                advertiser_id: user.id,
                title: formData.title,
                description: formData.desc,
                price: formData.price,
                city: formData.city,
                category_id: formData.catId,
                subcategory_id: formData.subId,
                image_urls: uploadedUrls,
                is_featured: formData.isFeatured,
                advertiser_phone: formData.phone
            }]);

            if (error) throw error;
            alert('🚀 تم نشر إعلانك بنجاح!');
            nav('/');
        } catch (error) {
            alert('حدث خطأ: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const StepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                    width: 40, height: 4, borderRadius: 2,
                    background: step >= i ? 'var(--red)' : 'var(--bg-soft)',
                    transition: '.3s'
                }} />
            ))}
        </div>
    )

    if (fetchingData) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', fontSize: '1.2rem', fontWeight: 900 }}>⚡ جاري تجهيز الأقسام...</div>

    return (
        <div style={{ padding: '40px 20px' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', fontWeight: 900, marginBottom: 10 }}>{step < 5 ? 'إضافة إعلان جديد' : 'تم النشر!'}</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-3)', marginBottom: 30 }}>اتبع الخطوات البسيطة لبيع منتجك بسرعة</p>

                <StepIndicator />

                {step === 1 && (
                    <div className="glass" style={{ padding: 20 }}>
                        <h3 style={{ marginBottom: 20, fontWeight: 800 }}>1. اختر القسم الرئيسي</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 15 }}>
                            {categories.map(c => (
                                <div key={c.id} className="cat-tile glass-hover" onClick={() => selectCat(c.id)} style={{ cursor: 'pointer', padding: 20, textAlign: 'center', borderRadius: 15 }}>
                                    <span className="material-icons" style={{ fontSize: '2.5rem', marginBottom: 10, display: 'block', color: c.color_hex }}>{c.icon_name || 'inventory_2'}</span>
                                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <button className="btn-icon" onClick={() => setStep(1)}>←</button>
                            <h3 style={{ fontWeight: 800 }}>2. اختر القسم الفرعي</h3>
                        </div>
                        <div className="glass" style={{ padding: '5px 0' }}>
                            {filteredSubs.map(s => (
                                <div key={s.id} className="menu-row" onClick={() => selectSub(s.id)} style={{ borderBottom: '1px solid var(--border)', padding: '15px 20px' }}>
                                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                                    <span style={{ opacity: 0.5 }}>◀</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="glass" style={{ padding: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25 }}>
                            <button className="btn-icon" onClick={() => setStep(2)}>←</button>
                            <h3 style={{ fontWeight: 800 }}>3. تفاصيل الإعلان</h3>
                        </div>

                        <div className="fg">
                            <label>عنوان الإعلان</label>
                            <input className="finput" placeholder="ماذا تبيع؟" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <small style={{ color: 'var(--text-3)' }}>اذكر الموديل، الحالة، والمميزات</small>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div className="fg">
                                <label>السعر المطلوب (ج.م)</label>
                                <input className="finput" type="number" placeholder="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="fg">
                                <label>المدينة</label>
                                <select className="fselect" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}>
                                    <option>القاهرة</option><option>الجيزة</option><option>الإسكندرية</option><option>طنطا</option><option>المنصورة</option>
                                </select>
                            </div>
                        </div>

                        <div className="fg">
                            <label>رقم التواصل (واتساب)</label>
                            <input className="finput" placeholder="01xxxxxxxxx" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>

                        <div className="fg">
                            <label>الوصف</label>
                            <textarea className="finput" rows={5} placeholder="اكتب تفاصيل أكثر لجذب المشترين..." value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: 18, marginTop: 10 }} onClick={() => setStep(4)}>التالي (الصور) ←</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="glass" style={{ padding: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25 }}>
                            <button className="btn-icon" onClick={() => setStep(3)}>←</button>
                            <h3 style={{ fontWeight: 800 }}>4. صور الإعلان</h3>
                        </div>

                        <div className="dropzone" onClick={() => document.getElementById('fileInput').click()}>
                            <input type="file" id="fileInput" multiple style={{ display: 'none' }} onChange={handleFile} />
                            <div style={{ fontSize: '3rem' }}>📸</div>
                            <p style={{ fontWeight: 700, margin: '10px 0' }}>اضغط لإضافة صور</p>
                            <small>يمكنك إضافة حتى 10 صور</small>
                        </div>

                        {formData.imageUrls.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10, marginTop: 20 }}>
                                {formData.imageUrls.map((url, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                                        <img src={url} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--red)' }} />
                                        <button onClick={() => {
                                            const u = [...formData.imageUrls]; const f = [...formData.images];
                                            u.splice(i, 1); f.splice(i, 1);
                                            setFormData({ ...formData, imageUrls: u, images: f });
                                        }} style={{ position: 'absolute', top: -5, right: -5, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22 }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ background: 'rgba(255,107,107,0.05)', padding: 20, borderRadius: 12, marginTop: 30, border: '1px solid var(--red-glow)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ fontWeight: 900, color: 'var(--red)' }}>🔥 تمييز الإعلان</h4>
                                    <p style={{ fontSize: '.7rem', opacity: 0.8 }}>ضاعف كفاءة إعلانك بظهوره في الصفحة الأولى</p>
                                </div>
                                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} style={{ width: 20, height: 20, accentColor: 'var(--red)' }} />
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: 20, marginTop: 30, fontSize: '1.1rem' }} onClick={_submitAd} disabled={loading}>
                            {loading ? <><span className="spinner" /> جاري النشر...</> : '🚀 نشر الإعلان الآن'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
