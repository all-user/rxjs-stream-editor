<template>
  <div
    :class="{
      'StreamEditorItem-root': true,
      'is-disabled': disabled,
      [`StreamEditorItem-root--nth${(index % 4) + 1}`]: true,
    }"
  >
    <div class="StreamEditorItem-sourceCode">
      <div class="StreamEditorItem-sourceCodeRefLabel">_{{ index }}$</div>
      <streamEditorTextarea :dataset="dataset" :disabled="disabled" />
    </div>
    <div class="StreamEditorItem-stream">
      <div
        v-for="event in events"
        class="StreamEditorItem-eventWrapper"
        :key="event.id"
        @animationend="handleEventAnimationEnd(dataset)"
        @click="handleEventClick(event)"
      >
        <div
          v-if="isNumberEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--number"
          :style="getEventStyle(event)"
        >
          {{ event.value }}
        </div>

        <div
          v-else-if="isStringEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--string"
          :style="getEventStyle(event)"
        >
          {{ event.value }}
        </div>

        <div
          v-else-if="isBooleanEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--boolean"
          :class="{ 'is-false': !event.value }"
          :style="getEventStyle(event)"
        >
          {{ event.value }}
        </div>

        <div
          v-else-if="isArrayEvent(event)"
          class="StreamEditorItem-event StreamEditorItem-event--array"
          :style="getEventStyle(event)"
        >
          <div
            v-for="(detail, eventDetailIndex) in event.value"
            :key="eventDetailIndex"
            class="StreamEditorItem-eventDetail"
          />
        </div>

        <div
          v-else-if="isNull(event) || isUndefined(event)"
          class="StreamEditorItem-event StreamEditorItem-event--nullOrUndefined"
          :style="getEventStyle(event)"
        ></div>

        <div
          v-else
          class="StreamEditorItem-event StreamEditorItem-event--other"
          :style="getEventStyle(event)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { StreamEvent } from '../../core/StreamEvent';
import { StreamDataset } from '../../core/StreamDataset';
import StreamEditorTextarea from '../StreamEditorTextarea/StreamEditorTextarea.vue';
import { useStore } from '../../store';
import {
  isNumberEvent,
  isStringEvent,
  isBooleanEvent,
  isArrayEvent,
  isNull,
  isUndefined,
} from '../../utils/streamEvent';

const createNoCircularJsonStringifyReplacer = () => {
  const seen: unknown[] = [];
  return (_: string, value: unknown) => {
    if (value != null && typeof value === 'object') {
      if (seen.indexOf(value) >= 0) {
        return;
      }
      seen.push(value);
    }
    return value;
  };
};

const StreamEditorItem = defineComponent({
  components: {
    StreamEditorTextarea,
  },
  props: {
    dataset: {
      type: StreamDataset,
      required: false,
    },
    index: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const events = computed(() => props.dataset?.events || []);

    const getEventStyle = (
      event: StreamEvent,
    ): Partial<CSSStyleDeclaration> => {
      const backgroundColor =
        store.getters['domain/streamColorizer/colorCodeGetter'](
          store.getters['domain/streamColorizer/colorMatcher'](event.value) ||
            '',
        ) || '';
      return { backgroundColor };
    };

    const handleEventAnimationEnd = (streamDataset?: StreamDataset) => {
      if (!streamDataset) return;
      store.commit('domain/streamEditor/shiftEvent', {
        streamDatasetId: streamDataset.id,
      });
    };

    const handleEventClick = (event: StreamEvent) => {
      const jsonString = JSON.stringify(
        event.value,
        createNoCircularJsonStringifyReplacer(),
        2,
      );
      store.commit('domain/streamEditor/setMessage', { message: jsonString });
    };

    return {
      handleEventAnimationEnd,
      handleEventClick,
      isNumberEvent,
      isStringEvent,
      isBooleanEvent,
      isArrayEvent,
      isNull,
      isUndefined,
      getEventStyle,
      events,
    };
  },
});

