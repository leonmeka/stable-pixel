export interface Position {
  left: number;
  top: number;
}

export interface Vertex {
  name: string;
  position: Position;
  style: React.CSSProperties;
}

export interface Edge {
  name: string;
  from: string;
  to: string;
  style: React.CSSProperties;
}

export const vertexData: Vertex[] = [
  {
    name: "vertex_head",
    position: { left: 50, top: 16 },
    style: { backgroundColor: "#FF0000" },
  },
  {
    name: "vertex_lefteye",
    position: { left: 48, top: 14 },
    style: { backgroundColor: "#AA00FF" },
  },
  {
    name: "vertex_leftear",
    position: { left: 44, top: 16 },
    style: { backgroundColor: "#FF00AA" },
  },
  {
    name: "vertex_righteye",
    position: { left: 52, top: 14 },
    style: { backgroundColor: "#FF00FF" },
  },
  {
    name: "vertex_rightear",
    position: { left: 56, top: 16 },
    style: { backgroundColor: "#FF0055" },
  },
  {
    name: "vertex_chest",
    position: { left: 50, top: 30 },
    style: { backgroundColor: "#FF5500" },
  },
  {
    name: "vertex_leftshoulder",
    position: { left: 40, top: 30 },
    style: { backgroundColor: "#FFAA00" },
  },
  {
    name: "vertex_rightshoulder",
    position: { left: 60, top: 30 },
    style: { backgroundColor: "#55FF00" },
  },
  {
    name: "vertex_leftelbow",
    position: { left: 40, top: 42 },
    style: { backgroundColor: "#FFFF00" },
  },
  {
    name: "vertex_rightelbow",
    position: { left: 60, top: 42 },
    style: { backgroundColor: "#00FF00" },
  },
  {
    name: "vertex_lefthand",
    position: { left: 40, top: 54 },
    style: { backgroundColor: "#AAFF00" },
  },
  {
    name: "vertex_righthand",
    position: { left: 60, top: 54 },
    style: { backgroundColor: "#00FF55" },
  },
  {
    name: "vertex_lefthip",
    position: { left: 45, top: 56 },
    style: { backgroundColor: "#00FFAA" },
  },
  {
    name: "vertex_righthip",
    position: { left: 55, top: 56 },
    style: { backgroundColor: "#0055FF" },
  },
  {
    name: "vertex_leftknee",
    position: { left: 45, top: 73 },
    style: { backgroundColor: "#00FFFF" },
  },
  {
    name: "vertex_rightknee",
    position: { left: 55, top: 73 },
    style: { backgroundColor: "#0000FF" },
  },
  {
    name: "vertex_leftfeet",
    position: { left: 45, top: 90 },
    style: { backgroundColor: "#00AAFF" },
  },
  {
    name: "vertex_rightfeet",
    position: { left: 55, top: 90 },
    style: { backgroundColor: "#5500FF" },
  },
];

export const edgesData: Edge[] = [
  {
    name: "edge_lefteye",
    from: "vertex_head",
    to: "vertex_lefteye",
    style: { backgroundColor: "#5500FF" },
  },
  {
    name: "edge_leftear",
    from: "vertex_lefteye",
    to: "vertex_leftear",
    style: { backgroundColor: "#AA00FF" },
  },
  {
    name: "edge_righteye",
    from: "vertex_head",
    to: "vertex_righteye",
    style: { backgroundColor: "#FF00FF" },
  },
  {
    name: "edge_rightear",
    from: "vertex_righteye",
    to: "vertex_rightear",
    style: { backgroundColor: "#FF00AA" },
  },
  {
    name: "edge_neck",
    from: "vertex_head",
    to: "vertex_chest",
    style: { backgroundColor: "#0000FF" },
  },
  {
    name: "edge_leftshoulder",
    from: "vertex_chest",
    to: "vertex_leftshoulder",
    style: { backgroundColor: "#FF0000" },
  },
  {
    name: "edge_rightshoulder",
    from: "vertex_chest",
    to: "vertex_rightshoulder",
    style: { backgroundColor: "#FF5500" },
  },
  {
    name: "edge_leftupperarm",
    from: "vertex_leftshoulder",
    to: "vertex_leftelbow",
    style: { backgroundColor: "#FFAA00" },
  },
  {
    name: "edge_rightupperarm",
    from: "vertex_rightshoulder",
    to: "vertex_rightelbow",
    style: { backgroundColor: "#AAFF00" },
  },
  {
    name: "edge_leftlowerarm",
    from: "vertex_leftelbow",
    to: "vertex_lefthand",
    style: { backgroundColor: "#FFFF00" },
  },
  {
    name: "edge_rightlowerarm",
    from: "vertex_rightelbow",
    to: "vertex_righthand",
    style: { backgroundColor: "#55FF00" },
  },
  {
    name: "edge_leftchest",
    from: "vertex_chest",
    to: "vertex_lefthip",
    style: { backgroundColor: "#00FF00" },
  },
  {
    name: "edge_rightchest",
    from: "vertex_chest",
    to: "vertex_righthip",
    style: { backgroundColor: "#00FFFF" },
  },
  {
    name: "edge_leftupperleg",
    from: "vertex_lefthip",
    to: "vertex_leftknee",
    style: { backgroundColor: "#00FF55" },
  },
  {
    name: "edge_rightupperleg",
    from: "vertex_righthip",
    to: "vertex_rightknee",
    style: { backgroundColor: "#00AAFF" },
  },
  {
    name: "edge_leftlowerleg",
    from: "vertex_leftknee",
    to: "vertex_leftfeet",
    style: { backgroundColor: "#00FFAA" },
  },
  {
    name: "edge_rightlowerleg",
    from: "vertex_rightknee",
    to: "vertex_rightfeet",
    style: { backgroundColor: "#0055FF" },
  },
];

export type VerticesState = Record<string, Position>;

export const initialVertices: VerticesState = vertexData.reduce(
  (acc, vertex) => {
    acc[vertex.name] = { ...vertex.position };
    return acc;
  },
  {} as VerticesState,
);
