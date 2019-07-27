<template>
  <div class="container">
    <div class="streams">
      <div
        v-for="item in streamItems"
        class="stream-wrapper"
        :key="item.id"
      >
        <div class="source-code">
          <StreamEditorItem :item="item"/>
        </div>
        <div class="stream">
          <div
            v-for="packet in item.packets"
            :class="{ packet: true, array: isArrayPacket(packet), number: isNumberPacket(packet) }"
            :key="packet.id"
            @animationend="() => handlePakcetAnimationEnd(item)"
          >
            <template v-if="isNumberPacket(packet)">{{packet.value}}</template>
            <template v-else-if="isArrayPacket(packet)">
              <template v-for="(ev, idx) in packet.value">
                <div :key="idx" class="event"></div>
              </template>
            </template>
            <div v-else class="event"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="error-messages">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
