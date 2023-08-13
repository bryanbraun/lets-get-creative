import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export default function TldrawWrapper () {
  return (
    <Tldraw persistenceKey="tldraw_example" autoFocus />
  );
}
