const {cloneElement, DOM, Children, createClass, PropTypes} = require('react')

module.exports = createClass({
  displayName: 'OnValue',
  propTypes: {
    children: PropTypes.node.isRequired,
    in: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired,
    test: PropTypes.func
  },
  contextTypes: {
    getAbsoluteName: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    onValue: PropTypes.func.isRequired
  },
  getInitialState () {
    return {}
  },
  componentDidMount () {
    this.unsubscribers = []
    this.references().forEach(name =>
      this.unsubscribers.push(
        this.context.onValue(this.context.getAbsoluteName(name),
          () => this.forceUpdate())))
  },
  componentWillUnmount () {
    this.unsubscribers.forEach(fn => fn())
  },
  references () {
    const {props} = this
    return Array.isArray(props.in) ? props.in : [props.in]
  },
  render () {
    const state = {}

    this.references()
      .forEach(relativeName => {
        const name = this.context.getAbsoluteName(relativeName)
        const value = this.context.getValue(name)
        if (value === undefined) return
        state[relativeName] = value
      })

    const {children, test} = this.props

    if (!Object.keys(state).length) return null
    if (test && !test(state)) return null

    return DOM.div(null, Children.map(children,
      child => cloneElement(child, state)))
  }
})
