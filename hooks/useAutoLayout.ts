import { useEffect } from "react";
import {
  Edge,
  Node,
  Position,
  ReactFlowState,
  useReactFlow,
  useStore,
} from "reactflow";
import { stratify, tree } from "d3-hierarchy";

type Direction = "TB" | "LR" | "RL" | "BT";

type Options = {
  direction: Direction;
};

const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
};

const getPosition = (x: number, y: number, direction: Direction) => {
  switch (direction) {
    case "RL":
      return { x: -y, y: -x };

    case "BT":
      return { x: -x, y: -y };

    default:
      return { x, y };
  }
};

const layout = tree<Node>()
  .nodeSize([200, 120])
  .separation(() => 1);

const nodeCountSelector = (state: ReactFlowState) => state.nodeInternals.size;
const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height
  );

export function useAutoLayout(options: Options) {
  const { direction } = options;
  const nodeCount = useStore(nodeCountSelector);
  const nodesInitialized = useStore(nodesInitializedSelector);
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    if (!nodeCount || !nodesInitialized) {
      return;
    }

    const nodes = getNodes();
    const edges = getEdges();

    const hierarchy = stratify<Node>()
      .id((d) => d.id)
      .parentId(
        (d: Node) => edges.find((e: Edge) => e.target === d.id)?.source
      )(nodes);

    const root = layout(hierarchy);

    setNodes((nodes) =>
      nodes.map((node) => {
        const { x, y } = root.find((d) => d.id === node.id) || {
          x: node.position.x,
          y: node.position.y,
        };

        return {
          ...node,
          sourcePosition: positionMap[direction[1]],
          targetPosition: positionMap[direction[0]],
          position: getPosition(x, y, direction),
          style: { opacity: 1 },
        };
      })
    );

    setEdges((edges) =>
      edges.map((edge) => ({ ...edge, style: { opacity: 1 } }))
    );
  }, [
    direction,
    getEdges,
    getNodes,
    nodeCount,
    nodesInitialized,
    setEdges,
    setNodes,
  ]);
}
