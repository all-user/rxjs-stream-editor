import { Module, Actions, Mutations, Getters } from 'vuex-smart-module';
import Packet from '../../domain/Packet';
import StreamItem from '../../domain/StreamItem';
import omit from 'lodash-es/omit';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';

export class StreamItemState {
  public streamItemMap: Record<string, StreamItem> = {};
  public streamItemIds: string[] = [];
  public streams: Array<rxjs.Observable<any>> = [];
  public subscriptions: rxjs.Subscription[] = [];
}

export class StreamItemMutations extends Mutations<StreamItemState> {
  public shiftPacket({ streamItemId }: { streamItemId: string }) {
    this.state.streamItemMap[streamItemId].shiftPacket();
    this.state.streamItemMap = {
      ...this.state.streamItemMap,
    };
  }

  public pushPacket({
    streamItemId,
    packet,
  }: {
    streamItemId: string;
    packet: Packet;
  }) {
    this.state.streamItemMap[streamItemId].pushPacket(packet);
    this.state.streamItemMap = {
      ...this.state.streamItemMap,
    };
  }

  public pushStreamItem({ streamItem }: { streamItem: StreamItem }) {
    const { id } = streamItem;
    this.state.streamItemMap = {
      ...this.state.streamItemMap,
      [id]: streamItem,
    };
    this.state.streamItemIds.push(id);
  }

  public popStreamItem() {
    const id = this.state.streamItemIds.pop();
    if (id == null) {
      return;
    }
    this.state.streamItemMap = omit(this.state.streamItemMap, [id]);
  }

  public setSourceCode({
    streamItemId,
    sourceCode,
  }: {
    streamItemId: string;
    sourceCode: string;
  }) {
    this.state.streamItemMap[streamItemId].sourceCode = sourceCode;
    this.state.streamItemMap = {
      ...this.state.streamItemMap,
    };
  }

  public setStreams({ streams }: { streams: Array<rxjs.Observable<any>> }) {
    this.state.streams = streams;
  }

  public setSubscriptions({
    subscriptions,
  }: {
    subscriptions: rxjs.Subscription[];
  }) {
    this.state.subscriptions = subscriptions;
  }
}

export class StreamItemActions extends Actions<
  StreamItemState,
  StreamItemGetters,
  StreamItemMutations,
  StreamItemActions
> {
  public pushPacket(payload: { streamItemId: string; packet: Packet }) {
    this.mutations.pushPacket(payload);
  }
  public unsubscribeAll() {
    this.state.subscriptions.forEach(subscription =>
      subscription.unsubscribe(),
    );
  }
  public evaluateSourceCode() {
    this.actions.unsubscribeAll();

    const streams = new Function('rxjs', 'operators', this.getters.sourceCode)(
      rxjs,
      operators,
    );
    this.mutations.setStreams({ streams });

    const subscriptions = this.getters.streamItems.map((streamItem, i) => {
      return this.state.streams[i].subscribe(ev =>
        this.actions.pushPacket({
          streamItemId: streamItem.id,
          packet: new Packet({ value: ev }),
        }),
      );
    });
    this.mutations.setSubscriptions({ subscriptions });
  }
}

export class StreamItemGetters extends Getters<StreamItemState> {
  get streamItem() {
    return (streamItemId: string) => this.state.streamItemMap[streamItemId];
  }
  get streamItems() {
    return this.state.streamItemIds
      .map(id => this.state.streamItemMap[id])
      .filter(item => item);
  }
  get sourceCode() {
    return `
    var evaluated = [];
    with (Object.assign({}, rxjs, operators)) {
    ${this.getters.streamItems
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
}

export default new Module({
  namespaced: true,
  state: StreamItemState,
  mutations: StreamItemMutations,
  getters: StreamItemGetters,
  actions: StreamItemActions,
});
