import { Module, Actions, Mutations, Getters } from 'vuex-smart-module';
import Packet from '@/domain/Packet';
import { omit } from 'lodash-es';

export class StreamEditorState {
  public packetMap: Record<string, Packet> = {};
  public clickPacketIdsRaw: string[] = [];
}

export class StreamEditorMutations extends Mutations<StreamEditorState> {
  public deletePacket(id: string) {
    this.state.packetMap = omit(this.state.packetMap, [id]);
  }

  public addPacket(packet: Packet) {
    this.state.packetMap[packet.id] = packet;
  }

  public pushClickPacketId(packet: Packet) {
    this.state.clickPacketIdsRaw.push(packet.id);
  }
}

export class StreamEditorActions extends Actions<
  StreamEditorState,
  StreamEditorGetters,
  StreamEditorMutations,
  StreamEditorActions
> {
  public addClickPacket(packet: Packet) {
    this.mutations.addPacket(packet);
    this.mutations.pushClickPacketId(packet);
  }
}

export class StreamEditorGetters extends Getters<StreamEditorState> {
  get clickPackets() {
    return this.state.clickPacketIdsRaw.map((id) => this.state.packetMap[id]).filter((p) => p);
  }
}

export default new Module({
  namespaced: true,
  state: StreamEditorState,
  mutations: StreamEditorMutations,
  getters: StreamEditorGetters,
  actions: StreamEditorActions,
});
