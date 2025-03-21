import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useMemo } from "react";
import Loader from "../shared/Loader";
import Entypo from "@expo/vector-icons/Entypo";

interface User {
  id: string;
  fullName: string;
}

interface Guest {
  id: string;
  fullName: string;
}

interface Member {
  id: string;
  displayName: string;
  type: "user" | "guest";
}

interface MemberListProps {
  users: User[];
  guests: Guest[];
  isLoading?: boolean;
  onRemoveUser?: (id: string) => void;
  onRemoveGuest?: (id: string) => void;
}

const MemberList = ({
  users = [],
  guests = [],
  isLoading = false,
  onRemoveUser,
  onRemoveGuest,
}: MemberListProps) => {
  const members = useMemo(() => {
    const combinedMembers = [
      ...users.map((user) => ({
        id: user.id,
        displayName: user.fullName,
        type: "user" as const,
      })),
      ...guests.map((guest) => ({
        id: guest.id,
        displayName: guest.fullName,
        type: "guest" as const,
      })),
    ];

    return combinedMembers;
  }, [users, guests]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader height={40} color="#42224A" />
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.text, { color: "rgba(0, 0, 0, 0.2)" }]}>
          No members added
        </Text>
      </View>
    );
  }

  const handleRemoveMember = (member: Member) => {
    if (member.type === "user" && onRemoveUser) {
      onRemoveUser(member.id);
    } else if (member.type === "guest" && onRemoveGuest) {
      onRemoveGuest(member.id);
    }
  };

  const renderMemberItem = ({ item: member }: { item: Member }) => (
    <View style={styles.memberItem}>
      <View style={styles.leftSection}>
        <View
          style={[
            styles.photoContainer,
            member.type === "guest" ? styles.guestPhotoContainer : {},
          ]}
        >
          <Text style={styles.photoPlaceholder}>
            {member.displayName?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.memberName}>{member.displayName}</Text>
          <Text style={styles.memberType}>
            {member.type === "guest" ? "Guest" : "User"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveMember(member)}
        style={styles.removeButton}
      >
        <Entypo name="cross" size={26} color="rgba(255, 0, 0, 0.5)" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingVertical: 10,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  photoContainer: {
    height: 40,
    width: 40,
    backgroundColor: "#42224A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  guestPhotoContainer: {
    backgroundColor: "#5D4E8C", // Different color for guests
  },
  photoPlaceholder: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    color: "white",
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
  },
  memberType: {
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    color: "#666",
  },
  removeButton: {
    padding: 8,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
});

export default MemberList;
