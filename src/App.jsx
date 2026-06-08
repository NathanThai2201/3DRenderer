import { useState } from 'react'
import Canvas from './Canvas.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div><h2>3D RENDERER</h2></div>
    <Canvas/>
    </>
  )
}

export default App
