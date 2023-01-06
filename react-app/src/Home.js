import { Component } from "react";
import { connect } from 'react-redux'
import { getUserAction } from "./store/actions/getUser";

class Home extends Component {
  constructor(props){
    console.log(props)
    super()
  }
  changename=() =>{
    console.log('aaa')
    // this.props.dispatch({type: 'user/changeName', payload: 'liuxsen'})
    this.props.dispatch(getUserAction(2000))
  }
  render(){
    return <div>
      <div>userName: {this.props.user.name}</div>
      <div>loading: {this.props.user.loading}</div>
      <div onClick={this.changename}>change name</div>
    </div>
  }
}

const mapStateToProps = (state,) => {
  return {
    // reduxState: state
    user: state.user
  }
}

const connectHome = connect(mapStateToProps)(Home)

export default connectHome