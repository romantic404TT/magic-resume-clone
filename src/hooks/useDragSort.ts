import { useCallback, useState } from "react";
import type { DragEvent, HTMLAttributes } from "react";

export interface DragItemProps extends HTMLAttributes<HTMLDivElement> {
  draggable?: boolean;
  "data-dragging"?: boolean;
  "data-drag-over"?: boolean;
}

/**
 * 原生 HTML5 拖拽排序 —— 上游 package.json 里没有任何拖拽库，
 * 复刻保持同样的实现方式（无 dnd-kit / sortablejs）。
 */
export const useDragSort = (onMove: (sourceId: string, targetId: string) => void) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const getItemProps = useCallback(
    (id: string): DragItemProps => ({
      draggable: true,
      onDragStart: (event: DragEvent<HTMLDivElement>) => {
        setDraggingId(id);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      },
      onDragEnter: () => setOverId(id),
      onDragOver: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      },
      onDrop: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const source = event.dataTransfer.getData("text/plain") || draggingId;
        if (source && source !== id) onMove(source, id);
        setDraggingId(null);
        setOverId(null);
      },
      onDragEnd: () => {
        setDraggingId(null);
        setOverId(null);
      },
      "data-dragging": draggingId === id,
      "data-drag-over": overId === id && draggingId !== id,
    }),
    [draggingId, onMove, overId],
  );

  return { getItemProps, draggingId, overId };
};
