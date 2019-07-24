import { Component, Vue } from 'vue-property-decorator';
import { Observable } from 'rxjs';
import {
  share,
  buffer,
  debounceTime,
  map,
  filter,
} from 'rxjs/operators';


@Component
export default class StreamEditor extends Vue {
  private mounted() {
    const streamsEl = this.$refs.streams as HTMLElement;
    const vm = this;
    const clickStream = new Observable<Event>(
      (subscriber) => { vm.$on('streamClicked', (e: Event) => subscriber.next(e)); },
    ).pipe(share());
    const bufferStream = clickStream.pipe(
      buffer(clickStream.pipe(
        debounceTime(250),
      )),
      share(),
    );
    const mapStream = bufferStream.pipe(
      map((list) => list.length),
      share(),
    );
    const doubleClickStream = mapStream.pipe(
      filter((x) => x === 2),
      share(),
    );

    const clickStreamMonitor = this.$refs.clickStream as HTMLElement;
    const bufferStreamMonitor = this.$refs.bufferStream as HTMLElement;
    const mapStreamMonitor = this.$refs.mapStream as HTMLElement;
    const doubleClickStreamMonitor = this.$refs.doubleClickStream as HTMLElement;

    const packetBaseNode = document.createElement('div');
    packetBaseNode.classList.toggle('packet', true);
    const eventBaseNode = document.createElement('div');
    eventBaseNode.classList.toggle('event', true);
    const eventCommaBaseNode = document.createElement('div');
    eventCommaBaseNode.classList.toggle('event-comma', true);
    eventCommaBaseNode.textContent = ',';

    const generateEventNodeFn = <T>(monitor: HTMLElement, cb: (arg: T) => any) => (e: T) => {
      const packet = packetBaseNode.cloneNode(true);
      packet.appendChild(cb(e));
      packet.addEventListener('animationend', () => monitor.removeChild(packet));
      monitor.appendChild(packet);
    };

    clickStream.subscribe(generateEventNodeFn(clickStreamMonitor, () => eventBaseNode.cloneNode(true)));
    bufferStream.subscribe(generateEventNodeFn(bufferStreamMonitor, (e: Event[]) => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < e.length; i++) {
        fragment.appendChild(eventBaseNode.cloneNode(true));
        if (i !== e.length - 1) {
          fragment.appendChild(eventCommaBaseNode.cloneNode(true));
        }
      }
      return fragment;
    }));
    mapStream.subscribe(generateEventNodeFn(mapStreamMonitor, (e: number) => {
      const span = document.createElement('span');
      span.textContent = '' + e;
      if (e === 2) {
        span.classList.toggle('true', true);
      }
      return span;
    }));
    doubleClickStream.subscribe(generateEventNodeFn(doubleClickStreamMonitor, () => eventBaseNode.cloneNode(true)));
  }
}

