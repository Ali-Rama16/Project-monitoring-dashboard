// Foto polaroid dengan efek 3D sederhana: miring diam saat normal, lalu
// terangkat + tilt 3D halus saat kursor di atasnya. Murni CSS (:hover),
// tanpa state React dan tanpa pelacakan posisi mouse per-frame, jadi
// tidak ada peluang "flicker" antara status hover dan tidak hover.
function Polaroid({ src, caption, rotate, bottom }) {
  return (
    <div className="team-photo-wrap" style={{ bottom, '--rot': `${rotate}deg` }}>
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
    </>
  )
}
