import { ReactiveQueue } from '$lib/utils/reactiveQueue.svelte'

export class Toast {
  static _nextId = 0
  public id: number

  private static get nextId() {
    return Toast._nextId++
  }

  constructor(
    public message: string,
    public type: 'success' | 'error' | 'info',
    public durationMs: number,
  ) {
    this.id = Toast.nextId
  }
}

class Toaster extends ReactiveQueue<Toast> {
  private static instance: Toaster

  public static getInstance(): Toaster {
    if (!Toaster.instance) Toaster.instance = new Toaster()
    return Toaster.instance
  }

  public push(toast: Toast): void {
    if (!toast.message) return
    this.enqueue(toast)
    // Automatically remove the message after its duration
    if (toast.durationMs !== Infinity) setTimeout(() => this.remove(toast.id), toast.durationMs)
  }

  /** Remove a toast by its ID. Returns the removed toast, or null if the ID was not found. */
  public remove(id: number): Toast | null {
    const i = this._items.findIndex((t) => t.id === id)
    if (i === -1) return null
    return this._items.splice(i, 1)[0]
  }
}

export const toaster = Toaster.getInstance()
