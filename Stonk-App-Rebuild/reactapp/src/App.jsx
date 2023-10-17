import { Component } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import './App.css';

const options = [
    { value: 'Past Year', label: 'Past Year' },
    { value: 'Past Month', label: 'Past Month' },
    { value: 'Past Day', label: 'Past Day' },
];

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = { MarketData: [], Submitting: true, value: '', symbol: '', interval: { value: 'Past Year', label: 'Past Year' }, percentageChange: '', totalChange: '', change: 'green' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        //alert('A name was Submitting: ' + this.state.value);
        this.setState({ symbol: this.state.value });
        this.populateMarketData();

        event.preventDefault();
    }

    handleSelect = async (selectedOption) => {
        await this.setState({ interval: selectedOption });
        console.log(this.state.value);

        if (this.state.symbol != '') {
            console.log(this.state.value);
            this.populateMarketData();
        }
    }

    transformData(data, interval) {
        let plot_data = [];
        let date = [];
        let dateString = [];
        let openPrice = [];
        let highPrice = [];
        let lowPrice = [];
        let closePrice = [];
        let volume = [];

        var dataPoints;

        if (interval == 'Past Year') {
            dataPoints = 52;
        }
        else if (interval == 'Past Month') {
            dataPoints = 22;
        }
        else if (interval == 'Past Day') {
            dataPoints = 64;
        }

        data.map((each) => (

            date.push(each.date),
            dateString.push(each.dateString),
            openPrice.push(each.openPrice),
            highPrice.push(each.highPrice),
            lowPrice.push(each.lowPrice),
            closePrice.push(each.closePrice),
            volume.push(each.volume)

        ))

        date = date.slice(0, dataPoints);
        dateString = dateString.slice(0, dataPoints);
        openPrice = openPrice.slice(0, dataPoints);
        highPrice = highPrice.slice(0, dataPoints);
        lowPrice = lowPrice.slice(0, dataPoints);
        closePrice = closePrice.slice(0, dataPoints);
        volume = volume.slice(0, dataPoints);

        plot_data['date'] = date;
        plot_data['dateString'] = dateString;
        plot_data['openPrice'] = openPrice;
        plot_data['highPrice'] = highPrice;
        plot_data['lowPrice'] = lowPrice;
        plot_data['closePrice'] = closePrice;
        plot_data['volume'] = volume;

        return plot_data;
    }

    calculateChange = (prices) => {

        var total;
        var percentage;

        if (prices[prices.length - 1] >= prices[0]) {
            total = Number((prices[prices.length - 1] - prices[0]).toFixed(2));
            percentage = Number((((prices[prices.length - 1] / prices[0]) - 1) - 1).toFixed(2));
            this.setState({ change: 'red', totalChange: '$' + total, percentageChange: '-' + percentage + '%' });
        }
        else {
            total = Number((prices[0] - prices[prices.length - 1]).toFixed(2));
            percentage = Number(((prices[0] / prices[prices.length - 1]) - 1).toFixed(2));
            this.setState({ change: 'green', totalChange: '+ $' + total, percentageChange: '+' + percentage + '%' });
        }
        console.log(this.state.change, prices[0], prices[prices.length - 1], this.state.percentageChange, this.state.totalChange);
    }

    renderMarketDataTable(MarketData, symbol, interval) {

        return (
            <div className="marketData">

                <Plot
                    data={[
                        {
                            type: 'scatter',
                            mode: 'lines',
                            x: this.transformData(MarketData, interval)['date'],
                            y: this.transformData(MarketData, interval)['closePrice'],
                            marker: { color: this.state.change }
                        }
                    ]}
                    layout={{
                        width: 500,
                        height: 350,
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        xaxis: {
                            showgrid: false,
                            showline: true
                        },
                        yaxis: {
                            showgrid: true,
                            showline: true
                        },
                        font: {
                            family: 'Arial',
                            size: 14,
                            color: 'black'
                        },
                        margin: {
                            t: 20,
                            l: 50,
                            r: 40,
                            b: 50
                        }
                    }
                    }
                />

                <div className="stockData">
                    <div className="symbol"> {symbol}</div>
                    <div className="data">
                        ${this.transformData(MarketData)['closePrice'][0]}
                    </div>
                    <div className={this.state.change} >
                        {this.state.percentageChange} ({this.state.totalChange})
                    </div>
                </div>

            </div>
        );
    }

    render() {
        let contents = this.state.Submitting
            ? <p><em>please enter a symbol</em></p>
            : this.renderMarketDataTable(this.state.MarketData, this.state.symbol, this.state.interval.value);

        return (
            <div>
                <div className="header">
                    <h2> MARKET DATA </h2>

                    <div>
                        <buffer></buffer>
                    </div>

                    <form onSubmit={this.handleSubmit} >
                        <label>
                            <input className="form" type="text" placeholder="Enter a Symbol" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <input className="form" type="submit" value="Enter" />
                    </form>

                    <div>
                        <buffer></buffer>
                    </div>

                    <Select options={options} onChange={this.handleSelect} placeholder="Select an option" defaultValue={{ label: "Past Year", value: "Past Year" }} />

                </div>

                {contents}

            </div>
        );
    }

    async populateMarketData() {
        console.log("fetching data for ", this.state.value, " for the ", this.state.interval.value);
        var URL = "https://localhost:7006/MarketData?symbol=" + this.state.value + "&interval=" + this.state.interval.value;
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);

        this.calculateChange(this.transformData(data, this.state.interval.value)['closePrice']);

        this.setState({ MarketData: data, Submitting: false });
    }
}
