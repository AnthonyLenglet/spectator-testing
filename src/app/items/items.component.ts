import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  public items: Observable<any[]> = of([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.handleQueryParams();
  }

  handleQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.pipeline === 'todo') {
        this.items = this.itemService.itemsTodo$;
      } else if (params.pipeline === 'under-review') {
        this.items = this.itemService.itemsUnderReview$;
      } else if (params.pipeline === 'reviewed') {
        this.items = this.itemService.itemsReviewed$;
      } else {
        this.router.navigate([], { queryParams: { pipeline: 'todo' } });
      }
    });
  }
}
