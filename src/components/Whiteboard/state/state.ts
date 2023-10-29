import * as React from 'react'
import type { Doc, DrawShape, DrawStyles, State } from '../types'
import {
  TLPinchEventHandler,
  TLPointerEventHandler,
  TLShapeUtilsMap,
  TLWheelEventHandler,
  Utils,
} from '@tldraw/core'
import { Vec } from '@tldraw/vec'
import { StateManager } from '../state-manager'
import { draw, DrawUtil } from './shapes'
import { copyTextToClipboard, pointInPolygon, getSvgString, getAppWidth, getAppHeight } from './utils'
import { EASING_STRINGS } from './easings'
import bg0 from './background-0.js';
// Unused for now: alternative backgrounds
// import bg1 from './background-1.js';
// import bg2 from './background-2.js';

declare const window: {
  Whiteboard: AppState;
} & Window;

export const shapeUtils: TLShapeUtilsMap<DrawShape> = {
  draw: new DrawUtil(),
}

export const initialDoc: Doc = {
  page: {
    id: 'page',
    shapes: {},
    bindings: {},
  },
  pageState: {
    id: 'page',
    selectedIds: [],
    camera: {
      point: [0, 0],
      zoom: 1,
    },
  },
}

export const defaultStyle: DrawStyles = {
  size: 16,
  strokeWidth: 0,
  thinning: 0.5,
  streamline: 0.5,
  smoothing: 0.5,
  easing: 'linear',
  taperStart: 0,
  taperEnd: 0,
  capStart: true,
  capEnd: true,
  easingStart: 'linear',
  easingEnd: 'linear',
  isFilled: true,
  fill: '#000000',
  stroke: '#000000',
}

export const initialState: State = {
  appState: {
    status: 'idle',
    tool: 'drawing',
    editingId: undefined,
    style: defaultStyle,
    isPanelOpen: false,
  },
  ...initialDoc,
}

export const context = React.createContext<AppState>({} as AppState)

export class AppState extends StateManager<State> {
  constructor(...args: ConstructorParameters<typeof StateManager<State>>) {
    super(...args);

    this.onReady();
  }

  shapeUtils = shapeUtils

  log = false

  currentStroke = {
    startTime: 0,
  }

  override cleanup = (state: State) => {
    for (const id in state.page.shapes) {
      if (!state.page.shapes[id]) {
        // Removes any shapes that that have a falsy (undefined?) value
        delete state.page.shapes[id]
      }
    }

    return state
  }

  onReady = async () => {
    window.Whiteboard = this

    // Unused for now:
    // Randomly select the background image. This probably bloats the bundle size
    // a lot so we should come back in and optimize it later if needed.
    //
    // let backgroundData = [];
    // const NUMBER_OF_BACKGROUNDS = 3;
    // const backgroundNum = Math.floor(Math.random() * NUMBER_OF_BACKGROUNDS);
    // switch (backgroundNum) {
    //   case 0:
    //     backgroundData = bg0;
    //     break;
    //   case 1:
    //     backgroundData = bg1;
    //     break;
    //   case 2:
    //     backgroundData = bg2;
    //     break;
    // }
    const backgroundData = bg0;

    if (Object.values(this.state.page.shapes).length === 0) {
      this.addShapes(backgroundData as Partial<DrawShape>[])
      this.zoomToContent()
    }
  }

  onPointerDown: TLPointerEventHandler = (info) => {
    const { state } = this

    switch (state.appState.tool) {
      case 'drawing': {
        this.createDrawingShape(info.point)
        break
      }
      case 'erasing': {
        this.setSnapshot()
        this.patchState({
          appState: {
            status: 'erasing',
          },
        })
        this.erase(info.point)
        break
      }
    }
  }

  onPointerMove: TLPointerEventHandler = (info, event) => {
    if (event.buttons > 1) return

    const { status, tool } = this.state.appState

    switch (tool) {
      case 'drawing': {
        if (status === 'drawing') {
          const nextShape = this.updateDrawingShape(info.point, info.pressure)
          if (nextShape) {
            this.patchState({
              page: {
                shapes: {
                  [nextShape.id]: nextShape,
                },
              },
            })
          }
        }
        break
      }
      case 'erasing': {
        if (status === 'erasing') {
          this.erase(info.point)
        }
        break
      }
    }
  }

  onPointerUp: TLPointerEventHandler = () => {
    const { state } = this
    switch (state.appState.tool) {
      case 'drawing': {
        this.completeDrawingShape()
        break
      }
      case 'erasing': {
        this.setState({
          before: this.snapshot,
          after: {
            appState: {
              status: 'idle',
            },
            page: {
              shapes: this.state.page.shapes,
            },
          },
        })
        break
      }
    }
  }

