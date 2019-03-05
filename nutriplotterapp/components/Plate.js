import React, { Component } from 'react'
import { 
	Text, 
	ScrollView, 
	TouchableOpacity, 
	StyleSheet, 
	View, 
	TextInput, 
	ImageBackground, 
	Alert,
	UIManager,
	findNodeHandle
} from 'react-native'


import { WebBrowser, SQLite } from 'expo';
import Pie from 'react-native-pie';

import Food from './Food';
import styles from '../themes/plateStyle';

const db = SQLite.openDatabase('db.db');


export default class Plate extends Component {
   state = {
	  foods: [], // Of Food Component
	  pieSeries: [],
	  pieColours: [],
	  empty: true,
	  refresh: 0,
   }
   
   drawPie = () =>{
	   console.log("DRAWING PIE CHART");
	   let drawPieKeys = {};
	   let drawPieColours = [];
	   let plate = global.plate;
	   for(let i = 0; i < plate.length; i++){
		   let group = plate[i].group;
		   if(group in drawPieKeys){
			   drawPieKeys[group] += plate[i].amount;
		   }else{
			   drawPieKeys[group] = plate[i].amount;
			   drawPieColours.push(global.colours[group]);
		   }
	   }
	   let drawPieSeries = [];
	   for(let pieGroup in drawPieKeys){
		   console.log(pieGroup);
		   drawPieSeries.push(drawPieKeys[pieGroup]);
	   }
	   console.log("PieChart Series: " + drawPieSeries + " -- Colours: " + drawPieColours);
	   return {series: drawPieSeries, colours: drawPieColours};
   }
   
   onPlateClick = () => {
	   console.log("Plate Clicked");
	    var dbQuery = 'select name, amount from plate;';
		//alert(item.name);
		// Promises are for error handling operations, particularly asynchronous I/O operations:
		// 	- we promise to return a valid answer or deal with it.
		var promise = new Promise(function (resolve, reject) {
			db.transaction(function (transaction) {
				transaction.executeSql(dbQuery, [], function (transaction, result) {
					resolve(JSON.stringify(result)); // here the returned Promise is resolved
				}, nullHandler, errorHandler);
			});
		});
		
		function nullHandler(result){
			console.log("Database promise evoked nullHandler on account of a null error!");
			console.log("Null Log : " + JSON.stringify(result));
		}

		function errorHandler(error){
			console.log("Database promise evoked errorHandler on account of an error occurring!");
			console.log("Error Log : " + error);
		}
		
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	  
		// Nothing went wrong so we proceed with the result.
		promise.then((results) => {
			var dbOut = JSON.parse(results);
			var length = dbOut.rows.length;
			var allFoods = "";
			for (i = 0; i < length; i++) { 
			  allFoods = allFoods + (i+1) + ". " + capitalizeFirstLetter(dbOut.rows._array[i].name) + "\n";
			} 
			if(length == 0){
				//alert("Your plate is empty! Add some by searching below.");
			}else{
				//alert(allFoods);
			}
		});
   };




   render() {
	  let pieData = this.drawPie();
      return (
	  <View style={styles.viewContainer}>
	    <View style={styles.plate} onLayout={(event) => {
			var dimension = event.nativeEvent.layout;  
			this.state.dimensions = {
			  x: dimension.x,
			  y: dimension.y,
			  width: dimension.width,
			  height: dimension.height,
			  center: {
				  x: dimension.x + Math.floor(dimension.width / 2), 
				  y: dimension.y + Math.floor(dimension.height / 2)
			  },
			  radius: Math.floor(dimension.width / 2)
			}
		}}>
		<ImageBackground 
			alignContent={'center'}
			style={StyleSheet.create({zIndex: 0})} 
			source={require('../assets/images/plate.png')}>
			<Pie
		 	 // Make the pie chart a ring around the plate which fills up based on the foods present
			  radius={105} innerRadius={81} on
			  left={25}
          	series={pieData["series"]}
         	 //values to show and color sequentially
		  	colors={pieData["colours"]}
			
			style={StyleSheet.create({zIndex: 1})}/>
		</ImageBackground>
		
		</View>
		
	  </View>
      )
   }

   
   // For each food in the plate's state, add its component render JSX to
   // an array, return the array for rendering by the plate.
   renderFoodFromState(){
	var foodRender = [];

	for (const food of this.state.foods) {
		foodRender.push(food.render());
		console.log(food);
	}
	return foodRender;
   }



   	

   // Give the % of the pie chart as a given nutrition score, which dynamically updates to reflect
   // what's on the plate.
   renderPieSeries = function(){
	   return [this.state.nutritionScore];
   }
   
   clearFoodState() {
	   this.state.foods = [];
	   this.state.empty = true;
   }

   // Get the names of all food items on the plate
   getFoodNames() {
	   console.log("Getting food names");
	   if (this.state.empty) {
		   return "The plate is empty.";
	   } else {
		   //console.log(this.state.foods);
		   var s = "[";
		   for (i = 0; i < this.state.foods.length; i++) {
		      s += this.state.foods[i].state.name + ",";
		   }
		   s += "]";
		   return s;
	   }
   }
   
    deleteItem = searchString => {
		var dbQuery = 'select name from foods;';
		var promise = new Promise(function (resolve, reject) {
			db.transaction(function (transaction) {
				transaction.executeSql(dbQuery, [], function (transaction, result) {
					resolve(JSON.stringify(result)); // here the returned Promise is resolved
				}, nullHandler, errorHandler);
			});
		});
		
		function nullHandler(result){
			console.log("Null Log : " + JSON.stringify(result));
		}

		function errorHandler(error){
			console.log("Error Log : " + error);
		}
		
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	  
		promise.then((results) => {
		    //code runs after field deleted
	  });
	}
}