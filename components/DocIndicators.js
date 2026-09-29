import { IconQuotation, IconPO, IconCamera, IconBast } from './Icons'
import { DOC_TYPES } from '../lib/docTypes'

const ICONS = {
  quotation: IconQuotation,
  po: IconPO,
  foto: IconCamera,
  bast: IconBast,
}

// Menampilkan 4 indikator: hijau = sudah diupload, merah = belum diupload
export default function DocIndicators({ types }) {
  const uploaded = types || new Set()
  return (
    <div className="doc-indicators">
      {DOC_TYPES.map(({ key, label }) => {
        const Icon = ICONS[key]
        const done = uploaded.has(key)
        const text = `${label}: ${done ? 'sudah diupload' : 'belum diupload'}`
        return (
          <span key={key} className={`doc-chip ${done ? 'done' : 'missing'}`} title={text} aria-label={text}>
            <Icon />
            <span>{label}</span>
          </span>
        )
      })}
    </div>
  )
}
