<template>
  <div class="StreamEditor-root">
    <div class="StreamEditor-streamItems">
      <div
        v-for="item in streamItems"
        class="StreamEditor-streamItem"
        :key="item.id"
      >
        <div class="StreamEditor-sourceCode">
          <StreamEditorItem :item="item"/>
        </div>
        <div class="StreamEditor-stream">
          <template
            v-for="packet in item.packets"
          >
            <div
              v-if="isNumberPacket(packet)"
              class="StreamEditor-packet StreamEditor-packet--number"
              :key="packet.id"
              @animationend="() => handlePakcetAnimationEnd(item)"
            >
              {{packet.value}}
            </div>

            <div
              v-else-if="isArrayPacket(packet)"
              class="StreamEditor-packet StreamEditor-packet--array"
              :key="packet.id"
              @animationend="() => handlePakcetAnimationEnd(item)"
            >
              <div
                v-for="(ev, idx) in packet.value"
                :key="idx" class="StreamEditor-packetDetail"
              />
            </div>

            <div
              v-else
              class="StreamEditor-packet"
              :key="packet.id"
              @animationend="() => handlePakcetAnimationEnd(item)"
            >
              <div class="StreamEditor-packetDetail"/>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="errorMessage.length" class="StreamEditor-errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
