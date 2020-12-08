<template>
  <div class="StreamEditor-root">
    <div class="StreamEditor-streamItems">
      <div
        v-for="(dataset, index) in streamDatasets"
        class="StreamEditor-streamItemWrapper"
        :key="dataset.id"
      >
        <StreamEditorItem
          class="StreamEditor-streamItem"
          :dataset="dataset"
          :index="index"
        />
        <div
          v-if="index === streamDatasets.length - 1"
          class="StreamEditor-removeStreamItemButton"
          @click="handleRemoveStream"
        >
          ×
        </div>
      </div>
      <div
        class="StreamEditor-streamItemWrapper StreamEditor-streamItemWrapper--addStreamItem"
      >
        <div @click="handleAddStream" class="StreamEditor-addStreamItemButton">
          +
        </div>
        <StreamEditorItem
          class="StreamEditor-streamItem--addStreamItem"
          :index="streamDatasets.length"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
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
</script>
<style lang="stylus" scoped>
@import 'rxjs-se-stylus'

.StreamEditor-root
  display: flex
  flex-flow: column nowrap
  align-items: center
  justify-content: center

.StreamEditor-streamItems
  flex: 1 0 auto
  width: 100%
  height: auto
  display: flex
  flex-flow: column nowrap
  align-items: flex-start
  justify-content: flex-start
  background-color: rgba(0,0,0,.05)
  overflow: hidden

.StreamEditor-streamItemWrapper
  display: flex
  flex-flow: column nowrap
  align-items: center
  justify-content: center
  width: 100%
  height: auto

.StreamEditor-addStreamItemButton
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  position: absolute
  width: 64px
  height: 64px
  font-size: 36px
  font-weight: bold
  color: black
  background-color: ivory
  border-radius: 50%
  z-index: 1
  border: solid 2px rgba(0,0,0,.64)
  cursor: pointer

.StreamEditor-removeStreamItemButton
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  width: 28px
  height: 28px
  color: crimson
  font-size: 24px
  font-weight: bold
  position: absolute
  top: 1px
  right: 1px
  background-color: ivory
  border: solid 2px rgba(0,0,0,.64)
  z-index: 1
  cursor: pointer

.StreamEditor-addStreamItemButton:hover + .StreamEditor-streamItem--addStreamItem
  opacity: 1

.StreamEditor-streamItem
  flex: 0 0 auto
  width: 100%

.StreamEditor-streamItem--addStreamItem
  width: 100%
  opacity: .4
  transition: opacity 200ms ease-in
</style>
