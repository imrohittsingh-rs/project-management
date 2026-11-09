import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoutes from './components/ProtectedRoutes';
import { useLocation } from 'react-router-dom';

// Inner layout component that reads location after Router is mounted
const Layout = () => {
  const location = useLocation();
  const isAppPage = ['/dashboard', '/projects', '/profile'].some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="flex-1">
        <ProtectedRoutes>
          <AppRoutes />
        </ProtectedRoutes>
      </main>
      {!isAppPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
