import { Editor } from './components/Editor/Editor'
import { DevPanel } from './components/DevPanel/DevPanel'
import { Controls } from './components/Controls/Controls'
import { useKeyboardShortcuts, useRecenterContentOnWindowResize } from './hooks'
import styles from './Whiteboard.module.css';

interface WhiteboardProps {
  isEditing: boolean;
}

export function Whiteboard({ isEditing }: WhiteboardProps): JSX.Element {
  useKeyboardShortcuts()
  useRecenterContentOnWindowResize()

  return (
    <div id="whiteboard" className={styles.whiteboard}>
      <Editor />
      {isEditing && (<DevPanel />)}
      {isEditing && (<Controls />)}
    </div>
  )
}
