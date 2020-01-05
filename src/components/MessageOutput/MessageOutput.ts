import { Component, Vue } from 'vue-property-decorator';
import { domainStreamEditorModule } from '../../store/modules/internal';

@Component
export default class MessageOutput extends Vue.extend({
  computed: {
    ...domainStreamEditorModule.mapState(['errorMessage', 'message']),
  },
}) {}
