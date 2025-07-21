import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Switch,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import textileDataJSON from '../textile_form_data.json'; // Adjust path as needed
import axios from 'axios';

// Type Definitions
type Language = 'English' | 'Hindi' | 'Marathi';

interface FormOption {
    category: string;
    subCategory: string;
    keyTask: string;
}

interface FormData {
    category: string;
    subCategory: string;
    keyTask: string;
}

type TextileData = Record<Language, FormOption[]>;

// Cast imported JSON with proper types
const textileData = textileDataJSON as TextileData;

const languages: Language[] = ['English', 'Hindi', 'Marathi'];

export default function TextileForm() {
    const [language, setLanguage] = useState<Language>('English');
    const [useAltOptions, setUseAltOptions] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        category: '',
        subCategory: '',
        keyTask: '',
    });
    const [options, setOptions] = useState<FormOption[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        setOptions(textileData[language]);
        setFormData({ category: '', subCategory: '', keyTask: '' });
    }, [language, useAltOptions]);

    const isValid = (): boolean =>
        Object.values(formData).every((value) => value.trim() !== '');

    const handleChange = (field: keyof FormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (): Promise<void> => {
        if (!isValid()) {
            Alert.alert('Incomplete', 'Please fill all fields.');
            return;
        }

        setIsSubmitting(true);
        setCanSubmit(false);

        try {
            const res = await axios.post('https://your-api.com/submit', formData); // Replace with your endpoint
            Alert.alert('Success', 'Data submitted successfully!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Submission failed.');
        } finally {
            setTimeout(() => setCanSubmit(true), 5000);
            setIsSubmitting(false);
        }
    };

    const filteredCategories = Array.from(new Set(options.map((o) => o.category)));
    const filteredSubCategories = Array.from(new Set(options.map((o) => o.subCategory)));
    const filteredKeyTasks = Array.from(new Set(options.map((o) => o.keyTask)));

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Select Language</Text>
            <Picker selectedValue={language} onValueChange={(val) => setLanguage(val as Language)}>
                {languages.map((lang) => (
                    <Picker.Item label={lang} value={lang} key={lang} />
                ))}
            </Picker>

            <View style={styles.switchRow}>
                <Text style={styles.label}>Change Options</Text>
                <Switch value={useAltOptions} onValueChange={setUseAltOptions} />
            </View>

            <Text style={styles.label}>Category</Text>
            <Picker
                selectedValue={formData.category}
                onValueChange={(val) => handleChange('category', val)}
            >
                <Picker.Item label="Select..." value="" />
                {filteredCategories.map((val, i) => (
                    <Picker.Item label={val} value={val} key={`cat-${i}`} />
                ))}
            </Picker>

            <Text style={styles.label}>Sub-Category</Text>
            <Picker
                selectedValue={formData.subCategory}
                onValueChange={(val) => handleChange('subCategory', val)}
            >
                <Picker.Item label="Select..." value="" />
                {filteredSubCategories.map((val, i) => (
                    <Picker.Item label={val} value={val} key={`sub-${i}`} />
                ))}
            </Picker>

            <Text style={styles.label}>Key Task</Text>
            <Picker
                selectedValue={formData.keyTask}
                onValueChange={(val) => handleChange('keyTask', val)}
            >
                <Picker.Item label="Select..." value="" />
                {filteredKeyTasks.map((val, i) => (
                    <Picker.Item label={val} value={val} key={`task-${i}`} />
                ))}
            </Picker>

            {isSubmitting ? (
                <ActivityIndicator size="large" color="#ff9900" />
            ) : (
                <Button
                    title="Submit"
                    onPress={handleSubmit}
                    disabled={!isValid() || !canSubmit}
                    color="#0066cc"
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: 300,
        height: 170,
        backgroundColor: '#f1f4f9',
        flexGrow: 1,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
});
