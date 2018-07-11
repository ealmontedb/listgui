import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
//5124002935 defaul
state = {
      data: [],
      states: [],
      status:[],
      statusSelected:[],
      cid:[{
          st: 'TX',
          phone: '832408563',
          checked:false
      },{
          st: 'IL',
          phone: '8477963046',
          checked:false
      },{
          st: 'GA',
          phone: '6782767865',
          checked:false
      }       
      ],
      lang: [
        {
          default:'ENGLISH',
          checked:false
        },
        {
          default:'SPANISH',
          checked:false
        }
        ]
    };

componentDidMount() {
  const promise1=fetch('http://localhost:4000/',
                    {mode: 'cors',
                     headers: {      
                       'content-type': 'application/json'
                     }
                    })
                      .then(response => response.json())
                      .then(data => data/*this.setState({ data })*/);
  
 const promise2=fetch('http://localhost:4000/initialState',
                    {mode: 'cors',
                     method: 'post',
                     headers: {      
                       'content-type': 'application/json'
                     }
                    })
                      .then(response => response.json())
                      .then(data=> data/*this.setState({initialState:data})*/);

  Promise.all([promise1,promise2]).then(values=>{
            //    const dataIni=[];
                 this.setState({states:values[1].states})
                 this.setState(prevState=>({
                 cid: prevState.cid.map(v=>{
                      console.log(v.phone,values[1].cid)
                      if(v.phone===values[1].cid){
                         console.log(" si cid",v.phone,values[1].cid)
                        return ({
                                  st: v.st,
                                  phone: v.phone,        
                                  checked:true
                                })
                      }
                      return v

                  })

         }))
         return   values[0].map(x=>{

                   
                  if(values[1].states.includes(x.state)){
                    
                  // console.log(x.state,values[1].states,"si")
                   return ({
                        state: x.state,
                        count: x.count,
                        checked: true
                    })
                    
                  
                  }else{
                  return ({
                        state: x.state,
                        count: x.count,
                        checked: false
                    })


                  }
              
              
            })

 

  }).then(data=>this.setState({ data }) )
  
}


updateFilter=(e)=>{
   let v=e.target.value;
   let name=e.target.name;
   function updateStatus(){
          fetch('http://localhost:4000/submitStatus',{
              mode: 'cors',
              method: 'post',
              headers: {      
                'content-type': 'application/json'
              },
              body: JSON.stringify(this.state.statusSelected)
          })
                .then(response => response.text())
                .then(status =>console.log(status));

   }
   if (name==='states'){       
            if(e.target.checked){

            this.setState((prevState)=>({
            
            states: [...prevState.states,v]
            }))
            }else{
            
            this.setState((prevState)=>{  
            return {states: prevState.states.filter(x=>x!==v)}
            }) 
            }
   }else{
         if(e.target.checked){

            this.setState((prevState)=>({
            
            statusSelected: [...prevState.statusSelected,v]
            }))
            }else{
            
            this.setState((prevState)=>{  
            return {statusSelected: prevState.statusSelected.filter(x=>x!==v)}
            })      
            }

            setTimeout(updateStatus.bind(this), 1000);
   }         
  //alert(e);
//console.log(this.state.states)
}

submitHandler=(e)=>{

  fetch('http://localhost:4000/submit',{
    mode: 'cors',
    method: 'post',
    headers: {      
      'content-type': 'application/json'
    },
    body: JSON.stringify(this.state.states)
})
      .then(response => response.json())
      .then(status =>this.setState({status}));

}

updateCid=(e)=>{
  let v=e.target.value;
 
  fetch('http://localhost:4000/updateCid',{
    mode: 'cors',
    method: 'post',
    headers: {      
      'content-type': 'application/json'
    },
    body: JSON.stringify({phone: v})
})
      .then(response => response.text())
      .then(test =>{
        this.setState((prevState)=>({
            cid:   this.state.cid.map(ar=>{
                   console.log("el cid",v,ar.phone)
                  if(v===ar.phone){                   
              
                   return ({
                        st: ar.st,
                        phone: ar.phone,
                        checked: true
                    })
                    
                  
                  }else{
                  return ({
                        st: ar.st,
                        phone: ar.phone,
                        checked: false
                  })
                }
            })

        }))
        console.log (test)
      });


}

updateLang=(e)=>{
  let v=e.target.value;
 
  fetch('http://localhost:4000/updateLang',{
    mode: 'cors',
    method: 'post',
    headers: {      
      'content-type': 'application/json'
    },
    body: JSON.stringify({lang: v})
})
      .then(response => response.text())
      .then(test =>{
        this.setState((prevState)=>({
            lang:   this.state.lang.map(ar=>{
                   console.log("el lang",v,ar.default)
                  if(v===ar.default){                   
              
                   return ({                                
                      default: ar.default,
                      checked:true                    
                     })
                    
                  
                  }else{
                  return ({
                      default: ar.default,
                      checked:false  
                  })
                }
            })

        }))
        console.log (test)
      });


}

  render() {
    return (
      <div className="App">
          {/*console.log("esto",this.getValues().then(r=>console.log(r)))*/}
          <h1>FRIMEMSP</h1>
           <ul><li><b>State</b>->Total</li></ul>
           <ol>                   
           {this.state.data.map(             
             d=> <li key={d.state}>
                    <b>{d.state}</b> -> {d.count} 
           <input type="checkbox" name="states" value={d.state} onChange={this.updateFilter} defaultChecked={d.checked}></input>
                    
                 </li>

           )
          }    
                 
          <button onClick={this.submitHandler}>submit</button>  
          </ol>
          <div className="cid">
           {this.state.cid.map(             
             d=> <li key={d.phone}>
                     <input type="radio" name="cid" value={d.phone} onChange={this.updateCid} checked={d.checked}></input>
                     <b>{d.st}</b> - {d.phone}                    
                 </li>

           )
          }
         </div>
         <div className="status">
           
          {this.state.status.map( (s,id)=><li key={id}>
           <b>{s.status}</b> -> {s.count} 
          <input type="checkbox" name="status" value={s.status} onChange={this.updateFilter} /*defaultChecked={d.checked}*/></input>
            
          
          
          </li>
              
           )}
         </div>
          <div className="lang">
           {this.state.lang.map(             
             d=> <li key={d.default}>
           <input type="radio" name="lang" value={d.default} onChange={this.updateLang} checked={d.checked}></input>
                     <b>{d.default}</b>                    
                 </li>

           )
          }
         </div>
          <ul>
           {this.state.states.map( 
             
             (s,id)=><li key={id}>
           
                    {s}
                    </li>
              
           )}
          </ul>
          
      </div>
    );
  }
}

export default App;
