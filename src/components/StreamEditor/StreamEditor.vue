<template>
  <div class="StreamEditor-root">
    <div class="StreamEditor-streamItems">
      <div
        v-for="(dataset, index) in streamDatasets"
        class="StreamEditor-streamItemWrapper"
        :key="dataset.id"
      >
        <StreamEditorItem
          class="StreamEditor-streamItem"
          :dataset="dataset"
          :index="index"
        />
        <div
          v-if="index === streamDatasets.length - 1"
          class="StreamEditor-removeStreamItemButton"
          @click="handleRemoveStream"
        >
          ×
        </div>
      </div>
      <div
        class="StreamEditor-streamItemWrapper StreamEditor-streamItemWrapper--addStreamItem"
      >
        <div
          @click="handleAddStream"
          class="StreamEditor-addStreamItemButton"
        >
          +
        </div>
        <StreamEditorItem
          class="StreamEditor-streamItem--addStreamItem"
          :index="streamDatasets.length"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
