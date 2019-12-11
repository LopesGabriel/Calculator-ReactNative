import React from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, TouchableHighlight, Dimensions, StatusBar, Alert } from 'react-native'
import Button from './src/components/Button'
import Display from './src/components/Display'

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0,
  tela: 1,
  txtFeedBack: "",
}

export default class App extends React.Component{
  state = { ...initialState }

  mensagemFeedback = "";

  addDigit = n =>{
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay

    if(n === '.' && !clearDisplay && this.state.displayValue.includes('.')) return;

    const currentValue = clearDisplay ? '' : this.state.displayValue
    const displayValue = currentValue + n
    this.setState({ displayValue, clearDisplay: false})

    if(n !== '.'){
      const newValue = parseFloat(displayValue)
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({ values })
    }
  }

  clearMemory = () => {
    this.setState({ ...initialState })
  }

  setOperation = operation => {
    if(this.state.current === 0){
      this.setState({ operation, current:1, clearDisplay: true})
    } else{
      const equals = operation === '='
      const values = [...this.state.values]
      try{
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`)
      } catch(e){
        values[0] = this.state.values[0]
      }

      values[1] = 0
      this.setState({
        displayValue: `${values[0]}`,
        operation: equals ? null : operation,
        current: equals ? 0 : 1,
        clearDisplay: !equals,
        values,
      })
    }
  }

  showCreditos = () =>{
    Alert.alert('Ajuda', 'Selecione a opção desejada.', [
      {text: 'Relatar bug', onPress: () => this.setState({tela: 2})},
      {text: 'Fechar'}
    ])
  }

  relatarBug = (bug) =>{
    fetch('http://149.56.170.143/Calculator/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mensagem: bug,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) =>{
      const data = new Date(responseJson.dtFeedback);
      Alert.alert('FeedBack enviado', 'Obrigado por enviar o seu feed back!',[
        {text: 'Fechar', onPress: () => this.setState({tela: 1})}
      ]);
    })
    .catch((error) =>{
      console.log(error);
    })
  }

  updateInput(txt){
    this.setState({txtFeedBack: txt});
    this.mensagemFeedback = txt;
  }

  render(){
    if (this.state.tela == 1){
      return(
        <View style={styles.container}>
          <Display value={this.state.displayValue} />
          <View style={styles.buttons}>
            <Button label='AC' double onClick={this.clearMemory} />
            <Button label='?' creditos onClick={this.showCreditos} />
            <Button label='/' operation onClick={() => this.setOperation('/')} />
            <Button label='7' onClick={() => this.addDigit(7)} />
            <Button label='8' onClick={() => this.addDigit(8)} />
            <Button label='9' onClick={() => this.addDigit(9)} />
            <Button label='*' operation onClick={() => this.setOperation('*')} />
            <Button label='4' onClick={() => this.addDigit(4)} />
            <Button label='5' onClick={() => this.addDigit(5)} />
            <Button label='6' onClick={() => this.addDigit(6)} />
            <Button label='-' operation onClick={() => this.setOperation('-')} />
            <Button label='1' onClick={() => this.addDigit(1)} />
            <Button label='2' onClick={() => this.addDigit(2)} />
            <Button label='3' onClick={() => this.addDigit(3)} />
            <Button label='+' operation onClick={() => this.setOperation('+')} />
            <Button label='0' double onClick={() => this.addDigit(0)} />
            <Button label='.' onClick={() => this.addDigit('.')} />
            <Button label='=' operation onClick={() => this.setOperation('=')} />
          </View>
        </View>
      );
    }
    else{
      return(
        <View style={styles.feedbackContainer}>
          <Text style={{color: 'white', textAlign: 'center', marginBottom: 30, fontSize: 20}}>Insira a mensagem de FeedBack</Text>
          <TextInput value={this.state.txtFeedBack} style={styles.input} onChangeText={(txt) => this.updateInput(txt) } 
            multiline={true} numberOfLines={5} placeholder="Insira sua mensagem." />
          <TouchableHighlight style={styles.btnEnviar} onPress={() => this.relatarBug(this.mensagemFeedback)}>
            <Text style={styles.txtBtn}>Enviar FeedBack</Text>
          </TouchableHighlight>
        </View>
      )
    }
    
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  feedbackContainer:{
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#405880",
  },
  buttons:{
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input:{
    fontSize: 15,
    padding: 10,
    borderColor: "#273857",
    backgroundColor: 'white',
    width: Dimensions.get('window').width / 1.5,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 30,
  },
  btnEnviar:{
    backgroundColor: "#4efc89",
    borderColor: "#23fa6c",
    borderWidth: 3,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 8,
  },
  txtBtn:{
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
})