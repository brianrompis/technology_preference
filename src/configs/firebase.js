//const firebase = require('firebase/app')
import firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: 'AIzaSyC0_PolpPEorAkR9Ve3Ilzw1OzFm4Ya0lw',
  authDomain: 'room-service-f3667.firebaseapp.com',
  databaseURL: 'https://room-service-f3667-default-rtdb.firebaseio.com',
  projectId: 'room-service-f3667',
  storageBucket: 'room-service-f3667.appspot.com',
  messagingSenderId: '276867379136',
  appId: '1:276867379136:web:b4e3b1ff388bf8bd3ee225'
})

const functions = firebase.functions()

export default firebase