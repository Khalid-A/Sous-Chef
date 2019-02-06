import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';



class MakeRecipe extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        currentIngredient: '',
        ingredients: [],
        currentStep: '',
        steps: [],
      };
      this.addIngredient = this.addIngredient.bind(this);
      this.listIngredients = this.listIngredients.bind(this);
      this.addStep = this.addStep.bind(this);
      this.listSteps = this.listSteps.bind(this);
      this.addNewRecipe = this.addNewRecipe.bind(this);
  }
  static navigationOptions = {
      header: null,
      headerVisible: false,
  }
  addIngredient(){
    if(this.state.currentIngredient === ''){
      return;
    }
    this.setState({
      ingredients: [...this.state.ingredients, this.state.currentIngredient],
      currentIngredient: '',
    });
  }
  addStep(){
    if(this.state.currentStep === ''){
      return;
    }
    this.setState({
      steps: [...this.state.steps, this.state.currentStep],
      currentStep: '',
    });
  }
  listSteps(){
    return this.state.steps.map((step, index) => {
      return <Text>{index+1}.  {step}</Text>
    });
  }
  listIngredients(){
    return this.state.ingredients.map((ingredient) => {
      return <Text>{ingredient}</Text>
    });
  }
  addNewRecipe(){
    if(this.state.title == null){
      //Give user an error message
      return;
    }
    if(this.state.servings == null){
      return;
    }
    if(this.state.timeHour == null){
      return;
    }
    if(this.state.ingredients.length < 1){
      return;
    }
    if(this.state.ingredients.steps < 1){
      return;
    }
    const newRecipe = this.state;

  }
  render() {
      return (
          <ScrollView>
          <View style={styles.container}>
              <Text style={styles.title}>Recipe Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({title: text})}
                value={this.state.title}
              />
              <Text style={styles.title}>Serving Size:</Text>
              <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({servings: text})}
                  value={this.state.servings}
              />
              <Text style={styles.title}>Cook Time (Hours):</Text>
              <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({timeHour: text})}
                  value={this.state.timeHour}
              />
            <Text style={styles.title}>Cook Time (Minutes):</Text>
              <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({timeMinute:text})}
                  value={this.state.timeMinute}
              />
            <Text style={styles.title}>Ingredients:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({currentIngredient: text})}
                    value={this.state.currentIngredient}
                />
                <Button onPress={this.addIngredient} title="Add Ingredient"></Button>
                {this.listIngredients()}
              <Text style={styles.title}>Instructions:</Text>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.multilineInput}
                onChangeText={(text) => this.setState({currentStep: text})}
                value={this.state.currentStep}
                ></TextInput>
              <Button onPress={this.addStep} title="Add Step"></Button>
              {this.listSteps()}
              <Button onPress={this.addNewRecipe} title="Add New Recipe"></Button>
          </View>
          </ScrollView>
      );
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: 40,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
    input: {
      height: 30,
      width: Dimensions.get('window').width - 20,
      borderColor: 'gray',
      borderWidth: 1,
    },
    multilineInput: {
      height: 60,
      width: Dimensions.get('window').width - 20,
      borderColor: 'gray',
      borderWidth: 1,
    },
    logo: {
        height: 120,
        marginBottom: 16,
        marginTop: 64,
        padding: 10,
        width: 135,
    },
    title: {
        fontSize: 20,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    modules: {
        margin: 20,
    },
    modulesHeader: {
        fontSize: 16,
        marginBottom: 8,
    },
    module: {
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    }
});

const mapStateToProps = state => {
  return {

  };
}

const mapDispatchToProps = dispatch => {
  return {
    addRecipe: (recipe) => {
      dispatch(addRecipe(recipe));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeRecipe);
