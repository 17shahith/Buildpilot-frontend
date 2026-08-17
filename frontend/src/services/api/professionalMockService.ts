export interface ProProject {
  id: string;
  name: string;
  clientName: string;
  clientId: string;
  role: string;
  budget: number;
  progress: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  currentMilestone: string;
  deadline: string;
  paymentStatus: 'Released' | 'In Escrow' | 'Pending' | 'Failed' | 'Disputed';
  lastUpdate: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  timelineDays: number;
  startDate: string;
  milestones: {
    id: string;
    name: string;
    progress: number;
    startDate: string;
    dueDate: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
    deliverables: { name: string; url: string; date: string; type: string }[];
  }[];
  documents: { id: string; name: string; type: string; uploadedBy: string; date: string }[];
  messages: { sender: string; role: 'Customer' | 'Professional'; text: string; time: string }[];
  escrow: {
    total: number;
    deposited: number;
    released: number;
    remaining: number;
    pendingRelease: number;
    status: 'held' | 'released' | 'disputed';
  };
}

export interface ProProposal {
  id: string;
  projectTitle: string;
  projectId: string;
  proposedPrice: number;
  durationDays: number;
  approach: string;
  experience: string;
  milestones: string[];
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Expired';
  submittedDate: string;
}

export interface DiscoverProject {
  id: string;
  title: string;
  location: string;
  category: 'Architecture' | 'Interior Design' | 'Construction' | 'Structural Engineering' | 'Electrical' | 'Plumbing' | 'Renovation' | 'Landscape' | 'Estimation' | 'Consultation';
  budgetMin: number;
  budgetMax: number;
  timelineDays: number;
  clientName: string;
  clientVerified: boolean;
  clientRating: number;
  proposalsCount: number;
  postedTime: string;
  description: string;
  requirements: string[];
  expectedDeliverables: string[];
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'Meeting' | 'Site Visit' | 'Deadline' | 'Review' | 'Inspection';
  date: string; // YYYY-MM-DD
  time: string;
  projectName: string;
  projectId: string;
}

export interface Transaction {
  id: string;
  projectName: string;
  milestoneName: string;
  amount: number;
  status: 'Released' | 'In Escrow' | 'Pending' | 'Failed' | 'Disputed';
  date: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  location: string;
  duration: string;
  budget: string;
  services: string[];
  description: string;
  images: string[];
  rating: number;
  reviewText: string;
  clientName: string;
  featured: boolean;
}

