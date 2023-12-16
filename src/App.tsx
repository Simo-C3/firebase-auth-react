import logo from './logo.svg'
import './App.css'
import './firebaseApp'

import { useEffect, useState } from 'react'
import {
  getAuth,
  Auth,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [auth, setAuth] = useState<Auth | null>(null)
  const [provider, setProvider] = useState<GithubAuthProvider | null>(null)

  // GitHub OAuth Provider ObjectのInstanceを作成
  useEffect(() => {
    if (provider === null) {
      const newProvider = new GithubAuthProvider()
      newProvider.addScope('repo') // 既定ではユーザー自身のemailを取得するスコープしか付与されない。必要に応じてスコープを追加する
      setProvider(newProvider)
    }
  }, [provider])

  // Firebase Appに対するAuth instanceを取得
  useEffect(() => {
    if (provider !== null && auth === null) {
      setAuth(getAuth())
      console.log(auth)
    }
  }, [auth, provider])

  // ポップアップによるサインインを実施し、成功したらアクセストークンを取得する
  useEffect(() => {
    if (provider !== null && auth !== null && token === null) {
      signInWithPopup(auth, provider).then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result)
        if (credential && credential.accessToken) {
          setToken(credential.accessToken)
          console.log('token: ' + credential.accessToken)
        }
        console.log(result.user)
      })
    }
  }, [auth, provider, token])

  // // アクセストークンを使用してGitHub API（GET /Issues）へリクエストする
  // useEffect(() => {
  //   if (token !== null) {
  //     fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
  //       headers: {
  //         Authorization: `token ${token}`,
  //         Accept: 'application / vnd.github.v3 + json',
  //       },
  //     }).then((result) => {
  //       result.json().then((result) => {
  //         console.log(result)
  //       })
  //     })
  //   }
  // }, [token])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>{token !== null && <p>token: {token}</p>}</div>
      </header>
    </div>
  )
}

export default App
