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
            text: "",
            numericCount: 0,
            alphaNumericCount: 0,
            floatCount: 0,
            stopRandom: false,
            newFileGenerated: false,
            showSuccessAlert: false,
            showFailedAlert: false,
            showReportAlert: false
        };
    }

    onAlertClose = () => {
        this.setState({ showSuccessAlert: false, showFailedAlert: false, showReportAlert: false });
    }

    showAlert = (type) => {
        this.setState({ [type]: true });
        setTimeout(() => { this.setState({ [type]: false }); }, 3000);
    }

    onGenerateReportClick = (e) => {
        e.preventDefault();
        if (this.state.newFileGenerated) {
            this.props.history.push("/report");
        }
        else {
            this.showAlert("showReportAlert");
        }
    }

    stopRandomGeneration = () => {
        this.setState({ stopRandom: true });
    }

    generateRandom = (doStart) => {
        const checkedTypes = { "numeric": this.state.numeric,
            "alphaNumeric": this.state.alphaNumeric, "float": this.state.float
        };
        const fileSize = this.state.fileSize * 1000;

        var randomType = ["numeric", "alphaNumeric", "float"][Math.floor((Math.random() * 3))];
        //console.log(randomType);

        var randomSpace = Math.floor(Math.floor(Math.random() * (10 - 1 + 1) + 1) / 2)
        var frontSpace = "";
        var backSpace = "";
        if (randomSpace == 0) { randomSpace = 2 };

        for (var i = 0; i < randomSpace; i++) {
            frontSpace += " ";
            backSpace += " ";
        }
        var ischeked = this.state.numeric ? true :
            this.state.alphaNumeric ? true :
                this.state.float ? true : false;

        if ((this.state.spaceUsed < parseInt(fileSize))
            && (!this.state.stopRandom || doStart != undefined) && ischeked) {

            if (checkedTypes[randomType]) {
                var randomData = randomType == "numeric" ? Math.floor(Math.random() * (1000000 - 1 + 1) + 1).toString()+", "
                    : randomType == "alphaNumeric" ? frontSpace + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + backSpace +", "
                        : randomType == "float" ? (Math.random() * (999999.99 - 0.10 + 1) + 0.10).toFixed(2)+", " : "";

                //var randomData = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                if (doStart) {
                    this.setState({
                        alphaNumericCount: 0,
                        numericCount: 0,
                        floatCount: 0,
                    });
                }
                if ((this.state.spaceUsed + randomData.length) > parseInt(fileSize)) {
                    this.setState({
                        stopRandom: true,
                        spaceUsed: 0,
                        alphaNumericCount: doStart ? 0 : this.state.alphaNumericCount,
                        numericCount: doStart ? 0 : this.state.numericCount,
                        floatCount: doStart ? 0 : this.state.floatCount,
                        newFileGenerated: true
                    });

                    this.generateRandomDataFile(this.state.text);
                }
                else {
                    this.setState({
                        [randomType + "Count"]: doStart ? 1 : this.state[randomType + "Count"] += 1,
                        spaceUsed: this.state.spaceUsed += randomData.length,
                        text: this.state.text + randomData,
                        stopRandom: false
                    });
                }
            }
            this.forceUpdate();
            setTimeout(() => { this.generateRandom(); }, 100);
        }
        else {
            this.setState({
                spaceUsed: 0,
                stopRandom: false,
            });

            if (doStart == undefined) {
                this.setState({ newFileGenerated: true });
                this.generateRandomDataFile(this.state.text);
            }
            else {
                this.showAlert("showFailedAlert");
            }
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
            {(this.state.showFailedAlert || this.state.showSuccessAlert) &&
                <div class={this.state.showSuccessAlert ? "alert alert-dismissible alert-success" : "alert alert-dismissible alert-danger"}>
                    <button type="button" onClick={this.onAlertClose} class="close" data-dismiss="alert">X</button>
                    
                    {this.state.showSuccessAlert ?
                        <span><strong>Success!</strong> Random file generated, you can check updated report now. </span>
                        : <span><strong>Failed!</strong> Please try again. <b>Note: select at least one type and mention valid file size</b></span>}
                </div>
            }
            {this.state.showReportAlert &&
                <div class="alert alert-dismissible alert-warning">
                    <button type="button" onClick={this.onAlertClose} class="close" data-dismiss="alert">X</button>
                    <span><strong>Warning!</strong>Please generate random data first</span>
                </div>
            }
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
                    <input type="text"
                        className="form-input"
                        value={this.state.numericCount}
                        id="numericCount" />
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
                    <input type="text"
                        className="form-input"
                        value={this.state.floatCount}
                        id="floatCount" />
                </div>
            </div>
            <div className="col-md-12 generate-report-btn-area">
                <button type="button"
                    className="btn btn-primary btn-lg generate-report-btn"
                    onClick={ this.onGenerateReportClick }>
                    Generat Report
            </button>
            </div>
        </div>
    );
    }

    async generateRandomDataFile(textData) {
        textData = textData.replace(/,\s*$/, "");
        const response = await fetch('randomdata/generatefile/', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({ text: textData }),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(res => res.json())
            .then(response => {
                if (response.success) {
                    this.showAlert("showSuccessAlert")
                }
                else {
                    this.showAlert("showFailedAlert")
                }
            })
            .catch(error => { this.showAlert("showFailedAlert") });

    }
}
