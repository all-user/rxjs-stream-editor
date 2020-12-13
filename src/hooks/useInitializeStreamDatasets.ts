import { useStore } from '../store';
import { StreamDataset } from '../core/StreamDataset';

export const useInitializeStreamDatasets = () => {
  const store = useStore();

  const streamDatasets: StreamDataset[] = [
    new StreamDataset({
      sourceCode: "fromEvent(document.defaultView, 'click')",
    }),
    new StreamDataset({
      sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))))',
    }),
    new StreamDataset({
      sourceCode: '_1$.pipe(map(ev => ev.length))',
    }),
    new StreamDataset({
      sourceCode: '_2$.pipe(filter(ev => ev === 2))',
    }),
  ];

  streamDatasets.forEach(streamDataset => {
    store.commit('domain/streamEditor/pushStreamDataset', {
      streamDataset,
    });
  });
};
