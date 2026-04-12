import { useCallback, useEffect, useState, useMemo } from 'react'
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  OnConnect,
  EdgeProps,
} from '@xyflow/react'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Plus, Minus, Lock, Unlock, Maximize2, Loader2 } from 'lucide-react'
import { ArchitectureNodeComponent } from './ArchitectureNode'
import { useDesignStore } from '@/store/useDesignStore'
import { cn } from '@/lib/utils'
import type { NodeData } from '@/types'

// ─── Edge color mapping ───
const edgeLabelColors: Record<string, { bg: string; text: string; border: string; stroke: string }> = {
  read: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', stroke: '#3b82f6' },
  write: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', stroke: '#10b981' },
  replicate: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', stroke: '#f97316' },
  async: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', stroke: '#a855f7' },
  sync: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', stroke: '#06b6d4' },
  push: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', stroke: '#f59e0b' },
  pull: { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', stroke: '#14b8a6' },
}

// ─── Group styles ───
const groupStyles: Record<string, { label: string; color: string; dashColor: string; bgColor: string }> = {
  client: { label: 'Client Devices', color: 'text-blue-400', dashColor: '#3b82f6', bgColor: 'rgba(59,130,246,0.04)' },
  backend: { label: 'Backend Server', color: 'text-emerald-400', dashColor: '#10b981', bgColor: 'rgba(16,185,129,0.04)' },
  data: { label: 'Data Layer', color: 'text-purple-400', dashColor: '#a855f7', bgColor: 'rgba(168,85,247,0.04)' },
  infra: { label: 'Infrastructure', color: 'text-teal-400', dashColor: '#14b8a6', bgColor: 'rgba(20,184,166,0.04)' },
  workers: { label: 'Background Tasks', color: 'text-amber-400', dashColor: '#f59e0b', bgColor: 'rgba(245,158,11,0.04)' },
}

const nodeTypes = { custom: ArchitectureNodeComponent }

type FlowNode = Node<NodeData>
type FlowEdge = Edge

// ─── Custom edge with numbered step circle and label ───
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const dy = targetY - sourceY
  const midY = sourceY + dy * 0.5

  const path = `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`

  const edgeData = data as Record<string, unknown> | undefined
  const labelType = (edgeData?.labelType as string) || 'sync'
  const edgeStyle = edgeData?.style as string
  const colors = edgeLabelColors[labelType] || edgeLabelColors.sync
  const isDashed = edgeStyle === 'dashed' || labelType === 'async' || labelType === 'replicate'

  // Calculate label position (midpoint of curve)
  const labelX = sourceX + (targetX - sourceX) / 2
  const labelY = midY

  return (
    <>
      {/* Main path */}
      <path
        id={id}
        d={path}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={1.5}
        strokeDasharray={isDashed ? '5 5' : undefined}
        markerEnd={markerEnd}
        style={style}
        className="react-flow__edge-path"
      />

      {/* Step number circle */}
      {edgeData?.stepNumber && (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 14}
            r={10}
            fill={colors.stroke}
            stroke="#0a0a0c"
            strokeWidth={2}
          />
          <text
            x={labelX}
            y={labelY - 10}
            textAnchor="middle"
            className="fill-white text-xs font-bold"
            style={{ fontSize: '10px', fontWeight: 700 }}
          >
            {String(edgeData.stepNumber)}
          </text>
        </g>
      )}

      {/* Label pill */}
      {edgeData?.label && (
        <foreignObject
          width={140}
          height={22}
          x={labelX - 70}
          y={labelY + (edgeData.stepNumber ? 2 : -10)}
          className="overflow-visible"
        >
          <div className="flex items-center justify-center">
            <span
              className={cn(
                'inline-flex items-center rounded border px-2 py-0.5 text-xs font-bold tracking-wide font-mono whitespace-nowrap',
                colors.bg,
                colors.text,
                colors.border
              )}
            >
              {String(edgeData.label)}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  )
}

const edgeTypes = { custom: CustomEdge }

// ─── Group Region Component ───
function GroupRegion({
  nodes,
  label,
  color,
  dashColor,
  bgColor,
}: {
  nodes: FlowNode[]
  label: string
  color: string
  dashColor: string
  bgColor: string
}) {
  if (nodes.length < 2) return null

  const padding = 50
  const minX = Math.min(...nodes.map((n) => n.position.x)) - padding
  const minY = Math.min(...nodes.map((n) => n.position.y)) - padding
  const maxX = Math.max(...nodes.map((n) => n.position.x + 180)) + padding
  const maxY = Math.max(...nodes.map((n) => n.position.y + 80)) + padding

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        borderRadius: 16,
        border: `2px dashed ${dashColor}30`,
        background: bgColor,
      }}
    >
      <span
        className={cn('absolute -top-3 left-4 px-2 text-xs font-bold font-mono uppercase tracking-wider', color)}
        style={{ background: '#0a0a0c' }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Flow Canvas ───
function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: {
  nodes: FlowNode[]
  edges: FlowEdge[]
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void
  onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void
  onConnect: OnConnect
}) {
  const { fitView, zoomIn, zoomOut } = useReactFlow<FlowNode>()
  const [isLocked, setIsLocked] = useState(false)

  // Group nodes by group
  const groups = useMemo(() => {
    const map: Record<string, FlowNode[]> = {}
    nodes.forEach((node) => {
      const group = node.data.group
      if (group) {
        if (!map[group]) map[group] = []
        map[group].push(node)
      }
    })
    return map
  }, [nodes])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      className="bg-[#0a0a0c]"
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: 'custom' }}
      minZoom={0.1}
      maxZoom={2}
      panOnDrag={!isLocked}
      zoomOnScroll={!isLocked}
      zoomOnPinch={!isLocked}
      panOnScroll
      selectionOnDrag
      elementsSelectable
    >
      {/* Dot grid background */}
      <Background color="#1a1a2e" gap={40} size={1} />

      {/* Group regions */}
      {Object.entries(groups).map(([groupId, groupNodes]) => {
        const gs = groupStyles[groupId]
        if (!gs || groupNodes.length < 2) return null
        return (
          <GroupRegion
            key={groupId}
            nodes={groupNodes}
            label={gs.label}
            color={gs.color}
            dashColor={gs.dashColor}
            bgColor={gs.bgColor}
          />
        )
      })}

      {/* Controls */}
      <div className="absolute bottom-5 left-5 z-10 flex flex-col gap-1">
        <div className="flex flex-col rounded-md border border-zinc-800/60 bg-[#12121a]/90 backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => zoomIn()}
            className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors border-b border-zinc-800/40"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => zoomOut()}
            className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors border-b border-zinc-800/40"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => fitView({ padding: 0.1, duration: 500 })}
            className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors border-b border-zinc-800/40"
            aria-label="Fit view"
            title="Fit view"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsLocked((v) => !v)}
            className={cn(
              'flex h-8 w-8 items-center justify-center transition-colors',
              isLocked
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/40'
            )}
            aria-label={isLocked ? 'Unlock viewport' : 'Lock viewport'}
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Legend */}
      {nodes.length > 0 && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="rounded-md border border-zinc-800/50 bg-[#12121a]/80 backdrop-blur-sm px-3 py-2">
            <span className="font-mono text-xs text-zinc-500">
              {nodes.length} nodes · {edges.length} edges
            </span>
          </div>
          <div className="rounded-md border border-zinc-800/50 bg-[#12121a]/80 backdrop-blur-sm px-3 py-2">
            <p className="font-mono text-xs text-zinc-600 mb-1.5 uppercase tracking-wider">Flow Types</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {Object.entries(edgeLabelColors).map(([key, { stroke }]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stroke }} />
                  <span className="font-mono text-xs text-zinc-500 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ReactFlow>
  )
}

