import React, { useState } from 'react';
import { Platform, StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EventForm } from '../../../shared/components/EventForm';

// Mock data for testing
const eventTypes = [
  { key: 'pain-start', emoji: '⚡', label: 'Pain Start' },
  { key: 'meal', emoji: '🍎', label: 'Food' },
  { key: 'treatment', emoji: '🩹', label: 'Treatment' }
];

const painLocations = [
  { key: 'abdomen', label: 'Abdomen' },
  { key: 'lower-back', label: 'Lower Back' }
];

const allergens = [
  { key: 'dairy', label: 'Dairy' },
  { key: 'gluten', label: 'Gluten' }
];

const supplements = [
  { key: 'vitamin-d', label: 'Vitamin D' }
];

const treatments = [
  { key: 'heating-pad', label: 'Heating Pad' }
];

const treatmentEffectiveness = [
  { key: 'helpful', emoji: '✅', label: 'Helpful' },
  { key: 'not-helpful', emoji: '❌', label: 'Not Helpful' }
];

export default function HomeScreen() {
  const [form, setForm] = useState({
    type: '',
    details: '',
    timestamp: new Date().toISOString().slice(0, 16),
    painLevel: 0,
    painLocations: [],
    allergens: [],
    supplements: [],
    treatments: [],
    effectiveness: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (field, key) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(key)
        ? prev[field].filter(item => item !== key)
        : [...prev[field], key]
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // Handle form submission here
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Endo Tracker Mobile</ThemedText>
      </ThemedView>
            <EventForm
        form={form}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
        eventTypes={eventTypes}
        painLocations={painLocations}
        allergens={allergens}
        supplements={supplements}
        treatments={treatments}
        treatmentEffectiveness={treatmentEffectiveness}
        onSubmit={onSubmit}
        timezone="America/New_York"
      />
    </ScrollView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
});
