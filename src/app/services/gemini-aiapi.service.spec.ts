import { TestBed } from '@angular/core/testing';

import { GeminiAIAPIService } from './gemini-aiapi.service';

describe('GeminiAIAPIService', () => {
  let service: GeminiAIAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiAIAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
