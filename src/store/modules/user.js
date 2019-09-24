export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    systemName: '',
    systemOrg: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateSystemName (state, systemName) {
      state.systemName = systemName
    },
    updateSystemOrg (state, systemOrg) {
      state.systemOrg = systemOrg
    }
  }
}
