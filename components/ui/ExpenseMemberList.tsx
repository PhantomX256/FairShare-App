import { View, Text } from "react-native";
import React from "react";
import { User } from "@/lib/firebase/groupService";

interface ExpenseMemberListProps {
  members: User[];
}

const ExpenseMemberList = ({ members }: ExpenseMemberListProps) => {
  return (
    <View>
      <Text>ExpenseMemberList</Text>
    </View>
  );
};

export default ExpenseMemberList;
