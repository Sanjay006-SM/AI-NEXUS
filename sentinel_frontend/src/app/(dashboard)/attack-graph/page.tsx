"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize, ChevronRight, AlertTriangle, ShieldAlert, GitBranch, Server, Database, User, Shield, Info } from "lucide-react";
import { useTopAttackPaths } from "@/lib/queries";
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position, 
  MarkerType, 
  useNodesState, 
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Custom Node Component ---
const CustomNode = ({ data }: any) => {
  const getIcon = () => {
    switch(data.type) {
      case 'Identity': return <User className="w-3.5 h-3.5" style={{ color: data.color }} />;
      case 'IPAddress': return <Server className="w-3.5 h-3.5" style={{ color: data.color }} />;
      case 'Resource': return <Database className="w-3.5 h-3.5" style={{ color: data.color }} />;
      case 'DataStore': return <Shield className="w-3.5 h-3.5" style={{ color: data.color }} />;
      default: return <Shield className="w-3.5 h-3.5" style={{ color: data.color }} />;
    }
  };

  return (
    <div 
      className="bg-white rounded-xl p-3 min-w-[180px] shadow-sm relative border"
      style={{ borderColor: data.color }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#94a3b8] !border-none" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-white">
            {getIcon()}
            <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]" title={data.name}>{data.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 bg-white">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{data.type}</span>
          {data.score > 0 && (
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded font-bold border" 
              style={{ backgroundColor: `${data.color}10`, color: data.color, borderColor: `${data.color}40` }}
            >
              Risk {data.score}
            </span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#94a3b8] !border-none" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode
};

export default function AttackGraphPage() {
  const { data: realAttackPaths, isLoading } = useTopAttackPaths();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  // Dynamically map backend Neo4j shortest paths to React Flow nodes/edges
  useEffect(() => {
    if (realAttackPaths && realAttackPaths.length > 0) {
      const newNodes: any[] = [];
      const newEdges: any[] = [];

      realAttackPaths.forEach((path, pathIdx) => {
        path.nodes.forEach((node: any, nodeIdx: number) => {
          const nodeName = node.name.split("/").pop() || node.name;
          const nodeId = `${pathIdx}-${node.name}`;
          
          let color = '#6366f1'; 
          if (node.label === 'Identity') color = '#ef4444'; 
          if (node.label === 'IPAddress') color = '#f97316'; 
          if (node.label === 'Resource' || node.label === 'DataStore') color = '#10b981'; 

          newNodes.push({
            id: nodeId,
            type: 'custom',
            data: { 
              name: nodeName, 
              type: node.label, 
              score: node.label === 'Identity' ? 80 : 0, 
              color: color 
            },
            position: { x: 50 + (pathIdx * 260), y: 50 + (nodeIdx * 130) }
          });
        });

        path.edges.forEach((edge: string, edgeIdx: number) => {
          const sourceId = `${pathIdx}-${path.nodes[edgeIdx].name}`;
          const targetId = `${pathIdx}-${path.nodes[edgeIdx + 1].name}`;
          const edgeId = `e-${sourceId}-${targetId}`;

          newEdges.push({
            id: edgeId,
            source: sourceId,
            target: targetId,
            animated: true,
            label: edge,
            style: { stroke: '#ef4444', strokeWidth: 1.5 },
            labelStyle: { fill: '#1e293b', fontWeight: 700, fontSize: 9 },
            labelBgStyle: { fill: '#f1f5f9' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [realAttackPaths, setNodes, setEdges]);

  const activePaths = realAttackPaths
    ? realAttackPaths.map((path, idx) => {
        const sourceName = path.nodes[0]?.name.split("/").pop() || path.nodes[0]?.name || "Unknown Source";
        const targetName = path.nodes[path.nodes.length - 1]?.name.split("/").pop() || path.nodes[path.nodes.length - 1]?.name || "Unknown Target";
        const hops = path.nodes.reduce((acc: string[], node: any, nodeIdx: number) => {
          acc.push(node.name.split("/").pop() || node.name);
          if (nodeIdx < path.edges.length) {
            acc.push(path.edges[nodeIdx]);
          }
          return acc;
        }, []);
        return {
          id: `PATH-${1000 + idx}`,
          source: sourceName,
          target: targetName,
          severity: path.severity || "High",
          steps: path.edges.length,
          status: "Open",
          hops: hops
        };
      })
    : [];

  return (
    <div className="animate-in fade-in duration-500 pb-12 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-indigo-600" />
            Investigations
          </h1>
          <p className="text-slate-500 mt-1 text-sm">AI-modeled blast radius across identities, services, and data stores</p>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> {activePaths.filter(p => p.severity === 'Critical').length} critical paths
          </div>
          <div className="bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {activePaths.filter(p => p.severity === 'High').length} high paths
          </div>
        </div>
      </div>

      {/* Graph Panel */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden relative shadow-sm flex flex-col h-[500px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center text-indigo-600 animate-pulse text-xs font-semibold">
            Querying Graph Database...
          </div>
        ) : activePaths.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 p-8">
            <Info className="w-12 h-12 text-slate-300" />
            <h3 className="font-bold text-slate-700">No Attack Paths Found</h3>
            <p className="text-slate-400 text-xs max-w-sm text-center">
              No critical exposure chains currently exist between identities and sensitive cloud datastores.
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#cbd5e1" gap={24} size={1} />
            <Controls />
          </ReactFlow>
        )}
      </div>

      {/* Paths Listing Panel */}
      <div className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-slate-800 font-bold text-sm">Potential Blast Radius Attack Paths</h2>
        </div>
        
        <div className="overflow-x-auto">
          {activePaths.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No data available.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 w-12"></th>
                  <th className="p-4">Path ID</th>
                  <th className="p-4">Source Identity</th>
                  <th className="p-4">Target Node</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4 text-center">Hops</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {activePaths.map((path) => (
                  <React.Fragment key={path.id}>
                    <tr 
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                      onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
                    >
                      <td className="p-4 text-center">
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedPath === path.id ? "rotate-90" : ""}`} />
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">{path.id}</td>
                      <td className="p-4 font-semibold text-slate-800">{path.source}</td>
                      <td className="p-4 font-semibold text-slate-800">{path.target}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          path.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {path.severity}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-xs text-slate-500">{path.steps}</td>
                      <td className="p-4">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                          {path.status}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Expanded Path Hops */}
                    <AnimatePresence>
                      {expandedPath === path.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={7} className="p-0 border-b border-slate-100 bg-slate-50">
                            <div className="p-6 pl-16 bg-slate-50">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Path Execution Steps</h4>
                              <div className="flex flex-wrap items-center gap-2">
                                {path.hops.map((hop: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs text-slate-700 font-mono shadow-sm">
                                      {hop}
                                    </div>
                                    {i < path.hops.length - 1 && (
                                      <div className="w-8 h-px bg-rose-400 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-[6px] border-l-rose-400"></div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </div>
  );
}
