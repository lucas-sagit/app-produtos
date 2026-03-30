import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenHistory } from './openHistory';

describe('OpenHistory', () => {
  let component: OpenHistory;
  let fixture: ComponentFixture<OpenHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
