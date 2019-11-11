import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-applyjob',
  templateUrl: './applyjob.component.html',
  styleUrls: ['./applyjob.component.css']
})
export class ApplyjobComponent implements OnInit {

  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  user;
  jobId: string;

  options: FormGroup;
  opened: boolean = true;

  workexperiences = ['123', '1312'];
  sidenavContainer: any;

  constructor(fb: FormBuilder, public postsService: PostsService, public route: ActivatedRoute, private snackBar: MatSnackBar,
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
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("jobId")) {
        this.jobId = paramMap.get("jobId");
      }
    });
  }


  onApply(){
    this.postsService.addApplication(this.jobId, this.userId);
    this.openSnackBar();
  }

  openSnackBar() {
      //this.onSaveforLaterUse();
      this.snackBar.open("Application submitted successfully!!", 'Dismiss', {
        duration: 2000
      });
  }
}
