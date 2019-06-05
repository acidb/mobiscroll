import React, { Component } from 'react';
import { Page, Form, FormGroup, FormGroupContent, FormGroupTitle, Rating, Stepper, Switch, Input } from '@mobiscroll/react-lite';
import './App.scss';

class App extends Component {
  render() {
    return (
      <Page>
        <Form>
          <FormGroup collapsible open>
            <FormGroupTitle>Account information</FormGroupTitle>
            <FormGroupContent>
              <Input type="text" placeholder="What's your first name?" labelStyle="floating">First Name</Input>
              <Input type="text" placeholder="What's your last name?" labelStyle="floating">Last Name</Input>
              <Input type="email" placeholder="me@domain.com" labelStyle="floating">Email</Input>
              <Input type="password" placeholder="Minimum 6 characters" labelStyle="floating" passwordToggle={true}>Password</Input>
              <Rating value={4}>
                Rating
            </Rating>
            </FormGroupContent>
          </FormGroup>

          <FormGroup collapsible>
            <FormGroupTitle>About you</FormGroupTitle>
            <FormGroupContent>
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
            </FormGroupContent>
          </FormGroup>

          <FormGroup collapsible>
            <FormGroupTitle>General settings</FormGroupTitle>
            <FormGroupContent>
              <Switch>
                Indoor/Treadmill
            </Switch>
              <Switch defaultChecked>
                Auto-Pause Run
              <span className="mbsc-desc">
                  Automatically pause workout when you stop moving. This is useful if you don&apos;t want to manually pause and resume.
              </span>
              </Switch>
            </FormGroupContent>
          </FormGroup>

          <FormGroup collapsible>
            <FormGroupTitle>On screen</FormGroupTitle>
            <FormGroupContent>
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
            </FormGroupContent>
          </FormGroup>

          <FormGroup collapsible>
            <FormGroupTitle>Run countdown</FormGroupTitle>
            <FormGroupContent>
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
            </FormGroupContent>
          </FormGroup>

          <div className="mbsc-btn-group-block">
            <button>Save Settings</button>
          </div>
        </Form>
      </Page>
    );
  }
}

export default App;
