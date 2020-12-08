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
