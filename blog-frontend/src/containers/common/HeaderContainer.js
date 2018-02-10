import React, { Component } from 'react';
import Header from 'components/common/Header';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class HeaderContainer extends Component {
  handleRemove = () => {
    const { BaseActions } = this.props;
    BaseActions.showModal('remove');
  }

  render() {
    const { handleRemove } = this;
    const { match } = this.props;

    const { id } = match.params;

    return (
      <Header
        postId={id}
        onRemove={handleRemove}
      />
    );
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(withRouter(HeaderContainer));