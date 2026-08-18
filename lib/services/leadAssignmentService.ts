import { prisma } from '@/lib/prisma'

export interface AssignLeadOptions {
  organizationId: string
  preferredMode?: 'round_robin' | 'least_busy' | 'manual'
  excludeAgentId?: string
}

/**
 * Finds the best available sales agent for a new lead based on the organization's assignment mode.
 */
export async function assignLeadToAvailableAgent(
  options: AssignLeadOptions
): Promise<string | null> {
  // Find all active sales agents in the organization
  const agents = await prisma.user.findMany({
    where: {
      organizationId: options.organizationId,
      role: { in: ['sales_agent', 'sales_manager', 'admin'] },
      id: options.excludeAgentId ? { not: options.excludeAgentId } : undefined,
    },
    include: {
      _count: {
        select: {
          assignedLeads: {
            where: {
              status: { in: ['new', 'contacted', 'interested', 'negotiation'] },
            },
          },
        },
      },
    },
  })

  if (agents.length === 0) {
    return null
  }

  const mode = options.preferredMode || 'round_robin'

  if (mode === 'least_busy') {
    // Sort agents by open lead count ascending
    agents.sort((a, b) => a._count.assignedLeads - b._count.assignedLeads)
    return agents[0].id
  }

  // Default: Round Robin based on last assigned lead timestamp
  const agentIds = agents.map((a) => a.id)
  const lastAssignedLead = await prisma.lead.findFirst({
    where: {
      organizationId: options.organizationId,
      assignedAgentId: { in: agentIds },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!lastAssignedLead || !lastAssignedLead.assignedAgentId) {
    return agents[0].id
  }

  const currentIndex = agentIds.indexOf(lastAssignedLead.assignedAgentId)
  const nextIndex = (currentIndex + 1) % agentIds.length
  return agentIds[nextIndex]
}
