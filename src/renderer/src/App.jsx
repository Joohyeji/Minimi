import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header/Header'
import Welcome from './components/Welcome/Welcome'
import SignIn from './components/Welcome/SignIn'

import Dashboard from './components/Dashboard/Dashboard'
import MyMinimies from './components/Dashboard/MyMinimies'
import ExploreMore from './components/Dashboard/ExploreMore'
import CreateMinimi from './components/CreateMinimi/CreateMinimi'
import ReadMinimiCard from './components/CreateMinimi/ReadMinimiCard'
import ToastMessage from './components/Common/ToastMessage'

function App() {
  return (
    <Router>
      <div className="pt-5 h-full">
        <Header />
        <div className="px-12 mt-10">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="myminimies" element={<MyMinimies />} />
              <Route path="explore" element={<ExploreMore />} />
            </Route>
            <Route path="/createminimi" element={<CreateMinimi />} />
            <Route path="/createminimi/:id" element={<CreateMinimi />} />
            <Route path="/readminimi/:id" element={<ReadMinimiCard />} />
          </Routes>
        </div>
        <ToastMessage />
      </div>
    </Router>
  )
}

export default App
