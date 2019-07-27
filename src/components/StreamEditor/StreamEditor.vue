<template>
  <div class="container">
    <div class="streams" ref="streams" @click="$emit('stream-click')">
      <div
        v-for="{ sourceCode, packetQueue } in streamItems"
        class="stream-wrapper"
        :key="sourceCode"
      >
        <div class="source-code">
          <input class="source-code-input" type="text" :value="sourceCode">
        </div>
        <div class="stream" ref="clickStream">
          <div
            v-for="packet in packetQueue.nativeArray"
            :class="{ packet: true, array: isArrayPacket(packet), number: isNumberPacket(packet) }"
            :key="packet.id"
            @animationend="() => handlePakcetAnimationEnd(packetQueue)"
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
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
