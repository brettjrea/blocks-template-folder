import { FolderBlockProps } from "@githubnext/blocks";
import { Box } from "@primer/react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";
import React, { useRef, useEffect } from 'react';

export default function ExampleFolderBlock(props: FolderBlockProps) {
  // Create a ref to hold the container element for the network visualization
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the useEffect hook to set up the network visualization when the component mounts
  useEffect(() => {
    // If the container element does not exist, return
    if (!containerRef.current) {
      return;
    }

    // Create a dataset containing the nodes and edges for the network visualization
    const data = new DataSet({
      nodes: [
        // Add the root folder as a node
        { id: props.context.folder, label: props.context.folder, shape: "box" },

        // Add the folders and files inside the root folder as nodes
        ...props.tree.map((item) => ({
          id: item.path,
          label: item.path,
          shape: item.type === "tree" ? "box" : "ellipse",
        })),
      ],
      edges: [
        // Connect the root folder node to its contents with edges
        { from: props.context.folder, to: props.tree.map((item) => item.path) },
      ],
    });

    // Create a new network visualization with the dataset and the container element
    const network = new Network(containerRef.current, data, {});

    // Clean up the network visualization when the component unmounts
    return () => {
      network.destroy();
    };
  }, [props.context.folder, props.tree]);

  // Render the component with the network visualization container and a header
  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box
          bg="canvas.subtle"
          p={3}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="border.default"
        >
          {/* Display a header for the folder content */}
          This is the folder content.
        </Box>
        {/* Render the network visualization container */}
        <Box p={4}>
          <div ref={containerRef} style={{ height: "500px" }} />
        </Box>
      </Box>
    </Box>
  );
}
