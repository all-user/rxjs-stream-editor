<template>
  <div class="BottomNav-root">
    <MessageOutput class="BottomNav-messageOutput" />
    <div class="BottomNav-content">
      <template v-if="enabled">
        <StreamColorizer v-if="isColorizerSelected" />
      </template>
    </div>
    <div class="BottomNav-navItems">
      <div
        class="BottomNav-navItem"
        :class="{ 'is-selected': isColorizerSelected, 'is-enabled': enabled }"
        @click="selectColorizer"
      >
        COLORIZER
      </div>
    </div>
  </div>
</template>
<script lang="ts">
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
</script>
<style lang="stylus" scoped>
@import 'rxjs-se-stylus'

.BottomNav-root
  position: sticky
  bottom: 0
  display: flex
  flex-flow: column nowrap
  background-color: ivory
  z-index: 2

.BottomNav-messageOutput
  border-top: solid 1px black

.BottomNav-content
  border-top: solid 1px black

.BottomNav-navItems
  display: flex
  flex-flow: row nowrap
  background-color: rgba(0,0,0,.2)

.BottomNav-navItem
  flex: 1 1 auto
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  max-width: 120px
  padding: 8px
  font-weight: bold
  background-color: transparent
  &.is-enabled.is-selected
    background-color: ivory
</style>
