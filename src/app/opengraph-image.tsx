import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = "Fresh N' Grill - BBQ Recipes & Grilling Tips";
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
            background: 'linear-gradient(135deg, #00bf63 0%, #009e52 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 20px 60px rgba(0, 191, 99, 0.3)',
          }}
        >
          <span style={{ color: 'white', fontSize: 56, fontWeight: 'bold' }}>FG</span>
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
          Fresh N&apos; Grill
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
          BBQ Recipes &amp; Grilling Tips
        </p>

        {/* Accent Line */}
        <div
          style={{
            width: 160,
            height: 4,
            background: '#00bf63',
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
          <span>65+ Recipes</span>
          <span>•</span>
          <span>Cook Mode</span>
          <span>•</span>
          <span>BBQ &amp; Grilling</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
