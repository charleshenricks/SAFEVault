import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFoundPageComponent } from './post-found-page.component';

describe('PostFoundPageComponent', () => {
  let component: PostFoundPageComponent;
  let fixture: ComponentFixture<PostFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostFoundPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
