import { Tldraw } from '@tldraw/tldraw'

// Eventually, I think I'll need to switch from importing editor.css
// and ui.css to tldraw.css, per the recent release notes:
// https://github.com/tldraw/tldraw/releases/tag/v2.0.0-alpha.13
// import '@tldraw/tldraw/tldraw.css'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'

export default function TldrawWrapper () {
  return (
    <div className="tldraw__editor">
      <Tldraw persistenceKey="tldraw_example" autoFocus />
    </div>
  );
}
