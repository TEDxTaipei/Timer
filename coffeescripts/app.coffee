
# React DOM
{div, strong, button, input} = React.DOM

# Get DOMNode
getDOMNode = (node) ->
  node.getDOMNode()

TimerPanel = React.createClass {
  componentWillMount: ->
    @node = {}
    @node.timer = (Timer {onPause: @handlePause})
    @node.controlPanel = (ControlPanel {
      onStart: @handleStart
      onPause: @handlePause
      onReset: @handleReset
      onMessage: @handleMessage
    })

  handleMessage: (message, time) ->
    @node.timer.setState {message: message, messageTime: time}

  handleReset: ->
    @node.timer.reset()

  handlePause: ->
    controlPanel = @node.controlPanel.node
    controlPanel.startButton.setState {running: false}
    timer = @node.timer
    timer.clearTimer()

  handleStart: ->
    timer = @node.timer
    timer.start()

  render: ->
    (div {}, [
      @node.timer,
      @node.controlPanel
    ])
}

Timer = React.createClass {
  getInitialState: ->
    {
      leftTime: 0
      running: false
      timeout: false
      message: null
      messageTime: 0
      className: null
    }

  start: ->
    unless @state.running
      seconds = 0
      seconds = seconds + Number(@refs.minute.getDOMNode().value.trim()) * 60
      seconds = seconds + Number(@refs.second.getDOMNode().value.trim())
      @setState {leftTime: seconds, running: true}

    @timer = setInterval(@updateTime, 1000)


  pause: ->
    @setState {running: false}
    @props.onPause()

  clearTimer: ->
    clearInterval(@timer)

  reset: ->
    @clearTimer()
    @pause()
    @setState @getInitialState()

  updateTime: ->
    if @state.leftTime <= 0
      @clearTimer()
      @setState {timeout: true}
      return @pause()
    newTime = @state.leftTime - 1
    newMessageTime = @state.messageTime - 1

    if newTime is 60
      @setState {className: 'left-1-minute'}

    if newTime is 30
      @setState {className: 'left-30-second'}

    if newTime is 10
      @setState {className: 'left-10-second'}

    @setState {leftTime: newTime, messageTime: newMessageTime}

  prettyDisplay: ->
    leftTime = @state.leftTime

    minutes = Math.floor(leftTime/60)
    seconds = leftTime%60

    return "#{minutes} : #{seconds}"

  render: ->
    if @state.message and @state.messageTime > 0 then return (div {className: 'message'}, @state.message)
    if @state.running then return (div {className: @state.className}, @prettyDisplay())
    if @state.timeout then return (div {className: 'timeout'}, "Timeout!")
    (div {}, [
      input {type: 'number', defaultValue: '1', ref: 'minute'}, ":"
      input {type: 'number', defaultValue: '0', ref: 'second'}
    ])
}

Button = React.createClass {
  componentDidMount: ->
    node = @getDOMNode()
    node.addEventListener("click", @handleClick)

  componentWillUnmonut: ->
    node = @getDOMNode()
    node.removeEvnetListener("click", @handleClick)

  handleClick: (event) ->
    if @props.message and @props.messageTime > 0
      return @props.onClick @props.message, @props.messageTime

    @props.onClick()

  render: ->
    (
      button {}, @props.label
    )
}

StartButton = React.createClass {
  getInitialState: ->
    {running: false}

  componentDidMount: ->
    node = @getDOMNode()
    node.addEventListener("click", @handleClick)

  componentWillUnmonut: ->
    node = @getDOMNode()
    node.removeEvnetListener("click", @handleClick)

  handleClick: (event)->
    @setState {running: !@state.running}
    if @state.running
      @props.onStart()
    else
      @props.onPause()

  render: ->
    @label = if @state.running then @props.pauseLabel else @props.startLabel

    (
      button {}, @label
    )
}

ControlPanel = React.createClass {
  componentWillMount: ->
    @node = {}
    @node.startButton = (StartButton {startLabel: 'Start', pauseLabel: 'Pause', onStart: @props.onStart, onPause: @props.onPause})
    @node.thanksButton = (Button {label: 'Thanks', onClick: @props.onMessage, message: 'Thanks', messageTime: 5})
    @node.continueButton = (Button {label: 'Continue', onClick: @props.onMessage, message: 'Continue', messageTime: 5})
    @node.resetButton = (Button {label: 'Reset', onClick: @props.onReset})
  render: ->
    (
      div {}, [
        @node.startButton
        @node.thanksButton
        @node.continueButton
        @node.resetButton
      ]
    )
}

React.renderComponent (TimerPanel {}), document.body
