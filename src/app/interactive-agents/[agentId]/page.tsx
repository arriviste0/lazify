import { interactiveAgentsData } from '@/lib/data';
import AgentDemoClient from './AgentDemoClient';

export function generateStaticParams() {
  return [
    { agentId: 'inboxzero' },
    { agentId: 'leadspark' },
    { agentId: 'contentcraft' },
    { agentId: 'schedulesync' },
    { agentId: 'taskmaster' },
    { agentId: 'financetracker' },
    { agentId: 'shopsmart' },
  ];
}

export default function AgentDemoPage({ params }: { params: { agentId: string } }) {
  const agent = interactiveAgentsData.find((a) => a.id === params.agentId);

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return <AgentDemoClient agent={agent} />;
}
