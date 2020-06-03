import React, { Component } from "react";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API, graphqlOperation, Storage  } from 'aws-amplify';


const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

class App extends Component {
  todoMutation = async () => {
    const todoDetails = {
      name: "Party tonight!",
      description: "Amplify CLI rocks!"
    };

    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  };

  listQuery = async () => {
    console.log("listing todos");
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    const MutationResult = document.getElementById('MutationResult');
    //MutationResult.innerHTML = JSON.stringify(allTodos);
    MutationResult.innerHTML = "List:";
    allTodos.data.listTodos.items.map((todo, i) => 
      MutationResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
    );
    

   // for (var i in listTodos)
  //  alert(JSON.stringify(allTodos));
  };

  render() {
    return (
      <div className="App">
        <AmplifySignOut />
        <p> Click a button </p>
        <button onClick={this.listQuery}>GraphQL List Query</button>
        <button onClick={this.todoMutation}>GraphQL Todo Mutation</button>
        <div id="MutationResult"></div>
        
        
        <h2>S3 Upload example...</h2>
        
        <input
          type="file"
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
          ref={ref => (this.upload = ref)}
          onChange={e =>
            this.setState({
              imageFile: this.upload.files[0],
              imageName: this.upload.files[0].name
            })
          }
        />
        
        <input value={this.state.imageName} placeholder="Select file" />
        
        <button
          onClick={e => {
            this.upload.value = null;
            this.upload.click();
          }}
          loading={this.state.uploading}
        >
        
          Browse
          
        </button>

        <button onClick={this.uploadImage}> Upload File </button>
        <button onClick={this.listBucket}>ListBucket</button>

        {!!this.state.response && <div>{this.state.response}</div>}
        
        <div id="BucketResult"></div>
     
        
      </div>
      
      
    );
  }
  
//Storage

  state = {
    imageName: "",
    imageFile: "",
    response: ""
  };
  
   uploadImage = () => {
   // SetS3Config("my-test-bucket-amplify", "protected");
    Storage.put(`userimages/${this.upload.files[0].name}`,
                this.upload.files[0],
                { contentType: this.upload.files[0].type })
      .then(result => {
        this.upload = null;
        this.setState({ response: "Success uploading file!" });
      })
      .catch(err => {
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
  };
  
 getKeys = function(res){
  return Object.keys(res.data[0]);
 };
 
 
 getBucketHeader = function(res){
    var keys = this.getKeys(res);
    alert('ere');
    return keys.map((key, index)=>{
    return <th key={key}>{key.toUpperCase()}</th>
    })
 };
 
 getRowsData = function(res){
   var items = res.data;
   var keys = this.getKeys();
   return items.map((row, index)=>{
   return <tr key={index}><td> key={index} data={row} keys={keys}/></td></tr>
   })
 };
  
  listBucket = () => {

    Storage.list('userimages')
      .then(result => {
        //alert(JSON.stringify(result));
        let count
        const BucketResult = document.getElementById('BucketResult');
        BucketResult.innerHTML = "List:";
        
        for (count =0; count < result.length; count++){
          let foo = result[count]['key'];
          Storage.get(foo)
            .then( bar =>
            {
                BucketResult.innerHTML += `<p><a href=${bar} target=new>${foo}</a></p>`
            })
          
        }
        
       
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  };
  
/* getBucketHeader = () => {
      var keys = this.getKeys();
      return keys.map((key, index)=>{
      return <th key={key}>{key.toUpperCase()}</th>
  };*/
}


/*function App() {
  return (
    <div>
      <AmplifySignOut />
      My App
    </div>
  );
}*/

export default withAuthenticator(App, true);