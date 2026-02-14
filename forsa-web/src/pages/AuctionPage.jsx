import { useEffect, useMemo, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'
import LazyImage from '../components/LazyImage'

function formatTimeLong(seconds) {
  const s = Math.max(0, Number(seconds) || 0)
  const days = Math.floor(s / (24 * 60 * 60))
  const hours = Math.floor((s % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((s % (60 * 60)) / 60)
  const secs = Math.floor(s % 60)
  if (days > 0) return `${days}ي ${hours}س ${minutes}د`
  if (hours > 0) return `${hours}س ${minutes}د ${secs}ث`
  return `${minutes}د ${secs}ث`
}

export default function AuctionPage() {
  const { user, isLoggedIn } = useContext(AuthContext)
  const { id } = useParams()
  const nav = useNavigate()

  const [auction, setAuction] = useState(null)
  const [seller, setSeller] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [pageError, setPageError] = useState('')
  const [formError, setFormError] = useState('')
  const [showBidHistory, setShowBidHistory] = useState(false)
  const [auctionsEnabled, setAuctionsEnabled] = useState(true)
  const [nowTick, setNowTick] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeInfo = useMemo(() => {
    if (!auction) return { phase: 'unknown', seconds: 0 }
    const startMs = auction.start_time ? new Date(auction.start_time).getTime() : null
    const endMs = auction.end_time ? new Date(auction.end_time).getTime() : null

    const started = !startMs || nowTick >= startMs
    const ended = !!endMs && nowTick >= endMs

    if (!started && startMs) {
      return { phase: 'upcoming', seconds: Math.floor((startMs - nowTick) / 1000) }
    }
    if (!ended && endMs) {
      return { phase: 'live', seconds: Math.floor((endMs - nowTick) / 1000) }
    }
    return { phase: 'ended', seconds: 0 }
  }, [auction, nowTick])

  const numeric = (v, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }

  const minIncrement = useMemo(() => numeric(auction?.min_increment, 100) || 100, [auction])
  const currentBid = useMemo(() => {
    const fromAuction = numeric(auction?.current_bid, NaN)
    const fromStart = numeric(auction?.start_price, 0)
    const fromBids = bids?.[0] ? numeric(bids[0].amount, 0) : 0
    return Math.max(Number.isFinite(fromAuction) ? fromAuction : 0, fromStart, fromBids)
  }, [auction, bids])
  const buyNowPrice = useMemo(() => {
    const n = numeric(auction?.buy_now_price, NaN)
    return Number.isFinite(n) ? n : null
  }, [auction])
  const minBid = useMemo(() => currentBid + minIncrement, [currentBid, minIncrement])

  const isActuallyLive = useMemo(() => {
    if (!auction) return false
    const status = auction.status || 'active'
    if (['sold', 'ended', 'cancelled'].includes(status)) return false
    return timeInfo.phase === 'live'
  }, [auction, timeInfo.phase])

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true)
      setPageError('')
      setFormError('')
      try {
        const { data: auctionData, error: auctionError } = await insforge.db
          .from('auctions')
          .select('*')
          .eq('id', id)
          .single()

        if (auctionError) {
          if (auctionError.code === '42P01') setAuctionsEnabled(false)
          throw auctionError
        }

        setAuctionsEnabled(true)
        setAuction(auctionData)

        const { data: bidsData, error: bidsError } = await insforge.db
          .from('bids')
          .select('*')
          .eq('auction_id', id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (!bidsError) setBids(bidsData || [])

        if (auctionData?.advertiser_id) {
          const { data: sellerData } = await insforge.db
            .from('profiles')
            .select('*')
            .eq('id', auctionData.advertiser_id)
            .single()
          setSeller(sellerData || null)
        }
      } catch (e) {
        if (e?.code === '42P01') {
          setAuctionsEnabled(false)
          setPageError('ميزة المزادات غير مفعلة بعد.')
          return
        }
        setPageError('فشل تحميل المزاد.')
        return
      } finally {
        setLoading(false)
      }
    }

    fetchAuction()
  }, [id])

  useEffect(() => {
    if (!auctionsEnabled) return

    const channel = insforge.db
      .channel(`auction:${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'auctions', filter: `id=eq.${id}` },
        (payload) => {
          if (payload?.new) setAuction(payload.new)
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${id}` },
        (payload) => {
          if (!payload?.new) return
          setBids((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [id, auctionsEnabled])

  const placeBid = async (amount) => {
    // Prefer RPC (atomic) when available, fallback to direct insert/update for early stage.
    const { data: rpcData, error: rpcError } = await insforge.db.rpc('place_bid', {
      p_auction_id: id,
      p_amount: amount,
    })

    if (!rpcError) {
      setFormError('')
      // Re-fetch for clean state (also covers end_time extension rules).
      const { data: auctionData } = await insforge.db.from('auctions').select('*').eq('id', id).single()
      if (auctionData) setAuction(auctionData)
      const { data: bidsData } = await insforge.db.from('bids').select('*').eq('auction_id', id).order('created_at', { ascending: false }).limit(50)
      if (bidsData) setBids(bidsData)
      return rpcData
    }

    // Function not created yet
    if (rpcError?.code === '42883' || (rpcError?.message || '').includes('function') || (rpcError?.message || '').includes('rpc')) {
      const { error: bidErr } = await insforge.db.from('bids').insert([{
        auction_id: id,
        user_id: user.id,
        amount,
        created_at: new Date().toISOString(),
      }])

      if (bidErr) throw bidErr

      await insforge.db.from('auctions').update({ current_bid: amount, winner_id: user.id }).eq('id', id)
      setFormError('')
      return null
    }

    throw rpcError
  }

  const handleBid = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      nav('/login')
      return
    }
    if (!auction) return
    if (!isActuallyLive) {
      setFormError('المزاد غير متاح للمزايدة حالياً.')
      return
    }

    const bidValue = parseFloat(bidAmount)
    if (!Number.isFinite(bidValue)) {
      setFormError('يرجى إدخال رقم صحيح.')
      return
    }
    if (bidValue < minBid) {
      setFormError(`الحد الأدنى للمزايدة هو ${minBid.toLocaleString('ar-EG')} ج.م`)
      return
    }
    if (buyNowPrice != null && bidValue >= buyNowPrice) {
      setFormError('المبلغ يساوي/أعلى من الشراء الفوري. استخدم زر الشراء الفوري.')
      return
    }

    setLoading(true)
    try {
      await placeBid(bidValue)
      setBidAmount('')
    } catch {
      setFormError('فشل إرسال المزايدة.')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (!auction) return
    if (buyNowPrice == null) return

    if (!isLoggedIn) {
      nav('/login')
      return
    }
    if (timeInfo.phase === 'ended') {
      setFormError('المزاد انتهى.')
      return
    }

    const ok = confirm(`تأكيد الشراء الفوري بـ ${buyNowPrice.toLocaleString('ar-EG')} ج.م؟`)
    if (!ok) return

    setLoading(true)
    try {
      const { error } = await insforge.db
        .from('auctions')
        .update({
          status: 'sold',
          winner_id: user.id,
          sold_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      alert('تم الشراء بنجاح.')
      nav('/profile')
    } catch {
      setFormError('فشل الشراء الفوري.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !auction) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        fontSize: '1.1rem',
        fontWeight: 900,
      }}>
        <span className="spinner" /> جاري تحميل المزاد...
      </div>
    )
  }

  if (pageError && !auction) {
    return (
      <div className="sec" style={{ paddingTop: 30 }}>
        <div className="glass" style={{ padding: 22, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 10 }}>{pageError}</h3>
          <p style={{ color: 'var(--text-3)' }}>
            لو دي أول مرة تفعّلي المزادات: فعّلي جداول المزادات في قاعدة البيانات.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => nav('/create')}>إضافة (مزاد أو إعلان)</button>
            <button className="btn btn-outline" onClick={() => nav('/auctions')}>رجوع لصفحة المزادات</button>
          </div>
        </div>
      </div>
    )
  }

  const mainImg = auction?.image_urls?.[0] || 'https://placehold.co/900x700'
  const sellerName = seller?.full_name || 'البائع'
  const sellerInitial = (sellerName || 'U').charAt(0)

  return (
    <div className="auction-page pg-anim">
      <div className="auction-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <div className="glass" style={{
          padding: 30,
          borderRadius: 20,
          marginBottom: 30,
          background: isActuallyLive ? 'linear-gradient(135deg, rgba(229, 57, 53, 0.1), rgba(255, 109, 0, 0.1))' : 'var(--bg-card)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 260 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 10 }}>
                {auction?.title || 'مزاد'}
              </h1>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {isActuallyLive && (
                  <span style={{
                    background: '#E53935',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    animation: 'pulse 2s infinite',
                  }}>
                    مباشر
                  </span>
                )}
                {timeInfo.phase === 'upcoming' && (
                  <span className="d-tag">يبدأ بعد: {formatTimeLong(timeInfo.seconds)}</span>
                )}
                {timeInfo.phase === 'live' && (
                  <span className="d-tag">ينتهي بعد: {formatTimeLong(timeInfo.seconds)}</span>
                )}
                {timeInfo.phase === 'ended' && (
                  <span className="d-tag">انتهى</span>
                )}
                <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                  📍 {auction?.city || '—'}
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                  👁️ {auction?.views_count || 0}
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                  💬 {auction?.bid_count || bids.length}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'left', minWidth: 220 }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-3)', marginBottom: 5 }}>
                السعر الحالي
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--red)' }}>
                {currentBid.toLocaleString('ar-EG')} ج.م
              </div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-3)', marginTop: 6 }}>
                أقل مزايدة: {minBid.toLocaleString('ar-EG')} ج.م
              </div>
              {buyNowPrice != null && (
                <div style={{ fontSize: '.85rem', color: 'var(--text-3)', marginTop: 4 }}>
                  شراء فوري: {buyNowPrice.toLocaleString('ar-EG')} ج.م
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 26 }}>
            <LazyImage
              src={mainImg}
              alt={auction?.title || 'مزاد'}
              style={{
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: 15,
                objectFit: 'cover',
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {(auction?.image_urls || []).slice(1, 5).map((url, i) => (
                <LazyImage
                  key={i}
                  src={url}
                  alt={`${auction?.title || 'مزاد'} ${i}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 10,
                    objectFit: 'cover',
                  }}
                />
              ))}
            </div>
          </div>

          {formError && (
            <div style={{
              background: 'rgba(229, 57, 53, 0.1)',
              color: '#E53935',
              padding: 14,
              borderRadius: 12,
              border: '1px solid var(--red-glow)',
              marginBottom: 16,
            }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleBid} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 10, fontWeight: 800 }}>
                مبلغ المزايدة
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={`الحد الأدنى: ${minBid.toLocaleString('ar-EG')}`}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 12,
                  border: '2px solid var(--border)',
                  background: 'var(--bg)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  direction: 'ltr',
                  textAlign: 'center',
                }}
                disabled={!isActuallyLive || loading}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {[minBid, minBid + minIncrement, minBid + minIncrement * 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '.75rem', padding: '8px 12px' }}
                    onClick={() => setBidAmount(String(v))}
                    disabled={!isActuallyLive || loading}
                  >
                    {v.toLocaleString('ar-EG')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '14px 18px', borderRadius: 12, fontWeight: 900, minWidth: 140 }}
              disabled={!isActuallyLive || loading}
            >
              {loading ? 'جاري الإرسال...' : 'تقديم مزايدة'}
            </button>

            <button
              type="button"
              className="btn btn-accent"
              style={{ padding: '14px 18px', borderRadius: 12, fontWeight: 900, minWidth: 140 }}
              onClick={handleBuyNow}
              disabled={loading || buyNowPrice == null || timeInfo.phase === 'ended'}
            >
              شراء فوري
            </button>
          </form>

          <button
            onClick={() => setShowBidHistory(!showBidHistory)}
            style={{
              width: '100%',
              padding: 14,
              background: 'var(--bg-soft)',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 800,
              marginTop: 18,
            }}
          >
            {showBidHistory ? 'إخفاء سجل المزايدات' : 'عرض سجل المزايدات'} ({bids.length})
          </button>

          {showBidHistory && (
            <div className="glass" style={{
              padding: 18,
              borderRadius: 16,
              marginTop: 14,
              maxHeight: 420,
              overflowY: 'auto',
            }}>
              {bids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-3)' }}>
                  لا توجد مزايدات بعد
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bids.map((bid, idx) => {
                    const isTop = idx === 0
                    const bidder = bid.user_id ? String(bid.user_id).slice(0, 6) : 'مستخدم'
                    return (
                      <div key={bid.id || `${bid.user_id}-${bid.created_at}-${idx}`} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 14,
                        borderRadius: 12,
                        background: isTop ? 'rgba(229, 57, 53, 0.06)' : 'transparent',
                        border: isTop ? '1px solid var(--red-glow)' : '1px solid var(--border)',
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <div style={{ fontWeight: 900 }}>#{idx + 1} {bid.user_id === user?.id ? '(أنت)' : ''}</div>
                          <div style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>
                            {bidder} • {new Date(bid.created_at).toLocaleString('ar-EG')}
                          </div>
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--red)' }}>
                          {numeric(bid.amount, 0).toLocaleString('ar-EG')} ج.م
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: 26, borderRadius: 20, marginBottom: 30 }}>
          <h2 style={{ marginBottom: 14, fontWeight: 900 }}>تفاصيل المزاد</h2>
          <div style={{ lineHeight: 2, color: 'var(--text-2)', whiteSpace: 'pre-line' }}>
            {auction?.description || '—'}
          </div>

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>حالة المنتج</div>
              <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-soft)' }}>
                {auction?.item_condition || '—'}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>الموقع</div>
              <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-soft)' }}>
                {auction?.city || '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: 26, borderRadius: 20 }}>
          <h2 style={{ marginBottom: 14, fontWeight: 900 }}>معلومات البائع</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--red)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 900,
            }}>
              {sellerInitial}
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{sellerName}</div>
              <div style={{ color: 'var(--text-3)', fontSize: '.85rem', marginTop: 4 }}>
                تقييم البائع يظهر هنا لاحقاً
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => nav('/chat')}>
                تواصل
              </button>
              <button className="btn btn-outline" onClick={() => nav('/search')}>
                مزادات أخرى
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  )
}
