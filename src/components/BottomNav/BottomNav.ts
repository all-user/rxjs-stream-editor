import { useStore } from '../../store';
import { defineComponent } from 'vue';
import MessageOutput from '../MessageOutput/MessageOutput.vue';
import StreamColorizer from '../StreamColorizer/StreamColorizer.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

const BottomNav = defineComponent({
  components: {
    MessageOutput,
    StreamColorizer,
  },
  computed: {
    ...mapState('domain/streamEditor', ['errorMessage', 'message']),
    ...mapState('ui/bottomNav', ['enabled']),
    ...mapGetters('ui/bottomNav', ['isColorizerSelected']),
  },
  methods: {
    ...mapActions('ui/bottomNav', ['enable']),
  },
  setup() {
    const store = useStore();

    const selectColorizer = () => {
      store.dispatch('ui/bottomNav/selectContentOrToggleEnabled', 'colorizer');
    };

    return {
      selectColorizer,
    };
  },
});

export default BottomNav;
