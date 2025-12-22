import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Menucochon - Delicious Quebec Recipes';
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
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo Circle */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F77313 0%, #d45f0a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 20px 60px rgba(247, 115, 19, 0.3)',
          }}
        >
          <span style={{ color: 'white', fontSize: 56, fontWeight: 'bold' }}>MC</span>
        </div>

        {/* Title */}
        <h1
          style={{
            color: 'white',
            fontSize: 72,
            fontWeight: 'bold',
            margin: 0,
            marginBottom: 16,
            letterSpacing: '-2px',
          }}
        >
          Menucochon
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: '#888888',
            fontSize: 32,
            margin: 0,
            marginBottom: 40,
          }}
        >
          Delicious Quebec Recipes
        </p>

        {/* Accent Line */}
        <div
          style={{
            width: 160,
            height: 4,
            background: '#F77313',
            borderRadius: 2,
          }}
        />

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 50,
            color: '#666666',
            fontSize: 20,
          }}
        >
          <span>500+ Recipes</span>
          <span>•</span>
          <span>Cooking Mode</span>
          <span>•</span>
          <span>Built-in Radio</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
