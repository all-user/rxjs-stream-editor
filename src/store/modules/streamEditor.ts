import { Module, Actions, Mutations, Getters } from 'vuex-smart-module';
import Packet from '@/domain/Packet';
import Queue from '@/domain/Queue';

export class StreamEditorState {
  public packetQueueMap: Record<string, Queue<Packet>> = {};
  public clickPacketQueueIds: string[] = [];
}

export class StreamEditorMutations extends Mutations<StreamEditorState> {
  public shiftPacket({ packetQueueId }: { packetQueueId: string }) {
    this.state.packetQueueMap[packetQueueId].shift();
  }

  public pushPacket({
    packetQueueId,
    packet,
  }: {
    packetQueueId: string;
    packet: Packet;
  }) {
    this.state.packetQueueMap[packetQueueId].push(packet);
  }

  public addPacketQueue({ packetQueue }: { packetQueue: Queue<Packet> }) {
    this.state.packetQueueMap[packetQueue.id] = packetQueue;
  }
}

export class StreamEditorActions extends Actions<
  StreamEditorState,
  StreamEditorGetters,
  StreamEditorMutations,
  StreamEditorActions
> {
  public pushPacket(payload: { packetQueueId: string; packet: Packet }) {
    this.mutations.pushPacket(payload);
  }
}

export class StreamEditorGetters extends Getters<StreamEditorState> {
  get packetQueue() {
    return (packetQueueId: string) => this.state.packetQueueMap[packetQueueId];
  }
}

export default new Module({
  namespaced: true,
  state: StreamEditorState,
  mutations: StreamEditorMutations,
  getters: StreamEditorGetters,
  actions: StreamEditorActions,
});
