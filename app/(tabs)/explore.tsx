import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

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
    emoji: '🔑',
    question: 'What are you looking for?',
    purpose: 'Establish intent compatibility.',
    options: ['Long-term relationship', 'Marriage', 'Casual dating', 'Friendship', 'Not sure yet'],
    multiSelect: true,
    maxSelections: 2,
  },
  {
    id: '2',
    emoji: '🧠',
    question: 'What are your core values?',
    purpose: 'Match based on life philosophy and beliefs.',
    options: ['Faith/spirituality', 'Family', 'Ambition', 'Kindness', 'Integrity', 'Humor', 'Independence', 'Creativity', 'Adventure', 'Simplicity'],
    multiSelect: true,
    maxSelections: 3,
  },
  {
    id: '3',
    emoji: '🗓️',
    question: 'What does a typical weekend look like for you?',
    purpose: 'Gauge lifestyle and activity compatibility.',
    options: ['Outdoors/adventure', 'Gym/fitness', 'Netflix & relax', 'Social gatherings', 'Church/faith-based events', 'Creative projects', 'Travel'],
    multiSelect: true,
    maxSelections: 3,
  },
  {
    id: '4',
    emoji: '💼',
    question: 'What best describes your current lifestyle?',
    purpose: 'Helps match by work-life balance and stability.',
    options: ['Career-focused', 'Student', 'Entrepreneur', 'Stay-at-home', 'Balanced lifestyle', 'In transition'],
    multiSelect: true,
    maxSelections: 2,
  },
  {
    id: '5',
    emoji: '✝️',
    question: 'Do your faith or spiritual beliefs play a role in your life?',
    purpose: 'Crucial for value-aligned matching.',
    options: ['Very important', 'Somewhat important', 'Not important', 'Prefer not to say'],
    multiSelect: false,
  },
  {
    id: '6',
    emoji: '👪',
    question: 'Do you want kids (or more kids) someday?',
    purpose: 'Align future life goals.',
    options: ['Yes', 'No', 'Maybe', 'Already have kids'],
    multiSelect: true,
    maxSelections: 2,
  },
  {
    id: '7',
    emoji: '🌍',
    question: 'Are you open to relocating for love?',
    purpose: 'Prevent geographic dealbreakers.',
    options: ['Yes', 'Maybe', 'No'],
    multiSelect: false,
  },
  {
    id: '8',
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

  const currentQuestion = profileQuestions[currentQuestionIndex];

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
    if (currentQuestionIndex < profileQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleCustomAnswer = () => {
    if (!inputText.trim()) return;
    handleAnswer(inputText);
    setInputText('');
  };

  const isOptionSelected = (option: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };

  return (
    <LinearGradient colors={["#f8fafc", "#e0e7ef", "#c7d2fe"]} style={styles.gradientBg}>
      <View style={styles.safeArea}>
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
            
            {currentQuestion.multiSelect && (
              <ThemedText style={styles.selectionHint}>
                Select up to {currentQuestion.maxSelections} options
              </ThemedText>
            )}

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
                {currentQuestion.multiSelect && (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                  >
                    <ThemedText style={styles.nextButtonText}>Next</ThemedText>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your answer..."
                  placeholderTextColor="#808080"
                  multiline
                />
                <TouchableOpacity onPress={handleCustomAnswer} style={styles.sendButton}>
                  <IconSymbol
                    size={24}
                    name="arrow.up.circle.fill"
                    color="#6366f1"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 60, // Adjust for iPhone notch
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  nextButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
