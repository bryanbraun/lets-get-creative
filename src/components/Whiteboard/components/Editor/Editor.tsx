import * as React from 'react'
import { Renderer } from '@tldraw/core'
import { app, useAppState } from '../../state'
import styles from './Editor.module.css'

export function Editor(): JSX.Element {
  const {
    onPinch,
    onPinchStart,
    onPinchEnd,
    onPan,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shapeUtils,
  } = app
  const { page, pageState } = useAppState()

  return (
    <div className={styles.editor} aria-hidden="true">
      <Renderer
        page={page}
        pageState={pageState}
        shapeUtils={shapeUtils}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPinch={onPinch}
        onPinchStart={onPinchStart}
        onPinchEnd={onPinchEnd}
        onPan={onPan}
      />
    </div>
  )
}
