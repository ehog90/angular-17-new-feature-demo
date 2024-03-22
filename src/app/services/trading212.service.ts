import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Trading212CashResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class Trading212Service {
  private readonly apiKey = environment.t212ApiKey;

  private readonly httpClient = inject(HttpClient);

  constructor() {}

  public getAccountCash() {
    return this.httpClient.get<Trading212CashResponse>(
      '/t212/api/v0/equity/account/cash',
      {
        headers: {
          authorization: this.apiKey,
        },
      }
    );
  }
}
