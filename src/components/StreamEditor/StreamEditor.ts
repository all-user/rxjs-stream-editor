import { Component, Vue } from 'vue-property-decorator';
import { Observable, of } from 'rxjs';
import { share, buffer, debounceTime, map, filter } from 'rxjs/operators';
import Packet from '../../domain/Packet';
import streamEditor from '../../store/modules/streamEditor';
import Queue from '@/domain/Queue';

@Component
export default class StreamEditor extends Vue.extend({
  computed: {
    ...streamEditor.mapGetters(['packetQueue']),
  },
}) {
  get streamEditorCtx() {
    return streamEditor.context(this.$store);
  }
  public streamItems: Array<{
    sourceCode: string;
    packetQueue: Queue<Packet>;
    stream: Observable<any>;
  }> = [
    {
      sourceCode:
        'fromEvent(document, "click") <span class="syntax-comment">// stream0$</span>',
      packetQueue: new Queue<Packet>(),
      stream: of(undefined),
    },
    {
      sourceCode:
        '<span class="syntax-stream">stream0$</span>.pipe(<span class="syntax-operator">buffer</span>(<span class="syntax-stream">stream0$</span>.pipe(<span class="syntax-operator">debounceTime</span>(250)))) <span class="syntax-comment">// stream1$</span>',
      packetQueue: new Queue<Packet>(),
      stream: of(undefined),
    },
    {
      sourceCode:
        '<span class="syntax-stream">stream1$</span>.pipe(<span class="syntax-operator">map</span>(list => list.length)) <span class="syntax-comment">// stream2$</span>',
      packetQueue: new Queue<Packet>(),
      stream: of(undefined),
    },
    {
      sourceCode:
        '<span class="syntax-stream">stream2$</span>.pipe(<span class="syntax-operator">filter</span>(x => x === 2)) <span class="syntax-comment">// stream3$</span>',
      packetQueue: new Queue<Packet>(),
      stream: of(undefined),
    },
  ];

  public isNumberPacket(packet: Packet) {
    return typeof packet.value === 'number';
  }

  public isArrayPacket(packet: Packet) {
    return Array.isArray(packet.value);
  }

  public handlePakcetAnimationEnd(packetQueue: Queue<Packet>) {
    this.streamEditorCtx.mutations.shiftPacket({
      packetQueueId: packetQueue.id,
    });
  }

  private mounted() {
    const vm = this;
    const $0 = (this.streamItems[0].stream = new Observable<Event>(
      subscriber => {
        vm.$on('stream-click', (e: Event) => subscriber.next(e));
      },
    ).pipe(share()));
    const $1 = (this.streamItems[1].stream = $0.pipe(
      buffer($0.pipe(debounceTime(250))),
      share(),
    ));
    const $2 = (this.streamItems[2].stream = $1.pipe(
      map(list => list.length),
      share(),
    ));
    this.streamItems[3].stream = $2.pipe(
      filter(x => x === 2),
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

    const generateEventNodeFn = <T>(line: HTMLElement, cb: (arg: T) => any) => (
      e: T,
    ) => {
      const packet = packetBaseNode.cloneNode(true);
      packet.appendChild(cb(e));
      packet.addEventListener('animationend', () => line.removeChild(packet));
      line.appendChild(packet);
    };

    this.streamItems.forEach(streamItem => {
      const { packetQueue, stream } = streamItem;
      this.streamEditorCtx.mutations.addPacketQueue({ packetQueue });
      stream.subscribe(ev =>
        this.streamEditorCtx.actions.pushPacket({
          packetQueueId: packetQueue.id,
          packet: new Packet(ev),
        }),
      );
    });
  }
}
