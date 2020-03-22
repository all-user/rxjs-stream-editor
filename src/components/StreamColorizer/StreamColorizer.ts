import { Component, Vue } from 'vue-property-decorator';
import { VueConstructor } from 'vue';
import { domainStreamColorizerModule } from '../../store/modules/internal';
import { Photoshop } from 'vue-color';
import { ColorDefinition } from '../../core/ColorDefinition';

@Component({
  components: {
    PhotoshopPicker: Photoshop as VueConstructor,
  },
})
export default class StreamColorizer extends Vue.extend({
  computed: {
    ...domainStreamColorizerModule.mapState([
      'colorMatcherSourceCode',
      'selectedColorDefinitionId',
    ]),
    ...domainStreamColorizerModule.mapGetters([
      'selectedColorCode',
      'colorDefinitions',
    ]),
  },
  methods: {
    ...domainStreamColorizerModule.mapMutations([
      'setColorMatcherSourceCode',
      'setColorCode',
      'selectColorDefinition',
    ]),
  },
}) {
  public $refs!: {
    colorPicker: Vue & { currentColor: string };
  };

  get boundColorMatcherSourceCode() {
    return this.colorMatcherSourceCode;
  }
  set boundColorMatcherSourceCode(sourceCode: string) {
    this.setColorMatcherSourceCode(sourceCode);
  }

  get boundColorCode(): string | null {
    return this.selectedColorCode ?? '#ffffff';
  }
  public handleColorPickerInput(results: VueColorObject) {
    if (this.selectedColorDefinitionId == null) {
      return;
    }
    const {
      rgba: { r, g, b, a },
      hex,
    } = results;
    this.setColorCode({
      colorDefinitionId: this.selectedColorDefinitionId,
      colorCode: a < 1 ? `rgba(${r},${g},${b},${a})` : hex,
    });
  }
  public handleColorPickerOk() {
    if (this.selectedColorDefinitionId == null) {
      return;
    }
    this.selectColorDefinition(null);
  }
  public handleColorPickerCancel() {
    if (this.selectedColorDefinitionId == null) {
      return;
    }
    this.setColorCode({
      colorDefinitionId: this.selectedColorDefinitionId,
      colorCode: this.$refs.colorPicker.currentColor,
    });
    this.selectColorDefinition(null);
  }

  get colorDefinitionColumnHeaders() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  }

  get colorDefinitionRowHeaders() {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  }

  public getColorDefinitionStyle(
    colorDef: ColorDefinition,
  ): Partial<CSSStyleDeclaration> {
    return {
      backgroundColor: colorDef.colorCode ?? 'transparent',
    };
  }

  public handleColorDefinitionClick(colorDef: ColorDefinition) {
    this.selectColorDefinition(colorDef.id);
  }
}
