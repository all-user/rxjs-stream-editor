import { Component, Vue } from 'vue-property-decorator';
import {
  domainStreamEditorModule,
  uiBottomNavModule,
} from '../../store/modules/internal';
import MessageOutput from '../MessageOutput/MessageOutput.vue';
import StreamColorizer from '../StreamColorizer/StreamColorizer.vue';

@Component({
  components: {
    MessageOutput,
    StreamColorizer,
  },
})
export default class BottomNav extends Vue.extend({
  computed: {
    ...domainStreamEditorModule.mapState(['errorMessage', 'message']),
    ...uiBottomNavModule.mapState(['enabled']),
    ...uiBottomNavModule.mapGetters(['isColorizerSelected']),
  },
  methods: {
    ...uiBottomNavModule.mapActions(['enable', 'selectContentOrToggleEnabled']),
  },
}) {
  public selectColorizer() {
    this.selectContentOrToggleEnabled('colorizer');
  }
}
