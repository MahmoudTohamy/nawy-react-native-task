const SHARED_WINDOW = {
  windowSize: 10,
  maxToRenderPerBatch: 10,
  initialNumToRender: 8,
  updateCellsBatchingPeriod: 50,
} as const;

export const FLATLIST_REGISTRY = {
  ...SHARED_WINDOW,
  removeClippedSubviews: true,
} as const;

export const FLATLIST_ALERTS = {
  ...SHARED_WINDOW,
  removeClippedSubviews: false,
} as const;
