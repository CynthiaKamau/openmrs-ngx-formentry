import { Component, OnChanges, Input } from '@angular/core';

import { LeafNode } from '../../form-entry/form-factory/form-node';

@Component({
  selector: 'ofe-hts-risk-category-overview',
  templateUrl: './hts-risk-category.component.html',
  styleUrls: ['./hts-risk-category.component.css']
})
export class HTSRiskOverviewComponent implements OnChanges {
  @Input() node: LeafNode;
  showHTSCategory = false;
  loadingHTSCategory = false;
  errorLoadingHTSCategory = false;
  htsCategoryLoaded = false;
  htsCategory: any;
  constructor() {}

  ngOnChanges() {
    this.node.control.valueChanges.subscribe((params) => {
      this.resetProperties();
      const node = this.node;
      if (
        node.question.extras.questionOptions.concept &&
        (node.question.extras.questionOptions.concept ===
          'c796c49d-2e33-40c4-aadd-c5508e733c30' ||
          node.question.extras.questionOptions.concept ===
            'c796c49d-2e33-40c4-aadd-c5508e733c30')
      ) {
        if (!this.showHTSCategory) {
          this.loadingHTSCategory = true;
          this.showHTSCategory = true;
          let dataSource;
          console.log("hts risk category results")
          if (node.form && node.form.dataSourcesContainer.dataSources) {
            dataSource =
              node.form.dataSourcesContainer.dataSources
                .HTSMachineLearningResourceService;
          }
          if(dataSource) {
            dataSource
            .getHTSRiskScore(params)
            .subscribe(
              ({ results }) => {
                  this.htsCategoryLoaded = true;
                  this.loadingHTSCategory = false;
                  this.htsCategory = results.predictions["probability(1)"]
                  console.log("hts risk category results", results)
              },
              (error) => {
                this.loadingHTSCategory = false;
                this.errorLoadingHTSCategory = true;
                this.showHTSCategory = false;
                console.error("error fetching hts category", error)
              }
            )
          } else {
            this.showHTSCategory = false;
            this.errorLoadingHTSCategory = true;
          } 
      }

    }
  })
}

  resetProperties() {
    this.loadingHTSCategory = false;
    this.htsCategoryLoaded = false;
    this.errorLoadingHTSCategory = false;
    this.showHTSCategory = false;
    this.htsCategory = [];
  }
}