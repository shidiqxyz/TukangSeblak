'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppContactless() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const formatPhoneNumber = (number) => {
        // Remove all non-numeric characters
        let cleaned = number.replace(/\D/g, '');

        // Handle Indonesian numbers starting with 0
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }

        return cleaned;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const formattedNumber = formatPhoneNumber(phoneNumber);

        if (!formattedNumber || formattedNumber.length < 10) {
            setError('Masukkan nomor telepon yang valid');
            return;
        }

        // Build the wa.me URL
        let waUrl = `https://wa.me/${formattedNumber}`;

        // Add message if provided
        if (message.trim()) {
            waUrl += `?text=${encodeURIComponent(message)}`;
        }

        // Open WhatsApp
        window.open(waUrl, '_blank');
    };

    const handlePhoneChange = (e) => {
        // Only allow numbers and common phone number characters
        const value = e.target.value.replace(/[^\d+\-\s()]/g, '');
        setPhoneNumber(value);
        setError('');
    };

    return (
        <div className="cinematic-container">
            {/* Background Effects */}
            <div className="cinematic-backdrop" style={{ background: 'linear-gradient(135deg, #075e54 0%, #128c7e 50%, #25d366 100%)' }} />
            <div className="cinematic-overlay" />
            <div className="cinematic-vignette" />

            {/* Navigation */}
            <nav className="cinematic-nav">
                <Link href="/" className="nav-back">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    BACK
                </Link>
                <div className="nav-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WA CONTACTLESS
                </div>
                <div className="nav-actions"></div>
            </nav>

            {/* Main Content */}
            <main className="cinematic-main">
                <div className="wa-contactless-card">
                    <div className="wa-card-header">
                        <div className="wa-icon-container">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#25d366">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <h1>WhatsApp Contactless</h1>
                        <p>Hubungi nomor WhatsApp tanpa perlu menyimpan kontak</p>
                    </div>

                    <form onSubmit={handleSubmit} className="wa-form">
                        <div className="wa-input-group">
                            <label htmlFor="phone">Nomor Telepon</label>
                            <div className="wa-input-wrapper">
                                <span className="wa-input-prefix">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                </span>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="08123456789 atau 628123456789"
                                    className="luxury-input wa-input"
                                    autoComplete="off"
                                />
                            </div>
                            <span className="wa-input-hint">Awalan 0 otomatis diubah ke 62 (Indonesia)</span>
                        </div>

                        <div className="wa-input-group">
                            <label htmlFor="message">Pesan (Opsional)</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tulis pesan yang ingin dikirim..."
                                className="luxury-input wa-textarea"
                                rows="3"
                            />
                        </div>

                        {error && (
                            <div className="wa-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="wa-submit-btn glow-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Buka WhatsApp
                        </button>
                    </form>

                    <div className="wa-footer">
                        <p>Menggunakan <a href="https://wa.me" target="_blank" rel="noopener noreferrer">wa.me</a> API</p>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .wa-contactless-card {
                    max-width: 480px;
                    width: 100%;
                    background: rgba(23, 23, 23, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 48px;
                    box-shadow:
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }

                .wa-card-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .wa-icon-container {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    height: 80px;
                    background: rgba(37, 211, 102, 0.1);
                    border-radius: 50%;
                    margin-bottom: 24px;
                    border: 1px solid rgba(37, 211, 102, 0.2);
                }

                .wa-card-header h1 {
                    font-size: 28px;
                    font-weight: 300;
                    color: #fff;
                    margin-bottom: 12px;
                    letter-spacing: -0.5px;
                }

                .wa-card-header p {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.6;
                }

                .wa-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .wa-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .wa-input-group label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .wa-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .wa-input-prefix {
                    position: absolute;
                    left: 16px;
                    color: #555;
                    pointer-events: none;
                }

                .wa-input {
                    width: 100%;
                    padding: 16px 16px 16px 48px;
                    font-size: 16px;
                    color: #fff;
                    border-radius: 8px;
                    outline: none;
                }

                .wa-textarea {
                    width: 100%;
                    padding: 16px;
                    font-size: 14px;
                    color: #fff;
                    border-radius: 8px;
                    outline: none;
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                }

                .wa-input-hint {
                    font-size: 11px;
                    color: #555;
                }

                .wa-error {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: rgba(220, 53, 69, 0.1);
                    border: 1px solid rgba(220, 53, 69, 0.3);
                    border-radius: 8px;
                    color: #ff6b7a;
                    font-size: 13px;
                }

                .wa-submit-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 18px 32px;
                    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 8px;
                }

                .wa-submit-btn:hover {
                    background: linear-gradient(135deg, #2be174 0%, #15a085 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.3);
                }

                .wa-submit-btn:active {
                    transform: translateY(0);
                }

                .wa-footer {
                    text-align: center;
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .wa-footer p {
                    font-size: 12px;
                    color: #555;
                }

                .wa-footer a {
                    color: #25d366;
                    text-decoration: none;
                    transition: color 0.3s;
                }

                .wa-footer a:hover {
                    color: #2be174;
                }

                @media (max-width: 600px) {
                    .wa-contactless-card {
                        padding: 32px 24px;
                        margin: 0 16px;
                    }

                    .wa-card-header h1 {
                        font-size: 24px;
                    }

                    .cinematic-nav {
                        padding: 16px 20px;
                    }
                }
            `}</style>
        </div>
    );
}
