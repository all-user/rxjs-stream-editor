import { defineComponent } from 'vue';
import { mapState } from 'vuex';

const MessageOutput = defineComponent({
  computed: {
    ...mapState('domain/streamEditor', ['errorMessage', 'message']),
  },
});

export default MessageOutput;