// ─── Main Panel ───
export function VisualizationPanel() {
  const { design, isLoading, loadingNodes } = useDesignStore()

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([])

  useEffect(() => {
    if (!design) {
      setNodes([])
      setEdges([])
      return
    }

    const newNodes: FlowNode[] = design.graph.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: {
        label: node.data.label,
        description: node.data.description ?? undefined,
        nodeType: node.type as NodeData['nodeType'],
        actions: node.data.actions ?? undefined,
        stepNumber: node.data.stepNumber ?? undefined,
        group: node.data.group ?? undefined,
        buildPrompt: node.data.buildPrompt ?? undefined,
      } satisfies NodeData,
    }))

    const newEdges: FlowEdge[] = design.graph.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'custom',
      data: {
        label: edge.label ?? undefined,
        labelType: edge.labelType ?? undefined,
        stepNumber: edge.stepNumber ?? undefined,
        style: (edge.style ?? 'solid') as string,
      },
    }))

    setNodes(newNodes)
    setEdges(newEdges)
  }, [design?.graph.nodes.map((n) => n.id + n.data.buildPrompt).join('|'), design?.graph.edges.length, setNodes, setEdges])

  const onConnect = useCallback<OnConnect>(
    (connection) => {
      const newEdge: FlowEdge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'custom',
        data: { label: 'connects', labelType: 'sync' },
      }
      setEdges((eds) => [...eds, newEdge])
    },
    [setEdges]
  )

  // Progress tracking
  const totalNodes = nodes.length
  const loadedNodes = totalNodes - loadingNodes.size
  const promptProgress = totalNodes > 0 ? Math.round((loadedNodes / totalNodes) * 100) : 0

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border border-cyan-500/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
          <div className="relative h-8 w-8 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-mono text-sm text-zinc-300">Generating architecture...</p>
          <p className="font-mono text-xs text-zinc-600 mt-1">AI is designing your system</p>
        </div>
      </div>
    )
  }

  if (!design) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 blueprint-grid opacity-20 rounded-lg" />
          <div className="relative text-4xl text-zinc-500/50">◇</div>
        </div>
        <div className="text-center">
          <p className="font-display text-sm font-medium text-zinc-300">Enter your system requirements</p>
          <p className="font-mono text-xs text-zinc-500 mt-1">AI will generate your architecture diagram here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      {/* Prompt generation progress bar */}
      {loadingNodes.size > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-[#12121a]/90 backdrop-blur-sm px-4 py-2">
          <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
          <span className="font-mono text-xs text-zinc-300">
            Generating prompts: {loadedNodes}/{totalNodes}
          </span>
          <div className="h-1 w-24 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${promptProgress}%` }}
            />
          </div>
        </div>
      )}

      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  )
}
