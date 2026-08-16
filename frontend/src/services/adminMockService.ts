export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'pro' | 'vendor' | 'admin';
  roleDetail?: 'Customer' | 'Architect' | 'Contractor' | 'Vendor' | 'Super Admin' | 'Finance Admin' | 'Moderation Admin' | 'AI Admin';
  verificationStatus: 'Pending' | 'Approved' | 'Rejected' | 'None';
  status: 'Active' | 'Suspended';
  projectsCount: number;
  joinedDate: string;
  lastActive: string;
  experience?: string;
  license?: string;
  documents?: { name: string; url: string; type: string }[];
}

export interface Project {
  id: string;
  name: string;
  customerName: string;
  customerId: string;
  expertName?: string;
  expertId?: string;
  contractorName?: string;
  contractorId?: string;
  budget: number;
  progress: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Delayed' | 'Disputed' | 'Suspended';
  milestones: { name: string; status: 'completed' | 'active' | 'pending' }[];
  escrow: {
    total: number;
    deposited: number;
    released: number;
    remaining: number;
    pendingRelease: number;
    status: 'held' | 'released' | 'disputed';
  };
  documents: { name: string; size: string; date: string; category: string }[];
  messages: { sender: string; role: string; text: string; time: string }[];
  timeline: { title: string; date: string; actor: string }[];
  createdDate: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  projectId?: string;
  projectName?: string;
  userName: string;
  userId: string;
  amount: number;
  type: 'Escrow Deposit' | 'Escrow Release' | 'Payment' | 'Refund' | 'Marketplace Order';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'Under Review';
  date: string;
}

export interface Dispute {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerId: string;
  defendantName: string;
  defendantId: string;
  defendantRole: 'pro' | 'vendor';
  reason: string;
  amount: number;
  status: 'High Priority' | 'Under Review' | 'Resolved';
  messages: { sender: string; text: string; time: string }[];
  evidence: { name: string; url?: string; type: string; date: string }[];
  timeline: { step: string; date: string }[];
  createdDate: string;
}

export interface MarketplaceVendor {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  joinedDate: string;
  license: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  productsCount: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  vendorName: string;
  vendorId: string;
  price: number;
  category: string;
  status: 'Approved' | 'Flagged' | 'Hidden' | 'Pending';
  flagReason?: string;
  rating: number;
  ordersCount: number;
}

export interface AIServiceStats {
  id: string;
  name: string;
  requestsToday: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatency: string;
  usagePercent: number;
  estimatedCost: number;
  status: 'Operational' | 'Degraded Performance' | 'Down';
  errorRate: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  ip: string;
  result: 'Success' | 'Failed';
  reason?: string;
}

export interface SecurityAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}

