import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import FullscreenLoader from '../FullscreenLoader/FullscreenLoader';


const ProtectedRoute = ({ component: Component, isAuthenticated, isRetrieving, ...rest }) => {
  return (
    <FullscreenLoader isLoading={isRetrieving}>
      <Route {...rest} render={
        props => {
          if (isAuthenticated && !isRetrieving) {
            return <Component {...rest} {...props} />
          }
          else if (!isAuthenticated && !isRetrieving) {
            return <Redirect to="/" />
          }
        }
      } />
    </FullscreenLoader>
  )
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isRetrieving: state.auth.isRetrieving
});

export default connect(
	mapStateToProps,
	{}
)(ProtectedRoute);
