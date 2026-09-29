import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Repeat,
  Star,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  MessageCircle,
  Phone,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  UploadCloud,
  Copy,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  FileText,
  Gift
} from 'lucide-react';
import { api, getAuthToken, setAuthToken, getAuthUser, setAuthUser } from '../api';
import BrandLogo from './BrandLogo';

export default function AdminDashboard({ onClose, onNavigateWebsite, isStandalonePage = false, onDataRefresh, onShowToast }) {
  const [user, setUser] = useState(getAuthUser());
  const [token, setToken] = useState(getAuthToken());

  // Login form states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [lastLeadsRefresh, setLastLeadsRefresh] = useState(new Date());

  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projectSubView, setProjectSubView] = useState('projects'); // 'projects' or 'categories'
  const [editingProject, setEditingProject] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploadingProjectPhoto, setUploadingProjectPhoto] = useState(false);
  const [newProjectImageUrl, setNewProjectImageUrl] = useState('');

  const [beforeAfter, setBeforeAfter] = useState([]);
  const [editingBA, setEditingBA] = useState(null);

  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [mediaList, setMediaList] = useState([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);

  const [settings, setSettings] = useState({});
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [customOrders, setCustomOrders] = useState([]);

  // Load Admin Data
  useEffect(() => {
    if (token) {
      loadStats();
      loadEnquiries();
      loadServices();
      loadProjects();
      loadBeforeAfter();
      loadTestimonials();
      loadMedia();
      loadSettings();
      loadCustomOrders();
    }
  }, [token]);

  // Tab change handler that automatically syncs and re-fetches latest data for that tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'enquiries') {
      loadEnquiries(enquiryStatusFilter, enquirySearch);
      loadStats();
    } else if (tabId === 'dashboard') {
      loadStats();
      loadEnquiries(enquiryStatusFilter, enquirySearch);
      loadCustomOrders();
    } else if (tabId === 'projects') {
      loadProjects();
    } else if (tabId === 'customOrders') {
      loadCustomOrders();
    } else if (tabId === 'services') {
      loadServices();
    }
  };

  // Live Auto-Refresh polling (every 12 seconds) so new enquiries always show up
  useEffect(() => {
    if (!token) return;
    const timer = setInterval(() => {
      loadStats();
      if (activeTab === 'enquiries') {
        loadEnquiries(enquiryStatusFilter, enquirySearch, false);
      } else if (activeTab === 'customOrders') {
        loadCustomOrders();
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [token, activeTab, enquiryStatusFilter, enquirySearch]);

  const loadCustomOrders = async () => {
    try {
      const res = await api.getCustomOrdersAdmin();
      setCustomOrders(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      setStats(res.stats);
    } catch (e) {
      console.error(e);
    }
  };

  const loadEnquiries = async (status = enquiryStatusFilter, search = enquirySearch, showSpinner = true) => {
    try {
      if (showSpinner) setIsLoadingLeads(true);
      const res = await api.getEnquiries({
        status: status !== 'All' ? status : undefined,
        search: (search && search.trim()) ? search.trim() : undefined
      });
      setEnquiries(res.data || []);
      setLastLeadsRefresh(new Date());
    } catch (e) {
      console.error('Failed to load enquiries:', e);
    } finally {
      if (showSpinner) setIsLoadingLeads(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await api.getServicesAdmin();
      setServices(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.getProjectsAdmin();
      setProjects(res.data || []);
      const catRes = await api.getCategoriesAdmin();
      setCategories(catRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadBeforeAfter = async () => {
    try {
      const res = await api.getBeforeAfterAdmin();
      setBeforeAfter(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTestimonials = async () => {
    try {
      const res = await api.getTestimonialsAdmin();
      setTestimonials(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMedia = async () => {
    try {
      const res = await api.getMedia(mediaSearch);
      setMediaList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await api.getSettingsAdmin();
      setSettings(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await api.login(username, password);
      setToken(res.token);
      setUser(res.user);
      onShowToast && onShowToast('Admin logged in successfully', 'success');
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Invalid admin credentials', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setToken(null);
    setUser(null);
  };

  // If Not Authenticated -> Show Login Modal
  if (!token) {
    return (
      <div
        style={{
          position: isStandalonePage ? 'relative' : 'fixed',
          minHeight: isStandalonePage ? '100vh' : 'auto',
          inset: isStandalonePage ? 'auto' : 0,
          zIndex: 9999,
          backgroundColor: '#050505',
          backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(229,169,60,0.12) 0%, transparent 60%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        {isStandalonePage && (
          <button
            onClick={() => (onNavigateWebsite ? onNavigateWebsite() : window.location.href = '/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9CA3AF',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '9px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '28px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold-primary)'; e.currentTarget.style.borderColor = 'var(--gold-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            ← Return to Public Website
          </button>
        )}

        <div
          className="card-glass"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#0F0F0F',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--gold-glow-lg)',
            position: 'relative'
          }}
        >
          {!isStandalonePage && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          )}

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <BrandLogo size="normal" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '16px' }}>
              Admin CMS & CRM Portal
            </h3>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>
              Manage website content, leads, services & media
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '6px' }}
            >
              <span>{isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#777', marginTop: '4px' }}>
              Default credentials prefilled: <strong style={{ color: 'var(--gold-primary)' }}>admin / admin123</strong>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main Layout
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#080808',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0F0F0F',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div>
          {/* Logo & Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <BrandLogo size="small" />
            <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>
              ADMIN CONSOLE
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'enquiries', label: 'Leads & Enquiries', icon: Users, badge: stats?.newEnquiries },
              { id: 'customOrders', label: 'Gifts & Neon Orders', icon: Gift, badge: customOrders.filter(o => o.status === 'New').length },
              { id: 'services', label: 'Services Manager', icon: Briefcase },
              { id: 'projects', label: 'Portfolio Projects', icon: Layers },
              { id: 'beforeAfter', label: 'Before & After', icon: Repeat },
              { id: 'testimonials', label: 'Customer Reviews', icon: Star },
              { id: 'media', label: 'Media Library', icon: ImageIcon },
              { id: 'settings', label: 'Settings & SEO', icon: SettingsIcon },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(229, 169, 60, 0.15)' : 'transparent',
                    color: isActive ? 'var(--gold-primary)' : '#999',
                    fontFamily: 'var(--font-display)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: '#EF4444',
                        color: '#FFF',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#888' }}>
              Logged in: <strong style={{ color: '#fff' }}>{user?.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                color: '#EF4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              if (onNavigateWebsite) onNavigateWebsite();
              else if (onClose) onClose();
              else window.location.href = '/';
            }}
            className="btn-outline-gold"
            style={{ width: '100%', padding: '9px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ExternalLink size={15} />
            <span>View Live Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#080808',
          padding: '32px'
        }}
      >
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  Business Analytics & KPIs
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  Live overview of customer leads, conversion funnel, and site content
                </p>
              </div>

              <button
                onClick={() => {
                  loadStats();
                  loadEnquiries();
                  onShowToast && onShowToast('Dashboard data refreshed', 'success');
                }}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Refresh Data
              </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '36px' }}>
              {[
                { label: 'Total Enquiries', value: stats?.totalEnquiries || 0, icon: Users, color: '#E5A93C' },
                { label: 'New Uncontacted', value: stats?.newEnquiries || 0, icon: Clock, color: '#3B82F6' },
                { label: 'Contacted Leads', value: stats?.contactedLeads || 0, icon: Phone, color: '#F59E0B' },
                { label: 'Converted Orders', value: stats?.convertedLeads || 0, icon: CheckCircle2, color: '#10B981' },
                { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: '#8B5CF6' },
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className="card-glass"
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#888', fontWeight: 600 }}>{kpi.label}</span>
                      <Icon size={18} color={kpi.color} />
                    </div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
                      {kpi.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Leads Preview */}
            <div
              className="card-glass"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#121212',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  Recent Customer Inquiries
                </h3>
                <button
                  onClick={() => handleTabChange('enquiries')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  View All Leads →
                </button>
              </div>

              {enquiries.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                  No customer enquiries yet. Test submit the quote form on the home page!
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#888' }}>
                        <th style={{ padding: '10px' }}>Customer</th>
                        <th style={{ padding: '10px' }}>Service</th>
                        <th style={{ padding: '10px' }}>Size / Area</th>
                        <th style={{ padding: '10px' }}>Status</th>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.slice(0, 5).map((enq) => (
                        <tr key={enq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#DDD' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <strong style={{ color: '#fff' }}>{enq.customer_name}</strong>
                            <div style={{ fontSize: '0.78rem', color: '#888' }}>{enq.phone}</div>
                          </td>
                          <td style={{ padding: '12px 10px' }}>{enq.service_name}</td>
                          <td style={{ padding: '12px 10px' }}>{enq.approx_size || enq.city_location || 'N/A'}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor:
                                  enq.status === 'New' ? 'rgba(59, 130, 246, 0.2)' :
                                  enq.status === 'Converted' ? 'rgba(16, 185, 129, 0.2)' :
                                  'rgba(245, 158, 11, 0.2)',
                                color:
                                  enq.status === 'New' ? '#60A5FA' :
                                  enq.status === 'Converted' ? '#34D399' :
                                  '#FBBF24'
                              }}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', color: '#888', fontSize: '0.8rem' }}>
                            {new Date(enq.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <a
                              href={`https://wa.me/${(enq.whatsapp || enq.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.customer_name}, this is Credible Light following up on your ${enq.service_name} request.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#25D366',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none',
                                fontWeight: 600
                              }}
                            >
                              <MessageCircle size={15} /> Reply
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CUSTOM GIFTS & NEON ORDERS */}
        {activeTab === 'customOrders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  Custom Gifts & Neon Orders ({customOrders.length})
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  Orders submitted via Live Neon Sign & 3D Acrylic Lamp Studio with exact customer specifications
                </p>
              </div>

              <button
                onClick={loadCustomOrders}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Refresh Orders
              </button>
            </div>

            {customOrders.length === 0 ? (
              <div className="card-glass" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#121212', borderRadius: '12px' }}>
                <Gift size={40} color="var(--gold-primary)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '6px' }}>No Custom Gift Orders Yet</h3>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  When customers use the Live Neon Customizer or 3D Lamp studio, their orders appear here instantly!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {customOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="card-glass"
                    style={{
                      padding: '22px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#121214',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                            {ord.order_type === 'neon_sign' ? '⚡ Custom Neon Sign' : '🎁 3D Acrylic Lamp'}
                          </span>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: '2px 0' }}>
                            {ord.customer_name}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: '#888' }}>
                            📍 {ord.delivery_city} • {new Date(ord.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={ord.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            await api.updateCustomOrder(ord.id, { status: newStatus });
                            loadCustomOrders();
                            onShowToast && onShowToast(`Order status updated to ${newStatus}`, 'success');
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#1E1E22',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--gold-primary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {['New', 'Mockup Sent', 'Payment Pending', 'In Production', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Specifications Box */}
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
                          "{ord.custom_text}"
                        </div>
                        {ord.secondary_text && (
                          <div style={{ fontSize: '0.82rem', color: '#AAA', marginBottom: '6px' }}>
                            🎵 <strong>Details:</strong> {ord.secondary_text}
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.78rem', color: '#999' }}>
                          <div>🔤 Font: <strong style={{ color: '#DDD' }}>{ord.font_family}</strong></div>
                          <div>✨ Color: <strong style={{ color: '#DDD' }}>{ord.glow_color}</strong></div>
                          <div>📏 Size: <strong style={{ color: '#DDD' }}>{ord.size}</strong></div>
                          <div>🖼️ Backing/Base: <strong style={{ color: '#DDD' }}>{ord.backing_style || ord.base_type}</strong></div>
                        </div>

                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.78rem', color: '#888' }}>Price Quote:</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                            ₹{ord.estimated_price?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Uploaded Customer Photo */}
                      {ord.uploaded_photo_url && (
                        <div style={{ marginBottom: '14px' }}>
                          <span style={{ fontSize: '0.76rem', color: '#888', display: 'block', marginBottom: '4px' }}>
                            Customer Attached Photo:
                          </span>
                          <a href={ord.uploaded_photo_url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={ord.uploaded_photo_url}
                              alt="Customer Attachment"
                              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Order Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <a
                        href={`https://wa.me/${(ord.whatsapp || ord.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${ord.customer_name}! This is Credible Light following up on your custom order for "${ord.custom_text}". Here is your digital preview mockup...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.84rem' }}
                      >
                        <MessageCircle size={15} />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${ord.phone.replace(/[^0-9+]/g, '')}`}
                        className="btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                      >
                        <Phone size={15} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADS CRM */}
        {activeTab === 'enquiries' && (
          <div>
            {/* Leads CRM Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Customer Leads CRM
                  </h2>
                  <span
                    style={{
                      backgroundColor: 'rgba(229, 169, 60, 0.2)',
                      color: 'var(--gold-primary)',
                      border: '1px solid var(--border-gold)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {enquiries.length} Total
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '0.88rem', marginTop: '4px' }}>
                  Real-time customer enquiries, quote requests, and instant WhatsApp follow-ups
                </p>
              </div>

              {/* Refresh Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: '#777' }}>
                  Auto-sync active • Last refreshed {lastLeadsRefresh ? lastLeadsRefresh.toLocaleTimeString() : 'now'}
                </span>
                <button
                  onClick={() => {
                    loadEnquiries(enquiryStatusFilter, enquirySearch);
                    loadStats();
                    onShowToast && onShowToast('Leads refreshed successfully!', 'success');
                  }}
                  className="btn-outline-gold"
                  disabled={isLoadingLeads}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Clock size={15} />
                  <span>{isLoadingLeads ? 'Refreshing...' : 'Refresh Leads'}</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar Row */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#121212',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {/* Search input */}
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search leads by customer name, phone, city, service..."
                  value={enquirySearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEnquirySearch(val);
                    loadEnquiries(enquiryStatusFilter, val, false);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '0.86rem'
                  }}
                />
                {enquirySearch && (
                  <button
                    onClick={() => {
                      setEnquirySearch('');
                      loadEnquiries(enquiryStatusFilter, '', true);
                    }}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['All', 'New', 'Contacted', 'Quotation Sent', 'Follow-up', 'Converted', 'Closed'].map((st) => {
                  const isSelected = enquiryStatusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        setEnquiryStatusFilter(st);
                        loadEnquiries(st, enquirySearch, true);
                      }}
                      style={{
                        padding: '6px 13px',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                        color: isSelected ? '#050505' : '#AAA',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enquiries Grid or Helpful Empty State */}
            {enquiries.length === 0 ? (
              <div
                style={{
                  padding: '50px 20px',
                  textAlign: 'center',
                  backgroundColor: '#121212',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <Users size={44} color="#555" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#DDD', marginBottom: '8px' }}>
                  No Enquiries Found
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 18px' }}>
                  {enquirySearch || enquiryStatusFilter !== 'All'
                    ? `No leads matched filter '${enquiryStatusFilter}' ${enquirySearch ? `and query '${enquirySearch}'` : ''}.`
                    : 'Customer quotation requests submitted from the website will appear here in real time.'}
                </p>
                {(enquirySearch || enquiryStatusFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setEnquiryStatusFilter('All');
                      setEnquirySearch('');
                      loadEnquiries('All', '', true);
                    }}
                    className="btn-outline-gold"
                    style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                  >
                    Clear Filter & Show All
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="card-glass"
                    style={{
                      padding: '22px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#121212',
                      border: enq.status === 'New' ? '1px solid var(--border-gold)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: enq.status === 'New' ? '0 0 15px rgba(229, 169, 60, 0.15)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Customer Name, Status, Date Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                              {enq.customer_name}
                            </h4>
                            {enq.status === 'New' && (
                              <span style={{ fontSize: '0.68rem', backgroundColor: '#3B82F6', color: '#fff', fontWeight: 800, padding: '2px 7px', borderRadius: 'var(--radius-full)' }}>
                                NEW LEAD
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                            📍 {enq.city_location || 'Local Customer'} • ⏱️ {new Date(enq.created_at).toLocaleDateString()} {new Date(enq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={enq.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            await api.updateEnquiry(enq.id, { status: newStatus });
                            loadEnquiries(enquiryStatusFilter, enquirySearch, false);
                            loadStats();
                            onShowToast && onShowToast(`Lead #${enq.id} status updated to ${newStatus}`, 'success');
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#1F1F1F',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--gold-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          {['New', 'Contacted', 'Quotation Sent', 'Follow-up', 'Converted', 'Closed'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Service & Requirements Details Box */}
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '0.88rem', color: '#FFF', marginBottom: '6px' }}>
                          🏷️ <strong style={{ color: 'var(--gold-primary)' }}>Service:</strong> {enq.service_name}
                        </div>
                        {enq.approx_size && (
                          <div style={{ fontSize: '0.85rem', color: '#DDD', marginBottom: '6px' }}>
                            📏 <strong>Approx Size:</strong> {enq.approx_size}
                          </div>
                        )}
                        {enq.requirement_details && (
                          <div style={{ fontSize: '0.84rem', color: '#AAA', fontStyle: 'italic', marginTop: '8px', paddingLeft: '8px', borderLeft: '2px solid var(--gold-primary)' }}>
                            "{enq.requirement_details}"
                          </div>
                        )}
                      </div>

                      {/* Uploaded Customer Site Photo */}
                      {enq.uploaded_photo_url && (
                        <div style={{ marginBottom: '14px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginBottom: '4px' }}>
                            📷 Customer Attached Site Photo:
                          </span>
                          <a href={enq.uploaded_photo_url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={enq.uploaded_photo_url}
                              alt="Customer Site Photo"
                              style={{
                                width: '100%',
                                maxHeight: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                            />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: WhatsApp, Call, Delete */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <a
                        href={`https://wa.me/${(enq.whatsapp || enq.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${enq.customer_name}! This is Credible Light following up on your quote request for ${enq.service_name}. Here is our estimate and design preview...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp"
                        style={{ flex: 1, padding: '9px 12px', fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        <MessageCircle size={16} />
                        <span>WhatsApp Reply</span>
                      </a>

                      <a
                        href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`}
                        className="btn-secondary"
                        style={{ padding: '9px 14px', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={`Call ${enq.phone}`}
                      >
                        <Phone size={15} />
                      </a>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete lead from ${enq.customer_name}?`)) {
                            await api.deleteEnquiry(enq.id);
                            loadEnquiries(enquiryStatusFilter, enquirySearch, false);
                            loadStats();
                            onShowToast && onShowToast('Enquiry deleted', 'success');
                          }
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#EF4444',
                          padding: '9px 12px',
                          borderRadius: 'var(--radius-full)',
                          cursor: 'pointer'
                        }}
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICES MANAGER */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  Services Catalog Manager
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  Add, edit, reorder or toggle services shown on the live website
                </p>
              </div>

              <button
                onClick={() => setEditingService({ name: '', slug: '', short_description: '', full_description: '', cover_image: '/uploads/service_3d_acrylic.jpg', features: ['Custom Fabrication', 'IP67 LEDs'], is_active: 1, display_order: services.length + 1 })}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Plus size={18} />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services List Table */}
            <div className="card-glass" style={{ backgroundColor: '#121212', padding: '24px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#181818'
                    }}
                  >
                    <div style={{ width: '100%', height: '160px', position: 'relative' }}>
                      <img src={srv.cover_image} alt={srv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                        {srv.name}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '14px', lineHeight: 1.5 }}>
                        {srv.short_description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: srv.is_active ? '#34D399' : '#EF4444', fontWeight: 700 }}>
                          {srv.is_active ? '● Active' : '○ Inactive'}
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setEditingService(srv)}
                            style={{
                              background: 'rgba(229, 169, 60, 0.1)',
                              border: '1px solid var(--border-gold)',
                              color: 'var(--gold-primary)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <Edit2 size={14} /> Edit
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete service '${srv.name}'?`)) {
                                await api.deleteService(srv.id);
                                loadServices();
                                onDataRefresh && onDataRefresh();
                                onShowToast && onShowToast('Service deleted', 'success');
                              }
                            }}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#EF4444',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Edit / Create Modal */}
            {editingService && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 10000,
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
              >
                <div
                  className="card-glass"
                  style={{
                    maxWidth: '560px',
                    width: '100%',
                    padding: '30px',
                    backgroundColor: '#121212',
                    borderRadius: '16px',
                    border: '1px solid var(--border-gold)',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                      {editingService.id ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <button onClick={() => setEditingService(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (editingService.id) {
                        await api.updateService(editingService.id, editingService);
                        onShowToast && onShowToast('Service updated successfully', 'success');
                      } else {
                        await api.createService(editingService);
                        onShowToast && onShowToast('Service created successfully', 'success');
                      }
                      setEditingService(null);
                      loadServices();
                      onDataRefresh && onDataRefresh();
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Service Name *</label>
                      <input
                        type="text"
                        required
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Cover Image URL *</label>
                      <input
                        type="text"
                        required
                        value={editingService.cover_image}
                        onChange={(e) => setEditingService({ ...editingService, cover_image: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Short Description</label>
                      <textarea
                        rows={2}
                        value={editingService.short_description}
                        onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Full Description</label>
                      <textarea
                        rows={3}
                        value={editingService.full_description}
                        onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
                      Save Service
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PORTFOLIO PROJECTS & DYNAMIC CATEGORIES */}
        {activeTab === 'projects' && (
          <div>
            {/* Header with Sub-View Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Portfolio CMS & Dynamic Categories
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>
                  Manage gallery projects, multi-image 1s auto-slideshows, and dynamic filter categories
                </p>
              </div>

              {/* Sub-View Switcher & Add Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#161616',
                    padding: '4px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <button
                    onClick={() => setProjectSubView('projects')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: projectSubView === 'projects' ? 'var(--gold-primary)' : 'transparent',
                      color: projectSubView === 'projects' ? '#000' : '#AAA',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Briefcase size={16} />
                    <span>Projects ({projects.length})</span>
                  </button>

                  <button
                    onClick={() => setProjectSubView('categories')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: projectSubView === 'categories' ? 'var(--gold-primary)' : 'transparent',
                      color: projectSubView === 'categories' ? '#000' : '#AAA',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Layers size={16} />
                    <span>Categories ({categories.length})</span>
                  </button>
                </div>

                {projectSubView === 'projects' ? (
                  <button
                    onClick={() => {
                      const firstCat = categories.find(c => c.slug !== 'all') || categories[0] || { id: 1, name: 'Shop Sign Boards' };
                      setEditingProject({
                        title: '',
                        category_id: firstCat.id,
                        category_name: firstCat.name,
                        location: 'Jamshedpur',
                        short_description: '',
                        cover_image: '/uploads/portfolio_spice_hub.jpg',
                        images: ['/uploads/portfolio_spice_hub.jpg'],
                        is_featured: 1,
                        project_date: '2026',
                        display_order: projects.length + 1
                      });
                      setNewProjectImageUrl('');
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                  >
                    <Plus size={17} />
                    <span>Add Project</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingCategory({
                      name: '',
                      slug: '',
                      display_order: categories.length + 1
                    })}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                  >
                    <Plus size={17} />
                    <span>Add Category</span>
                  </button>
                )}
              </div>
            </div>

            {/* SUB-VIEW 1: DYNAMIC CATEGORIES MANAGER */}
            {projectSubView === 'categories' && (
              <div>
                {/* Info banner */}
                <div
                  style={{
                    backgroundColor: 'rgba(229, 169, 60, 0.08)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(229,169,60,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold-primary)'
                      }}
                    >
                      <Layers size={18} />
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.96rem', margin: 0, fontWeight: 700 }}>
                        Live Dynamic Categories
                      </h4>
                      <p style={{ color: '#aaa', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                        Any category added or edited here instantly appears on the live website's portfolio filter buttons.
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                    Live Website Sync Active
                  </span>
                </div>

                {/* Categories Table / Card Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
                  {categories.map((cat) => {
                    const isAll = cat.slug === 'all';
                    return (
                      <div
                        key={cat.id || cat.slug}
                        className="card-glass"
                        style={{
                          backgroundColor: '#121212',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '14px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span
                              style={{
                                fontSize: '0.74rem',
                                color: 'var(--gold-primary)',
                                backgroundColor: 'rgba(229,169,60,0.12)',
                                border: '1px solid var(--border-gold)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}
                            >
                              Order #{cat.display_order ?? 0}
                            </span>

                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: '#9CA3AF',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)'
                              }}
                            >
                              {cat.project_count || 0} Projects
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
                            {cat.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#888' }}>
                            <span>Slug:</span>
                            <code style={{ color: 'var(--gold-primary)', backgroundColor: '#1A1A1A', padding: '2px 6px', borderRadius: '4px' }}>
                              {cat.slug}
                            </code>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <button
                            onClick={() => setEditingCategory({ ...cat })}
                            style={{
                              background: 'rgba(229, 169, 60, 0.1)',
                              border: '1px solid var(--border-gold)',
                              color: 'var(--gold-primary)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>

                          {!isAll && (
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete category "${cat.name}"? Projects under this category will need reassignment.`)) {
                                  try {
                                    await api.deleteCategory(cat.id);
                                    await loadProjects();
                                    onDataRefresh && onDataRefresh();
                                    onShowToast && onShowToast(`Category "${cat.name}" deleted successfully`, 'success');
                                  } catch (err) {
                                    onShowToast && onShowToast(err.message || 'Failed to delete category', 'error');
                                  }
                                }
                              }}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#EF4444',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: PROJECTS GALLERY */}
            {projectSubView === 'projects' && (
              <div>
                {/* 1-Sec Auto Slideshow Notice */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>✨</span>
                  <div style={{ fontSize: '0.85rem', color: '#D1FAE5', lineHeight: 1.5 }}>
                    <strong>1-Second Auto-Slideshow Active:</strong> When you add 4 (or multiple) images to any project card, the live website displays them inside a single card and automatically scrolls through them every 1 second!
                  </div>
                </div>

                {/* Projects Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px' }}>
                  {projects.map((proj) => {
                    const imgList = Array.isArray(proj.images) && proj.images.length > 0
                      ? proj.images
                      : (proj.cover_image ? [proj.cover_image] : []);

                    return (
                      <div
                        key={proj.id}
                        style={{
                          backgroundColor: '#121212',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        {/* Image Preview Container */}
                        <div style={{ width: '100%', aspectRatio: '16/10', position: 'relative', backgroundColor: '#000' }}>
                          <img
                            src={proj.cover_image || (imgList[0]) || '/uploads/portfolio_spice_hub.jpg'}
                            alt={proj.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />

                          {/* Multi-Photo Count Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              zIndex: 3,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#fff',
                              backgroundColor: 'rgba(0, 0, 0, 0.75)',
                              backdropFilter: 'blur(6px)',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid rgba(229,169,60,0.4)'
                            }}
                          >
                            <Layers size={13} color="var(--gold-primary)" />
                            <span>{imgList.length} {imgList.length === 1 ? 'Photo' : 'Photos'}</span>
                            {imgList.length > 1 && (
                              <span style={{ color: '#10B981', fontSize: '0.66rem', fontWeight: 800 }}>● 1s</span>
                            )}
                          </div>

                          {/* Category Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              zIndex: 3
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: 'rgba(5, 5, 5, 0.8)',
                                backdropFilter: 'blur(6px)',
                                color: 'var(--gold-primary)',
                                padding: '4px 9px',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--border-gold)'
                              }}
                            >
                              {proj.category_name}
                            </span>
                          </div>

                          {/* Thumbnail Strip along bottom if >1 images */}
                          {imgList.length > 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '8px',
                                right: '8px',
                                zIndex: 3,
                                display: 'flex',
                                gap: '6px',
                                overflowX: 'auto',
                                padding: '4px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '6px'
                              }}
                            >
                              {imgList.map((im, i) => (
                                <img
                                  key={i}
                                  src={im}
                                  alt=""
                                  style={{
                                    width: '32px',
                                    height: '24px',
                                    objectFit: 'cover',
                                    borderRadius: '3px',
                                    border: i === 0 ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.2)'
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Project Details */}
                        <div style={{ padding: '16px' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
                            {proj.title}
                          </h4>
                          <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 14px 0' }}>
                            📍 {proj.location || 'Local Site'} • {proj.project_date || '2026'}
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setEditingProject({
                                  ...proj,
                                  images: Array.isArray(proj.images) && proj.images.length > 0 ? [...proj.images] : (proj.cover_image ? [proj.cover_image] : [])
                                });
                                setNewProjectImageUrl('');
                              }}
                              style={{
                                background: 'rgba(229, 169, 60, 0.1)',
                                border: '1px solid var(--border-gold)',
                                color: 'var(--gold-primary)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>

                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete project '${proj.title}'?`)) {
                                  await api.deleteProject(proj.id);
                                  await loadProjects();
                                  onDataRefresh && onDataRefresh();
                                  onShowToast && onShowToast('Project deleted successfully', 'success');
                                }
                              }}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#EF4444',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CATEGORY EDIT / ADD MODAL */}
            {editingCategory && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 10000,
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
              >
                <div
                  className="card-glass"
                  style={{
                    maxWidth: '480px',
                    width: '100%',
                    padding: '28px',
                    backgroundColor: '#121212',
                    borderRadius: '16px',
                    border: '1px solid var(--border-gold)',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      {editingCategory.id ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button onClick={() => setEditingCategory(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        if (editingCategory.id) {
                          await api.updateCategory(editingCategory.id, editingCategory);
                          onShowToast && onShowToast('Category updated successfully!', 'success');
                        } else {
                          await api.createCategory(editingCategory);
                          onShowToast && onShowToast('New category created and live on website!', 'success');
                        }
                        setEditingCategory(null);
                        await loadProjects();
                        onDataRefresh && onDataRefresh();
                      } catch (err) {
                        onShowToast && onShowToast(err.message || 'Failed to save category', 'error');
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LED Neon Signs or 3D Acrylic Boards"
                        value={editingCategory.name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                          setEditingCategory({
                            ...editingCategory,
                            name: val,
                            slug: editingCategory.id ? editingCategory.slug : autoSlug
                          });
                        }}
                        style={{ width: '100%', padding: '11px 14px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                        Category URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. led-neon-signs"
                        value={editingCategory.slug || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        style={{ width: '100%', padding: '11px 14px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '8px' }}
                      />
                      <span style={{ fontSize: '0.74rem', color: '#777', marginTop: '4px', display: 'block' }}>
                        Used in URL and website filter pills matching
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingCategory.display_order ?? 0}
                        onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value, 10) || 0 })}
                        style={{ width: '100%', padding: '11px 14px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '13px', marginTop: '8px' }}>
                      {editingCategory.id ? 'Save Category Changes' : 'Create Category'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* PROJECT EDIT / ADD MODAL WITH MULTI-IMAGE GALLERY */}
            {editingProject && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 10000,
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
              >
                <div
                  className="card-glass"
                  style={{
                    maxWidth: '680px',
                    width: '100%',
                    padding: '30px',
                    backgroundColor: '#121212',
                    borderRadius: '16px',
                    border: '1px solid var(--border-gold)',
                    maxHeight: '92vh',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                        {editingProject.id ? 'Edit Project' : 'Add New Project'}
                      </h3>
                      <p style={{ color: '#888', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                        Configure details and multiple images for 1-second auto-slideshow
                      </p>
                    </div>
                    <button onClick={() => setEditingProject(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const imagesArray = Array.isArray(editingProject.images) && editingProject.images.length > 0
                          ? editingProject.images
                          : [editingProject.cover_image || '/uploads/portfolio_spice_hub.jpg'];

                        const payload = {
                          ...editingProject,
                          cover_image: imagesArray[0],
                          images: imagesArray
                        };

                        if (editingProject.id) {
                          await api.updateProject(editingProject.id, payload);
                          onShowToast && onShowToast('Project updated with gallery slideshow!', 'success');
                        } else {
                          await api.createProject(payload);
                          onShowToast && onShowToast('Project created successfully!', 'success');
                        }
                        setEditingProject(null);
                        await loadProjects();
                        onDataRefresh && onDataRefresh();
                      } catch (err) {
                        onShowToast && onShowToast(err.message || 'Failed to save project', 'error');
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>Project Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Spice Hub Sign Board"
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>Dynamic Category *</label>
                        <select
                          value={editingProject.category_id || ''}
                          onChange={(e) => {
                            const catId = parseInt(e.target.value, 10);
                            const found = categories.find(c => c.id === catId);
                            setEditingProject({
                              ...editingProject,
                              category_id: catId,
                              category_name: found ? found.name : editingProject.category_name
                            });
                          }}
                          style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                        >
                          {categories.filter(c => c.slug !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Bistupur, Jamshedpur"
                          value={editingProject.location || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                        />
                      </div>
                    </div>

                    {/* MULTI-IMAGE GALLERY MANAGER */}
                    <div
                      style={{
                        backgroundColor: '#161618',
                        padding: '18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(229, 169, 60, 0.35)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Layers size={16} color="var(--gold-primary)" />
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                              Project Images Gallery ({ (editingProject.images || []).length } Photos)
                            </h4>
                          </div>
                          <p style={{ color: '#aaa', fontSize: '0.78rem', margin: '4px 0 0 0' }}>
                            ✨ <strong>1-Second Auto-Slideshow:</strong> If you add 4 (or multiple) images, they will scroll automatically every 1 sec inside this single card on the website!
                          </p>
                        </div>
                      </div>

                      {/* Thumbnails Strip */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', margin: '14px 0' }}>
                        {(editingProject.images || []).map((imgUrl, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundColor: '#0a0a0a',
                              border: idx === 0 ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)'
                            }}
                          >
                            <img
                              src={imgUrl}
                              alt={`Photo ${idx + 1}`}
                              style={{ width: '100%', height: '85px', objectFit: 'cover', display: 'block' }}
                            />

                            {/* Badge */}
                            <span
                              style={{
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                fontSize: '0.66rem',
                                fontWeight: 700,
                                backgroundColor: idx === 0 ? 'var(--gold-primary)' : 'rgba(0,0,0,0.7)',
                                color: idx === 0 ? '#000' : '#FFF',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {idx === 0 ? 'Cover' : `#${idx + 1}`}
                            </span>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = (editingProject.images || []).filter((_, i) => i !== idx);
                                setEditingProject({
                                  ...editingProject,
                                  images: newImages,
                                  cover_image: newImages[0] || ''
                                });
                              }}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                backgroundColor: 'rgba(239,68,68,0.85)',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              title="Remove Photo"
                            >
                              <X size={12} />
                            </button>

                            {/* Set as Cover button */}
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = [...editingProject.images];
                                  const [selected] = cur.splice(idx, 1);
                                  cur.unshift(selected);
                                  setEditingProject({
                                    ...editingProject,
                                    images: cur,
                                    cover_image: selected
                                  });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '3px 0',
                                  backgroundColor: '#1E1E22',
                                  color: 'var(--gold-primary)',
                                  border: 'none',
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Set as Cover
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Image Options (File Upload + URL Input) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {/* File Upload Button */}
                          <label
                            className="btn-outline-gold"
                            style={{
                              padding: '8px 16px',
                              fontSize: '0.84rem',
                              cursor: uploadingProjectPhoto ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <UploadCloud size={16} />
                            <span>{uploadingProjectPhoto ? 'Uploading Photo...' : '+ Upload Photo File'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingProjectPhoto}
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files && e.target.files[0];
                                if (!file) return;
                                setUploadingProjectPhoto(true);
                                try {
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  const res = await api.uploadMedia(fd);
                                  if (res.data && res.data.file_url) {
                                    const currentImages = editingProject.images || [];
                                    const nextImages = [...currentImages, res.data.file_url];
                                    setEditingProject({
                                      ...editingProject,
                                      images: nextImages,
                                      cover_image: nextImages[0]
                                    });
                                    onShowToast && onShowToast('Photo uploaded and added to card slideshow!', 'success');
                                  }
                                } catch (err) {
                                  onShowToast && onShowToast(err.message || 'Photo upload failed', 'error');
                                } finally {
                                  setUploadingProjectPhoto(false);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <span style={{ fontSize: '0.8rem', color: '#666' }}>OR</span>

                          {/* URL Input */}
                          <div style={{ display: 'flex', gap: '6px', flex: 1, minWidth: '220px' }}>
                            <input
                              type="text"
                              placeholder="Paste image URL (e.g. /uploads/...)"
                              value={newProjectImageUrl}
                              onChange={(e) => setNewProjectImageUrl(e.target.value)}
                              style={{ flex: 1, padding: '8px 12px', backgroundColor: '#111', border: '1px solid #333', color: '#FFF', borderRadius: '6px', fontSize: '0.82rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newProjectImageUrl || !newProjectImageUrl.trim()) return;
                                const url = newProjectImageUrl.trim();
                                const currentImages = editingProject.images || [];
                                const nextImages = [...currentImages, url];
                                setEditingProject({
                                  ...editingProject,
                                  images: nextImages,
                                  cover_image: nextImages[0]
                                });
                                setNewProjectImageUrl('');
                                onShowToast && onShowToast('Image URL added to slideshow', 'success');
                              }}
                              className="btn-secondary"
                              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                            >
                              Add URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>Description</label>
                      <textarea
                        rows={3}
                        placeholder="Brief summary of signage materials, lighting specifications, dimensions..."
                        value={editingProject.short_description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '13px', marginTop: '6px' }}>
                      {editingProject.id ? 'Save Project & Slideshow' : 'Publish Project'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB 5: BEFORE / AFTER MANAGER */}
        {activeTab === 'beforeAfter' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                Before & After Slider Manager
              </h2>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                Update the interactive before vs after comparison images and labels
              </p>
            </div>

            {beforeAfter.map((item) => (
              <div
                key={item.id}
                className="card-glass"
                style={{
                  padding: '24px',
                  backgroundColor: '#121212',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#AAA', marginBottom: '6px' }}>Before Image</label>
                    <img src={item.before_image} alt="Before" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#AAA', marginBottom: '6px' }}>After Image</label>
                    <img src={item.after_image} alt="After" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await api.updateBeforeAfter(item.id, item);
                    onShowToast && onShowToast('Before / After transformation updated', 'success');
                    onDataRefresh && onDataRefresh();
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = beforeAfter.map(b => b.id === item.id ? { ...b, title: e.target.value } : b);
                          setBeforeAfter(updated);
                        }}
                        style={{ width: '100%', padding: '8px 10px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const updated = beforeAfter.map(b => b.id === item.id ? { ...b, category: e.target.value } : b);
                          setBeforeAfter(updated);
                        }}
                        style={{ width: '100%', padding: '8px 10px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = beforeAfter.map(b => b.id === item.id ? { ...b, description: e.target.value } : b);
                        setBeforeAfter(updated);
                      }}
                      style={{ width: '100%', padding: '8px 10px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '0.88rem' }}>
                    Save Transformation
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  Media Asset Library
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  Upload high-res images, preview assets, and copy URLs for services or portfolio
                </p>
              </div>

              {/* Direct Image Upload Form */}
              <label className="btn-primary" style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <UploadCloud size={18} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const data = new FormData();
                      data.append('image', file);
                      try {
                        await api.uploadMedia(data);
                        loadMedia();
                        onShowToast && onShowToast('Image uploaded successfully', 'success');
                      } catch (err) {
                        onShowToast && onShowToast('Failed to upload image', 'error');
                      }
                    }
                  }}
                />
              </label>
            </div>

            {/* Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: '#121212',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ width: '100%', height: '140px', backgroundColor: '#000', position: 'relative' }}>
                    <img src={m.file_url} alt={m.alt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#EEE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px' }}>
                      {m.file_name}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.file_url);
                          setCopiedUrl(m.id);
                          setTimeout(() => setCopiedUrl(null), 2000);
                          onShowToast && onShowToast('Copied image URL to clipboard', 'success');
                        }}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '6px',
                          background: copiedUrl === m.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)',
                          color: copiedUrl === m.id ? '#050505' : '#FFF',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.78rem'
                        }}
                      >
                        {copiedUrl === m.id ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedUrl === m.id ? 'Copied' : 'Copy URL'}</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete media item?`)) {
                            await api.deleteMedia(m.id);
                            loadMedia();
                            onShowToast && onShowToast('Media deleted', 'success');
                          }
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: '#EF4444',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & SEO */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                Website Settings & Dynamic SEO
              </h2>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                Control hero banners, company phone numbers, address, and meta tags in real-time
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSettingsSaving(true);
                try {
                  await api.updateSettings(settings);
                  onDataRefresh && onDataRefresh();
                  onShowToast && onShowToast('Settings saved successfully', 'success');
                } catch (err) {
                  onShowToast && onShowToast('Failed to save settings', 'error');
                } finally {
                  setSettingsSaving(false);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '850px' }}
            >
              {/* Business Contact Details */}
              <div className="card-glass" style={{ padding: '24px', backgroundColor: '#121212', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '16px' }}>
                  Business Contact Info
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Calling Phone Number</label>
                    <input
                      type="text"
                      value={settings.phone_number || ''}
                      onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings.whatsapp_number || ''}
                      onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Official Email</label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Office Address</label>
                    <input
                      type="text"
                      value={settings.address || ''}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Hero Banner Controls */}
              <div className="card-glass" style={{ padding: '24px', backgroundColor: '#121212', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '16px' }}>
                  Hero Section Dynamic Controls
                </h3>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Hero Background Image URL</label>
                  <input
                    type="text"
                    value={settings.hero_image || ''}
                    onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Hero Subtitle Description</label>
                  <textarea
                    rows={2}
                    value={settings.hero_description || ''}
                    onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* Dynamic SEO Tags */}
              <div className="card-glass" style={{ padding: '24px', backgroundColor: '#121212', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '16px' }}>
                  Search Engine Optimization (SEO) & Social Sharing
                </h3>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Meta Title</label>
                  <input
                    type="text"
                    value={settings.seo_title || ''}
                    onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Meta Description</label>
                  <textarea
                    rows={2}
                    value={settings.seo_meta_description || ''}
                    onChange={(e) => setSettings({ ...settings, seo_meta_description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={settings.seo_keywords || ''}
                    onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={settingsSaving}
                className="btn-primary"
                style={{ padding: '14px 32px', fontSize: '1rem', alignSelf: 'flex-start' }}
              >
                <span>{settingsSaving ? 'Saving Updates...' : 'Save All Website Settings'}</span>
                <Check size={18} />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
