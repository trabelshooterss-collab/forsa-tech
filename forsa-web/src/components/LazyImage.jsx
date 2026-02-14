import { useState, useRef, useEffect } from 'react'

export default function LazyImage({ src, alt, placeholder = 'https://placehold.co/400x300', ...props }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const imgRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={imgRef}
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: placeholder ? '#f5f5f5' : 'transparent',
                ...props.style
            }}
            className="lazy-image-container"
        >
            {!isLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f5f5f5',
                        zIndex: 1
                    }}
                >
                    <span className="spinner" />
                </div>
            )}

            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setIsLoaded(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        display: isLoaded ? 'block' : 'none'
                    }}
                    {...props}
                />
            )}
        </div>
    )
}
