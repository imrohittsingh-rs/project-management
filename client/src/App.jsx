import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  const [toastPosition, setToastPosition] = useState(
    window.innerWidth >= 768 ? "bottom-right" : "top-center"
  )

  useEffect(() => {
    const handleResize = () => {
      setToastPosition(window.innerWidth >= 768 ? "bottom-right" : "top-center")
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-[#fafbfc]">
          <Navbar />
          <main className="grow">
            <AppRoutes />
          </main>
          <Footer />
          <ToastContainer
            position={toastPosition}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            transition={Bounce}
            theme="light"
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App