import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { stringify } from 'querystring';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, firstname: string, lastname: string, phone: string) {
    const authData: AuthData = { email: email, password: password, firstname: firstname, lastname: lastname, phone: phone, location: null, role: null, about: null };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, firstname: null, lastname: null, phone: null, location: null, role: null, about: null  };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      location: string;
      role: string;
      phone: string;
      about: string;
      imagePath: string;
      skills: [ {
        skillsname: string;
        skillsgrade: string;
      }];
      workexperience: [{
        _id: string
        jobtitle: string;
        companyname: string;
        companylocation: string;
        startdate: string;
        enddate: string;
        jobdescription: string;
      }];
      education: [{
        degree: string;
        schoolname: string;
        schoollocation: string;
        fieldofstudy: string;
        grades: string;
        startdate: string;
        enddate: string;
        description: string;
      }]
    }>(BACKEND_URL + id);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  addWorkExperience(userId: string, title: string, companyname: string,
    location: string, startdate: string, enddate: string, content: string){
    const workexperience = {
      title: title,
      companyname: companyname,
      location: location,
      startdate: startdate,
      enddate: enddate,
      content: content
    }
    this.http.put(BACKEND_URL + userId, workexperience).subscribe(response => {
      this.router.navigate(['/profile']);
    });
  }

  updateWorkExperience(userId: string, experienceId: string, title: string, companyname: string,
    location: string, startdate: string, enddate: string, content: string){
    const workexperience = {
      id: experienceId,
      title: title,
      companyname: companyname,
      location: location,
      startdate: startdate,
      enddate: enddate,
      content: content
    }
    this.http.put(BACKEND_URL + "updateexperience/" + userId, workexperience).subscribe(response => {
      this.router.navigate(['/profile']);
    });
  }

  addEducation(userId: string, degree: string, schoolname: string,
    location: string, fieldofstudy: string, grades: string, startdate: string,
    enddate: string, description: string){
    const education = {
      degree: degree,
      schoolname: schoolname,
      location: location,
      fieldofstudy: fieldofstudy,
      grades: grades,
      startdate: startdate,
      enddate: enddate,
      description: description
    }
    this.http.put(BACKEND_URL + 'education/' + userId, education).subscribe(response => {
      this.router.navigate(['/profile']);
    });
  }

  updateEducation(userId: string, educationId: string, degree: string, schoolname: string,
    location: string, fieldofstudy: string, grades: string, startdate: string,
    enddate: string, description: string){
    const education = {
      id: educationId,
      degree: degree,
      schoolname: schoolname,
      location: location,
      fieldofstudy: fieldofstudy,
      grades: grades,
      startdate: startdate,
      enddate: enddate,
      description: description
    }
    this.http.put(BACKEND_URL + 'updateeducation/' + userId, education).subscribe(response => {
      this.router.navigate(['/profile']);
    });
  }

  getWorkExperience(userId: string, experienceId: string ) {
    // console.log(this.httpClient.get('http://localhost:3000/api/posts/' + id));
    return this.http.get<{
      _id: string;
      jobtitle: string;
      companyname: string;
      startdate: string;
      enddate: string;
      companylocation: string;
      jobdescription: string;
    }>(BACKEND_URL + 'workexperiences/' + userId + '/' + experienceId);
    // return {...this.posts.find(p => p.id === id)};
  }

  getEducation(userId: string, educationId: string ) {
    // console.log(this.httpClient.get('http://localhost:3000/api/posts/' + id));
    return this.http.get<{
      _id: string;
      degree: string;
      schoolname: string;
      startdate: string;
      enddate: string;
      schoollocation: string;
      description: string;
      fieldofstudy: string;
      grades: string;
    }>(BACKEND_URL + 'education/' + userId + '/' + educationId);
    // return {...this.posts.find(p => p.id === id)};
  }

  deleteEducation(userId: string, educationId: string ) {
    return this.http.delete(BACKEND_URL + "deleteeducation/" + userId + "/" + educationId).subscribe(response => {
      this.router.navigate(['/profile']);
    });
  }

  deleteExperience(userId: string, experienceId: string ) {
    return this.http.delete(BACKEND_URL + "deleteexperience/" + userId + "/" + experienceId).subscribe(response => {
      this.router.navigate(['/profile']);
    });
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
