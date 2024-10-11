export interface ChartData {
    data: any; // 실제 데이터 형식에 맞게 수정
    xAxis: string;
    yAxes: string[];
    chartType: string;
    yAxisSettings: any; // Y축 설정에 맞는 타입으로 수정
    pieSettings?: any; // 파이 차트 설정이 있을 경우
  }
  
  export interface Dashboard {
    id: string;
    name: string;
    charts: ChartData[];
  }
  