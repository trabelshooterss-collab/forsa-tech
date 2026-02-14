import { useNavigate } from 'react-router-dom'

export default function CreatePage() {
  const nav = useNavigate()

  return (
    <>
      <div className="pg-header">
        <div>
          <h1>إضافة جديدة</h1>
          <p className="sub">اختاري نوع الإضافة: إعلان ثابت أو مزاد مباشر</p>
        </div>
      </div>

      <div className="sec" style={{ marginTop: 16 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18
        }}>
          <div
            className="glass"
            role="button"
            tabIndex={0}
            onClick={() => nav('/post')}
            onKeyDown={(e) => e.key === 'Enter' && nav('/post')}
            style={{
              padding: 22,
              borderRadius: 18,
              cursor: 'pointer',
              border: '1px solid var(--border-glass)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                background: 'linear-gradient(135deg, var(--blue), #0D47A1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.4rem',
                boxShadow: '0 12px 30px rgba(13, 71, 161, .25)'
              }}>📝</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>إعلان عادي</div>
                <div style={{ color: 'var(--text-3)', fontSize: '.82rem' }}>
                  سعر ثابت، يظهر في البحث والأقسام
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="btn btn-outline" style={{ fontSize: '.78rem', padding: '10px 14px' }}>
                ابدأ بإعلان
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: '.75rem', marginRight: 'auto' }}>
                مناسب للبيع السريع
              </span>
            </div>
          </div>

          <div
            className="glass"
            role="button"
            tabIndex={0}
            onClick={() => nav('/create-auction')}
            onKeyDown={(e) => e.key === 'Enter' && nav('/create-auction')}
            style={{
              padding: 22,
              borderRadius: 18,
              cursor: 'pointer',
              border: '1px solid var(--border-glass)',
              background: 'linear-gradient(135deg, rgba(229, 57, 53, .08), rgba(255, 109, 0, .06))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                background: 'linear-gradient(135deg, var(--red), var(--orange))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.4rem',
                boxShadow: 'var(--shadow-red)'
              }}>🔴</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>مزاد مباشر</div>
                <div style={{ color: 'var(--text-3)', fontSize: '.82rem' }}>
                  مزايدات + عدّاد وقت + شراء فوري (اختياري)
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="btn btn-primary" style={{ fontSize: '.78rem', padding: '10px 14px' }}>
                ابدأ بمزاد
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: '.75rem', marginRight: 'auto' }}>
                مناسب للمقتنيات والندرة
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

