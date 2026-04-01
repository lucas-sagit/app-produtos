import { Directive, Input, OnInit, OnChanges, SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Directive({
  selector: 'canvas[baseChart]',
  standalone: true
})
export class BaseChartDirective implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any = {};
  @Input() options: any = {};
  @Input() chartType: 'pie' | 'doughnut' | 'bar' | 'line' = 'pie';

  private chart: Chart | null = null;
  private isInitialized = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Dados já disponíveis no init
    if (this.data && this.data.labels && this.data.labels.length > 0) {
      this.renderChart();
      this.isInitialized = true;
    }
  }

  ngAfterViewInit(): void {
    // Se não foi inicializado no ngOnInit, tenta aqui
    if (!this.isInitialized && this.data && this.data.labels) {
      this.renderChart();
      this.isInitialized = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isInitialized) {
      return;
    }
    
    if (changes['data'] || changes['options']) {
      this.updateChart();
    }
  }

  private renderChart(): void {
    const ctx = this.el.nativeElement.getContext('2d');
    
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: this.data,
      options: this.options
    });
  }

  private updateChart(): void {
    if (this.chart && this.data) {
      this.chart.data = this.data;
      this.chart.options = this.options;
      this.chart.update('none'); // Atualização suave sem animação
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
