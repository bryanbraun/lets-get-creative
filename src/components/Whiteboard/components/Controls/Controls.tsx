import * as React from 'react'
import styles from './Controls.module.css'
import { app, useAppState } from '../../state'
import { ColorBar } from './components/ColorBar'
import { Menu } from './components/Menu'

export function Controls() {
  const { style, tool } = useAppState((s) => s.appState)

  const handleFillColorChange = React.useCallback((color: string) => {
    app.patchStyle({ fill: color })
  }, [])

  return (
    <>
        {/* Code to add support for draw/erase modes. Not functional in the original perfect-freehand tool. */}
        {/*
          <div className={[styles.control, styles.bottom, styles.left].join(' ')}>
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
          </div>
        */}
      <div className={[styles.control, styles.leftCenter].join(' ')}>
        <ColorBar
          selectedColor={style.fill}
          onChange={handleFillColorChange}
        />
      </div>
      <div className={[styles.control, styles.bottomCenter].join(' ')}>
        <Menu />
      </div>
    </>
  )
}
