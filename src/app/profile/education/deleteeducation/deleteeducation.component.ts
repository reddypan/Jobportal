import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { PostsService } from 'src/app/posts/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-deleteeducation',
  templateUrl: './deleteeducation.component.html',
  styleUrls: ['./deleteeducation.component.css']
})
export class DeleteeducationComponent implements OnInit {

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
            this.form.get('degree').disable();
            this.form.get('description').disable();
            this.form.get('startdate').disable();
            this.form.get('enddate').disable();
            this.form.get('location').disable();
            this.form.get('schoolname').disable();
            this.form.get('fieldofstudy').disable();
            this.form.get('grades').disable();
          });
      } else {
        this.mode = "create";
        this.educationId = null;
      }
    });
  }

  onDelete() {
    this.authService.deleteEducation(this.userId, this.educationId);
    this.openSnackBar();
  }

  openSnackBar() {
    //this.onSaveforLaterUse();
    this.snackBar.open("Profile updated successfully!!", 'Dismiss', {
      duration: 2000
    });
  }

}
