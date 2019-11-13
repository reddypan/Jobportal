import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatSidenavContainer } from '@angular/material';

import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/posts/post.model';
import { PostsService } from 'src/app/posts/posts.service';

@Component({
  selector: 'app-viewapplicants',
  templateUrl: './viewapplicants.component.html',
  styleUrls: ['./viewapplicants.component.css']
})
export class ViewapplicantsComponent implements OnInit {

  postId: string;
  post;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  opened: boolean = true;

  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("jobId")) {
          this.postId = paramMap.get("jobId");
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              jobTitle: postData.jobTitle,
              jobDescription: postData.jobDescription,
              salary: postData.salary,
              jobType: postData.jobType,
              requiredSkills: postData.requiredSkills,
              companyName: postData.companyName,
              imagePath: postData.imagePath,
              companyDescription: postData.companyDescription,
              location: postData.location,
              createdOn: postData.createdOn,
              endsOn: postData.endsOn,
              creator: postData.creator,
              appliedpeople: postData.appliedpeople
            };
          });
        }
      });
  }

}
