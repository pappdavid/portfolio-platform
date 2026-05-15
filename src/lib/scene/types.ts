export type ModuleId = 'sentinel' | 'training' | 'chat';

export interface SceneHandle {
  focusModule(id: ModuleId): void;
  clearFocus(): void;
  getModuleScreenPositions(): Record<ModuleId, {
    x: number;
    y: number;
    inFront: boolean;
    focus: number;
  }>;
  destroy(): void;
}
