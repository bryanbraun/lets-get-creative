import { useEffect } from 'react';
import { app } from '../state';

export function useRecenterContentOnWindowResize() {
  useEffect(() => {
    window.addEventListener('resize', () => {
      app.zoomToContent();
    });
  }, []);
}
