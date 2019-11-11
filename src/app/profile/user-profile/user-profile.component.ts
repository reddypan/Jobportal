import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MatSidenavContainer, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from 'src/app/posts/posts.service';
import { AuthData } from 'src/app/auth/auth-data.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements AfterViewInit, OnInit {

  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  user;

  options: FormGroup;
  opened: boolean = true;

  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;

  workexperiences = ['123', '1312'];

  constructor(fb: FormBuilder, public postsService: PostsService,
    private authService: AuthService) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });

  }

  formatLabel(value: number) {
    if (value >= 1) {
      return value + '%';
    }

    return value;
  }

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(
    );
  }


  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authService.getUser(this.userId).subscribe(userData => {
      this.user = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        location: userData.location,
        phone: userData.phone,
        role: userData.phone,
        about: userData.about,
        skills: userData.skills,
        workexperience: userData.workexperience,
        education: userData.education
      };
    });
  }

}
