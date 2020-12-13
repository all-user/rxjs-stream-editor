<template>
  <header class="AppHeader-root">
    <h1 class="AppHeader-title">rxjs-stream-editor</h1>
    <nav class="AppHeader-nav">
      <a
        class="AppHeader-link"
        href="https://rxjs-dev.firebaseapp.com/api"
        target="_blank"
      >
        RxJS API DOCS
      </a>
      <a
        class="AppHeader-link"
        href="http://memowomome.hatenablog.com/entry/js_async_viz#%E4%BD%99%E8%AB%87%E3%81%A7%E3%81%82%E3%82%8A%E6%9C%AC%E9%A1%8C%E3%81%AERxJS"
        target="_blank"
      >
        BLOG
      </a>
      <a
        class="AppHeader-link"
        href="https://github.com/all-user/rxjs-stream-editor"
        target="_blank"
      >
        GitHub
      </a>
    </nav>
  </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

const AppHeader = defineComponent({});

export default AppHeader;
</script>
<style lang="stylus" scoped>
.AppHeader-root
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: flex-star
  background-color: ivory
  padding: 5px 20px
  @media (max-width: 640px)
    padding: 10px 5px

.AppHeader-title
  flex: 1 0 auto
  color: black
  margin: 0
  font-size: 32px
  @media (max-width: 640px)
    font-size: 17px

.AppHeader-nav
  flex: 0 0 auto

.AppHeader-link
  color: black
  font-size: 16px
  font-weight: bold
  text-decoration: none
  margin: 0 0 0 20px
  @media (max-width: 640px)
    font-size: 10px
    margin: 0 0 0 8px
</style>
