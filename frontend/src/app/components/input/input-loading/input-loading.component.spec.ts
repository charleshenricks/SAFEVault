import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLoadingComponent } from './input-loading.component';

describe('InputLoadingComponent', () => {
  let component: InputLoadingComponent;
  let fixture: ComponentFixture<InputLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
