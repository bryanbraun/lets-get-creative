import { Editor } from './components/editor'
import { DevPanel } from './components/dev-panel'
import { Controls } from './components/controls'
import { useKeyboardShortcuts, useRecenterContentOnWindowResize } from './hooks'
import styles from './whiteboard.module.css';

function Whiteboard({ isEditing }): JSX.Element {
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

export default Whiteboard
