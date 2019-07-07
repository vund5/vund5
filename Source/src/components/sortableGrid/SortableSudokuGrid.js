/*
 * A smart sortable sudoku grid for react-native apps
 * https://github.com/react-native-component/react-native-smart-sortable-sudoku-grid/
 * Released under the MIT license
 * Copyright (c) 2016 react-native-component <moonsunfall@aliyun.com>
 */

import React, {
    Component,
  } from 'react'
  import PropTypes from 'prop-types'
  import {
    View,
    StyleSheet,
    PanResponder,
    Dimensions,
    Animated,
    Alert
  } from 'react-native'
  
  import SortableCell from './SortableCell'
  import Utils from './Utils'
  import {
    cellScale,
    cellAnimationTypes,
    cellChangeTypes,
    touchStart,
    containerLayout,
    containerHeight,
  } from './constants'
  import TimerEnhance from 'react-native-smart-timer-enhance'
  
  const { width: deviceWidth } = Dimensions.get('window');
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
    },
  })
  
  class SortableSudokuGrid extends Component {
  
    static defaultProps = {
      sortable: false,
    }
  
    static propTypes = {
      containerStyle: PropTypes.object,
      rowWidth: PropTypes.number,
      rowHeight: PropTypes.number,
      columnCount: PropTypes.number.isRequired,
      dataSource: PropTypes.array.isRequired,
      renderCell: PropTypes.func.isRequired,
      sortable: PropTypes.bool,
      onResort: PropTypes.func,
    }
  
    createHeight(props) {
  
      let { columnCount, dataSource, rowWidth, rowHeight, sortable, onEndDrag} = props
  
      this._rowWidth = rowWidth || deviceWidth
      this._columnWidth = this._rowWidth / columnCount
      this._rowHeight = rowHeight || this._columnWidth
  
      let containerHeight = dataSource.length > 0 ? (Math.floor((dataSource.length - 1) / columnCount) + 1) * this._rowHeight : this._rowHeight
  
      return new Animated.Value(containerHeight);
    }
    constructor(props) {
      super(props)
  
      let { columnCount, dataSource, rowWidth, rowHeight, sortable, onEndDrag} = props
      this.state = {
        dataSource,
        sortable,
        containerHeight: this.createHeight(props),
      }
  
      this._pageLeft = 0
      this._pageTop = 0
      this._width = 0
      this._height = 0
  
      this._container = null
      this._responderTimer = null
      this._animationInstace = null
      this._currentStartCell = null
      this._currentDraggingComponent = null
      this._isRemoving = false
      this._isAdding = false
  
      this._touchDown = false
      this._touchEnding = false
  
      this._cells = []
    }
  
    componentWillMount() {
  
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
          //for android, fix the weird conflict between PanRespander and ScrollView
          return this.state.sortable
        },
        onMoveShouldSetPanResponder: (e, { dx, dy }) => {
          //for ios/android, fix the conflict between PanRespander and TouchableView
          return this.state.sortable && dx !== 0 && dy !== 0
        },
        onPanResponderGrant: this._onTouchStart,
        onPanResponderMove: this._onTouchMove,
        onPanResponderRelease: this._onTouchEnd,
        onPanResponderTerminationRequest: () => false,
      })
  
    }
  
    render() {
      return (
        <Animated.View
          style={[this.props.containerStyle, { width: this._rowWidth, height: this.state.containerHeight, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', }]}>
          <View
            style={[styles.container,]}
            ref={component => this._container = component}
            {...this._panResponder.panHandlers}
            onLayout={this._onLayout}>
            {this._renderSortableCells()}
          </View>
        </Animated.View>
      )
    }
  
    componentWillReceiveProps(nextProps) {
      let { sortable, dataSource, } = nextProps
      let { sortable: lastSortable, dataSource: lastDataSource, } = this.props
      let newState
      if (sortable !== lastSortable) {
        !newState && (newState = {})
        newState.sortable = sortable
      }
      if (dataSource !== lastDataSource) {
        !newState && (newState = {})
        newState.dataSource = dataSource
      }
      newState && (newState.containerHeight = this.createHeight(nextProps)),
        newState && this.setState(newState)
    }
  
    componentWillUnmount() {
      if (this._animationInstace) {
        this._animationInstace.stop()
        this._animationInstace = null
      }
    }
  
    _renderSortableCells() {
  
      let { columnCount, } = this.props
      let { dataSource, } = this.state
  
      return dataSource.map((data, index, dataList) => {
        let coordinate = {
          x: index % columnCount * this._columnWidth,
          y: Math.floor(index / columnCount) * this._rowHeight,
        }
  
        return (
          <SortableCell
            ref={(component) => {
              //has to remove old unecessary cell here
              if (index == dataList.length - 1 && this._cells.length > dataList.length) {
                this._cells.splice(index + 1, this._cells.length - dataList.length)
              }
              return this._cells[index] = { 
                key: data.title, 
                index, 
                coordinate, 
                component, 
                time: data.time,
                locationID: data.locationID}
            }}
            {...this.props}
            key={data.id}
            rowHeight={this._rowHeight}
            columnWidth={this._columnWidth}
            coordinate={coordinate}
            data={data}
            index={index}
            dataList={dataList}
            sortable={this.state.sortable} />
        )
      })
    }
  
    _onLayout = (e) => {
      let { delay, } = containerLayout
      this.setTimeout(() => {
        this._container.measure((ox, oy, width, height, px, py) => {
          this._pageTop = py
          this._pageLeft = px   //sometimes return incorrect value, when using navigator
          this._width = width
          this._height = height
        })
      }, delay) //delay for waiting navigator's animation
    }
  
    _onTouchStart = (e, gestureState) => {
      if (this._touchDown || !this.state.sortable) {
        return
      }
      let { pageX, pageY, } = e.nativeEvent
      if (!this._responderTimer && !this._currentStartCell && !this._currentDraggingComponent && !this._isRemoving && !this._isAdding) {
        this._touchDown = true
        let { delay, } = touchStart
        this._responderTimer = this.setTimeout(() => {
          let draggingCell = this._getTouchCell({
            x: pageX - this._pageLeft,
            y: pageY - this._pageTop,
          })
          if (draggingCell == null) {
            return
          }
          this._currentStartCell = draggingCell
          this._currentDraggingComponent = this._currentStartCell.component
          draggingCell.component.setCoordinate({
            x: pageX - this._pageLeft - this._columnWidth / 2,
            y: pageY - this._pageTop - this._rowHeight / 2,
          })
          draggingCell.component.setZIndex(999)
          draggingCell.component.startScaleAnimation({
            scaleValue: cellScale.value,
          })
        }, 0)
      }
    }
  
    _onTouchMove = (e, gestureState) => {
      if (!this._touchDown || !this.state.sortable || !this._currentStartCell || !this._currentDraggingComponent) {
        return
      }
      let { pageX, pageY, } = e.nativeEvent
      this._currentDraggingComponent.setCoordinate({
        x: pageX - this._pageLeft - this._columnWidth / 2,
        y: pageY - this._pageTop - this._rowHeight / 2,
      })
      let fixed_x = Math.min(this._width - 5, Math.max(5, pageX - this._pageLeft));
      let fixed_y = Math.min(this._height - 5, Math.max(5, pageY - this._pageTop));
      let hoverCell = this._getTouchCell({
        x: fixed_x,
        y: fixed_y,
      })
  
      if (hoverCell == null || hoverCell == this._currentStartCell) {
        return
      }
      let currentCellIndex = this._currentStartCell.index
      let hoverCellIndex = hoverCell.index
  
      let { columnCount, } = this.props
      let cellsAnimationOptions = Utils.getCellsAnimationOptions({
        currentCellIndex,
        hoverCellIndex,
        columnCount,
        cells: this._cells,
      })
      this._sortCells({
        cellsAnimationOptions,
      })
  
      this._cells[hoverCellIndex].component = this._currentDraggingComponent
      this._currentStartCell = hoverCell
    }
  
    _onTouchEnd = (e, gestureState) => {
      this._touchDown = false
  
      this.clearTimeout(this._responderTimer)
      this._responderTimer = null
  
      if (this._touchEnding || !this.state.sortable || !this._currentStartCell || !this._currentDraggingComponent) {
        return
      }
  
      this._touchEnding = true
  
  
      let animationType = cellAnimationTypes.backToOrigin
      let cellIndex = this._currentStartCell.index
  
      let cell = this._cells[cellIndex]
      let coordinate = cell.coordinate
      this._currentDraggingComponent.startScaleAnimation({
        scaleValue: 1,
      })
      this._currentDraggingComponent.startTranslationAnimation({
        animationType,
        coordinate,
        callback: () => {
          if (!this._currentDraggingComponent) {
            return
          }
          this._currentDraggingComponent.setZIndex(0)
          this._sortDataSource()
          this._currentStartCell = null
          this._currentDraggingComponent = null
          this._touchEnding = false
          this.props.onEndDrag();
        },
      })
    }
  
    _getTouchCell = (touchCoordinate) => {
      let rowHeight = this._rowHeight
      let columnWidth = this._columnWidth
      for (let cell of this._cells) {
        if (Utils.isPointInPath({
          touchCoordinate,
          cellCoordinate: cell.coordinate,
          cellWidth: columnWidth,
          cellHeight: rowHeight,
        })) {
          return cell
        }
      }
      return null
    }
  
    _sortCells = ({ cellsAnimationOptions, callback, }) => {
      let { rightTranslation, leftBottomTranslation, } = cellAnimationTypes
      let animationParallels = callback && []
  
      for (let cellAnimationOption of cellsAnimationOptions) {
  
        let { cellComponent, cellIndex, animationType, } = cellAnimationOption
        let changedIndex = (animationType == rightTranslation
          || animationType == leftBottomTranslation) ? 1 : -1
  
  
        this._cells[cellIndex + changedIndex].component = cellComponent
        let cell = this._cells[cellIndex]
        let coordinate = cell.coordinate
        if (!callback) {
          cellComponent.startTranslationAnimation({
            animationType,
            coordinate,
          })
        }
        else {
          let animation = cellComponent.getTranslationAnimation({
            animationType,
            coordinate,
          })
          animationParallels.push(animation)
        }
  
      }
  
      callback && Animated.parallel(animationParallels).start(() => {
        callback && callback()
      })
    }
  
    addCell = ({ data, callback, }) => {
      if (this._touchEnding) {
        return
      }
      let oldDataSourceLength = this.state.dataSource.length
      let cellChangeType = cellChangeTypes.add
      this._updateContainerHeight({
        oldDataSourceLength,
        cellChangeType,
        callback: () => {
          let dataSource = [...this.state.dataSource]
          dataSource.push(data)
          this.setState({
            dataSource,
          })
        }
      })
    }
  
    removeCell = ({ cellIndex, callback, }) => {
      if (this._touchEnding || this._isRemoving) {
        return
      }
      this._isRemoving = true
      let { columnCount, } = this.props
      let currentCellIndex = cellIndex
      let hoverCellIndex = this._cells.length - 1
      let component = this._cells[currentCellIndex].component
      let animationCallBack = () => {
        let oldDataSourceLength = this.state.dataSource.length
        let cellChangeType = cellChangeTypes.remove
        this._updateContainerHeight({
          oldDataSourceLength,
          cellChangeType,
        })
        let removedData = this._removeData(cellIndex)
        this._isRemoving = false
        callback && callback(removedData)
      }
      if (currentCellIndex < this._cells.length - 1) {
        component.startScaleAnimation({
          scaleValue: 0,
        })
        let cellsAnimationOptions = Utils.getCellsAnimationOptions({
          currentCellIndex,
          hoverCellIndex,
          columnCount,
          cells: this._cells,
        })
        this._sortCells({
          cellsAnimationOptions,
          callback: animationCallBack,
        })
      }
      else {  //removing last cell do not need to sort cell
  
        component.startScaleAnimation({
          scaleValue: 0,
          callback: animationCallBack,
        })
      }
    }
  
    _updateContainerHeight = ({ oldDataSourceLength, cellChangeType, callback, }) => {
      let newDataSourceLength = oldDataSourceLength + (cellChangeType == cellChangeTypes.add ? 1 : -1)
      if (cellChangeType == cellChangeTypes.remove && (oldDataSourceLength == 0 || newDataSourceLength == 0)) {
        return
      }
      let { columnCount, } = this.props
      let cellIndex = oldDataSourceLength - 1
      let oldMaxRowNumber = Utils.getRowNumber({
        cellIndex,
        columnCount,
      })
      cellIndex = newDataSourceLength - 1
      let newMaxRowNumber = Utils.getRowNumber({
        cellIndex,
        columnCount,
      })
      if (oldMaxRowNumber == newMaxRowNumber) {
        callback && callback()
        return
      }
      let height = (Math.floor((newDataSourceLength - 1) / columnCount) + 1) * this._rowHeight
      if (this._animationInstace) {
        this._animationInstace.stop()
        this._animationInstace = null
      }
      this._animationInstace = Animated.timing(
        this.state.containerHeight,
        {
          toValue: height,
          duration: containerHeight.animationDuration,
        }
      ).start(() => {
        this._animationInstace = null
        callback && callback()
      })
    }
  
    _sortDataSource = () => {
      let dataSource = []
      let indexAdd = []
      for (let cell of this._cells) {
        let orginalIndex = cell.component.props.index
        if (this.state.dataSource[orginalIndex].title != '') {
          dataSource.push(this.state.dataSource[orginalIndex])
        } else {
          indexAdd.push(this.state.dataSource[orginalIndex])
        }
      }
      this.setState({
        dataSource: [],
      })
  
      this.setState({
        dataSource: [...dataSource, ...indexAdd],
      })
      if (this.props.onResort) {
        this.props.onResort(dataSource)
      }
    }
  
    _removeData = (cellIndex) => {
      //remove data from dataSource
      let dataSource = [...this.state.dataSource]
      let removedDataList = dataSource.splice(cellIndex, 1)
      this.setState({
        dataSource,
      })
      return removedDataList
    }
  
    getSortedDataSource = () => {
      return this.state.dataSource
    }
  }
  export default TimerEnhance(SortableSudokuGrid)