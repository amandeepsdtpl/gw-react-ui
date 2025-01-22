import React, { useState, useEffect } from 'react';
import { defaultColors, formatNumber } from './utils';

interface SankeyNode {
  id: string;
  label: string;
  color?: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  title?: string;
  showTooltip?: boolean;
  className?: string;
  animate?: boolean;
  nodePadding?: number;
  nodeWidth?: number;
}

interface CalculatedNode extends SankeyNode {
  x: number;
  y: number;
  height: number;
  column: number;
}

interface CalculatedLink extends SankeyLink {
  sourceNode: CalculatedNode;
  targetNode: CalculatedNode;
  path: string;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({
  nodes,
  links,
  width = 800,
  height = 500,
  title,
  showTooltip = true,
  className = '',
  animate = true,
  nodePadding = 20,
  nodeWidth = 24,
}) => {
  const [activeElement, setActiveElement] = useState<'node' | 'link' | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [calculatedNodes, setCalculatedNodes] = useState<CalculatedNode[]>([]);
  const [calculatedLinks, setCalculatedLinks] = useState<CalculatedLink[]>([]);

  const padding = { top: 40, right: 100, bottom: 40, left: 100 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  useEffect(() => {
    // Calculate node positions and sizes
    const calculateLayout = () => {
      // Determine node columns (layers)
      const nodeColumns = new Map<string, number>();
      const visited = new Set<string>();
      const queue: string[] = [];

      // Find source nodes (nodes with no incoming links)
      nodes.forEach(node => {
        if (!links.some(link => link.target === node.id)) {
          queue.push(node.id);
          nodeColumns.set(node.id, 0);
        }
      });

      // Assign columns to nodes using breadth-first traversal
      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        visited.add(nodeId);
        const column = nodeColumns.get(nodeId)!;

        links
          .filter(link => link.source === nodeId)
          .forEach(link => {
            if (!visited.has(link.target)) {
              queue.push(link.target);
              nodeColumns.set(link.target, column + 1);
            }
          });
      }

      const maxColumn = Math.max(...Array.from(nodeColumns.values()));
      const columnWidth = chartWidth / maxColumn;

      // Calculate node values and heights
      const nodeValues = new Map<string, number>();
      nodes.forEach(node => {
        const outgoingValue = links
          .filter(link => link.source === node.id)
          .reduce((sum, link) => sum + link.value, 0);
        const incomingValue = links
          .filter(link => link.target === node.id)
          .reduce((sum, link) => sum + link.value, 0);
        nodeValues.set(node.id, Math.max(outgoingValue, incomingValue));
      });

      const totalValue = Array.from(nodeValues.values()).reduce((a, b) => a + b, 0);
      const scale = chartHeight / totalValue;

      // Calculate node positions
      const columnNodes = new Map<number, CalculatedNode[]>();
      const calculated: CalculatedNode[] = nodes.map(node => {
        const column = nodeColumns.get(node.id)!;
        const height = nodeValues.get(node.id)! * scale;
        const x = column * columnWidth;

        const columnArray = columnNodes.get(column) || [];
        columnNodes.set(column, [...columnArray, { ...node, x, height, column, y: 0 }]);

        return { ...node, x, height, column, y: 0 };
      });

      // Distribute nodes vertically within columns
      columnNodes.forEach(columnArray => {
        const totalHeight = columnArray.reduce((sum, node) => sum + node.height, 0);
        const spacing = (chartHeight - totalHeight) / (columnArray.length + 1);
        let currentY = spacing;

        columnArray.forEach(node => {
          const index = calculated.findIndex(n => n.id === node.id);
          calculated[index].y = currentY;
          currentY += node.height + spacing;
        });
      });

      // Calculate link paths
      const calculatedLinks: CalculatedLink[] = links.map(link => {
        const sourceNode = calculated.find(n => n.id === link.source)!;
        const targetNode = calculated.find(n => n.id === link.target)!;

        // Calculate vertical positions for link endpoints
        const sourceOutgoing = links
          .filter(l => l.source === link.source)
          .reduce((sum, l, i, arr) => (l === link ? sum : sum + l.value), 0);
        const targetIncoming = links
          .filter(l => l.target === link.target)
          .reduce((sum, l, i, arr) => (l === link ? sum : sum + l.value), 0);

        const sourceY = sourceNode.y + (sourceOutgoing * scale) / 2;
        const targetY = targetNode.y + (targetIncoming * scale) / 2;

        // Create curved path
        const path = `
          M ${sourceNode.x + nodeWidth} ${sourceY}
          C ${sourceNode.x + columnWidth / 2} ${sourceY},
            ${targetNode.x - columnWidth / 2} ${targetY},
            ${targetNode.x} ${targetY}
        `;

        return {
          ...link,
          sourceNode,
          targetNode,
          path,
        };
      });

      setCalculatedNodes(calculated);
      setCalculatedLinks(calculatedLinks);
    };

    calculateLayout();
  }, [nodes, links, chartWidth, chartHeight, nodeWidth, nodePadding]);

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Links */}
          {calculatedLinks.map((link, i) => {
            const isActive =
              activeElement === 'link' && activeId === `${link.source}-${link.target}`;
            const color = link.color || defaultColors[i % defaultColors.length];
            const opacity = isActive ? 0.8 : 0.4;

            return (
              <g key={`${link.source}-${link.target}`}>
                <path
                  d={link.path}
                  fill="none"
                  stroke={color}
                  strokeWidth={Math.max(1, link.value * 0.5)}
                  strokeOpacity={opacity}
                  className={animate ? 'chart-animate-stroke' : ''}
                  onMouseEnter={() => {
                    setActiveElement('link');
                    setActiveId(`${link.source}-${link.target}`);
                  }}
                  onMouseLeave={() => {
                    setActiveElement(null);
                    setActiveId(null);
                  }}
                />
                {isActive && showTooltip && (
                  <g transform={`translate(${(link.sourceNode.x + link.targetNode.x) / 2}, ${
                    (link.sourceNode.y + link.targetNode.y) / 2
                  })`}>
                    <rect
                      x={-60}
                      y={-40}
                      width={120}
                      height={80}
                      rx={4}
                      fill="white"
                      stroke="#e5e7eb"
                    />
                    <text x={0} y={-20} textAnchor="middle" className="chart-label">
                      {link.sourceNode.label} → {link.targetNode.label}
                    </text>
                    <text x={0} y={0} textAnchor="middle" className="chart-value">
                      Value: {formatNumber(link.value)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {calculatedNodes.map((node, i) => {
            const isActive = activeElement === 'node' && activeId === node.id;
            const color = node.color || defaultColors[i % defaultColors.length];

            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={node.height}
                  fill={color}
                  fillOpacity={isActive ? 0.8 : 0.6}
                  stroke={color}
                  strokeWidth={1}
                  className={animate ? 'chart-animate-fill' : ''}
                  onMouseEnter={() => {
                    setActiveElement('node');
                    setActiveId(node.id);
                  }}
                  onMouseLeave={() => {
                    setActiveElement(null);
                    setActiveId(null);
                  }}
                />
                <text
                  x={node.column === 0 ? node.x - 10 : node.x + nodeWidth + 10}
                  y={node.y + node.height / 2}
                  textAnchor={node.column === 0 ? 'end' : 'start'}
                  dominantBaseline="middle"
                  className="chart-label"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};