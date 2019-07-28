<template>
  <div class="StreamEditor-root">
    <div class="StreamEditor-streamItems">
      <StreamEditorItem
        v-for="(item, index) in streamItems"
        class="StreamEditor-streamItem"
        :key="item.id"
        :item="item"
        :index="index"
      />
      <div @click="handleAddStream" class="StreamEditor-addStreamItem">
        <StreamEditorItem
          class="StreamEditor-streamItem--addStreamItem"
          key="StreamEditor-streamItem--addStreamItem"
          :index="streamItems.length"
          :disabled="true"
        />
      </div>
    </div>
    <div v-if="errorMessage.length" class="StreamEditor-errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
