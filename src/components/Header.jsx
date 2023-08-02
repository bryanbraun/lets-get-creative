import Carousel from "nuka-carousel";
import { Tldraw } from '@tldraw/tldraw'

// Eventually, I think I'll need to switch from importing editor.css
// and ui.css to tldraw.css, per the recent release notes:
// https://github.com/tldraw/tldraw/releases/tag/v2.0.0-alpha.13
// import '@tldraw/tldraw/tldraw.css'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'

function TldrawWrapper () {
  return (
    <div className="tldraw__editor">
      <Tldraw persistenceKey="tldraw_example" autoFocus />
    </div>
  );
}


export default function Header() {
  return (
    <header className="border-b-8 [border-image:url(line-6-tidy.svg)_10_6_10_6_stretch_stretch]">
      <Carousel>
        <div>
          <h1 className="text-center">Let's Get Creative</h1>
          <img src="sample-background.jpg" />
        </div>
        <TldrawWrapper />
      </Carousel>
    </header>
  );
}
