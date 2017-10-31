import Vue from 'vue'

export default Vue.extend({
  name: 'StreamExpressionInput',
  props: {
    value: '',
  },
  methods: {
    updateValue(value: string) {
      console.log(value)
      this.$emit('input', value)
    },
  },
})
