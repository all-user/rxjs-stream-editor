import debounce from 'lodash-es/debounce';
import { mapGetters } from 'vuex';
import { defineComponent, watch, onBeforeMount, computed } from 'vue';
import { useStore } from '../../store';
import { StreamDataset } from '../../core/StreamDataset';
import StreamEditorItem from '../StreamEditorItem/StreamEditorItem.vue';

const StreamEditor = defineComponent({
  components: {
    StreamEditorItem,
  },
  computed: {
    ...mapGetters('domain/streamEditor', ['streamDatasets']),
  },
  setup() {
    const store = useStore();

    const evaluateSourceCodeDebounced = debounce(
      () => store.dispatch('domain/streamEditor/evaluateSourceCode'),
      500,
    );

    const sourceCode = computed(
      () => store.getters['domain/streamEditor/sourceCode'],
    );

    watch(sourceCode, evaluateSourceCodeDebounced);

    const handleAddStream = () => {
      store.commit('domain/streamEditor/pushStreamDataset', {
        streamDataset: new StreamDataset({
          sourceCode: `_${store.getters['domain/streamEditor/streamDatasets']
            .length - 1}$`,
        }),
      });
    };

    const handleRemoveStream = () => {
      store.commit('domain/streamEditor/popStreamDataset');
    };

    onBeforeMount(() => {
      store.dispatch('domain/streamEditor/evaluateSourceCode');
    });

    return {
      handleAddStream,
      handleRemoveStream,
    };
  },
});

export default StreamEditor;
