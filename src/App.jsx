import SideRays from '../SideRays.jsx'

function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <SideRays
        speed={1.8}
        rayColor1="#60a5fa"
        rayColor2="#e0f2fe"
        intensity={2.2}
        spread={2}
        origin="top-right"
        tilt={0}
        saturation={1.2}
        blend={0.70}
        falloff={1.8}
        opacity={1.0}
      />
    </div>
  )
}

export default App
