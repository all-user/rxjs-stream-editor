<template>
  <textarea
    :class="{ 'StreamEditorTextarea-input': true, 'is-disabled': disabled }"
    v-model="sourceCode"
    rows="1"
    :disabled="disabled"
  />
</template>
<script lang="ts">
import { useStore } from '../../store';
import { StreamDataset } from '../../core/StreamDataset';
import { computed, defineComponent } from 'vue';

const StreamEditorTextarea = defineComponent({
  props: {
    dataset: {
      type: StreamDataset,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const sourceCode = computed({
      get() {
        return props.dataset?.sourceCode || '';
      },
      set(value: string) {
        if (props.dataset == null) {
          return;
        }
        store.commit('domain/streamEditor/setSourceCode', {
          streamDatasetId: props.dataset.id,
          sourceCode: value,
        });
      },
    });

    return {
      sourceCode,
    };
  },
});

export default StreamEditorTextarea;
</script>
<style lang="stylus" scoped>
@import 'rxjs-se-stylus'

.StreamEditorTextarea-input
  color: black
  font-size: 14px
  font-family: $se-font-family-monospace
  line-height: 1.7em
  padding: 2px 10px
  width: 100%
  border: none
  outline: none
  background-color: transparent
  resize: vertical
</style>
