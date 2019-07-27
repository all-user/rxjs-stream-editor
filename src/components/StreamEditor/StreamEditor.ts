import { Component, Vue } from 'vue-property-decorator';
import * as _rxjs from 'rxjs';
import * as _operators from 'rxjs/operators';
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
    stream: _rxjs.Observable<any>;
  }> = [
    {
      sourceCode:
        "rxjs.fromEvent(document.body, 'click').pipe(operators.share())",
      packetQueue: new Queue<Packet>(),
      stream: _rxjs.of(undefined),
    },
    {
      sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))))',
      packetQueue: new Queue<Packet>(),
      stream: _rxjs.of(undefined),
    },
    {
      sourceCode: '_1$.pipe(map(list => list.length))',
      packetQueue: new Queue<Packet>(),
      stream: _rxjs.of(undefined),
    },
    {
      sourceCode: '_2$.pipe(filter(x => x === 2))',
      packetQueue: new Queue<Packet>(),
      stream: _rxjs.of(undefined),
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

  public mounted() {
    // @ts-ignore
    const rxjs = _rxjs;
    // @ts-ignore
    const operators = _operators;

    // tslint:disable-next-line: no-eval
    const evaluated: Array<_rxjs.Observable<any>> = eval(`(() => {
      var evaluated = [];
      var _0$ = rxjs.fromEvent(document.body, 'click').pipe(operators.share());
      evaluated.push(_0$);
      var _1$ = _0$.pipe(
        operators.buffer(_0$.pipe(operators.debounceTime(250))),
        operators.share(),
      );
      evaluated.push(_1$);
      var _2$ = _1$.pipe(
        operators.map(list => list.length),
        operators.share(),
      );
      evaluated.push(_2$);
      var _3$ = _2$.pipe(
        operators.filter(x => x === 2),
        operators.share(),
      );
      evaluated.push(_3$);
      return [_0$, _1$, _2$, _3$];
    })()`);

    evaluated.forEach((stream, i) => (this.streamItems[i].stream = stream));

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