let mockProjects: ProProject[] = [
  {
    id: 'proj-1',
    name: 'Modern Kitchen Renovation',
    clientName: 'Shahith',
    clientId: 'usr-1',
    role: 'Architect',
    budget: 450000,
    progress: 65,
    status: 'Active',
    currentMilestone: 'Cabinetry Assembly & Tiling',
    deadline: '2026-08-20',
    paymentStatus: 'In Escrow',
    lastUpdate: 'Today',
    description: 'Renovation of a 250 sq.ft residential kitchen with luxury modular cabinets, chimney integration, and granite countertops.',
    requirements: [
      'Acoustic cabinetry dampening',
      'Dual sinks with flexible nozzles',
      'Ambient LED under-cabinet lightning'
    ],
    responsibilities: [
      'Site blueprinting and layout optimization',
      'Selection of cabinet vendors',
      'Site supervision during electrical fittings'
    ],
    timelineDays: 30,
    startDate: '2026-07-25',
    milestones: [
      {
        id: 'm1',
        name: 'Structural Design Approval',
        progress: 100,
        startDate: '2026-07-25',
        dueDate: '2026-07-30',
        status: 'Completed',
        deliverables: [{ name: 'Kitchen_Plan_v2.pdf', url: '#', date: '2026-07-29', type: 'Design' }]
      },
      {
        id: 'm2',
        name: 'Demolition & Wiring Prep',
        progress: 100,
        startDate: '2026-08-01',
        dueDate: '2026-08-08',
        status: 'Completed',
        deliverables: [{ name: 'Demolition_Report.pdf', url: '#', date: '2026-08-07', type: 'Report' }]
      },
      {
        id: 'm3',
        name: 'Cabinetry Assembly & Tiling',
        progress: 65,
        startDate: '2026-08-10',
        dueDate: '2026-08-20',
        status: 'In Progress',
        deliverables: []
      },
      {
        id: 'm4',
        name: 'Appliance Fitting & Paint',
        progress: 0,
        startDate: '2026-08-21',
        dueDate: '2026-08-27',
        status: 'Not Started',
        deliverables: []
      }
    ],
    documents: [
      { id: 'doc-1', name: 'Contract_Signed.pdf', type: 'Contract', uploadedBy: 'System', date: '2026-07-25' },
      { id: 'doc-2', name: 'Kitchen_Plan_v2.pdf', type: 'Drawing', uploadedBy: 'Professional', date: '2026-07-29' }
    ],
    messages: [
      { sender: 'Shahith', role: 'Customer', text: 'How is the cabinetry progress going?', time: '10:15 AM' },
      { sender: 'Ananya Roy', role: 'Professional', text: 'All materials arrived today. Tiling begins tomorrow morning.', time: '11:00 AM' }
    ],
    escrow: {
      total: 250000,
      deposited: 250000,
      released: 150000,
      remaining: 100000,
      pendingRelease: 50000,
      status: 'held'
    }
  },
  {
    id: 'proj-3',
    name: 'Minimalist Apartment Interior',
    clientName: 'Shahith',
    clientId: 'usr-1',
    role: 'Interior Designer',
    budget: 1200000,
    progress: 100,
    status: 'Completed',
    currentMilestone: 'Final Handover',
    deadline: '2026-01-10',
    paymentStatus: 'Released',
    lastUpdate: '2026-01-10',
    description: 'Minimalist design for a 3BHK high-rise apartment using natural wooden textures, neutral tones, and smart storage integrations.',
    requirements: [
      'Zero clutter layout plans',
      'Concealed ambient light systems',
      'Multi-purpose custom cabinets'
    ],
    responsibilities: [
      'Complete interior design blueprints',
      'Material procurement selection',
      'Turnkey handover certification'
    ],
    timelineDays: 50,
    startDate: '2025-11-20',
    milestones: [
      {
        id: 'm1',
        name: 'Concept Boards & Moods',
        progress: 100,
        startDate: '2025-11-20',
        dueDate: '2025-12-05',
        status: 'Completed',
        deliverables: [{ name: 'Final_Moodboard.pdf', url: '#', date: '2025-12-04', type: 'Design' }]
      },
      {
        id: 'm2',
        name: '3D Render Finalizations',
        progress: 100,
        startDate: '2025-12-06',
        dueDate: '2025-12-25',
        status: 'Completed',
        deliverables: [{ name: '3D_Handover_Renders.zip', url: '#', date: '2025-12-24', type: 'Design' }]
      },
      {
        id: 'm3',
        name: 'Vendor procurement list',
        progress: 100,
        startDate: '2025-12-26',
        dueDate: '2026-01-10',
        status: 'Completed',
        deliverables: [{ name: 'Procurement_Specs.xlsx', url: '#', date: '2026-01-08', type: 'Estimate' }]
      }
    ],
    documents: [
      { id: 'doc-3', name: 'Apartment_Contract.pdf', type: 'Contract', uploadedBy: 'System', date: '2025-11-20' },
      { id: 'doc-4', name: 'Final_Moodboard.pdf', type: 'Drawing', uploadedBy: 'Professional', date: '2025-12-04' }
    ],
    messages: [],
    escrow: {
      total: 1200000,
      deposited: 1200000,
      released: 1200000,
      remaining: 0,
      pendingRelease: 0,
      status: 'released'
    }
  }
];

