import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type ProfileQuestion = {
  id: string;
  emoji: string;
  question: string;
  purpose: string;
  options: string[];
  answer?: string | string[];
  multiSelect: boolean;
  maxSelections?: number;
};

const profileQuestions: ProfileQuestion[] = [
  {
    id: '1',
    emoji: '👤',
    question: 'What is your name? ',
    purpose: 'People will see this name on your profile.',
    options: [],
    multiSelect: false,
    maxSelections: 1,
  },
  {
    id: '2',
    emoji: '👤',
    question: 'What is your age? ',
    purpose: 'People will see this age on your profile.',
    options: [],
    multiSelect: false,
    maxSelections: 1,
  },
  {
    id: '3',
    emoji: '🔑',
    question: 'What are you looking for?',
    purpose: 'Establish intent compatibility.',
    options: ['Long-term relationship', 'Marriage', 'Casual dating', 'Friendship', 'Not sure yet'],
    multiSelect: true,
    maxSelections: 2,
  },
  {
    id: '4',
    emoji: '🧠',
    question: 'What are your core values?',
    purpose: 'Match based on life philosophy and beliefs.',
    options: ['Faith/spirituality', 'Family', 'Ambition', 'Kindness', 'Integrity', 'Humor', 'Independence', 'Creativity', 'Adventure', 'Simplicity'],
    multiSelect: true,
    maxSelections: 3,
  },
  {
    id: '5',
    emoji: '🗓️',
    question: 'What does a typical weekend look like for you?',
    purpose: 'Gauge lifestyle and activity compatibility.',
    options: ['Outdoors/adventure', 'Gym/fitness', 'Netflix & relax', 'Social gatherings', 'Church/faith-based events', 'Creative projects', 'Travel'],
    multiSelect: true,
    maxSelections: 3,
  },
  {
    id: '6',
    emoji: '💼',
    question: 'What best describes your current lifestyle?',
    purpose: 'Helps match by work-life balance and stability.',
    options: ['Career-focused', 'Student', 'Entrepreneur', 'Stay-at-home', 'Balanced lifestyle', 'In transition'],
    multiSelect: true,
    maxSelections: 2,
  },
  {
    id: '7',
    emoji: '✝️',
    question: 'Do your faith or spiritual beliefs play a role in your life?',
    purpose: 'Crucial for value-aligned matching.',
    options: ['Very important', 'Somewhat important', 'Not important', 'Prefer not to say'],
    multiSelect: true,
    maxSelections: 1,
  },
  {
    id: '8',
    emoji: '👪',
    question: 'Do you want kids (or more kids) someday?',
    purpose: 'Align future life goals.',
    options: ['Yes', 'No', 'Maybe', 'Already have kids'],
    multiSelect: true,
    maxSelections: 2,
  },
  {
    id: '9',
    emoji: '🌍',
    question: 'Are you open to relocating for love?',
    purpose: 'Prevent geographic dealbreakers.',
    options: ['Yes', 'Maybe', 'No'],
    multiSelect: true,
    maxSelections: 1,
  },
  {
    id: '10',
    emoji: '🤝',
    question: 'What are three things non-negotiable in a partner?',
    purpose: 'Allows AI to use user-defined dealbreakers in matching.',
    options: [],
    multiSelect: false,
  },
];

