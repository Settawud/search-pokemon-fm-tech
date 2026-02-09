import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Pokémon Search - ค้นหาโปเกมอนทุกตัว';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50px',
                        left: '100px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.1)',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        right: '100px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(147, 51, 234, 0.1)',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Pokeball Icon */}
                <div
                    style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'linear-gradient(180deg, #ef4444 0%, #ef4444 48%, #1e293b 48%, #1e293b 52%, #ffffff 52%, #ffffff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '30px',
                        boxShadow: '0 0 60px rgba(59, 130, 246, 0.5)',
                        border: '8px solid #1e293b',
                    }}
                >
                    {/* Center button */}
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'white',
                            border: '6px solid #1e293b',
                        }}
                    />
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: '72px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0',
                        textAlign: 'center',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    Pokémon Search
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '32px',
                        color: '#94a3b8',
                        margin: '20px 0 0 0',
                        textAlign: 'center',
                    }}
                >
                    ค้นหาโปเกมอนกว่า 1000+ ตัว พร้อม Stats & Abilities
                </p>

                {/* CTA */}
                <div
                    style={{
                        marginTop: '30px',
                        padding: '12px 32px',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        borderRadius: '30px',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    🎮 ลองเลย!
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
