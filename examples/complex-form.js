import {createClass, createElement, DOM, createFactory} from 'react'
import {render} from 'react-dom'
import {Form, OnValue, TextArea, OnError, Entity, Input, Select} from '../lib'

const {button, a, p, option} = DOM
const label = DOM.label.bind(null, null)
const select = createFactory(Select)
const form = createFactory(Form)
const textArea = createFactory(TextArea)
const onValue = createFactory(OnValue)
const onError = createFactory(OnError)
const entity = createFactory(Entity)
const input = createFactory(Input)
const genres = [
  'Country',
  'Eletronic',
  'Pop',
  'Rock',
  'Reggae',
  'Rap',
  'Classic'
]
const years = []

for (let i = 1990; i < new Date().getFullYear() - 18; i++) years.push(i)

const error = children => p({style: {color: 'red'}}, children)

const ComplexForm = createClass({
  displayName: 'Complex form',
  getInitialState () {
    return {numOfPhones: 1, numOfEmails: 1}
  },
  morePhones (e) {
    e.preventDefault()
    this.setState(({numOfPhones}) => numOfPhones++ && ({numOfPhones}))
  },
  moreEmails (e) {
    e.preventDefault()
    this.setState(({numOfEmails}) => numOfEmails++ && ({numOfEmails}))
  },
  render () {
    const {numOfPhones, numOfEmails} = this.state
    const phones = []
    const emails = []

    for (let key = 0; key < numOfEmails; key++) {
      emails.push(entity({key, name: key},
        p(null, input({name: 'address', type: 'email'})),
        p(null, label(
          input({type: 'checkbox', name: 'sendSpam'}),
          'Send spam?'
        ))))
    }

    for (let key = 0; key < numOfPhones; key++) {
      phones.push(p({key}, input({
        type: 'tel',
        name: key
      })))
    }

    return form({onSubmit: console.log.bind(console), onError: console.error.bind(console)},

      p(null, label('Name')),
      p(null, input({name: 'name', minLength: 4})),

      p(null, label('Emails')),
      entity({name: 'emails'}, emails),

      a({href: '', onClick: this.moreEmails}, 'new email'),

      p(null, label('Password')),
      p(null, input({type: 'password', name: 'password'})),

      p(null, label('Repeat your password')),
      p(null, input({type: 'password', name: 'repeatPassword'})),

      onValue({in: ['password', 'repeatPassword'], test: ({password, repeatPassword}) => password !== repeatPassword},
        error('passwords do not match')),

      p(null, label('Born in')),
      p(null, select({name: 'birthYear'},
        years.map((value, key) =>
          option({key, value}, value)))),

      p(null, label('Language of choice')),
      p(null, label(
        input({name: 'favoriteLanguage', type: 'radio', value: 'js'}),
        'Javascript')),

      p(null, label(
        input({name: 'favoriteLanguage', type: 'radio', value: 'notJs'}),
        'Not Javascript')),

      onValue({in: 'favoriteLanguage', test: ({favoriteLanguage}) => favoriteLanguage !== 'js'},
        error('GET OUT')),

      p(null, label('Favorite genres')),
      p(null, select({name: 'favoriteGenres', multiple: true, defaultValue: ['Country', 'Rap']},
        genres.map((value, key) =>
          option({key, value}, value)))),

      p(null, label('Profile picture')),
      p(null, input({type: 'file', name: 'pic'})),

      p(null, label('Phones')),
      entity({name: 'phones'},
        phones),

      p(null, label('2 + 1')),
      p(null, input({type: 'number', name: 'trivia', shouldEqual: 3})),

      onError({in: 'trivia'}, error('WRONG')),

      a({href: '', onClick: this.morePhones}, 'new phone'),

      p(null, label('OBS')),
      p(null, textArea({name: 'obs', required: true})),
      onError({in: 'obs'}, error('Please talk to me')),

      p(null, button({type: 'submit'}, 'Submit')))
  }
})

render(createElement(ComplexForm), document.getElementById('app'))