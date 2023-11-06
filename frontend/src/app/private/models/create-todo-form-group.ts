import { FormControl } from '@angular/forms';
import { Complexity, Status } from './todo-item';

export interface CreateTodoFormGroup {
  complexity: FormControl<Complexity | null>;
  text: FormControl<string | null>;
  subTitle: FormControl<string | null>;
  title: FormControl<string | null>;
  status: FormControl<Status | null>;
}
