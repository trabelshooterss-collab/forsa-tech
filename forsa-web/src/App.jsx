import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoriesPage from './pages/CategoriesPage'
import PostAdPage from './pages/AdPostPage'
import AdDetailPage from './pages/AdDetailPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import WalletPage from './pages/WalletPage'
import SearchPage from './pages/SearchPage'
import AuthPage from './pages/AuthPage'
import VerificationPage from './pages/VerificationPage'
import AuctionPage from './pages/AuctionPage'
import AuctionsPage from './pages/AuctionsPage'
import CreateAuctionPage from './pages/CreateAuctionPage'
import CreatePage from './pages/CreatePage'
import { AuthContext, AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const requireAuth = (element) => {
    const ProtectedRoute = () => {
      const { isLoggedIn, loading } = useContext(AuthContext);
      if (loading) return <div>جاري التحميل...</div>;
      return isLoggedIn ? element : <Navigate to="/login" replace />;
    };
    return <ProtectedRoute />;
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="auctions" element={<AuctionsPage />} />
              <Route path="auction/:id" element={<AuctionPage />} />
              <Route path="ad/:id" element={<AdDetailPage />} />
              <Route path="create" element={requireAuth(<CreatePage />)} />
              <Route path="post" element={requireAuth(<PostAdPage />)} />
              <Route path="create-auction" element={requireAuth(<CreateAuctionPage />)} />
              <Route path="chat" element={requireAuth(<ChatPage />)} />
              <Route path="profile" element={requireAuth(<ProfilePage />)} />
              <Route path="wallet" element={requireAuth(<WalletPage />)} />
              <Route path="verify" element={requireAuth(<VerificationPage />)} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