  pinchZoom = (point: number[], delta: number[], zoom: number): this => {
    const { camera } = this.state.pageState
    const nextPoint = Vec.sub(camera.point, Vec.div(delta, camera.zoom))
    const nextZoom = zoom
    const p0 = Vec.sub(Vec.div(point, camera.zoom), nextPoint)
    const p1 = Vec.sub(Vec.div(point, nextZoom), nextPoint)

    return this.patchState({
      pageState: {
        camera: {
          point: Vec.round(Vec.add(nextPoint, Vec.sub(p1, p0))),
          zoom: nextZoom,
        },
      },
    })
  }

  onPinchEnd: TLPinchEventHandler = () => {
    this.patchState({
      appState: { status: 'idle' },
    })
  }

  onPinch: TLPinchEventHandler = (info, e) => {
    if (this.state.appState.status !== 'pinching') return
    this.pinchZoom(info.point, info.delta, info.delta[2])
    this.onPointerMove?.(info, e as unknown as React.PointerEvent)
  }

  onPan: TLWheelEventHandler = (info) => {
    const { state } = this
    if (state.appState.status === 'pinching') return this

    const { camera } = state.pageState
    const delta = Vec.div(info.delta, camera.zoom)
    const prev = camera.point
    const next = Vec.sub(prev, delta)

    if (Vec.isEqual(next, prev)) return this

    const point = Vec.round(next)

    if (state.appState.editingId && state.appState.status === 'drawing') {
      const shape = state.page.shapes[state.appState.editingId]
      const nextShape = this.updateDrawingShape(info.point, info.pressure)

      this.patchState({
        pageState: {
          camera: {
            point,
          },
        },
        page: {
          shapes: {
            [shape.id]: nextShape,
          },
        },
      })

      if (nextShape) {
        this.patchState({
          page: {
            shapes: {
              [nextShape.id]: nextShape,
            },
          },
        })
      }
    }

    return this.patchState({
      pageState: {
        camera: {
          point,
        },
      },
    })
  }

  /* --------------------- Methods -------------------- */

  togglePanelOpen = () => {
    const { state } = this
    this.patchState({
      appState: {
        isPanelOpen: !state.appState.isPanelOpen,
      },
    })
  }

  createDrawingShape = (point: number[]) => {
    const { state } = this

    const camera = state.pageState.camera

    const pt = Vec.sub(Vec.div(point, camera.zoom), camera.point)

    const shape = draw.create({
      id: Utils.uniqueId(),
      point: pt,
      style: state.appState.style,
      points: [[0, 0, 0.5, 0]],
      isDone: false,
    })

    this.currentStroke.startTime = Date.now()

    return this.patchState({
      appState: {
        status: 'drawing',
        editingId: shape.id,
      },
      page: {
        shapes: {
          [shape.id]: shape,
        },
      },
    })
  }

  updateDrawingShape = (point: number[], pressure: number) => {
    const { state, currentStroke } = this
    if (state.appState.status !== 'drawing') return
    if (!state.appState.editingId) return

    const shape = state.page.shapes[state.appState.editingId]

    const camera = state.pageState.camera

    const newPoint = [
      ...Vec.sub(
        Vec.round(Vec.sub(Vec.div(point, camera.zoom), camera.point)),
        shape.point
      ),
      pressure,
      Date.now() - currentStroke.startTime,
    ]

    let shapePoint = shape.point

    let shapePoints = [...shape.points, newPoint]

    // Does the new point create a negative offset?
    const offset = [Math.min(newPoint[0], 0), Math.min(newPoint[1], 0)]

    if (offset[0] < 0 || offset[1] < 0) {
      // If so, then we need to move the shape to cancel the offset
      shapePoint = [
        ...Vec.round(Vec.add(shapePoint, offset)),
        shapePoint[2],
        shapePoint[3],
      ]

      // And we need to move the shape points to cancel the offset
      shapePoints = shapePoints.map((pt) =>
        Vec.round(Vec.sub(pt, offset)).concat(pt[2], pt[3])
      )
    }

    return {
      id: shape.id,
      point: shapePoint,
      points: shapePoints,
    }
  }

  completeDrawingShape = () => {
    const { state } = this
    const { shapes } = state.page
    if (!state.appState.editingId) return this // Don't erase while drawing

    let shape = shapes[state.appState.editingId]

    shape.isDone = true

    shape = {
      ...shape,
    }

    return this.setState({
      before: {
        appState: {
          status: 'idle',
          editingId: undefined,
        },
        page: {
          shapes: {
            [shape.id]: undefined,
          },
        },
      },
      after: {
        appState: {
          status: 'idle',
          editingId: undefined,
        },
        page: {
          shapes: {
            [shape.id]: shape,
          },
        },
      },
    })
  }

