import { useEffect, useRef, useState } from 'react'

// Foto tim dengan bingkai polaroid, sedikit miring, mengikuti gerakan mouse
// (tilt halus), dan membesar penuh saat kursor diarahkan ke fotonya.
export default function TeamPhoto() {
  const frameRef = useRef(null)
  const raf = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const hoveredRef = useRef(false)

  useEffect(() => {
    hoveredRef.current = hovered
    if (hovered && frameRef.current) {
      frameRef.current.style.transform = 'rotate(0deg)'
    }
  }, [hovered])

  useEffect(() => {
    function handleMove(e) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      target.current = { x: nx, y: ny }
    }

    function tick() {
      if (!hoveredRef.current) {
        const c = current.current
        const t = target.current
        c.x += (t.x - c.x) * 0.06
        c.y += (t.y - c.y) * 0.06
        if (frameRef.current) {
          const rotY = c.x * 10
          const rotX = -c.y * 8
          const moveX = c.x * 8
          const moveY = c.y * 8
          frameRef.current.style.transform =
            `rotate(-4deg) translate(${moveX}px, ${moveY}px) perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
        }
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        className={`team-photo-wrap${hovered ? ' expanded' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="team-photo-frame" ref={frameRef}>
          <span className="team-photo-pin"></span>
          <img src="/team-photo.jpg" alt="Tim Always Selalu" />
          <p className="team-photo-caption">Always Selalu Team</p>
        </div>
      </div>
      <div className="team-photo-overlay"></div>
    </>
  )
}
