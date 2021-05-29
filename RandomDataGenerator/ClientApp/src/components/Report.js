import React, { Component } from 'react';

export class Report extends Component {
  static displayName = Report.name;

  constructor(props) {
      super(props);
      this.state = {
          percentages: {},
          topItems: []
      };
  }

    componentDidMount() {
        this.getFileData();
    }

  render() {
    return (
      <div>
            <h3>Generated File Report</h3>
            You can always check your lastly generated report here.
            <br/><br/>

            <table class="table">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">% Numeric</th>
                        <th scope="col">% Alphanumeric</th>
                        <th scope="col">% Float</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.state.percentages.numericPercentage != undefined ?
                            "% " + this.state.percentages.numericPercentage : ""}</td>
                        <td>{this.state.percentages.alphanumericPercentage != undefined ?
                            "% " + this.state.percentages.alphanumericPercentage : ""}</td>
                        <td>{this.state.percentages.floatPercentage != undefined ?
                            "% " + this.state.percentages.floatPercentage : ""}</td>
                    </tr>
                </tbody>
            </table>
            <div>
            {this.state.topItems.length > 0 &&
                 <h3 className="top-item-heading">Top 20 Items</h3>
            }
            {this.state.topItems.map(item =>
                <h6>{item.text}</h6>
                )}
            </div>
      </div>
    );
    }

    async getFileData() {
        const response = await fetch('randomdata/GetRandomData');
        const data = await response.json();
        console.log(data);
        this.setState({ percentages: data.percentages, topItems: data.topItems });
    }
}
