import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostInfoPageComponent } from './lost-info-page.component';

describe('LostInfoPageComponent', () => {
  let component: LostInfoPageComponent;
  let fixture: ComponentFixture<LostInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LostInfoPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
