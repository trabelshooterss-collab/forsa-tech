import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function BackButton({ label = 'رجوع' }) {
    const nav = useNavigate()
    return (
        <button
            onClick={() => nav(-1)}
            className="glass-btn-hover"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                marginBottom: 20,
                color: 'var(--text)',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
            }}
        >
            <ArrowRight size={18} />
            {label}
        </button>
    )
}
