import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Home,
  Shield,
  Activity,
  Clock,
  MapPin,
  UploadCloud,
  Trash2,
  Star,
  Phone,
  CheckCircle2,
  Download,
  Search,
  Plus,
  Check,
  X,
  Sparkles,
  Info,
  Lock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeCareProps {
  setCurrentView?: (view: string) => void;
}

// Simple SHA-256 Hashing helper
const hashPassword = async (pwd: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Pre-hashed passwords for demo credentials
const DEMO_ACCOUNTS = [
  {
    username: 'homecare_user',
    // SHA-256 of "User@123"
    hash: '3e7c19576488862816f13b512cacf3e4ba97dd97243ea0bd6a2ad1642d86ba72',
    role: 'client',
    fullName: 'Standard User Account'
  },
  {
    username: 'homecare_pro',
    // SHA-256 of "Pro@123"
    hash: 'fd08912d9457be4f4fd8291ba91bba4f9db9bfe59cd5be3d4174957e0d546c89',
    role: 'pro',
    fullName: 'Technician Account'
  },
  {
    username: 'homecare_admin',
    // SHA-256 of "Admin@123"
    hash: 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7',
    role: 'admin',
    fullName: 'System Administrator'
  }
];

const HomeCare: React.FC<HomeCareProps> = () => {
  // Session Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Login Form states
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Active view tab (Client view)
  const [activeClientTab, setActiveClientTab] = useState<'dashboard' | 'history'>('dashboard');

  // Multi-step report form states
  const [showReportForm, setShowReportForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: 'Plumber',
    title: '',
    description: '',
    buildingName: '',
    unit: '',
    floor: 'G',
    room: 'Kitchen',
    priority: 'Medium',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    isImmediate: false,
    images: [] as string[]
  });

  // AI Assistant states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

  // Active requests DB simulation
  const [requests, setRequests] = useState<any[]>([
    {
      id: 'req_101',
      serviceType: 'AC Technician',
      title: 'AC is not cooling properly',
      description: 'The master bedroom AC is only blowing normal air, no cool air is coming out.',
      buildingName: 'Tower A, Skyline Heights',
      unit: '1204',
      floor: '12',
      room: 'Bedroom',
      priority: 'High',
      preferredDate: '2026-08-01',
      preferredTime: '02:00 PM - 04:00 PM',
      status: 'Assigned',
      pro: {
        name: 'Amit Sharma',
        image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=120&h=120',
        rating: 4.85,
        reviews: 94,
        distance: '2.4 km',
        charge: '₹350 Visit Charge'
      },
      history: [
        { status: 'Request Submitted', time: '10:30 AM' },
        { status: 'Professional Assigned', time: '10:45 AM' }
      ],
      chat: [
        { sender: 'pro', text: 'Hello, I have been assigned to your AC repair request. I will arrive at the scheduled time.', time: '10:48 AM' }
      ]
    }
  ]);

  // Selected request for active tracking view
  const [selectedTrackingRequest, setSelectedTrackingRequest] = useState<any | null>(requests[0]);
  const [chatMessage, setChatMessage] = useState('');

  // Selected Category filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('');

  // Selected professional discovery state
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [prosList] = useState([
    { id: 'pro_1', name: 'Ramesh Kumar', role: 'Plumber', exp: '8 yrs', rating: 4.9, jobs: 320, distance: '1.2 km', availability: 'Available', charge: 250, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'pro_2', name: 'Rajesh Patel', role: 'Electrician', exp: '6 yrs', rating: 4.8, jobs: 245, distance: '1.8 km', availability: 'Busy', charge: 300, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'pro_3', name: 'Vikram Singh', role: 'Carpenter', exp: '10 yrs', rating: 4.95, jobs: 410, distance: '3.1 km', availability: 'Available', charge: 200, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'pro_4', name: 'Sanjay Dutt', role: 'AC Technician', exp: '5 yrs', rating: 4.7, jobs: 180, distance: '2.5 km', availability: 'Available', charge: 350, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150' }
  ]);

  // Selected invoice/billing states
  const [showInvoiceModal, setShowInvoiceModal] = useState<any | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<any | null>(null);

  // Feedback states
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPunctuality, setFeedbackPunctuality] = useState(5);
  const [feedbackQuality, setFeedbackQuality] = useState(5);
  const [feedbackBehavior, setFeedbackBehavior] = useState(5);

  // Pro Dashboard States
  const [selectedProJob, setSelectedProJob] = useState<any | null>({
    id: 'req_102',
    title: 'Short circuit in dining room socket',
    description: 'When plugging in the microwave, sparks flew from the socket and now the whole dining hall power line is dead.',
    client: 'Nisha Pillai',
    address: 'Apt 402, Oakwood Greens, Road 4',
    priority: 'High',
    scheduledTime: 'Today, 04:30 PM',
    serviceType: 'Electrician',
    status: 'Pending Accept'
  });
  const [proWorkNotes, setProWorkNotes] = useState('');
  const [proCharge, setProCharge] = useState('450');

  // Admin Dashboard States
  const [adminProsQueue, setAdminProsQueue] = useState([
    { id: 'tech_1', name: 'Manish Verma', role: 'Waterproofing Specialist', exp: '12 yrs', docVerified: true, status: 'Pending Review' },
    { id: 'tech_2', name: 'Gurpreet Singh', role: 'Mason / Civil Worker', exp: '7 yrs', docVerified: false, status: 'Awaiting Documents' }
  ]);

  // Mock categories list (themed orange)
  const serviceCategories = [
    { name: 'Plumber', icon: <Wrench className="w-5 h-5 text-orange-500" /> },
    { name: 'Electrician', icon: <Zap className="w-5 h-5 text-orange-500" /> },
    { name: 'Carpenter', icon: <Home className="w-5 h-5 text-orange-500" /> },
    { name: 'Painter', icon: <Sparkles className="w-5 h-5 text-orange-500" /> },
    { name: 'AC Technician', icon: <Activity className="w-5 h-5 text-orange-500" /> },
    { name: 'Mason / Civil Worker', icon: <Shield className="w-5 h-5 text-orange-500" /> },
    { name: 'Tile and Flooring', icon: <GridIcon className="w-5 h-5 text-orange-500" /> },
    { name: 'Waterproofing', icon: <Wrench className="w-5 h-5 text-orange-500" /> },
    { name: 'Appliance Repair', icon: <Activity className="w-5 h-5 text-orange-500" /> },
    { name: 'CCTV & Security', icon: <Shield className="w-5 h-5 text-orange-500" /> }
  ];

  // Helper custom icon
  function GridIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    );
  }

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const enteredHash = await hashPassword(passwordInput);
      const matched = DEMO_ACCOUNTS.find(
        acc => acc.username === usernameInput && acc.hash === enteredHash
      );

      if (matched) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        setCurrentUser(matched);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid username or password. Check the demo credentials.');
      }
    } catch {
      setLoginError('An authentication error occurred. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUsernameInput('');
    setPasswordInput('');
    setLoginError('');
  };

  // Predefined AI suggestions based on title
  const generateAiSuggestion = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      let title = formData.title.toLowerCase();
      let issue = 'General Maintenance Issue';
      let pro = 'General Technician';
      let urgency = 'Low';
      let safety = 'Observe issue carefully and notify property manager.';
      let cause = 'Normal wear and tear or aging hardware.';

      if (title.includes('leak') || title.includes('pipe') || title.includes('water') || title.includes('tap')) {
        issue = 'Water pipe leakage or pressure joint damage';
        pro = 'Plumber';
        urgency = 'Medium';
        cause = 'Loose structural plumbing threads or cracked gasket seals.';
        safety = 'Immediately turn off the main water valve nearby and dry the surrounding electrical outlets.';
      } else if (title.includes('spark') || title.includes('wire') || title.includes('short') || title.includes('power') || title.includes('current')) {
        issue = 'Circuit overload or wiring short circuit';
        pro = 'Electrician';
        urgency = 'High';
        cause = 'Loose wiring connections, damaged wire sleeves, or faulty circuit breaker.';
        safety = 'Turn off the main MCB breaker on the distribution board immediately. Do not touch bare wires.';
      } else if (title.includes('ac') || title.includes('cooling') || title.includes('filter')) {
        issue = 'AC compressor or gas pressure defect';
        pro = 'AC Technician';
        urgency = 'Medium';
        cause = 'Clogged dust filters or refrigerant gas leakage.';
        safety = 'Power down the air conditioner to prevent compressor burnout.';
      }

      setAiAnalysis({
        issue,
        pro,
        urgency,
        cause,
        safety,
        confidenceScore: 94
      });
      setIsAiLoading(false);
    }, 1200);
  };

  // Handle Form Inputs
  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Mock File Upload
  const triggerSimulatedUpload = () => {
    const urls = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200&h=200'
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, randomUrl]
    }));
  };

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Form submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    const newReq = {
      id: `req_${Math.floor(Math.random() * 899 + 100)}`,
      serviceType: formData.serviceType,
      title: formData.title || 'Untitled request',
      description: formData.description,
      buildingName: formData.buildingName || 'BuildPilot HQ',
      unit: formData.unit || 'A-101',
      floor: formData.floor,
      room: formData.room,
      priority: formData.priority,
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: formData.preferredTime,
      status: 'Submitted',
      history: [{ status: 'Request Submitted', time: 'Just now' }],
      chat: []
    };
    setRequests(prev => [newReq, ...prev]);
    setSelectedTrackingRequest(newReq);
    setShowReportForm(false);
    setFormStep(1);
    setAiAnalysis(null);
    setShowDiscovery(true);
  };

  // Select Professional from Discovery
  const handleAssignPro = (pro: any) => {
    confetti({
      particleCount: 40,
      spread: 40,
      origin: { y: 0.7 }
    });
    setRequests(prev =>
      prev.map(r => {
        if (r.id === selectedTrackingRequest?.id) {
          const updated = {
            ...r,
            status: 'Assigned',
            pro: {
              name: pro.name,
              image: pro.image,
              rating: pro.rating,
              reviews: pro.jobs,
              distance: pro.distance,
              charge: `₹${pro.charge} Visit Charge`
            },
            history: [...r.history, { status: 'Professional Assigned', time: 'Just now' }]
          };
          setSelectedTrackingRequest(updated);
          return updated;
        }
        return r;
      })
    );
    setShowDiscovery(false);
  };

  // Client message sending
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedTrackingRequest) return;
    setRequests(prev =>
      prev.map(r => {
        if (r.id === selectedTrackingRequest.id) {
          const updated = {
            ...r,
            chat: [...(r.chat || []), { sender: 'client', text: chatMessage, time: 'Just now' }]
          };
          setSelectedTrackingRequest(updated);
          return updated;
        }
        return r;
      })
    );
    setChatMessage('');
    setTimeout(() => {
      setRequests(prev =>
        prev.map(r => {
          if (r.id === selectedTrackingRequest.id) {
            const updated = {
              ...r,
              chat: [...(r.chat || []), { sender: 'pro', text: 'Received. I am preparing the tools and heading over shortly.', time: 'Just now' }]
            };
            setSelectedTrackingRequest(updated);
            return updated;
          }
          return r;
        })
      );
    }, 1500);
  };

  // Feedback Submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setRequests(prev =>
      prev.map(r => {
        if (r.id === showFeedbackModal.id) {
          return {
            ...r,
            feedbackSubmitted: true,
            userRating: feedbackRating
          };
        }
        return r;
      })
    );
    setShowFeedbackModal(null);
    alert('Thank you! Your feedback has been saved successfully.');
  };

  // Pro Dashboard Handlers
  const handleProUpdateStatus = (status: string) => {
    if (!selectedProJob) return;
    setSelectedProJob((prev: any) => ({
      ...prev,
      status,
      history: [...(prev.history || []), { status, time: 'Just now' }]
    }));
    confetti({
      particleCount: 30,
      spread: 40
    });
  };

  const handleProCompleteJob = () => {
    if (!selectedProJob) return;
    setSelectedProJob((prev: any) => ({
      ...prev,
      status: 'Completed',
      costSummary: {
        visit: 300,
        labour: 450,
        materials: 120,
        tax: 50,
        total: 920
      }
    }));
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // Admin Verification Action
  const handleVerifyProAdmin = (id: string) => {
    setAdminProsQueue(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Verified' } : p))
    );
    confetti({
      particleCount: 40,
      spread: 45
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] pb-16 transition-colors duration-300">

      {/* ------------------------------------------------------------- */}
      {/* A. SECURE LOGIN PAGE (IF NOT AUTHENTICATED) */}
      {/* ------------------------------------------------------------- */}
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl max-w-md w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-lg mx-auto">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight mt-3">BuildPilot HomeCare</h2>
              <p className="text-xs text-slate-500">Sign in to manage and book structural maintenance services</p>
            </div>

            {/* Demo Credentials Alert Banner */}
            <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs text-[#EA580C] font-extrabold uppercase">
                <Info className="w-4 h-4" />
                <span>Demo Accounts Available</span>
              </div>
              <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                <p>• User Account: <span className="font-mono text-slate-800">homecare_user</span> / <span className="font-mono text-slate-800">User@123</span></p>
                <p>• Technician Account: <span className="font-mono text-slate-800">homecare_pro</span> / <span className="font-mono text-slate-800">Pro@123</span></p>
                <p>• Admin Portal: <span className="font-mono text-slate-800">homecare_admin</span> / <span className="font-mono text-slate-800">Admin@123</span></p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
                  {loginError}
                </div>
              )}

              <div className="space-y-1 text-xs">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your username..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-slate-200 text-[#F97316] focus:ring-0"
                  />
                  <span className="text-slate-500">Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset verification dispatched. Check registered mail.')}
                  className="text-[#F97316] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center space-x-2"
              >
                {isLoginLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Verify and Login</span>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* ------------------------------------------------------------- */}
          {/* B. AUTHENTICATED PORTAL (HEADER & DASHBOARDS) */}
          {/* ------------------------------------------------------------- */}

          {/* Main Module Navbar Header */}
          <div className="bg-[#0F172A] border-b border-slate-800 text-white py-5 px-6 shadow-xl sticky top-20 z-40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-md">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight font-display flex items-center gap-2">
                    BuildPilot HomeCare
                    <span className="text-[10px] bg-[#F97316] px-2 py-0.5 rounded-full uppercase tracking-widest font-sans font-extrabold text-white">
                      {currentUser?.role === 'admin' ? 'Admin Portal' : currentUser?.role === 'pro' ? 'Technician View' : 'Client Mode'}
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400">Welcome back, {currentUser?.fullName || currentUser?.username}</p>
                </div>
              </div>

              {/* Secure Logout control */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Logout Session
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

            {/* ------------------------------------------------------------- */}
            {/* 1. CLIENT ACCOUNT ROUTE */}
            {/* ------------------------------------------------------------- */}
            {currentUser?.role === 'client' && (
              <div className="space-y-8 animate-in fade-in duration-300">

                {/* Inner Dashboard Tabs */}
                <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
                  <button
                    onClick={() => setActiveClientTab('dashboard')}
                    className={`pb-2 px-4 text-sm font-bold border-b-2 transition-all ${activeClientTab === 'dashboard'
                        ? 'border-b-[#F97316] text-[#F97316]'
                        : 'border-b-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveClientTab('history')}
                    className={`pb-2 px-4 text-sm font-bold border-b-2 transition-all ${activeClientTab === 'history'
                        ? 'border-b-[#F97316] text-[#F97316]'
                        : 'border-b-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Service History
                  </button>
                </div>

                {activeClientTab === 'dashboard' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Side: Categories, Active list & Create CTA */}
                    <div className="lg:col-span-8 space-y-8">

                      {/* Hero card & Primary CTA (Themed Orange) */}
                      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full blur-2xl -z-10"></div>
                        <div className="space-y-2 text-center md:text-left">
                          <h2 className="text-2xl font-bold font-display text-slate-900">Need a Quick Home Repair?</h2>
                          <p className="text-sm text-slate-500 max-w-md">Our network of verified technicians, plumbers, and engineers is standing by to resolve structural, water, or electrical faults.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowReportForm(true)}
                          className="px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Report a Problem
                        </button>
                      </div>

                      {/* Quick Access Categories */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold font-display text-slate-900">Quick-Access Service Categories</h3>
                          {selectedCategoryFilter && (
                            <button
                              onClick={() => setSelectedCategoryFilter('')}
                              className="text-xs text-[#F97316] font-semibold hover:underline"
                            >
                              Clear Filter
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {serviceCategories.slice(0, 5).map((cat, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedCategoryFilter(cat.name)}
                              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 hover:border-[#F97316]/40 ${selectedCategoryFilter === cat.name
                                  ? 'bg-[#FFF7ED] border-[#F97316] text-[#EA580C] shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-700'
                                }`}
                            >
                              {cat.icon}
                              <span className="text-xs font-bold">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Service Requests */}
                      <div className="space-y-4">
                        <h3 className="text-base font-bold font-display text-slate-900">Active Service Requests</h3>
                        <div className="space-y-4">
                          {requests.length === 0 ? (
                            <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
                              <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs text-slate-500 font-semibold uppercase">No active requests found</p>
                            </div>
                          ) : (
                            requests
                              .filter(r => r.status !== 'Completed' && (selectedCategoryFilter ? r.serviceType === selectedCategoryFilter : true))
                              .map((req) => (
                                <div
                                  key={req.id}
                                  onClick={() => setSelectedTrackingRequest(req)}
                                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${selectedTrackingRequest?.id === req.id
                                      ? 'bg-white border-[#F97316] shadow-md ring-1 ring-orange-500/20'
                                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                                    }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <span className={`text-[10px] px-2 py-0.5 font-extrabold uppercase rounded-full ${req.priority === 'High' || req.priority === 'Emergency'
                                          ? 'bg-red-50 text-red-600 border border-red-200'
                                          : 'bg-orange-50 text-[#EA580C] border border-[#FED7AA]'
                                        }`}>
                                        {req.priority} Priority
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">ID: {req.id}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      {req.room} • {req.buildingName}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-4 border-t pt-3 md:border-0 md:pt-0">
                                    {req.pro && (
                                      <div className="flex items-center space-x-2">
                                        <img src={req.pro.image} alt={req.pro.name} className="w-9 h-9 rounded-xl object-cover" />
                                        <div>
                                          <p className="text-xs font-bold text-slate-800">{req.pro.name}</p>
                                          <p className="text-[10px] text-slate-400">Assigned Professional</p>
                                        </div>
                                      </div>
                                    )}
                                    <div className="text-right">
                                      <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-[10px] uppercase">
                                        {req.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right Side: Tracking Details & Communication Panel */}
                    <div className="lg:col-span-4 space-y-6">
                      {selectedTrackingRequest ? (
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                          <div className="bg-[#0F172A] p-5 text-white">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[#F97316] font-bold uppercase tracking-wider font-mono">Service Tracker</span>
                              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full">{selectedTrackingRequest.id}</span>
                            </div>
                            <h4 className="text-sm font-bold mt-2 truncate">{selectedTrackingRequest.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{selectedTrackingRequest.serviceType}</p>
                          </div>

                          {/* Visual Tracker Timeline (Themed Orange) */}
                          <div className="p-6 space-y-6">
                            <div className="space-y-4">
                              <h5 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Progress Timeline</h5>

                              <div className="space-y-4 pl-4 border-l-2 border-slate-100 relative">
                                {[
                                  { label: 'Request Submitted', value: 'Submitted', desc: 'Request logged on BuildPilot' },
                                  { label: 'Professional Assigned', value: 'Assigned', desc: 'Matching expert confirmed' },
                                  { label: 'Technician En Route', value: 'En Route', desc: 'Estimated arrival in 15 mins' },
                                  { label: 'Work in Progress', value: 'Active', desc: 'Resolution currently active' },
                                  { label: 'Completed', value: 'Completed', desc: 'Quality audit signed off' }
                                ].map((step, i) => {
                                  const isDone = selectedTrackingRequest.status === step.value ||
                                    (step.value === 'Submitted' && selectedTrackingRequest.status !== 'Submitted') ||
                                    (step.value === 'Assigned' && !['Submitted', 'Assigned'].includes(selectedTrackingRequest.status));
                                  return (
                                    <div key={i} className="relative">
                                      <div className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 bg-white transition-all ${isDone ? 'border-[#F97316] bg-[#F97316]' : 'border-slate-300'
                                        }`}></div>
                                      <div>
                                        <p className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                                          {step.label}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{step.desc}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Assigned Tech Info */}
                            {selectedTrackingRequest.pro && (
                              <div className="border-t border-slate-100 pt-5 space-y-4">
                                <h5 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Your Technician</h5>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    <img src={selectedTrackingRequest.pro.image} alt={selectedTrackingRequest.pro.name} className="w-11 h-11 rounded-2xl object-cover" />
                                    <div>
                                      <p className="text-xs font-bold text-slate-800">{selectedTrackingRequest.pro.name}</p>
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-[10px] font-bold text-slate-600">{selectedTrackingRequest.pro.rating}</span>
                                        <span className="text-[9px] text-slate-400">({selectedTrackingRequest.pro.reviews} jobs)</span>
                                      </div>
                                    </div>
                                  </div>
                                  <a href="tel:+919876543210" className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#F97316] hover:border-[#F97316]/40 transition-colors">
                                    <Phone className="w-4 h-4" />
                                  </a>
                                </div>

                                {/* Secure In-App Chat */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col h-48 justify-between">
                                  <div className="overflow-y-auto space-y-2 text-[11px] max-h-36 pr-1">
                                    <p className="text-[9px] text-slate-400 text-center font-semibold uppercase">Secure End-to-End Encrypted Chat</p>
                                    {(selectedTrackingRequest.chat || []).map((msg: any, mIdx: number) => (
                                      <div key={mIdx} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                                        <span className={`px-2.5 py-1.5 rounded-xl max-w-[85%] ${msg.sender === 'client' ? 'bg-[#F97316] text-white' : 'bg-white border text-slate-800'
                                          }`}>
                                          {msg.text}
                                        </span>
                                        <span className="text-[8px] text-slate-400 mt-0.5">{msg.time}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <form onSubmit={handleSendChatMessage} className="flex gap-1.5 mt-2">
                                    <input
                                      type="text"
                                      placeholder="Message technician..."
                                      value={chatMessage}
                                      onChange={(e) => setChatMessage(e.target.value)}
                                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] focus:outline-none focus:border-[#F97316]"
                                    />
                                    <button type="submit" className="px-3 bg-[#F97316] text-white rounded-xl text-xs font-bold">Send</button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
                          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                          <p className="text-xs font-bold text-slate-700">Select a request to trace details</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Service History tab */}
                {activeClientTab === 'history' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h3 className="text-base font-bold font-display text-slate-900">Service Request Archives</h3>

                      {/* Search and Filters */}
                      <div className="flex flex-wrap gap-2.5">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search service..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#F97316]"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                        <select
                          value={historyStatusFilter}
                          onChange={(e) => setHistoryStatusFilter(e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="">All Statuses</option>
                          <option value="Completed">Completed</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Submitted">Submitted</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                            <th className="py-3 px-4">Request Details</th>
                            <th className="py-3 px-4">Expert</th>
                            <th className="py-3 px-4">Requested Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Bill Summary</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                          {[
                            { id: 'req_098', serviceType: 'Plumber', title: 'Water leakage in kitchen sink', proName: 'Ramesh Kumar', date: '2026-07-28', status: 'Completed', cost: 420, invoice: true, feedbackSubmitted: true },
                            { id: 'req_097', serviceType: 'Electrician', title: 'Living room light flickering', proName: 'Rajesh Patel', date: '2026-07-15', status: 'Completed', cost: 300, invoice: true, feedbackSubmitted: false }
                          ]
                            .filter(h => (historySearch ? h.title.toLowerCase().includes(historySearch.toLowerCase()) || h.serviceType.toLowerCase().includes(historySearch.toLowerCase()) : true))
                            .filter(h => (historyStatusFilter ? h.status === historyStatusFilter : true))
                            .map((historyItem) => (
                              <tr key={historyItem.id} className="hover:bg-slate-50/50">
                                <td className="py-3.5 px-4">
                                  <div>
                                    <p className="font-bold text-slate-800">{historyItem.title}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{historyItem.serviceType} • {historyItem.id}</p>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">{historyItem.proName}</td>
                                <td className="py-3.5 px-4 text-slate-500">{historyItem.date}</td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                                    {historyItem.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-900 font-black">₹{historyItem.cost}</td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setShowInvoiceModal(historyItem)}
                                      className="p-2 border rounded-xl hover:bg-slate-100 transition-colors"
                                      title="Download Invoice"
                                    >
                                      <Download className="w-3.5 h-3.5 text-slate-500" />
                                    </button>
                                    {!historyItem.feedbackSubmitted && (
                                      <button
                                        type="button"
                                        onClick={() => setShowFeedbackModal(historyItem)}
                                        className="px-2.5 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-[10px] font-bold"
                                      >
                                        Submit Feedback
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. PROFESSIONAL ACCOUNT ROUTE */}
            {/* ------------------------------------------------------------- */}
            {currentUser?.role === 'pro' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">

                {/* Left side: Schedule & Active Job details */}
                <div className="lg:col-span-8 space-y-6">

                  {/* Earnings & Availability stats banner */}
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Earnings</span>
                      <span className="text-2xl font-black text-slate-900 font-display block mt-1">₹1,850</span>
                    </div>
                    <div className="border-y py-4 sm:border-y-0 sm:py-0 sm:border-x border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Jobs</span>
                      <span className="text-2xl font-black text-slate-900 font-display block mt-1">4 / 5</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Availability Status</span>
                      <div className="flex items-center justify-center space-x-1.5 mt-2">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold text-green-700">Online & Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Jobs panel */}
                  {selectedProJob ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${selectedProJob.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                            {selectedProJob.status}
                          </span>
                          <h3 className="text-lg font-bold font-display text-slate-900 mt-2">{selectedProJob.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{selectedProJob.serviceType} • Client: {selectedProJob.client}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{selectedProJob.scheduledTime}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {selectedProJob.description}
                      </p>

                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Address & Location Details</h4>
                        <p className="text-xs text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {selectedProJob.address}
                        </p>
                      </div>

                      {selectedProJob.status === 'Pending Accept' && (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleProUpdateStatus('Active')}
                            className="flex-1 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Accept & Start Job
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedProJob(null)}
                            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {selectedProJob.status === 'Active' && (
                        <div className="space-y-4 border-t pt-5">
                          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Technician Control Deck</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Job Execution Notes</label>
                              <textarea
                                placeholder="Describe diagnostic findings, parts replaced, or structural issues..."
                                value={proWorkNotes}
                                onChange={(e) => setProWorkNotes(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F97316] h-20"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Service Charges (₹)</label>
                                <input
                                  type="number"
                                  value={proCharge}
                                  onChange={(e) => setProCharge(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={handleProCompleteJob}
                                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all"
                                >
                                  Mark as Completed
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedProJob.status === 'Completed' && selectedProJob.costSummary && (
                        <div className="bg-green-50/50 border border-green-200 rounded-2xl p-5 space-y-3 text-xs">
                          <h4 className="font-extrabold text-green-800 uppercase tracking-wider">Job Completed Invoice Summary</h4>
                          <div className="space-y-1 text-slate-600">
                            <div className="flex justify-between">
                              <span>Technician Visit Charge</span>
                              <span>₹{selectedProJob.costSummary.visit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Labour Cost</span>
                              <span>₹{selectedProJob.costSummary.labour}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Materials Used</span>
                              <span>₹{selectedProJob.costSummary.materials}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-black text-slate-900 text-sm">
                              <span>Total Payout</span>
                              <span>₹{selectedProJob.costSummary.total}</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
                      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">No active job selected</p>
                    </div>
                  )}

                </div>

                {/* Right side: Today's pending requests queue */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Pending Job Requests</h4>
                    <div className="space-y-3">
                      <div
                        onClick={() => setSelectedProJob({
                          id: 'req_103',
                          title: 'Wooden cabinet door broken',
                          description: 'The master kitchen wooden cabinet hinges have rusted and broken off. Needs replacement.',
                          client: 'Kiran Rao',
                          address: 'Block B, Skyline Enclave',
                          priority: 'Medium',
                          scheduledTime: 'Tomorrow, 10:00 AM',
                          serviceType: 'Carpenter',
                          status: 'Pending Accept'
                        })}
                        className="p-4 rounded-2xl border border-slate-100 hover:border-[#F97316]/40 bg-slate-50/50 cursor-pointer transition-all space-y-1"
                      >
                        <span className="text-[9px] text-[#F97316] font-bold uppercase">Carpenter</span>
                        <h5 className="text-xs font-bold text-slate-800 truncate">Kitchen Cabinet Hinges</h5>
                        <p className="text-[10px] text-slate-400 font-semibold">Scheduled: Tomorrow</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 3. ADMIN PORTAL ROUTE */}
            {/* ------------------------------------------------------------- */}
            {currentUser?.role === 'admin' && (
              <div className="space-y-8 animate-in fade-in duration-300">

                {/* Top overview analytical metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Registered Users', value: '1,420', desc: '+12% from last month' },
                    { title: 'Verified Professionals', value: '124', desc: '14 pending approval' },
                    { title: 'Active Requests', value: '42', desc: '8 unassigned' },
                    { title: 'Monthly Revenue Share', value: '₹48,200', desc: '20% commission' }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{stat.title}</span>
                      <span className="text-2xl font-black text-slate-900 font-display block mt-1">{stat.value}</span>
                      <span className="text-[10px] text-green-600 font-semibold mt-1 block">{stat.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Verification queue and requests logs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Left Column: Tech Verification queue */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold font-display text-slate-900">Professional Authentication Queue</h3>

                    <div className="space-y-4">
                      {adminProsQueue.map((tech) => (
                        <div key={tech.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{tech.name}</h4>
                            <p className="text-[10px] text-slate-400">{tech.role} • {tech.exp} Experience</p>
                            <div className="flex items-center space-x-1.5 mt-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${tech.docVerified ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                              <span className="text-[9px] text-slate-500 font-semibold">
                                {tech.docVerified ? 'Government License Uploaded' : 'Pending License Upload'}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {tech.status === 'Pending Review' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleVerifyProAdmin(tech.id)}
                                  className="px-3 py-1.5 bg-[#F97316] text-white rounded-lg text-[10px] font-bold"
                                >
                                  Verify & Approve
                                </button>
                                <button type="button" className="px-3 py-1.5 border rounded-lg text-[10px] text-slate-500 hover:bg-slate-100">
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-green-700 flex items-center space-x-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Analytics & Quick categories count */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold font-display text-slate-900">Service Category Share</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Plumber Services', count: 142, pct: 45, color: 'bg-orange-500' },
                        { name: 'Electrical Work', count: 98, pct: 31, color: 'bg-orange-600' },
                        { name: 'AC Maintenance', count: 48, pct: 15, color: 'bg-orange-400' },
                        { name: 'Carpentry', count: 28, pct: 9, color: 'bg-orange-700' }
                      ].map((categoryItem, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600">{categoryItem.name}</span>
                            <span className="text-slate-900">{categoryItem.count} ({categoryItem.pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${categoryItem.color}`} style={{ width: `${categoryItem.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS & SUB-FLOWS */}
      {/* ========================================================================= */}

      {/* A. REPORT A PROBLEM MODAL (7-Step service request form) */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-in scale-in duration-200">

            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Report a Property Issue</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Step {formStep} of 7</p>
              </div>
              <button type="button" onClick={() => setShowReportForm(false)} className="p-2 border rounded-xl hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Steps tracker progress bar */}
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-[#F97316] transition-all duration-300" style={{ width: `${(formStep / 7) * 100}%` }}></div>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-6">

              {/* STEP 1: Select Service */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Select Required Service Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Technician', 'Mason', 'Waterproofing', 'Appliance Repair', 'CCTV & Security'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleInputChange('serviceType', opt)}
                        className={`p-4 border rounded-2xl text-left transition-all text-xs font-bold hover:border-[#F97316]/40 ${formData.serviceType === opt
                            ? 'bg-[#FFF7ED] border-[#F97316] text-[#EA580C] shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Describe the Problem */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Describe the Fault</label>
                    <button
                      type="button"
                      onClick={generateAiSuggestion}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[10px] font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      HomeCare AI Assistant
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Problem Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Water leakage in kitchen"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Detailed Description</label>
                      <textarea
                        placeholder="Describe the issue in detail to help our technicians bring correct tools..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F97316] h-24"
                        required
                      />
                    </div>
                  </div>

                  {/* AI Assistant Output Card */}
                  {isAiLoading && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase animate-pulse">AI Estimating Issue...</span>
                    </div>
                  )}

                  {aiAnalysis && !isAiLoading && (
                    <div className="p-5 bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl space-y-2 text-xs">
                      <h4 className="font-extrabold text-[#EA580C] flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-[#F97316]" />
                        HomeCare AI Recommendation
                      </h4>
                      <p className="text-slate-600"><span className="font-bold text-slate-800">Detected Issue:</span> {aiAnalysis.issue}</p>
                      <p className="text-slate-600"><span className="font-bold text-slate-800">Recommended Pro:</span> {aiAnalysis.pro}</p>
                      <p className="text-slate-600"><span className="font-bold text-slate-800">Priority:</span> {aiAnalysis.urgency}</p>
                      <p className="text-slate-600"><span className="font-bold text-slate-800">Safety Tip:</span> {aiAnalysis.safety}</p>
                      <div className="flex items-center space-x-1 text-[9px] text-[#EA580C] font-mono pt-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>AI Confidence Score: {aiAnalysis.confidenceScore}% (Do not present results as guaranteed diagnoses)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Select Problem Location */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Problem Location</label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Building/Property Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Skyline Heights"
                        value={formData.buildingName}
                        onChange={(e) => handleInputChange('buildingName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Block / Unit Number</label>
                      <input
                        type="text"
                        placeholder="e.g. Tower B / Apt 1402"
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Floor Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 14"
                        value={formData.floor}
                        onChange={(e) => handleInputChange('floor', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Room or Area</label>
                      <select
                        value={formData.room}
                        onChange={(e) => handleInputChange('room', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
                      >
                        {['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Balcony', 'Terrace', 'Parking Area', 'Electrical Room', 'Other'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Upload Evidence */}
              {formStep === 4 && (
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Upload Fault Evidence</label>

                  <div
                    onClick={triggerSimulatedUpload}
                    className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
                  >
                    <UploadCloud className="w-8 h-8 text-[#F97316] mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Click to Upload Damage Images or Videos</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Supports JPG, PNG, MP4 up to 10MB</p>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Uploaded Evidence Files</label>
                      <div className="grid grid-cols-4 gap-3">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border aspect-square">
                            <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(i)}
                              className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Select Priority */}
              {formStep === 5 && (
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Specify Repair Urgency</label>
                  <div className="space-y-3">
                    {[
                      { id: 'Low', label: 'Low Urgency', desc: 'Can be scheduled and fixed later (within 3 days)' },
                      { id: 'Medium', label: 'Medium Urgency', desc: 'Requires service today (technician visit scheduled within 24 hours)' },
                      { id: 'High', label: 'High Urgency', desc: 'Urgent repair required (damaging structural assets or causing discomfort)' },
                      { id: 'Emergency', label: 'Emergency Urgency', desc: 'Immediate assistance required (fire risk, major water burst, direct hazard)' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleInputChange('priority', opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${formData.priority === opt.id
                            ? 'bg-[#FFF7ED] border-[#F97316] text-[#EA580C]'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                      >
                        <div className="text-xs">
                          <p className="font-extrabold">{opt.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{opt.desc}</p>
                        </div>
                        {formData.priority === opt.id && <CheckCircle2 className="w-4 h-4 text-[#F97316]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Preferred Service Time */}
              {formStep === 6 && (
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Schedule Availability</label>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-800">Dispatch Immediate Service</p>
                        <p className="text-[10px] text-slate-400">Assigned technician heads to your property immediately</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('isImmediate', !formData.isImmediate)}
                        className={`w-11 h-6 rounded-full transition-all relative ${formData.isImmediate ? 'bg-[#F97316]' : 'bg-slate-300'
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formData.isImmediate ? 'right-1' : 'left-1'
                          }`}></div>
                      </button>
                    </div>

                    {!formData.isImmediate && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Preferred Date</label>
                          <input
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Preferred Time Slot</label>
                          <select
                            value={formData.preferredTime}
                            onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
                          >
                            <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                            <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                            <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 7: Review and Submit */}
              {formStep === 7 && (
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Review Request Summary</label>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs leading-relaxed">
                    <p><span className="font-extrabold text-slate-800 uppercase text-[10px]">Service Type:</span> {formData.serviceType}</p>
                    <p><span className="font-extrabold text-slate-800 uppercase text-[10px]">Problem Title:</span> {formData.title}</p>
                    <p><span className="font-extrabold text-slate-800 uppercase text-[10px]">Description:</span> {formData.description}</p>
                    <p><span className="font-extrabold text-slate-800 uppercase text-[10px]">Location:</span> {formData.room} (Floor {formData.floor}), {formData.buildingName} (Apt {formData.unit})</p>
                    <p><span className="font-extrabold text-slate-800 uppercase text-[10px]">Priority:</span> <span className="font-bold text-red-600">{formData.priority}</span></p>
                    <p><span className="font-extrabold text-slate-800 uppercase text-[10px]">Timing schedule:</span> {formData.isImmediate ? 'Immediate Dispatch' : `${formData.preferredDate} at ${formData.preferredTime}`}</p>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="border-t pt-5 flex justify-between">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(prev => prev - 1)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {formStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(prev => prev + 1)}
                    className="px-6 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Submit Booking Request
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* B. PROFESSIONAL DISCOVERY PANEL */}
      {showDiscovery && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-in scale-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Technicians Available</h3>
                <p className="text-xs text-slate-500 font-semibold">Select a verified professional to assign to your request.</p>
              </div>
              <button type="button" onClick={() => setShowDiscovery(false)} className="p-2 border rounded-xl hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {prosList
                .filter(p => p.role.toLowerCase() === formData.serviceType.toLowerCase())
                .map((pro) => (
                  <div key={pro.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <img src={pro.image} alt={pro.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold text-slate-900">{pro.name}</h4>
                          <span className="inline-block bg-orange-50 border border-[#FED7AA] text-[#EA580C] text-[7px] font-extrabold uppercase px-1 rounded">Verified</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{pro.role} • {pro.exp} Exp</p>
                        <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {pro.distance} Away
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold text-slate-700">{pro.rating}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">({pro.jobs} completed jobs)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end h-full">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Visit Charge</span>
                        <span className="text-sm font-black text-slate-900">₹{pro.charge}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAssignPro(pro)}
                        className="px-3 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-[10px] font-bold mt-4"
                      >
                        Request Service
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* C. INVOICE DETAIL MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6 animate-in scale-in duration-200">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Service Invoice</h3>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{showInvoiceModal.title}</p>
              </div>
              <button type="button" onClick={() => setShowInvoiceModal(null)} className="p-2 border rounded-xl hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Request Reference ID</span>
                <span className="font-mono">{showInvoiceModal.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Technician Provider</span>
                <span>{showInvoiceModal.proName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Date</span>
                <span>{showInvoiceModal.date}</span>
              </div>

              <div className="border-t border-dashed pt-4 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Visit Charge</span>
                  <span>₹200</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Labour Charge</span>
                  <span>₹150</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Materials & Hardware</span>
                  <span>₹{showInvoiceModal.cost - 350}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-black text-slate-900 text-sm">
                  <span>Final Total Paid</span>
                  <span>₹{showInvoiceModal.cost}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => alert('Downloading invoice PDF simulation complete.')}
                className="flex-1 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. FEEDBACK SUBMISSION MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in scale-in duration-200">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Rate & Feedback</h3>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{showFeedbackModal.title}</p>
              </div>
              <button type="button" onClick={() => setShowFeedbackModal(null)} className="p-2 border rounded-xl hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${feedbackRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Punctuality</label>
                  <select value={feedbackPunctuality} onChange={(e) => setFeedbackPunctuality(Number(e.target.value))} className="w-full border rounded-lg p-1.5">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Work Quality</label>
                  <select value={feedbackQuality} onChange={(e) => setFeedbackQuality(Number(e.target.value))} className="w-full border rounded-lg p-1.5">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Behavior</label>
                  <select value={feedbackBehavior} onChange={(e) => setFeedbackBehavior(Number(e.target.value))} className="w-full border rounded-lg p-1.5">
                    <option value="5">5 - Friendly</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Review Comments</label>
                <textarea
                  placeholder="Share details of your maintenance experience..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full border rounded-xl p-2.5 h-20 text-xs focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Submit Feedback Report
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeCare;
