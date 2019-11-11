import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostsService } from 'src/app/posts/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-deleteworkexperience',
  templateUrl: './deleteworkexperience.component.html',
  styleUrls: ['./deleteworkexperience.component.css']
})
export class DeleteworkexperienceComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  userId: string;
  mode = "create";
  experienceId: string;
  private postId: string;
  experience;
  private authStatusSub: Subscription;
  newDate;
  myDate;
  todayDate;
  formattedAddress: string;
  newlyUpdatedStartDate: string;
  newlyUpdatedEndDate: string;


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
      this.userId = this.authService.getUserId();
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      disabled: new FormControl(false, {
        validators: []
      }),
      companyname: new FormControl(null, {
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
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
      if (paramMap.has("experienceId")) {
        this.mode = "edit";
        this.experienceId = paramMap.get("experienceId");
        this.authService
          .getWorkExperience(this.userId, this.experienceId)
          .subscribe(contactData => {
            const startDate = contactData.startdate.slice(contactData.startdate.indexOf(', ') + 2);
          const dateArray = startDate.split('/');
          const endDate = contactData.enddate.slice(contactData.enddate.indexOf(', ') + 2);
          const dateArray2 = endDate.split('/');
            this.experience = {
              id: contactData._id,
              jobtitle: contactData.jobtitle,
              jobdescription: contactData.jobdescription,
              location: contactData.companylocation,
              companyname: contactData.companyname,
              startdate: contactData.startdate,
              enddate: contactData.enddate
            };
            this.form.setValue({
              title: this.experience.jobtitle,
              content: this.experience.jobdescription,
              companyname: this.experience.companyname,
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
              city: this.experience.location,
            });
            this.form.get('title').disable();
            this.form.get('content').disable();
            this.form.get('startdate').disable();
            this.form.get('enddate').disable();
            this.form.get('city').disable();
            this.form.get('companyname').disable();
          });
      } else {
        this.mode = "create";
        this.experienceId = null;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onDelete() {
    this.authService.deleteExperience(this.userId, this.experienceId);
  }

}
