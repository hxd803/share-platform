<template>
  <div>欢迎光临--{{welcome}}</div>
</template>

<script>
import { index } from '@/api/manage'
export default {
  name: 'Index',
  data () {
    return {
      welcome: ''
    }
  },
  created () {
    index().then(response => {
      console.log(response)
      this.welcome = response.object
    })
  }
}
</script>
