import React, { Component } from 'react'
import {
  Nav,
  NavItem,
  Card,
  // Form,
  // FormGroup,
  // Input,
  // Button,
  // Row,
  // Col,
} from 'react-impression'
import CityEdit from './components/CityEdit'
import OrderEdit from './components/OrderEdit'
import './container.module.scss'

class FormInfo extends Component {
  state = {
    type: 1,
  }

  changeType = val => this.setState({ type: val })

  render() {
    const { type } = this.state
    return (
      <div styleName='container'>
        <Card>
          <Nav activeKey={type} onSelect={this.changeType}>
            <NavItem eventKey={1}>城市规则</NavItem>
            <NavItem eventKey={2}>派单规则</NavItem>
          </Nav>
          {type === 1 ? <CityEdit /> : <OrderEdit />}
        </Card>
      </div>
    )
  }
}

export default FormInfo
