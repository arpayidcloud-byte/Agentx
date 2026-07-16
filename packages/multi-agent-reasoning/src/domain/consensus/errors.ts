/**
 * @module multi-agent-reasoning/domain/consensus/errors
 * @description Consensus domain errors.
 */

export class ConsensusError extends Error {
  constructor(message: string, public readonly code: string, public readonly source: string) {
    super(message);
    this.name = 'ConsensusError';
  }
}
