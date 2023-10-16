import * as React from 'react'
import styles from './Menu.module.css'
import { app } from '../../../../state'

function DeleteSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" aria-hidden="true">
      <path fill="#1d1d1d" d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
  )
}

function UndoSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" aria-hidden="true">
      <path fill="#1d1d1d" d="M320-200q-17 0-28.5-11.5T280-240q0-17 11.5-28.5T320-280h244q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l76 76q11 11 11 28t-11 28q-11 11-28 11t-28-11L188-572q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l144-144q11-11 28-11t28 11q11 11 11 28t-11 28l-76 76h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H320Z"/>
    </svg>
  )
}

function RedoSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" aria-hidden="true">
      <path fill="#1d1d1d" d="M648-560H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h244q17 0 28.5 11.5T680-240q0 17-11.5 28.5T640-200H396q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252l-76-76q-11-11-11-28t11-28q11-11 28-11t28 11l144 144q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L628-428q-11 11-28 11t-28-11q-11-11-11-28t11-28l76-76Z"/>
    </svg>
  )
}

function DownloadSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" aria-hidden="true">
      <path fill="#1d1d1d" d="M480-337q-8 0-15-2.5t-13-8.5L308-492q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T365-549l75 75v-286q0-17 11.5-28.5T480-800q17 0 28.5 11.5T520-760v286l75-75q12-12 28.5-11.5T652-548q11 12 11.5 28T652-492L508-348q-6 6-13 8.5t-15 2.5ZM240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Z"/>
    </svg>
  )
}

export function Menu() {
  return (
    <>
      <div
        className={styles.menu}
      >
        <button onClick={app.undo} title="Undo">
          <UndoSvg />
          <span className={styles.visuallyHidden}>Undo</span>
        </button>
        <button onClick={app.redo} title="Redo">
          <RedoSvg />
          <span className={styles.visuallyHidden}>Redo</span>
        </button>
        <button onClick={app.resetDoc} title="Erase All">
          <DeleteSvg />
          <span className={styles.visuallyHidden}>Erase All</span>
        </button>
        <button onClick={app.downloadSvg} title="Download">
          <DownloadSvg />
          <span className={styles.visuallyHidden}>Download</span>
        </button>
      </div>
    </>
  )
}

