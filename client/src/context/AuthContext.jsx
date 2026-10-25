import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser as getCurrentUserService,
  changePassword as changePasswordService,
  refreshAccessToken as refreshAccessTokenService,
  verifyEmail as verifyEmailService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  resendVerificationEmail as resendVerificationEmailService
} from "../services/authService.js"

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  // Restore the session when the app loads.
    useEffect(() => {
        const checkAuth = async() => {
            try {
                const response = await getCurrentUserService();
                setUser(response?.data?.user);
            } catch (error) {
                setUser(null);
            }finally{
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    const register = async (userData) => {
        return await registerService(userData);
    }

    const login = async (userData) => {
        const response = await loginService(userData);
        const loggedInUser = setUser(response?.data?.user);
        return loggedInUser;
    }

    const logout = async () => {
        await logoutService();
        setUser(null);
    }

    const getCurrentUser = async () => {
        const response = await getCurrentUserService();
        const currentUser = setUser(response?.data?.user);
        return currentUser;
    }

    const changePassword = async (userData) => {
        return await changePasswordService(userData);
    }

    const refreshAccessToken = async () => {
        return await refreshAccessTokenService();
    }

    const verifyEmail = async (verificationToken) => {
        return await verifyEmailService(verificationToken);
    }

    const forgotPassword = async (email) => {
        return await forgotPasswordService(email);
    }

    const resetPassword = async (resetToken, newPassword) => {
        return await resetPasswordService(resetToken, newPassword);
    }

    const resendVerificationEmail = async () => {
        return await resendVerificationEmailService();
    }


    return (
        <AuthContext.Provider value={{ user, register, login, logout, getCurrentUser, changePassword, refreshAccessToken, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail, loading }}>
            {children}
        </AuthContext.Provider>
    )
}