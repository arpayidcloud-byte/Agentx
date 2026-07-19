export interface DecompositionInput {
  readonly goalId: string;
  readonly title: string;
  readonly description: string;
  readonly context: Record<string, unknown>;
}

export interface DecompositionOutput {
  readonly subtasks: Array<{
    id: string;
    title: string;
    description: string;
    dependencies: string[];
    estimatedComplexity: 'low' | 'medium' | 'high';
  }>;
}

export interface IDecomposer {
  decompose(input: DecompositionInput): Promise<DecompositionOutput>;
}
