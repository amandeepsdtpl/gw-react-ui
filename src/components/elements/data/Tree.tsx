import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
}

interface TreeProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  onToggle?: (node: TreeNode) => void;
  defaultExpandAll?: boolean;
  multiSelect?: boolean;
  showIcons?: boolean;
  className?: string;
}

export const Tree: React.FC<TreeProps> = ({
  data,
  onSelect,
  onToggle,
  defaultExpandAll = false,
  multiSelect = false,
  showIcons = true,
  className = '',
}) => {
  const [nodes, setNodes] = useState<TreeNode[]>(() =>
    initializeNodes(data, defaultExpandAll)
  );
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  // Initialize nodes with expansion state
  function initializeNodes(nodes: TreeNode[], expand: boolean): TreeNode[] {
    return nodes.map(node => ({
      ...node,
      isExpanded: expand,
      children: node.children ? initializeNodes(node.children, expand) : undefined,
    }));
  }

  // Find node by ID in the tree
  const findNode = useCallback((nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Update node in the tree
  const updateNode = useCallback((nodes: TreeNode[], id: string, updates: Partial<TreeNode>): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNode(node.children, id, updates),
        };
      }
      return node;
    });
  }, []);

  // Handle node toggle (expand/collapse)
  const handleToggle = useCallback((nodeId: string) => {
    const node = findNode(nodes, nodeId);
    if (!node || !node.children) return;

    setNodes(prev => updateNode(prev, nodeId, { isExpanded: !node.isExpanded }));
    onToggle?.(node);
  }, [nodes, onToggle, findNode, updateNode]);

  // Handle node selection
  const handleSelect = useCallback((nodeId: string, event?: React.MouseEvent) => {
    const node = findNode(nodes, nodeId);
    if (!node || node.disabled) return;

    setFocusedNodeId(nodeId);

    if (multiSelect && event?.ctrlKey) {
      setSelectedNodes(prev => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
    } else if (multiSelect && event?.shiftKey && focusedNodeId) {
      // TODO: Implement range selection
    } else {
      setSelectedNodes(new Set([nodeId]));
    }

    onSelect?.(node);
  }, [nodes, multiSelect, focusedNodeId, onSelect, findNode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedNodeId) return;

      const currentNode = findNode(nodes, focusedNodeId);
      if (!currentNode) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          // Find next visible node
          let found = false;
          const findNext = (nodes: TreeNode[]): string | null => {
            for (const node of nodes) {
              if (found) return node.id;
              if (node.id === focusedNodeId) {
                found = true;
                if (node.children && node.isExpanded) {
                  return node.children[0].id;
                }
                continue;
              }
              if (node.children && node.isExpanded) {
                const result = findNext(node.children);
                if (result) return result;
              }
            }
            return null;
          };
          const nextId = findNext(nodes);
          if (nextId) {
            setFocusedNodeId(nextId);
            if (!e.ctrlKey) handleSelect(nextId);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          // Find previous visible node
          let previous: string | null = null;
          const findPrevious = (nodes: TreeNode[]): boolean => {
            for (const node of nodes) {
              if (node.id === focusedNodeId) return true;
              previous = node.id;
              if (node.children && node.isExpanded) {
                if (findPrevious(node.children)) return true;
              }
            }
            return false;
          };
          findPrevious(nodes);
          if (previous) {
            setFocusedNodeId(previous);
            if (!e.ctrlKey) handleSelect(previous);
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          if (currentNode.children && !currentNode.isExpanded) {
            handleToggle(focusedNodeId);
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (currentNode.children && currentNode.isExpanded) {
            handleToggle(focusedNodeId);
          }
          break;
        }
        case ' ':
        case 'Enter': {
          e.preventDefault();
          handleSelect(focusedNodeId);
          break;
        }
      }
    };

    const treeElement = treeRef.current;
    if (treeElement) {
      treeElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (treeElement) {
        treeElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [nodes, focusedNodeId, handleToggle, handleSelect, findNode]);

  // Render tree node
  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodes.has(node.id);
    const isFocused = focusedNodeId === node.id;

    return (
      <div key={node.id} className="tree-node-container">
        <div
          className={`
            tree-node
            ${hasChildren ? 'has-children' : ''}
            ${isSelected ? 'selected' : ''}
            ${isFocused ? 'focused' : ''}
            ${node.disabled ? 'disabled' : ''}
          `}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={(e) => !node.disabled && handleSelect(node.id, e)}
          onDoubleClick={() => hasChildren && handleToggle(node.id)}
          role="treeitem"
          aria-expanded={hasChildren ? node.isExpanded : undefined}
          aria-selected={isSelected}
          aria-disabled={node.disabled}
          tabIndex={isFocused ? 0 : -1}
        >
          <div className="tree-node-content">
            {hasChildren && (
              <button
                className="tree-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(node.id);
                }}
                aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
              >
                {node.isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}
            {showIcons && (
              <div className="tree-icon">
                {node.icon || (hasChildren ? (
                  <Folder size={16} />
                ) : (
                  <File size={16} />
                ))}
              </div>
            )}
            <span className="tree-label">{node.label}</span>
          </div>
        </div>
        {hasChildren && node.isExpanded && (
          <div role="group">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={treeRef}
      className={`tree ${className}`}
      role="tree"
      aria-multiselectable={multiSelect}
      tabIndex={0}
    >
      {nodes.map(node => renderNode(node))}

      <style jsx>{`
        .tree {
          outline: none;
          user-select: none;
        }

        .tree-node {
          display: flex;
          align-items: center;
          padding: 0.375rem 0.5rem;
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .tree-node:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .tree-node.selected {
          background-color: var(--gw-primary-50);
          color: var(--gw-primary-700);
        }

        .tree-node.focused {
          outline: 2px solid var(--gw-primary-200);
          outline-offset: -2px;
        }

        .tree-node.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tree-node-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .tree-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          margin: -0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .tree-toggle:hover {
          background-color: var(--gw-background-tertiary);
          color: var(--gw-text-primary);
        }

        .tree-icon {
          display: flex;
          align-items: center;
          color: var(--gw-text-secondary);
        }

        .tree-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Material Design styles */
        [data-design-system="material"] .tree-node {
          font-family: var(--gw-font-family);
          border-radius: 4px;
        }

        [data-design-system="material"] .tree-node.selected {
          background-color: var(--gw-primary-100);
        }

        [data-design-system="material"] .tree-toggle {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};