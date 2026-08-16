import { professionalMockService } from './professionalMockService';

export interface ClientProject {
  id: string;
  name: string;
  professionalName: string;
  professionalId: string;
  role: string;
  budget: number;
  spent: number;
  remaining: number;
  progress: number;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Archived';
  currentMilestone: string;
  deadline: string;
  paymentStatus: 'Released' | 'In Escrow' | 'Pending' | 'Failed' | 'Disputed';
  startDate: string;
  description: string;
  requirements: string[];
  milestones: {
    id: string;
    name: string;
    description: string;
    progress: number;
    startDate: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Delayed' | 'Completed';
    deliverables: { name: string; url: string; date: string; type: string }[];
    paymentAmount: number;
    revisionComments?: string;
  }[];
  documents: { id: string; name: string; type: string; uploadedBy: string; date: string; version: string }[];
  photos: { id: string; url: string; caption: string; date: string; uploadedBy: string; milestoneId?: string }[];
  messages: { sender: string; role: 'Customer' | 'Professional'; text: string; time: string }[];
  escrow: {
    total: number;
    deposited: number;
    released: number;
    remaining: number;
    status: 'held' | 'released' | 'disputed';
  };
  team: { name: string; role: string; specialization: string; rating: number; verified: boolean; email: string }[];
  activityLog: { date: string; action: string; user: string }[];
}

export interface SavedPro {
  id: string;
  name: string;
  role: string;
  rating: number;
  location: string;
  image: string;
}

export interface SavedProperty {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
}

export interface SavedEstimate {
  id: string;
  title: string;
  date: string;
  totalEstimate: number;
  area: number;
  quality: string;
}

export interface SavedDesign {
  id: string;
  roomType: string;
  date: string;
  material: string;
  finish: string;
}

