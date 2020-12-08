<template>
  <div v-if="errorMessage.length || message.length" class="MessageOutput-root">
    <div
      v-if="errorMessage.length"
      class="MessageOutput-errorMessage"
      v-text="errorMessage"
    />
    <div
      v-else-if="message.length"
      class="MessageOutput-message"
      v-text="message"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

const MessageOutput = defineComponent({
  computed: {
    ...mapState('domain/streamEditor', ['errorMessage', 'message']),
  },
});

export default MessageOutput;
</script>
<style lang="stylus" scoped>
@import 'rxjs-se-stylus'

.MessageOutput-errorMessage
  flex: 0 0 auto
  color: crimson
  font-size: 14px
  font-family: $se-font-family-monospace
  background-color: white
  width: 100%
  padding: 10px
  white-space: pre
  max-height: 300px
  overflow: auto

.MessageOutput-message
  flex: 0 0 auto
  color: black
  font-size: 14px
  font-family: $se-font-family-monospace
  background-color: white
  width: 100%
  padding: 10px
  white-space: pre
  max-height: 300px
  overflow: auto
</style>
