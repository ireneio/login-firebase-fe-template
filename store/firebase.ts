import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { Token } from '~/utils/token'

@Module({
  name: 'firebase',
  stateFactory: true,
  namespaced: true,
  // dynamic: true,
})
export default class FirebaseModule extends VuexModule {
  public user: any = {}

  @Mutation
  private setUser(payload: any) {
    this.user = { ...payload }
  }

  @Action({ commit: 'setUser' })
  public async signIn(token: string): Promise<string> {
    try {
      const res = await $axios.post('/auth/firebase/login', { token })
      Token.setValue(token)
      return res.data
    } catch (e) {
      console.log('Error: ' + e.message)
      return e.message
    }
  }
}
