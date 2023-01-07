import { Component } from "react";
import { connect } from 'react-redux'
import { getUserInfo, userActionConst } from "./store/actions/user";
// import { getUserAction } from "./store/actions/getUser";

class Home extends Component {
  constructor(props){
    console.log(props)
    super()
  }
  changename=() =>{
    // console.log('aaa')
    // this.props.dispatch({type: 'user/changeName', payload: 'liuxsen'})
    this.props.dispatch(getUserInfo(1))
  }
  render(){
    return <div>
      <div>userName: {this.props.user.name}</div>
      <div>userId: {this.props.user.id}</div>
      <div>loading: {this.props.loading === true ? 'loading' : ''}</div>
      <div>error: {this.props.error ? this.props.error.message : ''}</div>
      <div onClick={this.changename}>change name</div>
    </div>
  }
}

const mapStateToProps = (state,) => {
  return {
    reduxState: state,
    user: state.user,
    loading: state.loading[userActionConst.actionName],
    error: state.loading[userActionConst.error],
  }
}

const connectHome = connect(mapStateToProps)(Home)

export default connectHome