<template>
  <div
    :class="{ 'StreamEditorItem-root': true, 'is-disabled': disabled, [`StreamEditorItem-root--nth${index % 4 + 1}`]: true }"
  >
    <div class="StreamEditorItem-sourceCode">
      <div class="StreamEditorItem-sourceCodeRefLabel">_{{index}}$</div>
      <streamEditorTextarea :dataset="dataset" :disabled="disabled"/>
    </div>
    <div class="StreamEditorItem-stream">
      <div
        v-for="event in events"
        class="StreamEditorItem-eventWrapper"
        :key="event.id"
        @animationend="() => handleEventAnimationEnd(dataset)"
      >
        <div
          v-if="isNumberEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--number"
        >
          {{event.value}}
        </div>

        <div
          v-else-if="isStringEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--string"
        >
          {{event.value}}
        </div>

        <div
          v-else-if="isArrayEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--array"
        >
          <div
            v-for="(detail, eventDetailIndex) in event.value"
            :key="eventDetailIndex" class="StreamEditorItem-eventDetail"
          />
        </div>

        <div
          v-else
          class="StreamEditorItem-event StreamEditorItem-event--other"
        >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditorItem.ts"></script>
<style lang="stylus" src="./StreamEditorItem.styl" scoped></style>


