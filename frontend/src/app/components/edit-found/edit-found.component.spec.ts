import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoundComponent } from './edit-found.component';

describe('EditFoundComponent', () => {
  let component: EditFoundComponent;
  let fixture: ComponentFixture<EditFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
