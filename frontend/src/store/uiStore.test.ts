import { useUiStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ compact: false, addedCount: 0 });
  });

  it('toggles compact mode', () => {
    expect(useUiStore.getState().compact).toBe(false);
    useUiStore.getState().toggleCompact();
    expect(useUiStore.getState().compact).toBe(true);
    useUiStore.getState().toggleCompact();
    expect(useUiStore.getState().compact).toBe(false);
  });

  it('increments the added count', () => {
    useUiStore.getState().incrementAddedCount();
    useUiStore.getState().incrementAddedCount();
    expect(useUiStore.getState().addedCount).toBe(2);
  });
});
