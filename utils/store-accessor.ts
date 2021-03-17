import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import DataModule from '~/store/data'
import FirebaseModule from '~/store/firebase'
import AuthModule from '~/store/auth'

let dataStore: DataModule
let firebaseStore: FirebaseModule
let authStore: AuthModule

function initialiseStores(store: Store<any>): void {
  dataStore = getModule(DataModule, store)
  firebaseStore = getModule(FirebaseModule, store)
  authStore = getModule(AuthModule, store)
}

export { initialiseStores, dataStore, firebaseStore, authStore }
