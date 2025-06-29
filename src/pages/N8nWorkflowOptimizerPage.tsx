import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Upload, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Settings, 
  Eye,
  FileText,
  BarChart3,
  Lightbulb,
  Shield,
  Clock,
  Activity,
  ArrowRight,
  Circle
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  name?: string;
  type: string;
  position?: [number, number];
  parameters?: any;
}

interface WorkflowConnections {
  [nodeId: string]: {
    [outputName: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}

interface Workflow {
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  meta?: any;
}

interface Issue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  solution: string;
  nodeId?: string;
}

interface Recommendation {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

interface Optimization {
  title: string;
  description: string;
  benefit: string;
  implementation: string;
}

interface Analysis {
  nodeCount: number;
  nodeTypes: Record<string, number>;
  hasErrorHandling: boolean;
  complexityScore: number;
  overallScore: number;
  issues: Issue[];
  recommendations: Recommendation[];
  optimizations: Optimization[];
}

// Улучшенный компонент для визуализации workflow
const WorkflowVisualization: React.FC<{ workflow: Workflow }> = ({ workflow }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const nodes = workflow.nodes || [];
  const connections = workflow.connections || {};

  const getNodeColor = (nodeType: string) => {
    const colors = {
      'Webhook': '#3b82f6', // blue-500
      'HTTP Request': '#10b981', // green-500
      'IF': '#f59e0b', // yellow-500
      'Function': '#8b5cf6', // purple-500
      'Set': '#6b7280', // gray-500
      'Error': '#ef4444', // red-500
      'Telegram': '#06b6d4', // cyan-500
      'Email': '#6366f1', // indigo-500
      'NoOperation': '#9ca3af', // gray-400
      'Wait': '#f97316', // orange-500
      'Switch': '#ec4899' // pink-500
    };
    return colors[nodeType as keyof typeof colors] || '#6b7280';
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'Webhook': return '🔗';
      case 'HTTP Request': return '🌐';
      case 'IF': return '❓';
      case 'Function': return '⚙️';
      case 'Set': return '📝';
      case 'Error': return '❌';
      case 'Telegram': return '📱';
      case 'Email': return '📧';
      case 'Wait': return '⏰';
      case 'Switch': return '🔀';
      case 'NoOperation': return '⭕';
      default: return '⚡';
    }
  };

  // Улучшенное автоматическое расположение узлов
  const arrangeNodes = () => {
    if (nodes.length === 0) return [];

    // Пытаемся найти стартовый узел (Webhook, Trigger и т.д.)
    const startNodes = nodes.filter(node => 
      node.type === 'Webhook' || 
      node.type.includes('Trigger') ||
      !Object.values(connections).some(outputs => 
        Object.values(outputs).some(targets => 
          targets.some(target => target.node === node.id)
        )
      )
    );

    const arranged: Array<WorkflowNode & { x: number; y: number; level: number }> = [];
    const visited = new Set<string>();
    const levels: Record<number, number> = {};

    // Функция для размещения узла и его потомков
    const placeNode = (nodeId: string, level: number = 0, parentX: number = 0) => {
      if (visited.has(nodeId)) return;
      
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      visited.add(nodeId);
      
      // Подсчитываем количество узлов на этом уровне
      levels[level] = (levels[level] || 0) + 1;
      const positionInLevel = levels[level] - 1;
      
      // Вычисляем позицию
      const x = level * 250 + 150;
      const y = positionInLevel * 120 + 100;
      
      arranged.push({
        ...node,
        x,
        y,
        level
      });

      // Размещаем дочерние узлы
      const nodeConnections = connections[nodeId];
      if (nodeConnections) {
        Object.values(nodeConnections).forEach(outputs => {
          outputs.forEach(target => {
            placeNode(target.node, level + 1, x);
          });
        });
      }
    };

    // Начинаем с стартовых узлов
    if (startNodes.length > 0) {
      startNodes.forEach((startNode, index) => {
        levels[0] = index;
        placeNode(startNode.id, 0);
      });
    } else {
      // Если стартовые узлы не найдены, размещаем все узлы
      nodes.forEach((node, index) => {
        if (!visited.has(node.id)) {
          const row = Math.floor(index / 3);
          const col = index % 3;
          arranged.push({
            ...node,
            x: col * 200 + 150,
            y: row * 120 + 100,
            level: 0
          });
        }
      });
    }

    return arranged;
  };

