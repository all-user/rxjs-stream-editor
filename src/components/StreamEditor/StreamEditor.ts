import { Component, Vue } from 'vue-property-decorator';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import Packet from '../../domain/Packet';
import packetModule from '../../store/modules/packet';
import Queue from '../../domain/Queue';

@Component
export default class StreamEditor extends Vue.extend({
  computed: {
    ...packetModule.mapGetters(['packetQueue']),
  },
}) {
  get packetCtx() {
    return packetModule.context(this.$store);
  }

  get sourceCode() {
    return `
    var evaluated = [];
    with (Object.assign({}, rxjs, operators)) {
    ${this.streamItems
      .map(
        (streamItem, i) => `
      var _${i}$ = ${streamItem.sourceCode};
      evaluated.push(_${i}$);
    `,
      )
      .join('\n')}
    }
    return evaluated;`;
  }

  public streamItems: Array<{
    sourceCode: string;
    packetQueue: Queue<Packet>;
    stream: rxjs.Observable<any>;
  }> = [
    {
      sourceCode: "fromEvent(document.body, 'click').pipe(share())",
      packetQueue: new Queue<Packet>(),
      stream: rxjs.of(undefined),
    },
    {
      sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))), share())',
      packetQueue: new Queue<Packet>(),
      stream: rxjs.of(undefined),
    },
    {
      sourceCode: '_1$.pipe(map(list => list.length), share())',
      packetQueue: new Queue<Packet>(),
      stream: rxjs.of(undefined),
    },
    {
      sourceCode: '_2$.pipe(filter(x => x === 2), share())',
      packetQueue: new Queue<Packet>(),
      stream: rxjs.of(undefined),
    },
  ];

  public isNumberPacket(packet: Packet) {
    return typeof packet.value === 'number';
  }

  public isArrayPacket(packet: Packet) {
    return Array.isArray(packet.value);
  }

  public handlePakcetAnimationEnd(packetQueue: Queue<Packet>) {
    this.packetCtx.mutations.shiftPacket({
      packetQueueId: packetQueue.id,
    });
  }

  public mounted() {
    // tslint:disable-next-line: no-eval
    const evaluated: Array<rxjs.Observable<any>> = new Function(
      'rxjs',
      'operators',
      this.sourceCode,
    )(rxjs, operators);

    evaluated.forEach((stream, i) => (this.streamItems[i].stream = stream));

    this.streamItems.forEach(streamItem => {
      const { packetQueue, stream } = streamItem;
      this.packetCtx.mutations.addPacketQueue({ packetQueue });
      stream.subscribe(ev =>
        this.packetCtx.actions.pushPacket({
          packetQueueId: packetQueue.id,
          packet: new Packet(ev),
        }),
      );
    });
  }
}
