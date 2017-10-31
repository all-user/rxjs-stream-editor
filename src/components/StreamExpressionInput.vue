<template>
  <div>
    <input
      class="stream-expression-input"
      ref="input"
      :value="value"
      @input="updateValue($event.target.value)"
    />
    <div class="stream-viewer"></div>
  </div>
</template>

<script lang="ts" src="./StreamExpressionInput.ts"></script>
<style lang="scss" scoped src="./StreamExpressionInput.scss"></style>