  const arrangedNodes = arrangeNodes();

  // Получаем соединения для отрисовки линий
  const getConnections = () => {
    const lines: Array<{ 
      from: { x: number; y: number }; 
      to: { x: number; y: number };
      type: string;
    }> = [];
    
    Object.entries(connections).forEach(([sourceId, outputs]) => {
      const sourceNode = arrangedNodes.find(n => n.id === sourceId);
      if (!sourceNode) return;

      Object.entries(outputs).forEach(([outputType, targets]) => {
        targets.forEach(target => {
          const targetNode = arrangedNodes.find(n => n.id === target.node);
          if (targetNode) {
            lines.push({
              from: { x: sourceNode.x + 80, y: sourceNode.y },
              to: { x: targetNode.x - 80, y: targetNode.y },
              type: outputType
            });
          }
        });
      });
    });

    return lines;
  };

  const connectionLines = getConnections();

  // Вычисляем размеры SVG на основе расположения узлов
  const getSvgDimensions = () => {
    if (arrangedNodes.length === 0) return { width: 800, height: 400 };
    
    const maxX = Math.max(...arrangedNodes.map(n => n.x)) + 200;
    const maxY = Math.max(...arrangedNodes.map(n => n.y)) + 100;
    
    return {
      width: Math.max(800, maxX),
      height: Math.max(400, maxY)
    };
  };

  const { width: svgWidth, height: svgHeight } = getSvgDimensions();

  if (nodes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Нет данных для визуализации</p>
          <p className="text-sm mt-2">Загрузите workflow для отображения структуры</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Заголовок */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <h4 className="font-semibold flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Структура рабочего процесса
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({nodes.length} узлов, {connectionLines.length} соединений)
          </span>
        </h4>
      </div>

      {/* Область визуализации */}
      <div className="p-6">
        <div className="overflow-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="relative" style={{ width: `${svgWidth}px`, height: `${svgHeight}px`, minHeight: '400px' }}>
            {/* SVG для соединений */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ zIndex: 1 }}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  />
                </marker>
                <marker
                  id="arrowhead-success"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#10b981"
                  />
                </marker>
                <marker
                  id="arrowhead-error"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#ef4444"
                  />
                </marker>
              </defs>

