import { StreamEvent } from '../../../core/StreamEvent';
import { StreamDataset } from '../../../core/StreamDataset';
import { InstanceMap, defineInstanceMap } from '../../../utils/InstanceMap';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import { Module, MutationTree, GetterTree, ActionTree } from 'vuex';
import { RootState } from '../internal';

const StreamDatasetInstanceMap = defineInstanceMap<StreamDataset>('id');

export const domainStreamEditorState = () => {
  const streamDatasetMap: InstanceMap<StreamDataset> = new StreamDatasetInstanceMap();
  const streamDatasetIds: string[] = [];
  const streams: Array<rxjs.Observable<unknown>> = [];
  const subscriptions: rxjs.Subscription[] = [];
  const errorMessage = '';
  const message = '';

  return {
    streamDatasetMap,
    streamDatasetIds,
    streams,
    subscriptions,
    errorMessage,
    message,
  };
};

export type DomainStreamEditorState = ReturnType<
  typeof domainStreamEditorState
>;

export const domainStreamEditorMutations: MutationTree<DomainStreamEditorState> = {
  shiftEvent(state, { streamDatasetId }: { streamDatasetId: string }) {
    const streamDataset = state.streamDatasetMap.get(streamDatasetId);
    if (streamDataset == null) {
      return;
    }
    streamDataset.shiftEvent();
    state.streamDatasetMap.set(streamDatasetId, streamDataset);
  },
  pushEvent(
    state,
    {
      streamDatasetId,
      event,
    }: {
      streamDatasetId: string;
      event: StreamEvent;
    },
  ) {
    const streamDataset = state.streamDatasetMap.get(streamDatasetId);
    if (streamDataset == null) {
      return;
    }
    streamDataset.pushEvents(event);
    state.streamDatasetMap.set(streamDatasetId, streamDataset);
  },
  pushStreamDataset(
    state,
    {
      streamDataset,
    }: {
      streamDataset: StreamDataset;
    },
  ) {
    const { id } = streamDataset;
    state.streamDatasetMap.set(id, streamDataset);
    state.streamDatasetIds.push(id);
  },
  popStreamDataset(state) {
    const id = state.streamDatasetIds.pop();
    if (id == null) {
      return;
    }
    state.streamDatasetMap.delete(id);
  },
  setSourceCode(
    state,
    {
      streamDatasetId,
      sourceCode,
    }: {
      streamDatasetId: string;
      sourceCode: string;
    },
  ) {
    const streamDataset = state.streamDatasetMap.get(streamDatasetId);
    if (streamDataset == null) {
      return;
    }
    streamDataset.sourceCode = sourceCode;
    state.streamDatasetMap.set(streamDatasetId, streamDataset);
  },
  setStreams(state, { streams }: { streams: Array<rxjs.Observable<unknown>> }) {
    state.streams = streams;
  },
  setSubscriptions(
    state,
    {
      subscriptions,
    }: {
      subscriptions: rxjs.Subscription[];
    },
  ) {
    state.subscriptions = subscriptions;
  },
  setErrorMessage(state, { message }: { message: string }) {
    state.errorMessage = message;
  },
  setMessage(state, { message }: { message: string }) {
    state.message = message;
  },
};

export const domainStreamEditorActions: ActionTree<
  DomainStreamEditorState,
  RootState
> = {
  pushEvent(
    { commit },
    payload: { streamDatasetId: string; event: StreamEvent },
  ) {
    commit('pushEvent', payload);
  },
  unsubscribeAll({ state }) {
    state.subscriptions.forEach(subscription => subscription.unsubscribe());
  },
  evaluateSourceCode({ dispatch, commit, getters, state }) {
    dispatch('unsubscribeAll', void 0);

    const errorHandler = (err: Error) =>
      commit('setErrorMessage', {
        message: err.stack,
      });

    try {
      commit('setErrorMessage', { message: '' });
      commit('setMessage', { message: '' });
      const streams = new Function(
        'rxjs',
        'operators',
        'errorHandler',
        getters.sourceCode,
      )(rxjs, operators, errorHandler);
      commit('setStreams', { streams });
      const streamDatasets: StreamDataset[] = getters.streamDatasets;
      const subscriptions = streamDatasets.map((streamDataset, i) => {
        return state.streams[i].subscribe({
          next: ev =>
            dispatch('pushEvent', {
              streamDatasetId: streamDataset.id,
              event: new StreamEvent({ value: ev }),
            }),
          error: errorHandler,
        });
      });
      commit('setSubscriptions', { subscriptions });
    } catch (err) {
      errorHandler(err);
    }
  },
};

export const domainStreamEditorGetters: GetterTree<
  DomainStreamEditorState,
  RootState
> = {
  streamDataset(state) {
    return (streamDatasetId: string) =>
      state.streamDatasetMap.get(streamDatasetId);
  },
  streamDatasets(state) {
    return state.streamDatasetIds
      .map(id => state.streamDatasetMap.get(id))
      .filter(v => v);
  },
  sourceCode(_state, getters) {
    const streamDatasets: StreamDataset[] = getters.streamDatasets;
    return `
    try {
      var evaluated = [];
      with (Object.assign({}, operators, rxjs)) {
      ${streamDatasets
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
  },
};

export const domainStreamEditorModule: Module<
  DomainStreamEditorState,
  RootState
> = {
  namespaced: true,
  state: domainStreamEditorState,
  mutations: domainStreamEditorMutations,
  getters: domainStreamEditorGetters,
  actions: domainStreamEditorActions,
};
