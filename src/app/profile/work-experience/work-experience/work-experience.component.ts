import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatDatepickerInputEvent, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { Post } from 'src/app/posts/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Types } from 'src/app/posts/post-create/post-create.component';
import { PostsService } from 'src/app/posts/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';
import { Address } from 'ngx-google-places-autocomplete/objects/address';


@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.css'],

})
export class WorkExperienceComponent {

  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  minDate = new Date();
  newDate;
  myDate;
  todayDate;
  placesRef: GooglePlaceDirective;
  formattedAddress: string;

  events: Types[] = [
    { value: 'Permanent', viewValue: 'Permanent' },
    { value: 'Contract', viewValue: 'Contract' },
    { value: 'Internship', viewValue: 'Internship' },
    { value: 'Freelance', viewValue: 'Freelance' },
  ];

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      salary: new FormControl(null, {
        validators: [Validators.required]
      }),
      type: new FormControl(null, { validators: [Validators.required] }),
      skills: new FormControl(null, {
        validators: [Validators.required]
      }),
      disabled: new FormControl(false, {
        validators: []
      }),
      companyname: new FormControl(null, {
        validators: [Validators.required]
      }),
      companydescription: new FormControl(null, {
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
        validators: [Validators.required]
      }),
      createddate: new FormControl(null, {
        validators: []
      }),
      enddate: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          const nowDate = postData.endsOn.slice(postData.endsOn.indexOf(', ') + 2);
          console.log(nowDate);
          const dateArray = nowDate.split('/');
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
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.jobTitle,
            content: this.post.jobDescription,
            salary: this.post.salary,
            type: this.post.jobType,
            skills: this.post.requiredSkills,
            companyname: this.post.companyName,
            companydescription: this.post.companyDescription,
            city: this.post.location,
            enddate: new Date(
              Number(dateArray[2]),
              Number(dateArray[0]) - 1,
              Number(dateArray[1])),
            createddate: this.post.createdOn,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.todayDate = this.minDate.getMonth() + 1 + '/' + this.minDate.getDate() + '/' + this.minDate.getFullYear();
    console.log(this.todayDate);
    if (this.newDate == null) {
      this.myDate = this.post.endsOn;
    } else {
      this.myDate = this.newDate;
    }
    console.log(this.myDate);
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.salary,
        this.form.value.type,
        this.form.value.skills,
        this.form.value.companyname,
        this.form.value.image,
        this.form.value.companydescription,
        this.form.value.city,
        this.todayDate,
        this.myDate
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.salary,
        this.form.value.type,
        this.form.value.skills,
        this.form.value.companyname,
        this.form.value.image,
        this.form.value.companydescription,
        this.form.value.city,
        this.todayDate,
        this.myDate
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = `${event.value}`;
    this.newDate = date
      .slice(0, date.indexOf('00:00:00') - 1)
      .concat(
        ', ' +
          `${event.value.getMonth() + 1}` +
          '/' +
          `${event.value.getDate()}` +
          '/' +
          `${event.value.getFullYear()}`
      );

  }

  public handleAddressChange(address: Address) {
    this.formattedAddress = address.formatted_address;
  }

}
