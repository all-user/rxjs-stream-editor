<style lang="scss" src="./global.scss"></style>

<template>
  <div id="app">
    <StreamExpressionInput
      v-for="(v, i) in expressions"
      v-model="expressions[i].value"
      key="v.uuid"
    />
  </div>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss" scoped src="./App.scss"></style>
