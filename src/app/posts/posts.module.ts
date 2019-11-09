import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { UserProfileComponent } from '../profile/user-profile/user-profile.component';
import { AddeducationComponent } from '../profile/education/addeducation/addeducation.component';
import { WorkExperienceComponent } from '../profile/work-experience/work-experience/work-experience.component';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, UserProfileComponent, AddeducationComponent, WorkExperienceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {}
