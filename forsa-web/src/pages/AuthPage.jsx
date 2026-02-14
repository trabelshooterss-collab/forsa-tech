import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { insforge } from '../lib/insforge'

export default function AuthPage() {
    const { login } = useContext(AuthContext)
    const nav = useNavigate()
    const [mode, setMode] = useState('login') // login, register, forgot
    const [loading, setLoading] = useState(false)

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const [forgotData, setForgotData] = useState({
        email: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!loginData.email || !loginData.password) {
            alert('يرجى إدخال البريد الإلكتروني وكلمة المرور')
            return
        }

        setLoading(true)
        try {
            await login(loginData.email, loginData.password)
            nav('/')
        } catch (error) {
            console.error('Login error:', error)
            alert('فشل تسجيل الدخول: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!registerData.fullName || !registerData.email || !registerData.phone || !registerData.password) {
            alert('يرجى إكمال جميع البيانات')
            return
        }

        if (registerData.password !== registerData.confirmPassword) {
            alert('كلمة المرور غير متطابقة')
            return
        }

        if (registerData.password.length < 6) {
            alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
            return
        }

        setLoading(true)
        try {
            const { error } = await insforge.auth.signUp({
                email: registerData.email,
                password: registerData.password,
                options: {
                    data: {
                        full_name: registerData.fullName,
                        phone: registerData.phone
                    }
                }
            })

            if (error) throw error

            alert('🎉 تم إنشاء الحساب بنجاح!')
            nav('/')
        } catch (error) {
            console.error('Registration error:', error)
            alert('فشل إنشاء الحساب: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!forgotData.email) {
            alert('يرجى إدخال البريد الإلكتروني')
            return
        }

        setLoading(true)
        try {
            const { error } = await insforge.auth.resetPasswordForEmail(forgotData.email)
            if (error) throw error

            alert('✅ تم إرسال رابط استعادة كلمة المرور إلى بريدك')
            setMode('login')
        } catch (error) {
            console.error('Reset password error:', error)
            alert('فشل إرسال رابط الاستعادة: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            const { error } = await insforge.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            })
            if (error) throw error
        } catch (error) {
            console.error('Google login error:', error)
            alert('فشل تسجيل الدخول عبر Google: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFacebookLogin = async () => {
        setLoading(true)
        try {
            const { error } = await insforge.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: window.location.origin
                }
            })
            if (error) throw error
        } catch (error) {
            console.error('Facebook login error:', error)
            alert('فشل تسجيل الدخول عبر Facebook: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'linear-gradient(135deg, var(--bg), rgba(229, 57, 53, 0.05))'
        }}>
            <div className="auth-container glass" style={{
                maxWidth: 500,
                width: '100%',
                padding: 40,
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, var(--red), var(--orange))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 20px',
                        boxShadow: '0 10px 30px rgba(229, 57, 53, 0.3)'
                    }}>
                        ⚡
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 5 }}>
                        فرصة-تك
                    </h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                        أكبر سوق إلكتروني ذكي في المنطقة
                    </p>
                </div>

                {/* Mode Tabs */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 30, borderBottom: '2px solid var(--border)', paddingBottom: 10 }}>
                    <button
                        onClick={() => setMode('login')}
                        style={{
                            flex: 1,
                            padding: 12,
                            border: 'none',
                            background: 'transparent',
                            color: mode === 'login' ? 'var(--red)' : 'var(--text-3)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            borderBottom: mode === 'login' ? '3px solid var(--red)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        تسجيل الدخول
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        style={{
                            flex: 1,
                            padding: 12,
                            border: 'none',
                            background: 'transparent',
                            color: mode === 'register' ? 'var(--red)' : 'var(--text-3)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            borderBottom: mode === 'register' ? '3px solid var(--red)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        إنشاء حساب
                    </button>
                </div>

                {/* Login Form */}
                {mode === 'login' && (
                    <form onSubmit={handleLogin}>
                        {/* Social Login */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: '#fff',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={handleFacebookLogin}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: '#1877F2',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', color: 'var(--text-3)' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
                            <span style={{ fontSize: '0.8rem' }}>أو</span>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
                        </div>

                        {/* Email Input */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={loginData.email}
                                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                كلمة المرور
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="•••••••••"
                                    value={loginData.password}
                                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        paddingRight: 50,
                                        borderRadius: 10,
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg)',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        direction: 'ltr',
                                        textAlign: 'center'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 15,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div style={{ textAlign: 'left', marginBottom: 20 }}>
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--red)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                نسيت كلمة المرور؟
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 16,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, var(--red), var(--orange))',
                                color: '#fff',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 30px rgba(229, 57, 53, 0.3)'
                            }}
                        >
                            {loading ? <span className="spinner" /> : 'تسجيل الدخول ←'}
                        </button>
                    </form>
                )}

                {/* Register Form */}
                {mode === 'register' && (
                    <form onSubmit={handleRegister}>
                        {/* Full Name */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                الاسم الكامل
                            </label>
                            <input
                                type="text"
                                placeholder="الاسم الأول والأخير"
                                value={registerData.fullName}
                                onChange={e => setRegisterData({ ...registerData, fullName: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={registerData.email}
                                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                رقم الهاتف
                            </label>
                            <input
                                type="tel"
                                placeholder="01xxxxxxxxx"
                                value={registerData.phone}
                                onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                كلمة المرور
                            </label>
                            <input
                                type="password"
                                placeholder="•••••••••"
                                value={registerData.password}
                                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                تأكيد كلمة المرور
                            </label>
                            <input
                                type="password"
                                placeholder="•••••••••"
                                value={registerData.confirmPassword}
                                onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 16,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, var(--red), var(--orange))',
                                color: '#fff',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 30px rgba(229, 57, 53, 0.3)'
                            }}
                        >
                            {loading ? <span className="spinner" /> : 'إنشاء حساب جديد 🚀'}
                        </button>
                    </form>
                )}

                {/* Forgot Password Form */}
                {mode === 'forgot' && (
                    <form onSubmit={handleForgotPassword}>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={forgotData.email}
                                onChange={e => setForgotData({ ...forgotData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    direction: 'ltr',
                                    textAlign: 'center'
                                }}
                                required
                            />
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.6 }}>
                            سنرسل لك رابط استعادة كلمة المرور إلى بريدك الإلكتروني
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 16,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, var(--red), var(--orange))',
                                color: '#fff',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 30px rgba(229, 57, 53, 0.3)'
                            }}
                        >
                            {loading ? <span className="spinner" /> : 'إرسال رابط الاستعادة'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            style={{
                                width: '100%',
                                padding: 12,
                                marginTop: 15,
                                background: 'none',
                                border: '1px solid var(--border)',
                                color: 'var(--text-2)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                borderRadius: 10
                            }}
                        >
                            العودة لتسجيل الدخول
                        </button>
                    </form>
                )}

                {/* Terms */}
                <div style={{ 
                    marginTop: 30, 
                    padding: 20, 
                    background: 'rgba(229, 57, 53, 0.05)', 
                    borderRadius: 10, 
                    fontSize: '0.8rem', 
                    color: 'var(--text-3)',
                    textAlign: 'center',
                    lineHeight: 1.6
                }}>
                    {mode === 'register' && (
                        <>
                            بالتسجيل، أنت توافق على 
                            <button style={{ background: 'none', border: 'none', color: 'var(--red)', fontWeight: 700, cursor: 'pointer' }}>
                                الشروط والأحكام
                            </button>
                            و 
                            <button style={{ background: 'none', border: 'none', color: 'var(--red)', fontWeight: 700, cursor: 'pointer' }}>
                                سياسة الخصوصية
                            </button>
                        </>
                    )}
                    {mode === 'login' && (
                        <>
                            ليس لديك حساب؟ 
                            <button 
                                onClick={() => setMode('register')}
                                style={{ background: 'none', border: 'none', color: 'var(--red)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                سجل الآن مجاناً
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
