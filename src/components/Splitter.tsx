import { cn } from "@/lib/utils";
import { useState } from "react";

const Splitter = ({ id = "drag-bar", dir, isDragging, ...props }: any) => {
  return (
    <div
      id={id}
      data-testid={id}
      tabIndex={0}
      className={cn(
        "sample-drag-bar",
        dir === "horizontal" && "sample-drag-bar--horizontal",
        isDragging && "sample-drag-bar--dragging"
      )}
      {...props}
    />
  );
};

export default Splitter;
