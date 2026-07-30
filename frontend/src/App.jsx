import { useMemo, useState } from 'react'
import './App.css'

const initialActivity = [
  { account: '•••• 4821', amount: 1280.5, date: '30/07/2026', status: 'PROCESADO' },
  { account: '•••• 1074', amount: 75, date: '29/07/2026', status: 'PROCESADO' },
  { account: '•••• 9312', amount: 240.2, date: '29/07/2026', status: 'RECHAZADA' },
]

const Icon = ({ name, size = 20 }) => {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.3 2.3 0 1 1 3.5 2c-1.3.8-1.3 1.3-1.3 2M12 17h.01" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  }

  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const formatMoney = (value) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value)

function App() {
  const [form, setForm] = useState({ account: '', amount: '', date: '' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [activity, setActivity] = useState(initialActivity)
  const [loading, setLoading] = useState(false)

  const processedTotal = useMemo(
    () => activity.filter((item) => item.status === 'PROCESADO').reduce((sum, item) => sum + Number(item.amount), 0),
    [activity],
  )

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!/^\d{10}$/.test(form.account.trim())) nextErrors.account = 'Ingresa una cuenta de exactamente 10 dígitos.'
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = 'El monto debe ser mayor que cero.'
    if (!form.date) nextErrors.date = 'Selecciona la fecha de la transacción.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    const [year, month, day] = form.date.split('-')
    const displayDate = `${day}/${month}/${year}`
    setLoading(true)
    setResult(null)

    try {
      const query = new URLSearchParams({
        account: form.account.trim(),
        amount: form.amount,
        date: displayDate,
      })
      const response = await fetch(`/validation/transaction?${query}`)
      if (!response.ok) throw new Error('No se pudo completar la validación.')
      const data = await response.json()
      setResult(data)
      setActivity((items) => [{
        account: `•••• ${form.account.slice(-4)}`,
        amount: Number(form.amount),
        date: displayDate,
        status: data.status,
      }, ...items].slice(0, 5))
    } catch {
      setResult({
        status: 'SIN_CONEXION',
        rejectionReason: 'El servicio de validación no está disponible. Inicia el backend e inténtalo nuevamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm({ account: '', amount: '', date: '' })
    setErrors({})
    setResult(null)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span /><span /><span /></div>
          <span>iRoute</span>
        </div>
        <nav aria-label="Navegación principal">
          <p className="nav-label">ESPACIO DE TRABAJO</p>
          <a href="#overview"><Icon name="grid" /> Resumen</a>
          <a className="active" href="#validate"><Icon name="check" /> Validar transacción</a>
          <a href="#activity"><Icon name="history" /> Historial</a>
          <p className="nav-label secondary">SISTEMA</p>
          <a href="#settings"><Icon name="settings" /> Configuración</a>
        </nav>
        <div className="sidebar-footer">
          <div className="support-card">
            <Icon name="help" size={22} />
            <strong>¿Necesitas ayuda?</strong>
            <span>Consulta la guía del sistema.</span>
            <button type="button">Ver documentación</button>
          </div>
          <div className="user-card">
            <div className="avatar">AM</div>
            <div><strong>Andrea M.</strong><span>Operaciones</span></div>
            <button type="button" aria-label="Opciones">•••</button>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="mobile-brand">iRoute</div>
          <div className="top-actions">
            <button type="button" aria-label="Ayuda"><Icon name="help" /></button>
            <button className="notification" type="button" aria-label="Notificaciones"><Icon name="bell" /><span /></button>
            <div className="avatar small">AM</div>
          </div>
        </header>

        <div className="content">
          <section className="page-intro" id="overview">
            <div>
              <span className="eyebrow">OPERACIONES / VALIDACIÓN</span>
              <h1>Validar transacción</h1>
              <p>Comprueba que los datos cumplan las reglas antes de procesarlos.</p>
            </div>
            <div className="api-status"><span /> Servicio de validación</div>
          </section>

          <section className="metrics" aria-label="Resumen de actividad">
            <article><div className="metric-icon blue"><Icon name="check" /></div><div><span>Procesadas en sesión</span><strong>{activity.filter((item) => item.status === 'PROCESADO').length}</strong><small><b>+12%</b> vs. sesión anterior</small></div></article>
            <article><div className="metric-icon amber"><Icon name="history" /></div><div><span>Pendientes de revisión</span><strong>{activity.filter((item) => item.status === 'RECHAZADA').length}</strong><small>Requieren atención</small></div></article>
            <article><div className="metric-icon violet"><Icon name="card" /></div><div><span>Volumen procesado</span><strong>{formatMoney(processedTotal)}</strong><small>En esta sesión</small></div></article>
          </section>

          <div className="workspace">
            <section className="panel form-panel" id="validate">
              <div className="panel-heading">
                <div><span className="step">01</span><h2>Datos de la transacción</h2></div>
                <p>Todos los campos son obligatorios.</p>
              </div>
              <form onSubmit={submit} noValidate>
                <label>
                  Número de cuenta
                  <div className={`input-wrap ${errors.account ? 'invalid' : ''}`}><Icon name="card" /><input name="account" value={form.account} onChange={updateField} inputMode="numeric" maxLength="10" placeholder="Ej. 0123456789" /></div>
                  {errors.account ? <small className="error">{errors.account}</small> : <small>Debe contener 10 dígitos numéricos.</small>}
                </label>
                <div className="form-row">
                  <label>
                    Monto
                    <div className={`input-wrap ${errors.amount ? 'invalid' : ''}`}><span className="currency">$</span><input name="amount" value={form.amount} onChange={updateField} type="number" min="0.01" step="0.01" placeholder="0.00" /></div>
                    {errors.amount ? <small className="error">{errors.amount}</small> : <small>Valor en dólares (USD).</small>}
                  </label>
                  <label>
                    Fecha
                    <div className={`input-wrap ${errors.date ? 'invalid' : ''}`}><Icon name="calendar" /><input name="date" value={form.date} onChange={updateField} type="date" /></div>
                    {errors.date ? <small className="error">{errors.date}</small> : <small>Fecha de la transacción.</small>}
                  </label>
                </div>

                {result && (
                  <div className={`result ${result.status === 'PROCESADO' ? 'success' : 'failure'}`} role="status">
                    <div className="result-icon">{result.status === 'PROCESADO' ? <Icon name="check" /> : <Icon name="close" />}</div>
                    <div>
                      <strong>{result.status === 'PROCESADO' ? 'Transacción válida' : result.status === 'RECHAZADA' ? 'Transacción rechazada' : 'Servicio no disponible'}</strong>
                      <span>{result.status === 'PROCESADO' ? 'Los datos cumplen todas las reglas de validación.' : result.rejectionReason}</span>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button className="button ghost" type="button" onClick={reset}>Limpiar</button>
                  <button className="button primary" type="submit" disabled={loading}>{loading ? 'Validando…' : 'Validar transacción'} <Icon name="arrow" /></button>
                </div>
              </form>
            </section>

            <aside className="panel activity-panel" id="activity">
              <div className="panel-heading row">
                <div><span className="step">02</span><h2>Actividad reciente</h2></div>
                <button type="button">Ver todo</button>
              </div>
              <div className="activity-list">
                {activity.slice(0, 4).map((item, index) => (
                  <div className="activity-item" key={`${item.account}-${item.date}-${index}`}>
                    <div className={`status-dot ${item.status === 'PROCESADO' ? 'ok' : 'bad'}`}><Icon name={item.status === 'PROCESADO' ? 'check' : 'close'} size={15} /></div>
                    <div><strong>{item.account}</strong><span>{item.date}</span></div>
                    <div className="amount"><strong>{formatMoney(item.amount)}</strong><span className={item.status === 'PROCESADO' ? 'status-ok' : 'status-bad'}>{item.status === 'PROCESADO' ? 'Procesada' : 'Rechazada'}</span></div>
                  </div>
                ))}
              </div>
              <div className="security-note">
                <div className="shield">✓</div>
                <div><strong>Validación segura</strong><span>Los datos se procesan de forma cifrada y no se almacenan en este dispositivo.</span></div>
              </div>
            </aside>
          </div>
          <footer><span>© 2026 iRoute · Plataforma de operaciones</span><span>v1.0.0 &nbsp;·&nbsp; Entorno seguro</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
