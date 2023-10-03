import * as React from 'react'
import styles from './panel.module.css'
import { app, useAppState } from '../../state'

export function Panel() {
  // const tool = useAppState((s) => s.appState.tool)

  return (
    <>
      <div className={[styles.container, styles.top, styles.left].join(' ')}>
        <a className="px-8" onClick={app.togglePanelOpen}>
          Options
        </a>
      </div>
      <div className={[styles.container, styles.bottom, styles.left].join(' ')}>
        {/* Code to add support for draw/erase modes. Not functional in the original perfect-freehand tool. */}
        {/*
          <button
            onClick={app.selectDrawingTool}
            data-active={tool === 'drawing'}
          >
            Draw
          </button>
          <button
            onClick={app.selectErasingTool}
            data-active={tool === 'erasing'}
          >
            Erase
          </button>
        */}
      </div>
      <div
        className={[styles.container, styles.bottom, styles.right].join(' ')}
      >
        <button onClick={app.undo}>Undo</button>
        <button onClick={app.redo}>Redo</button>
        <button onClick={app.resetDoc}>Clear</button>
      </div>
    </>
  )
}