let mockProposals: ProProposal[] = [
  {
    id: 'prop-1',
    projectTitle: 'Modern 3BHK Villa Design',
    projectId: 'lead-1',
    proposedPrice: 240000,
    durationDays: 45,
    approach: 'I propose a bio-climatic design utilizing passive solar lighting and cross-ventilation. I will provide full blueprints, electrical schematics, and 3D architectural renders.',
    experience: '8 years of core experience in custom luxury villas across south India. Completed 12 similar projects.',
    milestones: [
      'Site Analysis & Bubble Diagram (10%)',
      'Vastu-Compliant Space Plan Layout (25%)',
      '3D Elevation Render Finalization (35%)',
      'Detailed Structural Drawings (30%)'
    ],
    status: 'Pending',
    submittedDate: '2026-08-15'
  },
  {
    id: 'prop-2',
    projectTitle: 'Penthouse Terrace Garden Design',
    projectId: 'lead-4',
    proposedPrice: 75000,
    durationDays: 20,
    approach: 'Terrace garden with automatic micro-drip irrigation, lightweight planting media, and customized vertical green walls.',
    experience: 'Specialized rooftop landscaping architect with certifications from national green council.',
    milestones: [
      'Drainage Cell & Waterproofing layout (30%)',
      'Irrigation design & soil formulation (30%)',
      'Plant installation & illumination setup (40%)'
    ],
    status: 'Accepted',
    submittedDate: '2026-08-10'
  }
];

let mockLeads: DiscoverProject[] = [
  {
    id: 'lead-1',
    title: 'Modern 3BHK Villa Design',
    location: 'Chennai',
    category: 'Architecture',
    budgetMin: 200000,
    budgetMax: 300000,
    timelineDays: 45,
    clientName: 'Arun Kumar',
    clientVerified: true,
    clientRating: 4.8,
    proposalsCount: 8,
    postedTime: '2 days ago',
    description: 'Looking for a verified architect to design a custom 3-bedroom luxury villa on a 40x60 plot. The design must be Vastu-compliant, modern-contemporary styled, and include full construction drawings and 3D elevation renders.',
    requirements: [
      '3D elevation models in SketchUp/Revit',
      'Vastu-compliant layouts',
      'Complete structural and electrical blueprints'
    ],
    expectedDeliverables: [
      'Final structural layout diagrams',
      'Interior cabinetry design plans',
      '3D outdoor elevation rendering sheets'
    ]
  },
  {
    id: 'lead-2',
    title: 'Minimalist Studio Office Fitout',
    location: 'Bangalore',
    category: 'Interior Design',
    budgetMin: 450000,
    budgetMax: 600000,
    timelineDays: 30,
    clientName: 'Priya Sharma',
    clientVerified: true,
    clientRating: 4.9,
    proposalsCount: 3,
    postedTime: '1 day ago',
    description: 'We are expanding our software consultant office (1800 sq.ft) and need a cozy, aesthetic workspace layout. Need layout plans, material selections, and lighting schematics.',
    requirements: [
      'Ergonomic workstation setups',
      'Acoustic phone booth layouts',
      'Vibrant modern color suggestions'
    ],
    expectedDeliverables: [
      'Furniture layout CAD file',
      'Material specification BOQ sheets',
      'Rendered walk-through video (mockup)'
    ]
  },
  {
    id: 'lead-3',
    title: 'Civil Foundation Inspection',
    location: 'Mumbai',
    category: 'Structural Engineering',
    budgetMin: 120000,
    budgetMax: 180000,
    timelineDays: 15,
    clientName: 'Kunal Sen',
    clientVerified: true,
    clientRating: 4.6,
    proposalsCount: 5,
    postedTime: '3 days ago',
    description: 'Visible hairline cracks on the concrete retaining wall of our apartment complex parking. Need a civil engineer to perform a structural assessment and prescribe remediation.',
    requirements: [
      'On-site core drill check',
      'Concrete strength verification report',
      'Epoxy-grouting prescription sheets'
    ],
    expectedDeliverables: [
      'Certified structural inspection report',
      'Materials and methodology guidelines document'
    ]
  },
  {
    id: 'lead-4',
    title: 'Penthouse Terrace Garden Design',
    location: 'Pune',
    category: 'Landscape',
    budgetMin: 60000,
    budgetMax: 90000,
    timelineDays: 20,
    clientName: 'Neha Gupta',
    clientVerified: false,
    clientRating: 4.2,
    proposalsCount: 2,
    postedTime: '5 hours ago',
    description: 'Convert our 1200 sq.ft terrace into a green lounge with structural decking, lightweight planters, and low-maintenance vegetation.',
    requirements: [
      'Decking load capacity check',
      'Waterproofing inspection',
      'Automated drip-irrigation schedule'
    ],
    expectedDeliverables: [
      'Landscape blueprint plan',
      'Plant listing with watering specs'
    ]
  }
];

