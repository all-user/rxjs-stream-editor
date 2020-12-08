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
<script lang="ts" src="./MessageOutput.ts"></script>
<style lang="stylus" src="./MessageOutput.styl" scoped></style>
