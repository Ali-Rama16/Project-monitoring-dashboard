import { useState } from 'react'

// Satu foto polaroid: diam sedikit miring saat normal, dan membesar penuh
// ke tengah layar (efek lightbox) saat kursor diarahkan ke fotonya.
// Transisi murni lewat CSS supaya animasinya halus, tanpa update per-frame.
function Polaroid({ src, caption, rotate, bottom }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`team-photo-wrap${hovered ? ' expanded' : ''}`}
      style={hovered ? undefined : { bottom, transform: `rotate(${rotate}deg)` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="team-photo-frame">
        <span className="team-photo-pin"></span>
        <img src={src} alt={caption} />
        <p className="team-photo-caption">{caption}</p>
      </div>
    </div>
  )
}

export default function TeamPhoto() {
  return (
    <>
      <Polaroid src="/team-photo-2.jpg" caption="Always Selalu Team" rotate={3} bottom="548px" />
      <Polaroid src="/team-photo.jpg" caption="Always Selalu Team" rotate={-4} bottom="46px" />
      <div className="team-photo-overlay"></div>
    </>
  )
}
