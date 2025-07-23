import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '페이지를 찾을 수 없습니다!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>이 화면은 존재하지 않습니다.</Text>
        <Link href="/" style={styles.link}>
          <Text>홈 화면으로 이동</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});