export default StreamEditorItem;
</script>
<style lang="stylus" scoped>
@import 'rxjs-se-stylus'

@keyframes event-motion
  0%
    transform: translate3d(0vw,0,0)
  100%
    transform: translate3d(-100vw,0,0)

.StreamEditorItem-root
  display: flex
  flex-flow: column nowrap

.StreamEditorItem-sourceCode
  flex: 0 0 auto
  display: flex
  flex-flow: row nowrap
  align-items: stretch
  width: 100%
  height: auto
  background-color: rgba(0,0,0,.05)
  border-top: solid 1px rgba(0,0,0,.1)
  border-bottom: solid 1px rgba(0,0,0,.1)

.StreamEditorItem-sourceCodeRefLabel
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  background-color: ivory
  font-size: 12px
  font-weight: bold
  color: rgba(0,0,0,.4)
  border-right: solid 1px rgba(0,0,0,.1)
  padding: 0 10px

.StreamEditorItem-stream
  width: 100%
  height: 40px
  margin: 8px 0
  display: flex
  flex-flow: row nowrap
  align-items: stretch
  &::before
    content: ''
    display: block
    position: absolute
    width: 100%
    height: 1px
    background-color: rgba(0,0,0,.5)
    top: 0
    bottom: 0
    margin: auto

.StreamEditorItem-eventWrapper
  z-index: 1
  position: absolute
  top: -100%
  bottom: -100%
  right: 0
  margin: auto
  flex: 0 0 auto
  height: 100%
  display: flex
  flex-flow: column nowrap
  align-items: center
  justify-content: center
  animation: event-motion 30s linear
  &:hover
    z-index: 2
    .StreamEditorItem-event
      background-color: black
      color: ivory

.StreamEditorItem-event
  height: 100%
  display: flex
  flex-flow: column nowrap
  align-items: center
  justify-content: center
  transform: translateX(50%)
  border: 1px solid black


.StreamEditorItem-event--array
  width: 20px
  height: 100%
  justify-content: space-between
  background-color: ivory
  padding: 4px
  border-radius: 6px
  &::before,
  &::after
    display: flex
    flex-flow: row nowrap
    align-items: center
    justify-content: center
    font-size: 12px
    width: 2px
    height: 2px
    font-family: $se-font-family-monospace
  &::before
    content: '['
    transform: rotate(90deg)
  &::after
    content: ']'
    transform: rotate(90deg)

.StreamEditorItem-event--number
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  background-color: ivory
  width: auto
  height: 20px
  padding: 2px
  font-family: $se-font-family-monospace
  font-size: 16px
  color: black
  border-radius: 6px

.StreamEditorItem-event--boolean
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  background-color: ivory
  width: auto
  height: 20px
  padding: 2px
  font-family: $se-font-family-monospace
  font-size: 16px
  color: black
  border-radius: 6px
  &.is-false
    background-color: gainsboro

.StreamEditorItem-event--string
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  background-color: ivory
  width: auto
  height: 20px
  padding: 2px
  font-family: $se-font-family-monospace
  font-size: 16px
  color: black
  border-radius: 6px
  &::before
    content: '"'
  &::after
    content: '"'

.StreamEditorItem-event--nullOrUndefined
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  background-color: gray
  width: 20px
  height: 20px
  padding: 2px
  font-family: $se-font-family-monospace
  font-size: 16px
  color: black
  border-radius: 10px
  opacity: .4

.StreamEditorItem-event--other
  display: flex
  flex-flow: row nowrap
  align-items: center
  justify-content: center
  background-color: ivory
  width: 20px
  height: 20px
  padding: 2px
  font-family: $se-font-family-monospace
  font-size: 16px
  color: black
  border-radius: 10px

.StreamEditorItem-eventDetail
  display: block
  width: 5px
  height: 5px
  border-radius: 50%
  background-color: black
  box-shadow: 0 0 5px 0 rgba(black,.5)
</style>
