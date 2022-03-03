import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { User } from '../models/user';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/'
  private currenUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currenUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currenUserSource.next(user);
          }
      })
    );
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currenUserSource.next(user)
        }
      })
    )
  }

  setCurrentUser(user: User){
    this.currenUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currenUserSource.next(null);
  }

}