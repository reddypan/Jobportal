import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatDatepickerInputEvent, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MatSnackBar } from '@angular/material';
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
  selector: 'app-addeducation',
  templateUrl: './addeducation.component.html',
  styleUrls: ['./addeducation.component.css']
})
export class AddeducationComponent implements OnInit {

  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  userId: string;
  mode = "create";
  educationId: string;
  private postId: string;
  experience;
  private authStatusSub: Subscription;
  newDate;
  myDate;
  todayDate;
  placesRef: GooglePlaceDirective;
  formattedAddress: string;
  newlyUpdatedStartDate: string;
  newlyUpdatedEndDate: string;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
      this.userId = this.authService.getUserId();
    this.form = new FormGroup({
      degree: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      fieldofstudy: new FormControl(null, { validators: [Validators.required] }),
      grades: new FormControl(null, { validators: [Validators.required] }),
      disabled: new FormControl(false, {
        validators: []
      }),
      schoolname: new FormControl(null, {
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      startdate: new FormControl(null, {
        validators: []
      }),
      enddate: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
      if (paramMap.has("educationId")) {
        this.mode = "edit";
        this.educationId = paramMap.get("educationId");
        this.authService
          .getEducation(this.userId, this.educationId)
          .subscribe(contactData => {
          const startDate = contactData.startdate.slice(contactData.startdate.indexOf(', ') + 2);
          const dateArray = startDate.split('/');
          const endDate = contactData.enddate.slice(contactData.enddate.indexOf(', ') + 2);
          const dateArray2 = endDate.split('/');
            this.experience = {
              id: contactData._id,
              degree: contactData.degree,
              description: contactData.description,
              location: contactData.schoollocation,
              schoolname: contactData.schoolname,
              startdate: contactData.startdate,
              enddate: contactData.enddate,
              fieldofstudy: contactData.fieldofstudy,
              grades: contactData.grades,
            };
            this.form.setValue({
              degree: this.experience.degree,
              description: this.experience.description,
              schoolname: this.experience.schoolname,
              startdate: new Date(
                Number(dateArray[2]),
                Number(dateArray[0]) - 1,
                Number(dateArray[1])
              ),
              enddate: new Date(
                Number(dateArray2[2]),
                Number(dateArray2[0]) - 1,
                Number(dateArray2[1])
              ),
              disabled: false,
              location: this.experience.location,
              fieldofstudy: this.experience.fieldofstudy,
              grades: this.experience.grades
            });
          });
      } else {
        this.mode = "create";
        this.educationId = null;
      }
    });
  }


  onSaveEducation() {
    if (this.form.invalid) {
      return;
    }
    if (this.newDate == null) {
      this.newlyUpdatedStartDate = this.experience.startdate;
    } else {
      this.newlyUpdatedStartDate = this.newDate;
    }
    if (this.myDate == null) {
      this.newlyUpdatedEndDate = this.experience.enddate;
    } else {
      this.newlyUpdatedEndDate = this.myDate;
    }
    if (this.mode === 'create') {
    this.authService.addEducation(
      this.userId,
      this.form.value.degree,
      this.form.value.schoolname,
      this.form.value.location,
      this.form.value.fieldofstudy,
      this.form.value.grades,
      this.newlyUpdatedStartDate,
      this.newlyUpdatedEndDate,
      this.form.value.description,
    );
    } else {
      this.authService.updateEducation(
        this.userId,
        this.educationId,
        this.form.value.degree,
        this.form.value.schoolname,
        this.form.value.location,
        this.form.value.fieldofstudy,
        this.form.value.grades,
        this.newlyUpdatedStartDate,
        this.newlyUpdatedEndDate,
        this.form.value.description,
      );
    }
    this.openSnackBar();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = `${event.value}`;
    this.newDate = date
      .slice(0, date.indexOf('00:00:00') - 1).slice(date.indexOf(" ") + 1).concat(
        ', ' +
          `${event.value.getMonth() + 1}` +
          '/' +
          `${event.value.getDate()}` +
          '/' +
          `${event.value.getFullYear()}`
      );
  }

  addEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = `${event.value}`;
    this.myDate = date
      .slice(0, date.indexOf('00:00:00') - 1).slice(date.indexOf(" ") + 1 ).concat(
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

  openSnackBar() {
    this.snackBar.open("Profile updated successfully!!", 'Dismiss', {
      duration: 2000
    });
  }

}
