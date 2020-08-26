import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import Trigger from '../Trigger'
import DatePicker from '../DatePicker'
import Upload from '../Upload'
import TimeSelect from '../TimeSelect'
import Ico from '../Ico'

export default class Input extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showDatePicker: false,
      showClear: false,
    }
  }

  static propTypes = {
    /**
     * 自定义样式
     */
    className: PropTypes.string,

    /**
     * 行内样式
     */
    style: PropTypes.object,

    /**
     * 设置输入框类型，
     * 支持text，password，file，date，email，month，year，search，textarea，time，second
     * 和其他原生 input 的 type 值
     */
    type: PropTypes.string,

    /**
     * 输入框提示信息
     */
    placeholder: PropTypes.string,

    /**
     * 输入框的值
     */
    value: PropTypes.any,

    /**
     * 输入框默认值
     */
    defaultValue: PropTypes.any,

    /**
     * 是否可清除，仅时间类型输入框有效
     */
    clearable: PropTypes.bool,

    /**
     * 是否不可选
     */
    disabled: PropTypes.bool,

    /**
     * 附加靠右的图标
     */
    children: PropTypes.element,

    /**
     * 点击回调，仅搜索类型有效
     */
    onClick: PropTypes.func,

    /**
     * 内容变更回调，参数列表：value，event（日期类型无event参数）
     */
    onChange: PropTypes.func,

    /**
     * 尺寸
     */
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),

    /**
     * 输入框前附加内容
     */
    addonBefore: PropTypes.element,

    /**
     * 输入框后附加内容
     */
    addonAfter: PropTypes.element,
  }

  static defaultProps = {
    type: 'text',
    clearable: true,
    disabled: false,
    size: 'md',
  }

  /**
   *getValue
   *
   * @returns
   * @memberof Input
   */
  getValue() {
    const { type } = this.props

    switch (type) {
      case 'file':
        return this.refMain.refs.main.files[0]
      default:
        return this.refMain ? this.refMain.value : undefined
    }
  }

  /**
   * setValue
   * @param {*} value
   * @memberof Input
   */
  setValue(value) {
    const { type } = this.props
    switch (type) {
      case 'file':
        this.refMain.refs.main.files[0] = value
        break
      default:
        this.refMain && (this.refMain.value = value)
    }
  }

  focus() {
    this.refMain.focus()
  }

  /**
   * 显示日期组件
   * @memberof Input
   */
  handleShowDatePicker = () => {
    const { disabled } = this.props
    if (!disabled) {
      this.setState({
        showDatePicker: true,
        showClear: false,
      })
    }
  }

  hideOptionsHandler = popupVisible => {
    if (!popupVisible) {
      this.setState({ showDatePicker: popupVisible })
    }
  }

  /**
   * 清空时间类型的输入框
   * @memberof Input
   */
  handleClearInput = () => {
    const { disabled, onChange } = this.props

    if (disabled) return

    this.setState({
      showDatePicker: false,
    })
    this.refMain && (this.refMain.value = '')
    onChange && onChange('')
  }

  /**
   * 选中日期项
   * @memberof Input
   */
  handleSelectDate = value => {
    this.refMain && (this.refMain.value = value)

    this.setState({
      showDatePicker: false,
      showClear: false,
    })
  }
  /**
   * 选中时间
   * @memberof Input
   */
  handleSelectTime = value => {
    this.refMain && (this.refMain.value = value)

    this.setState({
      showDatePicker: false,
      showClear: false,
    })
  }

  /**
   *显示清空按钮
   * @memberof Input
   */
  handleShowClear = () => {
    !this.props.disabled &&
      this.refMain &&
      this.refMain.value &&
      this.setState({
        showClear: true,
      })
  }

  /**
   *隐藏清空按钮
   * @memberof Input
   */
  handleHideClear = () => {
    this.setState({
      showClear: false,
    })
  }

  /**
   * 文件类型Input内容改变回调事件
   */
  handleUploadChange = event => {
    const { onChange } = this.props
    onChange && onChange(event.target.files[0], event)
  }

  handleInputChange = event => {
    const { onChange } = this.props
    onChange && onChange(event.target.value, event)
  }

  handleDateChange = value => {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  render() {
    let {
      type,
      value,
      defaultValue,
      disabled,
      placeholder,
      clearable,
      style,
      onClick,
      className,
      children,
      onChange,
      size,
      addonBefore,
      addonAfter,
      ...others
    } = this.props

    const inputValue = this.refMain && this.refMain.value

    let { showDatePicker, showClear } = this.state

    children &&
      (children = React.cloneElement(children, {
        className: classnames('input-addon', children.props.className),
      }))

    addonBefore &&
      (addonBefore = React.cloneElement(addonBefore, {
        className: classnames(
          'dada-input-addon-before',
          addonBefore.props.className
        ),
      }))

    addonAfter &&
      (addonAfter = React.cloneElement(addonAfter, {
        className: classnames(
          'dada-input-addon-after',
          addonAfter.props.className
        ),
      }))

    switch (type) {
      case 'date':
      case 'month':
      case 'year':
        return (
          <Trigger
            showAction='none'
            hideAction='none'
            popupVisible={showDatePicker}
            onPopupVisibleChange={this.hideOptionsHandler}
            stretch='auto'
            transitionName='scale'
            popup={
              <DatePicker
                className={classnames({ hidden: !showDatePicker })}
                {...others}
                type={type}
                value={inputValue}
                onChange={this.handleDateChange}
                onSelect={this.handleSelectDate}
                ref={ref => (this.datepicker = ref)}
              />
            }
          >
            <div
              className={classnames(
                'input',
                { 'dada-input-disabled': disabled },
                className
              )}
              ref='container'
              onMouseEnter={this.handleShowClear}
              onMouseLeave={this.handleHideClear}
              style={style}
            >
              <Ico
                type='calendar'
                className='dada-input-addon-before'
                onClick={this.handleShowDatePicker}
              />
              <input
                type='text'
                ref={ref => (this.refMain = ref)}
                value={value}
                defaultValue={defaultValue}
                className={classnames(
                  'form-control',
                  { [`form-control-${size}`]: size && size !== 'md' },
                  'input-field',
                  'input-field-addon'
                )}
                readOnly
                disabled={disabled}
                placeholder={placeholder}
                onClick={this.handleShowDatePicker}
              />
              <div className='dada-input-border' />
              {clearable && showClear && (
                <Ico
                  type='times-circle'
                  className='input-addon dada-input-clear'
                  onClick={this.handleClearInput}
                />
              )}
            </div>
          </Trigger>
        )
      case 'time':
      case 'second':
        return (
          <Trigger
            showAction='none'
            hideAction='none'
            popupVisible={showDatePicker}
            onPopupVisibleChange={this.hideOptionsHandler}
            stretch='auto'
            transitionName='scale'
            popup={
              <TimeSelect
                {...others}
                type={type}
                className={classnames({ hidden: !showDatePicker })}
                value={inputValue}
                onChange={this.handleDateChange}
                onSelect={this.handleSelectTime}
                ref={ref => (this.datepicker = ref)}
              />
            }
          >
            <div
              className={classnames(
                'input',
                { 'dada-input-disabled': disabled },
                className
              )}
              ref='container'
              onMouseEnter={this.handleShowClear}
              onMouseLeave={this.handleHideClear}
              style={style}
            >
              <Ico
                type='clock-o'
                className='dada-input-addon-before'
                onClick={this.handleShowDatePicker}
              />
              <input
                type='text'
                ref={ref => (this.refMain = ref)}
                value={value}
                defaultValue={defaultValue}
                className={classnames(
                  'form-control',
                  size && `form-control-${size}`,
                  'input-field',
                  'input-field-addon'
                )}
                readOnly
                disabled={disabled}
                placeholder={placeholder}
                onClick={this.handleShowDatePicker}
              />
              <div className='dada-input-border' />
              {clearable && showClear && (
                <Ico
                  type='times-circle'
                  className='input-addon dada-input-clear'
                  onClick={this.handleClearInput}
                />
              )}
            </div>
          </Trigger>
        )
      case 'search':
        return (
          <div
            className={classnames(
              'input',
              { 'dada-input-disabled': disabled },
              className
            )}
            ref='container'
            style={style}
          >
            {addonBefore}
            <Ico
              type='search'
              className='dada-input-addon-before'
              onClick={onClick}
            />
            <input
              {...others}
              type='text'
              ref={ref => (this.refMain = ref)}
              value={value}
              className={classnames(
                'form-control',
                'input-field',
                'input-field-addon'
              )}
              readOnly
              onClick={onClick}
              onChange={this.handleInputChange}
              disabled={disabled}
              placeholder={placeholder}
            />
            <div className='dada-input-border' />
            {children}
            {addonAfter}
          </div>
        )
      case 'file':
        return (
          <Upload
            {...others}
            ref={ref => (this.refMain = ref)}
            className={className}
            placeholder={placeholder}
            onChange={this.handleUploadChange}
            style={style}
          />
        )
      case 'textarea':
        return (
          <textarea
            className={classnames(
              'form-control',
              'dada-input-textarea',
              className
            )}
            ref={ref => (this.refMain = ref)}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={this.handleInputChange}
            defaultValue={defaultValue}
            style={style}
            {...others}
          />
        )
      default:
        return (
          <div
            className={classnames(
              'input',
              { 'dada-input-disabled': disabled },
              className
            )}
            ref='container'
            style={style}
          >
            {addonBefore}
            <input
              {...others}
              type={type}
              ref={ref => (this.refMain = ref)}
              value={value}
              defaultValue={defaultValue}
              className={classnames(
                'form-control',
                'input-field',
                size && `form-control-${size}`
              )}
              onChange={this.handleInputChange}
              disabled={disabled}
              placeholder={placeholder}
            />
            <div className='dada-input-border' />
            {children}
            {addonAfter}
          </div>
        )
    }
  }
}

Input.getValue = ref => {
  if (!ref) return undefined

  return ref.getValue()
}

Input.setValue = (ref, value) => {
  if (!ref) return

  ref.setValue(value)
}
