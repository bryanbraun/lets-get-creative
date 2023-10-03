import * as React from 'react'
import { Editor } from './components/editor'
import { Controls } from './components/controls'
import { Panel } from './components/panel'
import { useKeyboardShortcuts, useRecenterContentOnWindowResize } from './hooks'
import styles from './app.module.css';

function App(): JSX.Element {
  useKeyboardShortcuts()
  useRecenterContentOnWindowResize()

  return (
    <div id="whiteboard" className={styles.app}>
      <Editor />
      <Controls />
      <Panel />
    </div>
  )
}

export default App
