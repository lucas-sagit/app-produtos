import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNotification } from './open-notification';

describe('OpenNotification', () => {
  let component: OpenNotification;
  let fixture: ComponentFixture<OpenNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
