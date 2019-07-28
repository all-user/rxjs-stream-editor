<template>
  <textarea-autosize
    :class="{ 'StreamEditorTextarea-input': true, 'is-disabled': disabled }"
    type="text"
    v-model="sourceCode"
    rows="1"
    :disabled="disabled"
  />
</template>
<script lang="ts" src="./StreamEditorTextarea.ts"></script>
<style lang="stylus" src="./StreamEditorTextarea.styl" scoped></style>