let mockProjects: ClientProject[] = [
  {
    id: 'proj-1',
    name: 'Modern Kitchen Renovation',
    professionalName: 'Rahul Architects',
    professionalId: 'usr-3',
    role: 'Architect',
    budget: 450000,
    spent: 285000,
    remaining: 165000,
    progress: 68,
    status: 'Active',
    currentMilestone: 'Cabinetry Assembly & Tiling',
    deadline: '2026-08-24',
    paymentStatus: 'In Escrow',
    startDate: '2026-07-25',
    description: 'Renovation of a 250 sq.ft residential kitchen with luxury modular cabinets, chimney integration, and granite countertops.',
    requirements: [
      'Acoustic cabinetry dampening',
      'Dual sinks with flexible nozzles',
      'Ambient LED under-cabinet lightning'
    ],
    milestones: [
      {
        id: 'm1',
        name: 'Structural Design Approval',
        description: 'Complete 3D space optimization maps and layout finalizations.',
        progress: 100,
        startDate: '2026-07-25',
        dueDate: '2026-07-30',
        status: 'Approved',
        deliverables: [{ name: 'Kitchen_Plan_v2.pdf', url: '#', date: '2026-07-29', type: 'Design' }],
        paymentAmount: 150000
      },
      {
        id: 'm2',
        name: 'Demolition & Wiring Prep',
        description: 'Remove original wall tiles, scrap electric tubes, install core structural lines.',
        progress: 100,
        startDate: '2026-08-01',
        dueDate: '2026-08-08',
        status: 'Approved',
        deliverables: [{ name: 'Demolition_Report.pdf', url: '#', date: '2026-08-07', type: 'Report' }],
        paymentAmount: 135000
      },
      {
        id: 'm3',
        name: 'Cabinetry Assembly & Tiling',
        description: 'Setup framework plywood modular cabinets, adjust tiling layouts.',
        progress: 100,
        startDate: '2026-08-10',
        dueDate: '2026-08-20',
        status: 'Submitted', // Submitted by Professional, awaiting Client review
        deliverables: [{ name: 'Cabinetry_Tiling_Layout_v1.pdf', url: '#', date: '2026-08-14', type: 'Drawing' }],
        paymentAmount: 100000
      },
      {
        id: 'm4',
        name: 'Appliance Fitting & Paint',
        description: 'Install direct ventilation chimneys, paint cabinets with matte coating.',
        progress: 0,
        startDate: '2026-08-21',
        dueDate: '2026-08-27',
        status: 'Not Started',
        deliverables: [],
        paymentAmount: 65000
      }
    ],
    documents: [
      { id: 'doc-1', name: 'Contract_Signed.pdf', type: 'Contract', uploadedBy: 'System', date: '2026-07-25', version: 'v1' },
      { id: 'doc-2', name: 'Kitchen_Plan_v2.pdf', type: 'Drawing', uploadedBy: 'Professional', date: '2026-07-29', version: 'v2' }
    ],
    photos: [
      { id: 'ph-1', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600', caption: 'Original kitchen configuration before demolition', date: '2026-07-24', uploadedBy: 'Customer' },
      { id: 'ph-2', url: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&q=80&w=600', caption: 'Cabinet framing underway', date: '2026-08-12', uploadedBy: 'Professional', milestoneId: 'm3' }
    ],
    messages: [
      { sender: 'Shahith', role: 'Customer', text: 'How is the cabinetry progress going?', time: '10:15 AM' },
      { sender: 'Rahul Architects', role: 'Professional', text: 'All materials arrived today. Tiling begins tomorrow morning.', time: '11:00 AM' }
    ],
    escrow: {
      total: 165000,
      deposited: 165000,
      released: 285000,
      remaining: 165000,
      status: 'held'
    },
    team: [
      { name: 'Rahul Architects', role: 'Architect', specialization: 'Interior Architecture', rating: 4.9, verified: true, email: 'pro@buildpilot.in' },
      { name: 'David Miller', role: 'General Contractor', specialization: 'Site Construction Management', rating: 4.7, verified: true, email: 'david@test.com' }
    ],
    activityLog: [
      { date: '2026-07-25', action: 'Project initialized by client Shahith', user: 'Shahith' },
      { date: '2026-07-29', action: 'Uploaded kitchen design plan v2', user: 'Rahul Architects' },
      { date: '2026-07-30', action: 'Approved milestone: Structural Design', user: 'Shahith' },
      { date: '2026-08-08', action: 'Approved milestone: Demolition & Wiring Prep', user: 'Shahith' },
      { date: '2026-08-14', action: 'Submitted cabinetry milestone deliverables for review', user: 'Rahul Architects' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Oceanview Deck Extensions',
    professionalName: 'David Miller',
    professionalId: 'usr-4',
    role: 'General Contractor',
    budget: 280000,
    spent: 280000,
    remaining: 0,
    progress: 100,
    status: 'Completed',
    currentMilestone: 'Project Handover Complete',
    deadline: '2026-01-15',
    paymentStatus: 'Released',
    startDate: '2025-11-20',
    description: 'Construct a 400 sq.ft composite floor deck extension facing the ocean view, complete with wind-resistant hand rails.',
    requirements: ['Corrosion-proof screws', 'Safety barrier structural inspection'],
    milestones: [
      { id: 'm1', name: 'Foundation Piers Pouring', description: 'Concrete foundation block placement.', progress: 100, startDate: '2025-11-20', dueDate: '2025-12-05', status: 'Approved', deliverables: [], paymentAmount: 80000 },
      { id: 'm2', name: 'Steel Framework Assembly', description: 'Setup supporting frameworks.', progress: 100, startDate: '2025-12-06', dueDate: '2025-12-25', status: 'Approved', deliverables: [], paymentAmount: 100000 },
      { id: 'm3', name: 'Composite Deck Boarding', description: 'Board panels and finish boundaries.', progress: 100, startDate: '2025-12-26', dueDate: '2026-01-10', status: 'Approved', deliverables: [], paymentAmount: 100000 }
    ],
    documents: [
      { id: 'doc-3', name: 'Deck_Blueprints.pdf', type: 'Drawing', uploadedBy: 'Professional', date: '2025-11-21', version: 'v1' }
    ],
    photos: [],
    messages: [],
    escrow: { total: 280000, deposited: 280000, released: 280000, remaining: 0, status: 'released' },
    team: [{ name: 'David Miller', role: 'General Contractor', specialization: 'Woodwork & Steel Frames', rating: 4.7, verified: true, email: 'david@test.com' }],
    activityLog: [{ date: '2026-01-10', action: 'Milestone: Deck Boarding approved and payment released', user: 'Shahith' }]
  }
];

let mockSavedPros: SavedPro[] = [
  { id: 'pro-1', name: 'Ripon Ahmed', role: 'Architect / UI Designer', rating: 4.9, location: 'San Francisco, CA', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: 'pro-2', name: 'Sarah Connor', role: 'Structural Engineer', rating: 4.8, location: 'Austin, TX', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' }
];

let mockSavedProperties: SavedProperty[] = [
  { id: 'prop-1', title: 'The Obsidian Glass Villa', price: '₹1,250,000', location: 'Beverly Hills, CA', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 'prop-2', title: 'Minimalist Urban Loft', price: '₹4,200/mo', location: 'SoHo, New York', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=300&h=200' }
];

let mockSavedEstimates: SavedEstimate[] = [];
let mockSavedDesigns: SavedDesign[] = [];

let mockNotifications = [
  { id: 'not-1', category: 'Milestones', text: 'Rahul Architects submitted the cabinetry milestone for approval.', date: 'Today', unread: true, actionView: 'project-workspace', projectId: 'proj-1' },
  { id: 'not-2', category: 'Messages', text: 'New direct message thread opened by support team.', date: 'Yesterday', unread: false }
];

export const clientMockService = {
  getProjects: () => [...mockProjects],

  getProjectById: (id: string) => mockProjects.find(p => p.id === id),

  // Milestone actions
  approveMilestone: (projectId: string, milestoneId: string) => {
    let success = false;
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const milestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            success = true;
            return { ...m, status: 'Approved' as const, progress: 100 };
          }
          return m;
        });

        // Compute new spent / remaining / progress
        const approvedMilestones = milestones.filter(m => m.status === 'Approved');
        const spent = approvedMilestones.reduce((acc, m) => acc + m.paymentAmount, 0);
        const overall = Math.floor(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length);

        const currentIncomplete = milestones.find(m => m.status !== 'Approved');
        const currentMilestone = currentIncomplete ? currentIncomplete.name : 'Project Completed';

        const updatedEscrow = {
          ...p.escrow,
          released: spent,
          remaining: p.budget - spent,
          status: currentIncomplete ? 'held' as const : 'released' as const
        };

        const newLog = {
          date: new Date().toISOString().split('T')[0],
          action: `Approved milestone: ${milestones.find(m => m.id === milestoneId)?.name}`,
          user: 'Shahith'
        };

        return {
          ...p,
          milestones,
          spent,
          remaining: p.budget - spent,
          progress: overall,
          currentMilestone,
          escrow: updatedEscrow,
          activityLog: [...p.activityLog, newLog],
          status: currentIncomplete ? 'Active' as const : 'Completed' as const
        };
      }
      return p;
    });

    // Also sync back to professionalMockService if present
    professionalMockService.updateMilestoneProgress(projectId, milestoneId, 100);

    return success;
  },

  requestMilestoneRevision: (projectId: string, milestoneId: string, comments: string) => {
    let success = false;
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const milestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            success = true;
            return { ...m, status: 'Rejected' as const, progress: 85, revisionComments: comments };
          }
          return m;
        });

        const newLog = {
          date: new Date().toISOString().split('T')[0],
          action: `Requested revision on milestone: ${milestones.find(m => m.id === milestoneId)?.name}`,
          user: 'Shahith'
        };

        return {
          ...p,
          milestones,
          activityLog: [...p.activityLog, newLog]
        };
      }
      return p;
    });
    return success;
  },

  // Document uploader
  uploadDocument: (projectId: string, file: { name: string; type: string }) => {
    let success = false;
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const newDoc = {
          id: `doc-${Math.floor(100 + Math.random() * 900)}`,
          name: file.name,
          type: file.type,
          uploadedBy: 'Customer',
          date: new Date().toISOString().split('T')[0],
          version: 'v1'
        };
        success = true;
        return {
          ...p,
          documents: [...p.documents, newDoc],
          activityLog: [...p.activityLog, { date: new Date().toISOString().split('T')[0], action: `Uploaded document: ${file.name}`, user: 'Shahith' }]
        };
      }
      return p;
    });
    return success;
  },

  // Progress picture uploader
  uploadProgressPhoto: (projectId: string, milestoneId: string, caption: string) => {
    let success = false;
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const newPhoto = {
          id: `ph-${Math.floor(100 + Math.random() * 900)}`,
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
          caption,
          date: new Date().toISOString().split('T')[0],
          uploadedBy: 'Customer',
          milestoneId
        };
        success = true;
        return {
          ...p,
          photos: [...p.photos, newPhoto],
          activityLog: [...p.activityLog, { date: new Date().toISOString().split('T')[0], action: `Added progress photo: ${caption}`, user: 'Shahith' }]
        };
      }
      return p;
    });
    return success;
  },

  sendMessage: (projectId: string, text: string) => {
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const newMsg = {
          sender: 'Shahith',
          role: 'Customer' as const,
          text,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        return { ...p, messages: [...p.messages, newMsg] };
      }
      return p;
    });
    return true;
  },

  // Bookmark functions
  getSavedPros: () => [...mockSavedPros],
  getSavedProperties: () => [...mockSavedProperties],
  getSavedEstimates: () => [...mockSavedEstimates],
  getSavedDesigns: () => [...mockSavedDesigns],

  bookmarkPro: (pro: SavedPro) => {
    if (!mockSavedPros.find(p => p.id === pro.id)) {
      mockSavedPros.push(pro);
    }
  },

  bookmarkProperty: (prop: SavedProperty) => {
    if (!mockSavedProperties.find(p => p.id === prop.id)) {
      mockSavedProperties.push(prop);
    }
  },

  // AI Saving integrations
  saveEstimate: (est: { title: string; totalEstimate: number; area: number; quality: string }) => {
    const newEst = {
      ...est,
      id: `est-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
    mockSavedEstimates.push(newEst);
    return newEst;
  },

  createProjectFromEstimate: (est: { title: string; totalEstimate: number; area: number; quality: string }) => {
    const newProj: ClientProject = {
      id: `proj-${Math.floor(100 + Math.random() * 900)}`,
      name: est.title || 'New Villa Project',
      professionalName: 'Rahul Architects',
      professionalId: 'usr-3',
      role: 'Architect',
      budget: est.totalEstimate,
      spent: 0,
      remaining: est.totalEstimate,
      progress: 0,
      status: 'Upcoming',
      currentMilestone: 'Initial Site Survey',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'Pending',
      startDate: new Date().toISOString().split('T')[0],
      description: `Project created from AI Estimate. Quality specifications: ${est.quality}, Plot size: ${est.area} sq.ft.`,
      requirements: ['Verify soil loads', 'Submit Vastu blueprints'],
      milestones: [
        { id: 'm1', name: 'Site Survey & Soil Test', description: 'Analyze topography and bearing capacity.', progress: 0, startDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Not Started', deliverables: [], paymentAmount: est.totalEstimate * 0.1 },
        { id: 'm2', name: 'Foundation Pouring', description: 'Excavation and brick layout.', progress: 0, startDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Not Started', deliverables: [], paymentAmount: est.totalEstimate * 0.4 }
      ],
      documents: [],
      photos: [],
      messages: [],
      escrow: {
        total: est.totalEstimate,
        deposited: 0,
        released: 0,
        remaining: est.totalEstimate,
        status: 'held'
      },
      team: [{ name: 'Rahul Architects', role: 'Architect', specialization: 'Building Layout Plans', rating: 4.9, verified: true, email: 'pro@buildpilot.in' }],
      activityLog: [{ date: new Date().toISOString().split('T')[0], action: 'Project initialized via AI Estimate', user: 'Shahith' }]
    };
    mockProjects.push(newProj);
    return newProj;
  },

  saveRoomDesign: (design: { roomType: string; material: string; finish: string }) => {
    const newDesign = {
      ...design,
      id: `ds-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
    mockSavedDesigns.push(newDesign);
    return newDesign;
  },

  submitReview: (projectId: string, ratings: { overall: number; comments: string }) => {
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          activityLog: [...p.activityLog, { date: new Date().toISOString().split('T')[0], action: `Submitted rating of ${ratings.overall} stars for professional`, user: 'Shahith' }]
        };
      }
      return p;
    });
    return true;
  },

  // Notifications
  getNotifications: () => [...mockNotifications],
  markNotificationRead: (id: string) => {
    mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, unread: false } : n);
  }
};
