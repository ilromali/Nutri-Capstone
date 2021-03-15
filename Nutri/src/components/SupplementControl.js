import React from 'react';
import MaladyList from './MaladyList';
import SupplementList from './SupplementList';
import Resources from './Resources';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeApiCall } from './../actions';
import * as a from './../actions';
import { withFirestore, isLoaded } from 'react-redux-firebase';


class SupplementControl extends React.Component {

    handleSelectMalady = (maladyType, maladyName) => {
        const { dispatch } = this.props;
        const action = a.toggleMal();
        const action2 = a.toggleSuppList();
        const action3 = a.getMalady(maladyName);
        dispatch(makeApiCall(maladyType));
        dispatch(action);
        dispatch(action2);
        dispatch(action3);
        console.log(this.props.suppListVisibleOnPage);
    }

    handleReturnToMainPage = () => {
        const { dispatch } = this.props;
        const action = a.toggleMal();
        const action2 = a.toggleSuppList();
        dispatch(action);
        dispatch(action2);
        console.log("hello");
    }

    render() {
        let currentVisibleState = null;
        const auth = this.props.firebase.auth();
        const { error, suppData } = this.props;
        if (error) {
            return <>Error: {error.message}</>
        } else if (!isLoaded(auth)) {
            return (
                <><h1>Loading...</h1></>
            )
        } else if (isLoaded(auth) && this.props.malListVisibleOnPage) {
            currentVisibleState = <MaladyList onSelectMalady = {this.handleSelectMalady} />;
        } else if (suppData.length > 1 && this.props.suppListVisibleOnPage) {
            currentVisibleState = <SupplementList onSelectBackButton = {this.handleReturnToMainPage} />
        } else if (this.props.resourcesVisible) {
            currentVisibleState = <Resources />
            console.log("Hey");
        }
        return (
            <>
                {currentVisibleState}
                {/* {suppData.length > 1 && <SupplementList />} */}
            </>
        )
    }
}

SupplementControl.propTypes = {
    suppListVisibleOnPage: PropTypes.bool,
    malListVisibleOnPage: PropTypes.bool,
    suppData: PropTypes.array,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    maladyName: PropTypes.string,
    loggedIn: PropTypes.bool
}

const mapStateToProps = state => {
    return {
        suppListVisibleOnPage: state.suppListVisibleOnPage,
        malListVisibleOnPage: state.malListVisibleOnPage,
        suppData: state.suppData,
        isLoading: state.isLoading,
        error: state.error,
        maladyName: state.maladyName,
        firestore: state.firestore,
        loggedIn: state.loggedIn,
        errorMessage: state.errorMessage,
        resourcesVisible: state.resourcesVisible
    }
}

SupplementControl = connect(mapStateToProps)(SupplementControl);

export default withFirestore(SupplementControl);