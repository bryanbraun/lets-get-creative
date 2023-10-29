import { useHotkeys } from 'react-hotkeys-hook';
import { app } from '../state';

export function useKeyboardShortcuts() {
  useHotkeys('meta+z,ctrl+z', () => {
    app.undo();
  });

  useHotkeys('meta+shift+z,ctrl+shift+z', () => {
    app.redo();
  });

  useHotkeys('meta+c,ctrl+c', () => {
    app.copySvg();
  });

  useHotkeys('meta+,|ctrl+,', (e) => {
    e.preventDefault();
    app.togglePanelOpen();
  }, { splitKey: '|'});

  useHotkeys('meta+shift+c,ctrl+shift+c', () => {
    app.copyStyles();
  });

  useHotkeys('e,backspace', () => {
    app.resetDoc();
  });
}
