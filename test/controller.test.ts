import {ToggleCenter} from '../index';

let toggleCenter = new ToggleCenter();
toggleCenter.set({
    sendEmail: false
});
let Toggle = toggleCenter.getDecorator();

class User {

}

class UserController {

    @Toggle('sendEmail')
    async sendEmail(user) {
        console.log('user created');
        return new User();
    }

}

let ctrl = new UserController();

ctrl.sendEmail({});