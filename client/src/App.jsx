import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-[#fafbfc]">
          <Navbar />
          <main className="flex-1">
            <ProtectedRoutes>
              <AppRoutes />
            </ProtectedRoutes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
