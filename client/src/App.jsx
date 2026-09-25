import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsCounter from './components/StatsCounter';
import ServicesSection from './components/ServicesSection';
import GiftsAndNeonSection from './components/GiftsAndNeonSection';
import PortfolioSection from './components/PortfolioSection';
import BeforeAfterSection from './components/BeforeAfterSection';
import QuoteSection from './components/QuoteSection';
import WhyChooseUs from './components/WhyChooseUs';
import ProcessSection from './components/ProcessSection';
import ReviewsSection from './components/ReviewsSection';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import MobileCtaBar from './components/MobileCtaBar';
import ServiceDetailModal from './components/ServiceDetailModal';
import ProjectLightboxModal from './components/ProjectLightboxModal';
import AdminDashboard from './components/AdminDashboard';
import BrandLogo from './components/BrandLogo';
import { CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  // Theme state: dark mode first by default
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cl_theme') || 'dark';
  });

  // Dedicated URL Routing (/admin vs /)
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Website data fetched completely from API
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & User Actions
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [preselectedQuoteService, setPreselectedQuoteService] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Sync Theme with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch complete bootstrap data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBootstrap();
      if (res.success && res.data) {
        setSiteData(res.data);

        // Update Document Title and SEO metadata dynamically from API
        if (res.data.settings?.seo_title) {
          document.title = res.data.settings.seo_title;
        }
      }
    } catch (err) {
      console.error('Failed to load website bootstrap:', err);
      setError('Unable to connect to the backend server. Please verify the API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll to Quote Section with optional service pre-selection
  const handleQuoteClick = (service = null) => {
    if (service) {
      setPreselectedQuoteService(service);
    }
    const el = document.getElementById('quote');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading Screen with Luxury Golden Aesthetic
  if (loading && !siteData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#050505',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}
      >
        <BrandLogo size="large" />
        <div
          style={{
            width: '200px',
            height: '3px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '50%',
              background: 'var(--gold-gradient)',
              animation: 'shimmer 1.5s infinite linear'
            }}
          />
        </div>
        <p style={{ color: 'var(--gold-primary)', fontSize: '0.86rem', letterSpacing: '0.1em', fontWeight: 600 }}>
          LOADING CREDIBLE LIGHT...
        </p>
      </div>
    );
  }

  // Error State with Retry Button
  if (error && !siteData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#050505',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}
      >
        <BrandLogo size="normal" />
        <div style={{ marginTop: '24px', maxWidth: '460px' }}>
          <AlertCircle size={44} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
            Connection Notice
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.92rem', marginBottom: '24px' }}>
            {error}
          </p>
          <button onClick={loadData} className="btn-primary">
            <RefreshCw size={18} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // DEDICATED ADMIN PORTAL ROUTE (/admin)
  // If accessing /admin, render ONLY the standalone Admin Management Console
  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    return (
      <div className="credible-light-admin-page" style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#FFF' }}>
        <AdminDashboard
          isStandalonePage={true}
          onNavigateWebsite={() => navigate('/')}
          onDataRefresh={loadData}
          onShowToast={showToast}
        />
        {/* Toast Notification Container */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
            >
              {toast.type === 'error' ? (
                <AlertCircle size={20} color="#EF4444" />
              ) : (
                <CheckCircle2 size={20} color="#22C55E" />
              )}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const {
    settings = {},
    services = [],
    categories = [],
    projects = [],
    beforeAfter = [],
    testimonials = [],
    processSteps = [],
    businessStats = [],
    giftProducts = []
  } = siteData || {};

  return (
    <div className="credible-light-app">
      {/* Sticky Blurred Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAdmin={() => navigate('/admin')}
        onQuoteClick={() => handleQuoteClick()}
        settings={settings}
      />

      {/* Hero Section */}
      <Hero
        settings={settings}
        onQuoteClick={() => handleQuoteClick()}
      />

      {/* Trust & Business Counters */}
      <StatsCounter stats={businessStats} />

      {/* Services Section */}
      <ServicesSection
        services={services}
        onSelectService={(s) => setSelectedService(s)}
        onQuoteWithService={(s) => handleQuoteClick(s)}
      />

      {/* Personalized Gifts & Live Neon Sign Studio */}
      <GiftsAndNeonSection
        giftProducts={giftProducts}
        settings={settings}
        onShowToast={showToast}
      />

      {/* Portfolio / Recent Projects */}
      <PortfolioSection
        projects={projects}
        categories={categories}
        onSelectProject={(p) => setSelectedProject(p)}
        onQuoteClick={() => handleQuoteClick()}
      />

      {/* Before / After Interactive Slider */}
      <BeforeAfterSection
        beforeAfter={beforeAfter}
        onQuoteClick={() => handleQuoteClick()}
      />

      {/* Free Quotation Form Section */}
      <QuoteSection
        services={services}
        settings={settings}
        preselectedService={preselectedQuoteService}
        onShowToast={showToast}
      />

      {/* Why Choose Credible Light */}
      <WhyChooseUs stats={businessStats} />

      {/* Our 5-Step Process */}
      <ProcessSection steps={processSteps} />

      {/* Customer Reviews & Testimonials */}
      <ReviewsSection
        testimonials={testimonials}
        onQuoteClick={() => handleQuoteClick()}
      />

      {/* Final Prominent Call To Action */}
      <FinalCta
        settings={settings}
        onQuoteClick={() => handleQuoteClick()}
      />

      {/* Rich Footer with QR Code */}
      <Footer
        settings={settings}
        services={services}
        onNavigate={navigate}
      />

      {/* Sticky Bottom Mobile Bar */}
      <MobileCtaBar
        settings={settings}
        onQuoteClick={() => handleQuoteClick()}
      />

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          settings={settings}
          onClose={() => setSelectedService(null)}
          onQuote={(srv) => handleQuoteClick(srv)}
        />
      )}

      {/* Project Lightbox Modal */}
      {selectedProject && (
        <ProjectLightboxModal
          project={selectedProject}
          settings={settings}
          onClose={() => setSelectedProject(null)}
          onQuote={() => handleQuoteClick()}
        />
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={20} color="#EF4444" />
            ) : (
              <CheckCircle2 size={20} color="#22C55E" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
