import { Module, Actions, Mutations, Getters } from 'vuex-smart-module';
import Packet from '../../domain/Packet';
import Queue from '../../domain/Queue';

export class PacketState {
  public packetQueueMap: Record<string, Queue<Packet>> = {};
}

export class PacketMutations extends Mutations<PacketState> {
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

export class PacketActions extends Actions<
  PacketState,
  PacketGetters,
  PacketMutations,
  PacketActions
> {
  public pushPacket(payload: { packetQueueId: string; packet: Packet }) {
    this.mutations.pushPacket(payload);
  }
}

export class PacketGetters extends Getters<PacketState> {
  get packetQueue() {
    return (packetQueueId: string) => this.state.packetQueueMap[packetQueueId];
  }
}

export default new Module({
  namespaced: true,
  state: PacketState,
  mutations: PacketMutations,
  getters: PacketGetters,
  actions: PacketActions,
});
