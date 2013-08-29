(function() {
  var Button, ControlPanel, CurrentTime, StartButton, Timer, TimerPanel, audio, button, continueButtonString, continueMessage, div, getDOMNode, input, messageTime, numberPrefix, pauseButtonString, resetButtonString, startButtonString, strong, thanksButtonString, thanksMessage, timeoutMessage, _ref;

  timeoutMessage = "Timeout!";

  thanksMessage = "Thanks";

  continueMessage = "Continue";

  messageTime = 5;

  startButtonString = "Start";

  pauseButtonString = "Pause";

  thanksButtonString = "Thanks";

  continueButtonString = "Continue";

  resetButtonString = "Reset";

  numberPrefix = function(number, lenght) {
    while (lenght - number.toString().length > 0) {
      number = "0" + number;
    }
    return number;
  };

  _ref = React.DOM, div = _ref.div, strong = _ref.strong, button = _ref.button, input = _ref.input, audio = _ref.audio;

  getDOMNode = function(node) {
    return node.getDOMNode();
  };

  TimerPanel = React.createClass({
    componentWillMount: function() {
      this.node = {};
      this.node.currentTime = CurrentTime({});
      this.node.timer = Timer({
        onPause: this.handlePause
      });
      return this.node.controlPanel = ControlPanel({
        onStart: this.handleStart,
        onPause: this.handlePause,
        onReset: this.handleReset,
        onMessage: this.handleMessage
      });
    },
    handleMessage: function(message, time) {
      return this.node.timer.setState({
        message: message,
        messageTime: time
      });
    },
    handleReset: function() {
      return this.node.timer.reset();
    },
    handlePause: function() {
      var controlPanel, timer;
      controlPanel = this.node.controlPanel.node;
      controlPanel.startButton.setState({
        running: false
      });
      timer = this.node.timer;
      return timer.clearTimer();
    },
    handleStart: function() {
      var timer;
      timer = this.node.timer;
      return timer.start();
    },
    render: function() {
      return div({}, [this.node.currentTime, this.node.timer, this.node.controlPanel]);
    }
  });

  CurrentTime = React.createClass({
    getInitialState: function() {
      return {
        time: this.getTimeString()
      };
    },
    componentDidMount: function() {
      return this.timer = setInterval(this.updateTime, 1000);
    },
    updateTime: function() {
      return this.setState({
        time: this.getTimeString()
      });
    },
    getTimeString: function() {
      var timeString;
      return timeString = (new Date()).toLocaleString("en", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      });
    },
    render: function() {
      return div({
        id: 'time-panel'
      }, "NOW - ", this.state.time);
    }
  });

  Timer = React.createClass({
    getInitialState: function() {
      return {
        leftTime: 0,
        running: false,
        timeout: false,
        message: null,
        messageTime: 0,
        className: null
      };
    },
    start: function() {
      var seconds;
      if (!this.state.running) {
        seconds = 0;
        seconds = seconds + Number(this.refs.minute.getDOMNode().value.trim()) * 60;
        seconds = seconds + Number(this.refs.second.getDOMNode().value.trim());
        this.setState({
          leftTime: seconds,
          running: true
        });
      }
      return this.timer = setInterval(this.updateTime, 1000);
    },
    pause: function() {
      this.setState({
        running: false
      });
      return this.props.onPause();
    },
    clearTimer: function() {
      return clearInterval(this.timer);
    },
    reset: function() {
      this.clearTimer();
      this.pause();
      return this.setState(this.getInitialState());
    },
    updateTime: function() {
      var newMessageTime, newTime;
      if (this.state.leftTime <= 0) {
        this.clearTimer();
        this.setState({
          timeout: true
        });
        return this.pause();
      }
      newTime = this.state.leftTime - 1;
      newMessageTime = this.state.messageTime - 1;
      if (newTime === 60) {
        this.setState({
          className: 'left-1-minute'
        });
      }
      if (newTime === 30) {
        this.setState({
          className: 'left-30-second'
        });
      }
      if (newTime === 10) {
        this.setState({
          className: 'left-10-second'
        });
      }
      return this.setState({
        leftTime: newTime,
        messageTime: newMessageTime
      });
    },
    prettyDisplay: function() {
      var leftTime, minutes, seconds;
      leftTime = this.state.leftTime;
      minutes = numberPrefix(Math.floor(leftTime / 60), 2);
      seconds = numberPrefix(leftTime % 60, 2);
      return "" + minutes + ":" + seconds;
    },
    render: function() {
      if (this.state.message && this.state.messageTime > 0) {
        return div({
          id: 'timer',
          className: 'message'
        }, this.state.message);
      }
      if (this.state.running) {
        return div({
          id: 'timer',
          className: this.state.className
        }, this.prettyDisplay());
      }
      if (this.state.timeout) {
        return div({
          id: 'timer',
          className: 'timeout'
        }, [
          timeoutMessage, audio({
            src: 'ring.mp3',
            autoPlay: true
          })
        ]);
      }
      return div({
        id: 'timer'
      }, [
        input({
          type: 'number',
          defaultValue: '6',
          ref: 'minute'
        }, ":"), input({
          type: 'number',
          defaultValue: '0',
          ref: 'second'
        })
      ]);
    }
  });

  Button = React.createClass({
    componentDidMount: function() {
      var node;
      node = this.getDOMNode();
      return node.addEventListener("click", this.handleClick);
    },
    componentWillUnmonut: function() {
      var node;
      node = this.getDOMNode();
      return node.removeEvnetListener("click", this.handleClick);
    },
    handleClick: function(event) {
      if (this.props.message && this.props.messageTime > 0) {
        return this.props.onClick(this.props.message, this.props.messageTime);
      }
      return this.props.onClick();
    },
    render: function() {
      return button({}, this.props.label);
    }
  });

  StartButton = React.createClass({
    getInitialState: function() {
      return {
        running: false
      };
    },
    componentDidMount: function() {
      var node;
      node = this.getDOMNode();
      return node.addEventListener("click", this.handleClick);
    },
    componentWillUnmonut: function() {
      var node;
      node = this.getDOMNode();
      return node.removeEvnetListener("click", this.handleClick);
    },
    handleClick: function(event) {
      this.setState({
        running: !this.state.running
      });
      if (this.state.running) {
        return this.props.onStart();
      } else {
        return this.props.onPause();
      }
    },
    render: function() {
      this.label = this.state.running ? this.props.pauseLabel : this.props.startLabel;
      return button({}, this.label);
    }
  });

  ControlPanel = React.createClass({
    componentWillMount: function() {
      this.node = {};
      this.node.startButton = StartButton({
        startLabel: startButtonString,
        pauseLabel: pauseButtonString,
        onStart: this.props.onStart,
        onPause: this.props.onPause
      });
      this.node.thanksButton = Button({
        label: thanksButtonString,
        onClick: this.props.onMessage,
        message: thanksMessage,
        messageTime: messageTime
      });
      this.node.continueButton = Button({
        label: continueButtonString,
        onClick: this.props.onMessage,
        message: continueMessage,
        messageTime: messageTime
      });
      return this.node.resetButton = Button({
        label: resetButtonString,
        onClick: this.props.onReset
      });
    },
    render: function() {
      return div({
        id: 'control-panel'
      }, [this.node.startButton, this.node.thanksButton, this.node.continueButton, this.node.resetButton]);
    }
  });

  React.renderComponent(TimerPanel({}), document.body);

}).call(this);
