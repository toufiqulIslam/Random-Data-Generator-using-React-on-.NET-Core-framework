import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            numeric: false,
            alphaNumeric: false,
            float: false,
            fileSize: "",
            spaceUsed: 0,
            alphaNumericCount: 0,
            stopRandom: false
        };
    }

    stopRandomGeneration = () => {
        this.setState({ stopRandom: true });
    }

    generateRandom = (doStart) => {
        
        console.log("here", parseInt(this.state.fileSize), this.state.spaceUsed, this.state.stopRandom);

        if ((this.state.spaceUsed < parseInt(this.state.fileSize))
            && (!this.state.stopRandom || doStart != undefined)) {

            var randomData = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            if ((this.state.spaceUsed + randomData.length) > parseInt(this.state.fileSize)) {
                this.setState({
                    stopRandom: true,
                    spaceUsed: 0,
                    alphaNumericCount: doStart ? 0 : this.state.alphaNumericCount
                });
            }
            else {
                this.setState({
                    alphaNumericCount: doStart ? 1 : this.state.alphaNumericCount += 1,
                    spaceUsed: this.state.spaceUsed += randomData.length,
                    stopRandom: false
                });
                this.forceUpdate();
                setTimeout(() => { this.generateRandom(); }, 100);
            }
        }
        else {
            this.setState({
                spaceUsed: 0,
                stopRandom: false
            });
        }
    }

    handleChange = (e) => {
        if (e.target.type == "checkbox") {
            this.setState({
                [e.target.id]: e.target.checked,
            });
        }
        else {
            this.setState({
                [e.target.id]: e.target.value,
            });
        }
    }

  render () {
    return (
        <div>
            <div className="col-md-12 interaction-block">
                <form className="col-md-7">
                    <div className="form-check area-data-type-check">
                        <input type="checkbox"
                            className="form-check-input"
                            checked={this.state.numeric}
                            onChange={(e) => this.handleChange(e)}
                            id="numeric" />
                        <label className="form-check-label" htmlFor="numeric">Numeric</label>
                    </div>
                    <div className="form-check area-data-type-check">
                        <input type="checkbox"
                            className="form-check-input"
                            checked={this.state.alphaNumeric}
                            onChange={(e) => this.handleChange(e)}
                            id="alphaNumeric" />
                        <label className="form-check-label" htmlFor="alphaNumeric">AlphaNumeric</label>
                    </div>
                    <div className="form-check area-data-type-check">
                        <input type="checkbox"
                            className="form-check-input"
                            checked={this.state.float}
                            onChange={(e) => this.handleChange(e)}
                            id="float" />
                        <label className="form-check-label" htmlFor="float">Float</label>
                    </div>

                </form>
                <form className="col-md-5">
                    <div className="form-check area-data-type-check file-size-area">
                        <label className="form-check-label file-size-label" htmlFor="fileSize">Size of the file (KB)</label>
                        <input type="number"
                            className="form-input"
                            value={this.state.fileSize}
                            onChange={(e) => this.handleChange(e)}
                            id="fileSize" />
                    </div>
                </form>
            </div>

            <button type="button"
                className="btn btn-primary btn-lg"
                onClick={() => { this.generateRandom(true) }}>
                Start
            </button>
            <button type="button"
                className="btn btn-primary btn-lg"
                onClick={() => this.stopRandomGeneration()}>
                Stop
        </button>
            <div className="col-md-12 counter-show-area">
                <div className="col-md-12">
                    <label className="col-md-3" htmlFor="numericCount">Counter 1 (Numeric)</label>
                    <input type="text" className="form-input" id="numericCount" />
                </div>
                <div className="col-md-12">
                    <label className="col-md-3" htmlFor="alphaNumericCount">Counter 2 (Alphanumeric)</label>
                    <input type="text"
                        className="form-input"
                        value={this.state.alphaNumericCount}
                        id="alphaNumericCount" />
                </div>
                <div className="col-md-12">
                    <label className="col-md-3" htmlFor="floatCount">Counter 3 (Float)</label>
                    <input type="text" className="form-input" id="floatCount" />
                </div>
            </div>
            <div className="col-md-12 generate-report-btn-area">
                <button type="button"
                    className="btn btn-primary btn-lg generate-report-btn">
                    Generat Report
            </button>
            </div>
        </div>
    );
  }
}
