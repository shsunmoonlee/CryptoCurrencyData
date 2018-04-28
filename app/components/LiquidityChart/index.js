import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { finalSubmitForm} from '../../containers/App/actions';
import { Button, Row, Col, Select, Table } from 'antd';
import axios from 'axios'
import {XYPlot, XAxis, YAxis, Hint, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';

const Option = Select.Option;

function handleChange(value) {
  // console.log(`selected ${value}`);
}

function handleBlur() {
  // console.log('blur');
}

function handleFocus() {
  // console.log('focus');
}

import './index.css'

export class LiquidityChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
      chartData: []
    }
    this._rememberValue = this._rememberValue.bind(this);
    this._forgetValue = this._forgetValue.bind(this);
  }
  componentDidMount() {
    const chartData = this.props.coinData.reduce((accumulator, currentValue, currentIndex, array) => {
        accumulator.push({
          ...currentValue,
          x: currentValue.market_cap_usd,
          y: currentValue['24h_volume_usd'],
          size: Math.abs(currentValue.percent_change_24h)
        });
        return accumulator
    }, []);
    this.setState({chartData})
  }

  componentShouldUpdate() {

  }
  _rememberValue(value) {
    this.setState({value});
  }

  _forgetValue() {
    this.setState({
      value: null
    });
  }
  render() {
    const {value} = this.state;

    // const myData = [
    //   {x: 1, y: 10, size: 30},
    //   {x: 1.7, y: 12, size: 10},
    //   {x: 2, y: 5, size: 1},
    //   {x: 3, y: 15, size: 12},
    //   {x: 2.5, y: 7, size: 4}
    // ]
    return (
      <Row type="flex" justify="center">
        <Col style={{display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}} xs={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }}>
          <h1>Liquidity Chart</h1>
          <XYPlot
            width={700}
            height={700}
            xDomain={[159542679994, 177836750]}
            yDomain={[8010030000, 6402200]}
            >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Market Cap (x10^6)" tickFormat={v => `$${v/Math.pow(10,6)}`} tickLabelAngle={-45}/>
            <YAxis title="Volume (x10^6)" tickFormat={v => `$${v/Math.pow(10,6)}`} tickLabelAngle={-45}/>
            <MarkSeries
              onValueMouseOver={this._rememberValue}
              onValueMouseOut={this._forgetValue}
              strokeWidth={2}
              opacity="0.8"
              sizeRange={[5, 15]}
              data={this.state.chartData}/>
            {value ?
              <Hint
                value={{
                  name: value.name,
                  marketCap: `$${value.market_cap_usd}`,
                  volume: `$${value.y}`,
                  priceChange: `${value.percent_change_24h*100}%`,
                  x: value.x,
                  y: value.y,
                  size: value.size,
                }}
                style={{
                  fontSize: 14,
                  text: {
                    display: 'none'
                  },
                  value: {
                    color: 'red'
                  }
              }}/> :
              null
            }
          </XYPlot>
        </Col>
      </Row>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    coinData: state.global.coinData
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiquidityChart)
