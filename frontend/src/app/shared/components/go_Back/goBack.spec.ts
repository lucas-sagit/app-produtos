import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoBack } from './goBack';

describe('GoBack', () => {
  let component: GoBack;
  let fixture: ComponentFixture<GoBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoBack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
