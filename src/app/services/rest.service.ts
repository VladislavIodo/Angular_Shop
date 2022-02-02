import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

interface RestRequestOptions {
  params?: HttpParams
}

@Injectable({providedIn: "root"})
export class RestService {
  constructor(private http: HttpClient) {
  }

  public get<T = unknown>(url: string, options: RestRequestOptions = {}): Observable<T> {
    return this.http.get<T>(environment.serverUrl + url, options);
  }

  public post<T = unknown>(url: string, data: object, options?: object): Observable<T> {
    return this.http.post<T>(environment.serverUrl + url, data, options ? options : {});
  }

  public put<T = unknown>(url: string, options?: object): Observable<T> {
    return this.http.put<T>(environment.serverUrl + url, options);
  }

  public delete<T = unknown>(url: string): Observable<T> {
    return this.http.delete<T>(environment.serverUrl + url);
  }
}
