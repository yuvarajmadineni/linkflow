import { Edge, Node } from "reactflow";
import { create } from "zustand";

interface UndoRedoStore {
  workflowId: string;
  prevNodes: Array<Node[]>;
  prevEdges: Array<Edge[]>;
  nodes: Node[];
  edges: Edge[];
  futureNodes: Array<Node[]>;
  futureEdges: Array<Edge[]>;
  undo: (
    cb?: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void
  ) => void;
  redo: (
    cb?: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void
  ) => void;
  update: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void;
  setNodesEdges: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void;
}

export const useUndoRedoNodes = create<UndoRedoStore>((set, get) => ({
  workflowId: "",
  prevNodes: [],
  prevEdges: [],
  nodes: [],
  edges: [],
  futureEdges: [],
  futureNodes: [],
  undo: (cb?: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void) => {
    if (get().prevNodes.length === 0 || get().prevEdges.length === 0) return;

    const newNodes = [...get().prevNodes];
    const newEdges = [...get().prevEdges];
    const newPresentNodes = newNodes.pop();
    const newPresentEdges = newEdges.pop();

    if (!newPresentNodes?.length) return;
    cb?.({ nodes: newPresentNodes!, edges: newPresentEdges! });

    set({
      prevEdges: newEdges,
      prevNodes: newNodes,
      futureNodes: [get().nodes, ...get().futureNodes],
      futureEdges: [get().edges, ...get().futureEdges],
      nodes: newPresentNodes!,
      edges: newPresentEdges!,
    });
  },

  redo: (cb?: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => void) => {
    if (get().futureNodes.length === 0 || get().futureEdges.length === 0)
      return;

    const newFutureNodes = [...get().futureNodes];
    const newFutureEdges = [...get().futureEdges];
    const newPresentNodes = newFutureNodes.shift();
    const newPresentEdges = newFutureEdges.shift();

    if (!newPresentNodes?.length) return;
    cb?.({ nodes: newPresentNodes!, edges: newPresentEdges! });

    set({
      prevEdges: [...get().prevEdges, get().edges],
      prevNodes: [...get().prevNodes, get().nodes],
      futureNodes: newFutureNodes,
      futureEdges: newFutureEdges,
      nodes: newPresentNodes!,
      edges: newPresentEdges!,
    });
  },

  update: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    set({
      prevEdges: [...get().prevEdges, get().edges],
      prevNodes: [...get().prevNodes, get().nodes],
      nodes,
      edges,
      futureEdges: [],
      futureNodes: [],
    });
  },
  setNodesEdges: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) =>
    set({ nodes, edges }),
}));
