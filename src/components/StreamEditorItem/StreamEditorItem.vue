<template>
  <div
    :class="{ 'StreamEditorItem-root': true, 'is-disabled': disabled }"
  >
    <div class="StreamEditorItem-sourceCode">
      <div class="StreamEditorItem-sourceCodeRefLabel">_{{index}}$</div>
      <streamEditorTextarea :item="item" :disabled="disabled"/>
    </div>
    <div class="StreamEditorItem-stream">
      <template
        v-for="packet in packets"
      >
        <div
          v-if="isNumberPacket(packet)"
          class="StreamEditorItem-packet StreamEditorItem-packet--number"
          :key="packet.id"
          @animationend="() => handlePakcetAnimationEnd(item)"
        >
          {{packet.value}}
        </div>

        <div
          v-else-if="isArrayPacket(packet)"
          class="StreamEditorItem-packet StreamEditorItem-packet--array"
          :key="packet.id"
          @animationend="() => handlePakcetAnimationEnd(item)"
        >
          <div
            v-for="(detail, packetDetailIndex) in packet.value"
            :key="packetDetailIndex" class="StreamEditorItem-packetDetail"
          />
        </div>

        <div
          v-else
          class="StreamEditorItem-packet"
          :key="packet.id"
          @animationend="() => handlePakcetAnimationEnd(item)"
        >
          <div class="StreamEditorItem-packetDetail"/>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditorItem.ts"></script>
<style lang="stylus" src="./StreamEditorItem.styl" scoped></style>


