import React, { Component } from 'react';
import {Select,Progress} from 'antd';
import './App.css';


var App =React.createClass({

    getInitialState(){


    return {
        type:0,
        picstatus:'none',
        loading:0,
        pos:[]
        };
    },

    changeType:function(value){
        this.setState({
            type:value

        });
        this.timeout();
    },

    timeout:function () {
        if(this.state.loading<100){
            this.setState({
                loading:++this.state.loading
            })
            setTimeout(this.timeout,1);
        }else{
            this.setState({
                picstatus:'block'
            })
        }
    },
    componentWillMount:function () {
      for(var i=1;i<11;i++){
          var temp ='././'+i+'.jpg';
          this.state.pos.push(temp);
      }
    },


    render:function() {
        return(
            <div className="App">
                <h1>DG-Demo</h1>
                <NavButton changeType={this.changeType}/>
                <PicShow show={this.state.picstatus} loading={this.state.loading} pos={this.state.pos}/>
            </div>
        )
    }
})


class PicShow extends Component {



    render(){
        let saveImg =this.props.pos.map(function (element, index) {
            return(
                <img src={require(element)} alt="test" key={index}/>
            )
        })


        return(
            <div className="pic-zone">
            <div className="pic-back" style={{display:this.props.show}}>
                {saveImg}
            </div>

            <div className="loading" style={{display:(this.props.show == 'none'?'block':'none')}}>
                <div>
                    <Progress percent={this.props.loading} status="active" />
                </div>
            </div>

            </div>
        )
    }
}


class NavButton extends Component {

    handleChange=(value)=> {
    //console.log(`selected ${value}`);
    this.props.changeType(value);
}

    render() {
        const Option = Select.Option;

        return(
           <div className="nav-back">
               <Select
                   showSearch
                   style={{ width:'100%' }}
                   placeholder="Select a type"
                   optionFilterProp="children"
                   onChange={this.handleChange}
                   filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
               >
                   <Option value="1">type one 1</Option>
                   <Option value="2">type two 2</Option>
                   <Option value="3">type three 3</Option>
               </Select>
           </div>
        )
    }
}



export default App;