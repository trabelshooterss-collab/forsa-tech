import { NavLink, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { AuthContext } from '../context/AuthContext'
import Notifications from './Notifications'

const sideLinks = [
  { path: '/', icon: '🏠', label: 'الرئيسية', end: true },
  { path: '/categories', icon: '📂', label: 'الأقسام' },
  { path: '/search', icon: '🔍', label: 'البحث' },
  { path: '/auctions', icon: '🔴', label: 'المزادات' },
  { path: '/create', icon: '➕', label: 'إضافة', cta: true },
  { path: '/chat', icon: '💬', label: 'الرسائل', badge: 3 },
  { path: '/wallet', icon: '💰', label: 'المحفظة' },
  { path: '/profile', icon: '👤', label: 'حسابي' },
]
const btmLinks = [
  { path: '/', icon: '🏠', label: 'الرئيسية', end: true },
  { path: '/categories', icon: '📂', label: 'الأقسام' },
  { path: '/create', icon: '➕', label: 'إضافة', center: true },
  { path: '/chat', icon: '💬', label: 'رسائل' },
  { path: '/profile', icon: '👤', label: 'حسابي' },
]

export default function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { isLoggedIn, user, logout } = useContext(AuthContext)
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-c">⚡</div>
          <div><h1>فرصة-تك</h1><small>أكبر سوق إلكتروني ذكي</small></div>
          <div style={{ marginRight: 'auto' }}>
            <Notifications />
          </div>
        </div>

        {isLoggedIn && user && (
          <div style={{ padding: '0 25px', marginBottom: 15 }}>
            <div className="glass" style={{ padding: 15, borderRadius: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  {user.user_metadata?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '.9rem' }}>{user.user_metadata?.full_name || 'مستخدم فرصة'}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--red)', fontWeight: 900 }}>💰 {user.coins || 0} عملة</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sidebar-hr" />
        <nav className="sidebar-menu">
          {sideLinks.map(l => (
            <NavLink key={l.path} to={l.path} end={l.end}
              className={({ isActive }) => `s-link ${isActive ? 'active' : ''} ${l.cta ? 'cta' : ''}`}>
              <span className="ico">{l.icon}</span>
              <span>{l.label}</span>
              {l.badge && isLoggedIn && <span className="badge-dot">{l.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={toggleTheme}>
            <span className="ico">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>
          </button>
          {isLoggedIn && (
            <button onClick={logout} style={{ marginTop: 5, color: 'var(--red)' }}>
              <span className="ico">🚪</span>
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main"><div className="pg"><Outlet /></div></main>

      {/* Bottom Nav */}
      <nav className="btm-nav">
        <div className="btm-nav-row">
          {btmLinks.map(l => (
            <NavLink key={l.path} to={l.path} end={l.end}
              className={({ isActive }) => `btm-link ${isActive ? 'active' : ''} ${l.center ? 'center-btn' : ''}`}>
              <span className="ico">{l.icon}</span>
              <span className={l.center ? 'center-label' : ''}>{l.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
