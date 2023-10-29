import type { DrawShape } from "../types";
import type { TLBounds } from '@tldraw/core';

function cross(x: number[], y: number[], z: number[]): number {
  return (y[0] - x[0]) * (z[1] - x[1]) - (z[0] - x[0]) * (y[1] - x[1]);
}

export function pointInPolygon(p: number[], points: number[][]): boolean {
  let wn = 0; // winding number

  points.forEach((a, i) => {
    const b = points[(i + 1) % points.length];
    if (a[1] <= p[1]) {
      if (b[1] > p[1] && cross(a, b, p) > 0) {
        wn += 1;
      }
    } else if (b[1] <= p[1] && cross(a, b, p) < 0) {
      wn -= 1;
    }
  });

  return wn !== 0;
}

export function getSvgString(shapes:DrawShape[], bounds: TLBounds) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const padding = 40;

  shapes.forEach(shape => {
    const fillElm = document.getElementById('path_' + shape.id);

    if (!fillElm) return;

    const fillClone = fillElm.cloneNode(false) as SVGPathElement;

    const strokeElm = document.getElementById('path_stroke_' + shape.id);

    if (strokeElm) {
      // Create a new group
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      // Translate the group to the shape's point
      g.setAttribute(
        'transform',
        `translate(${shape.point[0]}, ${shape.point[1]})`
      );

      // Clone the stroke element
      const strokeClone = strokeElm.cloneNode(false) as SVGPathElement;

      // Append both the stroke element and the fill element to the group
      g.appendChild(strokeClone);
      g.appendChild(fillClone);

      // Append the group to the SVG
      svg.appendChild(g);
    } else {
      // Translate the fill clone and append it to the SVG
      fillClone.setAttribute(
        'transform',
        `translate(${shape.point[0]}, ${shape.point[1]})`
      );

      svg.appendChild(fillClone);
    }
  });

  // Resize the element to the bounding box
  svg.setAttribute(
    'viewBox',
    [
      bounds.minX - padding,
      bounds.minY - padding,
      bounds.width + padding * 2,
      bounds.height + padding * 2,
    ].join(' ')
  );

  svg.setAttribute('width', String(bounds.width));
  svg.setAttribute('height', String(bounds.height));

  const s = new XMLSerializer();

  const svgString = s
    .serializeToString(svg)
    .replaceAll('&#10;      ', '') // remove newlines and indentation
    .replaceAll(/((\s|")[0-9]*\.[0-9]{2})([0-9]*)(\b|"|\))/g, '$1'); // truncate numbers down to two decimal points

  return svgString;
}

export function copyTextToClipboard(string: string) {
  try {
    navigator.clipboard.writeText(string);
  } catch (e) {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('position', 'fixed');
    textarea.setAttribute('top', '0');
    textarea.setAttribute('readonly', 'true');
    textarea.setAttribute('contenteditable', 'true');
    textarea.style.position = 'fixed';
    textarea.value = string;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      if (!sel) return;

      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
    } catch (err) {
      console.warn('Could not copy to clipboard');
      null; // Could not copy to clipboard
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// Use css variable dimensions, if they exist. Otherwise fall back to the window dimensions. This allows for non-fullscreen whiteboards.
export function getAppWidth() {
  return parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--whiteboard-width')) || window.innerWidth;
}

export function getAppHeight() {
  return parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--whiteboard-height')) || window.innerHeight;
}