  centerShape = (id: string) => {
    const shape = this.state.page.shapes[id]
    const bounds = shapeUtils.draw.getBounds(this.state.page.shapes[id])

    this.patchState({
      pageState: {
        camera: {
          point: Vec.add(shape.point, [
            getAppWidth() / 2 - bounds.width / 2,
            getAppHeight() / 2 - bounds.height / 2,
          ]),
          zoom: 1,
        },
      },
    })
  }

  /* Currently Unused */
  replayShape = (points: number[][]) => {
    this.eraseAll()

    const newShape = draw.create({
      id: Utils.uniqueId(),
      parentId: 'page',
      childIndex: 1,
      point: [0, 0],
      points: [],
      style: this.state.appState.style,
    })

    this.patchState({
      page: {
        shapes: {
          [newShape.id]: newShape,
        },
      },
    })

    this.centerShape(newShape.id)

    points
      .map((pt, i) => [...Vec.sub(pt, newShape.point), pt[2], pt[3] || i * 10])
      .forEach((pt, i) => {
        setTimeout(() => {
          this.patchState({
            page: {
              shapes: {
                [newShape.id]: {
                  points: points.slice(0, i),
                },
              },
            },
          })
        }, pt[3] * 20)
      })
  }

  addShapes = (shapesData: Partial<DrawShape>[]) => {
    const shapes: {
      [key: string]: Partial<DrawShape>,
    } = {};

    shapesData.forEach(shapeData => {
      const shape = draw.create({
        id: Utils.uniqueId(),
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        points: [],
        style: this.state.appState.style,
        ...shapeData,
      })

      const bounds = Utils.getBoundsFromPoints(shape.points)
      const topLeft = [bounds.minX, bounds.minY]

      shape.points = shape.points.map((pt, i) =>
        Vec.sub(pt, topLeft).concat(pt[2] || 0.5, pt[3] || i * 10)
      )

      shapes[shape.id] = shape;
    });

    this.patchState({
      page: {
        shapes
      },
    })

    return shapes
  }

  erase = (point: number[]) => {
    const { state } = this
    const camera = state.pageState.camera
    const pt = Vec.sub(Vec.div(point, camera.zoom), camera.point)
    const { getBounds } = shapeUtils.draw

    return this.patchState({
      page: {
        shapes: {
          ...Object.fromEntries(
            Object.entries(state.page.shapes).map(([id, shape]) => {
              const bounds = getBounds(shape)

              if (Vec.dist(pt, shape.point) < 10) {
                return [id, undefined]
              }

              if (Utils.pointInBounds(pt, bounds)) {
                const points = draw.strokeCache.get(shape)

                if (
                  (points &&
                    pointInPolygon(Vec.sub(pt, shape.point), points)) ||
                  Vec.dist(pt, shape.point) < 10
                ) {
                  return [id, undefined]
                }
              }

              return [id, shape]
            })
          ),
        },
      },
    })
  }

  eraseAll = () => {
    const { state } = this
    const { shapes } = state.page

    if (state.appState.editingId) return this // Don't erase while drawing

    return this.setState({
      before: {
        page: {
          shapes,
        },
      },
      after: {
        page: {
          shapes: {},
        },
      },
    })
  }

  startStyleUpdate = () => {
    return this.setSnapshot()
  }

  patchStyleForAllShapes = (style: Partial<DrawStyles>) => {
    const { shapes } = this.state.page

    return this.patchState({
      appState: {
        style,
      },
      page: {
        shapes: {
          ...Object.fromEntries(
            Object.keys(shapes).map((id) => [id, { style }])
          ),
        },
      },
    })
  }

  patchStyle = (style: Partial<DrawStyles>) => {
    return this.patchState({
      appState: {
        style,
      },
    })
  }

