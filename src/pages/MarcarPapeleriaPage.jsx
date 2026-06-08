import { useState } from 'react'
import { useEditGate, LockToggle } from '../hooks/useEditGate'
import { papeleriaInicial } from '../utils/papeleria'

// Pantalla para MARCAR qué insumos son papelería / packaging. Viene pre-tildada
// con la detección por nombre (cajas, bandejas, bolsas…); el user confirma,
// agrega o saca. Al guardar, persiste `esPapeleria` (true/false) en TODOS los
// insumos para que no se vuelva a auto-tildar lo que sacaste.
export default function MarcarPapeleriaPage({ insumos, setInsumos, onBack }) {
  const { canEdit } = useEditGate()
  const [search, setSearch] = useState('')
  const [soloMarcados, setSoloMarcados] = useState(false)
  const [draft, setDraft] = useState({}) // { [id]: bool }

  const estado = (ins) => (draft[ins.id] !== undefined ? draft[ins.id] : papeleriaInicial(ins))
  const toggle = (id, val) => setDraft((d) => ({ ...d, [id]: val }))

  const marcados = insumos.filter((i) => estado(i)).length
  const hayCambios = insumos.some((i) => estado(i) !== !!i.esPapeleria)

  const filtered = insumos
    .filter((i) => i.nombre.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => (soloMarcados ? estado(i) : true))
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  const guardar = () => {
    setInsumos((prev) => prev.map((i) => ({ ...i, esPapeleria: !!estado(i) })))
    setDraft({})
    onBack()
  }

  return (
    <div className="flex flex-col min-h-full bg-brand-50">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-50 text-brand-500 text-lg font-bold"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800 flex-1">Insumos de papelería</h1>
          <LockToggle />
        </div>
        <input
          type="text"
          placeholder="Buscar insumo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{marcados} marcados como papelería</span>
          <button
            onClick={() => setSoloMarcados((s) => !s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              soloMarcados ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            {soloMarcados ? '✓ Solo marcados' : 'Solo marcados'}
          </button>
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 pt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
          <p className="text-xs text-blue-800 leading-relaxed">
            Marcá cuáles son packaging (cajas, bandejas, bolsas, blondas…). Te dejé tildados los que
            detecté por el nombre — revisalos y ajustá. Sirve para avisarte qué productos no tienen
            packaging cargado en la receta.
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 px-4 py-4 space-y-2 pb-28">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-sm">No hay insumos que coincidan.</p>
        )}
        {filtered.map((ins) => {
          const on = estado(ins)
          return (
            <button
              key={ins.id}
              onClick={() => canEdit && toggle(ins.id, !on)}
              disabled={!canEdit}
              className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border text-left transition-colors ${
                on ? 'bg-blue-50 border-blue-200' : 'bg-white border-brand-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold break-words ${on ? 'text-blue-900' : 'text-gray-700'}`}>{ins.nombre}</p>
                <p className="text-[11px] text-gray-400">{ins.unidad}</p>
              </div>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  on ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-300'
                }`}
              >
                {on ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {/* Guardar (sticky) */}
      {canEdit && hayCambios && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-brand-100 px-4 py-3 z-40">
          <button
            onClick={guardar}
            className="w-full py-3.5 rounded-2xl bg-blue-500 text-white font-bold text-base active:scale-95 transition-transform"
          >
            Guardar papelería ({marcados})
          </button>
        </div>
      )}
    </div>
  )
}
