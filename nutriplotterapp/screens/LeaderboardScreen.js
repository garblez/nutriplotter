import * as React from "react";
import { Constants, WebBrowser } from "expo";
import {
  Linking,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button
} from "react-native";
import { MonoText } from "../components/StyledText";
import getStyleSheet from "../themes/style";

export default class LeaderboardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "How to Play",
    headerLeft: (
      <Button
        title="My Profile"
        onPress={() => {
          navigation.navigate("Login");
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }
  toggleTheme() {
    this.setState({ darkTheme: !this.state.darkTheme });
  }

  render() {
    const styles = getStyleSheet(this.state.darkTheme);
    return (
      <ScrollView>
        <Text style={styles.defaultText}>
          The aim of the game is to build a balanced meal. The plus button
          allows you to look for foods to add and touching the plate allows you
          to edit amounts or remove foods from the plate.
        </Text>

        <Text style={styles.defaultText}>
          When you have finished your meal press the tick button to submit and
          see how you have done.
        </Text>

        <Text style={styles.defaultText}>
          If you are struggling read up on balanced diets here:
        </Text>

        <TouchableOpacity onPress={this._handleOpenWithWebBrowser}>
          <Text style={styles.buttonText}>Balanced Meal Reading</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync(
      "https://www.choosemyplate.gov/ten-tips-build-healthy-meal"
    );
  };
}
