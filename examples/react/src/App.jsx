import React, { Component } from 'react';
import { Page, Form, Rating, Stepper, Switch } from 'mobiscroll-react';
import 'mobiscroll-react/dist/css/mobiscroll.min.css';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <Page>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
        </div>
        <Form>
          <div className="mbsc-form-group">
            <div className="mbsc-form-group-title">Account information</div>
            <label>
              First Name
              <input type="text" placeholder="What's your first name?" />
            </label>
            <label>
              Last Name
              <input type="text" placeholder="What's your last name?" />
            </label>
            <label>
              Email
              <input type="email" placeholder="me@domain.com" />
            </label>
            <label>
              Password
              <input type="password" placeholder="Minimum 6 characters" data-password-toggle="true" />
            </label>
            <Rating value={4}>
              Rating
            </Rating>
          </div>
          <div className="mbsc-form-group">
            <div className="mbsc-form-group-title">About you</div>
            <label>
              Male
              <input type="radio" data-role="segmented" name="gender" defaultChecked />
            </label>
            <label>
              Female
              <input type="radio" data-role="segmented" name="gender" />
            </label>
            <Stepper min={130} max={220} value={170} data-val="left">
              Height (cm)
            </Stepper>
            <Stepper min={30} max={180} value={85} data-val="left">
              Weight (kg)
            </Stepper>
          </div>

          <div className="mbsc-form-group">
            <div className="mbsc-form-group-title">General settings</div>
            <Switch>
              Indoor/Treadmill
            </Switch>
            <Switch defaultChecked>
              Auto-Pause Run
              <span className="mbsc-desc">
                Automatically pause workout when you stop moving. This is useful if you don&apos;t want to manually pause and resume.
              </span>
            </Switch>
          </div>

          <div className="mbsc-form-group">
            <div className="mbsc-form-group-title">On screen</div>
            <Switch defaultChecked>
              Heart Rate
            </Switch>
            <Switch>
              Cheers
            </Switch>
            <label>
              Show current pace
              <input type="radio" data-role="segmented" name="pace" defaultChecked />
            </label>
            <label>
              Show average pace
              <input type="radio" data-role="segmented" name="pace" />
            </label>
          </div>

          <div className="mbsc-form-group">
            <div className="mbsc-form-group-title">Run countdown</div>
            <label>
              <input type="radio" name="group" /> Off
            </label>
            <label>
              <input type="radio" name="group" defaultChecked /> 3 seconds
            </label>
            <label>
              <input type="radio" name="group" /> 6 seconds
            </label>
            <label>
              <input type="radio" name="group" /> 9 seconds
            </label>
          </div>

          <div className="mbsc-btn-group-block">
            <button>Save Settings</button>
          </div>
        </Form>
      </Page>
    );
  }
}

export default App;
