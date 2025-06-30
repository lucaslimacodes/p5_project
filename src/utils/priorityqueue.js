class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Insere um valor com prioridade (se o valor já existir, muda a prioridade e faz um bubble up de novo)
  enqueue(value, priority) {
    let valueIndex = this.heap.findIndex(i => i.value == value)
    if(valueIndex == -1){
      this.heap.push({ value, priority });
    }else{
      this.heap[valueIndex].priority = priority
    }
    this._bubbleUp();
  }

  // Remove e retorna o elemento de maior prioridade (menor valor)
  dequeue() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown();
    }
    return min;
  }

  // Sobe o novo elemento para manter a propriedade de heap
  _bubbleUp() {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];

    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.heap[parentIdx];

      if (element.priority >= parent.priority) break;

      this.heap[parentIdx] = element;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
  }

  // Desce o elemento para manter a propriedade de heap
  _sinkDown() {
    let idx = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swapIdx = null;

      if (leftChildIdx < length) {
        let leftChild = this.heap[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        let rightChild = this.heap[rightChildIdx];
        if (
          (swapIdx === null && rightChild.priority < element.priority) ||
          (swapIdx !== null && rightChild.priority < this.heap[swapIdx].priority)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;

      this.heap[idx] = this.heap[swapIdx];
      this.heap[swapIdx] = element;
      idx = swapIdx;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0];
  }
}
