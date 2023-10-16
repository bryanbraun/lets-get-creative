import { Editor } from './components/Editor'
import { DevPanel } from './components/DevPanel'
import { Controls } from './components/Controls'
import { useKeyboardShortcuts, useRecenterContentOnWindowResize } from './hooks'
import styles from './Whiteboard.module.css';

export function Whiteboard({ isEditing }): JSX.Element {
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
