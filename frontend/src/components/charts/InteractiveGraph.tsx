import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Cpu, Eye, Sparkles, Shield, Wrench, Calendar, 
  DollarSign, Briefcase, User, Layers, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react';

export type GraphPreset = 'landing' | 'project-map' | 'milestones-dependency' | 'pro-network' | 'ai-estimator' | 'defect-scanner' | 'ai-studio' | 'marketplace' | 'homecare';

interface InteractiveGraphProps {
  preset: GraphPreset;
  activeMilestoneId?: string; // For milestone tracking
  onNodeClick?: (view: string) => void;
  interactive?: boolean;
}

interface GraphNode {
  id: string;
  label: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  description: string;
  icon: React.ReactNode;
  status?: 'Completed' | 'In Progress' | 'Not Started' | 'Delayed';
  cta?: string;
  ctaView?: string;
}

interface GraphLink {
  from: string;
  to: string;
  animated?: boolean;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  preset,
  activeMilestoneId: _activeMilestoneId,
  onNodeClick,
  interactive = true
}) => {
  const navigate = useNavigate();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize handler to keep SVG coordinates bound correctly
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 450
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preset Configurations
  const getGraphData = (): { nodes: GraphNode[]; links: GraphLink[] } => {
    switch (preset) {
      case 'landing':
        return {
          nodes: [
            { id: 'bp', label: 'BUILDPILOT', x: 50, y: 10, description: 'Escrow-protected, AI-driven construction ecosystem.', icon: <Shield className="w-5 h-5" /> },
            { id: 'plan', label: 'PLAN', x: 20, y: 30, description: 'Outline project scope, specs, and architectural criteria.', icon: <FileText className="w-4 h-4" />, cta: 'Explore Blueprint', ctaView: '/auth' },
            { id: 'design', label: 'DESIGN', x: 50, y: 30, description: 'Re-imagine structures using 3D renders & VR tools.', icon: <Sparkles className="w-4 h-4" />, cta: 'AI Studio', ctaView: '/main/studio' },
            { id: 'estimate', label: 'ESTIMATE', x: 80, y: 30, description: 'Calculate material volumes & total construction budgets.', icon: <Cpu className="w-4 h-4" />, cta: 'AI Estimator', ctaView: '/main/estimator' },
            { id: 'pro', label: 'PROFESSIONALS', x: 50, y: 50, description: 'Match with checked, registered local experts.', icon: <User className="w-4 h-4" />, cta: 'Explore Marketplace', ctaView: '/main/marketplace' },
            { id: 'project', label: 'PROJECT', x: 50, y: 68, description: 'Contract management with live verification logs.', icon: <Briefcase className="w-4 h-4" />, cta: 'My Workspace', ctaView: '/auth' },
            { id: 'milestone', label: 'MILESTONES', x: 20, y: 84, description: 'Review blueprint iterations step-by-step.', icon: <Calendar className="w-4 h-4" /> },
            { id: 'budget', label: 'BUDGET', x: 50, y: 84, description: 'Escrow contract payments released upon approval.', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'docs', label: 'DOCUMENTS', x: 80, y: 84, description: 'Securely upload plans and invoice receipts.', icon: <FileText className="w-4 h-4" /> },
            { id: 'completion', label: 'COMPLETION', x: 50, y: 95, description: 'Handovers, ratings, and structural warranties.', icon: <CheckCircle2 className="w-4 h-4" /> }
          ],
          links: [
            { from: 'bp', to: 'plan', animated: true },
            { from: 'bp', to: 'design', animated: true },
            { from: 'bp', to: 'estimate', animated: true },
            { from: 'plan', to: 'pro' },
            { from: 'design', to: 'pro' },
            { from: 'estimate', to: 'pro' },
            { from: 'pro', to: 'project', animated: true },
            { from: 'project', to: 'milestone' },
            { from: 'project', to: 'budget', animated: true },
            { from: 'project', to: 'docs' },
            { from: 'milestone', to: 'completion' },
            { from: 'budget', to: 'completion', animated: true },
            { from: 'docs', to: 'completion' }
          ]
        };

      case 'project-map':
        return {
          nodes: [
            { id: 'root', label: 'PROJECT CONTRACT', x: 50, y: 15, description: 'Comprehensive construction execution plan.', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'design', label: 'DESIGN & SCHEMES', x: 20, y: 45, description: 'Floor plans, elevations, and structural drawings.', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'structure', label: 'STRUCTURE WORK', x: 50, y: 45, description: 'Excavation foundations, pillar frame assembly, masonry.', icon: <Layers className="w-4 h-4" /> },
            { id: 'finishing', label: 'FINISHING PLOTS', x: 80, y: 45, description: 'Modular cabinetry, floor tiling, electrical wiring.', icon: <Wrench className="w-4 h-4" /> },
            { id: 'signoff', label: 'FINAL HANDOVER', x: 50, y: 85, description: 'Technician reviews, receipts ledger, and audits.', icon: <CheckCircle2 className="w-4 h-4" /> }
          ],
          links: [
            { from: 'root', to: 'design', animated: true },
            { from: 'root', to: 'structure', animated: true },
            { from: 'root', to: 'finishing' },
            { from: 'design', to: 'signoff' },
            { from: 'structure', to: 'signoff', animated: true },
            { from: 'finishing', to: 'signoff' }
          ]
        };

      case 'milestones-dependency':
        return {
          nodes: [
            { id: 'ms1', label: 'Site Survey', x: 10, y: 50, description: 'Topography check and soil load measurements.', icon: <CheckCircle2 className="w-4 h-4" />, status: 'Completed' },
            { id: 'ms2', label: 'Concept Design', x: 30, y: 50, description: 'Draft space blueprints and concept sketches.', icon: <CheckCircle2 className="w-4 h-4" />, status: 'Completed' },
            { id: 'ms3', label: 'Cabinetry & Tiling', x: 50, y: 50, description: 'Modular framework assembly and wall tiling.', icon: <Clock className="w-4 h-4" />, status: 'In Progress' },
            { id: 'ms4', label: 'Appliance Fitting', x: 70, y: 50, description: 'Electric wires, ventilation systems, and paint coating.', icon: <Layers className="w-4 h-4" />, status: 'Not Started' },
            { id: 'ms5', label: 'Inspection', x: 90, y: 50, description: 'Audit verification and handover releases.', icon: <CheckCircle2 className="w-4 h-4" />, status: 'Not Started' }
          ],
          links: [
            { from: 'ms1', to: 'ms2', animated: false },
            { from: 'ms2', to: 'ms3', animated: true },
            { from: 'ms3', to: 'ms4' },
            { from: 'ms4', to: 'ms5' }
          ]
        };

      case 'pro-network':
        return {
          nodes: [
            { id: 'client', label: 'SHAHITH (CLIENT)', x: 15, y: 50, description: 'Contract authorizer & escrow funding protection.', icon: <User className="w-4 h-4" /> },
            { id: 'arch', label: 'ANANYA (ARCHITECT)', x: 50, y: 20, description: 'Blueprints, 3D room elevations.', icon: <Sparkles className="w-4 h-4" />, cta: 'Send Message', ctaView: 'messages' },
            { id: 'cont', label: 'RIPON (CONTRACTOR)', x: 50, y: 50, description: 'Site concrete pours & structure assembly.', icon: <Wrench className="w-4 h-4" />, cta: 'Send Message', ctaView: 'messages' },
            { id: 'eng', label: 'SARAH (ENGINEER)', x: 50, y: 80, description: 'Seismic calculations & soil bearing reviews.', icon: <Layers className="w-4 h-4" />, cta: 'Send Message', ctaView: 'messages' },
            { id: 'project', label: 'KITCHEN RENOVATION', x: 85, y: 50, description: 'Contract works target: 250 sq.ft modular kitchen.', icon: <Briefcase className="w-4 h-4" /> }
          ],
          links: [
            { from: 'client', to: 'arch', animated: true },
            { from: 'client', to: 'cont', animated: true },
            { from: 'client', to: 'eng' },
            { from: 'arch', to: 'project', animated: true },
            { from: 'cont', to: 'project', animated: true },
            { from: 'eng', to: 'project' }
          ]
        };

      case 'ai-estimator':
        return {
          nodes: [
            { id: 'input', label: 'INPUT SPECS', x: 15, y: 50, description: 'Builtup area, floors, type, finish quality standard.', icon: <FileText className="w-4 h-4" /> },
            { id: 'engine', label: 'AI ANALYSIS', x: 50, y: 50, description: 'Estimate costs across excavation, masonry, structural & finishes.', icon: <Cpu className="w-4 h-4" /> },
            { id: 'out1', label: 'BOQ REPORT', x: 85, y: 25, description: 'Itemized material sheets (cement, brick volumes).', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'out2', label: 'AI OPTIMIZATIONS', x: 85, y: 75, description: 'Fly-ash cement & AAC block saving recommendations.', icon: <Sparkles className="w-4 h-4" /> }
          ],
          links: [
            { from: 'input', to: 'engine', animated: true },
            { from: 'engine', to: 'out1', animated: true },
            { from: 'engine', to: 'out2', animated: true }
          ]
        };

      case 'defect-scanner':
        return {
          nodes: [
            { id: 'photo', label: 'Snapshot Upload', x: 15, y: 50, description: 'Site crack snaps or concrete deteriorations.', icon: <Layers className="w-4 h-4" /> },
            { id: 'scan', label: 'AI Image Scan', x: 50, y: 50, description: 'Visual pattern recognition analyzes crack shapes.', icon: <Cpu className="w-4 h-4" /> },
            { id: 'result', label: 'Diagnostic checklist', x: 85, y: 50, description: 'Risk categorization and engineer assessment warning.', icon: <CheckCircle2 className="w-4 h-4" /> }
          ],
          links: [
            { from: 'photo', to: 'scan', animated: true },
            { from: 'scan', to: 'result', animated: true }
          ]
        };

      case 'ai-studio':
        return {
          nodes: [
            { id: 'room', label: 'Room Snaps', x: 15, y: 50, description: 'Upload raw room or select design space layout.', icon: <FileText className="w-4 h-4" /> },
            { id: 'style', label: 'Finish presets', x: 50, y: 25, description: 'Matte, Gloss finish, Solid wood, MDF parameters.', icon: <Wrench className="w-4 h-4" /> },
            { id: 'render', label: 'AI Neural Render', x: 50, y: 75, description: 'Generates room style transfer visualization drafts.', icon: <Cpu className="w-4 h-4" /> },
            { id: 'compare', label: 'Split Slider View', x: 85, y: 50, description: 'Interact with before/after sliding preview.', icon: <Eye className="w-4 h-4" /> }
          ],
          links: [
            { from: 'room', to: 'style', animated: true },
            { from: 'room', to: 'render', animated: true },
            { from: 'style', to: 'compare' },
            { from: 'render', to: 'compare', animated: true }
          ]
        };

      case 'marketplace':
        return {
          nodes: [
            { id: 'need', label: 'Project Spec', x: 10, y: 50, description: 'Post construction, landscape, or structure analysis files.', icon: <FileText className="w-4 h-4" /> },
            { id: 'match', label: 'Matchmaking Engine', x: 35, y: 50, description: 'Filters expert database by region and certifications.', icon: <Cpu className="w-4 h-4" /> },
            { id: 'pro', label: 'Select Expert', x: 60, y: 50, description: 'Inspect professional profile ratings & reviews.', icon: <User className="w-4 h-4" /> },
            { id: 'hire', label: 'Escrow Signoff', x: 85, y: 50, description: 'Book consultation and initialize active contracts.', icon: <DollarSign className="w-4 h-4" /> }
          ],
          links: [
            { from: 'need', to: 'match', animated: true },
            { from: 'match', to: 'pro', animated: true },
            { from: 'pro', to: 'hire', animated: true }
          ]
        };

      case 'homecare':
        return {
          nodes: [
            { id: 'done', label: 'Project Completed', x: 15, y: 50, description: 'Handover complete and audited by client.', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'care', label: 'Post-Build Care', x: 50, y: 50, description: 'Register property parameters inside Home Care catalog.', icon: <Wrench className="w-4 h-4" /> },
            { id: 'req', label: 'Ticket Repair', x: 85, y: 50, description: 'Plumbing, electrical, and structural maintenance tickets.', icon: <AlertTriangle className="w-4 h-4" /> }
          ],
          links: [
            { from: 'done', to: 'care', animated: true },
            { from: 'care', to: 'req', animated: true }
          ]
        };

      default:
        return { nodes: [], links: [] };
    }
  };

  const { nodes, links } = getGraphData();

  // Helper: Get node by ID
  const getNode = (id: string) => nodes.find(n => n.id === id);

  // Render SVG links with animation
  const renderLinks = () => {
    return links.map((link, idx) => {
      const fromNode = getNode(link.from);
      const toNode = getNode(link.to);

      if (!fromNode || !toNode) return null;

      // Map percentage to pixels
      const x1 = (fromNode.x / 100) * dimensions.width;
      const y1 = (fromNode.y / 100) * dimensions.height;
      const x2 = (toNode.x / 100) * dimensions.width;
      const y2 = (toNode.y / 100) * dimensions.height;

      // Draw curve or straight lines
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const pathData = `M ${x1} ${y1} Q ${midX} ${midY - 15} ${x2} ${y2}`;

      // Check if linked nodes are active/highlighted
      const isHighlighted = hoveredNodeId === link.from || hoveredNodeId === link.to;
      const isDimmed = hoveredNodeId && hoveredNodeId !== link.from && hoveredNodeId !== link.to;

      return (
        <g key={idx}>
          <path
            d={pathData}
            stroke={isHighlighted ? '#F97316' : '#E2E8F0'}
            strokeWidth={isHighlighted ? 2 : 1.5}
            fill="none"
            opacity={isDimmed ? 0.3 : 1}
            className="transition-all duration-300"
          />
          {/* Flowing dashed overlay to represent data flow/movement */}
          {(link.animated || isHighlighted) && (
            <path
              d={pathData}
              stroke="#F97316"
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="6,8"
              opacity={isDimmed ? 0.2 : 0.8}
              className="flowing-particles"
            />
          )}
        </g>
      );
    });
  };

  const handleNodeClick = (node: GraphNode) => {
    if (!interactive) return;
    if (node.ctaView) {
      if (node.ctaView.startsWith('/')) {
        navigate(node.ctaView);
      } else if (onNodeClick) {
        onNodeClick(node.ctaView);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#FAFAFA] border border-slate-200/80 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-between" ref={containerRef}>
      {/* CSS Keyframes for dashed line flow */}
      <style>{`
        @keyframes flowDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .flowing-particles {
          animation: flowDash 2.5s infinite linear;
        }
      `}</style>

      {/* SVG Canvas layer */}
      <svg className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        {dimensions.width > 0 && renderLinks()}
      </svg>

      {/* Nodes list */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {nodes.map((node) => {
          const isHovered = hoveredNodeId === node.id;
          const isConnected = links.some(l => 
            (l.from === hoveredNodeId && l.to === node.id) || 
            (l.to === hoveredNodeId && l.from === node.id)
          );
          const isDimmed = hoveredNodeId && hoveredNodeId !== node.id && !isConnected;

          // Color customization depending on milestone statuses
          let borderClass = 'border-slate-200 bg-white text-slate-700 hover:border-primary';
          if (node.status === 'Completed') borderClass = 'border-green-300 bg-green-50 text-green-700';
          else if (node.status === 'In Progress') borderClass = 'border-[#FED7AA] bg-[#FFF7ED] text-[#EA580C] animate-pulse';
          else if (node.status === 'Delayed') borderClass = 'border-red-300 bg-red-50 text-red-700';

          if (isHovered) {
            borderClass = 'border-primary bg-white text-primary scale-105 shadow-md';
          }

          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto border rounded-2xl px-3 py-2 flex items-center space-x-2 text-xs font-bold shadow-sm transition-all duration-300 ${borderClass}`}
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                opacity: isDimmed ? 0.35 : 1
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => handleNodeClick(node)}
            >
              <span className="p-1 rounded-lg bg-slate-50">{node.icon}</span>
              <span className="truncate max-w-[120px] uppercase tracking-wider">{node.label}</span>
            </div>
          );
        })}
      </div>

      {/* Hover Popup Overlay */}
      {hoveredNodeId && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs z-30 p-4 bg-white/95 backdrop-blur-sm border border-slate-250 rounded-2xl shadow-xl animate-in slide-in-from-bottom duration-200">
          {(() => {
            const node = getNode(hoveredNodeId);
            if (!node) return null;
            return (
              <div className="space-y-1.5 text-xs font-bold text-slate-500">
                <span className="text-[10px] text-primary font-black uppercase tracking-wider block">{node.label}</span>
                <p className="text-brandDark-black leading-relaxed font-semibold">{node.description}</p>
                {node.cta && (
                  <span className="text-[9px] text-primary uppercase font-black tracking-widest block mt-2 flex items-center space-x-0.5">
                    <span>{node.cta}</span>
                    <ChevronRightIcon className="w-3 h-3" />
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Technical diagram border markings */}
      <div className="absolute top-2 left-3 text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest pointer-events-none">
        BuildPilot Connected Ecosystem Map v1.2
      </div>
    </div>
  );
};

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
