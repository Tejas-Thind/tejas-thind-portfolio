import type { ReactNode } from "react";

// Diagrams for posts are registered here, keyed by the name a post's figure
// block uses. None are published yet.
export const DIAGRAM_TITLES: Record<string, string> = {};
export const DIAGRAMS: Record<string, () => ReactNode> = {};
