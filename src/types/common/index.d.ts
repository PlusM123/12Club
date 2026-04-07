interface Window {
  umami?: {
    track: (event: string, data: Record<string, unknown>) => void
    identify: (unique_id?: string, data: Record<string, unknown>) => void
  }
}
