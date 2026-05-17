// Missing alert.types for backend
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
