// ─── KAI Mobile App Domain Types ─────────────────────────────────────────────

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type WorkOrderStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked'
export type AlertSeverity = 'critical' | 'warning' | 'info'
export type IncidentCategory = 'safety' | 'sanitation' | 'equipment' | 'structural' | 'security'
export type WorkOrderCategory = 'corrective' | 'preventive' | 'emergency' | 'inspection'
export type StationStatus = 'nominal' | 'degraded' | 'critical'

export interface City {
  id: string
  name: string
  state: string
  score: number
  stations: number
  activeIncidents: number
  openWorkOrders: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

export interface AppStation {
  id: string
  name: string
  shortName: string
  line: string
  lineColor: string
  score: number
  status: StationStatus
  safetyScore: number
  cleanlinessScore: number
  maintenanceScore: number
  activeIncidents: number
  openWorkOrders: number
  location: string
  lastInspected: string
  lat: number
  lng: number
}

export interface Incident {
  id: string
  title: string
  description: string
  priority: Priority
  status: IncidentStatus
  stationId: string
  stationName: string
  category: IncidentCategory
  reportedBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  notes: string[]
}

export interface WorkOrder {
  id: string
  title: string
  description: string
  priority: Priority
  status: WorkOrderStatus
  stationId: string
  stationName: string
  category: WorkOrderCategory
  assignedTo?: string
  assignedTeam?: string
  createdAt: string
  dueAt: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  notes: string[]
}

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: TaskStatus
  assignedTo: string
  workOrderId?: string
  incidentId?: string
  stationId: string
  stationName: string
  dueAt: string
  completedAt?: string
  notes?: string
  photoRequired: boolean
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: AlertSeverity
  stationId: string
  stationName: string
  category: string
  createdAt: string
  acknowledged: boolean
  acknowledgedBy?: string
}

export interface KPI {
  label: string
  value: string | number
  unit?: string
  trend: 'up' | 'down' | 'stable'
  trendValue?: string
  positiveDirection: 'up' | 'down'
}