let mockSchedule: ScheduleEvent[] = [
  { id: 'sch-1', title: 'Site Inspection & Measurement', type: 'Site Visit', date: '2026-08-18', time: '10:00 AM', projectName: 'Modern Kitchen Renovation', projectId: 'proj-1' },
  { id: 'sch-2', title: 'Upload detailed design files', type: 'Deadline', date: '2026-08-20', time: '05:00 PM', projectName: 'Modern Kitchen Renovation', projectId: 'proj-1' },
  { id: 'sch-3', title: 'Contract walkthrough and alignment', type: 'Meeting', date: '2026-08-21', time: '03:00 PM', projectName: 'Minimalist Apartment Interior', projectId: 'proj-3' },
  { id: 'sch-4', title: 'Final structural inspection review', type: 'Inspection', date: '2026-08-25', time: '11:30 AM', projectName: 'Modern Kitchen Renovation', projectId: 'proj-1' }
];

let mockTransactions: Transaction[] = [
  { id: 'txn-501', projectName: 'Modern Kitchen Renovation', milestoneName: 'Structural Design Approval', amount: 50000, status: 'Released', date: '2026-07-30' },
  { id: 'txn-502', projectName: 'Modern Kitchen Renovation', milestoneName: 'Demolition & Wiring Prep', amount: 100000, status: 'Released', date: '2026-08-08' },
  { id: 'txn-503', projectName: 'Modern Kitchen Renovation', milestoneName: 'Cabinetry Assembly & Tiling', amount: 50000, status: 'In Escrow', date: '2026-08-10' },
  { id: 'txn-504', projectName: 'Minimalist Apartment Interior', milestoneName: 'Concept Design', amount: 400000, status: 'Released', date: '2025-12-05' },
  { id: 'txn-505', projectName: 'Minimalist Apartment Interior', milestoneName: '3D Render Finalizations', amount: 400000, status: 'Released', date: '2025-12-25' },
  { id: 'txn-506', projectName: 'Minimalist Apartment Interior', milestoneName: 'Final Handover', amount: 400000, status: 'Released', date: '2026-01-10' }
];

let mockPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Luxury Beach Villa Design',
    category: 'Residential Architecture',
    location: 'ECR, Chennai',
    duration: '6 Months',
    budget: '₹45L',
    services: ['Architectural blueprints', 'Site supervision', '3D elevation plans'],
    description: 'Designed a contemporary seaside villa featuring large glass facades, wind-channeling corridor planning, and salt-air resistant structure design.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 5.0,
    reviewText: 'Outstanding design concepts. Highly professional team who understood the wind load calculations perfectly!',
    clientName: 'Sanjay Dutt',
    featured: true
  },
  {
    id: 'port-2',
    title: 'Minimalist Tech Studio Office',
    category: 'Commercial Interior Design',
    location: 'HSR Layout, Bangalore',
    duration: '3 Months',
    budget: '₹28L',
    services: ['Acoustic layouts', 'Modular layouts', 'Smart LED lighting designs'],
    description: 'A 2400 sq.ft minimalist workspace layout for an AI startup. Leveraged sound dampening ceiling tiles and natural oak partitions.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    reviewText: 'Great lighting layout, reduced glare on computer screens significantly. Recommended for modern studios!',
    clientName: 'Rahul Goel',
    featured: true
  }
];

let mockProfile = {
  name: 'Ananya Roy',
  title: 'Senior Architectural & Interior Designer',
  verified: true,
  rating: 4.9,
  reviewsCount: 142,
  experienceYears: 8,
  bio: 'A certified architect specializing in sustainable residential plans and minimalist interior designs. Expert in Vastu compliance, energy-efficient elevations, and custom modular solutions.',
  skills: ['Architecture Layouts', 'AutoCAD Drawing', 'Autodesk Revit', '3D SketchUp Elevation', 'Vastu Shastra Planning', 'Eco-friendly Materials Selection'],
  certifications: [
    { title: 'Registered CoA Architect', issuer: 'Council of Architecture (India)', year: '2018' },
    { title: 'Certified Sustainable Designer', issuer: 'Green Building Council', year: '2020' }
  ],
  services: [
    { name: 'Full Building Layout Design', price: '₹120 / sq.ft' },
    { name: '3D Outdoor Elevation Modeling', price: '₹25,000 / view' },
    { name: 'Interior Cabinets and Lights Plan', price: '₹80 / sq.ft' }
  ],
  serviceAreas: ['Chennai', 'Bangalore', 'Coimbatore', 'Online/Remote Consultation'],
  verificationLevel: {
    identity: true,
    license: true,
    experience: true,
    portfolio: true
  }
};

