import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string; // Mekah atau Madinah
}

export default function SurahListScreen() {
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSurahList = async () => {
    try {
      const res = await fetch('https://equran.id/api/v2/surat');
      const json = await res.json();
      if (json.data) {
        setSurahList(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch surah list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurahList();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );  
  }

  const renderItem = ({ item }: { item: Surah }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { backgroundColor: '#D1FAE5' },
      ]}
    onPress={() =>
  router.push({
    pathname: '/(tabs)/equran',
    params: { nomor: item.nomor.toString() },
  })
}

    >
      <View style={styles.left}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{item.nomor}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <Text style={styles.surahName}>{item.namaLatin}</Text>
        <Text style={styles.surahInfo}>
          {item.jumlahAyat} ayat • {item.tempatTurun === 'mekah' ? 'Mekkah' : 'Madinah'}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.arabicName}>{item.nama}</Text>
        <ArrowRight size={20} color="#10B981" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Surah</Text>
      </View>
      <FlatList
        data={surahList}
        keyExtractor={(item) => item.nomor.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  left: {
    marginRight: 16,
  },
  numberCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  surahInfo: {
    marginTop: 2,
    color: '#6B7280',
    fontSize: 14,
  },
  right: {
    alignItems: 'flex-end',
  },
  arabicName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
});
