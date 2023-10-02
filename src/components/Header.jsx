import { useState } from "react";
import Loadable from "@loadable/component"

// Loadable skips loading TldrawWrapper at build time and loads it asynchronously at run time. See:
// https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-4-load-client-side-dependent-components-with-loadable-components
const LoadableWhiteboard = Loadable(() => import("./whiteboard"))

export default function Header({ title }) {
  return (
    <header className="relative border-b-8 [border-image:url(line-6-tidy.svg)_10_6_10_6_stretch_stretch]">
      <h1 className="z-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-cursive text-8xl">
        {title}
      </h1>

      <div className="h-96">
        <LoadableWhiteboard />
      </div>
    </header>
  );
}

