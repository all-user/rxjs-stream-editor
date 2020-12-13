import { useStore } from '../store';

export const useInitializeColorMatcherSourceCode = () => {
  const store = useStore();

  if (store.state.domain.streamColorizer.colorMatcherSourceCode.length) {
    return;
  }

  store.commit(
    'domain/streamColorizer/setColorMatcherSourceCode',
    `
event => {
  switch (event) {
    case 2:
      return 'a1';
    default:
      return null;
  }
}
        `.trim(),
  );
};
