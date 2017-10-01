import React, { Component } from 'react';
import Input from 'material-ui/Input';

class NumberInput extends Component {
  state = {
    error: false
  };

  handleChange = (event) => {
    const { onChange, min, max } = this.props;
    const value = Number(event.target.value);
    if (value >= min && value <= max) {
      this.setState({ error: false });
      onChange(event);
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { min, max, step } = this.props;
    const inputProps = { min, max, step };
    return (
      <Input
        {...this.props}
        inputProps={inputProps}
        onChange={this.handleChange}
        error={this.state.error} />
    );
  }
}

export default NumberInput;