let mockSettings = {
  specialization: 'Architecture & Interior Design',
  alertNewProjects: true,
  alertPaymentEscrow: true,
  alertClientMessages: true,
  emailDigests: false,
  availableForWork: true,
  maxActiveProjects: 5
};

export const professionalMockService = {
  // Stats for cards
  getWorkspaceKPIs: () => {
    const active = mockProjects.filter(p => p.status === 'Active').length;
    const pendingProps = mockProposals.filter(p => p.status === 'Pending').length;
    
    // Deadlines in next 7 days
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    const upcomingDeadlines = mockSchedule.filter(e => {
      const eDate = new Date(e.date);
      return e.type === 'Deadline' && eDate >= today && eDate <= next7Days;
    }).length;

    // Monthly Earnings (sum of released in past 30 days)
    const thisMonthEarnings = 84500;

    return {
      activeProjectsCount: active,
      pendingProposalsCount: pendingProps,
      upcomingDeadlinesCount: upcomingDeadlines,
      thisMonthEarnings
    };
  },

  getPerformanceStats: () => {
    return {
      completedCount: 48,
      successRatePercent: 87,
      averageRatingValue: 4.9,
      onTimePercent: 94
    };
  },

  // Attention Alerts
  getAttentionAlerts: () => {
    return [
      { id: 'al-1', text: '3 proposals awaiting response', view: 'proposals' },
      { id: 'al-2', text: '1 client message unread in kitchen renovation', view: 'messages', refId: 'proj-1' },
      { id: 'al-3', text: 'Milestone "Cabinetry Assembly" requires progress update', view: 'milestones', refId: 'proj-1' }
    ];
  },

  // Discover Projects / Leads
  getLeads: (categoryFilter?: string, search?: string) => {
    let list = [...mockLeads];
    if (categoryFilter && categoryFilter !== 'All') {
      list = list.filter(l => l.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (search) {
      list = list.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  },

  getLeadById: (id: string) => mockLeads.find(l => l.id === id),

  submitProposal: (proposal: Omit<ProProposal, 'id' | 'submittedDate' | 'status'>) => {
    const newProp: ProProposal = {
      ...proposal,
      id: `prop-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    mockProposals.unshift(newProp);

    // Increment proposals count on lead
    mockLeads = mockLeads.map(l => l.id === proposal.projectId ? { ...l, proposalsCount: l.proposalsCount + 1 } : l);
    return newProp;
  },

  // Proposals
  getProposals: () => [...mockProposals],

  acceptProposalAndStartProject: (proposalId: string) => {
    const propIndex = mockProposals.findIndex(p => p.id === proposalId);
    if (propIndex === -1) return false;

    mockProposals[propIndex].status = 'Accepted';
    const prop = mockProposals[propIndex];

    // Create a new project in mock database
    const newProj: ProProject = {
      id: `proj-${Math.floor(100 + Math.random() * 900)}`,
      name: prop.projectTitle,
      clientName: 'Arun Kumar',
      clientId: 'usr-5',
      role: 'Architect',
      budget: prop.proposedPrice,
      progress: 0,
      status: 'Active',
      currentMilestone: prop.milestones[0] || 'Initial Setup',
      deadline: new Date(Date.now() + prop.durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'In Escrow',
      lastUpdate: 'Today',
      description: prop.approach,
      requirements: ['Client custom request design specifications'],
      responsibilities: ['Primary project designer and administrator'],
      timelineDays: prop.durationDays,
      startDate: new Date().toISOString().split('T')[0],
      milestones: prop.milestones.map((m, idx) => ({
        id: `m-${idx}`,
        name: m,
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + (idx + 1) * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: (idx === 0 ? 'In Progress' : 'Not Started') as 'Completed' | 'In Progress' | 'Not Started',
        deliverables: []
      })),
      documents: [],
      messages: [],
      escrow: {
        total: prop.proposedPrice,
        deposited: prop.proposedPrice,
        released: 0,
        remaining: prop.proposedPrice,
        pendingRelease: 0,
        status: 'held'
      }
    };

    mockProjects.unshift(newProj);
    return true;
  },

  // Projects
  getProjects: () => [...mockProjects],

  getProjectById: (id: string) => mockProjects.find(p => p.id === id),

  updateMilestoneProgress: (projectId: string, milestoneId: string, progress: number) => {
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const status = (progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started') as 'Completed' | 'In Progress' | 'Not Started';
            return { ...m, progress, status };
          }
          return m;
        });

        // Compute overall progress
        const overall = Math.floor(updatedMilestones.reduce((acc, m) => acc + m.progress, 0) / updatedMilestones.length);

        return { ...p, milestones: updatedMilestones, progress: overall, lastUpdate: 'Today' };
      }
      return p;
    });
    return true;
  },

  uploadDeliverable: (projectId: string, milestoneId: string, file: { name: string; url: string; type: string }) => {
    let success = false;
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const newDeliv = {
              name: file.name,
              url: file.url,
              date: new Date().toISOString().split('T')[0],
              type: file.type
            };
            success = true;
            return { ...m, deliverables: [...m.deliverables, newDeliv] };
          }
          return m;
        });

        // Also add to global project documents
        const newDoc = {
          id: `doc-${Math.floor(100 + Math.random() * 900)}`,
          name: file.name,
          type: file.type,
          uploadedBy: 'Professional',
          date: new Date().toISOString().split('T')[0]
        };

        return { ...p, milestones: updatedMilestones, documents: [...p.documents, newDoc], lastUpdate: 'Today' };
      }
      return p;
    });
    return success;
  },

  sendMessage: (projectId: string, text: string) => {
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const newMsg = {
          sender: 'Ananya Roy',
          role: 'Professional' as const,
          text,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        return { ...p, messages: [...p.messages, newMsg], lastUpdate: 'Today' };
      }
      return p;
    });
    return true;
  },

  // Clients
  getClients: () => {
    // Clients who own the active/completed projects
    return [
      {
        id: 'usr-1',
        name: 'Shahith',
        activeProjects: 1,
        completedProjects: 1,
        rating: 4.9,
        reviewsCount: 15,
        email: 'shahith@test.com'
      },
      {
        id: 'usr-5',
        name: 'Kunal Sen',
        activeProjects: 0,
        completedProjects: 1,
        rating: 4.5,
        reviewsCount: 8,
        email: 'kunal@test.com'
      }
    ];
  },

  // Schedule
  getSchedule: () => [...mockSchedule],

  // Earnings
  getEarningsDetails: () => {
    const totalReleased = mockTransactions.reduce((acc, t) => t.status === 'Released' ? acc + t.amount : acc, 0);
    const totalEscrow = mockTransactions.reduce((acc, t) => t.status === 'In Escrow' ? acc + t.amount : acc, 0);
    
    return {
      totalEarnings: totalReleased,
      monthlyEarnings: 84500,
      pendingEscrow: totalEscrow,
      availablePayout: totalReleased - 400000 // Mock cash availability
    };
  },

  getTransactions: () => [...mockTransactions],

  // Documents
  getDocuments: () => {
    // Collect all documents from projects
    const allDocs: any[] = [];
    mockProjects.forEach(p => {
      p.documents.forEach(d => {
        allDocs.push({
          ...d,
          projectName: p.name,
          projectId: p.id
        });
      });
    });
    return allDocs;
  },

  // Portfolio
  getPortfolio: () => [...mockPortfolio],

  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'rating' | 'reviewText' | 'clientName' | 'featured'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewText: 'Work completed exactly as scoped. Creative designs.',
      clientName: 'New Client Partner',
      featured: false
    };
    mockPortfolio.push(newItem);
    return newItem;
  },

  // Profile & Settings
  getProfile: () => ({ ...mockProfile }),

  getSettings: () => ({ ...mockSettings }),

  updateSettings: (newSettings: Partial<typeof mockSettings>) => {
    mockSettings = { ...mockSettings, ...newSettings };
    mockProfile.name = mockProfile.name; // Keep reactive trigger
    return true;
  }
};
