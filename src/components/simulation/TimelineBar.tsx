import type { ScenarioNode } from '../../data/scenarios'

interface Props {
  currentNode: number
  totalNodes: number
  nodes: ScenarioNode[]
}

export default function TimelineBar({ currentNode, totalNodes, nodes }: Props) {
  return (
    <div className="timeline-bar">
      <div className="timeline-track">
        {nodes.map((node, i) => (
          <div
            key={node.id}
            className={`timeline-node ${i < currentNode ? 'done' : ''} ${i === currentNode ? 'active' : ''}`}
          >
            <div className="timeline-dot" />
            <span className="timeline-label">Y{node.year + 1}</span>
          </div>
        ))}
        <div
          className="timeline-fill"
          style={{ width: `${(currentNode / Math.max(totalNodes - 1, 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
