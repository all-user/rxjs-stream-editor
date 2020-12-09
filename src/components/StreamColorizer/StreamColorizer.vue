<template>
  <div class="StreamColorizer-root">
    <div class="StreamColorizer-colorMatcherRoot">
      <textarea
        class="StreamColorizer-colorMatcherSourceCode"
        v-model="boundColorMatcherSourceCode"
        rows="1"
      />
    </div>
    <div class="StreamColorizer-colorDefinitionsRoot">
      <PhotoshopPicker
        class="StreamColorizer-colorPicker"
        v-if="selectedColorDefinitionId"
        :value="boundColorCode"
        ref="colorPicker"
        @input="handleColorPickerInput"
        @ok="handleColorPickerOk"
        @cancel="handleColorPickerCancel"
      />
      <div class="StreamColorizer-colorDefinitionItemsWrapper">
        <div class="StreamColorizer-colorDefinitionItem"></div>
        <div class="StreamColorizer-colorDefinitionColumnHeaders">
          <div
            v-for="column in colorDefinitionColumnHeaders"
            :key="column"
            class="StreamColorizer-colorDefinitionItem"
            v-text="column"
          />
        </div>
        <div class="StreamColorizer-colorDefinitionRowHeaders">
          <div
            v-for="row in colorDefinitionRowHeaders"
            :key="row"
            class="StreamColorizer-colorDefinitionItem"
            v-text="row"
          />
        </div>
        <div class="StreamColorizer-colorDefinitionItems">
          <div
            v-for="colorDef in colorDefinitions"
            :key="colorDef.id"
            :style="getColorDefinitionStyle(colorDef)"
            class="StreamColorizer-colorDefinitionItem"
            @click="handleColorDefinitionClick(colorDef)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Component, computed } from 'vue';
import { Photoshop } from 'vue-color';
import { mapGetters, mapState } from 'vuex';
import { ColorDefinition } from '../../core/ColorDefinition';
import { useStore } from '../../store';
import { VueColorObject } from '../../types';

const StreamColorizer = defineComponent({
  components: {
    PhotoshopPicker: Photoshop,
  },
  computed: {
    ...mapState('domain/streamColorizer', ['selectedColorDefinitionId']),
    ...mapGetters('domain/streamColorizer', ['colorDefinitions']),
  },
  setup() {
    const store = useStore();

    const colorPicker = ref<null | (Component & { currentColor: string })>(
      null,
    );

    const boundColorMatcherSourceCode = computed({
      get() {
        return store.state.domain.streamColorizer.colorMatcherSourceCode;
      },
      set(sourceCode: string) {
        store.commit(
          'domain/streamColorizer/setColorMatcherSourceCode',
          sourceCode,
        );
      },
    });

    const boundColorCode = computed((): string | null => {
      return (
        store.getters['domain/streamColorizer/selectedColorCode'] ?? '#ffffff'
      );
    });

    const handleColorPickerInput = (results: VueColorObject) => {
      if (
        store.state.domain.streamColorizer.selectedColorDefinitionId == null
      ) {
        return;
      }
      const {
        rgba: { r, g, b, a },
        hex,
      } = results;
      store.commit('domain/streamColorizer/setColorCode', {
        colorDefinitionId:
          store.state.domain.streamColorizer.selectedColorDefinitionId,
        colorCode: a < 1 ? `rgba(${r},${g},${b},${a})` : hex,
      });
    };

    const handleColorPickerOk = () => {
      if (
        store.state.domain.streamColorizer.selectedColorDefinitionId == null
      ) {
        return;
      }
      store.commit('domain/streamColorizer/selectColorDefinition', null);
    };

    const handleColorPickerCancel = () => {
      if (
        store.state.domain.streamColorizer.selectedColorDefinitionId == null ||
        colorPicker.value == null
      ) {
        return;
      }
      store.commit('domain/streamColorizer/setColorCode', {
        colorDefinitionId:
          store.state.domain.streamColorizer.selectedColorDefinitionId,
        colorCode: colorPicker.value.currentColor,
      });
      store.commit('domain/streamColorizer/selectColorDefinition', null);
    };

    const colorDefinitionColumnHeaders = Object.freeze([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
    ] as const);

    const colorDefinitionRowHeaders = Object.freeze([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ] as const);

    const getColorDefinitionStyle = (
      colorDef: ColorDefinition,
    ): Partial<CSSStyleDeclaration> => {
      return {
        backgroundColor: colorDef.colorCode ?? 'transparent',
      };
    };

    const handleColorDefinitionClick = (colorDef: ColorDefinition) => {
      store.commit('domain/streamColorizer/selectColorDefinition', colorDef.id);
    };

    return {
      colorDefinitionColumnHeaders,
      colorDefinitionRowHeaders,
      handleColorDefinitionClick,
      getColorDefinitionStyle,
      handleColorPickerCancel,
      handleColorPickerOk,
      handleColorPickerInput,
      boundColorCode,
      boundColorMatcherSourceCode,
      colorPicker,
    };
  },
});

export default StreamColorizer;
</script>
<style lang="stylus" scoped>
@import 'rxjs-se-stylus'

.StreamColorizer-root
  display: flex
  flex-flow: row nowrap
  padding: 8px

.StreamColorizer-colorMatcherRoot
  flex: 1 1 0
  padding: 8px

.StreamColorizer-colorMatcherSourceCode
  color: black
  font-size: 14px
  font-family: $se-font-family-monospace
  line-height: 1.7em
  padding: 2px 10px
  width: 100%
  height: 100%
  max-height: 50vh
  border: none
  outline: none
  background-color: rgba(0,0,0,.1)
  border: 1px solid rgba(0,0,0,.1)
  resize: vertical

.StreamColorizer-colorDefinitionsRoot
  padding: 8px;
  flex: 0 0 auto
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center

.StreamColorizer-colorPicker
  position: fixed
  top: 50%
  left: 50%
  z-index: 3
  transform: translate(-50%,-50%)

.StreamColorizer-colorDefinitionItemsWrapper
  display: flex
  flex-flow: row wrap
  width: 270px + 2px
  height: 270px + 2px
  border: 1px solid rgba(0,0,0,.2)

.StreamColorizer-colorDefinitionColumnHeaders
  flex: 0 0 auto
  display: flex
  flex-flow: row nowrap
  width: 90%
  height: 10%

.StreamColorizer-colorDefinitionRowHeaders
  flex: 0 0 auto
  display: flex
  flex-flow: column nowrap
  width: 10%
  height: 90%

.StreamColorizer-colorDefinitionItems
  flex: 0 0 auto
  display: flex
  flex-flow: row wrap
  width: 90%
  height: 90%

.StreamColorizer-colorDefinitionItem
  flex: 0 0 auto
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  width: 27px
  height: 27px
  font-weight: bold
  font-size: 13px
  border: 1px solid rgba(0,0,0,.2)
</style>
