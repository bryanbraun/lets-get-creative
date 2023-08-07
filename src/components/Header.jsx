import Carousel from "nuka-carousel";
import Loadable from "@loadable/component"

// Loadable skips loading TldrawWrapper at build time and loads it asynchronously at run time. See:
// https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-4-load-client-side-dependent-components-with-loadable-components
const LoadableTldrawWrapper = Loadable(() => import("./TldrawWrapper"))

export default function Header() {
  return (
    <header className="border-b-8 [border-image:url(line-6-tidy.svg)_10_6_10_6_stretch_stretch]">
      <Carousel dragging={false} >
        <div className="relative">
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-cursive text-8xl">
            Let's Get Creative
          </h1>
          <img src="sample-background.jpg" />
        </div>
        <div>
          {<LoadableTldrawWrapper />}
        </div>
      </Carousel>
    </header>
  );
}
