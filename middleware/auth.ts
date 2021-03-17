import { $axios } from '~/utils/api'
import { Token } from '~/utils/token'

async function isSignedIn(token: string): Promise<boolean> {
  const res = await $axios.post('/auth/firebase/verify', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if(res && res.data && res.data.statusCode) {
    switch(res.data.statusCode) {
      case 200:
        return true
      default:
        throw new Error('Authentication Error')
    }
  }
  return false
}

export default async function({ redirect, route, store }: any) {
  if (process.client) {
    const token = Token.getValue()
    if (token) {
      try {
        const isSignedInResult: boolean = await isSignedIn(token)
        store.commit('auth/setIsSignedIn', isSignedInResult)
        if(isSignedInResult && route.name === 'account') {
          redirect('/')
        }
      } catch (e) {
        // redirect to login page
        redirect('/account')
      }
    } else {
      if(route.name !== 'account') {
        redirect('/account')
      }
    }
  }
}
