interface Window {
  umami?: {
    track: (event: string, data: Record<string, any>) => void;
    identify: (id?: string, data: Record<string, any>) => void;
  };
}