// Initial Mock Database State
let mockUsers: User[] = [
  { id: 'usr-1', name: 'Shahith', email: 'shahith@test.com', phone: '+91 98765 43210', role: 'client', roleDetail: 'Customer', verificationStatus: 'None', status: 'Active', projectsCount: 2, joinedDate: '2026-01-15', lastActive: 'Today' },
  { id: 'usr-2', name: 'Ripon Ahmed', email: 'ripon@test.com', phone: '+91 87654 32109', role: 'pro', roleDetail: 'Contractor', verificationStatus: 'Pending', status: 'Active', projectsCount: 1, joinedDate: '2026-02-10', lastActive: 'Today', experience: '12 Years', license: 'CONT-2026-8891', documents: [{ name: 'Company_License.pdf', url: '#', type: 'License' }, { name: 'ID_Verification.jpg', url: '#', type: 'ID' }] },
  { id: 'usr-3', name: 'Ananya Roy', email: 'ananya@architects.in', phone: '+91 76543 21098', role: 'pro', roleDetail: 'Architect', verificationStatus: 'Approved', status: 'Active', projectsCount: 3, joinedDate: '2025-11-04', lastActive: 'Yesterday', experience: '8 Years', license: 'ARCH-2024-1102' },
  { id: 'usr-4', name: 'Woodkraft Furnishings', email: 'sales@woodkraft.in', phone: '+91 99887 76655', role: 'vendor', roleDetail: 'Vendor', verificationStatus: 'Pending', status: 'Active', projectsCount: 0, joinedDate: '2026-03-01', lastActive: '2 days ago', license: 'VEND-5541', documents: [{ name: 'Gst_Registration.pdf', url: '#', type: 'GST' }] },
  { id: 'usr-5', name: 'Kunal Sen', email: 'kunal@test.com', phone: '+91 88990 11223', role: 'client', roleDetail: 'Customer', verificationStatus: 'None', status: 'Active', projectsCount: 1, joinedDate: '2026-02-28', lastActive: 'Today' },
  { id: 'usr-6', name: 'Rajesh Kumar', email: 'rajesh@contractors.co.in', phone: '+91 91122 33445', role: 'pro', roleDetail: 'Contractor', verificationStatus: 'Approved', status: 'Active', projectsCount: 1, joinedDate: '2025-09-12', lastActive: '5 mins ago', license: 'CONT-2025-0041' },
  { id: 'usr-7', name: 'DecoTiles Ltd', email: 'tiles@decotiles.com', phone: '+91 77665 54433', role: 'vendor', roleDetail: 'Vendor', verificationStatus: 'Approved', status: 'Active', projectsCount: 0, joinedDate: '2026-01-20', lastActive: '1 week ago', license: 'VEND-9981' },
  { id: 'usr-8', name: 'Vikram Mehta', email: 'vikram@buildpilot.in', phone: '+91 99900 88877', role: 'admin', roleDetail: 'Super Admin', verificationStatus: 'Approved', status: 'Active', projectsCount: 0, joinedDate: '2025-01-01', lastActive: 'Today' },
  { id: 'usr-9', name: 'Ramesh Sawant', email: 'ramesh@spammer.com', phone: '+91 90000 11111', role: 'client', roleDetail: 'Customer', verificationStatus: 'None', status: 'Suspended', projectsCount: 0, joinedDate: '2026-03-12', lastActive: '3 days ago' },
];

let mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Modern Kitchen Renovation',
    customerId: 'usr-1',
    customerName: 'Shahith',
    expertId: 'usr-3',
    expertName: 'Ananya Roy',
    contractorId: 'usr-2',
    contractorName: 'Ripon Ahmed',
    budget: 450000,
    progress: 65,
    status: 'Active',
    milestones: [
      { name: 'Structural Design Approval', status: 'completed' },
      { name: 'Demolition & Wiring Prep', status: 'completed' },
      { name: 'Cabinetry Assembly & Tiling', status: 'active' },
      { name: 'Appliance Fitting & Paint', status: 'pending' },
    ],
    escrow: {
      total: 250000,
      deposited: 250000,
      released: 150000,
      remaining: 100000,
      pendingRelease: 50000,
      status: 'held',
    },
    documents: [
      { name: 'Kitchen_Plan_v2.pdf', size: '4.2 MB', date: '2026-02-15', category: 'Plan' },
      { name: 'Contract_Signed.pdf', size: '1.8 MB', date: '2026-02-12', category: 'Contract' },
    ],
    messages: [
      { sender: 'Shahith', role: 'Customer', text: 'How is the cabinetry progress going?', time: '10:15 AM' },
      { sender: 'Ripon Ahmed', role: 'Contractor', text: 'All materials arrived today. Tiling begins tomorrow morning.', time: '11:00 AM' }
    ],
    timeline: [
      { title: 'Project created by Shahith', date: '2026-02-10', actor: 'Shahith' },
      { title: 'Contractor Ripon Ahmed assigned', date: '2026-02-12', actor: 'Ananya Roy' },
      { title: 'Escrow Deposit of ₹2,50,000 received', date: '2026-02-13', actor: 'System' },
      { title: 'Milestone 1: Structural Design Approved', date: '2026-02-20', actor: 'Ananya Roy' },
      { title: 'Milestone 2: Demolition Completed', date: '2026-03-02', actor: 'Ripon Ahmed' },
    ],
    createdDate: '2026-02-10',
    lastUpdated: 'Today',
  },
  {
    id: 'proj-2',
    name: 'Luxury Villa Structure',
    customerId: 'usr-5',
    customerName: 'Kunal Sen',
    contractorId: 'usr-6',
    contractorName: 'Rajesh Kumar',
    budget: 6500000,
    progress: 15,
    status: 'Delayed',
    milestones: [
      { name: 'Foundation Excavation', status: 'completed' },
      { name: 'Pillar Concrete Casting', status: 'active' },
      { name: 'Roof Slab Laying', status: 'pending' },
      { name: 'Brickwork Layout', status: 'pending' },
    ],
    escrow: {
      total: 1500000,
      deposited: 1500000,
      released: 500000,
      remaining: 1000000,
      pendingRelease: 0,
      status: 'held',
    },
    documents: [
      { name: 'Structural_Blueprint.dwg', size: '18.4 MB', date: '2026-01-05', category: 'Blueprint' }
    ],
    messages: [
      { sender: 'Kunal Sen', role: 'Customer', text: 'Why is there no progress on the pillars?', time: 'Yesterday' },
      { sender: 'Rajesh Kumar', role: 'Contractor', text: 'Delay in cement supply from local vendors. Resolving by Monday.', time: 'Yesterday' }
    ],
    timeline: [
      { title: 'Project created by Kunal', date: '2026-01-05', actor: 'Kunal Sen' },
      { title: 'Deposit of ₹15,00,000 made', date: '2026-01-06', actor: 'System' },
    ],
    createdDate: '2026-01-05',
    lastUpdated: 'Yesterday',
  },
  {
    id: 'proj-3',
    name: 'Minimalist Apartment Interior',
    customerId: 'usr-1',
    customerName: 'Shahith',
    expertId: 'usr-3',
    expertName: 'Ananya Roy',
    budget: 1200000,
    progress: 100,
    status: 'Completed',
    milestones: [
      { name: 'Concept Boards & Moods', status: 'completed' },
      { name: '3D Render Finalizations', status: 'completed' },
      { name: 'Vendor procurement list', status: 'completed' },
    ],
    escrow: {
      total: 1200000,
      deposited: 1200000,
      released: 1200000,
      remaining: 0,
      pendingRelease: 0,
      status: 'released',
    },
    documents: [
      { name: 'Final_Moodboard.pdf', size: '12 MB', date: '2025-12-15', category: 'Design' }
    ],
    messages: [],
    timeline: [
      { title: 'Project signed off', date: '2026-01-10', actor: 'Shahith' }
    ],
    createdDate: '2025-11-20',
    lastUpdated: '2026-01-10',
  },
  {
    id: 'proj-4',
    name: 'Office Space Refurbishing',
    customerId: 'usr-5',
    customerName: 'Kunal Sen',
    contractorId: 'usr-2',
    contractorName: 'Ripon Ahmed',
    budget: 1800000,
    progress: 40,
    status: 'Disputed',
    milestones: [
      { name: 'Electrical & AC Ducting', status: 'completed' },
      { name: 'False Ceiling Panel Setup', status: 'active' },
      { name: 'Glass Partition Installation', status: 'pending' },
    ],
    escrow: {
      total: 900000,
      deposited: 900000,
      released: 400000,
      remaining: 500000,
      pendingRelease: 200000,
      status: 'disputed',
    },
    documents: [],
    messages: [
      { sender: 'Kunal Sen', role: 'Customer', text: 'The ceiling panels are not soundproofed as agreed.', time: '3 days ago' },
      { sender: 'Ripon Ahmed', role: 'Contractor', text: 'You approved the lower density panels to save on cost.', time: '2 days ago' }
    ],
    timeline: [
      { title: 'Dispute opened by Kunal Sen', date: '2026-03-14', actor: 'Kunal Sen' },
      { title: 'Escrow locked by System', date: '2026-03-14', actor: 'System' }
    ],
    createdDate: '2026-01-20',
    lastUpdated: '3 days ago',
  }
];

