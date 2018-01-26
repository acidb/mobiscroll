import { createComponent, mobiscroll } from './frameworks/jquery';
import { Form } from './classes/forms';
import { Progress } from './classes/progress';
import { Slider } from './classes/slider';
import { Stepper } from './classes/stepper';
import { Switch } from './classes/switch';
import { Rating } from './classes/rating';
import './page.jquery';

createComponent('form', Form, false);
createComponent('progress', Progress, false);
createComponent('slider', Slider, false);
createComponent('stepper', Stepper, false);
createComponent('switch', Switch, false);
createComponent('rating', Rating, false);

export default mobiscroll;
