import { createStore as createVanilla} from 'zustand/vanilla'
import { create, useStore, StoreApi } from 'zustand'
import { deepCopy } from './copy'
import { merge } from './merge'
import type { Patch, Command } from './types'

export class StateManager<T extends object> {
  /**
   * The initial state.
   */
  private initialState: T

  /**
   * A zustand store that also holds the state.
   */
  private store: StoreApi<T>

  /**
   * The index of the current command.
   */
  protected pointer: number = -1

  /**
   * The current state.
   */
  private _state: T

  /**
   * A stack of commands used for history (undo and redo).
   */
  protected stack: Command<T>[] = []

  /**
   * A snapshot of the current state.
   */
  protected _snapshot: T

  /**
   * A React hook for accessing the zustand store.
   */
  public readonly useStore: (selector?) => T

  constructor(
    initialState: T,
    id?: string,
    version?: number,
    update?: (prev: T, next: T, prevVersion: number) => T
  ) {
    this._state = deepCopy(initialState)
    this._snapshot = deepCopy(initialState)
    this.initialState = deepCopy(initialState)
    this.store = createVanilla(() => this._state)
    this.useStore = (selector) => useStore(this.store, selector)
  }

  /**
   * Apply a patch to the current state.
   * This does not effect the undo/redo stack.
   * @param patch The patch to apply.
   * @param id (optional) An id for the patch.
   */
  private applyPatch = (patch: Patch<T>, id?: string) => {
    const prev = this._state
    const next = merge(this._state, patch)
    const final = this.cleanup(next, prev, patch, id)
    if (this.onStateWillChange) {
      this.onStateWillChange(final, id)
    }
    this._state = final
    this.store.setState(this._state, true)
    if (this.onStateDidChange) {
      this.onStateDidChange(this._state, id)
    }
    return this
  }

  // Internal API ---------------------------------

  /**
   * Perform any last changes to the state before updating.
   * Override this on your extending class.
   * @param nextState The next state.
   * @param prevState The previous state.
   * @param patch The patch that was just applied.
   * @param id (optional) An id for the just-applied patch.
   * @returns The final new state to apply.
   */
  protected cleanup = (nextState: T, prevState: T, patch: Patch<T>, id?: string): T => nextState

  /**
   * A life-cycle method called when the state is about to change.
   * @param state The next state.
   * @param id An id for the change.
   */
  protected onStateWillChange?: (state: T, id?: string) => void

  /**
   * A life-cycle method called when the state has changed.
   * @param state The next state.
   * @param id An id for the change.
   */
  protected onStateDidChange?: (state: T, id?: string) => void

  /**
   * Apply a patch to the current state.
   * This does not effect the undo/redo stack.
   * @param patch The patch to apply.
   * @param id (optional) An id for this patch.
   */
  protected patchState = (patch: Patch<T>, id?: string): this => {
    this.applyPatch(patch, id)
    if (this.onPatch) {
      this.onPatch(this._state, id)
    }
    return this
  }

  /**
   * Replace the current state.
   * This does not effect the undo/redo stack.
   * @param state The new state.
   * @param id An id for this change.
   */
  protected replaceState = (state: T, id?: string): this => {
    const final = this.cleanup(state, this._state, state, id)
    if (this.onStateWillChange) {
      this.onStateWillChange(final, 'replace')
    }
    this._state = final
    this.store.setState(this._state, true)
    if (this.onStateDidChange) {
      this.onStateDidChange(this._state, 'replace')
    }
    return this
  }

  /**
   * Update the state using a Command.
   * This effects the undo/redo stack.
   * @param command The command to apply and add to the undo/redo stack.
   * @param id (optional) An id for this command.
   */
  protected setState = (command: Command<T>, id = command.id) => {
    if (this.pointer < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.pointer + 1)
    }
    this.stack.push({ ...command, id })
    this.pointer = this.stack.length - 1
    this.applyPatch(command.after, id)
    if (this.onCommand) this.onCommand(this._state, id)
    return this
  }

  // Public API ---------------------------------

  /**
   * A callback fired when a patch is applied.
   */
  public onPatch?: (state: T, id?: string) => void

  /**
   * A callback fired when a patch is applied.
   */
  public onCommand?: (state: T, id?: string) => void

  /**
   * A callback fired when the state is replaced.
   */
  public onReplace?: (state: T) => void

  /**
   * A callback fired when the state is reset.
   */
  public onReset?: (state: T) => void

  /**
   * A callback fired when the history is reset.
   */
  public onResetHistory?: (state: T) => void

  /**
   * A callback fired when a command is undone.
   */
  public onUndo?: (state: T) => void

  /**
   * A callback fired when a command is redone.
   */
  public onRedo?: (state: T) => void

  /**
   * Reset the state to the initial state and reset history.
   */
  public reset = () => {
    if (this.onStateWillChange) {
      this.onStateWillChange(this.initialState, 'reset')
    }
    this._state = this.initialState
    this.store.setState(this._state, true)
    this.resetHistory()
    if (this.onStateDidChange) {
      this.onStateDidChange(this._state, 'reset')
    }
    if (this.onReset) {
      this.onReset(this._state)
    }
    return this
  }

  /**
   * Force replace a new undo/redo history. It's your responsibility
   * to make sure that this is compatible with the current state!
   * @param history The new array of commands.
   * @param pointer (optional) The new pointer position.
   */
  public replaceHistory = (history: Command<T>[], pointer = history.length - 1): this => {
    this.stack = history
    this.pointer = pointer
    if (this.onReplace) {
      this.onReplace(this._state)
    }
    return this
  }

  /**
   * Reset the history stack (without resetting the state).
   */
  public resetHistory = (): this => {
    this.stack = []
    this.pointer = -1
    if (this.onResetHistory) {
      this.onResetHistory(this._state)
    }
    return this
  }

  /**
   * Move backward in the undo/redo stack.
   */
  public undo = (): this => {
    if (!this.canUndo) return this
    const command = this.stack[this.pointer]
    this.pointer--
    this.applyPatch(command.before, `undo`)
    if (this.onUndo) this.onUndo(this._state)
    return this
  }

  /**
   * Move forward in the undo/redo stack.
   */
  public redo = (): this => {
    if (!this.canRedo) return this
    this.pointer++
    const command = this.stack[this.pointer]
    this.applyPatch(command.after, 'redo')
    if (this.onRedo) this.onRedo(this._state)
    return this
  }

  /**
   * Save a snapshot of the current state, accessible at `this.snapshot`.
   */
  public setSnapshot = (): this => {
    this._snapshot = { ...this._state }
    return this
  }

  /**
   * Force the zustand state to update.
   */
  public forceUpdate = () => {
    this.store.setState(this._state, true)
  }

  /**
   * Get whether the state manager can undo.
   */
  public get canUndo(): boolean {
    return this.pointer > -1
  }

  /**
   * Get whether the state manager can redo.
   */
  public get canRedo(): boolean {
    return this.pointer < this.stack.length - 1
  }

  /**
   * The current state.
   */
  public get state(): T {
    return this._state
  }

  /**
   * The most-recent snapshot.
   */
  protected get snapshot(): T {
    return this._snapshot
  }
}
