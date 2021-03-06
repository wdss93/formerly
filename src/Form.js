const formState = require('./formState')
const debounce = require('debounce')
const assign = require('object-assign')
const assignDeep = require('assign-deep')
const {DOM, createClass, PropTypes} = require('react')
const obj = require('object-path')
const omit = require('object.omit')
const Emitter = require('emmett')

const emitter = new Emitter()

module.exports = createClass({
  displayName: 'Form',
  propTypes: {
    name: PropTypes.string,
    value: PropTypes.object,
    children: PropTypes.node.isRequired,
    useHTML5Validation: PropTypes.bool,
//    persist: PropTypes.bool,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func
  },
  getDefaultProps () {
    return {
      name: Math.random().toString(36).substr(2)
    }
  },
  childContextTypes: {
    onReset: PropTypes.func.isRequired,
    serializeForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    getAbsoluteName: PropTypes.func.isRequired,
    onValue: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
  },
  getChildContext () {
    return {
      onReset: this.onReset,
      serializeForm: this.serialize,
      resetForm: this.reset,
      getAbsoluteName: this.getAbsoluteName,
      onValue: this.onValue,
      getValue: this.getValue,
      setValue: this.setValue,
      onError: this.onError,
      getError: this.getError,
      setError: this.setError
    }
  },
  componentWillMount () {
    assign(this, formState(this.props.name))
    this.setValueFromProps()

    const _setValue = this.setValue

    this.reportChange = debounce(() => {
      const {onChange} = this.props

      if (onChange) {
        const {errors, values} = this.serialize()
        onChange(errors, values)
      }
    }, 100)

    this.setValue = (...args) => {
      _setValue(...args)
      this.reportChange()
    }
  },
  getAbsoluteName (name) {
    return name
  },
  onSubmit (e) {
    e.preventDefault()

    const {onSubmit} = this.props

    if (!onSubmit) return

    const {errors, values} = this.serialize()

    onSubmit(errors, values)
  },
  onReset (fn) {
    emitter.on('reset', fn)
    return () => emitter.off('reset', fn)
  },
  setValueFromProps () {
    this.setRoot({}, assignDeep({}, this.props.value))
  },
  reset () {
    this.refs.form.reset()
    this.setValueFromProps()
    emitter.emit('reset')
  },
  serialize () {
    const errors = obj({})
    const values = obj({})
    const visited = {}
    const {elements} = this.refs.form
    let hasError = false

    for (const key in elements) {
      const el = obj(elements[key])
      const name = el.get('name')

      if (name === undefined) continue
      if (el.get('type') === 'radio' && !el.get('checked')) continue
      if (el.get('dataset.formerly') !== '' && el.get('attributes.data-formerly.value') !== '') continue

      if (visited[name] !== undefined) continue

      visited[name] = true

      const error = this.getError(name)

      values.set(name, this.getValue(name))

      if (error) {
        hasError = true
        errors.set(name, error)
      }
    }

    return {
      errors: hasError ? errors.get() : null,
      values: values.get()
    }
  },
  render () {
    const {onSubmit} = this
    const {children, useHTML5Validation} = this.props
    return DOM.form(assign(omit(this.props, 'value', 'children', 'onChange', 'onSubmit'), {
      onSubmit,
      ref: 'form',
      noValidate: !useHTML5Validation
    }), children)
  }
})
