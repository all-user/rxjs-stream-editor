import { Module, Actions, Mutations, Getters } from 'vuex-smart-module';
import Packet from '../../domain/Packet';
import StreamItem from '../../domain/StreamItem';
import omit from 'lodash-es/omit';

export class StreamItemState {
  public streamItemMap: Record<string, StreamItem> = {};
  public streamItemIds: string[] = [];
}

export class StreamItemMutations extends Mutations<StreamItemState> {
  public shiftPacket({ streamItemId }: { streamItemId: string }) {
    this.state.streamItemMap[streamItemId].packets.shift();
    this.state.streamItemMap = { ...this.state.streamItemMap };
  }

  public pushPacket({
    streamItemId,
    packet,
  }: {
    streamItemId: string;
    packet: Packet;
  }) {
    this.state.streamItemMap[streamItemId].packets.push(packet);
    this.state.streamItemMap = { ...this.state.streamItemMap };
  }

  public pushStreamItem({ streamItem }: { streamItem: StreamItem }) {
    const { id } = streamItem;
    this.state.streamItemMap[id] = streamItem;
    this.state.streamItemIds.push(id);
  }

  public popStreamItem() {
    const id = this.state.streamItemIds.pop();
    if (id == null) {
      return;
    }
    this.state.streamItemMap = omit(this.state.streamItemMap, [id]);
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
}

export default new Module({
  namespaced: true,
  state: StreamItemState,
  mutations: StreamItemMutations,
  getters: StreamItemGetters,
  actions: StreamItemActions,
});
