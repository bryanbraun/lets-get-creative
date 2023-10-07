import { useState, useEffect } from "react";
import EditButton from "./EditButton";
import PageTitle from "./PageTitle";
import Loadable from "@loadable/component"

// Loadable skips loading the whiteboard at build time and loads it asynchronously at run time. See:
// https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-4-load-client-side-dependent-components-with-loadable-components
const LoadableWhiteboard = Loadable(() => import("./whiteboard"))

export default function Header({ title }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }

  // Randomize favicon on page load. I put it here because it's the top-level React component.
  useEffect(() => {
    const NUMBER_OF_FAVICONS = 5;
    const num = Math.floor(Math.random() * NUMBER_OF_FAVICONS);
    const faviconEl = document.getElementById('favicon');
    faviconEl.href = `favicon-${num}.svg`;
  }, []);

  return (
    <header className="relative overflow-hidden bg-whiteboard border-b-8 [border-image:url(ink-border.svg)_10_6_10_6_stretch_stretch]">
      {!isEditing && (
        <PageTitle title={title} />
      )}

      <div className="h-whiteboard">
        <LoadableWhiteboard isEditing={isEditing} />
      </div>

      <div className="z-edit-button absolute bottom-2 right-2 bg-white border border-border-gray rounded-full">
        <EditButton isEditing={isEditing} handleClick={toggleEditing} />
      </div>
    </header>
  );
}

