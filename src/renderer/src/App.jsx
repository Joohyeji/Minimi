import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header/Header'
import Welcome from './components/Welcome/Welcome'
import SignIn from './components/Welcome/SignIn'

function App() {
  return (
    <Router>
      <div className="px-7 pt-5 h-auto">
        <Header />
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
