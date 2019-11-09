import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                jobTitle: post.jobTitle,
                id: post._id,
                jobDescription: post.jobDescription,
                salary: post.salary,
                jobType: post.jobType,
                requiredSkills: post.requiredSkills,
                companyName: post.companyName,
                companyDescription: post.companyDescription,
                location: post.location,
                createdOn: post.createdOn,
                endsOn: post.endsOn,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      jobTitle: string;
      jobDescription: string;
      salary: string;
      jobType: string;
      requiredSkills: string;
      companyName: string;
      companyDescription: string;
      location: string;
      createdOn: string;
      endsOn: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(
    jobTitle: string,
    jobDescription: string,
    salary: string,
    jobType: string,
    requiredSkills: string,
    companyName: string,
    imagePath: File,
    companyDescription: string,
    location: string,
    createdOn: string,
    endsOn: string
  ) {
    const postData = new FormData();
    postData.append("jobTitle", jobTitle);
    postData.append("jobDescription", jobDescription);
    postData.append("salary", salary);
    postData.append("jobType", jobType);
    postData.append("requiredSkills", requiredSkills);
    postData.append("companyName", companyName);
    postData.append("companyDescription", companyDescription);
    postData.append("location", location);
    postData.append("createdOn", createdOn);
    postData.append("endsOn", endsOn);
    postData.append("image", imagePath, jobTitle);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(
    id: string,
    jobTitle: string,
    jobDescription: string,
    salary: string,
    jobType: string,
    requiredSkills: string,
    companyName: string,
    imagePath: File | string,
    companyDescription: string,
    location: string,
    createdOn: string,
    endsOn: string
  ) {
    let postData: Post | FormData;
    if (typeof imagePath === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("jobTitle", jobTitle);
      postData.append("jobDescription", jobDescription);
      postData.append("salary", salary);
      postData.append("jobType", jobType);
      postData.append("requiredSkills", requiredSkills);
      postData.append("companyName", companyName);
      postData.append("companyDescription", companyDescription);
      postData.append("location", location);
      postData.append("createdOn", createdOn);
      postData.append("endsOn", endsOn);
      postData.append("image", imagePath, jobTitle);
    } else {
      postData = {
        id: id,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        salary: salary,
        jobType: jobType,
        requiredSkills: requiredSkills,
        companyName: companyName,
        companyDescription: companyDescription,
        location: location,
        createdOn: createdOn,
        endsOn: endsOn,
        imagePath: imagePath,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe(response => {
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
