<template>
  <div class="StreamEditor-root">
    <div class="StreamEditor-streamItems">
      <div
        v-for="(item, index) in streamItems"
        class="StreamEditor-streamItemWrapper"
        :key="item.id"
      >
        <StreamEditorItem
          class="StreamEditor-streamItem"
          :item="item"
          :index="index"
        />
        <div
          v-if="index === streamItems.length - 1"
          class="StreamEditor-removeStreamItemButton"
          @click="handleRemoveStream"
        >
          ×
        </div>
      </div>
      <div
        @click="handleAddStream"
        class="StreamEditor-streamItemWrapper StreamEditor-streamItemWrapper--addStreamItem"
      >
        <StreamEditorItem
          class="StreamEditor-streamItem--addStreamItem"
          :index="streamItems.length"
          :disabled="true"
        />
        <div class="StreamEditor-addStreamItemButton">+</div>
      </div>
    </div>
    <div v-if="errorMessage.length" class="StreamEditor-errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
