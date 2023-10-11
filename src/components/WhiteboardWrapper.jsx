import { useState, useEffect } from "react";
import EditButton from "./EditButton";
import Whiteboard from "./whiteboard";

export default function WhiteboardWrapper({ baseUrl }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }

  // Randomize favicon on page load. I put it here because it's the top-level React component.
  useEffect(() => {
    const NUMBER_OF_FAVICONS = 5;
    const num = Math.floor(Math.random() * NUMBER_OF_FAVICONS);
    const faviconEl = document.getElementById('favicon');
    faviconEl.href = `${baseUrl}/favicon-${num}.svg`;
  }, []);

  // I know this is janky but if I alter the title as a side effect from here,
  // I can keep it external to this component, which lets me server-render it.
  // That's important for SEO, screen readers, etc.
  useEffect(() => {
    const titleEl = document.getElementById('page-title');
    if (isEditing) {
      titleEl.classList.add('page-title--is-hidden');
    } else {
      titleEl.classList.remove('page-title--is-hidden');
    }
  }, [isEditing]);

  return (
    <>
      <div>
        <Whiteboard isEditing={isEditing} />
      </div>

      <div className="z-edit-button absolute bottom-2 right-2 bg-white border border-border-gray rounded-full">
        <EditButton isEditing={isEditing} handleClick={toggleEditing} />
      </div>
    </>
  );
}

