import type { Template } from '@/types';

export const templates: Template[] = [
  { id: 'sip', name: 'SIP Investment Proposal', category: 'Finance', icon: 'TrendingUp', description: 'Comprehensive systematic investment plan proposal with projections and analysis', prompt: 'Create a SIP Investment Proposal with portfolio analysis, projected returns, risk assessment, and comparison strategies', color: '#10b981' },
  { id: 'financial', name: 'Financial Dashboard', category: 'Finance', icon: 'DollarSign', description: 'Complete financial overview with revenue, expenses, and profitability metrics', prompt: 'Create a Financial Dashboard showing revenue growth, expense breakdown, profit margins, and key financial KPIs', color: '#2563eb' },
  { id: 'sales', name: 'Sales Report', category: 'Sales', icon: 'BarChart3', description: 'Sales performance metrics, pipeline analysis, and conversion tracking', prompt: 'Create a Sales Dashboard for Q3 with performance metrics, pipeline analysis, team performance, and regional breakdown', color: '#f59e0b' },
  { id: 'marketing', name: 'Marketing Campaign', category: 'Marketing', icon: 'Megaphone', description: 'Campaign performance, ROI analysis, and channel effectiveness', prompt: 'Create a Marketing Campaign Report with channel performance, ROI analysis, audience metrics, and campaign timeline', color: '#ec4899' },
  { id: 'healthcare', name: 'Healthcare Analytics', category: 'Healthcare', icon: 'Heart', description: 'Patient metrics, operational efficiency, and health outcomes', prompt: 'Create a Healthcare Analytics Dashboard with patient outcomes, operational metrics, resource utilization, and quality indicators', color: '#ef4444' },
  { id: 'hr', name: 'HR Analytics', category: 'HR', icon: 'Users', description: 'Workforce analytics, engagement metrics, and talent management', prompt: 'Create an HR Analytics Dashboard with employee engagement, retention metrics, hiring pipeline, and performance reviews', color: '#8b5cf6' },
  { id: 'product', name: 'Product Roadmap', category: 'Business', icon: 'Rocket', description: 'Product development timeline, milestones, and feature priorities', prompt: 'Create a Product Roadmap with quarterly milestones, feature priorities, team allocations, and launch timeline', color: '#06b6d4' },
  { id: 'startup', name: 'Startup Pitch Deck', category: 'Startup', icon: 'Zap', description: 'Investor-ready pitch with market opportunity and financial projections', prompt: 'Create a Startup Pitch Deck covering problem, solution, market size, business model, traction, team, and funding ask', color: '#f97316' },
  { id: 'education', name: 'Education Report', category: 'Education', icon: 'GraduationCap', description: 'Academic performance metrics and educational analytics', prompt: 'Create an Education Analytics Report with student performance, attendance trends, course completion rates, and learning outcomes', color: '#14b8a6' },
  { id: 'retail', name: 'Retail Analytics', category: 'Retail', icon: 'ShoppingBag', description: 'Sales trends, inventory management, and customer insights', prompt: 'Create a Retail Analytics Dashboard with sales trends, inventory status, customer segments, and store performance', color: '#a855f7' },
  { id: 'operations', name: 'Operations Dashboard', category: 'Operations', icon: 'Settings', description: 'Operational efficiency, process metrics, and resource utilization', prompt: 'Create an Operations Dashboard with efficiency metrics, process flows, resource allocation, and performance indicators', color: '#64748b' },
  { id: 'customer', name: 'Customer Analytics', category: 'Analytics', icon: 'UserCheck', description: 'Customer behavior, satisfaction, and retention analytics', prompt: 'Create a Customer Analytics Dashboard with behavior patterns, satisfaction scores, churn analysis, and lifetime value', color: '#0891b2' },
];

export const suggestedPrompts = [
  'Create a SIP Investment Proposal',
  'Sales Dashboard for Q3',
  'Healthcare Analytics Report',
  'Startup Pitch Deck',
  'Marketing Campaign Analysis',
  'HR Performance Dashboard',
  'Financial Year Review',
  'Product Launch Roadmap',
];
