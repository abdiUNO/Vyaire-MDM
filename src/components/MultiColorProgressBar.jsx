import React, {Component} from 'react';
import {AliasWorkflowTeamType,ColorCodeWorkFlowTaskStateType } from '../constants/WorkflowEnums';
class MultiColorProgressBar extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
  
        const parent = this.props;
  
        let values = parent.readings && parent.readings.length!=0 && parent.readings.map(function(item, i) {
            if(item.value > 0) {
                return (
                    <div className="value" style={{'color': item.color, 'width': item.value + '%'}}  key={i}>
                        <span>{item.value}%</span>
                    </div>
                )
            }
        }, this);
  
        let calibrations = parent.readings && parent.readings.length!=0 && parent.readings.map(function(item, i) {
            if(item.value > 0) {
                return (
                    <div className="graduation" style={{'color': item.color, 'width': item.value + '%'}}  key={i}>
                        <span>|</span>
                    </div>
                )
            }
        }, this);
  
        let bars = parent.readings && parent.readings.length!=0 && parent.readings.map(function(item, i) {
            var itemName= AliasWorkflowTeamType[item.TeamId]  ;
            var itemColor=ColorCodeWorkFlowTaskStateType[item.WorkflowTaskStateTypeId];
            var fontsize=itemName.length > 8  ? '11.5px' : 'small';
            return (
                    <>
                    <div className="bar" style={{'backgroundColor':itemColor, 'width':'11.11%'}}  key={i}>
                    <center style={{'marginTop':'-10px'}}>
                        <p style={{'marginLeft':'20%','fontSize':fontsize}}>{itemName}</p>
                        </center>
                  </div>
                </>


                )
        }, this)
  
        let legends = parent.readings && parent.readings.length && parent.readings.map(function(item, i) {
              if(item.value > 0) {
                return (
                    <div className="legend" key={i}>
                        <span className="dot" style={{'color': item.color}}>●</span>
                        <span className="label">{item.name}</span>
                    </div>
             )
         }
      }, this);
  
      return (
        <div className="multicolor-bar">
           {/* <div className="values">
                {values == ''?'':values}
            </div>
            <div className="scale">
                {calibrations == ''?'':calibrations}
            </div>*/}
            <div className="bars">
                {bars == ''?'':bars}
            </div>
            {/*<div className="legends">
                {legends == ''?'':legends}
        </div>*/}
        </div>
      );
    }
  }
  
  export default MultiColorProgressBar;


