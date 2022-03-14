// const initialState = () => ({
//   user: null
// })

// export const state = initialState()

// export const getters = {
//   isAuthenticated (state) {
//     return !!state.user
//   }
// }

// export const mutations = {
//   setUser (state, user) {
//     state.user = user
//   },
//   setReset (state) {
//     const newState = initialState()
//     Object.keys(newState).forEach((key) => {
//       state[key] = newState[key]
//     })
//   }
// }

// export const actions = {
//   setUser ({ commit }, user) {
//     commit('setUser', user)
//   },
//   reset ({ commit }) {
//     commit('setReset')
//   }
// }
export const state = () => ({
  user: null
})

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

export const actions = {
  setUser ({ commit }, user) {
    commit('setUser', user)
  }
}
