import { useState } from "react";
import Carousel from "nuka-carousel";
import Loadable from "@loadable/component"

// Loadable skips loading TldrawWrapper at build time and loads it asynchronously at run time. See:
// https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-4-load-client-side-dependent-components-with-loadable-components
const LoadableTldrawWrapper = Loadable(() => import("./TldrawWrapper"))

const headerImages = [
  {
    src: "sample-background.jpg",
  },
  {
    src: "sample-background.jpg",
  },
  {
    src: "sample-background.jpg",
  }
];


export default function Header({ title }) {
  const [isLastSlide, setIsLastSlide] = useState(false);
  const CAROUSEL_HEIGHT = {"height":"400px"};
  const slideImageStyles = { ...CAROUSEL_HEIGHT, width: "100%", objectFit: "cover"};

  const onSlideChange = (slideIndex) => {
    setIsLastSlide(slideIndex === headerImages.length);
  };

  return (
    <header className="relative border-b-8 [border-image:url(line-6-tidy.svg)_10_6_10_6_stretch_stretch]">
      {!isLastSlide && (
        <h1 className="z-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-cursive text-8xl">
          {title}
        </h1>
      )}

      <Carousel
        dragging={false}
        style={CAROUSEL_HEIGHT}
        afterSlide={onSlideChange}
        renderBottomCenterControls={() => null}
      >
        {headerImages.map(image => (
          <img src={`headers/${image.src}`} style={slideImageStyles} key={image.src} />
        ))}
        <div style={CAROUSEL_HEIGHT}>
          {<LoadableTldrawWrapper />}
        </div>
      </Carousel>
    </header>
  );
}

