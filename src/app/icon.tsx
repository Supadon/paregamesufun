import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default function Icon() {
  // Read logo.jpg and convert to base64 data URL
  const logoPath = path.join(process.cwd(), 'public', 'logo.jpg')
  const logoData = fs.readFileSync(logoPath)
  const base64Logo = `data:image/jpeg;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={base64Logo}
          alt="Logo"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
