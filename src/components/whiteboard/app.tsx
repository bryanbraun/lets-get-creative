import * as React from 'react'
import { Editor } from './components/editor'
import { Controls } from './components/controls'
import { Panel } from './components/panel'
import { useKeyboardShortcuts } from './hooks'
import styles from './app.module.css';

function App(): JSX.Element {
  useKeyboardShortcuts()

  return (
    <div className={styles.app}>
      <Editor />
      <Controls />
      <Panel />
    </div>
  )
}

const AppWrapper: React.FC = () => {
  return <App />
}

export default AppWrapper
