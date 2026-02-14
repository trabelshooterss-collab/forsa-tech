import React from 'react';
import { useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';

/**
 * AdCard Component - Unified premium card for ads across the platform.
 * Includes trust signals: Verified Seller Badge & Forsa Shield Protection.
 */
export default function AdCard({ ad }) {
    const nav = useNavigate();
    const imgUrl = ad.image_urls?.[0] || ad.img || 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="ad-card glass" onClick={() => nav(`/ad/${ad.id}`)}>
            <div style={{ position: 'relative' }}>
                <LazyImage 
                    className="thumb" 
                    src={imgUrl} 
                    alt={ad.title}
                    style={{ width: '100%', height: '100%' }}
                />

                {/* Trust Signal: Forsa Shield */}
                {ad.shield && (
                    <div className="shield-badge" title="Forsa Shield Protected">
                        🛡️
                    </div>
                )}

                {/* Trust Signal: Verified Seller (overlay on image for high trust) */}
                {ad.isVerified && (
                    <div className="verified-badge-overlay" title="بائع موثق">
                        <span className="tick">✔️</span>
                    </div>
                )}

                <div className="time-tag">منذ {ad.time}</div>
            </div>
            <div className="body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>{ad.title}</h3>
                    {/* Secondary Verified Icon near title if preferred */}
                    {ad.isVerified && <span className="verified-tick-inline" title="بائع موثق">✔️</span>}
                </div>
                <div className="price">{ad.priceStr || ad.price}</div>
                <div className="meta">
                    <span>📍 {ad.city}</span>
                    <span>📂 {ad.category}</span>
                </div>
            </div>

            <style jsx>{`
                .ad-card {
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .ad-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px var(--red-glow);
                }
                .shield-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    padding: 4px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 2;
                    animation: pulse-shield 2s infinite;
                }
                .verified-badge-overlay {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: var(--red);
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    z-index: 2;
                }
                .verified-tick-inline {
                    color: #1DA1F2;
                    font-size: 0.9rem;
                    margin-right: 5px;
                }
                @keyframes pulse-shield {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            `}</style>
        </div>
    );
}