let mockTransactions: Transaction[] = [
  { id: 'txn-1001', projectId: 'proj-1', projectName: 'Modern Kitchen Renovation', userName: 'Shahith', userId: 'usr-1', amount: 250000, type: 'Escrow Deposit', status: 'Completed', date: '2026-02-13' },
  { id: 'txn-1002', projectId: 'proj-1', projectName: 'Modern Kitchen Renovation', userName: 'Ripon Ahmed', userId: 'usr-2', amount: 50000, type: 'Escrow Release', status: 'Completed', date: '2026-02-21' },
  { id: 'txn-1003', projectId: 'proj-1', projectName: 'Modern Kitchen Renovation', userName: 'Ripon Ahmed', userId: 'usr-2', amount: 50000, type: 'Escrow Release', status: 'Pending', date: 'Today' },
  { id: 'txn-1004', projectId: 'proj-2', projectName: 'Luxury Villa Structure', userName: 'Kunal Sen', userId: 'usr-5', amount: 1500000, type: 'Escrow Deposit', status: 'Completed', date: '2026-01-06' },
  { id: 'txn-1005', projectId: 'proj-4', projectName: 'Office Space Refurbishing', userName: 'Ripon Ahmed', userId: 'usr-2', amount: 200000, type: 'Escrow Release', status: 'Under Review', date: '3 days ago' },
  { id: 'txn-1006', userName: 'Shahith', userId: 'usr-1', amount: 4500, type: 'Marketplace Order', status: 'Completed', date: '2026-03-10' },
  { id: 'txn-1007', userName: 'Kunal Sen', userId: 'usr-5', amount: 12000, type: 'Marketplace Order', status: 'Failed', date: '2026-03-11' },
];

let mockDisputes: Dispute[] = [
  {
    id: 'disp-1',
    projectId: 'proj-4',
    projectName: 'Office Space Refurbishing',
    customerName: 'Kunal Sen',
    customerId: 'usr-5',
    defendantName: 'Ripon Ahmed',
    defendantId: 'usr-2',
    defendantRole: 'pro',
    reason: 'Ceiling panels insulation is substandard and does not match the signed BOQ specification.',
    amount: 200000,
    status: 'High Priority',
    messages: [
      { sender: 'Kunal Sen', text: 'The panels installed are 8mm thin sheets instead of the acoustic 15px fibers. It is incredibly noisy.', time: '2026-03-14 10:00 AM' },
      { sender: 'Ripon Ahmed', text: 'The 15px fibers were unavailable at the time. I proposed the 8mm with dual layer backing, and you said "go ahead with what works".', time: '2026-03-14 11:20 AM' }
    ],
    evidence: [
      { name: 'ceiling_specifications.pdf', type: 'Document', date: '2026-03-14' },
      { name: 'site_photo_panel_thinness.jpg', type: 'Photo', date: '2026-03-14' }
    ],
    timeline: [
      { step: 'Dispute Filed by Customer', date: '2026-03-14' },
      { step: 'Escrow Locked by Administrator', date: '2026-03-14' },
      { step: 'Contractor Response Received', date: '2026-03-14' }
    ],
    createdDate: '2026-03-14',
  }
];

let mockMarketplaceVendors: MarketplaceVendor[] = [
  { id: 'usr-4', businessName: 'Woodkraft Furnishings', email: 'sales@woodkraft.in', phone: '+91 99887 76655', joinedDate: '2026-03-01', license: 'VEND-5541', status: 'Pending', productsCount: 12 },
  { id: 'usr-7', businessName: 'DecoTiles Ltd', email: 'tiles@decotiles.com', phone: '+91 77665 54433', joinedDate: '2026-01-20', license: 'VEND-9981', status: 'Approved', productsCount: 45 }
];

