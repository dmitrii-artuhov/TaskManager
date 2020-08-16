import React, { Component, Fragment } from 'react'

// styles
import './Autocomplete.scss';

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: ""
    }
  }

  // Event fired when the input value is changed
  onChange = e => {
    const { items } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = items.filter(
      suggestion => (suggestion.username.toLowerCase().indexOf(userInput.toLowerCase()) > -1 && !this.props.isInvalid(suggestion._id))
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
			userInput: e.currentTarget.value,
    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      this.setState({
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion].username
      });
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
			e.preventDefault();
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
			e.preventDefault();
      if (activeSuggestion === filteredSuggestions.length - 1) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
				userInput,
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
						<ul className="participants-users">
							{ filteredSuggestions.map((item, index) => {
								let className;

								// Flag the active suggestion with a class
								if (index === activeSuggestion) {
									className = "participants-users__item--active";
								}

								return (
									<li
										key={item._id}
										className={className}
										onClick={onClick}
									>
										<div className="participants-users__wrapper">
											<div className="participants-users__avatar">
												<img src={`/assets/avatars/${item.avatar}`} alt="avatar"/>
											</div>
											<div className="participants-users__name">
												{item.username}
											</div>
										</div>
									</li>
								);
							}) }
						</ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <p style={{ margin: '15px 0 0 0' }}>No data</p>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <input
					autoFocus
					className="participants-input"
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
				{ userInput && !showSuggestions && (
					<div className="participants-commands">
						<ul>
							<li onClick={() => { this.props.onClose(); this.props.onInvite(userInput); }}>Invite</li>
						</ul>
					</div>
				) }
      </Fragment>
    );
  }
}

/*
<input
autoFocus
className="participants-input"
type="text"
/>
*/