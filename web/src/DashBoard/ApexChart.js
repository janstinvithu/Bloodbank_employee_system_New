import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seriesDonors: [500, 300, 200, 400],
      optionsDonors: {
        chart: {
          type: 'donut',
          width: 200,
          height: 200,
          sparkline: {
            enabled: true
          }
        },
        labels: ['O+', 'A+', 'B+', 'AB+'],
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 0
        },
        plotOptions: {
          pie: {
            donut: {
              size: '60%',
            }
          }
        },
        tooltip: {
          fixed: {
            enabled: false
          },
          fillSeriesColor: false
        }
      },

      seriesBloodStock: [{
        name: 'Stock',
        data: [800, 600, 700, 550, 900, 350]
      }],
      optionsBloodStock: {
        chart: {
          type: 'bar',
          width: 200,
          height: 200,
          sparkline: {
            enabled: true
          }
        },
        colors: ['#727cf5'],
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2,
          curve: 'smooth'
        },
        xaxis: {
          categories: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'],
          labels: {
            show: false
          }
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            }
          }
        }
      },

      seriesEmployeesGrowth: [{
        name: 'Employees',
        data: [10, 20, 30, 40, 50, 60, 70]
      }],
      optionsEmployeesGrowth: {
        chart: {
          type: 'line',
          width: 200,
          height: 200,
          sparkline: {
            enabled: true
          }
        },
        colors: ['#20c997'],
        stroke: {
          curve: 'smooth'
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            }
          }
        }
      },

      seriesOrganizationGrowth: [65],
      optionsOrganizationGrowth: {
        chart: {
          type: 'radialBar',
          width: 200,
          height: 200,
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%',
            },
            track: {
              background: '#eee',
              strokeWidth: '80%',
            },
            dataLabels: {
              showOn: 'always',
              name: {
                offsetY: -5,
                show: false,
              },
              value: {
                formatter: function (val) {
                  return val + '%';
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
          },
        },
        labels: ['Progress']
      }
    };
  }

  render() {
    return (
      <div>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ backgroundColor: '#FFD700' }}>
              <h4>Total Employees</h4>
              <p>Sample Value: 1000</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ backgroundColor: '#20B2AA' }}>
              <h4>New Employees</h4>
              <p>Sample Value: 200</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ backgroundColor: '#87CEFA' }}>
              <h4>Employee Rating & Reviews</h4>
              <p>Sample Value: 4.5/5</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ width: 500, height: 470 }}>
              <h4>Donor Blood Types</h4>
              <ReactApexChart options={this.state.optionsDonors} series={this.state.seriesDonors} type="donut" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ width: 550, height: 470 }}>
              <h4>Blood Stock Levels</h4>
              <ReactApexChart options={this.state.optionsBloodStock} series={this.state.seriesBloodStock} type="bar" />
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ width: 500, height: 450 }}>
              <h4>Employees Growth</h4>
              <ReactApexChart options={this.state.optionsEmployeesGrowth} series={this.state.seriesEmployeesGrowth} type="line" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="chart-container shadow-sm p-3 bg-white rounded" style={{ width: 550, height: 450 }}>
              <h4>Organization Growth</h4>
              <ReactApexChart options={this.state.optionsOrganizationGrowth} series={this.state.seriesOrganizationGrowth} type="radialBar" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApexChart;
