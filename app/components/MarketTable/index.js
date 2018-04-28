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

export class MarketTable extends React.Component {
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
  componentDidMount() {
    this.fetch();
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
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }
  fetch = (params = {}) => {
    this.setState({ loading: true });
    // Optionally the request above could also be done as
    // console.log("fetch, limit", this.state.numberOfTopCoins, )
    axios.get('https://api.coinmarketcap.com/v1/ticker/', {
        params: {
          convert: 'EUR',
          start: 0,
          limit: this.state.numberOfTopCoins,
        }
      })
      .then((response) => {

          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          // pagination.total = 200;
          this.props.setCoins(response.data)
          this.setState({
            loading: false,
            defaultData: response.data,
            data: response.data,
            pagination,
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    // reqwest({
    //   url: 'https://randomuser.me/api',
    //   method: 'get',
    //   data: {
    //     results: 10,
    //     ...params,
    //   },
    //   type: 'json',
    // }).then((data) => {
    //   const pagination = { ...this.state.pagination };
    //   // Read total count from server
    //   // pagination.total = data.totalCount;
    //   pagination.total = 200;
    //   this.setState({
    //     loading: false,
    //     data: data.results,
    //     pagination,
    //   });
    // });
  }
  setCoins = (value) => {
    if(value === "0") {
      this.setState((prevState, props) => {
        return {numberOfTopCoins: 0}
      });
      this.fetch()
    }
    else {
      this.setState((prevState, props) => {
        this.props.setCoins(prevState.defaultData.slice(0, Number(value)))
        return { data: prevState.defaultData.slice(0, Number(value)) }
      });
    }
  }

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
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        render: (text, record, index) => (
          `${text}`
        ),
        filters: [{ text: '', value: '' }, { text: '', value: '' }],
        filteredValue: filteredInfo.rank || null,
        onFilter: (value, record) => record.rank.includes(value),
        sorter: (a, b) => a.rank - b.rank,
        sortOrder: sortedInfo.columnKey === 'rank' && sortedInfo.order,
      },
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
        title: 'Price',
        dataIndex: 'price_usd',
        key: 'price_usd',
        render: (text, record, index) => (
          `$${text}`
        ),
        filters: [{ text: '', value: '' }, { text: '', value: '' }],
        filteredValue: filteredInfo.price_usd || null,
        onFilter: (value, record) => record.price_usd.includes(value),
        sorter: (a, b) => a.price_usd - b.price_usd,
        sortOrder: sortedInfo.columnKey === 'price_usd' && sortedInfo.order,
      },
      {
        title: 'Price Change (24h)',
        dataIndex: 'percent_change_24h',
        key: 'percent_change_24h',
        render: (text, record, index) => (
          `${text*100}%`
        ),
        filters: [{ text: '', value: '' }, { text: '', value: '' }],
        filteredValue: filteredInfo.percent_change_24h || null,
        onFilter: (value, record) => record.percent_change_24h.includes(value),
        sorter: (a, b) => a.percent_change_24h.length - b.percent_change_24h.length,
        sortOrder: sortedInfo.columnKey === 'percent_change_24h' && sortedInfo.order,
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap_usd',
        key: 'market_cap_usd',
        render: (text, record, index) => (
          `$${text}`
        ),
        filters: [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }],
        filteredValue: filteredInfo.market_cap_usd || null,
        onFilter: (value, record) => record.market_cap_usd.includes(value),
        sorter: (a, b) => a.market_cap_usd - b.market_cap_usd,
        sortOrder: sortedInfo.columnKey === 'market_cap_usd' && sortedInfo.order,
      },
      {
        title: 'Volume (24h)',
        dataIndex: '24h_volume_usd',
        key: '24h_volume_usd',
        render: (text, record, index) => (
          `$${text}`
        ),
        filters: [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }],
        filteredValue: filteredInfo['24h_volume_usd'] || null,
        onFilter: (value, record) => record['24h_volume_usd'].includes(value),
        sorter: (a, b) => a['24h_volume_usd'] - b['24h_volume_usd'],
        sortOrder: sortedInfo.columnKey === '24h_volume_usd' && sortedInfo.order,
      },
    ];

    return (
      <Row type="flex" justify="center">
        <Col style={{display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}} xs={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }}>
          <h1>Market Table</h1>
          <div className="table-operations">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Top Currencies"
              optionFilterProp="children"
              onChange={this.setCoins}
              onFocus={handleFocus}
              onBlur={handleBlur}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="10">Top 10</Option>
              <Option value="50">Top 50</Option>
              <Option value="100">Top 100</Option>
              <Option value="0">All</Option>
            </Select>
          </div>
          <Table columns={columns}
            rowKey={record => record.registered}
            dataSource={this.state.data}
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

export default connect(mapStateToProps, mapDispatchToProps)(MarketTable)
