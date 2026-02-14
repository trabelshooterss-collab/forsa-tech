import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'

export default function RatingSystem({ targetType, targetId, initialRating = 0, initialReviews = [] }) {
    const { user, isLoggedIn } = useContext(AuthContext)
    const [rating, setRating] = useState(initialRating)
    const [reviews, setReviews] = useState(initialReviews)
    const [userRating, setUserRating] = useState(0)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchRatings()
    }, [targetType, targetId])

    const fetchRatings = async () => {
        try {
            const { data, error } = await insforge.db
                .from('ratings')
                .select('*')
                .eq('target_type', targetType)
                .eq('target_id', targetId)

            if (!error && data) {
                const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length
                setRating(avgRating || 0)
                setReviews(data)

                // Check if user has already rated
                if (user) {
                    const userReview = data.find(r => r.user_id === user.id)
                    if (userReview) {
                        setUserRating(userReview.rating)
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching ratings:', error)
        }
    }

    const handleRating = async (newRating) => {
        if (!isLoggedIn) {
            alert('يجب تسجيل الدخول للتقييم')
            return
        }

        setLoading(true)
        try {
            // Check if user has already rated
            const { data: existingRating } = await insforge.db
                .from('ratings')
                .select('*')
                .eq('target_type', targetType)
                .eq('target_id', targetId)
                .eq('user_id', user.id)
                .single()

            if (existingRating) {
                // Update existing rating
                const { error } = await insforge.db
                    .from('ratings')
                    .update({ rating: newRating })
                    .eq('id', existingRating.id)

                if (error) throw error
            } else {
                // Create new rating
                const { error } = await insforge.db
                    .from('ratings')
                    .insert([{
                        target_type: targetType,
                        target_id: targetId,
                        user_id: user.id,
                        rating: newRating,
                        created_at: new Date().toISOString()
                    }])

                if (error) throw error
            }

            setUserRating(newRating)
            await fetchRatings()
        } catch (error) {
            console.error('Error submitting rating:', error)
            alert('فشل إرسال التقييم: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!isLoggedIn) {
            alert('يجب تسجيل الدخول لإضافة مراجعة')
            return
        }

        if (newReview.rating === 0 || !newReview.comment.trim()) {
            alert('يرجى إضافة التقييم والمراجعة')
            return
        }

        setLoading(true)
        try {
            const { error } = await insforge.db
                .from('reviews')
                .insert([{
                    target_type: targetType,
                    target_id: targetId,
                    user_id: user.id,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    created_at: new Date().toISOString()
                }])

            if (error) throw error

            setNewReview({ rating: 0, comment: '' })
            setShowReviewForm(false)
            await fetchRatings()
        } catch (error) {
            console.error('Error submitting review:', error)
            alert('فشل إرسال المراجعة: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (currentRating, interactive = false, onStarClick) => {
        return [1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                onClick={() => interactive && onStarClick(star)}
                style={{
                    cursor: interactive ? 'pointer' : 'default',
                    fontSize: interactive ? '1.5rem' : '1rem',
                    color: star <= currentRating ? '#FFB300' : '#ddd',
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                    if (interactive) {
                        e.currentTarget.style.transform = 'scale(1.2)'
                    }
                }}
                onMouseLeave={(e) => {
                    if (interactive) {
                        e.currentTarget.style.transform = 'scale(1)'
                    }
                }}
            >
                ★
            </span>
        ))
    }

    return (
        <div className="rating-system" style={{ padding: 20 }}>
            {/* Overall Rating */}
            <div className="rating-overview" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginBottom: 30,
                padding: 20,
                background: 'var(--bg-card)',
                borderRadius: 12,
                border: '1px solid var(--border)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--red)' }}>
                        {rating.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>
                        {renderStars(rating)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: 5 }}>
                        {reviews.length} تقييم
                    </div>
                </div>

                {isLoggedIn && (
                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 10, fontWeight: 700 }}>
                            تقييمك:
                        </div>
                        <div style={{ display: 'flex', gap: 5 }}>
                            {renderStars(userRating, true, handleRating)}
                        </div>
                        {loading && <span className="spinner" style={{ marginRight: 10 }} />}
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
                <h3 style={{ marginBottom: 20, fontWeight: 900 }}>
                    المراجعات ({reviews.length})
                </h3>

                {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
                        لا توجد مراجعات بعد
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} style={{
                            padding: 15,
                            marginBottom: 15,
                            background: 'var(--bg-card)',
                            borderRadius: 8,
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ fontWeight: 700 }}>
                                    {review.user_metadata?.full_name || 'مستخدم'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                                    {new Date(review.created_at).toLocaleDateString('ar-EG')}
                                </div>
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                {renderStars(review.rating)}
                            </div>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Add Review Button */}
            {isLoggedIn && (
                <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{
                        width: '100%',
                        padding: 15,
                        marginTop: 20,
                        background: 'var(--red)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    {showReviewForm ? 'إلغاء' : 'إضافة مراجعة'}
                </button>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <form onSubmit={handleSubmitReview} style={{
                    marginTop: 20,
                    padding: 20,
                    background: 'var(--bg-card)',
                    borderRadius: 12,
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 10, fontWeight: 700 }}>
                            التقييم
                        </label>
                        <div style={{ display: 'flex', gap: 5 }}>
                            {renderStars(newReview.rating, true, (star) => {
                                setNewReview({ ...newReview, rating: star })
                            })}
                        </div>
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 10, fontWeight: 700 }}>
                            المراجعة
                        </label>
                        <textarea
                            value={newReview.comment}
                            onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="اكتب مراجعتك هنا..."
                            style={{
                                width: '100%',
                                minHeight: 100,
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: 15,
                            background: 'var(--red)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        {loading ? <span className="spinner" /> : 'إرسال المراجعة'}
                    </button>
                </form>
            )}
        </div>
    )
}
