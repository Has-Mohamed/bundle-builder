import type { StepDefinition } from '../types/domain';

export const stepDefinitions: StepDefinition[] = [
  { id: 'cameras', order: 1, title: 'Choose your cameras', icon: 'camera' },
  { id: 'plan', order: 2, title: 'Choose your plan', icon: 'shield' },
  { id: 'sensors', order: 3, title: 'Choose your sensors', icon: 'sensor' },
  { id: 'protection', order: 4, title: 'Add extra protection', icon: 'protection' },
];
