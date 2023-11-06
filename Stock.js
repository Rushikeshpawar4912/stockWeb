import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocksData: [
        {
          symbol: 'TSLA',
          chartData: {
            xValues: [],
            yValues: [],
          },
        },
        {
          symbol: 'AAPL',
          chartData: {
            xValues: [],
            yValues: [],
          },
        },
        {
          symbol: 'MSFT',
          chartData: {
            xValues: [],
            yValues: [],
          },
        },
        {
          symbol: 'AMZN',
          chartData: {
            xValues: [],
            yValues: [],
          },
        },
        {
          symbol: 'META',
          chartData: {
            xValues: [],
            yValues: [],
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.fetchStockData();
  }

  async fetchStockData() {
    const API_KEY = 'YOUR_API_KEY'; // Replace with your API key

    for (let i = 0; i < this.state.stocksData.length; i++) {
      const stock = this.state.stocksData[i];

      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.symbol}&outputsize=full&apikey=${API_KEY}`
        );
        const data = await response.json();

        const chartData = {
          xValues: [],
          yValues: [],
        };

        for (const key in data['Time Series (Daily)']) {
          chartData.xValues.push(key);
          chartData.yValues.push(data['Time Series (Daily)'][key]['1. open']);
        }

        this.setState((prevState) => ({
          stocksData: prevState.stocksData.map((s, index) =>
            index === i ? { ...s, chartData } : s
          ),
        }));
      } catch (error) {
        console.error(`Error fetching data for ${stock.symbol}: ${error.message}`);
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Stock Market</h1>
        {this.state.stocksData.map((stock, index) => (
          <div key={index}>
            <h2>{stock.symbol} Chart</h2>
            <Plot
              data={[
                {
                  x: stock.chartData.xValues,
                  y: stock.chartData.yValues,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: 'red' },
                },
              ]}
              layout={{ width: 720, height: 440, title: 'A Fancy Plot' }}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Stock;
