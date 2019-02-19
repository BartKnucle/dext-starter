export const state = () => ({
  dbId: ''
})

export const mutations = {
  set_dbId(state, dbId) {
    state.dbId = dbId
  }
}
