import React from 'react';
import ReactDOM from 'react-dom';

// A placeholder image if the user does not have one
const PLACEHOLDER = 'https://placeimg.com/60/60/people'
// An anonymous user if the message does not have that information
const dummyUser = {
  avatar: PLACEHOLDER,
  email: 'Anonymous'
}

// Establish a Socket.io connection
const socket = io()
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }))

const ComposeMessage = React.createClass({
  getInitialState() {
    return { text: '' }
  },

  updateText(ev) {
    this.setState({ text: ev.target.value })
  },

  sendMessage(ev) {
    app.service('messages').create(this.state)
      .then(() => this.setState({ text: '' }))
    ev.preventDefault()
  },

  render() {
    return (
      <form className="flex flex-row flex-space-between" onSubmit={this.sendMessage}>
        <input type="text" name="text" className="flex flex-1"
          value={this.state.text} onChange={this.updateText} />
        <button className="button-primary" type="submit" style={{"backgroundColor":"#00B781"}} >Send</button>
      </form>
    )
  }
})

const NewGroup = React.createClass({
  getInitialState() {
    return { query: '' }
  },

  updateText(ev) {
    this.setState({ query: ev.target.value })
  },

  makeGroup(ev) {
    app.service('groups').create(this.state)
      .then(() => this.setState({ query: '' }))
    ev.preventDefault()
  },
  
  render() {
    return (
      <form className="flex flex-row flex-space-between" onSubmit={this.makeGroup}>
        <input type="text" name="text" className="flex flex-1"
          value={this.state.query} onChange={this.updateText} />
        <button className="button-primary" type="submit" style={{"backgroundColor":"#00B781"}}>+</button>
      </form>
    )

  }
});

const GroupList = React.createClass({
  renderGroupItem(group) {
    return (
      <li>
        <a className="block relative" href="#">
          <h5 className="">{group.topic || group.query}</h5>
          &nbsp;
          <span className="sent-date font-300">
              {moment(group.createdAt).format('MMM Do, hh:mm:ss')}
          </span>

        </a>
      </li>
    )
  },

  render() {
    const groups = this.props.groups || [];

    return (
      <aside className="sidebar col col-1 flex flex-column flex-space-between">
        <header className="flex flex-row flex-center">
          <h4 className="font-300 text-center">
            <span className="font-600 online-count">{groups.length}</span> groups
          </h4>
        </header>
          <NewGroup />

        <ul className="flex flex-column flex-1 list-unstyled user-list">
          {groups.map(group =>
            this.renderGroupItem(group)
          )}
        </ul>
      </aside>
    )
  }
})


const UserList = React.createClass({
  getInitialState() {
    return {
      group : ""
    }
  },
  logout() {
    app.logout().then(() => window.location.href = '/login.html')
  },

  renderNewUserItem(user) {
    return (
      <li>
        <a className="block relative" href="#">
          <img src={ PLACEHOLDER} className="avatar" />
          <span className="absolute username">{isNaN(user.value.id) ? user.value.id : user.value.name}</span>
        </a>
      </li>
    )
  },
  renderUserItem(user) {
    return (
      <li>
        <a className="block relative" href="#">
          <img src={user.facebook.picture.data.url || PLACEHOLDER} className="avatar" />
          <span className="absolute username">{user.facebook.name}</span>
        </a>
      </li>
    )
  },
  render() {
    const userService = app.service('users')
    const groupService = app.service('groups')
    const users = this.props.users
    var group = app.get('user').currentGroup;
    groupService.get(group)
    .then((gr) => {
      console.log(gr);
      this.state.group = gr || this.state.group;
    });
     userService.on('created', user => {
       group = app.get('user').currentGroup;
        groupService.get(group)
        .then((gr) => {
          console.log(gr);
          this.state.group = gr || this.state.group;
        });
     });
    return (
      <aside className="sidebar col col-3 flex flex-column flex-space-between">
        <header className="flex flex-row flex-center">
          <h4 className="font-300 text-center">
            <span className="font-600 online-count">{users.length}</span> users
          </h4>
        </header>

        <ul className="flex flex-column flex-1 list-unstyled user-list">
          {
             (!!this.state.group) ?
              this.state.group.fbUsers.slice(0,5).map(user =>
                this.renderNewUserItem(user)
              )
            :
          users.map(user =>
            this.renderUserItem(user)
          )}
        </ul>
        <footer className="flex flex-row flex-center">
          <a href="#" className="logout button button-primary" onClick={this.logout} style={{"backgroundColor":"#00B781"}}>Sign Out</a>
        </footer>
      </aside>
    )
  }
})