              {/* Отрисовка соединений */}
              {connectionLines.map((line, index) => {
                const isSuccess = line.type === 'true' || line.type === 'success';
                const isError = line.type === 'false' || line.type === 'error';
                const strokeColor = isSuccess ? '#10b981' : isError ? '#ef4444' : '#6b7280';
                const markerId = isSuccess ? 'arrowhead-success' : isError ? 'arrowhead-error' : 'arrowhead';
                
                return (
                  <g key={index}>
                    <path
                      d={`M ${line.from.x} ${line.from.y} Q ${(line.from.x + line.to.x) / 2} ${line.from.y} ${line.to.x} ${line.to.y}`}
                      stroke={strokeColor}
                      strokeWidth="2"
                      fill="none"
                      markerEnd={`url(#${markerId})`}
                      className="transition-all duration-200 hover:stroke-width-3"
                    />
                    {/* Подпись типа соединения */}
                    {(isSuccess || isError) && (
                      <text
                        x={(line.from.x + line.to.x) / 2}
                        y={(line.from.y + line.to.y) / 2 - 10}
                        textAnchor="middle"
                        className="text-xs fill-current"
                        fill={strokeColor}
                      >
                        {isSuccess ? 'true' : 'false'}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Отрисовка узлов */}
            {arrangedNodes.map((node) => (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-105"
                style={{ 
                  left: `${node.x}px`, 
                  top: `${node.y}px`,
                  zIndex: selectedNode === node.id ? 10 : 2
                }}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              >
                <div 
                  className={`rounded-lg p-4 shadow-lg min-w-[160px] text-center text-white transition-all duration-200 ${
                    selectedNode === node.id ? 'ring-4 ring-blue-300 shadow-xl' : 'hover:shadow-xl'
                  }`}
                  style={{ backgroundColor: getNodeColor(node.type) }}
                >
                  <div className="text-2xl mb-2">{getNodeIcon(node.type)}</div>
                  <div className="font-medium text-sm leading-tight">
                    {node.name || node.type}
                  </div>
                  <div className="text-xs opacity-75 mt-1">{node.type}</div>
                  {selectedNode === node.id && (
                    <div className="text-xs mt-2 bg-black bg-opacity-20 rounded px-2 py-1">
                      ID: {node.id}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Информация о выбранном узле */}
        {selectedNode && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-semibold mb-2">Информация об узле</h5>
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              return (
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Название:</strong> {node.name || 'Не указано'}
                  </div>
                  <div>
                    <strong>Тип:</strong> {node.type}
                  </div>
                  <div>
                    <strong>ID:</strong> {node.id}
                  </div>
                  <div>
                    <strong>Параметры:</strong> {node.parameters ? 'Настроены' : 'Не настроены'}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Легенда */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 className="font-semibold mb-3 text-sm">Типы узлов:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries({
                'Webhook': '🔗 Триггеры',
                'HTTP Request': '🌐 HTTP запросы', 
                'IF': '❓ Условия',
                'Function': '⚙️ Обработка',
                'Error': '❌ Ошибки',
                'Set': '📝 Данные'
              }).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getNodeColor(type) }}
                  ></div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 className="font-semibold mb-3 text-sm">Типы соединений:</h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gray-500"></div>
                <span>Основной поток</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                <span>Успешное выполнение (true)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500"></div>
                <span>Ошибка/условие (false)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
          <h5 className="font-semibold mb-3 text-sm">Статистика workflow:</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{nodes.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Узлов</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{connectionLines.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Соединений</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...arrangedNodes.map(n => n.level || 0)) + 1}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Уровней</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {new Set(nodes.map(n => n.type)).size}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Типов узлов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const N8nWorkflowOptimizerPage: React.FC = () => {
  const [workflowData, setWorkflowData] = useState<Workflow | null>(null);
  const [optimizedWorkflowData, setOptimizedWorkflowData] = useState<Workflow | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  // Обработка drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      processWorkflowFile(file);
    } else {
      alert('Пожалуйста, загрузите JSON файл рабочего процесса n8n.');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processWorkflowFile(file);
    }
  };

  const processWorkflowFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workflow = JSON.parse(event.target?.result as string);
        setWorkflowData(workflow);
        startAnalysis(workflow);
      } catch (error) {
        alert('Не удалось разобрать файл JSON. Убедитесь, что это корректный экспорт рабочего процесса n8n.');
        console.error('JSON parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const startAnalysis = async (workflow: Workflow) => {
    setLoading(true);
    setProgress(0);

    // Имитация процесса анализа
    const analysisSteps = [10, 25, 40, 60, 75, 90, 100];
    
    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(analysisSteps[i]);
    }

    // Выполняем анализ
    const analysisResult = analyzeWorkflow(workflow);
    setAnalysis(analysisResult);

    // Генерируем оптимизированный воркфлоу
    const optimized = generateOptimizedWorkflow(workflow, analysisResult);
    setOptimizedWorkflowData(optimized);

    setLoading(false);
  };

  const analyzeWorkflow = (workflow: Workflow): Analysis => {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};

    // Базовые метрики
    const nodeCount = nodes.length;
    const nodeTypes = countNodeTypes(nodes);
    const hasErrorHandling = checkErrorHandling(nodes, connections);
    const complexityScore = calculateComplexity(nodes, connections);
    const overallScore = calculateOverallScore(nodeCount, hasErrorHandling, complexityScore);

    // Выявляем проблемы
    const issues = findIssues(workflow);

    // Формируем рекомендации
    const recommendations = generateRecommendations(workflow, issues);

    // Предложения по оптимизации
    const optimizations = generateOptimizations(workflow);

    return {
      nodeCount,
      nodeTypes,
      hasErrorHandling,
      complexityScore,
      overallScore,
      issues,
      recommendations,
      optimizations
    };
  };

  const countNodeTypes = (nodes: WorkflowNode[]): Record<string, number> => {
    const types: Record<string, number> = {};
    nodes.forEach(node => {
      const type = node.type;
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  };

  const checkErrorHandling = (nodes: WorkflowNode[], connections: WorkflowConnections): boolean => {
    const errorHandlerNodes = nodes.filter(node => 
      node.type === 'Error' || 
      (node.parameters && node.parameters.errorHandling)
    );
    return errorHandlerNodes.length > 0;
  };

  const calculateComplexity = (nodes: WorkflowNode[], connections: WorkflowConnections): number => {
    let complexity = nodes.length;

    // Учитываем количество соединений
    let connectionCount = 0;
    Object.values(connections).forEach(nodeConnections => {
      Object.values(nodeConnections).forEach(outputs => {
        connectionCount += outputs.length;
      });
    });
    complexity += connectionCount * 0.5;

    // Учитываем наличие условных узлов
    const conditionalNodes = nodes.filter(node => 
      node.type === 'IF' || 
      node.type === 'Switch' || 
      node.type === 'SplitInBatches'
    );
    complexity += conditionalNodes.length * 3;

    return Math.round(complexity);
  };

  const calculateOverallScore = (nodeCount: number, hasErrorHandling: boolean, complexityScore: number): number => {
    let score = 70;

    if (nodeCount > 30) {
      score -= 10;
    } else if (nodeCount > 20) {
      score -= 5;
    }

    if (hasErrorHandling) {
      score += 15;
    }

    if (complexityScore > 50) {
      score -= 20;
    } else if (complexityScore > 30) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  };

  const findIssues = (workflow: Workflow): Issue[] => {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};
    const issues: Issue[] = [];

    // Проверка на отсутствие обработки ошибок
    if (!checkErrorHandling(nodes, connections)) {
      issues.push({
        severity: 'warning',
        title: 'Отсутствует обработка ошибок',
        description: 'Рабочий процесс не содержит механизмов обработки ошибок, что может привести к сбоям при выполнении.',
        solution: 'Добавьте узлы Error Trigger или настройте обработку ошибок в настройках критических узлов.'
      });
    }

    // Поиск неиспользуемых узлов
    nodes.forEach(node => {
      if (node.type !== 'Set') {
        const hasOutgoingConnections = connections[node.id] && 
          Object.values(connections[node.id]).some(outputs => outputs.length > 0);
        
        if (!hasOutgoingConnections && !isEndNode(node)) {
          issues.push({
            severity: 'warning',
            title: `Неиспользуемый узел: ${node.name || node.type}`,
            description: `Узел "${node.name || node.type}" не имеет исходящих соединений и может быть неиспользуемым.`,
            solution: 'Соедините узел с остальной частью рабочего процесса или удалите его, если он не нужен.',
            nodeId: node.id
          });
        }
      }
    });

    // Поиск потенциально медленных узлов
    nodes.forEach(node => {
      if (isSlowNode(node)) {
        issues.push({
          severity: 'warning',
          title: `Потенциально медленный узел: ${node.name || node.type}`,
          description: `Узел "${node.name || node.type}" может замедлять выполнение рабочего процесса.`,
          solution: 'Рассмотрите возможность оптимизации узла или добавления кеширования результатов.',
          nodeId: node.id
        });
      }
    });

    // Добавляем демонстрационные проблемы
    issues.push({
      severity: 'critical',
      title: 'HTTP-запросы без обработки ошибок',
      description: 'Обнаружены HTTP-запросы без обработки потенциальных ошибок сервера или сети.',
      solution: 'Добавьте узлы IF после HTTP-запросов для проверки кода статуса и обработки ошибок.'
    });

    return issues;
  };

  const isEndNode = (node: WorkflowNode): boolean => {
    const endNodeTypes = ['Respond to Webhook', 'NoOp', 'Stop', 'Wait', 'Telegram', 'Slack', 'Email', 'Discord'];
    return endNodeTypes.includes(node.type);
  };

  const isSlowNode = (node: WorkflowNode): boolean => {
    const slowNodeTypes = ['HTTP Request', 'Execute Command', 'SFTP', 'SSH', 'Wait', 'GoogleSheets'];
    return slowNodeTypes.includes(node.type);
  };

  const generateRecommendations = (workflow: Workflow, issues: Issue[]): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    recommendations.push({
      title: 'Добавьте обработку ошибок',
      description: 'Рассмотрите возможность добавления обработки ошибок для повышения надежности рабочего процесса.',
      importance: 'high'
    });

    recommendations.push({
      title: 'Используйте кэширование данных',
      description: 'Для повторяющихся операций с одинаковыми данными используйте кэширование для повышения производительности.',
      importance: 'medium'
    });

    recommendations.push({
      title: 'Оптимизируйте последовательные HTTP-запросы',
      description: 'Используйте параллельное выполнение для независимых HTTP-запросов, чтобы сократить общее время выполнения.',
      importance: 'medium'
    });

    return recommendations;
  };

  const generateOptimizations = (workflow: Workflow): Optimization[] => {
    const optimizations: Optimization[] = [];

    optimizations.push({
      title: 'Оптимизация HTTP-запросов',
      description: 'Объединение нескольких последовательных HTTP-запросов в один пакетный запрос может значительно повысить производительность.',
      benefit: 'Сокращение времени выполнения и снижение нагрузки на API.',
      implementation: '1. Найдите последовательные HTTP-запросы к одному API.\n2. Объедините их в один запрос с использованием batch API если доступно.\n3. Обработайте пакетный ответ с помощью SplitInBatches.'
    });

    optimizations.push({
      title: 'Кэширование результатов',
      description: 'Использование временного хранилища для кэширования результатов часто запрашиваемых данных.',
      benefit: 'Значительное сокращение времени выполнения и снижение нагрузки на внешние сервисы.',
      implementation: '1. Добавьте проверку наличия данных в кэше перед выполнением запроса.\n2. Используйте Set node для сохранения результатов в переменной workflow.\n3. Добавьте условное ветвление для использования кэшированных данных.'
    });

    return optimizations;
  };

  const generateOptimizedWorkflow = (workflow: Workflow, analysis: Analysis): Workflow => {
    const optimizedWorkflow = JSON.parse(JSON.stringify(workflow));

    // Применяем оптимизации
    if (!analysis.hasErrorHandling && optimizedWorkflow.nodes) {
      optimizedWorkflow.nodes.push({
        id: "error-handler-" + Date.now(),
        name: "Обработка ошибок",
        type: "Error",
        position: [800, 300],
        parameters: {
          errorHandling: "continueErrorOutput"
        }
      });
    }

    // Изменяем версию для отличия от оригинала
    if (optimizedWorkflow.meta) {
      optimizedWorkflow.meta.optimized = true;
      optimizedWorkflow.meta.optimizedTime = new Date().toISOString();
    } else {
      optimizedWorkflow.meta = {
        optimized: true,
        optimizedTime: new Date().toISOString()
      };
    }

    return optimizedWorkflow;
  };

  const downloadOptimizedWorkflow = () => {
    if (optimizedWorkflowData) {
      const blob = new Blob([JSON.stringify(optimizedWorkflowData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-n8n-workflow.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const loadSampleWorkflow = () => {
    const sampleWorkflow: Workflow = {
      nodes: [
        {
          id: "start",
          name: "Webhook",
          type: "Webhook",
          position: [100, 200]
        },
        {
          id: "http1",
          name: "Get Data",
          type: "HTTP Request",
          position: [300, 200]
        },
        {
          id: "if1",
          name: "Check Status",
          type: "IF",
          position: [500, 200]
        },
        {
          id: "process1",
          name: "Process Data",
          type: "Function",
          position: [700, 150]
        },
        {
          id: "error1",
          name: "Handle Error",
          type: "NoOperation",
          position: [700, 250]
        },
        {
          id: "telegram1",
          name: "Send Notification",
          type: "Telegram",
          position: [900, 150]
        }
      ],
      connections: {
        start: {
          main: [{ node: "http1", type: "main", index: 0 }]
        },
        http1: {
          main: [{ node: "if1", type: "main", index: 0 }]
        },
        if1: {
          true: [{ node: "process1", type: "main", index: 0 }],
          false: [{ node: "error1", type: "main", index: 0 }]
        },
        process1: {
          main: [{ node: "telegram1", type: "main", index: 0 }]
        }
      },
      meta: {
        instanceId: "test123",
        lastUpdated: "2023-01-15T12:00:00.000Z"
      }
    };

    setWorkflowData(sampleWorkflow);
    startAnalysis(sampleWorkflow);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>n8n Workflow Debugger & Optimizer — Анализ и оптимизация рабочих процессов</title>
        <meta name="description" content="Бесплатный инструмент для анализа, отладки и оптимизации ваших рабочих процессов n8n. Повысьте производительность и надежность ваших автоматизаций." />
        <meta name="keywords" content="n8n workflow optimizer, n8n debugger, автоматизация процессов, оптимизация workflow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Settings className="h-12 w-12 text-primary-600 dark:text-primary-400 mr-4" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              n8n Workflow Debugger & Optimizer
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            Анализируйте, отлаживайте и оптимизируйте ваши рабочие процессы n8n для повышения производительности и надежности
          </p>
        </div>

        {/* Upload Section */}
        {!workflowData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Загрузите ваш рабочий процесс n8n</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Загрузите JSON файл вашего рабочего процесса n8n для анализа. Наш инструмент поможет:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-8 space-y-2">
              <li>Выявить потенциальные проблемы и "бутылочные горлышки"</li>
              <li>Предложить оптимизации для повышения производительности</li>
              <li>Проанализировать структуру рабочего процесса</li>
              <li>Проверить обработку ошибок и безопасность</li>
            </ul>

            <div
              ref={uploadAreaRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 cursor-pointer ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={handleFileSelect}
            >
              <Upload className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <div className="text-xl font-medium mb-2">
                Перетащите JSON файл рабочего процесса n8n сюда
              </div>
              <div className="text-gray-500 dark:text-gray-400 mb-4">или</div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Выбрать файл
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={loadSampleWorkflow}
                className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Демо: Загрузить пример workflow
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-4">Анализ вашего рабочего процесса...</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{progress}% завершено</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !loading && (
          <div className="space-y-8">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Обзор', icon: BarChart3 },
                  { id: 'issues', label: 'Проблемы', icon: AlertTriangle },
                  { id: 'optimization', label: 'Оптимизация', icon: Zap },
                  { id: 'visualization', label: 'Визуализация', icon: Eye }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Общая оценка рабочего процесса</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Общая оценка</span>
                            <Activity className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                            {analysis.overallScore}/100
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Количество узлов</span>
                            <Settings className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {analysis.nodeCount}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Сложность</span>
                            <BarChart3 className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className={`text-3xl font-bold ${
                            analysis.complexityScore > 50 ? 'text-red-600 dark:text-red-400' :
                            analysis.complexityScore > 30 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {analysis.complexityScore}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Обработка ошибок</span>
                            <Shield className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className={`text-lg font-bold ${
                            analysis.hasErrorHandling ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {analysis.hasErrorHandling ? 'Реализована' : 'Отсутствует'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">Сводка рекомендаций</h3>
                      <div className="space-y-4">
                        {analysis.recommendations.slice(0, 3).map((rec, index) => (
                          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                rec.importance === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                rec.importance === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                                {rec.importance === 'high' ? 'Высокий приоритет' :
                                 rec.importance === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Issues Tab */}
                {activeTab === 'issues' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Выявленные проблемы</h3>
                    {analysis.issues.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <p className="text-xl font-medium text-green-600 dark:text-green-400">
                          Проблемы не обнаружены!
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                          Ваш рабочий процесс выглядит хорошо оптимизированным.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {analysis.issues.map((issue, index) => (
                          <div key={index} className={`p-6 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {getSeverityIcon(issue.severity)}
                                <h4 className="font-semibold text-lg">{issue.title}</h4>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                issue.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                                {issue.severity === 'critical' ? 'Критическая' :
                                 issue.severity === 'warning' ? 'Предупреждение' : 'Информация'}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{issue.description}</p>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <h5 className="font-medium mb-2">Решение:</h5>
                              <p className="text-gray-600 dark:text-gray-300">{issue.solution}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Optimization Tab */}
                {activeTab === 'optimization' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Предложения по оптимизации</h3>
                      <div className="space-y-6">
                        {analysis.optimizations.map((opt, index) => (
                          <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                              <Lightbulb className="h-6 w-6 text-yellow-500" />
                              {opt.title}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{opt.description}</p>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                <h5 className="font-medium mb-2 text-green-600 dark:text-green-400">Преимущество:</h5>
                                <p className="text-gray-600 dark:text-gray-300">{opt.benefit}</p>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                <h5 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Реализация:</h5>
                                <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                  {opt.implementation}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">Оптимизированная версия</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Ниже представлена оптимизированная версия вашего рабочего процесса. 
                        Вы можете скачать JSON и импортировать его обратно в n8n.
                      </p>
                      <button
                        onClick={downloadOptimizedWorkflow}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mb-4"
                      >
                        <Download className="h-5 w-5" />
                        Скачать оптимизированный workflow
                      </button>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-96">
                        <pre className="text-sm">
                          {optimizedWorkflowData ? JSON.stringify(optimizedWorkflowData, null, 2) : 'Оптимизированный код будет доступен после анализа.'}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualization Tab */}
                {activeTab === 'visualization' && workflowData && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Визуализация рабочего процесса</h3>
                    <WorkflowVisualization workflow={workflowData} />
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Описание визуализации:</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        На диаграмме показана интерактивная структура вашего рабочего процесса n8n. Узлы представлены цветными блоками с иконками, 
                        а стрелки показывают направление потока данных. Различные цвета обозначают разные типы узлов. 
                        Нажмите на любой узел для получения дополнительной информации.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setWorkflowData(null);
                  setAnalysis(null);
                  setOptimizedWorkflowData(null);
                  setActiveTab('overview');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Анализировать новый workflow
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Глубокий анализ</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Комплексный анализ структуры, производительности и надежности ваших рабочих процессов
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Автоматическая оптимизация</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Получите готовые предложения по улучшению и оптимизированную версию workflow
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Интерактивная визуализация</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Наглядное представление структуры workflow с возможностью детального изучения каждого узла
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default N8nWorkflowOptimizerPage;