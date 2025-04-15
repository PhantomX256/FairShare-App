import { BalanceItem } from "./types";

export const welcomeScreenSlides = [
  {
    id: 0,
    title: "Welcome to FairShare!",
    subtitle: "Split expenses effortlessly with your friends and family.",
    image: require("../assets/images/Welcome Screen/Trip.jpg"),
  },
  {
    id: 1,
    title: "Scan Receipts Instantly",
    subtitle: "Use your camera to scan receipts and split bills in seconds.",
    image: require("../assets/images/Welcome Screen/Receipt.jpg"),
  },
  {
    id: 2,
    title: "Track Group Expenses",
    subtitle: "Keep track of who owes what in real-time.",
    image: require("../assets/images/Welcome Screen/Expense.jpg"),
  },
  {
    id: 3,
    title: "Ready to Simplify Your Expenses?",
    subtitle: "Join FairShare today and make splitting bills a breeze.",
    image: require("../assets/images/Welcome Screen/Welcome.jpg"),
  },
];

export const expenseMemberListTabs = ["Equally", "Shares", "Unequally"];

export function formatDate(timestamp: any): string {
  if (!timestamp || !timestamp.seconds) {
    return "No date";
  }

  // Create date from seconds
  const date = new Date(timestamp.seconds * 1000);

  // Format the date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export class MaxHeap {
  private heap: BalanceItem[];

  constructor() {
    this.heap = [];
  }

  // Helper methods for getting parent and child indices
  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  // Check if node exists
  private hasParent(i: number): boolean {
    return this.getParentIndex(i) >= 0;
  }

  private hasLeftChild(i: number): boolean {
    return this.getLeftChildIndex(i) < this.heap.length;
  }

  private hasRightChild(i: number): boolean {
    return this.getRightChildIndex(i) < this.heap.length;
  }

  // Get values
  private parent(i: number): BalanceItem {
    return this.heap[this.getParentIndex(i)];
  }

  private leftChild(i: number): BalanceItem {
    return this.heap[this.getLeftChildIndex(i)];
  }

  private rightChild(i: number): BalanceItem {
    return this.heap[this.getRightChildIndex(i)];
  }

  // Swap elements
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // Insert a new element
  insert(value: BalanceItem): MaxHeap {
    this.heap.push(value);
    this.heapifyUp();
    return this;
  }

  // Restore heap property after insertion
  private heapifyUp(): void {
    let index = this.heap.length - 1;

    while (
      this.hasParent(index) &&
      this.parent(index).amount < this.heap[index].amount
    ) {
      const parentIndex = this.getParentIndex(index);
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  // Remove and return the maximum element
  extractMax(): BalanceItem | null {
    if (this.heap.length === 0) return null;

    const max = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown();
    }

    return max;
  }

  // Restore heap property after extraction
  private heapifyDown(): void {
    let index = 0;

    while (this.hasLeftChild(index)) {
      let largerChildIndex = this.getLeftChildIndex(index);

      if (
        this.hasRightChild(index) &&
        this.rightChild(index).amount > this.leftChild(index).amount
      ) {
        largerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].amount >= this.heap[largerChildIndex].amount) {
        break;
      }

      this.swap(index, largerChildIndex);
      index = largerChildIndex;
    }
  }

  // Check the maximum element without removing it
  peek(): BalanceItem | null {
    if (this.heap.length === 0) return null;
    return this.heap[0];
  }

  // Get the size of the heap
  size(): number {
    return this.heap.length;
  }

  // Check if the heap is empty
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  // Get all elements (can be useful for debugging)
  getHeap(): BalanceItem[] {
    return [...this.heap];
  }
}
