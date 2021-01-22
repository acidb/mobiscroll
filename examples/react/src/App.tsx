import React, { Component } from 'react';
import { Button, Page, Form, FormGroup, FormGroupContent, FormGroupTitle, Radio, Rating, Segmented, Stepper, Switch, Input } from '@mobiscroll/react-lite';
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
                            <Input type="email" placeholder="me@domain.com" autoComplete="username" labelStyle="floating">Email</Input>
                            <Input type="password" placeholder="Minimum 6 characters" autoComplete="new-password" labelStyle="floating" passwordToggle={true}>Password</Input>
                            <Rating value={4}>
                                Rating
                            </Rating>
                        </FormGroupContent>
                    </FormGroup>

                    <FormGroup collapsible>
                        <FormGroupTitle>About you</FormGroupTitle>
                        <FormGroupContent>
                            <Segmented name="gender" defaultChecked>Male</Segmented>
                            <Segmented name="gender">Female</Segmented>
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
                            <Segmented name="pace" defaultChecked>Show current pace</Segmented>
                            <Segmented name="pace" defaultChecked>Show average pace</Segmented>
                        </FormGroupContent>
                    </FormGroup>

                    <FormGroup collapsible>
                        <FormGroupTitle>Run countdown</FormGroupTitle>
                        <FormGroupContent>
                            <Radio name="group" value={0}>Off</Radio>
                            <Radio name="group" value={3} defaultChecked>3 seconds</Radio>
                            <Radio name="group" value={6}>6 seconds</Radio>
                            <Radio name="group" value={9}>9 seconds</Radio>
                        </FormGroupContent>
                    </FormGroup>

                    <div className="mbsc-btn-group-block">
                        <Button>Save Settings</Button>
                    </div>
                </Form>
            </Page>
        );
    }
}

export default App;