let mockMarketplaceProducts: MarketplaceProduct[] = [
  { id: 'prod-1', name: 'Premium Teak Dining Table', vendorName: 'Woodkraft Furnishings', vendorId: 'usr-4', price: 42000, category: 'Furniture', status: 'Pending', rating: 0, ordersCount: 0 },
  { id: 'prod-2', name: 'Acoustic Soundproofing Foam Panels', vendorName: 'Woodkraft Furnishings', vendorId: 'usr-4', price: 1200, category: 'Materials', status: 'Flagged', flagReason: 'Deceptive advertising - claimed 99% reduction in 8mm thickness', rating: 3.2, ordersCount: 15 },
  { id: 'prod-3', name: 'Glazed Vitrified Porcelain Floor Tile', vendorName: 'DecoTiles Ltd', vendorId: 'usr-7', price: 85, category: 'Flooring', status: 'Approved', rating: 4.8, ordersCount: 220 }
];

let mockAIServices: AIServiceStats[] = [
  { id: 'ai-est', name: 'AI Estimator', requestsToday: 1284, successfulRequests: 1245, failedRequests: 39, avgLatency: '1.8s', usagePercent: 54, estimatedCost: 38.5, status: 'Operational', errorRate: 3.0 },
  { id: 'ai-vis', name: 'AR Visualizer', requestsToday: 840, successfulRequests: 835, failedRequests: 5, avgLatency: '2.5s', usagePercent: 32, estimatedCost: 42.0, status: 'Operational', errorRate: 0.6 },
  { id: 'ai-stu', name: 'AI Interior Studio', requestsToday: 2150, successfulRequests: 1980, failedRequests: 170, avgLatency: '4.2s', usagePercent: 88, estimatedCost: 129.0, status: 'Degraded Performance', errorRate: 7.9 },
  { id: 'ai-rag', name: 'RAG Knowledge Helper', requestsToday: 3410, successfulRequests: 3402, failedRequests: 8, avgLatency: '0.9s', usagePercent: 45, estimatedCost: 10.2, status: 'Operational', errorRate: 0.23 }
];

let mockAuditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '10:42 PM', actor: 'Vikram Mehta (Super Admin)', action: 'Approved contractor verification', entity: 'User', entityId: 'usr-6', ip: '192.168.1.42', result: 'Success' },
  { id: 'log-2', timestamp: '10:38 PM', actor: 'Shahith (Customer)', action: 'Updated project scope', entity: 'Project', entityId: 'proj-1', ip: '192.168.1.15', result: 'Success' },
  { id: 'log-3', timestamp: '10:31 PM', actor: 'System Auto-Escrow', action: 'Released ₹50,000 Milestone', entity: 'Project', entityId: 'proj-1', ip: '127.0.0.1', result: 'Success' },
  { id: 'log-4', timestamp: '10:28 PM', actor: 'Vikram Mehta (Super Admin)', action: 'Suspended user account', entity: 'User', entityId: 'usr-9', ip: '192.168.1.42', result: 'Success', reason: 'Repeated spam reports' },
  { id: 'log-5', timestamp: '10:15 PM', actor: 'Guest User', action: 'Failed login attempt', entity: 'Authentication', entityId: 'ramesh@spammer.com', ip: '45.89.230.12', result: 'Failed', reason: 'Incorrect credentials' }
];

let mockSecurityAlerts: SecurityAlert[] = [
  { id: 'sec-1', severity: 'Critical', title: 'Brute Force Attempt', description: '5 failed login attempts from IP 45.89.230.12 on user ramesh@spammer.com', timestamp: '10:15 PM', status: 'Active' },
  { id: 'sec-2', severity: 'High', title: 'Unusual Escrow Request', description: 'Milestone release requested 2 hours after initial escrow deposit on Project proj-2', timestamp: '08:44 PM', status: 'Active' },
  { id: 'sec-3', severity: 'Medium', title: 'Multiple Role Access', description: 'User usr-2 attempted to view admin configuration page', timestamp: 'Yesterday', status: 'Resolved' }
];

let mockNotifications = [
  { id: 'ntf-1', text: 'New verification request from Ripon Ahmed', read: false, date: 'Today' },
  { id: 'ntf-2', text: 'Dispute filed by Kunal Sen on project Office Space Refurbishing', read: false, date: 'Today' },
  { id: 'ntf-3', text: 'AI Interior Studio is experiencing degraded performance', read: true, date: 'Today' },
];

