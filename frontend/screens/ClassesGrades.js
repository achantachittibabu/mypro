import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ClassesGrades = ({ navigation }) => {
  const [selected, setSelected] = useState('classes');

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button
          icon="table"
          mode={selected === 'classes' ? 'contained' : 'outlined'}
          onPress={() => setSelected('classes')}
          style={styles.switchButton}
        >
          Classes
        </Button>
        <Button
          icon="star"
          mode={selected === 'grades' ? 'contained' : 'outlined'}
          onPress={() => setSelected('grades')}
          style={styles.switchButton}
        >
          Grades
        </Button>
      </View>
      <View style={styles.content}>
        {selected === 'classes' ? (
          <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('ClassScreen')}>
            <Icon name="table" size={40} color="#607D8B" />
            <Text style={styles.linkText}>Go to Classes Table</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('GradeListScreen')}>
            <Icon name="star" size={40} color="#607D8B" />
            <Text style={styles.linkText}>Go to Grades Table</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  switchButton: { marginHorizontal: 8 },
  content: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  linkCard: { alignItems: 'center', padding: 32, backgroundColor: '#f5f5f5', borderRadius: 12, elevation: 2 },
  linkText: { marginTop: 12, fontSize: 18, color: '#607D8B', fontWeight: 'bold' },
});

export default ClassesGrades;
