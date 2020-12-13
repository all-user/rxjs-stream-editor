import { StreamDataset } from '@/core/StreamDataset';
import { computed } from 'vue';
import { useStore } from '../store';

export const useSourceCode = (dataset?: StreamDataset) => {
  const store = useStore();

  const sourceCode = computed({
    get() {
      return dataset?.sourceCode || '';
    },
    set(value: string) {
      if (dataset == null) {
        return;
      }
      store.commit('domain/streamEditor/setSourceCode', {
        streamDatasetId: dataset.id,
        sourceCode: value,
      });
    },
  });

  return {
    sourceCode,
  };
};
