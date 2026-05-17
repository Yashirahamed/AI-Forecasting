export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type AlertType = 'storm' | 'heatwave' | 'flood' | 'frost' | 'cyclone' | 'earthquake'

export interface WeatherAlert {
  id: string
  city: string
  type: AlertType
  severity: AlertSeverity
  message: string | null
  ai_checklist: string[]
  is_active: boolean
  created_at: string
}

export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  LOW: '#34d399',
  MEDIUM: '#fbbf24',
  HIGH: '#f97316',
  CRITICAL: '#f87171',
}

export const ALERT_ICONS: Record<AlertType, string> = {
  storm: '⛈️',
  heatwave: '🌡️',
  flood: '🌊',
  frost: '❄️',
  cyclone: '🌀',
  earthquake: '🫨',
}
