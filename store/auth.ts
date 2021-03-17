import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class AuthModule extends VuexModule {
  private isSignedIn: boolean = false

  public get getIsSignedIn(): boolean {
    return this.isSignedIn
  }

  @Mutation
  public setIsSignedIn(payload: boolean) {
    this.isSignedIn = payload
  }
}
