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
<script lang="ts" src="./BottomNav.ts"></script>
<style lang="stylus" src="./BottomNav.styl" scoped></style>
