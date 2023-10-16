// We want Whiteboard to act as a modular, independent component, being
// consumed by the rest of the app. Thus, we keep a barrel file here so
// we can control its API more easily. We'll avoid barrel files for the
// components internal to Whiteboard for the reasons described here:
// https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/

export { Whiteboard } from './Whiteboard';
