import { Component, Vue } from 'vue-property-decorator';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import Packet from '../../domain/Packet';
import streamItemModule from '../../store/modules/streamItem';
import StreamItem from '../../domain/StreamItem';

@Component
export default class StreamEditor extends Vue.extend({
  computed: {
    ...streamItemModule.mapGetters(['streamItems']),
  },
}) {
  get streamItemCtx() {
    return streamItemModule.context(this.$store);
  }

  get sourceCode() {
    return `
    var evaluated = [];
    with (Object.assign({}, rxjs, operators)) {
    ${this.streamItems
      .map(
        (streamItem, i) => `
      var _${i}$ = ${streamItem.sourceCode};
      _${i}$ = _${i}$.pipe(share());
      evaluated.push(_${i}$);
    `,
      )
      .join('\n')}
    }
    return evaluated;`;
  }

  public isNumberPacket(packet: Packet) {
    return typeof packet.value === 'number';
  }

  public isArrayPacket(packet: Packet) {
    return Array.isArray(packet.value);
  }

  public handlePakcetAnimationEnd(streamItem: StreamItem) {
    this.streamItemCtx.mutations.shiftPacket({
      streamItemId: streamItem.id,
    });
  }

  public created() {
    const streamItems: StreamItem[] = [
      new StreamItem({
        sourceCode: "fromEvent(document.body, 'click')",
      }),
      new StreamItem({
        sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))))',
      }),
      new StreamItem({
        sourceCode: '_1$.pipe(map(list => list.length))',
      }),
      new StreamItem({
        sourceCode: '_2$.pipe(filter(x => x === 2))',
      }),
    ];
    streamItems.forEach(streamItem => {
      this.streamItemCtx.mutations.pushStreamItem({ streamItem });
    });
  }

  public mounted() {
    // tslint:disable-next-line: no-eval
    const evaluated: Array<rxjs.Observable<any>> = new Function(
      'rxjs',
      'operators',
      this.sourceCode,
    )(rxjs, operators);

    this.streamItems.forEach((streamItem, i) => {
      evaluated[i].subscribe(ev =>
        this.streamItemCtx.actions.pushPacket({
          streamItemId: streamItem.id,
          packet: new Packet({ value: ev }),
        }),
      );
    });
  }
}
