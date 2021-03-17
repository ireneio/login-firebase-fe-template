<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <main style="margin-top: 150px; display: flex; flex-direction: column">
          <Logo />
          <h1 class="title">nuxt-ts-docker-template</h1>
          <div class="links" style="align-self: center">
            <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer" class="button--green">
              Documentation
            </a>
            <a href="https://github.com/nuxt/nuxt.js" target="_blank" rel="noopener noreferrer" class="button--grey">
              GitHub
            </a>
          </div>
          <div style="margin-top: 20px; font-size: 16px">Vuex Integrations with nuxt-property-decorator</div>
          <div style="margin-top: 20px; font-size: 16px">
            Vuex: <span style="color: green">{{ storeData }}</span>
          </div>
          <div style="margin-top: 20px; font-size: 16px">
            Axios: <span style="color: green">{{ axiosIsWorking }}</span>
          </div>
        </main>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div style="width: 100%; display: flex; align-items: center; margin-top: 12px">
          Node-Sass:&nbsp;<button class="btn btn--primary">Sass Is Working...</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div style="width: 100%; display: flex; align-items: center; margin-top: 12px">
          Is Signed In: {{ isSignedIn }}
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:12px;border:1px solid #aaa; padding:8px;">
      <div class="col" style="margin-bottom:4px;">
        <div>Email</div>
      </div>
      <div class="col" style="margin-bottom:4px;">
        <div>
          <input type="text" v-model="signInForm.email" style="padding: 4px;">
        </div>
      </div>
      <div class="col" style="margin-bottom:4px;">
        <div>Password</div>
      </div>
      <div class="col" style="margin-bottom:4px;">
        <div>
          <input type="text" v-model="signInForm.password" style="padding: 4px;">
        </div>
      </div>
      <div class="col" style="margin-top:8px;">
        <button class="btn btn--primary" style="margin-right:8px;" @click="handleRegister('local')">Register</button>
        <button class="btn btn--warning" style="margin-right:8px;" @click="handleSignIn('local')">Sign In</button>
        <button class="btn btn--secondary" style="margin-right:8px;" @click="handleSignIn('google')">Sign In With Google</button>
        <!-- <button class="btn btn--primary" style="margin-right:8px;" @click="handleSignOut">SignOut</button>
        <button class="btn btn--secondary"  style="margin-right:8px;" @click="handleUpdatePw">UpdatePw</button> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Logo from '~/components/Logo.vue'
import { dataStore, firebaseStore, authStore } from '~/store/index'
import { $axios } from '~/utils/api'
import { Firebase } from '~/utils/firebase'
import { Token } from '~/utils/token'

@Component({
  components: {
    Logo,
  },
  layout: 'signIn'
})
export default class Account extends Vue {
  private axiosIsWorking: any = ''

  private get storeData(): string {
    return dataStore.data ? dataStore.data.property : ''
  }

  private get isSignedIn(): boolean {
    return authStore.getIsSignedIn
  }

  private signInForm: { email: string, password: string } = {
    email: '',
    password: ''
  }

  private async handleSignIn(type: string): Promise<void> {
    const token = await Firebase.signIn(this.signInForm, type)
    if(type !== 'local') {
      await this.handleRegister(type)
      this.$router.push('/')
    } else {
      if(token) await firebaseStore.signIn(token)
      this.$router.push('/')
    }
  }

  private async handleRegister(type: string): Promise<void> {
    const registerResult = await Firebase.register(this.signInForm)
    if(!registerResult) return
    const token = await Firebase.signIn(this.signInForm, type)
    try {
      if(token) {
        await $axios.post('/auth/firebase/', { token })
        Token.setValue(token)
        this.$router.push('/')
      }
    } catch (e) {
      console.log('Error: ' + e.message)
    }
  }

  private async created(): Promise<void> {
    console.log('API URL: ', process.env.API_URL)
    this.axiosIsWorking = $axios
    await dataStore.getData()
  }
}
</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
