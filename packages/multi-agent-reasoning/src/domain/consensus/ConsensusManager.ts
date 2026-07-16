/**
 * @module multi-agent-reasoning/domain/consensus/ConsensusManager
 * @description Deterministic consensus mechanism.
 */

import { ConsensusResult } from './interfaces.js';
import { ConsensusError } from './errors.js';

export interface ConsensusRound {
  id: string;
  proposalId: string;
  votes: Record<string, boolean>;
  status: 'PENDING' | 'RESOLVED';
}

export class ConsensusManager {
  private rounds = new Map<string, ConsensusRound>();
  private results: ConsensusResult[] = [];

  startRound(proposalId: string, agents: string[]): ConsensusRound {
    const round: ConsensusRound = {
      id: `round-${Date.now()}`,
      proposalId,
      votes: {},
      status: 'PENDING',
    };
    agents.forEach(a => round.votes[a] = false);
    this.rounds.set(round.id, round);
    return round;
  }

  castVote(roundId: string, agentId: string, vote: boolean): void {
    const round = this.rounds.get(roundId);
    if (!round) throw new ConsensusError(`Round not found: ${roundId}`, 'consensus');
    if (!(agentId in round.votes)) throw new ConsensusError(`Agent not in round: ${agentId}`, 'consensus');
    round.votes[agentId] = vote;
  }

  resolveRound(roundId: string): ConsensusResult {
    const round = this.rounds.get(roundId);
    if (!round) throw new ConsensusError(`Round not found: ${roundId}`, 'consensus');
    
    const approved = Object.values(round.votes).filter(v => v).length > Object.values(round.votes).length / 2;
    round.status = 'RESOLVED';
    
    const result: ConsensusResult = {
      proposalId: round.proposalId,
      approved,
      votes: round.votes,
      timestamp: new Date(),
    };
    this.results.push(result);
    return result;
  }

  getRound(roundId: string): ConsensusRound | undefined {
    return this.rounds.get(roundId);
  }

  getResults(): ConsensusResult[] {
    return [...this.results];
  }
}