  finishStyleUpdate = () => {
    const { state, snapshot } = this
    const { shapes } = state.page

    return this.setState({
      before: snapshot,
      after: {
        appState: {
          style: state.appState.style,
        },
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.entries(shapes).map(([id, { style }]) => [id, { style }])
            ),
          },
        },
      },
    })
  }

  setNextStyleForAllShapes = (style: Partial<DrawStyles>) => {
    const { shapes } = this.state.page

    return this.setState({
      before: {
        appState: {
          style: Object.fromEntries(
            Object.keys(style).map((key) => [
              key,
              this.state.appState.style[key as keyof DrawStyles],
            ])
          ),
        },
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.entries(shapes).map(([id, shape]) => [
                id,
                {
                  style: Object.fromEntries(
                    Object.keys(style).map((key) => [
                      key,
                      shape.style[key as keyof DrawStyles],
                    ])
                  ),
                },
              ])
            ),
          },
        },
      },
      after: {
        appState: {
          style,
        },
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.keys(shapes).map((id) => [id, { style }])
            ),
          },
        },
      },
    })
  }

  resetStyle = (prop: keyof DrawStyles) => {
    const { shapes } = this.state.page
    const { state } = this

    const initialStyle = initialState.appState.style[prop]

    return this.setState({
      before: {
        appState: state.appState,
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.entries(shapes).map(([id, shape]) => [
                id,
                {
                  style: { [prop]: shape.style[prop] },
                },
              ])
            ),
          },
        },
      },
      after: {
        appState: {
          style: { [prop]: initialStyle },
        },
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.keys(shapes).map((id) => [id, { [prop]: initialStyle }])
            ),
          },
        },
      },
    })
  }

  zoomToContent = (): this => {
    const shapes = Object.values(this.state.page.shapes)
    const pageState = this.state.pageState

    if (shapes.length === 0) {
      return this.patchState({
        pageState: {
          camera: {
            zoom: 1,
            point: [0, 0],
          },
        },
      })
    }

    const bounds = Utils.getCommonBounds(
      Object.values(shapes).map(shapeUtils.draw.getBounds)
    )

    const { zoom } = pageState.camera
    const mx = (getAppWidth() - bounds.width * zoom) / 2 / zoom
    const my = (getAppHeight() - bounds.height * zoom) / 2 / zoom
    const point = Vec.round(Vec.add([-bounds.minX, -bounds.minY], [mx, my]))

    return this.patchState({
      pageState: { camera: { point } },
    })
  }

  resetStyles = () => {
    const { shapes } = this.state.page
    const { state } = this

    const currentAppState = state.appState
    const initialAppState = initialState.appState

    return this.setState({
      before: {
        appState: currentAppState,
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.keys(shapes).map((id) => [
                id,
                {
                  style: currentAppState.style,
                },
              ])
            ),
          },
        },
      },
      after: {
        appState: initialAppState,
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.keys(shapes).map((id) => [
                id,
                { style: initialAppState.style },
              ])
            ),
          },
        },
        pageState: {
          camera: {
            zoom: 1,
          },
        },
      },
    })
  }

  copyStyles = () => {
    const { state } = this
    const { style } = state.appState
    copyTextToClipboard(`{
  size: ${style.size},
  smoothing: ${style.smoothing},
  thinning: ${style.thinning},
  streamline: ${style.streamline},
  easing: ${EASING_STRINGS[style.easing].toString()},
  start: {
    taper: ${style.taperStart},
    cap: ${style.capStart},
  },
  end: {
    taper: ${style.taperEnd},
    cap: ${style.capEnd},
  },
}`)
  }

  copyShapes = () => {
    const simpleShapes = Object.values(this.state.page.shapes).map(shape => ({
      id: shape.id,
      point: shape.point,
      points: shape.points,
      style: shape.style,
    }));

    copyTextToClipboard(JSON.stringify(simpleShapes));
  }

  copySvg = () => {
    const shapes = Object.values(this.state.page.shapes)

    if (shapes.length === 0) {
      return
    }

    const bounds = Utils.getCommonBounds(shapes.map(draw.getBounds))
    const svgString = getSvgString(shapes, bounds)

    copyTextToClipboard(svgString)
  }

  downloadSvg = () => {
    const shapes = Object.values(this.state.page.shapes)

    if (shapes.length === 0) {
      return
    }

    const bounds = Utils.getCommonBounds(shapes.map(draw.getBounds))
    const svgString = getSvgString(shapes, bounds)

    const element = document.createElement('a');
    element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
    element.setAttribute('download', 'image.svg');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  resetDoc = () => {
    const { shapes } = this.state.page

    return this.setState({
      before: {
        page: {
          shapes,
        },
      },
      after: {
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.keys(shapes).map((key) => [key, undefined])
            ),
          },
        },
        pageState: {
          camera: {
            point: [0, 0],
            zoom: 1,
          },
        },
      },
    })
  }

  onPinchStart: TLPinchEventHandler = () => {
    if (this.state.appState.status !== 'idle') return

    this.patchState({
      appState: { status: 'pinching' },
    })
  }

  selectDrawingTool = () => {
    this.patchState({
      appState: {
        tool: 'drawing',
      },
    })
  }

  selectErasingTool = () => {
    this.patchState({
      appState: {
        tool: 'erasing',
      },
    })
  }

  // Placeholder for debugging state changes.
  // onStateDidChange = (state => {
  //   console.log('State changed', state)
  // })
}

export const app = new AppState(initialState)

export function useAppState(): State
export function useAppState<K>(selector: (s: State) => K): K
export function useAppState<K>(selector?: (s: State) => K): State | K {
  return selector ? app.useStore(selector) : app.useStore()
}
