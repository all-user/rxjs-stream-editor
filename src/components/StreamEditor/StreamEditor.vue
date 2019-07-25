<template>
  <div class="container">
    <div class="streams" ref="streams" @click="$emit('streamClicked')">
      <div class="stream-wrapper click">
        <div class="source-code">
          <pre>fromEvent(document, 'click') <span class="syntax-comment">// stream0$</span></pre>
        </div>
        <div class="stream" ref="clickStream">
          <div
            v-for="packet in clickPackets"
            class="packet"
            :key="packet.id"
            @animationend="() => handleClickPakcetAnimationEnd(packet)"
          >
            <template v-if="isNumberPacket(packet)">{{packet.value}}</template>
            <template v-else-if="isArrayPacket(packet)">
              <template v-for="(ev, idx) in packet.value">
                <div :key="idx" class="event"></div>
                <div :key="`${idx}-comma`" v-if="idx !== packet.value.length" class="event-comma"></div>
              </template>
            </template>
            <div v-else class="event"></div>
          </div>
        </div>
      </div>
      <div class="stream-wrapper buffer">
        <div class="source-code">
          <pre><span class="syntax-stream">stream0$</span>.pipe(<span class="syntax-operator">buffer</span>(<span class="syntax-stream">stream0$</span>.pipe(<span class="syntax-operator">debounceTime</span>(250)))) <span class="syntax-comment">// stream1$</span></pre>
        </div>
        <div class="stream" ref="bufferStream"></div>
      </div>
      <div class="stream-wrapper map">
        <div class="source-code">
          <pre><span class="syntax-stream">stream1$</span>.pipe(<span class="syntax-operator">map</span>(list => list.length)) <span class="syntax-comment">// stream2$</span></pre>
        </div>
        <div class="stream" ref="mapStream"></div>
      </div>
      <div class="stream-wrapper double-click">
        <div class="source-code">
          <pre><span class="syntax-stream">stream2$</span>.pipe(<span class="syntax-operator">filter</span>(x => x === 2)) <span class="syntax-comment">// stream3$</span></pre>
        </div>
        <div class="stream" ref="doubleClickStream"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./StreamEditor.ts"></script>
<style lang="stylus" src="./StreamEditor.styl" scoped></style>
