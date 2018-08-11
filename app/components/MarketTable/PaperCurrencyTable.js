import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { setCoins } from '../../containers/App/actions';
import { Button, Row, Col, Select, Table } from 'antd';
import axios from 'axios'
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

export class PaperCurrencyTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0,
      numberOfTopCoins: 100,
      pagination: {},
      loading: false,
      filteredInfo: null,
      sortedInfo: null,
    }
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const tableData = []
    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=5f571e4044e2bbfb5b6289df86dbb16d`);
    const exchangeRate = response.data.rates
    await Promise.all(Object.keys(exchangeRate).map(async key => {
      return tableData.push({name: key, rate: exchangeRate[key]});
    }))
    this.setState({ loading: false, tableData})
  }

  componentShouldUpdate() {

  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
      pagination: pager,
    });
    // this.fetch({
    //   results: pagination.pageSize,
    //   page: pagination.current,
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   ...filters,
    // });
  }
  // setCoins = (value) => {
  //   if(value === "0") {
  //     this.setState((prevState, props) => {
  //       return {numberOfTopCoins: 0}
  //     });
  //     this.fetch()
  //   }
  //   else {
  //     this.setState((prevState, props) => {
  //       this.props.setCoins(prevState.defaultData.slice(0, Number(value)))
  //       return { data: prevState.defaultData.slice(0, Number(value)) }
  //     });
  //   }
  // }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo =
      filteredInfo ||
      {
        rank: null,
        name: null,
        price_usd: null,
        percent_change_24h: null,
        market_cap_usd: null,
      };
    filteredInfo['24h_volume_usd: null'] = null
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [{ text: '', value: '' }, { text: '', value: '' }],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name[0] - b.name[0],
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Exhange Rate',
        dataIndex: 'rate',
        key: 'rate',
        render: (text, record, index) => (
          `$${text}`
        ),
        filters: [{ text: '', value: '' }, { text: '', value: '' }],
        filteredValue: filteredInfo.rate || null,
        onFilter: (value, record) => record.rate.includes(value),
        sorter: (a, b) => a.rate - b.rate,
        sortOrder: sortedInfo.columnKey === 'rate' && sortedInfo.order,
      },
    ];

    return (
      <Row type="flex" justify="center">
        <Col style={{display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}} xs={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }}>
          <h1>Paper Currency Exchange Rate</h1>
          <Table columns={columns}
            rowKey={record => record.registered}
            dataSource={this.state.tableData}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </Col>
      </Row>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    setCoins: (value) => dispatch(setCoins(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperCurrencyTable)
