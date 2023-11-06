import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RegisterForm, User} from '../../models';
import {IForm} from '../../../shared/models/form.util';
import {CustomValidators} from '../../validators/custom-validators';
import {UserService} from '../../services/user.service';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);

  form: FormGroup<IForm<RegisterForm>> = new FormGroup<IForm<RegisterForm>>({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    passwordConfirm: new FormControl(null, Validators.required)
  }, {
    validators: CustomValidators.passwordMatching
  })

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  get username() {
    return this.form.get('username') as FormControl<string>;
  }

  get password() {
    return this.form.get('password') as FormControl<string>;
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm') as FormControl<string>;
  }

  register() {
    if (this.form.valid) {
      this.userService.register(this.form.getRawValue() as User)
        .pipe(tap(() => this.router.navigate(['../login'])))
        .subscribe()
    }
  }

}
