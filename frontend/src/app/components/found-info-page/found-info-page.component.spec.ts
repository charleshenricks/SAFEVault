import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundInfoPageComponent } from './found-info-page.component';

describe('FoundInfoPageComponent', () => {
  let component: FoundInfoPageComponent;
  let fixture: ComponentFixture<FoundInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoundInfoPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
