// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app'

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'

import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.FB_APIKEY,
  authDomain: `${process.env.FB_PROJECTID}.firebaseapp.com`,
  databaseURL: `https://${process.env.FB_PROJECTID}.firebaseio.com`,
  projectId: process.env.FB_PROJECTID,
  storageBucket: `${process.env.FB_PROJECTID}.appspot.com`,
  // messagingSenderId: "SENDER_ID",
  appId: process.env.FB_APPID,
  // measurementId: `G-${process.env.MEASUREMENT_ID}`,
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}else {
  firebase.app(); // if already initialized, use that one
}

async function signInWithPopUpFrom3rdPartyHelper(provider: firebase.auth.GoogleAuthProvider | firebase.auth.GithubAuthProvider | firebase.auth.FacebookAuthProvider): Promise<string> {
  provider.addScope('profile')
  provider.addScope('email')
  firebase.auth().useDeviceLanguage()
  return firebase
  .auth()
  .signInWithPopup(provider)
  .then(result => {
    if(result && result.credential) {
      // Google access token, NOT the token to authenticate with be
      // @ts-ignore
      const { accessToken } = result.credential
      return Promise.resolve(accessToken)
    }
  })
  .catch(err => {
    console.log(err)
    Promise.reject(new Error('Server Error'))
  })
}

async function signInHelper(type: string, credential: { email?: string, password?: string }): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (type === 'local' && credential.email && credential.password) {
      const { email, password } = credential
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject(new Error('Credential Error'))
        })
    } else {
      switch(type) {
        case 'google':
          await signInWithPopUpFrom3rdPartyHelper(new firebase.auth.GoogleAuthProvider())
          resolve()
          break
        case 'gh':
          await signInWithPopUpFrom3rdPartyHelper(new firebase.auth.GithubAuthProvider())
          resolve()
        default:
          reject(new Error('Credential Error'))
          break
      }
    }
  })
}

async function registerHelper(credential: { email?: string, password?: string }): Promise<void> {
  if(credential.email && credential.password) {
    const { email, password } = credential
    await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(obj => {
          return true
        })
        .catch(err => {
          throw new Error(`Credential Error: ${err.code}`)
        })
  } else {
    throw new Error('Credential Error: Input Error')
  }
}

async function getTokenHelper(): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentUser = firebase.auth().currentUser
    if (currentUser) {
      currentUser
        .getIdToken(/* forceRefresh */ true)
        .then((idToken: string) => {
          resolve(idToken)
        })
        .catch(() => {
          reject(new Error('Server Error'))
        })
    } else {
      reject(new Error('Credential Error: Account does not exist'))
    }
  })
}

async function updatePasswordHelper(password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const currentUser = firebase.auth().currentUser
    if (currentUser) {
      currentUser
        .updatePassword(password)
        .then(() => {
          resolve()
        })
        .catch(err => reject(err))
    } else {
      reject(new Error('Sign In Required'))
    }
  })
}

async function authHelper(): Promise<{ displayName: string | null, email: string | null }> {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.hasOwnProperty('displayName') && user.hasOwnProperty('email')) {
        const { displayName, email } = user
        resolve({ displayName, email })
      }
      reject(new Error('Authenticate Error'))
    })
  })
}

async function signOutHelper(): Promise<boolean | void> {
  return await firebase
      .auth()
      .signOut()
      .then(() => true)
      .catch(() => {
        Promise.reject(new Error('Server Error'))
      })
}

export namespace Firebase {
  export async function signIn(signInForm: { email: string, password: string }, type: string): Promise<string | undefined> {
    try {
      await signInHelper(type, { email: signInForm.email, password: signInForm.password })
      const authState = await authHelper()
      let idToken: string = ''
      if (authState) {
        idToken = await getTokenHelper()
        console.log('[Firebase] SignIn Success')
        console.log('[Firebase] Token: ', idToken)
        return idToken
      } else {
        throw new Error('Token Not Provided')
      }
    } catch (e) {
      console.log('[Firebase] SignIn Error: ', e.message)
    }
  }

  export async function register(signInForm: { email: string, password: string }): Promise<boolean> {
    try {
        await registerHelper({ email: signInForm.email, password: signInForm.password })
        console.log('[Firebase] Register Success (Auto Signed In)')
        return true
      } catch (e) {
        console.log('[Firebase] Register Error: ', e.message)
        return false
      }
  }

  export async function updatePw(signInForm: { email: string, password: string }): Promise<void> {
    try {
      await updatePasswordHelper(signInForm.password)
      console.log('[Firebase] Update Password Success')
    } catch(e) {
      console.log('[Firebase] Update Password Error: ', e.message)
    }
  }

  export async function signOut(): Promise<void> {
    try {
      await signOutHelper()
      console.log('[Firebase] SignOut Success')
    } catch(e) {
      console.log('[Firebase] SignOut Error: ', e.message)
    }
  }
}
