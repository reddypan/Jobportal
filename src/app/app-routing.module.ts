import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";
import { UserProfileComponent } from "./profile/user-profile/user-profile.component";
import { WorkExperienceComponent } from "./profile/work-experience/work-experience/work-experience.component";
import { AddeducationComponent } from "./profile/education/addeducation/addeducation.component";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "profile", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: "addworkexperience", component: WorkExperienceComponent, canActivate: [AuthGuard] },
  { path: "addeducation", component: AddeducationComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
