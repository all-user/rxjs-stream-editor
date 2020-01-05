import { Module, Actions, Mutations, Getters } from 'vuex-smart-module';
import { StreamDataset, StreamEvent } from '../../../domain/internal';
import { InstanceMap, defineInstanceMap } from '../../../core/InstanceMap';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';

const StreamDatasetInstanceMap = defineInstanceMap<StreamDataset>('id');

export class DomainStreamEditorState {
  public streamDatasetMap: InstanceMap<
    StreamDataset
  > = new StreamDatasetInstanceMap();
  public streamDatasetIds: string[] = [];
  public streams: Array<rxjs.Observable<any>> = [];
  public subscriptions: rxjs.Subscription[] = [];
  public errorMessage: string = '';
  public message: string = '';
}

export class DomainStreamEditorMutations extends Mutations<
  DomainStreamEditorState
> {
  public shiftEvent({ streamDatasetId }: { streamDatasetId: string }) {
    const streamDataset = this.state.streamDatasetMap.get(streamDatasetId);
    if (streamDataset == null) {
      return;
    }
    streamDataset.shiftEvent();
    this.state.streamDatasetMap.set(streamDatasetId, streamDataset);
  }

  public pushEvent({
    streamDatasetId,
    event,
  }: {
    streamDatasetId: string;
    event: StreamEvent;
  }) {
    const streamDataset = this.state.streamDatasetMap.get(streamDatasetId);
    if (streamDataset == null) {
      return;
    }
    streamDataset.pushEvents(event);
    this.state.streamDatasetMap.set(streamDatasetId, streamDataset);
  }

  public pushStreamDataset({
    streamDataset,
  }: {
    streamDataset: StreamDataset;
  }) {
    const { id } = streamDataset;
    this.state.streamDatasetMap.set(id, streamDataset);
    this.state.streamDatasetIds.push(id);
  }

  public popStreamDataset() {
    const id = this.state.streamDatasetIds.pop();
    if (id == null) {
      return;
    }
    this.state.streamDatasetMap.delete(id);
  }

  public setSourceCode({
    streamDatasetId,
    sourceCode,
  }: {
    streamDatasetId: string;
    sourceCode: string;
  }) {
    const streamDataset = this.state.streamDatasetMap.get(streamDatasetId);
    if (streamDataset == null) {
      return;
    }
    streamDataset.sourceCode = sourceCode;
    this.state.streamDatasetMap.set(streamDatasetId, streamDataset);
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

  public setErrorMessage({ message }: { message: string }) {
    this.state.errorMessage = message;
  }

  public setMessage({ message }: { message: string }) {
    this.state.message = message;
  }
}

export class DomainStreamEditorActions extends Actions<
  DomainStreamEditorState,
  DomainStreamEditorGetters,
  DomainStreamEditorMutations,
  DomainStreamEditorActions
> {
  public pushEvent(payload: { streamDatasetId: string; event: StreamEvent }) {
    this.commit('pushEvent', payload);
  }
  public unsubscribeAll() {
    this.state.subscriptions.forEach(subscription =>
      subscription.unsubscribe(),
    );
  }
  public evaluateSourceCode() {
    this.dispatch('unsubscribeAll', void 0);

    const errorHandler = (err: any) =>
      this.commit('setErrorMessage', {
        message: err.stack,
      });

    try {
      this.commit('setErrorMessage', { message: '' });
      this.commit('setMessage', { message: '' });
      const streams = new Function(
        'rxjs',
        'operators',
        'errorHandler',
        this.getters.sourceCode,
      )(rxjs, operators, errorHandler);
      this.commit('setStreams', { streams });
      const subscriptions = this.getters.streamDatasets.map(
        (streamDataset, i) => {
          return this.state.streams[i].subscribe({
            next: ev =>
              this.dispatch('pushEvent', {
                streamDatasetId: streamDataset.id,
                event: new StreamEvent({ value: ev }),
              }),
            error: errorHandler,
          });
        },
      );
      this.commit('setSubscriptions', { subscriptions });
    } catch (err) {
      errorHandler(err);
    }
  }
}

export class DomainStreamEditorGetters extends Getters<
  DomainStreamEditorState
> {
  get streamDataset() {
    return (streamDatasetId: string) =>
      this.state.streamDatasetMap.get(streamDatasetId);
  }
  get streamDatasets() {
    return this.state.streamDatasetIds
      .map(id => this.state.streamDatasetMap.get(id)!)
      .filter(v => v);
  }
  get sourceCode() {
    return `
    try {
      var evaluated = [];
      with (Object.assign({}, operators, rxjs)) {
      ${this.getters.streamDatasets
        .map(
          (streamDataset, i) => `
        var _${i}$ = ${streamDataset.sourceCode};
        _${i}$ = _${i}$.pipe(share());
        evaluated.push(_${i}$);
      `,
        )
        .join('\n')}
      }
      return evaluated;
    } catch(err) {
      errorHandler(err);
    }`;
  }
}

export const domainStreamEditorModule = new Module({
  namespaced: true,
  state: DomainStreamEditorState,
  mutations: DomainStreamEditorMutations,
  getters: DomainStreamEditorGetters,
  actions: DomainStreamEditorActions,
});
