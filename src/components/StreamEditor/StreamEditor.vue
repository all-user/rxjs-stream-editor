<template>
  <div class="container">
    <div class="streams">
      <div
        v-for="item in streamItems"
        class="stream-wrapper"
        :key="item.sourceCode"
      >
        <div class="source-code">
          <input class="source-code-input" type="text" :value="item.sourceCode">
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
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
