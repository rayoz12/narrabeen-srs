import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthInfo } from './auth-info';
import { throwError } from '../../../node_modules/rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authInfo: AuthInfo;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.authInfo = new AuthInfo();
  }

  public async login(user: string, password: string): Promise<Boolean> {

    let formData: FormData = new FormData();
    //formData.append('username', 'narrabeen-admin');
    formData.append('username', user);
    formData.append('authType', 'secret');
    //formData.append('clientSecret', 'password123');
    formData.append('clientSecret', password);

    /*await this.http.post<AuthInfo>('https://jakeholmes.me:5001/vaultish/vauth/v0/login', formData)
      .subscribe(
        data => {
          this.authInfo.expiry = data.expiry.toString();
          this.authInfo.sessionId = data.sessionId.toString();
          this.authInfo.uuid = data.uuid.toString();
          return true;
        },
        error => {
          return false;
        }
      );*/
    try {
      this.authInfo = await this.loginRequest(formData);
      console.log(this.authInfo.sessionId);
      return true;
    } catch(err) {
      return false;
    }
  }

  private async loginRequest(formData: FormData): Promise<AuthInfo> {
    return this.http.post<AuthInfo>('https://jakeholmes.me:5001/vaultish/vauth/v0/login', formData).toPromise();
  }
}
