// App.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { yorubaAlphabet } from './src/data/alphabetData';
import { AlphabetItem } from './src/types';

const { width } = Dimensions.get('window');

export default function App() {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(yorubaAlphabet[0]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound(audioFile: any) {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
    setSound(newSound);
    await newSound.playAsync();
  }

  const handleSelectLetter = (item: AlphabetItem) => {
    setSelectedLetter(item);
    playSound(item.audio);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Aláfábẹ́ẹ̀tì Yorùbá</Text>

      {/* GRID SECTION */}
      <View style={styles.gridContainer}>
        <FlatList
          data={yorubaAlphabet}
          numColumns={5}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.letterTile, 
                selectedLetter.id === item.id && styles.selectedTile
              ]} 
              onPress={() => handleSelectLetter(item)}
            >
              <Text style={styles.tileText}>{item.letter}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* FLASHCARD SECTION */}
      <View style={styles.card}>
        <Text style={styles.bigLetter}>{selectedLetter.letter}</Text>
        <Image source={selectedLetter.image} style={styles.wordImage} />
        <Text style={styles.yorubaWord}>{selectedLetter.word}</Text>
        <Text style={styles.englishTranslation}>({selectedLetter.translation})</Text>

        <TouchableOpacity style={styles.audioButton} onPress={() => playSound(selectedLetter.audio)}>
          <Text style={styles.audioButtonText}>🔊 Láfohùn (Speak)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', alignItems: 'center', paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
  gridContainer: { height: '40%', width: width * 0.95, marginBottom: 15 },
  letterTile: {
    flex: 1,
    margin: 4,
    backgroundColor: '#FF9F43',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  selectedTile: { backgroundColor: '#10AC84', borderWidth: 2, borderColor: '#FFF' },
  tileText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  card: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bigLetter: { fontSize: 55, fontWeight: 'bold', color: '#10AC84' },
  wordImage: { width: 130, height: 130, resizeMode: 'contain', marginVertical: 8 },
  yorubaWord: { fontSize: 30, fontWeight: 'bold', color: '#2D3436' },
  englishTranslation: { fontSize: 18, color: '#636E72', fontStyle: 'italic', marginBottom: 12 },
  audioButton: { backgroundColor: '#FF9F43', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 30 },
  audioButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
