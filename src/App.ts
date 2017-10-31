import Vue from 'vue'
import StreamExpressionInput from './components/StreamExpressionInput.vue'
import { Expression } from './models/Expression'

export default Vue.extend({
  name: 'app',
  data() {
    const expressions = [
      'clickStream.buffer(clickStream.debounce(200))',
      '.map(clicks => clicks.length)',
      '.filter(count => count === 2)',
    ].map(str => new Expression(str))

    return {
      expressions,
    }
  },
  components: {
    StreamExpressionInput,
  },
})
