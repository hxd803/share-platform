<template>
    <div class="telescopic-container" @click="toggleCollapse">
      <i v-if="isActive" class="el-icon-arrow-right"></i>
      <i v-else class="el-icon-arrow-left"></i>
    </div>
</template>

<script>
export default {
  name: 'Telescopic',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleCollapse () {
      this.$emit('toggle-collapse')
    }
  }
}
</script>

<style lang="scss" scoped>
  .telescopic-container {
    line-height: 40px;
    height: 40px;
    width: 100%;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: block;
    background-color: #2b2f3a;
    text-align: center;
    color: rgb(191, 203, 217);
  }

  .telescopic {
    margin-left: 10px;
    display: inline-block;
    position: relative;
    height: 30px;
    width: 30px;
    margin-left: 8px;
    font-size: 24px;
  }

  .telescopic.is-active {
    transform: rotate(180deg);
  }
</style>
