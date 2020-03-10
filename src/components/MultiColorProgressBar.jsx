import React, {Component} from 'react';
import {AliasWorkflowTeamType,ColorCodeWorkFlowTaskStateType } from '../constants/WorkflowEnums';
class MultiColorProgressBar extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
  
        const parent = this.props;
  
        let bars = parent.readings && parent.readings.length!=0 && parent.readings.map(function(item, i) {
            var itemName= AliasWorkflowTeamType[item.TeamId]  ;
            var itemColor=ColorCodeWorkFlowTaskStateType[item.WorkflowTaskStateTypeId];
            var fontsize=itemName.length > 8  ? '11.5px' : 'small';
            return (
                    <React.Fragment key={i}>
                    <div className="bar" style={{'backgroundColor':itemColor, 'width':'11.11%'}} >
                    <center style={{'marginTop':'-10px'}}>
                        <p style={{'marginLeft':'20%','fontSize':fontsize}}>{itemName}</p>
                        </center>
                  </div>
                </React.Fragment>


                )
        }, this)
  
      
  
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


