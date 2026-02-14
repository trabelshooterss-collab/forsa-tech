import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'

export default function Notifications() {
    const { user, isLoggedIn } = useContext(AuthContext)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isLoggedIn || !user) return

        const fetchNotifications = async () => {
            try {
                const { data, error } = await insforge.db
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(20)

                if (!error && data) {
                    setNotifications(data)
                    const unread = data.filter(n => !n.read).length
                    setUnreadCount(unread)
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        fetchNotifications()

        // Set up real-time subscription
        const subscription = insforge.db
            .channel(`notifications:${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setNotifications(prev => [payload.new, ...prev])
                    setUnreadCount(prev => prev + 1)
                } else if (payload.eventType === 'UPDATE') {
                    setNotifications(prev => 
                        prev.map(n => n.id === payload.new.id ? payload.new : n)
                    )
                }
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [isLoggedIn, user])

    const markAsRead = async (notificationId) => {
        try {
            await insforge.db
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId)

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await insforge.db
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false)

            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            )
            setUnreadCount(0)
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'message':
                return '💬'
            case 'ad_update':
                return '📢'
            case 'offer':
                return '💰'
            case 'like':
                return '❤️'
            case 'follow':
                return '👤'
            default:
                return '🔔'
        }
    }

    if (!isLoggedIn) return null

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: 8
                }}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'var(--red)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 900
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notifications-dropdown glass" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: 350,
                    maxHeight: 500,
                    overflowY: 'auto',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    marginTop: 10
                }}>
                    <div style={{
                        padding: '15px 20px',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
                            الإشعارات
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--red)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                تعليم الكل كمقروء
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div style={{
                            padding: 40,
                            textAlign: 'center',
                            color: 'var(--text-3)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: 10 }}>🔔</div>
                            <p>لا توجد إشعارات</p>
                        </div>
                    ) : (
                        <div>
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    style={{
                                        padding: '15px 20px',
                                        borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        background: notification.read ? 'transparent' : 'rgba(229, 57, 53, 0.05)',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-soft)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(229, 57, 53, 0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            flexShrink: 0
                                        }}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.9rem',
                                                fontWeight: notification.read ? 400 : 700
                                            }}>
                                                {notification.message}
                                            </p>
                                            <p style={{
                                                margin: '5px 0 0',
                                                fontSize: '0.7rem',
                                                color: 'var(--text-3)'
                                            }}>
                                                {new Date(notification.created_at).toLocaleDateString('ar-EG', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                background: 'var(--red)',
                                                flexShrink: 0
                                            }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
