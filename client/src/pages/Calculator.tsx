import { useState } from 'react'
import Navbar from '../components/Navbar'

interface ConversionResult {
  sqft: number
  sqm: number
  ropani: number
  aana: number
  paisa: number
  daam: number
  bigha: number
  kattha: number
  dhur: number
}

export default function Calculator() {
  const [mode, setMode] = useState<'simple' | 'unit'>('simple')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [unitValue, setUnitValue] = useState('')
  const [unitFrom, setUnitFrom] = useState('Ropani')
  const [result, setResult] = useState<ConversionResult | null>(null)

  const toSqft = (value: number, unit: string): number => {
    switch (unit) {
      case 'Ropani': return value * 5476
      case 'Aana': return value * 342.25
      case 'Paisa': return value * 85.56
      case 'Daam': return value * 21.39
      case 'Bigha': return value * 72900
      case 'Kattha': return value * 3645
      case 'Dhur': return value * 182.25
      case 'Sqft': return value
      case 'Sqm': return value * 10.764
      default: return 0
    }
  }

  const fromSqft = (sqft: number): ConversionResult => {
    return {
      sqft: parseFloat(sqft.toFixed(2)),
      sqm: parseFloat((sqft / 10.764).toFixed(2)),
      ropani: parseFloat((sqft / 5476).toFixed(4)),
      aana: parseFloat((sqft / 342.25).toFixed(4)),
      paisa: parseFloat((sqft / 85.56).toFixed(4)),
      daam: parseFloat((sqft / 21.39).toFixed(4)),
      bigha: parseFloat((sqft / 72900).toFixed(4)),
      kattha: parseFloat((sqft / 3645).toFixed(4)),
      dhur: parseFloat((sqft / 182.25).toFixed(4)),
    }
  }

  const calculateSimple = () => {
    const l = parseFloat(length)
    const w = parseFloat(width)
    if (isNaN(l) || isNaN(w)) return
    const sqft = l * w
    setResult(fromSqft(sqft))
  }

  const calculateUnit = () => {
    const val = parseFloat(unitValue)
    if (isNaN(val)) return
    const sqft = toSqft(val, unitFrom)
    setResult(fromSqft(sqft))
  }

  const units = ['Ropani', 'Aana', 'Paisa', 'Daam', 'Bigha', 'Kattha', 'Dhur', 'Sqft', 'Sqm']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Land Area Calculator
          </p>
          <h1 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '32px',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            जग्गा क्षेत्रफल क्याल्कुलेटर
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Convert between Nepali and international land measurement units
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '24px',
          width: 'fit-content'
        }}>
          {(['simple', 'unit'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null) }}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#0F1A14' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {m === 'simple' ? 'Length x Width' : 'Unit Converter'}
            </button>
          ))}
        </div>

        {/* Simple Mode */}
        {mode === 'simple' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              Enter the length and width of your land in feet
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px'
                }}>
                  Length (feet)
                </label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 50"
                  value={length}
                  onChange={e => setLength(e.target.value)}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px'
                }}>
                  Width (feet)
                </label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 40"
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                />
              </div>
            </div>
            <button className="btn-primary" onClick={calculateSimple}>
              Calculate Area
            </button>
          </div>
        )}

        {/* Unit Converter Mode */}
        {mode === 'unit' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              Enter a value in any unit to convert to all others
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px'
                }}>
                  Value
                </label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 3"
                  value={unitValue}
                  onChange={e => setUnitValue(e.target.value)}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px'
                }}>
                  Unit
                </label>
                <select
                  className="input"
                  value={unitFrom}
                  onChange={e => setUnitFrom(e.target.value)}
                >
                  {units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={calculateUnit}>
              Convert
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{
              fontFamily: 'Mukta, sans-serif',
              fontSize: '18px',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Results
            </h3>

            {/* Highlight sqft */}
            <div style={{
              background: 'var(--bg-surface)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '0 8px 8px 0',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>
                Total Area
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '28px',
                color: 'var(--accent)',
                fontWeight: '500'
              }}>
                {result.sqft.toLocaleString()} sq.ft
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                color: 'var(--text-muted)',
                marginTop: '4px'
              }}>
                {result.sqm.toLocaleString()} sq.m
              </p>
            </div>

            {/* All units grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              {[
                { label: 'Ropani', value: result.ropani },
                { label: 'Aana', value: result.aana },
                { label: 'Paisa', value: result.paisa },
                { label: 'Daam', value: result.daam },
                { label: 'Bigha', value: result.bigha },
                { label: 'Kattha', value: result.kattha },
                { label: 'Dhur', value: result.dhur },
              ].map(unit => (
                <div key={unit.label} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {unit.label}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '14px',
                    color: 'var(--text-primary)'
                  }}>
                    {unit.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '24px'
        }}>
          <h3 style={{
            fontFamily: 'Mukta, sans-serif',
            fontSize: '16px',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            Unit Reference
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { unit: '1 Ropani', eq: '16 Aana = 5,476 sq.ft' },
              { unit: '1 Aana', eq: '4 Paisa = 342.25 sq.ft' },
              { unit: '1 Paisa', eq: '4 Daam = 85.56 sq.ft' },
              { unit: '1 Bigha', eq: '20 Kattha = 72,900 sq.ft' },
              { unit: '1 Kattha', eq: '20 Dhur = 3,645 sq.ft' },
              { unit: '1 Dhur', eq: '182.25 sq.ft' },
            ].map(row => (
              <div key={row.unit} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: '13px'
              }}>
                <span style={{
                  color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {row.unit}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {row.eq}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}