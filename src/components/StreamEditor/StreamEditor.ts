import { Component, Vue } from 'vue-property-decorator';
import { Observable } from 'rxjs';
import {
  share,
  buffer,
  debounceTime,
  map,
  filter,
} from 'rxjs/operators';
import Packet from '../../domain/Packet';
import streamEditor from '../../store/modules/streamEditor';

@Component
export default class StreamEditor extends Vue.extend({
  computed: {
    ...streamEditor.mapGetters(['clickPackets']),
  },
}) {

  public isNumberPacket(packet: Packet) {
    return typeof packet.value === 'number';
  }

  public isArrayPacket(packet: Packet) {
    return Array.isArray(packet.value);
  }

  public handleClickPakcetAnimationEnd(packet: Packet) {
    this.streamEditorCtx.mutations.deletePacket(packet.id);
  }

  get streamEditorCtx() {
    return streamEditor.context(this.$store);
  }

  private mounted() {
    const vm = this;
    const clickStream = new Observable<Event>(
      (subscriber) => { vm.$on('streamClicked', (e: Event) => subscriber.next(e)); },
    ).pipe(share());
    const bufferStream = clickStream.pipe(
      buffer(clickStream.pipe(
        debounceTime(250),
      )),
      share(),
    );
    const mapStream = bufferStream.pipe(
      map((list) => list.length),
      share(),
    );
    const doubleClickStream = mapStream.pipe(
      filter((x) => x === 2),
      share(),
    );

    const bufferStreamLine = this.$refs.bufferStream as HTMLElement;
    const mapStreamLine = this.$refs.mapStream as HTMLElement;
    const doubleClickStreamLine = this.$refs.doubleClickStream as HTMLElement;

    const packetBaseNode = document.createElement('div');
    packetBaseNode.classList.toggle('packet', true);
    const eventBaseNode = document.createElement('div');
    eventBaseNode.classList.toggle('event', true);
    const eventCommaBaseNode = document.createElement('div');
    eventCommaBaseNode.classList.toggle('event-comma', true);
    eventCommaBaseNode.textContent = ',';

    const generateEventNodeFn = <T>(line: HTMLElement, cb: (arg: T) => any) => (e: T) => {
      const packet = packetBaseNode.cloneNode(true);
      packet.appendChild(cb(e));
      packet.addEventListener('animationend', () => line.removeChild(packet));
      line.appendChild(packet);
    };

    clickStream.subscribe((ev) => this.streamEditorCtx.actions.addClickPacket(new Packet(ev)));
    bufferStream.subscribe(generateEventNodeFn(bufferStreamLine, (e: Event[]) => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < e.length; i++) {
        fragment.appendChild(eventBaseNode.cloneNode(true));
        if (i !== e.length - 1) {
          fragment.appendChild(eventCommaBaseNode.cloneNode(true));
        }
      }
      return fragment;
    }));
    mapStream.subscribe(generateEventNodeFn(mapStreamLine, (e: number) => {
      const span = document.createElement('span');
      span.textContent = '' + e;
      if (e === 2) {
        span.classList.toggle('true', true);
      }
      return span;
    }));
    doubleClickStream.subscribe(generateEventNodeFn(doubleClickStreamLine, () => eventBaseNode.cloneNode(true)));
  }
}