export default function AIProfileCreationScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [inputText, setInputText] = useState('');
  const [nonNegotiables, setNonNegotiables] = useState<string[]>([]);
  const [currentNonNegotiable, setCurrentNonNegotiable] = useState('');

  const currentQuestion = profileQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === profileQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswer = (answer: string) => {
    if (currentQuestion.multiSelect) {
      setAnswers(prev => {
        const currentAnswers = (prev[currentQuestion.id] as string[]) || [];
        const maxSelections = currentQuestion.maxSelections || 1;
        
        if (currentAnswers.includes(answer)) {
          // Remove the answer if already selected
          return {
            ...prev,
            [currentQuestion.id]: currentAnswers.filter(a => a !== answer)
          };
        } else if (currentAnswers.length < maxSelections) {
          // Add the answer if under max selections
          return {
            ...prev,
            [currentQuestion.id]: [...currentAnswers, answer]
          };
        }
        return prev;
      });
    } else {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));
      if (currentQuestionIndex < profileQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (isFirstQuestion && inputText.trim()) {
      // Save name and move to next question
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: inputText.trim()
      }));
      setInputText('');
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (isLastQuestion && nonNegotiables.length > 0) {
      // Save non-negotiables and submit
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: nonNegotiables
      }));
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleNonNegotiableAdd = () => {
    if (currentNonNegotiable.trim() && nonNegotiables.length < 3) {
      setNonNegotiables(prev => [...prev, currentNonNegotiable.trim()]);
      setCurrentNonNegotiable('');
    }
  };

  const removeNonNegotiable = (index: number) => {
    setNonNegotiables(prev => prev.filter((_, i) => i !== index));
  };

  const isOptionSelected = (option: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Here we'll handle generating the profile with AI
    console.log('Generating profile with answers:', answers);
    // TODO: Add AI profile generation logic
    AsyncStorage.setItem('onboarding-complete', 'true');
    AsyncStorage.setItem('profile-data', JSON.stringify(answers));
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={["#f8fafc", "#e0e7ef", "#c7d2fe"]} style={styles.gradientBg}>
      <SafeAreaView style={styles.safeArea}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <IconSymbol
              size={24}
              name="chevron.left"
              color="#6366f1"
            />
          </TouchableOpacity>
        )}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <ThemedText style={styles.progressText}>
              {currentQuestionIndex + 1} of {profileQuestions.length}
            </ThemedText>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestionIndex + 1) / profileQuestions.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.questionContainer}>
            <View style={styles.emojiContainer}>
              <ThemedText style={styles.emoji}>{currentQuestion.emoji}</ThemedText>
            </View>
            <ThemedText style={styles.question}>{currentQuestion.question}</ThemedText>
            <ThemedText style={styles.purpose}>{currentQuestion.purpose}</ThemedText>

            {currentQuestion.options.length > 0 ? (
              <>
                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        isOptionSelected(option) && styles.selectedOption,
                      ]}
                      onPress={() => handleAnswer(option)}
                    >
                      <ThemedText style={[
                        styles.optionText,
                        isOptionSelected(option) && styles.selectedOptionText,
                      ]}>
                        {option}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.nextButton]}
                  onPress={handleNext}
                >
                  <ThemedText style={styles.nextButtonText}>
                    {isLastQuestion ? "Generate Your Profile" : "Next"}
                  </ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {isLastQuestion ? (
                  <View style={styles.nonNegotiablesContainer}>
                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.input}
                        value={currentNonNegotiable}
                        onChangeText={setCurrentNonNegotiable}
                        placeholder="Enter a non-negotiable..."
                        placeholderTextColor="#808080"
                        onSubmitEditing={handleNonNegotiableAdd}
                        returnKeyType="done"
                      />
                      <TouchableOpacity 
                        style={[styles.addButton, nonNegotiables.length >= 3 && styles.disabledButton]}
                        onPress={handleNonNegotiableAdd}
                        disabled={nonNegotiables.length >= 3}
                      >
                        <IconSymbol
                          size={24}
                          name="plus.circle.fill"
                          color={nonNegotiables.length >= 3 ? "#999" : "#6366f1"}
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.nonNegotiablesList}>
                      {nonNegotiables.map((item, index) => (
                        <View key={index} style={styles.nonNegotiableItem}>
                          <ThemedText style={styles.nonNegotiableText}>{item}</ThemedText>
                          <TouchableOpacity 
                            onPress={() => removeNonNegotiable(index)}
                            style={styles.removeButton}
                          >
                            <IconSymbol
                              size={20}
                              name="xmark.circle.fill"
                              color="#ff4d4f"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    
                    {nonNegotiables.length > 0 && (
                      <TouchableOpacity
                        style={[styles.navigationButton, styles.nextButton]}
                        onPress={handleNext}
                      >
                        <ThemedText style={styles.nextButtonText}>
                          Generate Your Profile
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={inputText}
                        keyboardType={currentQuestion.id === '2' ? "numeric" : "default"}
                        textContentType={currentQuestion.id === '1' ? "name" : undefined}
                        onChangeText={setInputText}
                        placeholder={currentQuestion.id === '2' ? "Enter your age..." : "Type your name..."}
                        placeholderTextColor="#808080"
                        returnKeyType="done"
                        onSubmitEditing={handleNext}
                        maxLength={currentQuestion.id === '2' ? 2 : undefined}
                      />
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.navigationButton,
                        styles.nextButton,
                        (!inputText.trim() || (currentQuestion.id === '2' && (parseInt(inputText) < 18 || parseInt(inputText) > 99))) && styles.disabledButton
                      ]}
                      onPress={handleNext}
                      disabled={!inputText.trim() || (currentQuestion.id === '2' && (parseInt(inputText) < 18 || parseInt(inputText) > 99))}
                    >
                      <ThemedText style={styles.nextButtonText}>
                        Next
                      </ThemedText>
                    </TouchableOpacity>
                    {currentQuestion.id === '2' && inputText && (parseInt(inputText) < 18 || parseInt(inputText) > 99) && (
                      <ThemedText style={styles.errorText}>
                        Please enter an age between 18 and 99
                      </ThemedText>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  backButton: {
    padding: 8,
    marginLeft: 12,
    marginBottom: 5,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e7ef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  questionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 56,
    lineHeight: 80,
    textAlign: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  purpose: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  selectionHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    maxHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navigationButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#6366f1',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  addButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nonNegotiablesContainer: {
    width: '100%',
  },
  nonNegotiablesList: {
    gap: 8,
    marginBottom: 20,
  },
  nonNegotiableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nonNegotiableText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
    color: 'black',
  },
  removeButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