const MessageList = React.createClass({
  renderMessage(message) {

    const sender = typeof message.sentBy === 'object' ? message.sentBy : dummyUser
    console.log(message);

    return (
      <div className="message flex flex-row">
        <img src={sender.avatar || PLACEHOLDER} alt={sender.email} className="avatar" />
        <div className="message-wrapper">
          <p className="message-header">
            <span className="username font-600">{sender.email}</span>&nbsp;
            <span className="sent-date font-300">
              {moment(message.createdAt).format('MMM Do, hh:mm:ss')}
            </span>
          </p>
          <p className="message-content font-300">
            {message.text}
          </p>
        </div>
      </div>
    )
  },

  render() {
    return (
      <main className="chat flex flex-column flex-1 clear">
        {this.props.messages.map(this.renderMessage)}
      </main>
    )
  }
})

const ChatApp = React.createClass({
  getInitialState() {
    return {
      users: [],
      messages: [],
      groups: [],
      currentGroup: "Viewing all groups",
      me: null
    }
  },

  componentDidUpdate: function() {
    const node = ReactDOM.findDOMNode(this).querySelector('.chat')
    node.scrollTop = node.scrollHeight - node.clientHeight
  },

  componentDidMount() {
    const userService = app.service('users')
    const messageService = app.service('messages')
    const groupService = app.service('groups')
    
    // Find all users initially
    userService.find().then(page => this.setState({ users: page.data }))
    // Listen to new users so we can show them in real-time
    userService.on('created', user => this.setState({
      users: this.state.users.concat(user)
    }))

    groupService.find({
      query: {
        $sort: { createdAt: 1 }
      }
    }).then(page => this.setState({groups: page.data }))
    groupService.on('created', group => this.setState({
      groups: this.state.groups.concat(group)
    }))

    var curQuery = localStorage.getItem("groupQuery");
    if (!!curQuery) {
      localStorage.setItem("cachedQuery", curQuery);
      localStorage.removeItem("groupQuery");
      this.state.currentGroup = curQuery;
      app.service('groups').create({query: curQuery})
        .then(() => {this.state.currentGroup = curQuery} )

    } else if (!!localStorage.getItem("cachedQuery") && localStorage.getItem("cachedQuery") !== 'null') {
      this.state.currentGroup = localStorage.getItem("cachedQuery") ;
    }
    // Find the last 10 messages
    messageService.find({
      query: {
        $sort: { createdAt: 1 },
        $limit: this.props.limit || 10
      }
    }).then(page => this.setState({ messages: page.data }))
    // Listen to newly created messages
    messageService.on('created', message => this.setState({
      messages: this.state.messages.concat(message)
    }))
  },

  render() {
    return (
      <div className="flex flex-row flex-1 clear">
        <GroupList groups={this.state.groups} />
        <UserList users={this.state.users} />
        <div className="flex flex-column col col-6">
        <p></p>
        <h4>Current group: {this.state.currentGroup}</h4>
          <MessageList users={this.state.users} messages={this.state.messages} curGroup = {this.state.currentGroup} />
          <ComposeMessage />
        </div>
      </div>
    )
  }
})

const Header = () => {
  return (
    <div id="header">
      <header className="title-bar flex flex-row flex-center" style={{backgroundColor: "#00B781"}}>
        <div className="title-wrapper block center-element">
          <img className="logo" src="/images/logo-hs-white.svg" alt="HeySquad Login" />
        </div>
      </header>
    </div>

  )
}

const App = () => {
  return (
    <div id="app" className="flex flex-column">
      <Header />
      <ChatApp />
    </div>
  )
}

const fbResponse = (response) => {
  console.log(response.accessToken);
}
const fbCallback = (e) => {
  e.preventDefault();
  window.location.href='/auth/facebook';
}

import FacebookLogin from 'react-facebook-login';
const Login = () => {
  return (
    <div id="app" className="">
      <Header />
      <div className="container" style={{"paddingTop": "150px"}}>
        <div className="row">
          <div className="col-md-4">
          </div>
          <div className="col-md-4">
            <a className="btn btn-block  btn-facebook btn-lg"  style={{"color":"white", "textAlign":"center"}} href="/auth/facebook">
              <i className="fa fa-facebook fa-lg"></i>
              &nbsp; &nbsp;Sign in with Facebook
            </a>
          </div>
        </div>
        <div className="flex flex-center">
          <p><br/>Just one step to get started, we promise.</p>
      </div>
      </div>
      
    </div>
  )
}

app.authenticate().then(() => {
  ReactDOM.render(<App />, document.body);
}).catch(error => {
  if(error.code === 401) {
   // window.location.href = '/login.html'
   ReactDOM.render(<Login />, document.body);

  }

  console.error(error);
})

