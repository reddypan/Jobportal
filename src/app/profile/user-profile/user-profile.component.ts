import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MatSidenavContainer, MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements AfterViewInit {

  options: FormGroup;
  opened: boolean = true;

  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;

  workexperiences = ['123', '1312'];

  constructor(fb: FormBuilder) {
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

  animal: string;
  name: string;




}
