import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemsTodoSource = new BehaviorSubject<any[]>([]);
  readonly itemsTodo$ = this.itemsTodoSource.asObservable();
  private itemsUnderReviewSource = new BehaviorSubject<any[]>([]);
  readonly itemsUnderReview$ = this.itemsUnderReviewSource.asObservable();
  private itemsReviewedSource = new BehaviorSubject<any[]>([]);
  readonly itemsReviewed$ = this.itemsReviewedSource.asObservable();
}
