<template>
  <div>
    <el-tree
      ref="organizeTree"
      :data="organizes"
      :props="defaultProps"
      node-key="id"
      lazy
      :load="loadNode"
      :default-expanded-keys="expandedKeys"
      :highlight-current="true"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      @node-click="handleClick"
    >
    </el-tree>
  </div>
</template>

<script>
import { lazyTree } from '@/api/organize'

export default {
  name: 'OrganizeTree',
  data () {
    return {
      organize: {},
      organizes: [],
      expandedKeys: [],
      organizeInfo: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: this.getIsLeaf
      }
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    loadNode (node, resolve) {
      lazyTree({ parentId: node.data.id ? node.data.id : 0 }).then(response => {
        resolve(response.object)
      }).catch(() => {})
    },
    getIsLeaf (data, node) {
      return !data.hasChild
    },
    handleClick (data) {
      this.$emit('getValue', data)
    }
  }
}
</script>

<style>
</style>
