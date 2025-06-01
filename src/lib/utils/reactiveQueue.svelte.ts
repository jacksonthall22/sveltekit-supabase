/** A queue with Svelte reactivity on pushing/popping. */
export class ReactiveQueue<T extends any> {
  protected _items = $state([] as T[])

  protected constructor(_items: T[] = []) {
    this._items = _items
  }

  public get items() {
    return this._items
  }

  public get size() {
    return this.items.length
  }

  public get isEmpty() {
    return this.size === 0
  }

  protected peek() {
    if (this.isEmpty) return undefined
    return this.items[0]
  }

  protected enqueue(element: T) {
    this._items.push(element)
  }

  protected dequeue() {
    if (this.isEmpty) return undefined
    return this.items.shift()
  }

  protected clear() {
    this._items = []
  }
}
