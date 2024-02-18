import React from 'react';
import {Text, TouchableOpacity} from "react-native";

type Props = {

}
const TouchableComp = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('TouchableComp pressed');
      }}
    >
      <Text>TouchableComp</Text>
    </TouchableOpacity>
  );
}

export default TouchableComp;