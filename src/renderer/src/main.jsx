import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'

const googleAnalyticsId = import.meta.env.VITE_MEASUREMENT_ID

if (googleAnalyticsId) {
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${googleAnalyticsId}');
  `
  document.head.appendChild(script2)
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
