<template>
  <div
    :class="{ 'StreamEditorItem-root': true, 'is-disabled': disabled }"
  >
    <div class="StreamEditorItem-sourceCode">
      <div class="StreamEditorItem-sourceCodeRefLabel">_{{index}}$</div>
      <streamEditorTextarea :dataset="dataset" :disabled="disabled"/>
    </div>
    <div class="StreamEditorItem-stream">
      <template
        v-for="event in events"
      >
        <div
          v-if="isNumberEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--number"
          :key="event.id"
          @animationend="() => handleEventAnimationEnd(dataset)"
        >
          {{event.value}}
        </div>

        <div
          v-else-if="isArrayEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--array"
          :key="event.id"
          @animationend="() => handleEventAnimationEnd(dataset)"
        >
          <div
            v-for="(detail, eventDetailIndex) in event.value"
            :key="eventDetailIndex" class="StreamEditorItem-eventDetail"
          />
        </div>

        <div
          v-else
          class="StreamEditorItem-event"
          :key="event.id"
          @animationend="() => handleEventAnimationEnd(dataset)"
        >
          <div class="StreamEditorItem-eventDetail"/>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditorItem.ts"></script>
<style lang="stylus" src="./StreamEditorItem.styl" scoped></style>


