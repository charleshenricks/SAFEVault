import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLostPageComponent } from './post-lost-page.component';

describe('PostLostPageComponent', () => {
  let component: PostLostPageComponent;
  let fixture: ComponentFixture<PostLostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostLostPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostLostPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