let mockSettings = {
  platformName: 'BuildPilot',
  supportEmail: 'support@buildpilot.in',
  escrowFeePercent: 4,
  marketplaceCommission: 8,
  requireEscrowForPros: true,
  maintenanceMode: false,
  aiBillingThreshold: 500,
  maxRAGUploadSize: 50
};

// API Methods
export const adminMockService = {
  // Stats summary for KPI cards
  getDashboardKPIs: () => {
    const totalUsers = mockUsers.length + 12473; // offset to make it feel real
    const activeProjects = mockProjects.filter(p => p.status === 'Active' || p.status === 'Delayed' || p.status === 'Disputed').length + 344;
    const escrowBalance = mockProjects.reduce((acc, p) => acc + (p.escrow.status === 'held' ? p.escrow.remaining : 0), 0) + 2450000;
    const pendingActions = mockUsers.filter(u => u.verificationStatus === 'Pending').length +
                           mockDisputes.filter(d => d.status !== 'Resolved').length +
                           mockMarketplaceProducts.filter(p => p.status === 'Pending' || p.status === 'Flagged').length +
                           mockSecurityAlerts.filter(s => s.status === 'Active').length;

    return {
      totalUsers,
      activeProjects,
      escrowBalance, // In Rupees
      pendingActions
    };
  },

  // Users management
  getUsers: () => [...mockUsers],
  updateUserStatus: (id: string, status: 'Active' | 'Suspended', reason?: string) => {
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, status } : u);
    const actionText = status === 'Suspended' ? 'Suspended user account' : 'Activated user account';
    
    // Add audit log
    adminMockService.addAuditLog(
      actionText,
      'User',
      id,
      reason || 'Administrative Action'
    );
    return true;
  },
  verifyUser: (id: string, approve: boolean, reason?: string) => {
    mockUsers = mockUsers.map(u => u.id === id ? { 
      ...u, 
      verificationStatus: approve ? 'Approved' : 'Rejected'
    } : u);
    
    const actionText = approve ? 'Approved contractor verification' : 'Rejected contractor verification';
    
    adminMockService.addAuditLog(
      actionText,
      'User',
      id,
      reason || (approve ? 'Verified license and credentials' : 'Substandard documentation')
    );
    return true;
  },

  // Projects management
  getProjects: () => [...mockProjects],
  getProjectById: (id: string) => mockProjects.find(p => p.id === id),
  updateProjectStatus: (id: string, status: Project['status'], reason?: string) => {
    mockProjects = mockProjects.map(p => p.id === id ? { ...p, status, lastUpdated: 'Today' } : p);
    adminMockService.addAuditLog(
      `Changed project status to ${status}`,
      'Project',
      id,
      reason || 'Scope management'
    );
    return true;
  },
  
  // Finance & Escrow
  getTransactions: () => [...mockTransactions],
  getEscrowLedger: () => {
    const totalVolume = 8240000;
    const heldEscrow = mockProjects.reduce((acc, p) => p.status !== 'Completed' ? acc + p.escrow.remaining : acc, 0) + 2240000;
    const released = 5120000;
    const pendingRelease = mockProjects.reduce((acc, p) => acc + p.escrow.pendingRelease, 0) + 540000;
    const refunds = 120000;
    
    return {
      totalVolume,
      heldEscrow,
      released,
      pendingRelease,
      refunds
    };
  },
  releaseEscrowFunds: (projectId: string, amount: number, reason: string) => {
    let project = mockProjects.find(p => p.id === projectId);
    if (!project) return false;

    if (project.escrow.remaining < amount) return false;

    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        const released = p.escrow.released + amount;
        const remaining = p.escrow.remaining - amount;
        return {
          ...p,
          escrow: {
            ...p.escrow,
            released,
            remaining,
            pendingRelease: Math.max(0, p.escrow.pendingRelease - amount),
            status: remaining === 0 ? 'released' : p.escrow.status
          }
        };
      }
      return p;
    });

    // Add transaction
    const transactionId = `txn-${Math.floor(1000 + Math.random() * 9000)}`;
    mockTransactions.unshift({
      id: transactionId,
      projectId,
      projectName: project.name,
      userName: project.contractorName || 'Contractor',
      userId: project.contractorId || '',
      amount,
      type: 'Escrow Release',
      status: 'Completed',
      date: 'Today'
    });

    adminMockService.addAuditLog(
      `Released escrow of ₹${amount.toLocaleString('en-IN')}`,
      'Project',
      projectId,
      reason
    );

    return true;
  },
  holdEscrowFunds: (projectId: string, reason: string) => {
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          escrow: {
            ...p.escrow,
            status: 'held'
          }
        };
      }
      return p;
    });

    adminMockService.addAuditLog(
      `Locked escrow payments`,
      'Project',
      projectId,
      reason
    );
    return true;
  },

  // Disputes
  getDisputes: () => [...mockDisputes],
  resolveDispute: (id: string, action: 'refund' | 'release' | 'split', reason: string) => {
    const dispute = mockDisputes.find(d => d.id === id);
    if (!dispute) return false;

    mockDisputes = mockDisputes.map(d => d.id === id ? { ...d, status: 'Resolved' } : d);
    
    // Update project state
    mockProjects = mockProjects.map(p => {
      if (p.id === dispute.projectId) {
        return {
          ...p,
          status: 'Active', // Return to active from dispute
          escrow: {
            ...p.escrow,
            status: action === 'refund' ? 'released' : 'held'
          }
        };
      }
      return p;
    });

    adminMockService.addAuditLog(
      `Resolved dispute with resolution: ${action}`,
      'Dispute',
      id,
      reason
    );
    return true;
  },

  // Marketplace
  getMarketplaceVendors: () => [...mockMarketplaceVendors],
  getMarketplaceProducts: () => [...mockMarketplaceProducts],
  verifyVendor: (id: string, approve: boolean, reason?: string) => {
    mockMarketplaceVendors = mockMarketplaceVendors.map(v => v.id === id ? { ...v, status: approve ? 'Approved' : 'Rejected' } : v);
    
    // Also update main user list
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, verificationStatus: approve ? 'Approved' : 'Rejected' } : u);

    adminMockService.addAuditLog(
      approve ? 'Approved vendor license' : 'Rejected vendor credentials',
      'Vendor',
      id,
      reason || 'Registration check'
    );
    return true;
  },
  moderateProduct: (id: string, action: 'Approve' | 'Hide' | 'Flag', reason?: string) => {
    mockMarketplaceProducts = mockMarketplaceProducts.map(p => p.id === id ? { 
      ...p, 
      status: action === 'Approve' ? 'Approved' : action === 'Hide' ? 'Hidden' : 'Flagged',
      flagReason: action === 'Flag' ? reason : undefined
    } : p);

    adminMockService.addAuditLog(
      `Product moderation: ${action}`,
      'Product',
      id,
      reason || 'Standard moderation scan'
    );
    return true;
  },

  // AI Services
  getAIServices: () => [...mockAIServices],

  // Security & Audit
  getAuditLogs: () => [...mockAuditLogs],
  getSecurityAlerts: () => [...mockSecurityAlerts],
  addAuditLog: (action: string, entity: string, entityId: string, reason?: string) => {
    const newLog: AuditLog = {
      id: `log-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      actor: 'Vikram Mehta (Super Admin)',
      action,
      entity,
      entityId,
      ip: '192.168.1.42',
      result: 'Success',
      reason
    };
    mockAuditLogs.unshift(newLog);
  },
  resolveSecurityAlert: (id: string) => {
    mockSecurityAlerts = mockSecurityAlerts.map(a => a.id === id ? { ...a, status: 'Resolved' } : a);
    return true;
  },

  // Notifications
  getNotifications: () => [...mockNotifications],
  markNotificationsAsRead: () => {
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
    return true;
  },

  // Settings
  getSettings: () => ({ ...mockSettings }),
  updateSettings: (newSettings: Partial<typeof mockSettings>) => {
    mockSettings = { ...mockSettings, ...newSettings };
    adminMockService.addAuditLog(
      'Updated platform configuration settings',
      'Settings',
      'config',
      'Administrative adjustment'
    );
    return true;
  }
};
